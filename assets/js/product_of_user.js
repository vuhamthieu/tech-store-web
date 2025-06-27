document.addEventListener("DOMContentLoaded", function () {
  console.log("product_of_user.js loaded");

  // Initialize variables
  let allOrders = [];
  let currentPage = 1;
  const ordersPerPage = 10;

  // DOM elements
  const ordersList = document.getElementById("ordersList");
  const emptyOrders = document.getElementById("emptyOrders");
  const pageInfo = document.getElementById("pageInfo");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const searchBtn = document.getElementById("searchOrders");
  const timeFilter = document.getElementById("timeFilter");
  const statusFilter = document.getElementById("statusFilter");
  const searchInput = document.getElementById("searchInput");
  const ordersLoading = document.getElementById('ordersLoading');
  const clearFiltersBtn = document.getElementById("clearFilters");

  // Save filters to localStorage
  function saveFiltersToLocal() {
    localStorage.setItem("orderFilters", JSON.stringify({
      time: timeFilter.value,
      status: statusFilter.value,
      keyword: searchInput.value
    }));
  }

  // Load filters from localStorage
  function loadFiltersFromLocal() {
    const saved = JSON.parse(localStorage.getItem("orderFilters"));
    if (saved) {
      timeFilter.value = saved.time || "all";
      statusFilter.value = saved.status || "all";
      searchInput.value = saved.keyword || "";
    }
  }

  // Load user info and orders
  loadUserInfo();
  fetchOrders();

  function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userName = document.getElementById("userName");
    const avatarImage = document.getElementById("avatarImage");

    if (userName && user.FullName) {
      userName.textContent = user.FullName;
    }

    if (avatarImage && user.Avatar) {
      avatarImage.src = `../assets/img/${user.Avatar}`;
    }
  }

  async function fetchOrders() {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("access_token");
      console.log("Fetching orders with token:", token);

      const res = await fetch("../back-end/php/api/get-orders-with-detail", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      const data = await res.json();
      console.log("Orders API response:", data);

      if (data.success) {
        allOrders = data.data;
        console.log("Orders loaded:", allOrders);
        applyFilters();
      } else {
        console.error("Failed to fetch orders:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  function applyFilters() {
    const keyword = searchInput.value.trim().toLowerCase();
    const status = document.getElementById('statusFilter').value;
    const time = document.getElementById('timeFilter').value;
    const now = new Date();

    let filtered = allOrders.filter(order => {
      // Status filter
      let matchStatus = status === "all" || order.Status.toString() === status;

      // Time filter
      let matchTime = true;
      const orderDate = new Date(order.OrderDate);
      if (time === "3months") {
        matchTime = (now - orderDate) <= 90 * 24 * 60 * 60 * 1000;
      } else if (time === "6months") {
        matchTime = (now - orderDate) <= 180 * 24 * 60 * 60 * 1000;
      } else if (!isNaN(parseInt(time))) {
        matchTime = orderDate.getFullYear().toString() === time;
      }

      // Keyword search
      let matchKeyword = keyword === "" ||
        order.OrderID.toString().includes(keyword) ||
        (order.items && order.items.some(item =>
          item.Title && item.Title.toLowerCase().includes(keyword)
        ));

      return matchStatus && matchTime && matchKeyword;
    });

    renderPagination(filtered);
  }

  function renderPagination(data) {
    const totalPages = Math.ceil(data.length / ordersPerPage);
    currentPage = Math.min(currentPage, totalPages) || 1;

    const start = (currentPage - 1) * ordersPerPage;
    const currentOrders = data.slice(start, start + ordersPerPage);

    renderOrders(currentOrders);

    // Update pagination buttons
    pageInfo.textContent = `Trang ${currentPage}/${totalPages || 1}`;
    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= totalPages;

    document.getElementById("paginationWrapper").style.display = data.length === 0 ? "none" : "flex";
  }

  function renderOrders(orders) {
    console.log("Rendering orders:", orders);
    ordersList.innerHTML = "";

    if (!orders.length) {
      console.log("No orders to display");
      ordersList.classList.add('hidden');
      emptyOrders.classList.remove('hidden');
      return;
    }

    emptyOrders.classList.add('hidden');
    ordersList.classList.remove('hidden');

    for (const order of orders) {
      console.log("Processing order:", order);
      const orderDiv = document.createElement("div");
      orderDiv.className = "order-card";
      orderDiv.innerHTML = `
      <div class="order-header">
        <h4>Mã đơn: ${order.OrderID}</h4>
        <span>Ngày đặt: ${new Date(order.OrderDate).toLocaleDateString()}</span>
      </div>
      <div class="order-items">
        ${order.items.map(item => `
          <div class="order-item">
            <img class="item-image" src="${item.Thumbnail}" alt="${item.Title}" />
            <div class="item-details">
              <div class="item-name">${item.Title}</div>
              <div class="item-meta">
                <span class="item-quantity">Số lượng: ${item.Quantity}</span>
                <span class="item-price">Đơn giá: ${formatCurrency(item.UnitPrice)}</span>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
      <div class="order-footer">
        <p>Ghi chú: ${order.ShippingNote || "(Không có)"}</p>
        <p>Tổng tiền: ${formatCurrency(order.TotalAmount)}</p>
        <p>Trạng thái: ${getOrderStatusText(order.Status)}</p>
        <p>Thanh toán: ${order.PaymentStatus} (${order.PaymentMethod})</p>
      </div>
    `;
      ordersList.appendChild(orderDiv);
    }
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  }

  function getOrderStatusText(status) {
    if (status == 1) return "Đã duyệt";
    if (status == 2) return "Đã từ chối";
    return "Chờ xử lý";
  }

  // Show/hide loading
  function showLoading() {
    ordersLoading.classList.remove('hidden');
    ordersList.classList.add('hidden');
    emptyOrders.classList.add('hidden');
  }
  function hideLoading() {
    ordersLoading.classList.add('hidden');
    ordersList.classList.remove('hidden');
  }

  // The main search/filter function
  function doSearch() {
    showLoading();
    setTimeout(() => {
      currentPage = 1;
      saveFiltersToLocal();
      applyFilters();
      hideLoading();
    }, 400);
  }

  // Button click triggers search
  searchBtn.addEventListener("click", doSearch);

  // Pressing Enter in the input triggers search
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      doSearch();
    }
  });

  clearFiltersBtn.addEventListener("click", () => {
    searchInput.value = '';
    document.getElementById('timeFilter').value = 'all';
    document.getElementById('statusFilter').value = 'all';
    currentPage = 1;
    saveFiltersToLocal();
    applyFilters();
  });

  // === AVATAR UPLOAD ===
  const avatarInput = document.getElementById('avatarInput');
  const changeAvatarBtn = document.getElementById('changeAvatarBtn');
  const avatarImage = document.getElementById('avatarImage');

  changeAvatarBtn.addEventListener('click', function () {
    avatarInput.click();
  });

  avatarInput.addEventListener('change', function (e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return alert('Ảnh không được quá 2MB');
    }

    if (!file.type.match('image.*')) {
      return alert('Chỉ chấp nhận định dạng ảnh');
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      avatarImage.src = event.target.result; // Hiển thị ảnh tạm
      uploadAvatarToServer(file);
    };
    reader.readAsDataURL(file);
  });

  function uploadAvatarToServer(file) {
    const formData = new FormData();
    formData.append('avatar', file);

    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Bạn chưa đăng nhập!');
      return;
    }

    fetch('http://localhost/webproject/tech-store-web/back-end/php/api/update-avatar-user', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: formData
    })
      .then(res => res.json())
      .then(result => {
        if (result.success && result.avatar) {
          alert('Cập nhật ảnh thành công!');
          localStorage.setItem('avatarUrl', result.avatar);
          avatarImage.src = 'http://localhost/webproject/tech-store-web/assests/img/' + result.avatar;
        } else {
          alert('Lỗi: ' + result.message);
        }
      })
      .catch(error => {
        console.error('Upload avatar error:', error);
        alert('Không thể tải lên ảnh đại diện!');
      });
  }

  // Hiển thị avatar từ localStorage nếu có
  document.addEventListener('DOMContentLoaded', () => {
    const savedAvatar = localStorage.getItem('avatarUrl');
    if (savedAvatar) {
      avatarImage.src = 'http://localhost/webproject/tech-store-web/assets/img/' + savedAvatar;
    }
  });

  // Initialize the page
  loadFiltersFromLocal();

  // Add event listeners for filters
  timeFilter.addEventListener("change", () => {
    currentPage = 1;
    saveFiltersToLocal();
    applyFilters();
  });

  statusFilter.addEventListener("change", () => {
    currentPage = 1;
    saveFiltersToLocal();
    applyFilters();
  });

  // REMOVE this if you have it (no live search!)
  // searchInput.addEventListener("input", ...);

  document.getElementById('timeFilter').addEventListener('change', doSearch);
  document.getElementById('statusFilter').addEventListener('change', doSearch);
});