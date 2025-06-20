<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth.php';
    include __DIR__ . '/../cors.php';
    $user = authenticate();
    $userId = $user['UserID'];

    if (!isset($_FILES['avatar'])) {
        echo json_encode([
            "success" => false,
            "message" => "Vui lòng chọn file ảnh"
        ]);
        exit;
    }

    $file = $_FILES['avatar'];
    $targetDir = __DIR__ . '/../../../assets/img/';
    $filename = uniqid('avatar_') . '_' . basename($file['name']);
    $targetFile = $targetDir . $filename;

    if (move_uploaded_file($file['tmp_name'], $targetFile)) {
        // Save only the filename in DB
        $query = "UPDATE Users SET Avatar = ? WHERE UserID = ?";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, "si", $filename, $userId);

        if (mysqli_stmt_execute($stmt)) {
            echo json_encode([
                "success" => true,
                "message" => "Cập nhật avatar thành công",
                "avatar" => $filename
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Lỗi khi cập nhật avatar"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Lỗi khi upload file"
        ]);
    }
?>
