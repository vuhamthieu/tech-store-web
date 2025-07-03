document.addEventListener('DOMContentLoaded', function () {
  // === BIẾN DÙNG CHUNG ===
  const avatarInput = document.getElementById('avatarInput');
  const changeAvatarBtn = document.getElementById('changeAvatarBtn');
  const avatarImage = document.getElementById('avatarImage');
  const fullnameInput = document.getElementById('fullname');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const genderSelect = document.getElementById('gender');
  const birthdayInput = document.getElementById('birthday');
  const token = localStorage.getItem('token') || '';

  // === authFetch CART COUNT ===
  function authFetchCartCount() {
    if (!token) {
      console.log('Không có token, không thể lấy số lượng giỏ hàng');
      return;
    }

    authFetch('http://localhost/webproject/tech-store-web/back-end/php/api/cart', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
      .then(res => res.json())
      .then(data => {
        // API cart trả về trực tiếp array, không có success property
        if (Array.isArray(data)) {
          const cartCount = data.length;
          const cartIcon = document.querySelector('.cart-icon');
          if (cartIcon) {
            cartIcon.setAttribute('data-count', cartCount);
          }
        } else {
          console.error('Không thể tải số lượng giỏ hàng: Response không phải array');
          // Set count to 0 if there's an error
          const cartIcon = document.querySelector('.cart-icon');
          if (cartIcon) {
            cartIcon.setAttribute('data-count', '0');
          }
        }
      })
      .catch(error => {
        console.error('Lỗi tải số lượng giỏ hàng:', error);
        // Set count to 0 if there's an error
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
          cartIcon.setAttribute('data-count', '0');
        }
      });
  }

  // === authFetch USER INFO ===
  function authFetchUserData() {
    authFetch('http://localhost/webproject/tech-store-web/back-end/php/api/get-info-user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const user = data.data;
          if (fullnameInput) fullnameInput.value = user.FullName;
          if (emailInput) emailInput.value = user.Email;
          if (phoneInput) phoneInput.value = user.Phone;
          if (genderSelect) genderSelect.value = user.Gender;
          if (birthdayInput && user.Birthday) birthdayInput.value = user.Birthday;
          if (avatarImage && user.Avatar) {
            avatarImage.src = 'http://localhost/webproject/tech-store-web/assets/img/' + user.Avatar;
          }
          const userNameElem = document.getElementById('userName');
          if (userNameElem) userNameElem.textContent = user.FullName;
          const memberSinceElem = document.getElementById('memberSince');
          if (memberSinceElem && user.CreatedAt) {
            const date = new Date(user.CreatedAt);
            memberSinceElem.textContent = 'Thành viên từ: ' + (date.getMonth() + 1) + '/' + date.getFullYear();
          }
          const userObj = JSON.parse(localStorage.getItem('user') || '{}');
          if (userObj.Avatar) {
            document.getElementById('avatarImage').src = 'http://localhost/webproject/tech-store-web/assets/img/' + userObj.Avatar;
          }
        } else {
          alert('Không thể tải thông tin người dùng: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Lỗi tải thông tin:', error);
      });
  }

  authFetchUserData();

  // authFetch cart count
  authFetchCartCount();

  // === PROFILE FORM SUBMIT ===
  const profileForm = document.querySelector('.profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = {
        full_name: fullnameInput.value,
        phone: phoneInput.value,
        gender: genderSelect.value,
        birthday: birthdayInput.value,
        email: emailInput.value
      };

      authFetch('http://localhost/webproject/tech-store-web/back-end/php/api/update-info-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
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

  // === AVATAR UPLOAD ===
  if (changeAvatarBtn && avatarInput && avatarImage) {
    changeAvatarBtn.addEventListener('click', function () {
      avatarInput.click();
    });

    avatarInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) return alert('Ảnh không được quá 2MB');
      if (!file.type.match('image.*')) return alert('Chỉ chấp nhận ảnh');

      const reader = new FileReader();
      reader.onload = function (event) {
        avatarImage.src = event.target.result;
        uploadAvatarToServer(file);
      };
      reader.readAsDataURL(file);
    });

    function uploadAvatarToServer(file) {
      const formData = new FormData();
      formData.append('avatar', file);

      authFetch('http://localhost/webproject/tech-store-web/back-end/php/api/update-avatar-user', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        body: formData
      })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            alert('Cập nhật ảnh thành công!');
            // Update localStorage user object
            let user = JSON.parse(localStorage.getItem('user') || '{}');
            user.Avatar = result.avatar; // or user.avatar if you use lowercase
            localStorage.setItem('user', JSON.stringify(user));
            location.reload(); // Optional: reload to update avatar everywhere
          } else {
            alert('Lỗi: ' + result.message);
          }
        })
        .catch(error => {
          console.error('Upload avatar error:', error);
          alert('Không thể tải lên ảnh đại diện!');
        });
    }
  }

  // === CHỈNH SỬA PROFILE ===
  const editProfileBtn = document.getElementById('editProfileBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const formActions = document.getElementById('formActions');
  const formInputs = document.querySelectorAll('.profile-form input, .profile-form select');

  let originalValues = {};
  function saveOriginalValues() {
    formInputs.forEach(input => originalValues[input.id] = input.value);
  }

  function restoreOriginalValues() {
    formInputs.forEach(input => {
      if (originalValues[input.id] !== undefined) {
        input.value = originalValues[input.id];
      }
    });
  }

  if (editProfileBtn && cancelEditBtn) {
    editProfileBtn.addEventListener('click', function () {
      saveOriginalValues();
      formInputs.forEach(input => {
        if (input.id !== 'email') {
          input.readOnly = false;
          if (input.tagName === 'SELECT') input.disabled = false;
        }
      });
      formActions.classList.remove('hidden');
      this.classList.add('hidden');
    });

    cancelEditBtn.addEventListener('click', function () {
      restoreOriginalValues();
      formInputs.forEach(input => {
        input.readOnly = true;
        if (input.tagName === 'SELECT') input.disabled = true;
      });
      formActions.classList.add('hidden');
      editProfileBtn.classList.remove('hidden');
    });
  }

  // === MOBILE MENU ===
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('active');

      // Demo gán count giỏ hàng
      const cartIcon = document.querySelector('.cart-icon');
      if (cartIcon) {
        const cartCount = 3;
        cartIcon.setAttribute('data-count', cartCount);
      }
    });
  }

  // === LOGOUT ===
  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'logoutBtn') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      location.reload(); // Reload lại trang sau logout
    }
  });

  const changePasswordBtn = document.getElementById('changePasswordBtn');
  const changePasswordForm = document.getElementById('changePasswordForm');
  const cancelChangePasswordBtn = document.getElementById('cancelChangePassword');

  if (changePasswordBtn && changePasswordForm) {
    changePasswordBtn.addEventListener('click', function () {
      changePasswordForm.classList.remove('hidden');
      changePasswordBtn.classList.add('hidden');
    });
  }

  if (cancelChangePasswordBtn && changePasswordForm && changePasswordBtn) {
    cancelChangePasswordBtn.addEventListener('click', function () {
      changePasswordForm.classList.add('hidden');
      changePasswordBtn.classList.remove('hidden');
    });
  }

  // === CHANGE PASSWORD ===
  const passwordForm = document.getElementById('passwordForm');
  if (passwordForm) {
    passwordForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const currentPassword = document.getElementById('currentPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmNewPassword = document.getElementById('confirmNewPassword').value;

      if (!currentPassword || !newPassword || !confirmNewPassword) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
      }
      if (newPassword !== confirmNewPassword) {
        alert('Mật khẩu mới và xác nhận không khớp!');
        return;
      }
      if (newPassword.length < 6) {
        alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
        return;
      }

      authFetch('http://localhost/webproject/tech-store-web/back-end/php/api/update-password-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            alert('Đổi mật khẩu thành công!');
            passwordForm.reset();
            document.getElementById('changePasswordForm').classList.add('hidden');
            document.getElementById('changePasswordBtn').classList.remove('hidden');
          } else {
            alert('Thất bại: ' + result.message);
          }
        })
        .catch(error => {
          console.error('Lỗi:', error);
          alert('Không thể đổi mật khẩu!');
        });
    });
  }
});
