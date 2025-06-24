// Check authentication on page load
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("access_token") || localStorage.getItem("token");

  if (!token) {
    alert("Vui lòng đăng nhập để truy cập trang admin!");
    window.location.href = "login.html";
    return;
  }

  // Verify admin role
  try {
    const res = await fetch("../back-end/php/me", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();

    if (!data.success || data.data.RoleID < 2) {
      alert("Bạn không có quyền truy cập trang admin!");
      window.location.href = "index.html";
      return;
    }

    // Update admin info in header
    const adminName = document.querySelector(".user-profile span");
    if (adminName && data.data.FullName) {
      adminName.textContent = data.data.FullName;
    }

    // Load dashboard data
    loadDashboard();
  } catch (error) {
    console.error("Auth error:", error);
    alert("Lỗi xác thực!");
    window.location.href = "login.html";
  }
});

// Load dashboard data
async function loadDashboard() {
  try {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    const res = await fetch("../back-end/php/api/get_dashboard_overview.php", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await res.json();

    if (data.success) {
      const overview = data.overview;

      // Update stats
      document.getElementById("totalOrders").textContent = overview.total_orders.toLocaleString();
      document.getElementById("totalRevenue").textContent = `₫${overview.monthly_revenue.toLocaleString()}`;
      document.getElementById("totalCustomers").textContent = overview.total_customers.toLocaleString();
      document.getElementById("totalProducts").textContent = overview.total_products.toLocaleString();

      // Update recent orders table
      let html = "";
      overview.recent_orders.forEach((order) => {
        const orderDate = new Date(order.order_date).toLocaleDateString('vi-VN');
        const statusText = order.status === 1 ? "Đã duyệt" : "Chờ xử lý";
        const statusClass = order.status === 1 ? "approved" : "pending";

        html += `
          <tr>
            <td>${order.order_id}</td>
            <td>${order.customer}</td>
            <td>${orderDate}</td>
            <td class="text-red">₫${order.total.toLocaleString()}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
          </tr>
        `;
      });
      document.querySelector("#recentOrders tbody").innerHTML = html;
    } else {
      console.error("Failed to load dashboard:", data.message);
    }
  } catch (error) {
    console.error("Dashboard load error:", error);
  }
}

// Load orders data
async function loadOrders() {
  try {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    const res = await fetch("../back-end/php/api/get-all-orders", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await res.json();

    if (data.success) {
      let html = "";
      data.data.forEach(order => {
        const orderDate = new Date(order.OrderDate).toLocaleDateString('vi-VN');
        const statusText = order.Status == 1 ? "Đã duyệt" : "Chờ xử lý";
        const statusClass = order.Status == 1 ? 'approved' : 'pending';

        html += `
          <tr>
            <td>${order.OrderID}</td>
            <td>${order.ShippingName || 'N/A'}</td>
            <td>${orderDate}</td>
            <td class="text-red">₫${Number(order.TotalAmount).toLocaleString()}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>
              ${order.Status == 0 ? `
                <button class="btn btn-success btn-sm" onclick="approveOrder(${order.OrderID})">
                  <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="rejectOrder(${order.OrderID})">
                  <i class="fas fa-times"></i>
                </button>
              ` : `
                <span class="text-muted">Đã xử lý</span>
              `}
            </td>
          </tr>
        `;
      });
      document.querySelector("#ordersTable tbody").innerHTML = html;
    } else {
      console.error("Failed to load orders:", data.message);
    }
  } catch (error) {
    console.error("Orders load error:", error);
  }
}

// Load product data
async function loadProducts() {
  try {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    const res = await fetch("../back-end/php/api/get-all-products", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await res.json();

    if (data.success) {
      let html = "";
      data.data.forEach((product) => {
        html += `
          <tr>
            <td>${product.ProductID}</td>
            <td>${product.Title}</td>
            <td class="text-red">₫${Number(product.Price).toLocaleString()}</td>
            <td>${product.Stock}</td>
            <td>
              <button class="btn btn-primary btn-sm" onclick="editProduct(${product.ProductID})">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.ProductID})">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        `;
      });
      document.querySelector("#productsTable tbody").innerHTML = html;
    } else {
      console.error("Failed to load products:", data.message);
    }
  } catch (error) {
    console.error("Products load error:", error);
  }
}

// Load user data
async function loadUsers() {
  try {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    const res = await fetch("../back-end/php/api/get_all_users.php", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await res.json();

    if (data.success) {
      let html = "";
      data.data.forEach((user) => {
        const joinDate = new Date(user.created_at || Date.now()).toLocaleDateString('vi-VN');
        html += `
          <tr>
            <td>${user.user_id}</td>
            <td>${user.full_name}</td>
            <td>${user.email || 'N/A'}</td>
            <td>${user.phone || 'N/A'}</td>
            <td>${joinDate}</td>
          </tr>
        `;
      });
      document.querySelector("#usersTable tbody").innerHTML = html;
    } else {
      console.error("Failed to load users:", data.message);
    }
  } catch (error) {
    console.error("Users load error:", error);
  }
}

// Approve order
async function approveOrder(orderId) {
  if (!confirm("Bạn có chắc muốn duyệt đơn hàng này?")) return;

  try {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    const res = await fetch("../back-end/php/api/update-order-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        order_id: orderId,
        status: 1
      })
    });

    const data = await res.json();

    if (data.success) {
      alert("Đã duyệt đơn hàng thành công!");
      loadOrders(); // Reload orders table
      loadDashboard(); // Reload dashboard stats
    } else {
      alert("Lỗi: " + data.message);
    }
  } catch (error) {
    console.error("Approve order error:", error);
    alert("Lỗi khi duyệt đơn hàng!");
  }
}

// Reject order
async function rejectOrder(orderId) {
  if (!confirm("Bạn có chắc muốn từ chối đơn hàng này?")) return;

  try {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    const res = await fetch("../back-end/php/api/update-order-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        order_id: orderId,
        status: 2 // Rejected status
      })
    });

    const data = await res.json();

    if (data.success) {
      alert("Đã từ chối đơn hàng thành công!");
      loadOrders(); // Reload orders table
      loadDashboard(); // Reload dashboard stats
    } else {
      alert("Lỗi: " + data.message);
    }
  } catch (error) {
    console.error("Reject order error:", error);
    alert("Lỗi khi từ chối đơn hàng!");
  }
}

// Logout function
function logout() {
  if (confirm("Bạn có chắc muốn đăng xuất?")) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  }
}

// Show section based on menu click
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".section").forEach((s) => s.classList.remove("active"));

  // Show selected section
  document.getElementById(sectionId).classList.add("active");

  // Update active menu
  document.querySelectorAll(".sidebar a").forEach((a) => a.classList.remove("active"));
  event.currentTarget.classList.add("active");

  // Load data based on section
  if (sectionId === "dashboard") loadDashboard();
  if (sectionId === "orders") loadOrders();
  if (sectionId === "products") loadProducts();
  if (sectionId === "users") loadUsers();
}
