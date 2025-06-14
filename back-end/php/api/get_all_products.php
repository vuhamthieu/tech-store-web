<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth_admin.php';

    $admin = authenticateAdmin();

    $query = "SELECT *
            FROM Products 
            WHERE IsDeleted = 0
            ORDER BY CreatedAt DESC";

    $result = $conn->query($query);

    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $products
    ]);
?>
