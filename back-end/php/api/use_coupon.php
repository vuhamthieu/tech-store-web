<?php
    include __DIR__ . '/../connect.php';

    $data = json_decode(file_get_contents("php://input"), true);
    $code = $data['code'] ?? '';
    $userId = $data['user_id'] ?? 0;
    $orderAmount = $data['order_amount'] ?? 0;
    $productIds = $data['product_ids'] ?? [];

    if (!$code || !$userId || !$orderAmount) {
        echo json_encode(["success" => false, "message" => "Thiếu dữ liệu đầu vào"]);
        exit;
    }

    // 1. Kiểm tra mã có tồn tại và còn hiệu lực không
    $query = "SELECT * FROM Coupons WHERE Code = ? AND StartDate <= NOW() AND EndDate >= NOW()";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "s", $code);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if (!($coupon = mysqli_fetch_assoc($result))) {
        echo json_encode(["success" => false, "message" => "Mã không tồn tại hoặc đã hết hạn"]);
        exit;
    }

    // 2. Kiểm tra điều kiện đơn hàng tối thiểu
    if ($orderAmount < $coupon['MinOrderAmount']) {
        echo json_encode(["success" => false, "message" => "Đơn hàng chưa đủ tối thiểu để áp dụng mã"]);
        exit;
    }

    // 3. Kiểm tra sản phẩm áp dụng (nếu có tương ứng với mã đặc biệt mà user nhập vào)
    $couponId = $coupon['CouponID'];
    $checkProductQuery = "SELECT ProductID FROM CouponProducts WHERE CouponID = ?";
    $checkStmt = mysqli_prepare($conn, $checkProductQuery);
    mysqli_stmt_bind_param($checkStmt, "i", $couponId);
    mysqli_stmt_execute($checkStmt);
    $productResult = mysqli_stmt_get_result($checkStmt);
    $restrictedProducts = [];
    while ($row = mysqli_fetch_assoc($productResult)) {
        $restrictedProducts[] = $row['ProductID'];
    }

    if (!empty($restrictedProducts)) {
        $valid = false;
        foreach ($productIds as $pid) {
            if (in_array($pid, $restrictedProducts)) {
                $valid = true;
                break;
            }
        }
        if (!$valid) {
            echo json_encode(["success" => false, "message" => "Mã này không áp dụng cho các sản phẩm đã chọn"]);
            exit;
        }
    }

    // 4. Kiểm tra giới hạn lượt dùng
    if ($coupon['UsageLimit'] !== null) {
        $limitQuery = "SELECT COUNT(*) AS used_count FROM CouponUsage WHERE CouponID = ?";
        $limitStmt = mysqli_prepare($conn, $limitQuery);
        mysqli_stmt_bind_param($limitStmt, "i", $couponId);
        mysqli_stmt_execute($limitStmt);
        $limitResult = mysqli_stmt_get_result($limitStmt);
        $used = mysqli_fetch_assoc($limitResult)['used_count'];
        if ($used >= $coupon['UsageLimit']) {
            echo json_encode(["success" => false, "message" => "Mã giảm giá đã hết lượt sử dụng"]);
            exit;
        }
    }

    //Kiểm tra xem user đã dùng chưa
    $checkUserUsage = $conn->prepare("SELECT COUNT(*) as user_used FROM CouponUsage WHERE CouponID = ? AND UserID = ?");
    $checkUserUsage->bind_param("ii", $couponId, $userId);
    $checkUserUsage->execute();
    $userResult = $checkUserUsage->get_result()->fetch_assoc();

    if ($userResult['user_used'] > 0) {
        echo json_encode(["success" => false, "message" => "Bạn đã sử dụng mã giảm giá này rồi."]);
        exit;
    }

    // 5. Tính số tiền được giảm
    $discount = 0;
    if ($coupon['DiscountType'] == 'percent') {
        $discount = ($coupon['DiscountValue'] / 100) * $orderAmount;
        if ($coupon['MaxDiscountAmount'] !== null && $discount > $coupon['MaxDiscountAmount']) {
            $discount = $coupon['MaxDiscountAmount'];
        }
    } else {
        $discount = $coupon['DiscountValue'];
        if ($discount > $orderAmount) {
            $discount = $orderAmount; // không giảm âm
        }
    }

    echo json_encode([
        "success" => true,
        "discount_amount" => round($discount, 2),
        "coupon_id" => $couponId,
        "message" => "Mã hợp lệ - đã giảm " . number_format($discount) . "đ"
    ]);
?>
