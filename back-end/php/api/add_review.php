<?php
    include __DIR__ . '/../connect.php';

    $data = json_decode(file_get_contents("php://input"), true);

    $productId = isset($data['productId']) ? intval($data['productId']) : 0;
    $userId = isset($data['userId']) ? intval($data['userId']) : 0;
    $rating = isset($data['rating']) ? intval($data['rating']) : 0;
    $comment = isset($data['comment']) ? trim($data['comment']) : '';

    if ($productId <= 0 || $userId <= 0 || $rating < 1 || $rating > 5) {
        echo json_encode(["error" => "Dữ liệu không hợp lệ"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO Reviews (ProductID, UserID, Rating, Comment) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("iiis", $productId, $userId, $rating, $comment);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Đánh giá đã được thêm"]);
    } else {
        echo json_encode(["error" => "Không thể thêm đánh giá"]);
    }
?>
