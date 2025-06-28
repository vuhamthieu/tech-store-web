<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth_admin.php';

    $admin = authenticateAdmin();

    $sql = "SELECT p.*, c.CategoryName 
            FROM Products p 
            LEFT JOIN Categories c ON p.CategoryID = c.CategoryID
            WHERE p.IsDeleted = 0";

    $result = $conn->query($sql);

    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $products
    ]);
?>
