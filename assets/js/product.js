// GERNERATE PRODUCT

// Kiểm tra đăng nhập
document.addEventListener("DOMContentLoaded", function () {
  const leftSidebar = document.getElementById("leftSidebar");
  const toggleBtn = document.getElementById("sidebarToggle");

  let autoHideTimer;

  function hideSidebar() {
    if (!leftSidebar.classList.contains("collapsed")) {
      leftSidebar.classList.add("collapsed");
      toggleBtn.querySelector("i").className = "fas fa-chevron-right";
      toggleBtn.style.left = "15px";
    }
  }

  function resetTimer() {
    clearTimeout(autoHideTimer);
    autoHideTimer = setTimeout(hideSidebar, 3000); // 3 giây
  }

  // Khởi động lần đầu
  resetTimer();

  // Mỗi lần di chuột vào hoặc click, reset timer
  leftSidebar.addEventListener("mouseenter", resetTimer);
  leftSidebar.addEventListener("mousemove", resetTimer);
  leftSidebar.addEventListener("click", resetTimer);
  leftSidebar.addEventListener("mouseleave", resetTimer);

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
    const response = await authFetch(`${API_URL}?${params.toString()}`);
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
function extractSpecs(description) {
  if (!description) return "";

  const cpuMatch = description.match(/CPU:\s*([^\n]+)/i);
  const ramMatch = description.match(/RAM:\s*([^\n]+)/i);
  const storageMatch = description.match(/Ổ cứng:\s*([^\n]+)/i);

  const cpu = cpuMatch ? cpuMatch[1].trim() : "";
  const ram = ramMatch ? ramMatch[1].trim() : "";
  const storage = storageMatch ? storageMatch[1].trim() : "";

  // Chỉ hiển thị những phần có giá trị
  const specsArray = [cpu, ram, storage].filter(Boolean);
  return specsArray.join(" / ");
}

// ... (giữ nguyên phần đầu)
function renderProducts(products) {
  productGrid.innerHTML = products
    .map((p) => {
      const productName = p.Title || "Tên sản phẩm";

      // Thông số dạng đầy đủ
      let specs = "";
      if (p.CPU) specs += `CPU: ${p.CPU} / `;
      if (p.RAM) specs += `RAM: ${p.RAM} / `;
      if (p.Storage) specs += `Ổ cứng: ${p.Storage}`;
      specs = specs.replace(/\/\s*$/, "");

      // Nếu không có CPU/RAM/Storage thì lấy từ mô tả
      if (!specs && p.Description) {
        const lines = p.Description.split("\n").slice(0, 2); // lấy 2 dòng đầu
        specs = lines.join(" / ");
      }

      // Banner Best Seller
      const bestSellerBanner = p.ProductID == 9 ? `
        <div style="
          position: absolute;
          top: 10px;
          right: 10px;
          background: linear-gradient(45deg, #ff4655, #e53935);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 8px rgba(255, 70, 85, 0.3);
          z-index: 10;
          animation: pulse 2s infinite;
        ">
          Bán chạy
        </div>` : "";

      // ✅ Lấy số lượng đánh giá từ localStorage nếu API không trả về
      const storedReviewCount = Number(localStorage.getItem(`reviewCount_${p.ProductID}`)) || 0;
      const reviewCount = (p.Reviews && p.Reviews > 0) ? p.Reviews : storedReviewCount;

      return `
      <div class="product-item" style="
        cursor:pointer; 
        padding:10px; 
        box-sizing:border-box; 
        width:100%; 
        max-width:280px;
        position: relative;
      " onclick="window.location.href='detail.html?id=${p.ProductID}'">
        ${bestSellerBanner}
        <div>
          <img src="${p.Thumbnail}" alt="${p.Title}" style="width:100%; height:100%; object-fit:cover;">
        </div>
        <div style="
          font-weight:600;
          font-size:15px;
          color:#222;
          margin:8px 0 4px;
          display:-webkit-box;
          -webkit-line-clamp:2;
          -webkit-box-orient:vertical;
          overflow:hidden;
          text-overflow:ellipsis;
          line-height:1.3;
          height:2.6em;
        ">
          ${productName}
        </div>
        <div style="
          font-size:13px;
          color:#555;
          margin:6px 0;
          overflow:hidden;
          text-overflow:ellipsis;
          display:-webkit-box;
          -webkit-line-clamp:2;
          -webkit-box-orient:vertical;
        ">
          ${specs ? specs : `<i style="color:#aaa">Thông số đang cập nhật</i>`}
        </div>
        <div style="font-size:13px; color:#777; margin-bottom:4px;">
          ${p.Brand || "Không rõ thương hiệu"}
        </div>
        <div style="
          font-size:13px; 
          color:#555; 
          margin-bottom:4px;
        ">
       <div style="font-size:13px; color:#555; margin-bottom:4px;">
  <i class="fas fa-star" style="color: #FFD700;"></i> 
  ${p.Rating || "0.0"} (${reviewCount} đánh giá)
</div>

        </div>
        <div style="font-weight:700; font-size:15px; color:#E53935;">
          ${formatPrice(Number(p.Price))}
        </div>
      </div>`;
    })
    .join("");
}






// ... (giữ nguyên phần còn lại)

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

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const badge = document.getElementById("cartBadge");
  const cartCount = cart.length; // Đếm số loại sản phẩm khác nhau

  if (badge) {
    badge.textContent = cartCount;
    if (cartCount > 0) {
      badge.classList.add("show");
    } else {
      badge.classList.remove("show");
    }
  }
}

updateCartBadge();

