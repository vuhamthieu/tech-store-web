<?php
include __DIR__ . '/../connect.php';

$email    = "a2@gmail.com";
$phone    = "0900000011";
$fullname = "Nguyen Van A";
$password = password_hash("123456", PASSWORD_DEFAULT);
$roleID   = 2; // Đảm bảo RoleID này đã tồn tại trong bảng Roles

$stmt = $conn->prepare("INSERT INTO Users (FullName, Email, Phone, Password, RoleID) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("ssssi", $fullname, $email, $phone, $password, $roleID);
$stmt->execute();

echo "✅ Đã thêm user thành công.";
?>
