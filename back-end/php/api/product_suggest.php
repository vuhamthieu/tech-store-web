<?php
    include __DIR__ . '/../connect.php';

    $query = $_GET['query'] ?? '';
    $limit = max(1, intval($_GET['limit'] ?? 5));

    if (trim($query) === '') {
        echo json_encode([]);
        exit;
    }

    $sql = "SELECT * 
            FROM products 
            WHERE name LIKE ? 
            ORDER BY rating DESC 
            LIMIT ?";

    $stmt = $conn->prepare($sql);
    $search = "%$query%";
    $stmt->bind_param("si", $search, $limit);
    $stmt->execute();
    $result = $stmt->get_result();

    $suggestions = [];
    while ($row = $result->fetch_assoc()) {
        $suggestions[] = $row;
    }

    echo json_encode($suggestions, JSON_UNESCAPED_UNICODE);
?>
