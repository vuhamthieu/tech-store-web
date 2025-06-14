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
  
    // 7. Nút Thanh Toán
    checkoutBtn.addEventListener("click", async () => {
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

      // Gọi API đặt hàng
      try {
        const orderRes = await fetch("http://localhost/webproject/tech-store-web/back-end/php/api/place_order.php", {
          method: "POST",
          body: new URLSearchParams({
            user_id: user.UserID,
            shipping_name: fullname,
            shipping_phone: phone,
            shipping_address: `${street}, ${wardText}, ${districtText}, ${provinceText}`,
            total_amount: totalAmount,
            payment_method: paymentMethod,
            // Thêm các trường khác nếu cần
          })
        });
        const orderData = await orderRes.json();
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
          return;
        }

        // Nếu là MOMO hoặc VISA, gọi API thanh toán
        let payApi = paymentMethod === "momo"
          ? "momo_payment.php"
          : "visa_payment.php";
        const payRes = await fetch(`http://localhost/webproject/tech-store-web/back-end/php/api/${payApi}`, {
          method: "POST",
          body: new URLSearchParams({
            amount: totalAmount,
            order_info: `Thanh toán đơn hàng #${orderData.order_id}`
          })
        });
        const payData = await payRes.json();
        if (payData.success && payData.pay_url) {
          await fetch("http://localhost/webproject/tech-store-web/back-end/php/api/store_payment_token.php", {
            method: "POST",
            body: new URLSearchParams({
              payment_token: payData.payment_token,
              order_id: orderData.order_id,
              user_id: user.UserID,
              amount: totalAmount
            })
          });
          // Chuyển hướng sang trang thanh toán
          window.location.href = payData.pay_url;
        } else {
          alert(payData.message || "Lỗi thanh toán!");
          btnText.style.display = 'inline';
          loadingSpinner.style.display = 'none';
        }
      } catch (error) {
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
    document.getElementById("checkoutBtn").addEventListener("click", function () {
        const fullName = document.getElementById("fullname").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const provinceSelect = document.getElementById("province");
        const districtSelect = document.getElementById("district");
        const wardSelect = document.getElementById("ward");
        const street = document.getElementById("street").value.trim();
      
        const provinceText = provinceSelect.options[provinceSelect.selectedIndex].text.trim();
        const districtText = districtSelect.options[districtSelect.selectedIndex].text.trim();
        const wardText = wardSelect.options[wardSelect.selectedIndex].text.trim();
      
        const fullAddress = `${street} ${wardText} ${districtText} ${provinceText}`; // Dấu cách giữa mỗi phần
      
        const data = {
          fullName: fullName,
          phone: phone,
          address: fullAddress
        };
      
        // Gửi đến API
        fetch("http://localhost/webproject/tech-store-web/back-end/php/api/save-address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        })
          .then(res => res.json())
          .then(response => {
            console.log("API Response:", response);
            alert("Đã gửi địa chỉ thành công!");
          })
          .catch(error => {
            console.error("Lỗi khi gửi API:", error);
            alert("Đã xảy ra lỗi khi gửi địa chỉ.");
          });
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
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const productList = document.querySelector(".product-list");
      if (!productList) return;
      productList.innerHTML = "";
      let total = 0;
      cart.forEach(item => {
        total += item.price * item.quantity;
        productList.innerHTML += `
          <div class="product-item">
            <img src="${item.image}" alt="${item.name}" class="product-image">
            <div class="product-details">
              <div class="product-name">${item.name}</div>
              <div class="product-variant">${item.variant || ""}</div>
              <div class="product-variant">Số lượng: ${item.quantity}</div>
              <div class="product-price">${item.price.toLocaleString()}đ</div>
            </div>
          </div>
        `;
      });
      // Hiển thị tổng tiền tạm tính
      const priceRows = document.querySelectorAll(".price-row");
      if (priceRows[0]) priceRows[0].lastElementChild.textContent = `${total.toLocaleString()}đ`;
      updateTotal();
    }

    // Tính tổng cộng
    let shippingFee = 20000;
    let discount = 0;
    function updateTotal() {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const priceRows = document.querySelectorAll(".price-row");
      if (priceRows[0]) priceRows[0].lastElementChild.textContent = `${total.toLocaleString()}đ`;
      if (priceRows[1]) priceRows[1].lastElementChild.textContent = `${shippingFee.toLocaleString()}đ`;
      if (priceRows[2]) priceRows[2].lastElementChild.textContent = `-${discount.toLocaleString()}đ`;
      const totalRows = document.querySelectorAll(".total-row");
      if (totalRows[0]) totalRows[0].lastElementChild.textContent = `${(total + shippingFee - discount).toLocaleString()}đ`;
    }

    // Gọi khi load trang
    renderCart();
    updateTotal();
  });