<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth_admin.php';

    $admin = authenticateAdmin();

    $data = json_decode(file_get_contents("php://input"), true);
    $orderId = intval($data['order_id'] ?? 0);

    if (!$orderId) {
        echo json_encode([
            "success" => false,
            "message" => "Thiếu mã đơn hàng"
        ]);
        exit;
    }

    $conn->begin_transaction();
    try {
        $stmt1 = $conn->prepare("DELETE FROM OrderDetails WHERE OrderID = ?");
        $stmt1->bind_param("i", $orderId);
        $stmt1->execute();

        $stmt2 = $conn->prepare("DELETE FROM OrderCoupons WHERE OrderID = ?");
        $stmt2->bind_param("i", $orderId);
        $stmt2->execute();

        $stmt3 = $conn->prepare("DELETE FROM CouponUsage WHERE OrderID = ?");
        $stmt3->bind_param("i", $orderId);
        $stmt3->execute();

        $stmt4 = $conn->prepare("DELETE FROM Orders WHERE OrderID = ?");
        $stmt4->bind_param("i", $orderId);
        $stmt4->execute();

        $conn->commit();

        echo json_encode([
            "success" => true,
            "message" => "Xóa đơn hàng thành công"
        ]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode([
            "success" => false,
            "message" => "Lỗi khi xóa đơn hàng: " . $e->getMessage()
        ]);
    }
?>
