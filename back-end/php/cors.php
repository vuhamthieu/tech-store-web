<?php
// Cho phép mọi nguồn gốc hoặc thay * bằng domain cụ thể
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Nếu là preflight (OPTIONS), trả về 200 OK
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
?>
