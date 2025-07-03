<?php
    include __DIR__ . '/../connect.php';

    $data = json_decode(file_get_contents('php://input'), true);
    $tokenSuccess = $data['payment_token'] ?? null;
    $paymentMethod = $data['payment_method'] ?? null;

    if (!$paymentMethod) {
        echo json_encode(["success" => false, "message" => "Thiếu phương thức thanh toán"]);
        exit;
    }

    $status = 0; //chưa giao hàng
    $paymentStatus = 0;

    if (strtolower($paymentMethod) === 'cod') {
        $paymentStatus = 0;
    } elseif ($tokenSuccess) { //nếu người dùng chọn thanh toán online
        $stmt = $conn->prepare("SELECT * FROM payment_tokens WHERE token = ? LIMIT 1");
        $stmt->bind_param("s", $tokenSuccess);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            $paymentStatus = 1;

            $delete = $conn->prepare("DELETE FROM payment_tokens WHERE token = ?");
            $delete->bind_param("s", $tokenSuccess);
            $delete->execute();
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Token không hợp lệ hoặc đã hết hạn"
            ]);
            exit;
        }
    }

    echo json_encode([
        "success" => true,
        "message" => "Xác nhận phương thức thanh toán thành công",
        "status" => $status,
        "payment_status" => $paymentStatus
    ]);

?>
