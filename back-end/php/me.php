<?php
    include __DIR__ . '/auth.php';

    $user = authenticate();

    echo json_encode([
        "success" => true,
        "message" => "Đã xác thực thành công",
        "data" => $user
    ]);
?>
