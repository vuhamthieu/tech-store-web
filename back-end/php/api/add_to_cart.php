<?php
    include __DIR__ . '/../connect.php';

    $userId    = intval($_POST['userId'] ?? 0);
    $productId = intval($_POST['productId'] ?? 0);
    $options = intval($_POST['options'] ?? ""); //Ví dụ: 256GB, Trắng
    $quantity  = max(1, intval($_POST['quantity'] ?? 1));

    if ($userId <= 0 || $productId <= 0) {
        echo json_encode(["error" => "Thiếu userId hoặc productId"]);
        exit;
    }

    $stmt = $conn->prepare("SELECT Quantity FROM Cart WHERE UserID = ? AND ProductID = ? AND Options = ?");
    $stmt->bind_param("iis", $userId, $productId, $options);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        //cập nhật số lượng
        $stmt->close();
        $stmt = $conn->prepare("UPDATE Cart SET Quantity = Quantity + ? WHERE UserID = ? AND ProductID = ?");
        $stmt->bind_param("iii", $quantity, $userId, $productId);
        $stmt->execute();
    } else {
        //thêm mới
        $stmt->close();
        $stmt = $conn->prepare("INSERT INTO Cart (UserID, ProductID, Quantity, Options) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("iii", $userId, $productId, $quantity, $options);
        $stmt->execute();
    }

    $stmt->close();
    echo json_encode(["success" => true]);
?>
