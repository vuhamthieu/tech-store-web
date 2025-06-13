<?php
    include __DIR__ . '/../connect.php';

    $token = $_POST['payment_token'] ?? null;
    $orderId = $_POST['order_id'] ?? null;
    $userId = $_POST['user_id'] ?? null;
    $amount = $_POST['amount'] ?? null;

    if (!$token || !$orderId || !$userId || !$amount) {
        echo json_encode([
            "success" => false,
            "message" => "Thiếu dữ liệu: token, order_id, user_id hoặc amount"
        ]);
        exit;
    }

    // Kiểm tra đã tồn tại chưa
    $checkStmt = $conn->prepare("SELECT TokenID FROM payment_tokens WHERE Token = ?");
    $checkStmt->bind_param("s", $token);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Token đã tồn tại"
        ]);
        exit;
    }

    // Lưu vào bảng
    $stmt = $conn->prepare("INSERT INTO payment_tokens (Token, OrderID, UserID, Amount) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssii", $token, $orderId, $userId, $amount);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Lưu token thành công"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Lỗi khi lưu token"
        ]);
    }
?>
