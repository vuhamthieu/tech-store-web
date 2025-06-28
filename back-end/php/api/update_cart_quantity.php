<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth.php';

    $user = authenticate();
    $userId = $user['UserID'];
    $productId = intval($_POST['productId'] ?? 0);
    $quantity = max(1, intval($_POST['quantity'] ?? 1));
    $options = trim($_POST['options'] ?? '');

    if ($userId <= 0 || $productId <= 0) {
        echo json_encode(["error" => "Thiếu userId hoặc productId"]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE Cart SET Quantity = ? WHERE UserID = ? AND ProductID = ? AND Options = ?");
    $stmt->bind_param("iiis", $quantity, $userId, $productId, $options);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Không tìm thấy sản phẩm trong giỏ"]);
    }

    $stmt->close();
?>
