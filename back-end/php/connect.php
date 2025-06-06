<?php
$host = "localhost";
$user = "root";
$pass = "";
$database = "db_tech_store_web";
$conn = new mysqli($host, $user, $pass, $database);

if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
}
echo "Kết nối thành công\n";
$conn->set_charset("utf8");

?>