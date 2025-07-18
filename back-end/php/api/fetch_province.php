<?php
    include __DIR__ . '/../connect.php';

    $path = $_GET['path'] ?? ''; // /p/1 hoặc /d/1
    $depth = 2;

    // Base URL API gốc
    $baseUrl = 'https://provinces.open-api.vn/api/';

    if ($path === '') {
        $url = $baseUrl;
    }else $url = $baseUrl . $path . '?depth=' . $depth;

    $response = file_get_contents($url);

    if ($response !== false) {
        echo $response;
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Không thể lấy dữ liệu từ API gốc"
        ]);
    }
?>