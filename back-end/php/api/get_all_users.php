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
            CreatedAt,
            IsDisabled
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
            "created_at" => $row['CreatedAt'],
            "is_disabled" => intval($row['IsDisabled']) === 1
        ];
    }

    echo json_encode([
        "success" => true,
        "data" => $users
    ]);
?>
