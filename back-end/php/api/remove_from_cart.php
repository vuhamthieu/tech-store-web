<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth.php';

    header('Content-Type: application/json');
    $user = authenticate();
    $userId = $user['UserID'];
    
    $data = json_decode(file_get_contents('php://input'), true);
    $productId = $data['product_id'] ?? 0;
    $options = $data['options'] ?? ''; // Use options to identify the correct item

    if ($userId <= 0 || $productId <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Thiếu ID người dùng hoặc ID sản phẩm"]);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM Cart WHERE UserID = ? AND ProductID = ? AND Options = ?");
    $stmt->bind_param("iis", $userId, $productId, $options);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Không tìm thấy sản phẩm trong giỏ hàng"]);
    }

    $stmt->close();
?>
