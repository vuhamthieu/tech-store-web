// Select Shipping Method
const shippingOptions = document.querySelectorAll('.shipping-option');
shippingOptions.forEach(option => {
    option.addEventListener('click', () => {
        shippingOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
    });
});

// Select Payment Method
const paymentOptions = document.querySelectorAll('.payment-option');
paymentOptions.forEach(option => {
    option.addEventListener('click', () => {
        paymentOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
    });
});

// Apply Voucher
const voucherBtn = document.querySelector('.voucher-input button');
voucherBtn.addEventListener('click', () => {
    const voucherInput = document.querySelector('.voucher-input input');
    if (voucherInput.value.trim() === '') {
        alert('Vui lòng nhập mã giảm giá');
    } else {
        alert(`Áp dụng mã: ${voucherInput.value}`);
        // In a real app, validate and apply discount
    }
});

// Checkout Button with Loading Animation
const checkoutBtn = document.getElementById('checkoutBtn');
const btnText = document.getElementById('btnText');
const loadingSpinner = document.getElementById('loadingSpinner');
const successModal = document.getElementById('successModal');
const closeModal = document.getElementById('closeModal');

checkoutBtn.addEventListener('click', () => {
    // Show loading spinner
    btnText.style.display = 'none';
    loadingSpinner.style.display = 'block';

    // Simulate API call (2 seconds delay)
    setTimeout(() => {
        // Hide spinner, show success modal
        loadingSpinner.style.display = 'none';
        btnText.style.display = 'inline';
        successModal.style.display = 'flex';
    }, 2000);
});

// Close Modal
closeModal.addEventListener('click', () => {
    successModal.style.display = 'none';
    // Redirect to home or order detail page in real app
    // window.location.href = "/";
});
// Address Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const editBtn = document.getElementById('editAddressBtn');
    const cancelBtn = document.getElementById('cancelAddressBtn');
    const saveBtn = document.getElementById('saveAddressBtn');
    const addressDisplay = document.getElementById('addressDisplay');
    const addressForm = document.getElementById('addressForm');
    
    // Show form when edit button is clicked
    editBtn.addEventListener('click', function() {
        addressDisplay.style.display = 'none';
        addressForm.style.display = 'block';
    });
    
    // Hide form when cancel button is clicked
    cancelBtn.addEventListener('click', function() {
        addressForm.style.display = 'none';
        addressDisplay.style.display = 'flex';
    });
    
    // Save address and update display
    saveBtn.addEventListener('click', function() {
        const fullName = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        const province = document.getElementById('province');
        const district = document.getElementById('district');
        const ward = document.getElementById('ward');
        const street = document.getElementById('street').value;
        
        const provinceText = province.options[province.selectedIndex].text;
        const districtText = district.options[district.selectedIndex].text;
        const wardText = ward.options[ward.selectedIndex].text;
        
        // Update the address display
        const addressDetails = addressDisplay.querySelector('.address-details');
        addressDetails.innerHTML = `
            <h4>
                ${fullName}
                ${document.getElementById('setDefault').checked ? '<span class="default-badge">Mặc định</span>' : ''}
            </h4>
            <p>Điện thoại: ${phone}</p>
            <p>${street}, ${wardText}, ${districtText}, ${provinceText}</p>
        `;
        
        // Hide the form
        addressForm.style.display = 'none';
        addressDisplay.style.display = 'flex';
        
        // In a real app, you would also save this to your database
    });
    
    // Simulate province-district-ward dependency
    const provinceSelect = document.getElementById('province');
    const districtSelect = document.getElementById('district');
    const wardSelect = document.getElementById('ward');
    
    provinceSelect.addEventListener('change', function() {
        // In a real app, you would fetch districts based on selected province
        districtSelect.innerHTML = '<option value="">Chọn Quận/Huyện</option>';
        wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>';
        
        if (this.value) {
            // Add some dummy districts
            const districts = {
                'HCM': ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5'],
                'HN': ['Quận Ba Đình', 'Quận Hoàn Kiếm', 'Quận Hai Bà Trưng', 'Quận Đống Đa'],
                'DN': ['Quận Hải Châu', 'Quận Thanh Khê', 'Quận Sơn Trà', 'Quận Ngũ Hành Sơn'],
                'HP': ['Quận Hồng Bàng', 'Quận Ngô Quyền', 'Quận Lê Chân', 'Quận Hải An'],
                'CT': ['Quận Ninh Kiều', 'Quận Bình Thủy', 'Quận Cái Răng', 'Quận Ô Môn']
            };
            
            districts[this.value].forEach(district => {
                const option = document.createElement('option');
                option.value = district.replace(/\s+/g, '').toLowerCase();
                option.textContent = district;
                districtSelect.appendChild(option);
            });
        }
    });
    
    districtSelect.addEventListener('change', function() {
        // In a real app, you would fetch wards based on selected district
        wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>';
        
        if (this.value) {
            // Add some dummy wards
            const wards = [
                'Phường Bến Nghé', 'Phường Bến Thành', 'Phường Cầu Ông Lãnh', 
                'Phường Cô Giang', 'Phường Đa Kao', 'Phường Nguyễn Thái Bình',
                'Phường Nguyễn Cư Trinh', 'Phường Phạm Ngũ Lão', 'Phường Tân Định'
            ];
            
            wards.forEach(ward => {
                const option = document.createElement('option');
                option.value = ward.replace(/\s+/g, '').toLowerCase();
                option.textContent = ward;
                wardSelect.appendChild(option);
            });
        }
    });
    
    // Checkout button handling
    const checkoutBtn = document.getElementById('checkoutBtn');
    const successModal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');
    
    checkoutBtn.addEventListener('click', function() {
        // Show loading spinner
        this.querySelector('#btnText').style.display = 'none';
        this.querySelector('#loadingSpinner').style.display = 'block';
        
        // Simulate API call
        setTimeout(() => {
            // Hide loading spinner
            this.querySelector('#btnText').style.display = 'block';
            this.querySelector('#loadingSpinner').style.display = 'none';
            
            // Show success modal
            successModal.style.display = 'flex';
        }, 1500);
    });
    
    closeModal.addEventListener('click', function() {
        successModal.style.display = 'none';
        // Redirect to home page or order confirmation page
        window.location.href = 'index.html';
    });
});
// Address Form Handling
const provinceSelect = document.getElementById("province");
const districtSelect = document.getElementById("district");
const wardSelect = document.getElementById("ward");

