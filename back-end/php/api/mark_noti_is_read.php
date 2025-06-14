<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth.php';

    $user = authenticate();
    $userId = $user['UserID'];

    $data = json_decode(file_get_contents("php://input"), true);
    $notificationId = $data['notification_id'] ?? null;

    if (!$notificationId) {
        echo json_encode([
            "success" => false,
            "message" => "Thiếu mã thông báo (notification_id)"
        ]);
        exit;
    }

    $query = "
        UPDATE Notifications
        SET IsRead = 1
        WHERE NotificationID = ? AND UserID = ?
    ";

    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "ii", $notificationId, $userId);
    $success = mysqli_stmt_execute($stmt);

    echo json_encode([
        "success" => $success,
        "message" => $success ? "Đã cập nhật trạng thái đã đọc" : "Không thể cập nhật"
    ]);
?>
