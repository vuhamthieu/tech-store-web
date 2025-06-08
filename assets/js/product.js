// GERNERATE PRODUCT






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



  const sidebar = document.getElementById('leftSidebar');
  const toggleBtn = document.getElementById('sidebarToggle');

  toggleBtn.addEventListener('click', function () {
    sidebar.classList.toggle('collapsed');
    // Đổi icon và vị trí nút
    if (sidebar.classList.contains('collapsed')) {
      toggleBtn.querySelector('i').className = 'fas fa-chevron-right';
      toggleBtn.style.left = '15px';
    } else {
      toggleBtn.querySelector('i').className = 'fas fa-chevron-left';
      toggleBtn.style.left = '265px';
    }
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
         ////check out
          document.getElementById('buyBtn').onclick = async () => {
            const res = await fetch('checkout.html');
            const html = await res.text();
            const container = document.getElementById('checkout-container');
            container.innerHTML = html;
            container.style.display = 'flex';
          };
////////////////////
//product list
const API_URL = 'http://localhost/webproject/tech-store-web/back-end/php/api/products.php';

const productGrid = document.querySelector('.product-grid');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-filter');
const paginationContainer = document.getElementById('pageNumbers');
const limit = 15;

let currentPageNum = 1;
let currentSearch = '';
let currentSort = '';

async function loadProducts(page = 1) {
  currentPageNum = page;
  currentSearch = searchInput.value.trim();
  currentSort = sortSelect.value;

  const params = new URLSearchParams({
    page: currentPageNum,
    limit: limit
  });

  if (currentSearch) params.append('search', currentSearch);
  if (currentSort) params.append('sort_by', currentSort);

  try {
    const response = await fetch(`${API_URL}?${params.toString()}`);
    const data = await response.json();

    if (data.products && data.products.length > 0) {
      renderProducts(data.products);
      renderPagination(data.total_pages, data.page);
    } else {
      productGrid.innerHTML = '<p>Không có sản phẩm phù hợp.</p>';
      paginationContainer.innerHTML = '';
    }
  } catch (error) {
    console.error('Lỗi khi tải sản phẩm:', error);
    productGrid.innerHTML = '<p>Không thể tải sản phẩm.</p>';
    paginationContainer.innerHTML = '';
  }
}

function renderProducts(products) {
  productGrid.innerHTML = products.map(p => `
    <div class="product-item">
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.Title}</h3>
      <p class="price">${formatPrice(p.price)}₫</p>
    </div>
  `).join('');
}

function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function renderPagination(totalPages, current) {
  paginationContainer.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = i;
    pageBtn.classList.add('page-btn');
    if (i === current) pageBtn.classList.add('active');
    pageBtn.addEventListener('click', () => loadProducts(i));
    paginationContainer.appendChild(pageBtn);
  }
}

// Debounce tìm kiếm
let debounceTimer;
const debounceDelay = 500;

searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    loadProducts(1);
  }, debounceDelay);
});

sortSelect.addEventListener('change', () => {
  loadProducts(1);
});

// Gọi lần đầu
loadProducts();

///////////////suggest
const suggestionBox = document.getElementById('search-suggestions');

// Hàm gọi API gợi ý (giả sử trả về danh sách tên sản phẩm gần đúng)
async function fetchSuggestions(query) {
  try {
    const res = await fetch(`${API_URL}?suggest=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.suggestions || [];
  } catch (err) {
    console.error('Lỗi gợi ý:', err);
    return [];
  }
}

// Hiển thị gợi ý
function showSuggestions(suggestions) {
  suggestionBox.innerHTML = '';
  if (suggestions.length === 0) {
    suggestionBox.style.display = 'none';
    return;
  }
  suggestions.forEach(item => {
    const div = document.createElement('div');
    div.textContent = item;
    div.addEventListener('click', () => {
      searchInput.value = item;
      suggestionBox.style.display = 'none';
      loadProducts(1);
    });
    suggestionBox.appendChild(div);
  });
  suggestionBox.style.display = 'block';
}

// Lắng nghe nhập liệu và hiển thị gợi ý
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();
  if (query.length < 2) {
    suggestionBox.style.display = 'none';
    return;
  }

  fetchSuggestions(query).then(showSuggestions);
});

// Ẩn gợi ý khi click ra ngoài
document.addEventListener('click', (e) => {
  if (!searchInput.contains(e.target) && !suggestionBox.contains(e.target)) {
    suggestionBox.style.display = 'none';
  }
});
