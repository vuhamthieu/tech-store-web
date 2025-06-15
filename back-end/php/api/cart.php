<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth.php';

    $user = authenticate();
    $userId = $user['UserID'];
    if ($userId <= 0) {
        echo json_encode(["error" => "Thiếu userId"]);
        exit;
    }

    $sql = "
        SELECT 
            c.ProductID,
            c.Quantity,
            c.Options,
            p.ProductName,
            p.Price,
            p.Thumbnail,
            p.Stock
        FROM Cart c
        JOIN Products p ON c.ProductID = p.ProductID
        WHERE c.UserID = ?
        ORDER BY c.CreatedAt DESC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    $cartItems = [];
    while ($row = $result->fetch_assoc()) {
        $cartItems[] = $row;
    }

    echo json_encode($cartItems, JSON_UNESCAPED_UNICODE);
?>
