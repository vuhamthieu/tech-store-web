<?php
    include __DIR__ . '/../connect.php';

    $data = json_decode(file_get_contents("php://input"), true);
    $contact = trim($data['contact'] ?? '');
    $otp = $data['otp'] ?? '';
    $newPassword = $data['newPassword'] ?? '';

    if (empty($contact) || empty($otp) || empty($newPassword)) {
        echo json_encode(["success" => false, "message" => "Thiếu thông tin."]);
        exit;
    }

    $stmt = $conn->prepare("SELECT UserID FROM Users WHERE Email = ? OR Phone = ?");
    $stmt->bind_param("ss", $contact, $contact);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Không tìm thấy người dùng."]);
        exit;
    }

    $userId = $result->fetch_assoc()['UserID'];

    //token là OTP
    $check = $conn->prepare("
        SELECT TokenID FROM UserTokens 
        WHERE UserID = ? AND AccessToken = ? AND IsRevoked = 0 AND AccessTokenExpiresAt > NOW()
    ");
    $check->bind_param("is", $userId, $otp);
    $check->execute();
    $res = $check->get_result();

    if ($res->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "OTP không hợp lệ hoặc đã hết hạn."]);
        exit;
    }

    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    $update = $conn->prepare("UPDATE Users SET Password = ? WHERE UserID = ?");
    $update->bind_param("si", $hashedPassword, $userId);
    $update->execute();

    // Vô hiệu hóa token
    $revoke = $conn->prepare("UPDATE UserTokens SET IsRevoked = 1 WHERE UserID = ? AND AccessToken = ?");
    $revoke->bind_param("is", $userId, $otp);
    $revoke->execute();

    echo json_encode(["success" => true, "message" => "Mật khẩu đã được cập nhật."]);
?>