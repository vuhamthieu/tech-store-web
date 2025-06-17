<?php
    include __DIR__ . '/connect.php';

    function authenticate() {
        $headers = getallheaders();

        if (!isset($headers['Authorization'])) {
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "message" => "Access token không được cung cấp"
            ]);
            exit;
        }

        $authHeader = $headers['Authorization'];

        if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "message" => "Định dạng Authorization không hợp lệ"
            ]);
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

        if (!$user) {
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "message" => "Token không hợp lệ hoặc đã hết hạn"
            ]);
            exit;
        }

        return $user;
    }
?>
