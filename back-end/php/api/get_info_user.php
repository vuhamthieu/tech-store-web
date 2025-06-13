<?php
    include __DIR__ . '/../connect.php';

    $userId = intval($_GET['user_id']);

    $query = "SELECT FullName, Phone, Address FROM Users WHERE UserID = ? LIMIT 1";

    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $userId);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    //response
    if ($user = mysqli_fetch_assoc($result)) {
        echo json_encode([
            "success" => true,
            "data" => $user
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Không tìm thấy tài khoản"
        ]);
    }
?>
