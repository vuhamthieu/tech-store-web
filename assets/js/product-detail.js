function changeImage(src) {
    document.getElementById('mainImage').src = src;
    
    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
        thumb.classList.remove('active');
        if (thumb.onclick.toString().includes(src)) {
            thumb.classList.add('active');
        }
    });
}

function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    quantityInput.value = parseInt(quantityInput.value) + 1;
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
    }
}

// Thêm sự kiện cho nút thêm vào giỏ hàng
document.querySelector('.add-to-cart').addEventListener('click', function() {
    const quantity = document.getElementById('quantity').value;
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
    // Thêm logic xử lý giỏ hàng ở đây
});

// Thêm sự kiện cho nút mua ngay
document.querySelector('.buy-now').addEventListener('click', function() {
    const quantity = document.getElementById('quantity').value;
    alert(`Chuyển đến trang thanh toán với ${quantity} sản phẩm`);
    // Thêm logic chuyển trang thanh toán ở đây
});
document.getElementById("reviewForm").addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Cảm ơn bạn đã gửi đánh giá!");
    // TODO: Gửi dữ liệu về server hoặc hiển thị lên giao diện
  });
// Cập nhật tồn kho động nếu cần từ dữ liệu backend
document.getElementById("stockCount").textContent = "Còn 125 sản phẩm";
  