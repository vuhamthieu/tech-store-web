<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth.php';

    $user = authenticate();
    $userId = $user['UserID'];

    $headers = getallheaders();
    if (!isset($headers['Authorization']) || 
        !preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Access token không hợp lệ"
        ]);
        exit;
    }

    $accessToken = $matches[1];

    // Thu hồi token trong database
    $query = "UPDATE UserTokens SET IsRevoked = 1 WHERE AccessToken = ? AND UserID = ?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "si", $accessToken, $userId);
    $success = mysqli_stmt_execute($stmt);

    if ($success) {
        echo json_encode([
            "success" => true,
            "message" => "Đăng xuất thành công"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Đăng xuất thất bại"
        ]);
    }
?>
