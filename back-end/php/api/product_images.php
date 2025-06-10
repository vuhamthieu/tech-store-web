<?php
    // Kết nối CSDL
    include __DIR__ . '/../connect.php';

    // Lấy productId từ URL
    $productId = isset($_GET['productId']) ? intval($_GET['productId']) : 0;

    if ($productId <= 0) {
        echo json_encode(["error" => "Invalid productId"]);
        exit;
    }

    // Truy vấn dữ liệu từ bảng Gallery
    $stmt = $conn->prepare("SELECT * FROM Gallery WHERE ProductID = ?");
    $stmt->bind_param("i", $productId);
    $stmt->execute();
    $result = $stmt->get_result();

    // Gộp kết quả
    $images = [];
    while ($row = $result->fetch_assoc()) {
        $images[] = $row;
    }

    // Trả về JSON
    echo json_encode($images, JSON_UNESCAPED_UNICODE);
?>