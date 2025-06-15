<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth.php';

    $data = json_decode(file_get_contents('php://input'), true);
    $token = $data['payment_token'] ?? null;
    $orderId = $data['order_id'] ?? null;
    $user = authenticate();
    $userId = $user['UserID'];
    $amount = $data['amount'] ?? null;

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
