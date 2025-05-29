// Sample product data
const products = [
    {
        id: 1,
        name: "Laptop Dell XPS 15",
        category: "laptop",
        brand: "dell",
        price: 28990000,
        image: "https://tse2.mm.bing.net/th?id=OIP.3-gnsUPAVPugc62QeeoNDgHaDl&pid=Api&P=0&h=220"
    },
    {
        id: 2,
        name: "Camera HD Pro 4K",
        category: "camera",
        brand: "hdpro",
        price: 3490000,
        image: "https://i5.walmartimages.com/asr/8958ec19-817b-4493-9f8d-78286102c695.79b3bc27ec5282456d13c823e95e15bc.jpeg"
    },
    {
        id: 3,
        name: "Laptop Lenovo ThinkPad",
        category: "laptop",
        brand: "lenovo",
        price: 21990000,
        image: "images/products/laptop2.jpg"
    },
    {
        id: 4,
        name: "Camera IP Wifi",
        category: "camera",
        brand: "ipcam",
        price: 0, // Price 0 means contact for price
        image: "images/products/camera2.jpg"
    },
    {
        id: 5,
        name: "Laptop HP EliteBook",
        category: "laptop",
        brand: "hp",
        price: 24990000,
        image: "images/products/laptop3.jpg"
    },
    {
        id: 6,
        name: "Camera Không Dây",
        category: "camera",
        brand: "wireless",
        price: 1890000,
        image: "images/products/camera3.jpg"
    }
];

// DOM Elements
const productGrid = document.querySelector('.product-grid');
const brandFilter = document.getElementById('brand-filter');
const priceFilter = document.getElementById('price-filter');

// Display products function
function displayProducts(productsToDisplay) {
    productGrid.innerHTML = '';
    
    productsToDisplay.forEach(product => {
        const priceHTML = product.price > 0 ? 
            `<p class="price">${formatCurrency(product.price)}</p>` : 
            `<p class="price contact-price">Liên hệ</p>`;
        
        const buttonsHTML = product.price > 0 ?
            `<button class="btn add-to-cart">Thêm giỏ hàng</button>
             <button class="btn quick-view">Xem nhanh</button>` :
            `<button class="btn contact-btn">Yêu cầu báo giá</button>`;
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                ${priceHTML}
                <div class="product-actions">
                    ${buttonsHTML}
                </div>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
}

// Format currency (VND)
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
    }).format(amount);
}

// Filter products function
function filterProducts() {
    const brandValue = brandFilter.value;
    const priceValue = priceFilter.value;
    
    let filteredProducts = products;
    
    // Filter by brand
    if (brandValue !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.brand === brandValue);
    }
    
    // Filter by price
    if (priceValue !== 'all') {
        switch(priceValue) {
            case '1': // Under 5 million
                filteredProducts = filteredProducts.filter(product => product.price > 0 && product.price < 5000000);
                break;
            case '2': // 5-10 million
                filteredProducts = filteredProducts.filter(product => product.price >= 5000000 && product.price <= 10000000);
                break;
        }
    }
    
    displayProducts(filteredProducts);
}

// Event listeners
brandFilter.addEventListener('change', filterProducts);
priceFilter.addEventListener('change', filterProducts);

// Initial display
displayProducts(products);
// Làm nổi bật widget khi scroll đến
document.addEventListener('DOMContentLoaded', function() {
    const sidebarWidgets = document.querySelectorAll('.sidebar-widget');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.boxShadow = '0 5px 15px rgba(229, 57, 53, 0.2)';
                entry.target.style.transform = 'translateY(-5px)';
            } else {
                entry.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                entry.target.style.transform = 'none';
            }
        });
    }, { threshold: 0.1 });
    
    sidebarWidgets.forEach(widget => {
        observer.observe(widget);
    });
});
// Hiệu ứng khi di chuột vào card quảng cáo
document.querySelectorAll('.promo-card, .hot-deal').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'none';
        card.style.boxShadow = '0 3px 10px rgba(0,0,0,0.05)';
    });
});

// Đếm ngược khuyến mãi (tùy chọn)
function startCountdown() {
    const countdownEl = document.createElement('div');
    countdownEl.className = 'countdown';
    document.querySelector('.promo-card').appendChild(countdownEl);
    
    let timeLeft = 3600; // 1 giờ
    
    const timer = setInterval(() => {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        
        countdownEl.innerHTML = `
            <span>KẾT THÚC SAU:</span>
            <span class="time">${hours}h ${minutes}m ${seconds}s</span>
        `;
        
        if (timeLeft <= 0) clearInterval(timer);
        timeLeft--;
    }, 1000);
}

startCountdown();
// Hiển thị popup sau 3 giây
setTimeout(() => {
    document.getElementById('floatingAd').classList.add('show');
}, 3000);

// Đóng popup khi click nút X
document.getElementById('closeAd').addEventListener('click', function() {
    document.getElementById('floatingAd').classList.remove('show');
    
    // Lưu trạng thái đã đóng vào localStorage (không hiển thị lại trong 24h)
    localStorage.setItem('adClosed', Date.now());
});

// Kiểm tra nếu đã đóng trước đó
window.addEventListener('DOMContentLoaded', () => {
    const lastClosed = localStorage.getItem('adClosed');
    if (lastClosed && (Date.now() - lastClosed < 86400000)) { // 24h
        return;
    }
    setTimeout(() => {
        document.getElementById('floatingAd').classList.add('show');
    }, 3000);
});
// Đóng/mở quảng cáo trái
const leftAd = document.getElementById('leftAd');
const closeLeftAd = document.getElementById('closeLeftAd');

// Kiểm tra localStorage
if (!localStorage.getItem('adClosed')) {
    // Hiển thị sau 2 giây
    setTimeout(() => {
        leftAd.classList.remove('collapsed');
    }, 2000);
}

// Sự kiện đóng quảng cáo
closeLeftAd.addEventListener('click', function() {
    leftAd.classList.add('collapsed');
    localStorage.setItem('adClosed', 'true');
    
    // Tự động mở lại sau 30 phút
    setTimeout(() => {
        localStorage.removeItem('adClosed');
    }, 1800000);
});

// Hiệu ứng hover
leftAd.addEventListener('mouseenter', function() {
    if (leftAd.classList.contains('collapsed')) {
        leftAd.classList.remove('collapsed');
    }
});

leftAd.addEventListener('mouseleave', function() {
    if (localStorage.getItem('adClosed')) {
        leftAd.classList.add('collapsed');
    }
});
// Đóng/mở sidebar trên mobile
const sidebar = document.querySelector('.left-sidebar');
const toggleBtn = document.querySelector('.sidebar-toggle');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Đếm ngược khuyến mãi
function updateCountdown() {
    const countdownElement = document.querySelector('.countdown');
    let hours = 5;
    let minutes = 12;
    let seconds = 36;
    
    const timer = setInterval(() => {
        seconds--;
        
        if (seconds < 0) {
            seconds = 59;
            minutes--;
        }
        
        if (minutes < 0) {
            minutes = 59;
            hours--;
        }
        
        if (hours < 0) {
            clearInterval(timer);
            countdownElement.textContent = "KẾT THÚC";
            countdownElement.style.background = "#333";
            return;
        }
        
        countdownElement.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

updateCountdown();

// Lưu trạng thái sidebar
window.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth > 992) {
        sidebar.classList.add('active');
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
        sidebar.classList.add('active');
    } else {
        sidebar.classList.remove('active');
    }
});