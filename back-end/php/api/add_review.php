<?php
include __DIR__ . '/../connect.php';
include __DIR__ . '/../auth.php';

$data = json_decode(file_get_contents("php://input"), true);

$productId = isset($data['productId']) ? intval($data['productId']) : 0;
$user = authenticate();
$userId = $user['UserID'];
$rating = isset($data['rating']) ? intval($data['rating']) : 0;
$comment = isset($data['comment']) ? trim($data['comment']) : '';

if ($productId <= 0 || $userId <= 0 || $rating < 1 || $rating > 5) {
    echo json_encode(["error" => "Dữ liệu không hợp lệ"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO Reviews (ProductID, UserID, Rating, Comment) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iiis", $productId, $userId, $rating, $comment);

if ($stmt->execute()) {
    $updateStmt = $conn->prepare("
            UPDATE Products 
            SET Rating = (SELECT AVG(Rating) FROM Reviews WHERE ProductID = ?)
            WHERE ProductID = ?
        ");
    $updateStmt->bind_param("ii", $productId, $productId);
    $updateStmt->execute();
    echo json_encode(["success" => true, "message" => "Đánh giá đã được thêm"]);
} else {
    echo json_encode(["error" => "Không thể thêm đánh giá"]);
}
