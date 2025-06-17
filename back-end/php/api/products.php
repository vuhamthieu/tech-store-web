<?php
    include __DIR__ . '/../connect.php';

    $search     = $_GET['search']     ?? null;
    $category   = $_GET['category']   ?? null;
    $brand      = $_GET['brand']      ?? null;
    $price_min  = $_GET['price_min']  ?? null;
    $price_max  = $_GET['price_max']  ?? null;
    $sort_by    = $_GET['sort_by']    ?? null;
    $page       = max(1, intval($_GET['page'] ?? 1));
    $limit      = max(1, intval($_GET['limit'] ?? 15));
    $offset     = ($page - 1) * $limit;

    if ($category) {
        $stmt = $conn->prepare("SELECT CategoryID FROM Categories WHERE CategoryName = ?");
        $stmt->bind_param("s", $category);
        $stmt->execute();
        $stmt->bind_result($categoryId);
        if ($stmt->fetch()) {
            $category = $categoryId; 
        } else {
            echo json_encode([
                "page" => 1,
                "limit" => 0,
                "total" => 0,
                "total_pages" => 0,
                "products" => []
            ]);
            exit;
        }
        $stmt->close();
    }


    // Xây dựng điều kiện truy vấn
    $conditions = [];
    $params     = [];

    if ($search) {
        $conditions[] = "LOWER(Title) LIKE LOWER(?)";
        $params[] = "%$search%";
    }
    if ($category) {
        $conditions[] = "CategoryID = ?";
        $params[] = $category;
    }
    if ($brand) {
        $conditions[] = "Brand = ?";
        $params[] = $brand;
    }
    if ($price_min !== null) {
        $conditions[] = "Price >= ?";
        $params[] = $price_min;
    }
    if ($price_max !== null) {
        $conditions[] = "Price <= ?";
        $params[] = $price_max;
    }

    $where = count($conditions) ? "WHERE " . implode(" AND ", $conditions) : "";

    // Sắp xếp
    $order = "ORDER BY ProductID DESC"; // mặc định
    switch ($sort_by) {
        case "price_asc":  $order = "ORDER BY Price ASC"; break;
        case "price_desc": $order = "ORDER BY Price DESC"; break;
        case "newest":     $order = "ORDER BY CreatedAt DESC"; break;
    }

    // Đếm tổng số bản ghi
    $stmt = $conn->prepare("SELECT COUNT(*) FROM products $where");
    if ($params) $stmt->bind_param(str_repeat('s', count($params)), ...$params);
    $stmt->execute();
    $stmt->bind_result($total);
    $stmt->fetch();
    $stmt->close();

    // Lấy danh sách sản phẩm
    $query = "SELECT * FROM products $where $order LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;

    $stmt = $conn->prepare($query);
    $types = str_repeat('s', count($params) - 2) . "ii";
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();

    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
    $stmt->close();

    echo json_encode([
        "page" => $page,
        "limit" => $limit,
        "total" => $total,
        "total_pages" => ceil($total / $limit),
        "products" => $products
    ], JSON_UNESCAPED_UNICODE);
?>
