<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth.php';

    $user = authenticate();
    $userId = $user['UserID'];
    $productId = intval($_POST['productId'] ?? 0);
    $quantity  = max(1, intval($_POST['quantity'] ?? 1));

    if ($userId <= 0 || $productId <= 0) {
        echo json_encode(["error" => "Thiếu userId hoặc productId"]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE Cart SET Quantity = ? WHERE UserID = ? AND ProductID = ?");
    $stmt->bind_param("iii", $quantity , $userId, $productId);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Không tìm thấy sản phẩm trong giỏ"]);
    }

    $stmt->close();
?>
