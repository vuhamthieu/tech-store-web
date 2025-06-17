<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth_admin.php';

    $admin = authenticateAdmin(); // RoleID >= 2

    $query = "SELECT * FROM Orders ORDER BY OrderDate DESC";
    $result = mysqli_query($conn, $query);

    $orders = [];

    while ($order = mysqli_fetch_assoc($result)) {
        $orderId = $order['OrderID'];

        $detailQuery = "
            SELECT od.OrderDetailID, od.ProductID, od.Quantity, od.UnitPrice,
                p.Title, p.Thumbnail
            FROM OrderDetails od
            JOIN Products p ON od.ProductID = p.ProductID
            WHERE od.OrderID = ?
        ";

        $stmt = mysqli_prepare($conn, $detailQuery);
        mysqli_stmt_bind_param($stmt, "i", $orderId);
        mysqli_stmt_execute($stmt);
        $detailResult = mysqli_stmt_get_result($stmt);

        $details = [];
        while ($row = mysqli_fetch_assoc($detailResult)) {
            $details[] = $row;
        }

        $order['details'] = $details;
        $orders[] = $order;
    }

    echo json_encode([
        "success" => true,
        "data" => $orders
    ]);
?>
