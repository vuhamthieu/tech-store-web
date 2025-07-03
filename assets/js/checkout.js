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

  // Coupon functionality - DECLARE THIS FIRST
  let appliedCoupon = null;

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
  authFetch("https://provinces.open-api.vn/api/p/")
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

    authFetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
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

    authFetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
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
    const provinceValue = provinceSelect.value;
    const districtValue = districtSelect.value;
    const wardValue = wardSelect.value;

    // Debug: Log all values to see what's happening
    console.log("Form validation debug:", {
      fullname,
      phone,
      street,
      provinceValue,
      districtValue,
      wardValue,
      provinceSelectedIndex: provinceSelect.selectedIndex,
      districtSelectedIndex: districtSelect.selectedIndex,
      wardSelectedIndex: wardSelect.selectedIndex
    });

    if (!fullname || !phone || !provinceValue || !districtValue || !wardValue || !street) {
      console.log("Validation failed for:", {
        fullname: !fullname,
        phone: !phone,
        provinceValue: !provinceValue,
        districtValue: !districtValue,
        wardValue: !wardValue,
        street: !street
      });
      alert("Vui lòng điền đầy đủ thông tin địa chỉ.");
      return;
    }

    // Get the text values for the address
    const provinceText = provinceSelect.options[provinceSelect.selectedIndex]?.text || "";
    const districtText = districtSelect.options[districtSelect.selectedIndex]?.text || "";
    const wardText = wardSelect.options[wardSelect.selectedIndex]?.text || "";

    // Lấy thông tin giỏ hàng và user
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    let checkoutList = JSON.parse(localStorage.getItem("checkout") || "[]");

    if (!user.UserID) {
      alert("Vui lòng đăng nhập để đặt hàng!");
      window.location.href = "login.html";
      return;
    }

    if (!cart.length && !checkoutList.length) {
      alert("Vui lòng có sản phẩm trong giỏ hàng!");
      window.location.href = "cart.html";
      return;
    }

    // Lấy phương thức thanh toán
    let paymentMethod = null;
    let selectedPaymentOption = null;

    document.querySelectorAll('.payment-option').forEach((opt, idx) => {
      if (opt.classList.contains('selected')) {
        selectedPaymentOption = opt;
        if (idx === 0) paymentMethod = "cod";
        if (idx === 1) paymentMethod = "momo";
        if (idx === 2) paymentMethod = "visa";
      }
    });

    // Kiểm tra xem người dùng đã chọn phương thức thanh toán chưa
    if (!paymentMethod || !selectedPaymentOption) {
      alert("Vui lòng chọn phương thức thanh toán!");
      btnText.style.display = 'inline';
      loadingSpinner.style.display = 'none';
      return;
    }

    // Tính tổng tiền
    let shippingFee = 20000;
    let discount = 0;
    let totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + shippingFee - discount;

    // Loading
    btnText.style.display = 'none';
    loadingSpinner.style.display = 'inline-block';

    // Use checkout list for order
    if (!checkoutList.length) {
      checkoutList = JSON.parse(localStorage.getItem("cart") || "[]");
    }

    // Validate that we have products to order
    if (!checkoutList.length) {
      alert("Không có sản phẩm nào để đặt hàng!");
      btnText.style.display = 'inline';
      loadingSpinner.style.display = 'none';
      return;
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
      const orderRes = await authFetch("http://localhost/webproject/tech-store-web/back-end/php/api/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          user_id: user.UserID,
          shipping_name: fullname,
          shipping_phone: phone,
          shipping_address: `${street}, ${wardText}, ${districtText}, ${provinceText}`,
          total_amount: window._checkoutTotal + 20000 - (appliedCoupon ? appliedCoupon.discount_amount : 0),
          payment_method: paymentMethod,
          items: items,
          coupon_id: appliedCoupon ? appliedCoupon.coupon_id : null
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

      // Clear cart and checkout data after successful order
      localStorage.removeItem("cart");
      localStorage.removeItem("checkout");

      // Nếu là COD, hiển thị modal thành công
      if (paymentMethod === "cod") {
        // Gọi confirm_payment cho COD
        await authFetch("http://localhost/webproject/tech-store-web/back-end/php/api/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payment_method: "cod"
          })
        });
        btnText.style.display = 'inline';
        loadingSpinner.style.display = 'none';
        successModal.style.display = 'flex';
        return;
      } else if (paymentMethod === "momo" || paymentMethod === "visa") {
        let payApi = paymentMethod === "momo"
          ? "momo_payment.php"
          : "visa_payment.php";
        console.log("Calling payment API:", payApi);
        const payRes = await authFetch(`http://localhost/webproject/tech-store-web/back-end/php/api/${payApi}`, {
          method: "POST",
          body: new URLSearchParams({
            amount: window._checkoutTotal + 20000 - (appliedCoupon ? appliedCoupon.discount_amount : 0),
            order_info: `Thanh toán đơn hàng #${orderData.order_id}`
          })
        });
        const payData = await payRes.json();
        console.log("Payment API response:", payData);
        btnText.style.display = 'inline';
        loadingSpinner.style.display = 'none';
        successModal.style.display = 'flex';
        return;
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
    const discount = appliedCoupon ? appliedCoupon.discount_amount : 0;
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

  const token = localStorage.getItem("access_token");
  const code = "SALE50";
  const orderAmount = 1000000; // total order value
  const productIds = [1, 2, 3]; // IDs of products in cart


  // Coupon functionality
  // Apply coupon from available coupons
  document.querySelectorAll('.apply-coupon-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const couponItem = this.closest('.coupon-item');
      const code = couponItem.dataset.code;
      applyCoupon(code);
    });
  });

  // Apply coupon from manual input
  document.getElementById('applyCouponBtn').addEventListener('click', function () {
    const code = document.getElementById('couponInput').value.trim();
    if (code) {
      applyCoupon(code);
    } else {
      alert('Vui lòng nhập mã giảm giá');
    }
  });

  // Remove applied coupon
  document.getElementById('removeCouponBtn').addEventListener('click', function () {
    removeCoupon();
  });

  function applyCoupon(code) {
    const token = localStorage.getItem("access_token");
    const orderAmount = window._checkoutTotal || 0;

    let checkoutList = JSON.parse(localStorage.getItem("checkout") || "[]");
    if (!checkoutList.length) {
      checkoutList = JSON.parse(localStorage.getItem("cart") || "[]");
    }
    const productIds = checkoutList.map(item => item.product_id || item.ProductID);

    authFetch("http://localhost/webproject/tech-store-web/back-end/php/api/use-coupon", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        code: code,
        order_amount: orderAmount,
        product_ids: productIds
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          appliedCoupon = {
            code: code,
            discount_amount: data.discount_amount,
            coupon_id: data.coupon_id
          };

          showAppliedCoupon(code, data.discount_amount);
          updateTotal();

          document.querySelectorAll('.apply-coupon-btn').forEach(btn => {
            btn.disabled = true;
            btn.textContent = 'Đã áp dụng';
          });

          alert(data.message);
        } else {
          alert(data.message);
        }
      })
      .catch(error => {
        console.error('Error applying coupon:', error);
        alert('Có lỗi xảy ra khi áp dụng mã giảm giá');
      });
  }

  function showAppliedCoupon(code, discountAmount) {
    const appliedCouponDiv = document.getElementById('appliedCoupon');
    const appliedCouponCode = document.getElementById('appliedCouponCode');
    const appliedCouponDiscount = document.getElementById('appliedCouponDiscount');

    appliedCouponCode.textContent = code;
    appliedCouponDiscount.textContent = `Giảm ${discountAmount.toLocaleString()}đ`;
    appliedCouponDiv.style.display = 'flex';
  }

  function removeCoupon() {
    appliedCoupon = null;

    document.getElementById('appliedCoupon').style.display = 'none';

    document.querySelectorAll('.apply-coupon-btn').forEach(btn => {
      btn.disabled = false;
      btn.textContent = 'Áp dụng';
    });

    updateTotal();
  }
});