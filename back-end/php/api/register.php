<?php
    include __DIR__ . '/../connect.php';   

    $data = json_decode(file_get_contents('php://input'), true);

    $username = $data['username'] ?? '';
    $inputUser = $data['user'] ?? ''; //email hoặc số điện thoại
    $password = $data['password'] ?? '';
    $role     = $data['role'] ?? 1;
    $avatar = $data['avatar'] ?? 'logo.png';

    if (!$username || !$inputUser || !$password) {
        echo json_encode([
            "success" => false,
            "message" => "Vui lòng nhập đầy đủ username, email hoặc số điện thoại và password"
        ]);
        exit;
    }

    $checkQuery = "SELECT UserID FROM Users WHERE Email = ? OR Phone = ? LIMIT 1";
    $stmt = mysqli_prepare($conn, $checkQuery);
    mysqli_stmt_bind_param($stmt, "ss", $inputUser, $inputUser);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);

    if (mysqli_stmt_num_rows($stmt) > 0) {
        echo json_encode([
            "success" => false,
            "message" => "Email hoặc số điện thoại đã được sử dụng"
        ]);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $isEmail = filter_var($inputUser, FILTER_VALIDATE_EMAIL);
    $isPhone = preg_match('/^[0-9]{9,12}$/', $inputUser);

    if (!$isEmail && !$isPhone) {
        echo json_encode(["success" => false, "message" => "Vui lòng nhập email hợp lệ hoặc số điện thoại hợp lệ"]);
        exit;
    }

    $insertQuery = "";
    if ($isEmail) {
        $insertQuery = "INSERT INTO Users (FullName, Email, Password, RoleID, Avatar) VALUES (?, ?, ?, ?, ?)";
    } else {
        $insertQuery = "INSERT INTO Users (FullName, Phone, Password, RoleID, Avatar) VALUES (?, ?, ?, ?, ?)";
    }   
    $stmt = mysqli_prepare($conn, $insertQuery);
    mysqli_stmt_bind_param($stmt, "ssiss", $username, $inputUser, $hashedPassword, $role, $avatar);
    $success = mysqli_stmt_execute($stmt);

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