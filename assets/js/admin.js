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
      html += `
        <tr>
          <td>${order.order_id}</td>
          <td>${order.customer}</td>
          <td>${order.order_date}</td>
          <td class="text-red">₫${order.total.toLocaleString()}</td>
          <td><span class="status ${order.status === 1 ? "approved" : "pending"}">
            ${order.status === 1 ? "Đã duyệt" : "Chờ xử lý"}
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
      html += `
        <tr>
          <td>${order.OrderID}</td>
          <td>${order.ShippingName}</td>
          <td>${order.OrderDate}</td>
          <td class="text-red">₫${order.TotalAmount.toLocaleString()}</td>
          <td><span class="status ${order.Status === 1 ? "approved" : "pending"}">
            ${order.Status === 1 ? "Đã duyệt" : "Chờ xử lý"}
          </span></td>
          <td>
            <button class="btn btn-success btn-sm"><i class="fas fa-check"></i></button>
            <button class="btn btn-danger btn-sm"><i class="fas fa-times"></i></button>
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
      html += `
        <tr>
          <td>${user.user_id}</td>
          <td>${user.full_name}</td>
          <td>${user.email}</td>
          <td>${user.phone}</td>
          <td>${user.created_at || ""}</td>
        </tr>
      `;
    });
    document.querySelector("#usersTable tbody").innerHTML = html;
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
