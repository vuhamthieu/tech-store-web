<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth.php';

    $user = authenticate();
    $userId = $user['UserID'];

    $data = json_decode(file_get_contents("php://input"), true);
    $avatar = $data['avatar'] ?? '';

    if (!$avatar) {
        echo json_encode([
            "success" => false,
            "message" => "Vui lòng cung cấp đường dẫn avatar"
        ]);
        exit;
    }

    $query = "UPDATE Users SET Avatar = ? WHERE UserID = ?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "si", $avatar, $userId);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode([
            "success" => true,
            "message" => "Cập nhật avatar thành công",
            "avatar" => $avatar
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Lỗi khi cập nhật avatar"
        ]);
    }
?>
