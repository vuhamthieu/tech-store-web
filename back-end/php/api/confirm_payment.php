<?php
    include __DIR__ . '/../connect.php';

    $tokenSuccess = $_POST['token_success'] ?? null;
    $paymentMethod = $_POST['payment_method'] ?? null;

    if (!$paymentMethod) {
        echo json_encode(["success" => false, "message" => "Thiếu phương thức thanh toán"]);
        exit;
    }

    // Mặc định
    $status = 0;
    $paymentStatus = 0;

    if (strtolower($paymentMethod) === 'cod') {
        $status = 1;
        $paymentStatus = 0;
    } elseif ($tokenSuccess) {
        // Kiểm tra trong bảng tạm (ví dụ: payment_tokens)
        $stmt = $conn->prepare("SELECT * FROM payment_tokens WHERE token = ? LIMIT 1");
        $stmt->bind_param("s", $tokenSuccess);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            $status = 1;
            $paymentStatus = 1;

            // Option: Xoá token sau khi dùng
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
