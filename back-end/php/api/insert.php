<?php
include __DIR__ . '/../connect.php';

$email = "a2@gmail.com";
$phone = "0900000011";
$fullname = "Nguyen Van A";
$password = password_hash("123456", PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO Users (FullName, Email, Phone, Password) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $fullname, $email, $phone, $password);
$stmt->execute();

echo "Đã thêm user thành công.";
