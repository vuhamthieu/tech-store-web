// GERNERATE PRODUCT
const apiURL = "https://api.example.com/cameras";
    const grid = document.getElementById("product-grid");

    fetch(apiURL)
      .then(res => res.json())
      .then(data => {
        renderProducts(data);
      })
      .catch(err => {
        console.error("Lỗi khi tải dữ liệu:", err);
        grid.innerHTML = "<p>Không có sản phẩm.</p>";
      });

    function renderProducts(data) {
      grid.innerHTML = data.map(product => `
        <div class="card">
          <img src="${product.image}" alt="${product.name}">
          <div class="card-content">
            <h2>${product.name}</h2>
            <div class="price">${product.price.toLocaleString('vi-VN')}₫</div>
            <div class="btns">
              <button>THÊM GIỎ HÀNG</button>
              <button>XEM NHANH</button>
            </div>
          </div>
        </div>
      `).join("");
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

// Tự nhận diện trang hiện tại theo URL
const currentPage = window.location.pathname.split("/").pop();
    document.querySelectorAll(".nav-menu li a").forEach(link => {
      const href = link.getAttribute("href");
      if (href === currentPage || (href === "product.html" && currentPage === "")) {
        link.parentElement.classList.add("active");
      }
    });
    ///////DETAIL PRODUCT
    function changeImage(src) {
        document.getElementById('mainImage').src = src;
        const thumbs = document.querySelectorAll('.thumbnail');
        thumbs.forEach(img => img.classList.remove('active'));
        [...thumbs].find(img => img.src === src)?.classList.add('active');
      }
      
      function increaseQuantity() {
        const input = document.getElementById('quantity');
        input.value = parseInt(input.value) + 1;
      }
      
      function decreaseQuantity() {
        const input = document.getElementById('quantity');
        if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
      }
      
      // Lấy dữ liệu sản phẩm từ API
      fetch('https://api.example.com/product/123')
        .then(res => res.json())
        .then(product => {
          document.getElementById('mainImage').src = product.mainImage;
          document.getElementById('productTitle').textContent = product.name;
          document.getElementById('productPrice').textContent = product.price + '₫';
          document.getElementById('productOldPrice').textContent = product.oldPrice + '₫';
          document.getElementById('productDiscount').textContent = product.discount;
          document.getElementById('stockCount').textContent = product.stock + ' sản phẩm';
          document.getElementById('productDescription').textContent = product.description;
      
          const features = document.getElementById('productFeatures');
          features.innerHTML = product.features.map(f => `<li>${f}</li>`).join('');
      
          const gallery = document.getElementById('thumbnailGallery');
          gallery.innerHTML = product.images.map((img, index) => `
            <img src="${img}" class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeImage('${img}')">
          `).join('');
        });
        ////////////////////////////////////////////
        /////REVIEW
        async function loadProductData() {
            try {
              const res = await fetch("https://example.com/api/products/1");
              const product = await res.json();
          
              // Cập nhật hình ảnh chính
              document.getElementById("mainImage").src = product.images[0];
          
              // Cập nhật thumbnail
              const thumbnailGallery = document.querySelector(".thumbnail-gallery");
              thumbnailGallery.innerHTML = ""; // Xóa ảnh cũ
              product.images.forEach((img, index) => {
                const thumb = document.createElement("img");
                thumb.src = img;
                thumb.alt = "Thumbnail " + (index + 1);
                thumb.className = "thumbnail" + (index === 0 ? " active" : "");
                thumb.onclick = () => changeImage(img);
                thumbnailGallery.appendChild(thumb);
              });
          
              // Cập nhật thông tin sản phẩm
              document.querySelector(".product-title").innerText = product.name;
              document.querySelector(".current-price").innerText = product.price.toLocaleString() + "₫";
              document.querySelector(".old-price").innerText = product.old_price.toLocaleString() + "₫";
              document.querySelector(".discount").innerText = 
                `-${Math.round(100 - (product.price / product.old_price) * 100)}%`;
              document.getElementById("stockCount").innerText = product.stock + " sản phẩm";
          
              // Đánh giá
              document.querySelector(".stars").innerText = "★".repeat(product.rating) + "☆".repeat(5 - product.rating);
              document.querySelector(".review-count").innerText = `(${product.reviews} đánh giá)`;
          
              // Mô tả
              document.querySelector(".product-description p").innerText = product.description;
              
              const featureList = document.querySelector(".product-description ul");
              featureList.innerHTML = "";
              product.features.forEach(f => {
                const li = document.createElement("li");
                li.innerText = f;
                featureList.appendChild(li);
              });
          
            } catch (err) {
              console.error("Lỗi tải sản phẩm:", err);
            }
          }
          
          // Gọi hàm khi trang tải xong
          document.addEventListener("DOMContentLoaded", loadProductData);
          
          // Hàm đổi hình ảnh chính
          function changeImage(url) {
            document.getElementById("mainImage").src = url;
          }
          ////////////////////////////////
          document.getElementById('buyBtn').onclick = async () => {
            const res = await fetch('checkout.html');
            const html = await res.text();
            const container = document.getElementById('checkout-container');
            container.innerHTML = html;
            container.style.display = 'flex';
          };