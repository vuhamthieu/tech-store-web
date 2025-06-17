<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth_admin.php';

    $admin = authenticateAdmin();

    $data = json_decode(file_get_contents("php://input"), true);

    $productId    = $data['product_id'] ?? null;
    $category   = $data['category'] ?? null;
    $title        = $data['title'] ?? '';
    $price        = floatval($data['price'] ?? 0);
    $description  = $data['description'] ?? '';
    $stock        = intval($data['stock'] ?? 0);
    $brand        = $data['brand'] ?? '';
    $thumbnail    = $data['thumbnail'] ?? '';

    if (!$productId || !$title || $price <= 0) {
        echo json_encode([
            "success" => false,
            "message" => "Thiếu thông tin bắt buộc"
        ]);
        exit;
    }

    if ($category) {
        $stmt = $conn->prepare("SELECT CategoryID FROM Categories WHERE CategoryName = ?");
        $stmt->bind_param("s", $category);
        $stmt->execute();
        $stmt->bind_result($categoryId);
        if ($stmt->fetch()) {
            $category = $categoryId; 
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Không tìm thấy danh mục"
            ]);
            exit;
        }
        $stmt->close();
    }

    $stmt = $conn->prepare("UPDATE Products 
                            SET CategoryID = ?, Title = ?, Price = ?, Description = ?, Stock = ?, Brand = ?, Thumbnail = ?
                            WHERE ProductID = ?");
    $stmt->bind_param(
        "isdsdssi",
        $category,
        $title,
        $price,
        $description,
        $stock,
        $brand,
        $thumbnail,
        $productId
    );

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Cập nhật sản phẩm thành công"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Lỗi khi cập nhật sản phẩm"
        ]);
    }
?>
