<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth.php';

    $user = authenticate();
    $userId = $user['UserID'];

    $data = json_decode(file_get_contents("php://input"), true);
    $notificationId = $data['notification_id'] ?? 0;

    if (!$notificationId) {
        echo json_encode([
            "success" => false,
            "message" => "Thiếu notification_id"
        ]);
        exit;
    }

    $checkQuery = "SELECT NotificationID FROM Notifications WHERE NotificationID = ? AND UserID = ?";
    $stmt = mysqli_prepare($conn, $checkQuery);
    mysqli_stmt_bind_param($stmt, "ii", $notificationId, $userId);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);

    if (mysqli_stmt_num_rows($stmt) === 0) {
        echo json_encode([
            "success" => false,
            "message" => "Thông báo không tồn tại hoặc không thuộc về người dùng"
        ]);
        exit;
    }

    $deleteQuery = "DELETE FROM Notifications WHERE NotificationID = ? AND UserID = ?";
    $stmt = mysqli_prepare($conn, $deleteQuery);
    mysqli_stmt_bind_param($stmt, "ii", $notificationId, $userId);
    
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode([
            "success" => true,
            "message" => "Xóa thông báo thành công"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Lỗi khi xóa thông báo"
        ]);
    }
?>
