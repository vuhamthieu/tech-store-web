<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth.php';

    $user = authenticate();
    $userId = $user['UserID'];

    $data = json_decode(file_get_contents("php://input"), true);

    $fullName = $data['full_name'] ?? '';
    $phone    = $data['phone'] ?? '';
    $email    = $data['email'] ?? '';
    $gender   = $data['gender'] ?? null;
    $address  = $data['address'] ?? '';

    if (!$fullName) {
        echo json_encode([
            "success" => false,
            "message" => "Vui lòng nhập đầy đủ Họ tên"
        ]);
        exit;
    }

    $query = "UPDATE Users 
              SET FullName = ?, Phone = ?, Email = ?, Gender = ?, Address = ?
              WHERE UserID = ?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "sssssi", $fullName, $phone, $email, $gender, $address, $userId);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode([
            "success" => true,
            "message" => "Cập nhật thông tin thành công."
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Lỗi khi cập nhật thông tin người dùng."
        ]);
    }
?>
