<?php
    include __DIR__ . '/../connect.php';

    $data = json_decode(file_get_contents('php://input'), true);

    $inputUser = $data['user'] ?? '';    //username hoặc email
    $password  = $data['password'] ?? '';

    //check input
    if (!$inputUser || !$password) {
        echo json_encode([
            "success" => false,
            "message" => "Vui lòng nhập username/email và password"
        ]);
        exit;
    }

    //truy vấn
    $query = "SELECT * FROM Users WHERE FullName = ? OR Email = ? LIMIT 1";

    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "ss", $inputUser, $inputUser);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    //response
    if ($user = mysqli_fetch_assoc($result)) {
        if (password_verify($password, $user['password'])) {
            unset($user['password']); //unset password

            // Tạo Access Token và Refresh Token
            $accessToken = bin2hex(random_bytes(32));    // 64 ký tự
            $refreshToken = bin2hex(random_bytes(32));

            // Thiết lập thời gian hết hạn
            $accessTokenExpiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));     // Access Token hết hạn sau 1 giờ
            $refreshTokenExpiresAt = date('Y-m-d H:i:s', strtotime('+30 days'));   // Refresh Token hết hạn sau 30 ngày

            // Lấy thông tin thiết bị
            $deviceInfo = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';

            // Lưu token vào bảng UserTokens
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
                "data" => $user
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Mật khẩu không đúng"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Không tìm thấy tài khoản"
        ]);
    }
?>
