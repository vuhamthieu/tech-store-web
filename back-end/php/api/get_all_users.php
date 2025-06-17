<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth_admin.php';

    $admin = authenticateAdmin();

    $query = "SELECT 
            UserID, 
            FullName, 
            Email, 
            Phone, 
            Avatar, 
            Gender, 
            Address,
            CreatedAt  
          FROM Users 
          WHERE RoleID = 1";

    $result = $conn->query($query);

    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = [
            "user_id"  => intval($row['UserID']),
            "full_name" => $row['FullName'],
            "email"     => $row['Email'],
            "phone"     => $row['Phone'],
            "avatar"    => $row['Avatar'],
            "gender"    => $row['Gender'],
            "address"   => $row['Address'],
        ];
    }

    echo json_encode([
        "success" => true,
        "data" => $users
    ]);
?>
