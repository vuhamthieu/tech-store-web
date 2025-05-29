<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// Lấy path từ URL
$request = $_SERVER['REQUEST_URI'];
$parsed = parse_url($request);
$path = trim($parsed['path'], '/');

// Điều hướng các route
switch ($path) {
    case 'api/login':   
        require 'api/login.php';
        break;

    case 'api/register':
        require 'api/register.php';
        break;

    case 'api/get-products':
        require 'api/get-products.php';
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