// Load tỉnh/thành
fetch("https://provinces.open-api.vn/api/p/")
  .then(res => res.json())
  .then(data => {
    data.forEach(province => {
      const option = document.createElement("option");
      option.value = province.code;
      option.textContent = province.name;
      provinceSelect.appendChild(option);
    });
  });

// Khi chọn tỉnh → load quận/huyện
provinceSelect.addEventListener("change", function () {
  const provinceCode = this.value;
  districtSelect.innerHTML = `<option value="">-- Chọn Quận / Huyện --</option>`;
  wardSelect.innerHTML = `<option value="">-- Chọn Phường / Xã --</option>`;

  fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
    .then(res => res.json())
    .then(data => {
      data.districts.forEach(district => {
        const option = document.createElement("option");
        option.value = district.code;
        option.textContent = district.name;
        districtSelect.appendChild(option);
      });
    });
});

// Khi chọn quận → load phường/xã
districtSelect.addEventListener("change", function () {
  const districtCode = this.value;
  wardSelect.innerHTML = `<option value="">-- Chọn Phường / Xã --</option>`;

  fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
    .then(res => res.json())
    .then(data => {
      data.wards.forEach(ward => {
        const option = document.createElement("option");
        option.value = ward.code;
        option.textContent = ward.name;
        wardSelect.appendChild(option);
      });
    });
});
document.getElementById("checkoutBtn").addEventListener("click", function () {
    const fullname = document.getElementById("fullname").value;
    const phone = document.getElementById("phone").value;
    const provinceText = provinceSelect.options[provinceSelect.selectedIndex].text;
    const districtText = districtSelect.options[districtSelect.selectedIndex].text;
    const wardText = wardSelect.options[wardSelect.selectedIndex].text;
    const street = document.getElementById("street").value;
  
    const fullAddress = `${street}, ${wardText}, ${districtText}, ${provinceText}`;
  
    console.log("Họ tên:", fullname);
    console.log("SĐT:", phone);
    console.log("Địa chỉ:", fullAddress);
  
    // Thực hiện đặt hàng...
    // showModal(), gọi API, v.v.
  });
  