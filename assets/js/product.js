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
    
        ////////////////////////////////////////////
        
////////////////////
//product list
const API_URL = 'http://localhost/webproject/tech-store-web/back-end/php/api/products.php';

const productGrid = document.querySelector('.product-grid');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-filter');
const categorySelect = document.getElementById('category-filter');
const brandSelect = document.getElementById('brand-filter');
const priceMinInput = document.getElementById('price-min');
const priceMaxInput = document.getElementById('price-max');
const paginationContainer = document.getElementById('pageNumbers');
const limit = 15;

let currentPageNum = 1;

async function loadProducts(page = 1) {
  currentPageNum = page;

  const search = searchInput.value.trim();
  const category = categorySelect.value;
  const brand = brandSelect.value;
  const priceMin = priceMinInput.value;
  const priceMax = priceMaxInput.value;
  const sortBy = sortSelect.value;

  const params = new URLSearchParams({
    page: currentPageNum,
    limit: limit
  });

  if (search) params.append('search', search);
  if (category) params.append('category', category);
  if (brand) params.append('brand', brand);
  if (priceMin) params.append('price_min', priceMin);
  if (priceMax) params.append('price_max', priceMax);
  if (sortBy) params.append('sort_by', sortBy);

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
      <h3>${p.title}</h3>
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

// Filter listeners
[sortSelect, categorySelect, brandSelect, priceMinInput, priceMaxInput].forEach(el => {
  el.addEventListener('change', () => {
    loadProducts(1);
  });
});

priceMinInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    loadProducts(1);
  }, debounceDelay);
});

priceMaxInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    loadProducts(1);
  }, debounceDelay);
});

// Gọi lần đầu
loadProducts();


///////////////suggest
