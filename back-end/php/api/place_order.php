<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth.php';

    $data = json_decode(file_get_contents('php://input'), true);
    $user = authenticate();
    $userId = $user['UserID'];
    $shippingName = $data['shipping_name'] ?? '';
    $shippingPhone = $data['shipping_phone'] ?? '';
    $shippingAddress = $data['shipping_address'] ?? '';
    $shippingNote = $data['shipping_note'] ?? '';
    $totalAmount = $data['total_amount'] ?? 0;
    $paymentMethod = $data['payment_method'] ?? '';
    $couponCode = $data['coupon_code'] ?? '';
    $status = $data['status'] ?? 1;
    $paymentStatus = $data['payment_status'] ?? 0;
    $items = $data['items'] ?? [];

    $conn->begin_transaction();

    try {
        $stmt = $conn->prepare("INSERT INTO Orders 
            (UserID, ShippingName, ShippingPhone, ShippingAddress, ShippingNote, TotalAmount, PaymentMethod, Status, PaymentStatus) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("issssssis", $userId, $shippingName, $shippingPhone, $shippingAddress, $shippingNote, $totalAmount, $paymentMethod, $status, $paymentStatus);
        $stmt->execute();
        $orderId = $stmt->insert_id;

        $detailStmt = $conn->prepare("INSERT INTO OrderDetails (OrderID, ProductID, Quantity, UnitPrice) VALUES (?, ?, ?, ?)");
        foreach ($items as $item) {
            $productId  = intval($item['product_id']);
            $quantity   = intval($item['quantity']);
            $unitPrice  = floatval($item['unit_price']);

            if ($productId && $quantity > 0 && $unitPrice >= 0) {
                $detailStmt->bind_param("iiid", $orderId, $productId, $quantity, $unitPrice);
                $detailStmt->execute();
            }
        }

        //Nếu có mã giảm giá
        if (!empty($couponCode)) {
            $couponStmt = $conn->prepare("SELECT CouponID, UsageLimit FROM Coupons WHERE Code = ? LIMIT 1");
            $couponStmt->bind_param("s", $couponCode);
            $couponStmt->execute();
            $couponRes = $couponStmt->get_result();

            if ($coupon = $couponRes->fetch_assoc()) {
                $couponId = $coupon['CouponID'];
                $discountApplied = $data['discount_applied'] ?? 0;

                $ocStmt = $conn->prepare("INSERT INTO OrderCoupons (OrderID, CouponID, DiscountApplied) VALUES (?, ?, ?)");
                $ocStmt->bind_param("iid", $orderId, $couponId, $discountApplied);
                $ocStmt->execute();

                $usageStmt = $conn->prepare("INSERT INTO CouponUsage (CouponID, UserID, OrderID) VALUES (?, ?, ?)");
                $usageStmt->bind_param("iii", $couponId, $userId, $orderId);
                $usageStmt->execute();

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
