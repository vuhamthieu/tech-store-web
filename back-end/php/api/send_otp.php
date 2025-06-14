<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/mail_helper.php';
    include __DIR__ . '/sms_helper.php';

    $data = json_decode(file_get_contents("php://input"), true);
    $contact = trim($data['contact'] ?? '');

    if (empty($contact)) {
        echo json_encode(["success" => false, "message" => "Vui lòng nhập email hoặc số điện thoại."]);
        exit;
    }

    $isEmail = filter_var($contact, FILTER_VALIDATE_EMAIL);
    $isPhone = preg_match('/^[0-9]{9,12}$/', $contact);

    // Tìm user theo email hoặc phone
    $stmt = $conn->prepare("SELECT UserID FROM Users WHERE Email = ? OR Phone = ?");
    $stmt->bind_param("ss", $contact, $contact);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Không tìm thấy người dùng."]);
        exit;
    }

    $userId = $result->fetch_assoc()['UserID'];

    // Tạo OTP và lưu
    $otp = random_int(100000, 999999);
    $expiresAt = date('Y-m-d H:i:s', strtotime('+10 minutes'));

    $insert = $conn->prepare("
        INSERT INTO UserTokens (UserID, AccessToken, AccessTokenExpiresAt, DeviceInfo)
        VALUES (?, ?, ?, 'ResetPasswordOTP')
    ");
    $insert->bind_param("iss", $userId, $otp, $expiresAt);
    $insert->execute();

    // Gửi OTP
    if ($isEmail) {
        if (sendOtpEmail($contact, $otp)) {
            echo json_encode(["success" => true, "message" => "Đã gửi OTP đến email.", "otp" => $otp]);
        } else {
            echo json_encode(["success" => false, "message" => "Gửi email thất bại.", "otp" => $otp]);
        }
    } elseif ($isPhone) {
        $formattedPhone = '+84' . ltrim($contact, '0');
        if (sendOtpSMS($formattedPhone, $otp)) {
            echo json_encode(["success" => true, "message" => "Đã gửi OTP qua SMS.", "otp" => $otp]);
        } else {
            echo json_encode(["success" => false, "message" => "Gửi SMS thất bại.", "otp" => $otp]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Không đúng định dạng email hoặc SĐT."]);
    }
?>