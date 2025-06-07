<?php
    // Kết nối MySQL
    include 'connect.php';

    // Lấy tham số từ URL
    $search     = $_GET['search']     ?? null;
    $category   = $_GET['category']   ?? null;
    $brand      = $_GET['brand']      ?? null;
    $price_min  = $_GET['price_min']  ?? null;
    $price_max  = $_GET['price_max']  ?? null;
    $sort_by    = $_GET['sort_by']    ?? null;
    $page       = max(1, intval($_GET['page'] ?? 1));
    $limit      = max(1, intval($_GET['limit'] ?? 12));
    $offset     = ($page - 1) * $limit;

    // Xây dựng điều kiện truy vấn
    $conditions = [];
    $params     = [];

    if ($search) {
        $conditions[] = "name LIKE ?";
        $params[] = "%$search%";
    }
    if ($category) {
        $conditions[] = "category = ?";
        $params[] = $category;
    }
    if ($brand) {
        $conditions[] = "brand = ?";
        $params[] = $brand;
    }
    if ($price_min !== null) {
        $conditions[] = "price >= ?";
        $params[] = $price_min;
    }
    if ($price_max !== null) {
        $conditions[] = "price <= ?";
        $params[] = $price_max;
    }

    // Xây dựng chuỗi WHERE
    $where = count($conditions) ? "WHERE " . implode(" AND ", $conditions) : "";

    // Sắp xếp
    $order = "ORDER BY id DESC"; // mặc định
    switch ($sort_by) {
        case "price_asc":  $order = "ORDER BY price ASC"; break;
        case "price_desc": $order = "ORDER BY price DESC"; break;
        case "rating":     $order = "ORDER BY rating DESC"; break;
        case "newest":     $order = "ORDER BY created_at DESC"; break;
    }

    // Đếm tổng số bản ghi
    $stmt = $conn->prepare("SELECT COUNT(*) FROM products $where");
    if ($params) $stmt->bind_param(str_repeat('s', count($params)), ...$params);
    $stmt->execute();
    $stmt->bind_result($total);
    $stmt->fetch();
    $stmt->close();

    // Lấy danh sách sản phẩm
    $query = "SELECT id, name, price, brand, category, rating, image_url FROM products $where $order LIMIT ? OFFSET ?";
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
