document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('.main-nav .container').prepend(mobileMenuBtn);
    
    mobileMenuBtn.addEventListener('click', function() {
        document.querySelector('.nav-menu').classList.toggle('show');
    });
    
    // Product quick view modal
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quick-view') || 
            e.target.closest('.quick-view')) {
            // In a real implementation, this would show a modal with product details
            alert('Tính năng xem nhanh sản phẩm sẽ hiển thị tại đây');
        }
        
        if (e.target.classList.contains('add-to-cart') || 
            e.target.closest('.add-to-cart')) {
            // Add to cart functionality
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            alert(`Đã thêm "${productName}" vào giỏ hàng`);
        }
        
        if (e.target.classList.contains('contact-btn') || 
            e.target.closest('.contact-btn')) {
            // Contact for price functionality
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            alert(`Yêu cầu báo giá cho sản phẩm "${productName}" đã được gửi`);
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});