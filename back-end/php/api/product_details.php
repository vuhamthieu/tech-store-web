<?php
    include __DIR__ . '/../connect.php';

    $productId = isset($_GET['productId']) ? intval($_GET['productId']) : 0;

    if ($productId <= 0) {
        echo json_encode(["error" => "Không tìm thấy productId"]);
        exit;
    }

    //Lấy thông tin sản phẩm
    $stmt = $conn->prepare("SELECT * FROM Products WHERE ProductID = ?");
    $stmt->bind_param("i", $productId);
    $stmt->execute();
    $productResult = $stmt->get_result();
    $product = $productResult->fetch_assoc();

    if (!$product) {
        echo json_encode(["error" => "Không tìm thấy sản phẩm"]);
        exit;
    }

    //Lấy thông số kỹ thuật chung
    $stmt = $conn->prepare("SELECT SpecKey, SpecValue FROM ProductSpecifications WHERE ProductID = ?");
    $stmt->bind_param("i", $productId);
    $stmt->execute();
    $specResult = $stmt->get_result();
    $productSpecifications = [];
    while ($row = $specResult->fetch_assoc()) {
        $productSpecifications[] = $row;
    }

    //Lấy danh sách biến thể của sản phẩm
    $stmt = $conn->prepare("SELECT * FROM ProductVariants WHERE ProductID = ?");
    $stmt->bind_param("i", $productId);
    $stmt->execute();
    $variantResult = $stmt->get_result();
    $productVariants = [];

    while ($variant = $variantResult->fetch_assoc()) {
        //Với mỗi biến thể, lấy thông số riêng
        $variantId = $variant['VariantID'];
        $stmtSpec = $conn->prepare("SELECT SpecKey, SpecValue FROM VariantSpecifications WHERE VariantID = ?");
        $stmtSpec->bind_param("i", $variantId);
        $stmtSpec->execute();
        $variantSpecResult = $stmtSpec->get_result();
        $variantSpecifications = [];
        while ($row = $variantSpecResult->fetch_assoc()) {
            $variantSpecifications[] = $row;
        }

        $variant['Specifications'] = $variantSpecifications;
        $productVariants[] = $variant;
    }

    //Lấy hình ảnh từ Gallery
    $stmt = $conn->prepare("SELECT * FROM Gallery WHERE ProductID = ?");
    $stmt->bind_param("i", $productId);
    $stmt->execute();
    $galleryResult = $stmt->get_result();
    $galleryImages = [];
    while ($row = $galleryResult->fetch_assoc()) {
        $galleryImages[] = $row;
    }

    // Tính tổng số lượng đã bán (chỉ tính đơn đã duyệt)
    $stmt = $conn->prepare("
        SELECT SUM(od.Quantity) as SoldCount
        FROM OrderDetails od
        JOIN Orders o ON od.OrderID = o.OrderID
        WHERE od.ProductID = ? AND o.Status = 1
    ");
    $stmt->bind_param("i", $productId);
    $stmt->execute();
    $soldResult = $stmt->get_result();
    $soldRow = $soldResult->fetch_assoc();
    $soldCount = $soldRow['SoldCount'] ?? 0;

    // Tính tồn kho thực tế
    $stock = max(0, $product['Stock'] - $soldCount);

    // Thêm vào response
    $product['SoldCount'] = $soldCount;
    $product['Stock'] = $stock;

    $response = [
        "product" => $product,
        "productSpecifications" => $productSpecifications,
        "variants" => $productVariants,
        "gallery" => $galleryImages
    ];

    echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>
