document.addEventListener('DOMContentLoaded', function () {
  // DOM Elements
  const provinceSelect = document.getElementById("province");
  const districtSelect = document.getElementById("district");
  const wardSelect = document.getElementById("ward");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const btnText = document.getElementById("btnText");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const successModal = document.getElementById("successModal");
  const closeModal = document.getElementById("closeModal");

  // 1. Chọn phương thức giao hàng
  document.querySelectorAll('.shipping-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.shipping-option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
    });
  });

  // 2. Chọn phương thức thanh toán
  document.querySelectorAll('.payment-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
    });
  });

  // 3. Áp dụng mã giảm giá
  document.querySelector('.voucher-input button').addEventListener('click', () => {
    const voucherInput = document.querySelector('.voucher-input input');
    if (voucherInput.value.trim() === '') {
      alert('Vui lòng nhập mã giảm giá');
    } else {
      alert(`Áp dụng mã: ${voucherInput.value}`);
    }
  });

  // 4. Load Tỉnh
  fetch("https://provinces.open-api.vn/api/p/")
    .then(res => res.json())
    .then(data => {
      data.forEach(p => {
        const option = document.createElement("option");
        option.value = p.code;
        option.textContent = p.name;
        provinceSelect.appendChild(option);
      });
    });

  // 5. Load Quận/Huyện khi chọn tỉnh
  provinceSelect.addEventListener("change", () => {
    const provinceCode = provinceSelect.value;
    districtSelect.innerHTML = '<option value="">-- Chọn Quận / Huyện --</option>';
    wardSelect.innerHTML = '<option value="">-- Chọn Phường / Xã --</option>';

    fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
      .then(res => res.json())
      .then(data => {
        data.districts.forEach(d => {
          const option = document.createElement("option");
          option.value = d.code;
          option.textContent = d.name;
          districtSelect.appendChild(option);
        });
      });
  });

  // 6. Load Phường/Xã khi chọn quận
  districtSelect.addEventListener("change", () => {
    const districtCode = districtSelect.value;
    wardSelect.innerHTML = '<option value="">-- Chọn Phường / Xã --</option>';

    fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      .then(res => res.json())
      .then(data => {
        data.wards.forEach(w => {
          const option = document.createElement("option");
          option.value = w.code;
          option.textContent = w.name;
          wardSelect.appendChild(option);
        });
      });
  });

  // Prefill user info if available
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user.FullName) document.getElementById("fullname").value = user.FullName;
  if (user.Phone) document.getElementById("phone").value = user.Phone;
  if (user.Address) document.getElementById("street").value = user.Address;

  // 7. Nút Thanh Toán
  checkoutBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");
    const fullname = document.getElementById("fullname").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const street = document.getElementById("street").value.trim();
    const provinceText = provinceSelect.options[provinceSelect.selectedIndex]?.text || "";
    const districtText = districtSelect.options[districtSelect.selectedIndex]?.text || "";
    const wardText = wardSelect.options[wardSelect.selectedIndex]?.text || "";

    if (!fullname || !phone || !provinceText || !districtText || !wardText || !street) {
      alert("Vui lòng điền đầy đủ thông tin địa chỉ.");
      return;
    }

    // Lấy thông tin giỏ hàng và user
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!user.UserID || !cart.length) {
      alert("Vui lòng đăng nhập và có sản phẩm trong giỏ hàng!");
      return;
    }

    // Lấy phương thức thanh toán
    let paymentMethod = "cod";
    document.querySelectorAll('.payment-option').forEach((opt, idx) => {
      if (opt.classList.contains('selected')) {
        if (idx === 0) paymentMethod = "cod";
        if (idx === 1) paymentMethod = "momo";
        if (idx === 2) paymentMethod = "visa";
      }
    });

    // Tính tổng tiền
    let shippingFee = 20000;
    let discount = 0;
    let totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + shippingFee - discount;

    // Loading
    btnText.style.display = 'none';
    loadingSpinner.style.display = 'inline-block';

    // Use checkout list for order
    let checkoutList = JSON.parse(localStorage.getItem("checkout") || "[]");
    if (!checkoutList.length) {
      checkoutList = JSON.parse(localStorage.getItem("cart") || "[]");
    }
    console.log("checkoutList", checkoutList);
    // Prepare items for API
    const items = checkoutList.map(item => ({
      product_id: item.product_id || item.ProductID,
      quantity: item.quantity || item.Quantity,
      unit_price: item.price || item.Price
    }));

    // Gọi API đặt hàng
    try {
      console.log("Placing order...");
      const orderRes = await fetch("http://localhost/webproject/tech-store-web/back-end/php/api/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          user_id: user.UserID,
          shipping_name: fullname,
          shipping_phone: phone,
          shipping_address: `${street}, ${wardText}, ${districtText}, ${provinceText}`,
          total_amount: window._checkoutTotal + 20000,
          payment_method: paymentMethod,
          items: items
        })
      });
      const orderData = await orderRes.json();
      console.log("Order API response:", orderData);

      if (!orderData.success) {
        alert(orderData.message || "Đặt hàng thất bại!");
        btnText.style.display = 'inline';
        loadingSpinner.style.display = 'none';
        return;
      }

      // Nếu là COD, hiển thị modal thành công
      if (paymentMethod === "cod") {
        btnText.style.display = 'inline';
        loadingSpinner.style.display = 'none';
        successModal.style.display = 'flex';
        localStorage.removeItem("cart");
        localStorage.removeItem("checkout");
        return;
      } else if (paymentMethod === "momo" || paymentMethod === "visa") {
        let payApi = paymentMethod === "momo"
          ? "momo_payment.php"
          : "visa_payment.php";
        console.log("Calling payment API:", payApi);
        const payRes = await fetch(`http://localhost/webproject/tech-store-web/back-end/php/api/${payApi}`, {
          method: "POST",
          body: new URLSearchParams({
            amount: totalAmount,
            order_info: `Thanh toán đơn hàng #${orderData.order_id}`
          })
        });
        const payData = await payRes.json();
        console.log("Payment API response:", payData);
        if (payData.success && payData.pay_url) {
          await fetch("http://localhost/webproject/tech-store-web/back-end/php/api/store-payment-token", {
            method: "POST",
            body: new URLSearchParams({
              payment_token: payData.payment_token,
              order_id: orderData.order_id,
              user_id: user.UserID,
              amount: totalAmount
            })
          });
          window.location.href = payData.pay_url;
        } else {
          alert(payData.message || "Lỗi thanh toán!");
          btnText.style.display = 'inline';
          loadingSpinner.style.display = 'none';
        }
      } else {
        alert("Vui lòng chọn phương thức thanh toán hợp lệ!");
        btnText.style.display = 'inline';
        loadingSpinner.style.display = 'none';
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Có lỗi xảy ra khi đặt hàng hoặc thanh toán!");
      btnText.style.display = 'inline';
      loadingSpinner.style.display = 'none';
    }
  });

  // 8. Đóng modal
  closeModal.addEventListener("click", () => {
    successModal.style.display = "none";
    // window.location.href = 'index.html'; // chuyển trang nếu cần
  });



  // Select Payment Method
  const paymentOptions = document.querySelectorAll('.payment-option');

  paymentOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Bỏ chọn tất cả
      paymentOptions.forEach(opt => opt.classList.remove('selected'));

      // Chọn cái vừa click
      option.classList.add('selected');
    });
  });

  // Hiển thị sản phẩm trong đơn hàng
  function renderCart() {
    // Get checkout list (if user clicked "Mua ngay" or "Mua hàng"), else use cart
    let checkoutList = JSON.parse(localStorage.getItem("checkout") || "[]");
    if (!checkoutList.length) {
      checkoutList = JSON.parse(localStorage.getItem("cart") || "[]");
    }
    const productList = document.querySelector(".product-list");
    const orderTitle = document.querySelector(".order-summary .card-title");
    if (orderTitle) {
      orderTitle.innerHTML = `Đơn hàng (${checkoutList.length} sản phẩm)`;
    }
    if (!productList) return;
    productList.innerHTML = "";
    let total = 0;
    checkoutList.forEach(item => {
      // Fallbacks for missing fields
      const img = item.image || item.Thumbnail || "https://via.placeholder.com/60";
      const name = item.name || item.Title || "Sản phẩm";
      const price = item.price || item.Price || 0;
      const options = item.options || item.Options || "";
      const quantity = item.quantity || item.Quantity || 1;
      total += price * quantity;
      productList.innerHTML += `
        <div class="product-item">
          <img src="${img}" alt="${name}" class="product-image">
          <div class="product-details">
            <div class="product-name">${name}</div>
            <div class="product-variant">${options}</div>
            <div class="product-variant">Số lượng: ${quantity}</div>
            <div class="product-price">${price.toLocaleString()}đ</div>
          </div>
        </div>
      `;
    });
    // Update price rows
    const priceRows = document.querySelectorAll(".price-row");
    if (priceRows[0]) priceRows[0].lastElementChild.textContent = `${total.toLocaleString()}đ`;
    // Save total for later use
    window._checkoutTotal = total;
    updateTotal();
  }

  function updateTotal() {
    // Use the total from renderCart
    const total = window._checkoutTotal || 0;
    const shippingFee = 20000;
    const discount = 0;
    const priceRows = document.querySelectorAll(".price-row");
    if (priceRows[1]) priceRows[1].lastElementChild.textContent = `${shippingFee.toLocaleString()}đ`;
    if (priceRows[2]) priceRows[2].lastElementChild.textContent = `-${discount.toLocaleString()}đ`;
    const totalRows = document.querySelectorAll(".total-row");
    if (totalRows[0]) totalRows[0].lastElementChild.textContent = `${(total + shippingFee - discount).toLocaleString()}đ`;
  }

  // Call these on page load
  renderCart();
  updateTotal();

  document.getElementById("goToCart")?.addEventListener("click", function () {
    window.location.href = "cart.html";
  });
});