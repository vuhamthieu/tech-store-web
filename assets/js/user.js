document.addEventListener('DOMContentLoaded', function () {
    // === MOBILE MENU ===
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
  
    if (mobileMenuToggle && mobileMenu) {
      mobileMenuToggle.addEventListener('click', function () {
        mobileMenu.classList.toggle('active');
      });
    }
  
    // === CART COUNT ===
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
      const cartCount = 3; // Bạn có thể lấy từ API hoặc LocalStorage
      cartIcon.setAttribute('data-count', cartCount);
    }
  
    // === AVATAR UPLOAD ===
    const editAvatarBtn = document.querySelector('.edit-avatar');
    if (editAvatarBtn) {
      const avatarInput = document.createElement('input');
      avatarInput.type = 'file';
      avatarInput.accept = 'image/*';
      avatarInput.style.display = 'none';
      document.body.appendChild(avatarInput); // Cần gắn vào DOM
  
      editAvatarBtn.addEventListener('click', function () {
        avatarInput.click();
      });
  
      avatarInput.addEventListener('change', function (e) {
        if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = function (event) {
            const avatarImg = document.querySelector('.avatar img');
            if (avatarImg) avatarImg.src = event.target.result;
  
            // TODO: Gửi ảnh lên server ở đây (FormData, fetch API)
          };
          reader.readAsDataURL(e.target.files[0]);
        }
      });
    }
  
    // === PROFILE FORM SUBMIT ===
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', function (e) {
        e.preventDefault();
  
        const formData = {
          fullname: document.getElementById('fullname')?.value,
          phone: document.getElementById('phone')?.value,
          gender: document.getElementById('gender')?.value,
          birthday: document.getElementById('birthday')?.value
        };
  
        // Gửi lên API thật sự
        fetch('http://localhost/webproject/tech-store-web/back-end/php/api/update_user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
          .then(res => res.json())
          .then(result => {
            if (result.success) {
              alert('Cập nhật thông tin thành công!');
            } else {
              alert('Thất bại: ' + result.message);
            }
          })
          .catch(error => {
            console.error('Lỗi gửi dữ liệu:', error);
            alert('Lỗi gửi dữ liệu lên server!');
          });
      });
    }
     // Xử lý đổi mật khẩu trong cùng trang
     const passwordSection = document.getElementById('passwordSection');
     const changePasswordBtn = document.getElementById('changePasswordBtn');
     const changePasswordForm = document.getElementById('changePasswordForm');
     const cancelChangePassword = document.getElementById('cancelChangePassword');
     
     changePasswordBtn.addEventListener('click', function() {
         passwordSection.classList.add('hidden');
         changePasswordForm.classList.remove('hidden');
     });
     
     cancelChangePassword.addEventListener('click', function() {
         changePasswordForm.classList.add('hidden');
         passwordSection.classList.remove('hidden');
         document.getElementById('passwordForm').reset();
     });
     
     // Hiển thị/ẩn mật khẩu
     const togglePasswordBtns = document.querySelectorAll('.toggle-password');
     togglePasswordBtns.forEach(btn => {
         btn.addEventListener('click', function() {
             const input = this.previousElementSibling;
             const icon = this.querySelector('i');
             
             if (input.type === 'password') {
                 input.type = 'text';
                 icon.classList.remove('fa-eye');
                 icon.classList.add('fa-eye-slash');
             } else {
                 input.type = 'password';
                 icon.classList.remove('fa-eye-slash');
                 icon.classList.add('fa-eye');
             }
         });
     });
     
     // Kiểm tra độ mạnh mật khẩu
     const newPasswordInput = document.getElementById('newPassword');
     const strengthBar = document.querySelector('.strength-bar');
     const passwordRequirements = document.querySelectorAll('.password-requirements li i');
     
     newPasswordInput.addEventListener('input', function() {
         const password = this.value;
         let strength = 0;
         
         // Kiểm tra độ dài
         if (password.length >= 8) {
             strength += 1;
             passwordRequirements[0].className = 'fas fa-check';
             passwordRequirements[0].style.color = '#4CAF50';
         } else {
             passwordRequirements[0].className = 'fas fa-times';
             passwordRequirements[0].style.color = '#e11b1e';
         }
         
         // Kiểm tra có số
         if (/\d/.test(password)) {
             strength += 1;
             passwordRequirements[1].className = 'fas fa-check';
             passwordRequirements[1].style.color = '#4CAF50';
         } else {
             passwordRequirements[1].className = 'fas fa-times';
             passwordRequirements[1].style.color = '#e11b1e';
         }
         
         // Kiểm tra ký tự đặc biệt
         if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
             strength += 1;
             passwordRequirements[2].className = 'fas fa-check';
             passwordRequirements[2].style.color = '#4CAF50';
         } else {
             passwordRequirements[2].className = 'fas fa-times';
             passwordRequirements[2].style.color = '#e11b1e';
         }
         
         // Cập nhật thanh độ mạnh
         const width = (strength / 3) * 100;
         strengthBar.style.width = `${width}%`;
         
         if (strength === 0) {
             strengthBar.style.backgroundColor = '#e11b1e';
         } else if (strength === 1) {
             strengthBar.style.backgroundColor = '#FF5722';
         } else if (strength === 2) {
             strengthBar.style.backgroundColor = '#FFC107';
         } else {
             strengthBar.style.backgroundColor = '#4CAF50';
         }
     });
     
     // Xử lý form đổi mật khẩu
     document.getElementById('passwordForm').addEventListener('submit', function(e) {
         e.preventDefault();
         
         const currentPassword = document.getElementById('currentPassword').value;
         const newPassword = document.getElementById('newPassword').value;
         const confirmPassword = document.getElementById('confirmNewPassword').value;
         
         // Kiểm tra mật khẩu mới và xác nhận có khớp không
         if (newPassword !== confirmPassword) {
             alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
             return;
         }
         
         // Kiểm tra độ mạnh mật khẩu
         if (newPassword.length < 8 || !/\d/.test(newPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
             alert('Mật khẩu mới không đủ mạnh! Vui lòng kiểm tra các yêu cầu.');
             return;
         }
         
         // Gửi yêu cầu đổi mật khẩu (simulate)
         console.log('Current Password:', currentPassword);
         console.log('New Password:', newPassword);
         
         // Hiển thị thông báo thành công và trở về trạng thái ban đầu
         alert('Đổi mật khẩu thành công!');
         changePasswordForm.classList.add('hidden');
         passwordSection.classList.remove('hidden');
         this.reset();
     });
     // Xử lý đổi ảnh đại diện

  const avatarInput = document.getElementById('avatarInput');
  const changeAvatarBtn = document.getElementById('changeAvatarBtn');
  const avatarImage = document.getElementById('avatarImage');
  
  // Click nút đổi ảnh
  changeAvatarBtn.addEventListener('click', function() {
      avatarInput.click();
  });
  
  // Khi chọn ảnh mới
  avatarInput.addEventListener('change', function(e) {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          
          // Kiểm tra kích thước file (tối đa 2MB)
          if (file.size > 2 * 1024 * 1024) {
              alert('Ảnh không được vượt quá 2MB');
              return;
          }
          
          // Kiểm tra loại file
          if (!file.type.match('image.*')) {
              alert('Vui lòng chọn file ảnh (JPEG, PNG)');
              return;
          }
          
          const reader = new FileReader();
          
          reader.onload = function(event) {
              // Hiển thị ảnh preview
              avatarImage.src = event.target.result;
              
              // Gửi ảnh lên server (simulate)
              console.log('Uploading avatar:', file.name);
              // Trong thực tế, bạn cần gửi file lên server bằng AJAX
              // uploadAvatarToServer(file);
              
              alert('Đã cập nhật ảnh đại diện mới!');
          };
          
          reader.readAsDataURL(file);
      }
  });
  
  // Hàm upload ảnh lên server (ví dụ)
  function uploadAvatarToServer(file) {
      const formData = new FormData();
      formData.append('avatar', file);
      
      fetch('/api/upload-avatar', {
          method: 'POST',
          body: formData,
          headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
      })
      .then(response => response.json())
      .then(data => {
          console.log('Avatar uploaded:', data);
          // Cập nhật avatar mới từ server nếu cần
          // avatarImage.src = data.newAvatarUrl;
      })
      .catch(error => {
          console.error('Error uploading avatar:', error);
          alert('Có lỗi xảy ra khi tải lên ảnh đại diện');
      });
  }
   // Xử lý sửa thông tin cá nhân
   const editProfileBtn = document.getElementById('editProfileBtn');
   const cancelEditBtn = document.getElementById('cancelEditBtn');
   const formActions = document.getElementById('formActions');
   const formInputs = document.querySelectorAll('.profile-form input, .profile-form select');
   
   // Lưu giá trị ban đầu
   let originalValues = {};
   
   function saveOriginalValues() {
       formInputs.forEach(input => {
           originalValues[input.id] = input.value;
       });
   }
   
   function restoreOriginalValues() {
       formInputs.forEach(input => {
           if (originalValues[input.id] !== undefined) {
               input.value = originalValues[input.id];
           }
       });
   }
   
   // Bật chế độ chỉnh sửa
   editProfileBtn.addEventListener('click', function() {
       saveOriginalValues();
       
       // Cho phép chỉnh sửa
       formInputs.forEach(input => {
           input.readOnly = false;
           if (input.tagName === 'SELECT') {
               input.disabled = false;
           }
       });
       
       // Hiển thị nút hành động
       formActions.classList.remove('hidden');
       
       // Ẩn nút Sửa
       this.classList.add('hidden');
   });
   
   // Hủy bỏ chỉnh sửa
   cancelEditBtn.addEventListener('click', function() {
       // Khôi phục giá trị ban đầu
       restoreOriginalValues();
       
       // Khóa các trường
       formInputs.forEach(input => {
           input.readOnly = true;
           if (input.tagName === 'SELECT') {
               input.disabled = true;
           }
       });
       
       // Ẩn nút hành động
       formActions.classList.add('hidden');
       
       // Hiển thị lại nút Sửa
       editProfileBtn.classList.remove('hidden');
   });
   
   // Xử lý submit form
   document.querySelector('.profile-form').addEventListener('submit', function(e) {
       e.preventDefault();
       
       // Gửi dữ liệu cập nhật (simulate)
       console.log('Dữ liệu đã cập nhật:', {
           fullname: document.getElementById('fullname').value,
           email: document.getElementById('email').value,
           phone: document.getElementById('phone').value,
           gender: document.getElementById('gender').value,
           birthday: document.getElementById('birthday').value
       });
       
       // Khóa các trường sau khi cập nhật
       formInputs.forEach(input => {
           input.readOnly = true;
           if (input.tagName === 'SELECT') {
               input.disabled = true;
           }
       });
       
       // Ẩn nút hành động
       formActions.classList.add('hidden');
       
       // Hiển thị lại nút Sửa
       editProfileBtn.classList.remove('hidden');
       
       alert('Cập nhật thông tin thành công!');
   });
   
   // Phần xử lý đổi mật khẩu giữ nguyên
  });
  