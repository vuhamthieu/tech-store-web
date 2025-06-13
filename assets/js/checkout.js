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
    checkoutBtn.addEventListener("click", () => {
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
  
      // Loading
      btnText.style.display = 'none';
      loadingSpinner.style.display = 'inline-block';
  
      setTimeout(() => {
        btnText.style.display = 'inline';
        loadingSpinner.style.display = 'none';
        successModal.style.display = 'flex';
  
        console.log("Họ tên:", fullname);
        console.log("SĐT:", phone);
        console.log("Địa chỉ:", `${street}, ${wardText}, ${districtText}, ${provinceText}`);
      }, 1500);
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
        fetch("http://localhost/webproject/tech-store-web/back-end/php/api/save-address.php", {
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
  });