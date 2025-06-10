<?php
    header('Content-Type: application/json');
    include __DIR__ . '/connect.php';

    $data = json_decode(file_get_contents('php://input'), true);
    $refreshToken = $data['refresh_token'] ?? '';

    if (!$refreshToken) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Refresh token không được cung cấp"
        ]);
        exit;
    }

    // Tìm token hợp lệ trong bảng
    $query = "SELECT * FROM UserTokens 
            WHERE RefreshToken = ? 
                AND IsRevoked = 0 
                AND RefreshTokenExpiresAt > NOW()
            LIMIT 1";

    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "s", $refreshToken);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $tokenData = mysqli_fetch_assoc($result);

    if (!$tokenData) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Refresh token không hợp lệ hoặc đã hết hạn"
        ]);
        exit;
    }

    // Tạo access token mới
    $newAccessToken = bin2hex(random_bytes(32));
    $accessTokenExpiresAt = date('Y-m-d H:i:s', strtotime('+15 minutes'));

    // Cập nhật access token trong DB
    $updateQuery = "UPDATE UserTokens 
                    SET AccessToken = ?, AccessTokenExpiresAt = ? 
                    WHERE TokenID = ?";

    $stmt = mysqli_prepare($conn, $updateQuery);
    mysqli_stmt_bind_param($stmt, "ssi", $newAccessToken, $accessTokenExpiresAt, $tokenData['TokenID']);
    $success = mysqli_stmt_execute($stmt);

    if ($success) {
        echo json_encode([
            "success" => true,
            "message" => "Access token mới đã được tạo",
            "access_token" => $newAccessToken
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Lỗi khi tạo access token mới"
        ]);
    }
?>
