<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth_admin.php';

    $admin = authenticateAdmin();

    $data = json_decode(file_get_contents('php://input'), true);
    $userId = $data['user_id'] ?? 0;

    if (!$userId) {
        echo json_encode([
            "success" => false,
            "message" => "Thiếu thông tin user_id"
        ]);
        exit;
    }

    if ($userId == $admin['UserID']) {
        echo json_encode([
            "success" => false,
            "message" => "Bạn không thể vô hiệu hóa chính mình"
        ]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE Users SET IsDisabled = 1 WHERE UserID = ?");
    $stmt->bind_param("i", $userId);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Đã vô hiệu hóa tài khoản thành công"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Lỗi khi vô hiệu hóa tài khoản"
        ]);
    }
?>
