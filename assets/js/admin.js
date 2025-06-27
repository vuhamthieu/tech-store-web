async function fetchData(endpoint) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData[endpoint] || []);
    }, 500); // test mock API
  });
}

// Load dashboard data
async function loadDashboard() {
  const token = localStorage.getItem("access_token");
  const res = await fetch("../back-end/php/api/get-dashboard-overview", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const result = await res.json();
  if (result.success && result.overview) {
    const data = result.overview;
    document.getElementById("totalOrders").textContent = data.total_orders;
    document.getElementById("totalRevenue").textContent = `₫${data.monthly_revenue.toLocaleString()}`;
    document.getElementById("totalCustomers").textContent = data.total_customers;
    document.getElementById("totalProducts").textContent = data.total_products;

    let html = "";
    data.recent_orders.forEach(order => {
      let statusText, statusClass;
      if (order.status == 1) {
        statusText = "Đã duyệt";
        statusClass = "approved";
      } else if (order.status == 2) {
        statusText = "Đã từ chối";
        statusClass = "declined";
      } else {
        statusText = "Chờ xử lý";
        statusClass = "pending";
      }

      html += `
        <tr>
          <td>${order.order_id}</td>
          <td>${order.customer}</td>
          <td>${order.order_date}</td>
          <td class="text-red">₫${order.total.toLocaleString()}</td>
          <td><span class="status ${statusClass}">
            ${statusText}
          </span></td>
        </tr>
      `;
    });
    document.querySelector("#recentOrders tbody").innerHTML = html;
  }
}

// Load orders data
async function loadOrders() {
  const token = localStorage.getItem("access_token");
  const res = await fetch("../back-end/php/api/get-all-orders", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const result = await res.json();
  if (result.success && Array.isArray(result.data)) {
    let html = "";
    result.data.forEach(order => {
      const statusText = order.Status == 1 ? "Đã duyệt" : order.Status == 2 ? "Đã từ chối" : "Chờ xử lý";
      const statusClass = order.Status == 1 ? "approved" : order.Status == 2 ? "declined" : "pending";

      html += `
        <tr>
          <td>${order.OrderID}</td>
          <td>${order.ShippingName}</td>
          <td>${order.OrderDate}</td>
          <td class="text-red">₫${order.TotalAmount.toLocaleString()}</td>
          <td><span class="status ${statusClass}">${statusText}</span></td>
          <td>
            ${Number(order.Status) === 0 ? `
              <button class="btn btn-success btn-sm" onclick="approveOrder(${order.OrderID})" title="Duyệt đơn hàng">
                <i class="fas fa-check"></i>
              </button>
              <button class="btn btn-danger btn-sm" onclick="declineOrder(${order.OrderID})" title="Từ chối đơn hàng">
                <i class="fas fa-times"></i>
              </button>
            ` : ''}
          </td>
        </tr>
      `;
    });
    document.querySelector("#ordersTable tbody").innerHTML = html;
  }
}

// Load product data
async function loadProducts() {
  const token = localStorage.getItem("access_token");
  const res = await fetch("../back-end/php/api/get-all-products", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const result = await res.json();
  if (result.success && Array.isArray(result.data)) {
    let html = "";
    result.data.forEach(product => {
      html += `
        <tr>
          <td>${product.ProductID}</td>
          <td>${product.Title}</td>
          <td class="text-red">₫${parseFloat(product.Price).toLocaleString()}</td>
          <td>${product.Stock}</td>
          <td>
            <button class="btn btn-primary btn-sm"><i class="fas fa-edit"></i></button>
            <button class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
          </td>
        </tr>
      `;
    });
    document.querySelector("#productsTable tbody").innerHTML = html;
  }
}

// Load user data
async function loadUsers() {
  const token = localStorage.getItem("access_token");
  const res = await fetch("../back-end/php/api/get-all-users", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const result = await res.json();
  if (result.success && Array.isArray(result.data)) {
    let html = "";
    result.data.forEach(user => {
      const statusText = user.is_disabled ? "Đã vô hiệu" : "Hoạt động";
      const statusClass = user.is_disabled ? "disabled" : "active";

      html += `
        <tr>
          <td>${user.user_id}</td>
          <td>${user.full_name}</td>
          <td>${user.email}</td>
          <td>${user.phone || "N/A"}</td>
          <td>${user.created_at || "N/A"}</td>
          <td><span class="status ${statusClass}">${statusText}</span></td>
          <td>
            ${!user.is_disabled ? `
              <button class="btn btn-warning btn-sm" onclick="disableUser(${user.user_id})" title="Vô hiệu hóa tài khoản">
                <i class="fas fa-user-slash"></i>
              </button>
            ` : `
              <button class="btn btn-success btn-sm" onclick="enableUser(${user.user_id})" title="Kích hoạt tài khoản">
                <i class="fas fa-user-check"></i>
              </button>
            `}
          </td>
        </tr>
      `;
    });
    document.querySelector("#usersTable tbody").innerHTML = html;
  }
}

// Disable user function
async function disableUser(userId) {
  if (!confirm('Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?')) return;

  const token = localStorage.getItem("access_token");
  try {
    const res = await fetch("../back-end/php/api/disable-user", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user_id: userId })
    });

    const result = await res.json();
    if (result.success) {
      alert("Đã vô hiệu hóa tài khoản thành công!");
      loadUsers(); // Refresh users table
    } else {
      alert("Lỗi: " + result.message);
    }
  } catch (error) {
    console.error("Lỗi khi vô hiệu hóa tài khoản:", error);
    alert("Đã xảy ra lỗi khi vô hiệu hóa tài khoản");
  }
}

// Enable user function (you'll need to create this API)
async function enableUser(userId) {
  if (!confirm('Bạn có chắc chắn muốn kích hoạt tài khoản này?')) return;

  const token = localStorage.getItem("access_token");
  try {
    const res = await fetch("../back-end/php/api/enable-user", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user_id: userId })
    });

    const result = await res.json();
    if (result.success) {
      alert("Đã kích hoạt tài khoản thành công!");
      loadUsers(); // Refresh users table
    } else {
      alert("Lỗi: " + result.message);
    }
  } catch (error) {
    console.error("Lỗi khi kích hoạt tài khoản:", error);
    alert("Đã xảy ra lỗi khi kích hoạt tài khoản");
  }
}

