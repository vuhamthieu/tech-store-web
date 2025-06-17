<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth_admin.php';

    $admin = authenticateAdmin();

    $data = json_decode(file_get_contents("php://input"), true);
    $productId = $data['product_id'] ?? ($_GET['product_id'] ?? null);

    if (!$productId) {
        echo json_encode([
            "success" => false,
            "message" => "Thiếu ProductID"
        ]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE Products SET IsDeleted = 1 WHERE ProductID = ?");
    $stmt->bind_param("i", $productId);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Xóa sản phẩm thành công"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Xóa sản phẩm thất bại"
        ]);
    }
?>
