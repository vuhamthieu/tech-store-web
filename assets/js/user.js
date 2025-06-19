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

  // === FETCH USER INFO ===
  function fetchUserData() {
    fetch('http://localhost/webproject/tech-store-web/back-end/php/api/get-info-user', {
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
          fullnameInput.value = user.fullname;
          emailInput.value = user.email;
          phoneInput.value = user.phone;
          genderSelect.value = user.gender;
          birthdayInput.value = user.birthday;
          if (user.avatar) {
            avatarImage.src = 'http://localhost/webproject/tech-store-web/assets/img/' + user.avatar;
          }
        } else {
          alert('Không thể tải thông tin người dùng: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Lỗi tải thông tin:', error);
      });
  }

  fetchUserData();

  // === PROFILE FORM SUBMIT ===
  const profileForm = document.querySelector('.profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = {
        fullname: fullnameInput.value,
        phone: phoneInput.value,
        gender: genderSelect.value,
        birthday: birthdayInput.value
      };

      fetch('http://localhost/webproject/tech-store-web/back-end/php/api/update-info-user', {
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

      fetch('http://localhost/webproject/tech-store-web/back-end/php/api/update-avatar-user', {
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
});
