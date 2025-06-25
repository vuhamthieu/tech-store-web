<?php
    // Add CORS headers
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");
    
    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    include __DIR__ . '/../connect.php';

    $data = json_decode(file_get_contents('php://input'), true);

    $inputUser = $data['user'] ?? '';    // phone hoặc email
    $password  = $data['password'] ?? '';

    if (!$inputUser || !$password) {
        echo json_encode([
            "success" => false,
            "message" => "Vui lòng nhập username/email và password"
        ]);
        exit;
    }

    $isEmail = filter_var($inputUser, FILTER_VALIDATE_EMAIL);
    $loginBy = $isEmail ? 'email' : 'phone';

    $query = "SELECT * FROM Users WHERE (Phone = ? OR Email = ?) AND IsDisabled = 0 LIMIT 1";

    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "ss", $inputUser, $inputUser);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($user = mysqli_fetch_assoc($result)) {
        if (password_verify($password, $user['Password'])) {
            unset($user['Password']);

            // Tạo Access Token và Refresh Token
            $accessToken = bin2hex(random_bytes(32));  
            $refreshToken = bin2hex(random_bytes(32));

            date_default_timezone_set('Asia/Ho_Chi_Minh');
            $accessTokenExpiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));
            $refreshTokenExpiresAt = date('Y-m-d H:i:s', strtotime('+30 days'));

            $deviceInfo = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';

            $insertToken = "INSERT INTO UserTokens (UserID, AccessToken, RefreshToken, AccessTokenExpiresAt, RefreshTokenExpiresAt, DeviceInfo)
                            VALUES (?, ?, ?, ?, ?, ?)";
            $stmtToken = mysqli_prepare($conn, $insertToken);
            mysqli_stmt_bind_param(
                $stmtToken,
                "isssss",
                $user['UserID'],
                $accessToken,
                $refreshToken,
                $accessTokenExpiresAt,
                $refreshTokenExpiresAt,
                $deviceInfo
            );
            mysqli_stmt_execute($stmtToken);

            echo json_encode([
                "success" => true,
                "message" => "Đăng nhập thành công",
                "access_token" => $accessToken,
                "refresh_token" => $refreshToken,
                "access_token_expires_at" => $accessTokenExpiresAt,
                "refresh_token_expires_at" => $refreshTokenExpiresAt,
                "login_by" => $loginBy,
                "data" => $user
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Mật khẩu không đúng"
            ]);
        }
    } else {
        // Check if user exists but is disabled
        $checkDisabledQuery = "SELECT UserID FROM Users WHERE (Phone = ? OR Email = ?) AND IsDisabled = 1 LIMIT 1";
        $stmtDisabled = mysqli_prepare($conn, $checkDisabledQuery);
        mysqli_stmt_bind_param($stmtDisabled, "ss", $inputUser, $inputUser);
        mysqli_stmt_execute($stmtDisabled);
        $disabledResult = mysqli_stmt_get_result($stmtDisabled);
        
        if (mysqli_fetch_assoc($disabledResult)) {
            echo json_encode([
                "success" => false,
                "message" => "Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ admin."
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Không tìm thấy tài khoản"
            ]);
        }
    }
?>
