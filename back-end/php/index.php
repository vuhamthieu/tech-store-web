<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// Lấy path từ URL
$request = $_SERVER['REQUEST_URI'];
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
$path = substr($request, strlen($scriptName));
$path = trim($path, '/');

// Điều hướng các route
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