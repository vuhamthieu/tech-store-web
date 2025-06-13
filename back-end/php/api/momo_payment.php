<?php
    include __DIR__ . '/../connect.php';

    $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create"; //fake

    $partnerCode = "MOMOXNQH20200511"; //fake
    $accessKey = "F8BBA842ECF85"; //fake
    $secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"; //fake

    $orderId = time();
    $requestId = time() . "_request";
    $amount = $_POST['amount'] ?? '0';
    $orderInfo = $_POST['order_info'] ?? "Thanh toan don hang";
    $returnUrl = "https://yourdomain.com/payment_return.php"; //fake
    $notifyUrl = "https://yourdomain.com/payment_ipn.php"; //fake
    $extraData = bin2hex(random_bytes(8)); 

    // Tạo chữ ký
    $rawHash = "accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$notifyUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$returnUrl&requestId=$requestId&requestType=captureWallet";
    $signature = hash_hmac("sha256", $rawHash, $secretKey);

    $data = [
        'partnerCode' => $partnerCode,
        'accessKey' => $accessKey,
        'requestId' => $requestId,
        'amount' => $amount,
        'orderId' => $orderId,
        'orderInfo' => $orderInfo,
        'redirectUrl' => $returnUrl,
        'ipnUrl' => $notifyUrl,
        'extraData' => $extraData,
        'requestType' => "captureWallet",
        'signature' => $signature,
        'lang' => 'vi'
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
            "payment_token" => $extraData
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => $result['message'] ?? 'Lỗi khởi tạo thanh toán'
        ]);
    }
?>