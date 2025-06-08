<?php
    $request = $_SERVER['REQUEST_URI'];
    $scriptName = dirname($_SERVER['SCRIPT_NAME']);

    // Lấy phần path, bỏ query param
    $fullPath = parse_url($request, PHP_URL_PATH);

    // Bỏ phần script path gốc, lấy phần còn lại
    $path = substr($fullPath, strlen($scriptName));
    $path = trim($path, '/');

    // Switch như cũ
    switch ($path) {
        case 'api/login':   
            require 'api/login.php';
            break;

        case 'api/register':
            require 'api/register.php';
            break;

        case 'api/products':
            require 'api/products.php';
            break;

        case 'api/product-detail':
            require 'api/product_detail.php';
            break;

        case 'api/product-suggest':
            require 'api/product-suggest.php';
            break;
        case 'api/add-to-cart':
            require 'api/add-to-cart.php';
            break;

        default:
            http_response_code(404);
            echo json_encode([
                "status" => "error",
                "message" => "API not found"
            ]);
            break;
    }
?>