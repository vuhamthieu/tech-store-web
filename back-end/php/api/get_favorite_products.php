<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth.php';

    $user = authenticate();
    $userId = $user['UserID'];

    $query = "SELECT p.* 
            FROM Favorites f 
            JOIN Products p ON f.ProductID = p.ProductID 
            WHERE f.UserID = ? AND p.IsDeleted = 0";

    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $userId);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    $favorites = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $favorites[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $favorites
    ]);
?>
