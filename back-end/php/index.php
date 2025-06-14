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

        case 'api/logout':
            require 'api/logout.php';
            break;

        case 'api/send-otp':
            require 'api/send_otp.php';
            break;

        case 'api/reset-password':
            require 'api/reset_password.php';
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

        case 'api/use-coupon':
            require 'api/use_coupon.php';
            break;

        case 'api/get-info-user':
            require 'api/get_info_user.php';
            break;

        case 'api/confirm-payment':
            require 'api/confirm_payment.php';
            break;

        case 'api/place-order':
            require 'api/place_order.php';
            break;

        case 'api/momo-payment':
            require 'api/momo_payment.php';
            break;

        case 'api/visa-payment':
            require 'api/visa_payment.php';
            break;

        case 'api/store-payment-token':
            require 'api/store_payment_token.php';
            break;

        case 'api/update-info-user':
            require 'api/update_info_user.php';
            break;
        
        case 'api/update-password-user':
            require 'api/update_password_user.php';
            break;

        case 'api/update-avatar-user':
            require 'api/update_avatar_user.php';
            break;

        case 'api/add-favorite-product':
            require 'api/add_favorite_product.php';
            break;  

        case 'api/remove-favorite-product':
            require 'api/remove_favorite_product.php';
            break;

        case 'api/get-orders-with-detail':
            require 'api/get_orders_with_detail.php';
            break;
        
        case 'api/get-favorite-products':
            require 'api/get_favorite_products.php';
            break;

        case 'api/get-notification':
            require 'api/get_notification.php';
            break;

        case 'api/delete-noti':
            require 'api/delete_noti.php';
            break;
        
        case 'api/mark-noti-is-read':
            require 'api/mark_noti_is_read.php';
            break;
        
        case 'api/get-dashboard-overview':
            require 'api/get_dashboard_overview.php';
            break;

        case 'api/get-all-orders':
            require 'api/get_all_orders.php';
            break;

        case 'api/get-all-products':
            require 'api/get_all_products.php';
            break;

        case 'api/get-all-users':
            require 'api/get_all_users.php';
            break;

        case 'api/update-info-product':
            require 'api/update_info_product.php';
            break;

        case 'api/add-product':
            require 'api/add_product.php';
            break;

        case 'api/delete-product':
            require 'api/delete_product.php';
            break;

        case 'api/delete-order':
            require 'api/delete_order.php';
            break;

        case 'api/disable-user':
            require 'api/disable_user.php';
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