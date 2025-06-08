<?php
    include __DIR__ . '/../connect.php';   

    $data = json_decode(file_get_contents('php://input'), true);

    $username = $data['username'] ?? '';
    $email    = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    $role     = $data['role'] ?? 1;

    // Kiểm tra dữ liệu đầu vào
    if (!$username || !$email || !$password) {
        echo json_encode([
            "success" => false,
            "message" => "Vui lòng nhập đầy đủ username, email và password"
        ]);
        exit;
    }

    // Kiểm tra email đã tồn tại chưa
    $checkQuery = "SELECT UserID FROM Users WHERE Email = ?";
    $stmt = mysqli_prepare($conn, $checkQuery);
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);

    if (mysqli_stmt_num_rows($stmt) > 0) {
        echo json_encode([
            "success" => false,
            "message" => "Email đã được sử dụng"
        ]);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    //thêm user
    $insertQuery = "INSERT INTO Users (FullName, Email, Password, RoleID) VALUES (?, ?, ?, ?)";
    $stmt = mysqli_prepare($conn, $insertQuery);
    mysqli_stmt_bind_param($stmt, "sssi", $username, $email, $hashedPassword, $role);
    $success = mysqli_stmt_execute($stmt);

    //response
    if ($success) {
        echo json_encode([
            "success" => true,
            "message" => "Đăng ký thành công"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Lỗi khi đăng ký người dùng"
        ]);
    }
?>