// Approve order function
async function approveOrder(orderId) {
  if (!confirm('Bạn có chắc chắn muốn duyệt đơn hàng này?')) return;

  const token = localStorage.getItem("access_token");
  try {
    const res = await fetch("../back-end/php/api/approve-order", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ order_id: orderId })
    });

    const result = await res.json();
    if (result.success) {
      alert("Đã duyệt đơn hàng thành công!");
      loadOrders(); // Refresh orders table
      loadDashboard(); // Refresh dashboard overview
    } else {
      alert("Lỗi: " + result.message);
    }
  } catch (error) {
    console.error("Lỗi khi duyệt đơn hàng:", error);
    alert("Đã xảy ra lỗi khi duyệt đơn hàng");
  }
}

// Decline order function
async function declineOrder(orderId) {
  const reason = prompt('Lý do từ chối đơn hàng (không bắt buộc):') || 'Không có lý do cụ thể';

  const token = localStorage.getItem("access_token");
  try {
    const res = await fetch("../back-end/php/api/decline-order", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        order_id: orderId,
        reason: reason
      })
    });

    const result = await res.json();
    if (result.success) {
      alert("Đã từ chối đơn hàng thành công!");
      loadOrders(); // Refresh orders table
      loadDashboard(); // Refresh dashboard overview
    } else {
      alert("Lỗi: " + result.message);
    }
  } catch (error) {
    console.error("Lỗi khi từ chối đơn hàng:", error);
    alert("Đã xảy ra lỗi khi từ chối đơn hàng");
  }
}

// Show section based on menu click
function showSection(sectionId) {
  // Undisplay all sections
  document
    .querySelectorAll(".section")
    .forEach((s) => s.classList.remove("active"));

  // Show selected selection
  document.getElementById(sectionId).classList.add("active");

  // Update active menu
  document
    .querySelectorAll(".sidebar a")
    .forEach((a) => a.classList.remove("active"));
  event.currentTarget.classList.add("active");

  // Load data
  if (sectionId === "dashboard") loadDashboard();
  if (sectionId === "orders") loadOrders();
  if (sectionId === "products") loadProducts();
  if (sectionId === "users") loadUsers();
}

document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user.RoleID || user.RoleID != 2) {
    window.location.href = "index.html";
    return;
  }
  loadDashboard();
});
