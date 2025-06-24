<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth.php';

    $user = authenticate();
    $userId = $user['UserID'];

    $data = json_decode(file_get_contents('php://input'), true);
    $productId = $data['product_id'] ?? 0;

    if (!$productId) {
        echo json_encode([
            "success" => false,
            "message" => "Thiếu product_id"
        ]);
        exit;
    }

    $query = "DELETE FROM Favorites WHERE UserID = ? AND ProductID = ?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "ii", $userId, $productId);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode([
            "success" => true,
            "message" => "Đã xóa sản phẩm khỏi danh sách yêu thích"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Lỗi khi xóa sản phẩm yêu thích"
        ]);
    }
?>
