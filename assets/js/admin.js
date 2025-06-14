async function fetchData(endpoint) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData[endpoint] || []);
    }, 500); // test mock API
  });
}

// Load dashboard data
async function loadDashboard() {
  const data = await fetchData("dashboard");
  if (data) {
    document.getElementById("totalOrders").textContent =
      data.totalOrders.toLocaleString();
    document.getElementById(
      "totalRevenue"
    ).textContent = `₫${data.totalRevenue.toLocaleString()}`;
    document.getElementById("totalCustomers").textContent =
      data.totalCustomers.toLocaleString();
    document.getElementById("totalProducts").textContent =
      data.totalProducts.toLocaleString();

    let html = "";
    data.recentOrders.forEach((order) => {
      html += `
                        <tr>
                            <td>${order.id}</td>
                            <td>${order.customer}</td>
                            <td>${order.date}</td>
                            <td class="text-red">₫${order.total.toLocaleString()}</td>
                            <td><span class="status ${order.status}">${
        order.status === "approved" ? "Đã duyệt" : "Chờ xử lý"
      }</span></td>
                        </tr>
                    `;
    });
    document.querySelector("#recentOrders tbody").innerHTML = html;
  }
}

// Load orders data
async function loadOrders() {
  const orders = await fetchData("orders");
  if (orders) {
    let html = "";
    orders.forEach((order) => {
      html += `
                        <tr>
                            <td>${order.id}</td>
                            <td>${order.customer}</td>
                            <td>${order.date}</td>
                            <td class="text-red">₫${order.total.toLocaleString()}</td>
                            <td><span class="status ${order.status}">${
        order.status === "approved" ? "Đã duyệt" : "Chờ xử lý"
      }</span></td>
                            <td>
                                <button class="btn btn-success btn-sm">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button class="btn btn-danger btn-sm">
                                    <i class="fas fa-times"></i>
                                </button>
                            </td>
                        </tr>
                    `;
    });
    document.querySelector("#ordersTable tbody").innerHTML = html;
  }
}

// Load product data
async function loadProducts() {
  const products = await fetchData("products");
  if (products) {
    let html = "";
    products.forEach((product) => {
      html += `
                        <tr>
                            <td>${product.id}</td>
                            <td>${product.name}</td>
                            <td class="text-red">₫${product.price.toLocaleString()}</td>
                            <td>${product.stock}</td>
                            <td>
                                <button class="btn btn-primary btn-sm">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-danger btn-sm">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
    });
    document.querySelector("#productsTable tbody").innerHTML = html;
  }
}

// Load user data
async function loadUsers() {
  const users = await fetchData("users");
  if (users) {
    let html = "";
    users.forEach((user) => {
      html += `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${user.phone}</td>
                            <td>${user.joinDate}</td>
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

document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
});
