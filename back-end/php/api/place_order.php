<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth.php';

    $user = authenticate();
    $userId = $user['UserID'];
    $shippingName = $_POST['shipping_name'];
    $shippingPhone = $_POST['shipping_phone'];
    $shippingAddress = $_POST['shipping_address'];
    $shippingNote = $_POST['shipping_note'] ?? '';
    $totalAmount = floatval($_POST['total_amount']);
    $paymentMethod = $_POST['payment_method'];
    $couponCode = $_POST['coupon_code'] ?? null;
    $status = isset($_POST['status']) ? intval($_POST['status']) : 0;
    $paymentStatus = isset($_POST['payment_status']) ? intval($_POST['payment_status']) : 0;

    // Bắt đầu transaction
    $conn->begin_transaction();

    try {
        // 1. Tạo đơn hàng
        $stmt = $conn->prepare("INSERT INTO Orders 
            (UserID, ShippingName, ShippingPhone, ShippingAddress, ShippingNote, TotalAmount, PaymentMethod, Status, PaymentStatus) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("isssssdis", $userId, $shippingName, $shippingPhone, $shippingAddress, $shippingNote, $totalAmount, $paymentMethod, $status, $paymentStatus);
        $stmt->execute();
        $orderId = $stmt->insert_id;

        // 2. Nếu có mã giảm giá
        if (!empty($couponCode)) {
            $couponStmt = $conn->prepare("SELECT CouponID, UsageLimit FROM Coupons WHERE Code = ? LIMIT 1");
            $couponStmt->bind_param("s", $couponCode);
            $couponStmt->execute();
            $couponRes = $couponStmt->get_result();

            if ($coupon = $couponRes->fetch_assoc()) {
                $couponId = $coupon['CouponID'];
                $discountApplied = floatval($_POST['discount_applied'] ?? 0);

                // a. Ghi vào OrderCoupons
                $ocStmt = $conn->prepare("INSERT INTO OrderCoupons (OrderID, CouponID, DiscountApplied) VALUES (?, ?, ?)");
                $ocStmt->bind_param("iid", $orderId, $couponId, $discountApplied);
                $ocStmt->execute();

                // b. Ghi vào CouponUsage
                $usageStmt = $conn->prepare("INSERT INTO CouponUsage (CouponID, UserID, OrderID) VALUES (?, ?, ?)");
                $usageStmt->bind_param("iii", $couponId, $userId, $orderId);
                $usageStmt->execute();

                // c. Trừ lượt sử dụng nếu có giới hạn
                if (!is_null($coupon['UsageLimit'])) {
                    $updateStmt = $conn->prepare("UPDATE Coupons SET UsageLimit = UsageLimit - 1 WHERE CouponID = ?");
                    $updateStmt->bind_param("i", $couponId);
                    $updateStmt->execute();
                }
            }
        }

        $conn->commit();

        echo json_encode([
            "success" => true,
            "message" => "Đặt hàng thành công",
            "order_id" => $orderId
        ]);

    } catch (Exception $e) {
        $conn->rollback();

        echo json_encode([
            "success" => false,
            "message" => "Lỗi khi đặt hàng: " . $e->getMessage()
        ]);
    }
?>
