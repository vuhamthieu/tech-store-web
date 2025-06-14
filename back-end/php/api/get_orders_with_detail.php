<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth.php';

    $user = authenticate();
    $userId = $user['UserID'];

    $orderQuery = "SELECT 
                      OrderID,
                      ShippingName,
                      ShippingPhone,
                      ShippingAddress,
                      ShippingNote,
                      OrderDate,
                      TotalAmount,
                      Status,
                      PaymentStatus,
                      PaymentMethod
                   FROM Orders
                   WHERE UserID = ?
                   ORDER BY OrderDate DESC";
    $stmt = mysqli_prepare($conn, $orderQuery);
    mysqli_stmt_bind_param($stmt, "i", $userId);
    mysqli_stmt_execute($stmt);
    $orderResult = mysqli_stmt_get_result($stmt);

    $orders = [];

    while ($order = mysqli_fetch_assoc($orderResult)) {
        $orderId = $order['OrderID'];

        // Lấy chi tiết sản phẩm trong đơn hàng này
        $detailQuery = "SELECT 
                            od.OrderDetailID,
                            od.ProductID,
                            od.Quantity,
                            od.UnitPrice,
                            p.Title,
                            p.Thumbnail
                        FROM OrderDetails od
                        JOIN Products p ON od.ProductID = p.ProductID
                        WHERE od.OrderID = ?";
        $stmtDetail = mysqli_prepare($conn, $detailQuery);
        mysqli_stmt_bind_param($stmtDetail, "i", $orderId);
        mysqli_stmt_execute($stmtDetail);
        $detailResult = mysqli_stmt_get_result($stmtDetail);

        $details = [];
        while ($row = mysqli_fetch_assoc($detailResult)) {
            $details[] = $row;
        }

        $order['items'] = $details;
        $orders[] = $order;
    }

    echo json_encode([
        "success" => true,
        "data" => $orders
    ]);
?>
