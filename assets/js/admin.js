async function authFetchData(endpoint) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData[endpoint] || []);
    }, 500); // test mock API
  });
}

// Load dashboard data
async function loadDashboard() {
  const token = localStorage.getItem("access_token");
  const res = await authFetch("../back-end/php/api/get-dashboard-overview", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const result = await res.json();
  console.log("Dashboard data:", result);
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
        statusText = "Đã giao hàng";
        statusClass = "approved";
      } else if (order.status == 2) {
        statusText = "Đã từ chối";
        statusClass = "declined";
      } else {
        statusText = "Chưa giao hàng";
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

let allOrdersData = []; // Store all orders data for filtering

// Load orders data with filter and search
async function loadOrders(statusFilter = '', searchTerm = '') {
  const token = localStorage.getItem("access_token");
  const res = await authFetch("../back-end/php/api/get-all-orders", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const result = await res.json();

  if (result.success && Array.isArray(result.data)) {
    // Store all data for client-side filtering
    allOrdersData = result.data;

    let filteredOrders = result.data;

    // Apply status filter if specified
    if (statusFilter !== '') {
      filteredOrders = filteredOrders.filter(order => order.Status == statusFilter);
    }

    // Apply search filter if specified
    if (searchTerm !== '') {
      const searchLower = searchTerm.toLowerCase();
      filteredOrders = filteredOrders.filter(order =>
        order.OrderID.toString().includes(searchLower) ||
        order.ShippingName.toLowerCase().includes(searchLower) ||
        order.OrderDate.toLowerCase().includes(searchLower)
      );
    }

    renderOrdersTable(filteredOrders);
  }
}

// Render orders table
function renderOrdersTable(orders) {
  let html = "";

  if (orders.length > 0) {
    orders.forEach(order => {
      const statusText = order.Status == 1 ? "Đã giao hàng" : order.Status == 2 ? "Đã từ chối" : "Chưa giao hàng";
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
            ` : `
              <button class="btn btn-danger btn-sm" onclick="deleteOrder(${order.OrderID})" title="Xóa đơn hàng">
                <i class="fas fa-trash"></i>
              </button>
            `}
          </td>
        </tr>
      `;
    });
  } else {
    html = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 40px; color: #666;">
          <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 10px; display: block; color: #ddd;"></i>
          Không có đơn hàng nào phù hợp với bộ lọc
        </td>
      </tr>
    `;
  }

  document.querySelector("#ordersTable tbody").innerHTML = html;
}

// Search orders function
function searchOrders() {
  const searchTerm = document.getElementById("orderSearchInput").value.trim();
  const statusFilter = document.getElementById("orderStatusFilter").value;

  if (allOrdersData.length > 0) {
    let filteredOrders = allOrdersData;

    // Apply status filter
    if (statusFilter !== '') {
      filteredOrders = filteredOrders.filter(order => order.Status == statusFilter);
    }

    // Apply search filter
    if (searchTerm !== '') {
      const searchLower = searchTerm.toLowerCase();
      filteredOrders = filteredOrders.filter(order =>
        order.OrderID.toString().includes(searchLower) ||
        order.ShippingName.toLowerCase().includes(searchLower) ||
        order.OrderDate.toLowerCase().includes(searchLower)
      );
    }

    renderOrdersTable(filteredOrders);
  }
}

// Clear order filter
function clearOrderFilter() {
  document.getElementById("orderStatusFilter").value = "";
  document.getElementById("orderSearchInput").value = "";
  loadOrders();
}

// Clear order search
function clearOrderSearch() {
  document.getElementById("orderSearchInput").value = "";
  const statusFilter = document.getElementById("orderStatusFilter").value;
  loadOrders(statusFilter);
}

// Load product data
async function loadProducts() {
  const token = localStorage.getItem("access_token");
  const res = await authFetch("../back-end/php/api/get-all-products", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const result = await res.json();
  if (result.success && Array.isArray(result.data)) {
    let html = "";
    result.data.forEach(product => {
      const imageHtml = product.Thumbnail ?
        `<img src="${product.Thumbnail}" alt="${product.Title}" class="product-image">` :
        `<div class="product-image-placeholder">No img</div>`;

      html += `
        <tr>
          <td>${product.ProductID}</td>
          <td>${imageHtml}</td>
          <td>${product.Title}</td>
          <td>${product.CategoryName || 'N/A'}</td>
          <td class="text-red">₫${parseFloat(product.Price).toLocaleString()}</td>
          <td>${product.Stock}</td>
          <td>${product.Brand || 'N/A'}</td>
          <td>
            <div class="btn-group">
              <button class="btn btn-warning btn-sm" onclick="editProduct(${product.ProductID})" title="Sửa sản phẩm">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.ProductID})" title="Xóa sản phẩm">
                <i class="fas fa-trash"></i>
              </button>
            </div>
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
  const res = await authFetch("../back-end/php/api/get-all-users", {
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
    const res = await authFetch("../back-end/php/api/disable-user", {
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
    const res = await authFetch("../back-end/php/api/enable-user", {
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
    const res = await authFetch("../back-end/php/api/approve-order", {
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
    const res = await authFetch("../back-end/php/api/decline-order", {
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

// Logout function
async function logout() {
  if (!confirm('Bạn có chắc chắn muốn đăng xuất?')) return;

  const token = localStorage.getItem("access_token");

  try {
    // Gọi API logout để thu hồi token
    const res = await authauthFetch("../back-end/php/api/logout", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const result = await res.json();

    // Xóa dữ liệu đăng nhập khỏi localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("cart");
    localStorage.removeItem("checkout");

    // Hiển thị thông báo
    if (result.success) {
      alert("Đăng xuất thành công!");
    } else {
      alert("Đăng xuất thành công! (Có lỗi nhỏ khi thu hồi token)");
    }

    // Chuyển về trang chủ
    window.location.href = "index.html";

  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);

    // Vẫn xóa localStorage và chuyển trang ngay cả khi có lỗi
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("cart");
    localStorage.removeItem("checkout");

    alert("Đăng xuất thành công!");
    window.location.href = "index.html";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("access_token") || localStorage.getItem("token");

  // Kiểm tra đăng nhập và quyền admin
  if (!user.UserID || !token || user.RoleID != 2) {
    alert("Bạn không có quyền truy cập trang admin!");
    window.location.href = "index.html";
    return;
  }

  // Cập nhật thông tin user trong header
  const userProfile = document.getElementById("userProfile");
  if (userProfile && user.FullName) {
    if (user.Avatar) {
      // Nếu có avatar, hiển thị ảnh
      userProfile.innerHTML = `
        <img src="http://localhost/webproject/tech-store-web/assets/img/${user.Avatar}" 
             alt="Admin Avatar" 
             style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid #fff;">
        <span style="color: white;">${user.FullName}</span>
      `;
    } else {
      // Nếu không có avatar, hiển thị chữ cái đầu
      userProfile.innerHTML = `
        <div class="user-avatar">${user.FullName.charAt(0).toUpperCase()}</div>
        <span style="color: white;">${user.FullName}</span>
      `;
    }
  }

  loadDashboard();

  // Add filter event listener
  const orderStatusFilter = document.getElementById("orderStatusFilter");
  if (orderStatusFilter) {
    orderStatusFilter.addEventListener("change", function () {
      const searchTerm = document.getElementById("orderSearchInput").value.trim();
      loadOrders(this.value, searchTerm);
    });
  }

  // Add search input event listener (search on Enter key)
  const orderSearchInput = document.getElementById("orderSearchInput");
  if (orderSearchInput) {
    orderSearchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        searchOrders();
      }
    });
  }
});

// Product Modal Functions
let currentProductId = null;

function openAddProductModal() {
  currentProductId = null;
  document.getElementById('modalTitle').textContent = 'Thêm sản phẩm mới';
  document.getElementById('productForm').reset();
  document.getElementById('saveBtn').textContent = 'Thêm sản phẩm';
  document.getElementById('productModal').style.display = 'block';
}

function openEditProductModal(productId) {
  currentProductId = productId;
  document.getElementById('modalTitle').textContent = 'Sửa sản phẩm';
  document.getElementById('saveBtn').textContent = 'Cập nhật';

  // Load product data
  loadProductData(productId);
  document.getElementById('productModal').style.display = 'block';
}

function closeProductModal() {
  document.getElementById('productModal').style.display = 'none';
  currentProductId = null;
}

async function loadProductData(productId) {
  const token = localStorage.getItem("access_token");
  try {
    const res = await authFetch(`../back-end/php/api/product-details?product_id=${productId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const result = await res.json();

    if (result.success && result.data) {
      const product = result.data;
      document.getElementById('productTitle').value = product.Title || '';
      document.getElementById('productCategory').value = product.CategoryName || '';
      document.getElementById('productPrice').value = product.Price || '';
      document.getElementById('productStock').value = product.Stock || 0;
      document.getElementById('productBrand').value = product.Brand || '';
      document.getElementById('productThumbnail').value = product.Thumbnail || '';
      document.getElementById('productDescription').value = product.Description || '';
    }
  } catch (error) {
    console.error('Lỗi khi tải thông tin sản phẩm:', error);
    alert('Không thể tải thông tin sản phẩm');
  }
}

async function saveProduct(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const productData = {
    title: formData.get('title'),
    category: formData.get('category'),
    price: parseFloat(formData.get('price')),
    stock: parseInt(formData.get('stock')),
    brand: formData.get('brand'),
    thumbnail: formData.get('thumbnail'),
    description: formData.get('description')
  };

  if (currentProductId) {
    // Update existing product
    productData.product_id = currentProductId;
    await updateProduct(productData);
  } else {
    // Add new product
    await addProduct(productData);
  }
}

async function addProduct(productData) {
  const token = localStorage.getItem("access_token");
  try {
    const res = await authFetch("../back-end/php/api/add-product", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productData)
    });

    const result = await res.json();
    if (result.success) {
      alert("Thêm sản phẩm thành công!");
      closeProductModal();
      loadProducts(); // Refresh table
    } else {
      alert("Lỗi: " + (result.message || 'Không thể thêm sản phẩm'));
    }
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error);
    alert('Đã xảy ra lỗi khi thêm sản phẩm');
  }
}

async function updateProduct(productData) {
  const token = localStorage.getItem("access_token");
  try {
    const res = await authFetch("../back-end/php/api/update-info-product", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productData)
    });

    const result = await res.json();
    if (result.success) {
      alert("Cập nhật sản phẩm thành công!");
      closeProductModal();
      loadProducts(); // Refresh table
    } else {
      alert("Lỗi: " + (result.message || 'Không thể cập nhật sản phẩm'));
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm:', error);
    alert('Đã xảy ra lỗi khi cập nhật sản phẩm');
  }
}

async function deleteProduct(productId) {
  if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

  const token = localStorage.getItem("access_token");
  try {
    const res = await authFetch("../back-end/php/api/delete-product", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ product_id: productId })
    });

    const result = await res.json();
    if (result.success) {
      alert("Xóa sản phẩm thành công!");
      loadProducts(); // Refresh table
    } else {
      alert("Lỗi: " + (result.message || 'Không thể xóa sản phẩm'));
    }
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    alert('Đã xảy ra lỗi khi xóa sản phẩm');
  }
}

function editProduct(productId) {
  openEditProductModal(productId);
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById('productModal');
  if (event.target === modal) {
    closeProductModal();
  }
}

async function deleteOrder(orderId) {
  if (!confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) return;

  const token = localStorage.getItem("access_token");
  try {
    const res = await authFetch("../back-end/php/api/delete-order", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ order_id: orderId })
    });

    const result = await res.json();
    if (result.success) {
      alert("Xóa đơn hàng thành công!");
      loadOrders(); // Refresh orders table
      loadDashboard(); // Refresh dashboard
    } else {
      alert("Lỗi: " + (result.message || 'Không thể xóa đơn hàng'));
    }
  } catch (error) {
    console.error('Lỗi khi xóa đơn hàng:', error);
    alert('Đã xảy ra lỗi khi xóa đơn hàng');
  }
}
