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

        $stmt = $conn->prepare("SELECT Quantity FROM Cart WHERE UserID = ? AND ProductID = ? AND Options = ?");
        $stmt->bind_param("iis", $userId, $productId, $options);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            // Product with these specific options already in cart, so update quantity
            $stmt->close();
            $stmt = $conn->prepare("UPDATE Cart SET Quantity = Quantity + ? WHERE UserID = ? AND ProductID = ? AND Options = ?");
            $stmt->bind_param("iiis", $quantity, $userId, $productId, $options);
        } else {
            // New product or new options for an existing product, so insert new row
            $stmt->close();
            $stmt = $conn->prepare("INSERT INTO Cart (UserID, ProductID, Quantity, Options) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("iiis", $userId, $productId, $quantity, $options);
        }

        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Giỏ hàng đã được cập nhật"]);
        } else {
            // This can happen if the insert/update fails, or if quantity doesn't change.
            // For the user, we can treat it as a success if no error was thrown.
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
