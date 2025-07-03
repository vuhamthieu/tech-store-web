<?php
    include __DIR__ . '/../connect.php';

    $productId = isset($_GET['productId']) ? intval($_GET['productId']) : 0;
    $page       = max(1, intval($_GET['page'] ?? 1));
    $limit      = max(1, intval($_GET['limit'] ?? 15));
    $offset     = ($page - 1) * $limit;

    if ($productId <= 0) {
        echo json_encode(["error" => "Thiếu hoặc sai productId"]);
        exit;
    }

    $query = "
        SELECT r.ReviewID, r.Rating, r.Comment, r.CreatedAt,
            u.UserID, u.FullName, u.Avatar
        FROM Reviews r
        JOIN Users u ON r.UserID = u.UserID
        WHERE r.ProductID = ?
        ORDER BY r.CreatedAt DESC LIMIT ? OFFSET ?
    ";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("iii", $productId, $limit, $offset);
    $stmt->execute();
    $result = $stmt->get_result();

    $reviews = [];
    while ($row = $result->fetch_assoc()) {
        $reviews[] = $row;
    }

    echo json_encode($reviews, JSON_UNESCAPED_UNICODE);
?>
