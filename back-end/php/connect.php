<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "sql12787720";
$user = "sql12787720";
$pass = "thieu1807";
$database = "sql12787720";
$conn = new mysqli($host, $user, $pass, $database);

if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
}
$conn->set_charset("utf8");



