<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../../vendor/autoload.php';

function sendOtpEmail($toEmail, $otp)
{
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'your_gmail@gmail.com';
        $mail->Password   = 'your_app_password';
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;

        $mail->setFrom('your_gmail@gmail.com', 'Your App Name');
        $mail->addAddress($toEmail);
        $mail->isHTML(true);
        $mail->Subject = 'Mã OTP đặt lại mật khẩu';
        $mail->Body    = "Mã OTP của bạn là: <b>$otp</b><br>Hiệu lực trong 10 phút.";

        $mail->send();
        return true;
    } catch (Exception $e) {
        return false;
    }
}
