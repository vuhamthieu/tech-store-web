document.addEventListener("DOMContentLoaded", function () {
  // product_of_user.js

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

// Fetch orders from API
async function fetchOrders() {
  try {
    const res = await fetch("../back-end/php/api/orders_of_user");
    const data = await res.json();
    if (data.success) {
      allOrders = data.data;
      applyFilters();
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

function applyFilters() {
  const keyword = searchInput.value.trim().toLowerCase();
  const status = statusFilter.value;
  const time = timeFilter.value;
  const now = new Date();

  let filtered = allOrders.filter(order => {
    let matchStatus = status === "all" || order.Status === status;

    let matchTime = true;
    const orderDate = new Date(order.OrderDate);
    if (time === "3months") {
      let diff = now - orderDate;
      matchTime = diff <= 90 * 24 * 60 * 60 * 1000;
    } else if (time === "6months") {
      let diff = now - orderDate;
      matchTime = diff <= 180 * 24 * 60 * 60 * 1000;
    } else if (!isNaN(parseInt(time))) {
      matchTime = orderDate.getFullYear().toString() === time;
    }

    let matchKeyword = keyword === "" || order.items.some(item =>
      item.Title.toLowerCase().includes(keyword)
    );

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
  ordersList.innerHTML = "";
  if (!orders.length) {
    ordersList.style.display = "none";
    emptyOrders.classList.remove("hidden");
    return;
  }
  emptyOrders.classList.add("hidden");
  ordersList.style.display = "block";

  for (const order of orders) {
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
            <img src="${item.Thumbnail}" alt="${item.Title}" />
            <div>
              <p>${item.Title}</p>
              <p>Số lượng: ${item.Quantity}</p>
              <p>Đơn giá: ${formatCurrency(item.UnitPrice)}</p>
            </div>
          </div>
        `).join("")}
      </div>
      <div class="order-footer">
        <p>Ghi chú: ${order.ShippingNote || "(Không có)"}</p>
        <p>Tổng tiền: ${formatCurrency(order.TotalAmount)}</p>
        <p>Trạng thái: ${order.Status}</p>
        <p>Thanh toán: ${order.PaymentStatus} (${order.PaymentMethod})</p>
      </div>
    `;
    ordersList.appendChild(orderDiv);
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

// Event listeners
searchBtn.addEventListener("click", () => {
  currentPage = 1;
  saveFiltersToLocal();
  applyFilters();
});

prevPageBtn.addEventListener("click", () => {

  currentPage--;
  applyFilters();
});

nextPageBtn.addEventListener("click", () => {
  currentPage++;
  applyFilters();
});

// Init
loadFiltersFromLocal();
fetchOrders();

//
 // === AVATAR UPLOAD ===
 const avatarInput = document.getElementById('avatarInput');
 const changeAvatarBtn = document.getElementById('changeAvatarBtn');
 const avatarImage = document.getElementById('avatarImage');

 changeAvatarBtn.addEventListener('click', function () {
   avatarInput.click();
 });

 avatarInput.addEventListener('change', function (e) {
   if (e.target.files && e.target.files[0]) {
     const file = e.target.files[0];
     if (file.size > 2 * 1024 * 1024) return alert('Ảnh không được quá 2MB');
     if (!file.type.match('image.*')) return alert('Chỉ chấp nhận ảnh');

     const reader = new FileReader();
     reader.onload = function (event) {
       avatarImage.src = event.target.result;
       uploadAvatarToServer(file);
     };
     reader.readAsDataURL(file);
   }
 });

 function uploadAvatarToServer(file) {
   const formData = new FormData();
   formData.append('avatar', file);

   fetch('http://localhost/webproject/tech-store-web/back-end/php/api/update-avatar-user', {
     method: 'POST',
     headers: {
       'Authorization': 'Bearer ' + token
     },
     body: formData
   })
     .then(res => res.json())
     .then(result => {
       if (result.success) {
         alert('Cập nhật ảnh thành công!');
       } else {
         alert('Lỗi: ' + result.message);
       }
     })
     .catch(error => {
       console.error('Upload avatar error:', error);
       alert('Không thể tải lên ảnh đại diện!');
     });
 }

});
