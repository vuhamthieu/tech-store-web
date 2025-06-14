<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth.php';

    $user = authenticate();
    $userId = $user['UserID'];

    $data = json_decode(file_get_contents("php://input"), true);
    $currentPassword = $data['current_password'] ?? '';
    $newPassword = $data['new_password'] ?? '';

    if (!$currentPassword || !$newPassword) {
        echo json_encode([
            "success" => false,
            "message" => "Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới"
        ]);
        exit;
    }

    $query = "SELECT Password FROM Users WHERE UserID = ? LIMIT 1";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $userId);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $row = mysqli_fetch_assoc($result);

    if (!$row || !password_verify($currentPassword, $row['Password'])) {
        echo json_encode([
            "success" => false,
            "message" => "Mật khẩu hiện tại không đúng"
        ]);
        exit;
    }

    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    $updateQuery = "UPDATE Users SET Password = ? WHERE UserID = ?";
    $stmt = mysqli_prepare($conn, $updateQuery);
    mysqli_stmt_bind_param($stmt, "si", $hashedPassword, $userId);
    $success = mysqli_stmt_execute($stmt);

    if ($success) {
        echo json_encode([
            "success" => true,
            "message" => "Đổi mật khẩu thành công"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Lỗi khi cập nhật mật khẩu"
        ]);
    }
?>
