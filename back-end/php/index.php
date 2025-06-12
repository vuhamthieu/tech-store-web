<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    header("Access-Control-Allow-Headers: *");

    $request = $_SERVER['REQUEST_URI'];
    $scriptName = dirname($_SERVER['SCRIPT_NAME']);

    // Lấy phần path, bỏ query param
    $fullPath = parse_url($request, PHP_URL_PATH);

    // Bỏ phần script path gốc, lấy phần còn lại
    $path = substr($fullPath, strlen($scriptName));
    $path = trim($path, '/');

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

        case 'api/product-details':
            require 'api/product_details.php';
            break;

        case 'api/product-suggest':
            require 'api/product_suggest.php';
            break;

        case 'api/add-review':
            require 'api/add_review.php';
            break;

        case 'api/get-reviews':
            require 'api/get_reviews.php';
            break;

        case 'api/add-to-cart':
            require 'api/add_to_cart.php';
            break;
        
        case 'api/remove-from-cart':
            require 'api/remove_from_cart.php';
            break;

        case 'api/update-cart-quantity':
            require 'api/update_cart_quantity.php';
            break;
        
        case 'api/cart':
            require 'api/cart.php';
            break;

        case 'me':
            require 'me.php';
            break;
            
        case 'refresh-token':
            require 'refresh_token.php';
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