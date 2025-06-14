<?php
    include __DIR__ . '/connect.php';

    function authenticateAdmin($requiredRole = 2) {
        $headers = getallheaders();

        if (!isset($headers['Authorization'])) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Missing token"]);
            exit;
        }

        if (!preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Invalid Authorization format"]);
            exit;
        }

        $accessToken = $matches[1];

        global $conn;
        $query = "SELECT Users.* FROM UserTokens 
                JOIN Users ON UserTokens.UserID = Users.UserID
                WHERE AccessToken = ? 
                    AND IsRevoked = 0 
                    AND AccessTokenExpiresAt > NOW()
                LIMIT 1";

        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "s", $accessToken);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $user = mysqli_fetch_assoc($result);

        if (!$user || $user['RoleID'] < $requiredRole) {
            http_response_code(403);
            echo json_encode(["success" => false, "message" => "Bạn không có quyền truy cập"]);
            exit;
        }

        return $user;
    }
?>