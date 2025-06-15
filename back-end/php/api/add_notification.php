<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth_admin.php';

    $admin = authenticateAdmin();

    $data = json_decode(file_get_contents('php://input'), true);
    $title = trim($data['title'] ?? '');
    $message = trim($data['message'] ?? '');
    $userId = intval($data['user_id'] ?? 0);

    if (!$title || !$message || !$userId) {
        echo json_encode([
            "success" => false,
            "message" => "Vui lòng nhập đầy đủ tiêu đề, nội dung và người nhận"
        ]);
        exit;
    }

    // Thêm thông báo vào bảng
    $stmt = $conn->prepare("INSERT INTO Notifications (UserID, Title, Message) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $userId, $title, $message);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Gửi thông báo thành công"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Lỗi khi gửi thông báo"
        ]);
    }
?>
