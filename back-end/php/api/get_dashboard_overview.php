<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth_admin.php';

    $admin = authenticateAdmin();
    
    // 1. 5 đơn hàng mới nhất
    $recentOrders = [];
    $result = $conn->query("
        SELECT o.OrderID, u.FullName AS CustomerName, o.OrderDate, o.TotalAmount, o.Status
        FROM Orders o
        JOIN Users u ON o.UserID = u.UserID
        ORDER BY o.OrderDate DESC
        LIMIT 5
    ");
    while ($row = $result->fetch_assoc()) {
        $recentOrders[] = [
            "order_id"    => $row['OrderID'],
            "customer"    => $row['CustomerName'],
            "order_date"  => $row['OrderDate'],
            "total"       => (float)$row['TotalAmount'],
            "status"      => intval($row['Status'])
        ];
    }

    // 2. Tổng số đơn hàng
    $totalOrders = 0;
    $res = $conn->query("SELECT COUNT(*) as total FROM Orders");
    if ($row = $res->fetch_assoc()) {
        $totalOrders = intval($row['total']);
    }

    // 3. Doanh thu tháng này
    $monthlyRevenue = 0;
    $res = $conn->query("
        SELECT SUM(TotalAmount) as revenue 
        FROM Orders 
        WHERE MONTH(OrderDate) = MONTH(CURRENT_DATE())
        AND YEAR(OrderDate) = YEAR(CURRENT_DATE())
        AND Status = 1
    ");
    if ($row = $res->fetch_assoc()) {
        $monthlyRevenue = floatval($row['revenue'] ?? 0);
    }

    // 4. Tổng số khách hàng
    $totalCustomers = 0;
    $res = $conn->query("SELECT COUNT(*) as total FROM Users WHERE RoleID = 1");
    if ($row = $res->fetch_assoc()) {
        $totalCustomers = intval($row['total']);
    }

    // 5. Tổng số sản phẩm (chưa bị xóa)
    $totalProducts = 0;
    $res = $conn->query("SELECT COUNT(*) as total FROM Products WHERE IsDeleted = 0");
    if ($row = $res->fetch_assoc()) {
        $totalProducts = intval($row['total']);
    }

    echo json_encode([
        "success" => true,
        "overview" => [
            "recent_orders"   => $recentOrders,
            "total_orders"    => $totalOrders,
            "monthly_revenue" => $monthlyRevenue,
            "total_customers" => $totalCustomers,
            "total_products"  => $totalProducts
        ]
    ]);
?>
