<?php
    include __DIR__ . '/../connect.php';

    $endpoint = "https://sandbox.visapay.vn/api/checkout"; //fake
    $apiKey = "your_api_key_here";
    $secretKey = "your_secret_key_here";

    $amount = $_POST['amount'] ?? '0';
    $orderInfo = $_POST['order_info'] ?? "Thanh toán Visa";
    $returnUrl = "https://yourdomain.com/visa_return.php"; //fake
    $notifyUrl = "https://yourdomain.com/visa_ipn.php"; //fake

    $orderId = time();
    $requestId = uniqid("visa_");
    $paymentToken = bin2hex(random_bytes(8));

    $rawData = "apiKey=$apiKey&amount=$amount&orderId=$orderId&requestId=$requestId";
    $signature = hash_hmac("sha256", $rawData, $secretKey);

    $data = [
        "apiKey" => $apiKey,
        "amount" => $amount,
        "orderId" => $orderId,
        "requestId" => $requestId,
        "orderInfo" => $orderInfo,
        "returnUrl" => $returnUrl,
        "notifyUrl" => $notifyUrl,
        "signature" => $signature,
        "extraData" => $paymentToken
    ];

    $ch = curl_init($endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    $response = curl_exec($ch);
    curl_close($ch);

    $result = json_decode($response, true);

    if (isset($result['payUrl'])) {
        echo json_encode([
            "success" => true,
            "pay_url" => $result['payUrl'],
            "order_id" => $orderId,
            "payment_token" => $paymentToken
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => $result['message'] ?? 'Lỗi khởi tạo thanh toán Visa'
        ]);
    }
?>
