<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth_admin.php';

    $admin = authenticateAdmin();

    $data = json_decode(file_get_contents("php://input"), true);

    $category   = $data['category'] ?? null;
    $title        = $data['title'] ?? '';
    $price        = floatval($data['price'] ?? 0);
    $description  = $data['description'] ?? '';
    $stock        = intval($data['stock'] ?? 0);
    $brand        = $data['brand'] ?? '';
    $thumbnail    = $data['thumbnail'] ?? '';

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

    if (!$title || $price <= 0) {
        echo json_encode([
            "success" => false,
            "message" => "Tên sản phẩm và giá là bắt buộc"
        ]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO Products (CategoryID, Title, Price, Description, Stock, Brand, Thumbnail) 
                            VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param(
        "isdsdss",
        $category,
        $title,
        $price,
        $description,
        $stock,
        $brand,
        $thumbnail
    );

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Thêm sản phẩm thành công",
            "product_id" => $stmt->insert_id
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Lỗi khi thêm sản phẩm"
        ]);
    }
?>
