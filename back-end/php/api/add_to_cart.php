<?php
    include __DIR__ . '/../connect.php';
    include __DIR__ . '/../auth.php';

    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Invalid JSON received"]);
            exit;
        }
        
        $user = authenticate();
        $userId = $user['UserID'];
        $productId = intval($data['product_id'] ?? 0);
        $options = trim($data['options'] ?? ''); 
        $quantity = max(1, intval($data['quantity'] ?? 1));

        if ($userId <= 0 || $productId <= 0) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Thiếu ID người dùng hoặc ID sản phẩm"]);
            exit;
        }

        // Kiểm tra xem sản phẩm với options này đã có trong giỏ hàng chưa
        $stmt = $conn->prepare("SELECT Quantity FROM Cart WHERE UserID = ? AND ProductID = ? AND Options = ?");
        $stmt->bind_param("iis", $userId, $productId, $options);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Sản phẩm đã có, cập nhật số lượng
            $currentQuantity = $result->fetch_assoc()['Quantity'];
            $newQuantity = $currentQuantity + $quantity;
            
            $stmt = $conn->prepare("UPDATE Cart SET Quantity = ? WHERE UserID = ? AND ProductID = ? AND Options = ?");
            $stmt->bind_param("iiis", $newQuantity, $userId, $productId, $options);
        } else {
            // Sản phẩm chưa có, thêm mới
            $stmt = $conn->prepare("INSERT INTO Cart (UserID, ProductID, Quantity, Options) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("iiis", $userId, $productId, $quantity, $options);
        }

        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Giỏ hàng đã được cập nhật"]);
        } else {
            echo json_encode(["success" => true, "message" => "Sản phẩm đã có trong giỏ hàng"]);
        }

        $stmt->close();
        
    } catch (mysqli_sql_exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Lỗi cơ sở dữ liệu: " . $e->getMessage()]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Lỗi server: " . $e->getMessage()]);
    }
?>
