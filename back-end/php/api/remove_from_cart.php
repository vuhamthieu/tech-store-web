<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth.php';

    $user = authenticate();
    $userId = $user['UserID'];
    $productId = intval($_POST['productId'] ?? 0);

    if ($userId <= 0 || $productId <= 0) {
        echo json_encode(["error" => "Thiếu userId hoặc productId"]);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM Cart WHERE UserID = ? AND ProductID = ?");
    $stmt->bind_param("ii", $userId, $productId);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Không tìm thấy sản phẩm trong giỏ"]);
    }

    $stmt->close();
?>
