<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth.php';

    $user = authenticate();
    $userId = $user['UserID'];

    $data = json_decode(file_get_contents('php://input'), true);
    $productId = $data['product_id'] ?? null;

    if (!$productId) {
        echo json_encode([
            "success" => false,
            "message" => "Thiếu ProductID"
        ]);
        exit;
    }

    $query = "INSERT IGNORE INTO Favorites (UserID, ProductID) VALUES (?, ?)";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "ii", $userId, $productId);
    $success = mysqli_stmt_execute($stmt);

    if ($success) {
        echo json_encode([
            "success" => true,
            "message" => "Đã thêm vào danh sách yêu thích"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Thêm sản phẩm yêu thích thất bại"
        ]);
    }
?>
