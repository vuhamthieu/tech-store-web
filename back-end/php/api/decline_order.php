<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth_admin.php';

    $admin = authenticateAdmin();

    $data = json_decode(file_get_contents('php://input'), true);
    $orderId = intval($data['order_id'] ?? 0);
    $reason = trim($data['reason'] ?? 'Không có lý do cụ thể');

    if (!$orderId) {
        echo json_encode([
            "success" => false,
            "message" => "Thiếu mã đơn hàng"
        ]);
        exit;
    }

    // Get order details to find the user
    $stmt = $conn->prepare("SELECT UserID, TotalAmount FROM Orders WHERE OrderID = ?");
    $stmt->bind_param("i", $orderId);
    $stmt->execute();
    $result = $stmt->get_result();
    $order = $result->fetch_assoc();

    if (!$order) {
        echo json_encode([
            "success" => false,
            "message" => "Đơn hàng không tồn tại"
        ]);
        exit;
    }

    $userId = $order['UserID'];
    $totalAmount = $order['TotalAmount'];

    // Update order status to declined (Status = 2)
    $updateStmt = $conn->prepare("UPDATE Orders SET Status = 2 WHERE OrderID = ?");
    $updateStmt->bind_param("i", $orderId);

    if ($updateStmt->execute()) {
        // Send notification to user
        $notificationTitle = "Đơn hàng bị từ chối";
        $notificationMessage = "Đơn hàng #$orderId của bạn đã bị hủy. Lý do: $reason. Tổng tiền: ₫" . number_format($totalAmount, 0, ',', '.');
        
        $notifStmt = $conn->prepare("INSERT INTO Notifications (UserID, Title, Content) VALUES (?, ?, ?)");
        $notifStmt->bind_param("iss", $userId, $notificationTitle, $notificationMessage);
        $notifStmt->execute();

        echo json_encode([
            "success" => true,
            "message" => "Đã từ chối đơn hàng thành công"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Lỗi khi từ chối đơn hàng"
        ]);
    }
?>
