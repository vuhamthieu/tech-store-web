// GERNERATE PRODUCT

// Kiểm tra đăng nhập
document.addEventListener("DOMContentLoaded", function() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const accessToken = localStorage.getItem("access_token");
  
  // Chỉ chuyển hướng nếu cả token và trạng thái đều hợp lệ
  if (isLoggedIn && accessToken) {
    // Thêm kiểm tra token hợp lệ trước khi chuyển hướng
    verifyToken(accessToken).then(isValid => {
      if (isValid) {
        window.location.href = "product.html";
      } else {
        clearAuthData();
      }
    }).catch(() => clearAuthData());
  }
});

// Hàm kiểm tra token
async function verifyToken(token) {
  try {
    const res = await fetch('http://localhost/webproject/tech-store-web/back-end/php/api/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return res.ok;
  } catch (error) {
    return false;
  }
}

// Hàm xóa dữ liệu đăng nhập
function clearAuthData() {
  localStorage.removeItem("user");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

// Làm nổi bật widget khi scroll đến
document.addEventListener("DOMContentLoaded", function () {
  const sidebarWidgets = document.querySelectorAll(".sidebar-widget");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.boxShadow = "0 5px 15px rgba(229, 57, 53, 0.2)";
          entry.target.style.transform = "translateY(-5px)";
        } else {
          entry.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
          entry.target.style.transform = "none";
        }
      });
    },
    { threshold: 0.1 }
  );

  sidebarWidgets.forEach((widget) => {
    observer.observe(widget);
  });
});
// Hiệu ứng khi di chuột vào card quảng cáo
document.querySelectorAll(".promo-card, .hot-deal").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-5px)";
    card.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "none";
    card.style.boxShadow = "0 3px 10px rgba(0,0,0,0.05)";
  });
});

const sidebar = document.getElementById("leftSidebar");
const toggleBtn = document.getElementById("sidebarToggle");

toggleBtn.addEventListener("click", function () {
  sidebar.classList.toggle("collapsed");
  // Đổi icon và vị trí nút
  if (sidebar.classList.contains("collapsed")) {
    toggleBtn.querySelector("i").className = "fas fa-chevron-right";
    toggleBtn.style.left = "15px";
  } else {
    toggleBtn.querySelector("i").className = "fas fa-chevron-left";
    toggleBtn.style.left = "265px";
  }
});

// Tự nhận diện trang hiện tại theo URL
const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll(".nav-menu li a").forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentPage || (href === "product.html" && currentPage === "")) {
    link.parentElement.classList.add("active");
  }
});
///////DETAIL PRODUCT

////////////////////////////////////////////

////////////////////
//product list

const API_URL = "http://localhost/webproject/tech-store-web/back-end/php/api/products";

const productGrid = document.querySelector(".product-grid");
// Lấy input tìm kiếm từ header
const searchInput = document.querySelector(".search-box input");
const sortSelect = document.getElementById("sort-filter");
const categorySelect = document.getElementById("category-filter");
const brandSelect = document.getElementById("brand-filter");
const priceMinInput = document.getElementById("price-min");
const priceMaxInput = document.getElementById("price-max");
const paginationContainer = document.getElementById("pageNumbers");
const limit = 15;

let currentPageNum = 1;

// Xác định category cố định theo từng trang
let fixedCategory = "";
const path = window.location.pathname;
if (path.includes("product-camera.html")) {
  fixedCategory = "Cameras";
} else if (path.includes("product-devices.html")) {
  fixedCategory = "Accessories";
} else if (path.includes("product.html")) {
  fixedCategory = "Laptop";
}

async function loadProducts(page = 1) {
  currentPageNum = page;

  const search = searchInput?.value.trim() || "";
  // Ưu tiên fixedCategory nếu có, nếu không lấy từ select
  const category = fixedCategory || categorySelect?.value || "";
  const brand = brandSelect?.value || "";
  const priceMin = priceMinInput?.value || "";
  const priceMax = priceMaxInput?.value || "";
  const sortBy = sortSelect?.value || "";

  const params = new URLSearchParams({
    page: currentPageNum,
    limit: limit,
  });

  if (search) params.append("search", search);
  if (category) params.append("category", category);
  if (brand) params.append("brand", brand);
  if (priceMin) params.append("price_min", priceMin);
  if (priceMax) params.append("price_max", priceMax);
  if (sortBy) params.append("sort_by", sortBy);

  try {
    const response = await fetch(`${API_URL}?${params.toString()}`);
    const data = await response.json();

    if (data.products && data.products.length > 0) {
      renderProducts(data.products);
      renderPagination(data.total_pages, data.page);
    } else {
      productGrid.innerHTML = "<p>Không có sản phẩm phù hợp.</p>";
      paginationContainer.innerHTML = "";
    }
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
    productGrid.innerHTML = "<p>Không thể tải sản phẩm.</p>";
    paginationContainer.innerHTML = "";
  }
}

// ...giữ nguyên các hàm còn lại...

function renderProducts(products) {
  productGrid.innerHTML = products
    .map(
      (p) => `
    <div class="product-item" style="cursor:pointer" onclick="window.location.href='detail.html?id=${
      p.ProductID
    }'">
      <img src="${p.Thumbnail}" alt="${p.Title}">
      <h3>${p.Title}</h3>
      <p class="price">${formatPrice(Number(p.Price))}₫</p>
      <p class="brand-category">${p.Brand}</p>
      <p class="rating">⭐ ${p.Rating}</p>
    </div>
  `
    )
    .join("");
}

function formatPrice(price) {
  // Hiển thị giá theo format VNĐ với dấu chấm ngăn cách hàng nghìn
  return price.toLocaleString("vi-VN");
}

function renderPagination(totalPages, current) {
  paginationContainer.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    pageBtn.classList.add("page-btn");
    if (i === current) pageBtn.classList.add("active");
    pageBtn.addEventListener("click", () => loadProducts(i));
    paginationContainer.appendChild(pageBtn);
  }
}

// Debounce tìm kiếm
let debounceTimer;
const debounceDelay = 500;

searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    loadProducts(1);
  }, debounceDelay);
});

// Lắng nghe thay đổi các filter
[sortSelect, categorySelect, brandSelect, priceMinInput, priceMaxInput].forEach(
  (el) => {
    el?.addEventListener("change", () => {
      loadProducts(1);
    });
  }
);

// Nếu input giá có thay đổi, debounce để giảm số lần gọi API
priceMinInput?.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    loadProducts(1);
  }, debounceDelay);
});
priceMaxInput?.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    loadProducts(1);
  }, debounceDelay);
});

// Tải sản phẩm lần đầu
loadProducts();

///////////////suggest

function formatPrice(price) {
  if (typeof price === "number") {
    return price.toLocaleString("vi-VN") + " ₫";
  }
  return "Liên hệ";
}
