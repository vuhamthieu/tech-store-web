
        // Thumbnail click event
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('mainProductImage');
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Remove active class from all thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                this.classList.add('active');
                
                // Change main image
                const imgSrc = this.querySelector('img').getAttribute('data-large');
                mainImage.src = imgSrc;
            });
        });
        
        // Quantity selector
        const decreaseBtn = document.getElementById('decreaseQty');
        const increaseBtn = document.getElementById('increaseQty');
        const quantityInput = document.getElementById('productQty');
        
        decreaseBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });
        
        increaseBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value < 10) {
                quantityInput.value = value + 1;
            }
        });
        
        // Variant selection
        const variantOptions = document.querySelectorAll('.variant-option:not(.disabled)');
        
        variantOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Find parent options container
                const optionsContainer = this.parentElement;
                
                // Remove selected class from all options in this container
                optionsContainer.querySelectorAll('.variant-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Add selected class to clicked option
                this.classList.add('selected');
            });
        });
        
        // Add to cart button
        const addToCartBtn = document.querySelector('.add-to-cart');
        addToCartBtn.addEventListener('click', function() {
            alert('Sản phẩm đã được thêm vào giỏ hàng!');
        });
        
        // Buy now button
        const buyNowBtn = document.querySelector('.buy-now');
        buyNowBtn.addEventListener('click', function() {
            alert('Chuyển đến trang thanh toán!');
        });
    // JavaScript cho phần đánh giá
    document.addEventListener('DOMContentLoaded', function() {
    // Xử lý rating stars
 document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.rating-input .star');
    const ratingInput = document.getElementById('reviewRating');
    
    // Xử lý khi di chuột qua sao
    stars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const value = parseInt(this.getAttribute('data-value'));
            
            // Xóa tất cả class hover trước đó
            stars.forEach(s => s.classList.remove('hover'));
            
            // Thêm class hover cho tất cả sao từ 1 đến value
            for (let i = 0; i < value; i++) {
                stars[i].classList.add('hover');
            }
        });
        
        star.addEventListener('mouseout', function() {
            // Xóa tất cả class hover khi chuột rời khỏi
            stars.forEach(s => s.classList.remove('hover'));
            
            // Nếu đã chọn rating, hiển thị lại các sao đã chọn
            if (ratingInput.value > 0) {
                for (let i = 0; i < ratingInput.value; i++) {
                    stars[i].classList.add('active');
                }
            }
        });
        
        star.addEventListener('click', function() {
            const value = parseInt(this.getAttribute('data-value'));
            ratingInput.value = value;
            
            // Xóa tất cả class active trước đó
            stars.forEach(s => s.classList.remove('active'));
            
            // Thêm class active cho tất cả sao từ 1 đến value
            for (let i = 0; i < value; i++) {
                stars[i].classList.add('active');
            }
        });
    });
});
    
    // Xử lý tải ảnh
    const uploadPlaceholder = document.querySelector('.upload-placeholder');
    const fileInput = document.getElementById('reviewImages');
    
    uploadPlaceholder.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
        const files = this.files;
        const uploadPreview = document.querySelector('.upload-preview');
        
        // Xóa placeholder nếu có ảnh được chọn
        if (files.length > 0) {
            uploadPreview.innerHTML = '';
        }
        
        // Hiển thị preview ảnh
        for (let i = 0; i < Math.min(files.length, 3); i++) {
            const file = files[i];
            if (file.type.match('image.*')) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const imgContainer = document.createElement('div');
                    imgContainer.className = 'uploaded-image';
                    imgContainer.innerHTML = `
                        <img src="${e.target.result}" alt="Preview">
                        <button class="remove-image-btn">&times;</button>
                    `;
                    uploadPreview.appendChild(imgContainer);
                    
                    // Xử lý xóa ảnh
                    imgContainer.querySelector('.remove-image-btn').addEventListener('click', function() {
                        imgContainer.remove();
                        if (uploadPreview.children.length === 0) {
                            uploadPreview.innerHTML = `
                                <div class="upload-placeholder">
                                    <i class="fas fa-camera"></i>
                                    <span>Thêm ảnh</span>
                                </div>
                            `;
                        }
                    });
                };
                
                reader.readAsDataURL(file);
            }
        }
    });
    
    // Xử lý gửi đánh giá
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Xử lý gửi dữ liệu đánh giá ở đây
            alert('Cảm ơn bạn đã đánh giá sản phẩm!');
            this.reset();
            
            // Reset stars
            stars.forEach(star => star.classList.remove('active'));
            ratingInput.value = '0';
            
            // Reset ảnh
            const uploadPreview = document.querySelector('.upload-preview');
            uploadPreview.innerHTML = `
                <div class="upload-placeholder">
                    <i class="fas fa-camera"></i>
                    <span>Thêm ảnh</span>
                </div>
            `;
        });
    }
    
    // Xử lý nút hữu ích
    document.querySelectorAll('.helpful-btn, .not-helpful-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Xử lý đếm like/dislike ở đây
            const countSpan = this.querySelector('span') || this;
            let count = parseInt(countSpan.textContent.match(/\d+/)[0] || 0;
            count++;
            this.textContent = this.textContent.replace(/\d+/, count);
            
            // Thêm lớp active để đổi màu
            this.classList.add('active');
        });
    });
});