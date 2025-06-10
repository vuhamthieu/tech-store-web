
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
    