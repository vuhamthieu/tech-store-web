<?php
    // Kết nối CSDL
    include __DIR__ . '/../connect.php';

    // Lấy từ khóa tìm kiếm
    $query = $_GET['query'] ?? '';
    $limit = max(1, intval($_GET['limit'] ?? 5));

    // Nếu query rỗng, trả về mảng rỗng luôn
    if (trim($query) === '') {
        echo json_encode([]);
        exit;
    }

    // Chuẩn bị truy vấn
    $sql = "SELECT * 
            FROM products 
            WHERE name LIKE ? 
            ORDER BY rating DESC 
            LIMIT ?";

    // Thực hiện truy vấn
    $stmt = $conn->prepare($sql);
    $search = "%$query%";
    $stmt->bind_param("si", $search, $limit);
    $stmt->execute();
    $result = $stmt->get_result();

    // Lấy kết quả
    $suggestions = [];
    while ($row = $result->fetch_assoc()) {
        $suggestions[] = $row;
    }

    // Trả về JSON
    echo json_encode($suggestions, JSON_UNESCAPED_UNICODE);
?>
