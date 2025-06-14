<?php
    require __DIR__ . '/../../vendor/autoload.php';
    use Twilio\Rest\Client;

    function sendOtpSMS($toPhone, $otp) {
        $sid = 'YOUR_TWILIO_SID';
        $token = 'YOUR_TWILIO_AUTH_TOKEN';
        $from = '+1XXX...'; // Số Twilio

        $client = new Client($sid, $token);

        try {
            $client->messages->create(
                $toPhone,
                [
                    'from' => $from,
                    'body' => "Mã OTP của bạn là: $otp. Có hiệu lực trong 10 phút."
                ]
            );
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
?>