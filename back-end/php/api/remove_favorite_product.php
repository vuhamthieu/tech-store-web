<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth.php';

    // Xác thực người dùng
    $user = authenticate();
    $userId = $user['UserID'];

    // Nhận dữ liệu từ phía client
    $data = json_decode(file_get_contents('php://input'), true);
    $productId = $data['product_id'] ?? 0;

    if (!$productId) {
        echo json_encode([
            "success" => false,
            "message" => "Thiếu product_id"
        ]);
        exit;
    }

    // Xóa bản ghi yêu thích
    $query = "DELETE FROM FavoriteProducts WHERE UserID = ? AND ProductID = ?";
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
