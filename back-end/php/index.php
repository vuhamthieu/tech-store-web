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
        //đăng nhập
        case 'api/login':   
            require 'api/login.php';
            break;

        //đăng ký
        case 'api/register':
            require 'api/register.php';
            break;

        //đăng xuất
        case 'api/logout':
            require 'api/logout.php';
            break;

        //gửi otp
        case 'api/send-otp':
            require 'api/send_otp.php';
            break;

        //cập nhật mật khẩu
        case 'api/reset-password':
            require 'api/reset_password.php';
            break;

        //danh sách sản phẩm
        case 'api/products':
            require 'api/products.php';
            break;

        //chi tiết sản phẩm
        case 'api/product-details':
            require 'api/product_details.php';
            break;

        //gợi ý sản phẩm
        case 'api/product-suggest':
            require 'api/product_suggest.php';
            break;

        //thêm đánh giá
        case 'api/add-review':
            require 'api/add_review.php';
            break;

        //danh sách đánh giá
        case 'api/get-reviews':
            require 'api/get_reviews.php';
            break;

        //thêm sản phẩm vào giỏ hàng
        case 'api/add-to-cart':
            require 'api/add_to_cart.php';
            break;
        
        //xóa sản phẩm trong giỏ hàng
        case 'api/remove-from-cart':
            require 'api/remove_from_cart.php';
            break;

        //cập nhật số lượng trong giỏ hàng
        case 'api/update-cart-quantity':
            require 'api/update_cart_quantity.php';
            break;
        
        //danh sách sản phẩm trong giỏ hàng
        case 'api/cart':
            require 'api/cart.php';
            break;

        //áp mã giảm giá
        case 'api/use-coupon':
            require 'api/use_coupon.php';
            break;

        //lấy thông tin người dùng
        case 'api/get-info-user':
            require 'api/get_info_user.php';
            break;

        //xác nhận thanh toán
        case 'api/confirm-payment':
            require 'api/confirm_payment.php';
            break;

        //đặt hàng
        case 'api/place-order':
            require 'api/place_order.php';
            break;

        //thanh toán momo
        case 'api/momo-payment':
            require 'api/momo_payment.php';
            break;

        //thanh toán visa
        case 'api/visa-payment':
            require 'api/visa_payment.php';
            break;

        //lưu payment token thanh toán online thành công 
        case 'api/store-payment-token':
            require 'api/store_payment_token.php';
            break;

        //cập nhật thông tin người dùng
        case 'api/update-info-user':
            require 'api/update_info_user.php';
            break;
        
        //đổi mật khẩu
        case 'api/update-password-user':
            require 'api/update_password_user.php';
            break;

        //đổi avatar
        case 'api/update-avatar-user':
            require 'api/update_avatar_user.php';
            break;

        //thêm sản phẩm thích
        case 'api/add-favorite-product':
            require 'api/add_favorite_product.php';
            break;  

        //xóa sản phẩm thích
        case 'api/remove-favorite-product':
            require 'api/remove_favorite_product.php';
            break;

        //lấy danh sách đơn hàng của người dùng
        case 'api/get-orders-with-detail':
            require 'api/get_orders_with_detail.php';
            break;
        
        //lấy danh sách sản phẩm thích
        case 'api/get-favorite-products':
            require 'api/get_favorite_products.php';
            break;

        //lấy danh sách thông báo của người dùng
        case 'api/get-notification':
            require 'api/get_notification.php';
            break;

        //thêm thông báo
        case 'api/add-notification':
            require 'api/add_notification.php';
            break;

        //xóa thông báo
        case 'api/delete-noti':
            require 'api/delete_noti.php';
            break;
        
        //đánh dấu đã đọc thông báo
        case 'api/mark-noti-is-read':
            require 'api/mark_noti_is_read.php';
            break;
        
        //lấy thông tin tổng quan dashboard
        case 'api/get-dashboard-overview':
            require 'api/get_dashboard_overview.php';
            break;

        //lấy danh sách toàn bộ đơn hàng
        case 'api/get-all-orders':
            require 'api/get_all_orders.php';
            break;

        //lấy danh sách toàn bộ sản phẩm
        case 'api/get-all-products':
            require 'api/get_all_products.php';
            break;

        //lấy danh sách toàn bộ người dùng
        case 'api/get-all-users':
            require 'api/get_all_users.php';
            break;

        //cập nhật thông tin sản phẩm
        case 'api/update-info-product':
            require 'api/update_info_product.php';
            break;

        //thêm sản phẩm mới
        case 'api/add-product':
            require 'api/add_product.php';
            break;

        //xóa sản phẩm
        case 'api/delete-product':
            require 'api/delete_product.php';
            break;

        //xóa đơn hàng
        case 'api/delete-order':
            require 'api/delete_order.php';
            break;

        //vô hiệu hóa người dùng
        case 'api/disable-user':
            require 'api/disable_user.php';
            break;

        //trả về thông tin người dùng qua access token
        case 'me':
            require 'me.php';
            break;
        
        //tạo mới access token
        case 'refresh-token':
            require 'refresh_token.php';
            break;

        //duyệt đơn hàng
        case 'api/approve-order':
            require 'api/approve_order.php';
            break;

        //từ chối đơn hàng
        case 'api/decline-order':
            require 'api/decline_order.php';
            break;

        //kích hoạt người dùng
        case 'api/enable-user':
            require 'api/enable_user.php';
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