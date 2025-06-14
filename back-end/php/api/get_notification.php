<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth.php';

    $user = authenticate();
    $userId = $user['UserID'];

    $query = "
        SELECT NotificationID, Title, Content, IsRead, CreatedAt
        FROM Notifications
        WHERE UserID = ?
        ORDER BY CreatedAt DESC
    ";

    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $userId);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    $notifications = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $notifications[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $notifications
    ]);
?>
