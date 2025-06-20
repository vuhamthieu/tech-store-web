document.addEventListener('DOMContentLoaded', function () {
  

  const avatarInput = document.getElementById('avatarInput');
  const changeAvatarBtn = document.getElementById('changeAvatarBtn');
  const avatarImage = document.getElementById('avatarImage');
  const userName = document.getElementById('userName');
  const memberSince = document.getElementById('memberSince');
  const fullnameInput = document.getElementById('fullname');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const genderSelect = document.getElementById('gender');
  const birthdayInput = document.getElementById('birthday');


 // === MOBILE MENU ===
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
if (mobileMenuToggle && mobileMenu) {
  mobileMenuToggle.addEventListener('click', function () {
    mobileMenu.classList.toggle('active');
    // === CART COUNT ===
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
      const cartCount = 3;
      cartIcon.setAttribute('data-count', cartCount);
    }
  
    // === GLOBAL ===
    const token = localStorage.getItem('token') || ''; // Nếu có token
  
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
            document.getElementById('fullname').value = user.fullname;
            document.getElementById('email').value = user.email;
            document.getElementById('phone').value = user.phone;
            document.getElementById('gender').value = user.gender;
            document.getElementById('birthday').value = user.birthday;
            if (user.avatar) {
              document.getElementById('avatarImage').src = user.avatar;
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
          fullname: document.getElementById('fullname').value,
          phone: document.getElementById('phone').value,
          gender: document.getElementById('gender').value,
          birthday: document.getElementById('birthday').value
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
  
    // === ĐỔI MẬT KHẨU ===
    const passwordSection = document.getElementById('passwordSection');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const cancelChangePassword = document.getElementById('cancelChangePassword');
  
    changePasswordBtn.addEventListener('click', () => {
      passwordSection.classList.add('hidden');
      changePasswordForm.classList.remove('hidden');
    });
  
    cancelChangePassword.addEventListener('click', () => {
      changePasswordForm.classList.add('hidden');
      passwordSection.classList.remove('hidden');
      document.getElementById('passwordForm').reset();
    });
  
    document.getElementById('passwordForm').addEventListener('submit', function (e) {
      e.preventDefault();
  
      const currentPassword = document.getElementById('currentPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmNewPassword').value;
  
      if (newPassword !== confirmPassword) {
        alert('Mật khẩu mới và xác nhận không khớp!');
        return;
      }
  
      if (newPassword.length < 8 || !/\d/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
        alert('Mật khẩu mới không đủ mạnh!');
        return;
      }
  
      fetch('http://localhost/webproject/tech-store-web/back-end/php/api/update-password-user', {
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
            changePasswordForm.classList.add('hidden');
            passwordSection.classList.remove('hidden');
            this.reset();
          } else {
            alert('Thất bại: ' + result.message);
          }
        })
        .catch(error => {
          console.error('Lỗi:', error);
          alert('Không thể đổi mật khẩu!');
        });
    });
  
    // === PASSWORD STRENGTH ===
    const newPasswordInput = document.getElementById('newPassword');
    const strengthBar = document.querySelector('.strength-bar');
    const passwordRequirements = document.querySelectorAll('.password-requirements li i');
  
    newPasswordInput.addEventListener('input', function () {
      const password = this.value;
      let strength = 0;
  
      if (password.length >= 8) {
        strength += 1;
        passwordRequirements[0].className = 'fas fa-check';
        passwordRequirements[0].style.color = '#4CAF50';
      } else {
        passwordRequirements[0].className = 'fas fa-times';
        passwordRequirements[0].style.color = '#e11b1e';
      }
  
      if (/\d/.test(password)) {
        strength += 1;
        passwordRequirements[1].className = 'fas fa-check';
        passwordRequirements[1].style.color = '#4CAF50';
      } else {
        passwordRequirements[1].className = 'fas fa-times';
        passwordRequirements[1].style.color = '#e11b1e';
      }
  
      if (/[!@#$%^&*]/.test(password)) {
        strength += 1;
        passwordRequirements[2].className = 'fas fa-check';
        passwordRequirements[2].style.color = '#4CAF50';
      } else {
        passwordRequirements[2].className = 'fas fa-times';
        passwordRequirements[2].style.color = '#e11b1e';
      }
  
      const width = (strength / 3) * 100;
      strengthBar.style.width = `${width}%`;
      strengthBar.style.backgroundColor = ['#e11b1e', '#FF5722', '#FFC107', '#4CAF50'][strength];
    });
  
    // === TOGGLE PASSWORD VISIBILITY ===
    document.querySelectorAll('.toggle-password').forEach(btn => {
      btn.addEventListener('click', function () {
        const input = this.previousElementSibling;
        const icon = this.querySelector('i');
        input.type = input.type === 'password' ? 'text' : 'password';
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
      });
    });
  
    // === AVATAR UPLOAD ===
    const avatarInput = document.getElementById('avatarInput');
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const avatarImage = document.getElementById('avatarImage');
  
    changeAvatarBtn.addEventListener('click', function () {
      avatarInput.click();
    });
  
    avatarInput.addEventListener('change', function (e) {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (file.size > 2 * 1024 * 1024) return alert('Ảnh không được quá 2MB');
        if (!file.type.match('image.*')) return alert('Chỉ chấp nhận ảnh');
  
        const reader = new FileReader();
        reader.onload = function (event) {
          avatarImage.src = event.target.result;
          uploadAvatarToServer(file);
        };
        reader.readAsDataURL(file);
      }
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
    //LOG OUT
    document.addEventListener("DOMContentLoaded", function () {
      const logoutBtn = document.getElementById("logoutBtn");
    
      logoutBtn.addEventListener("click", function (e) {
        e.preventDefault(); // Ngăn chuyển trang ngay lập tức
    
        const token = localStorage.getItem("accessToken"); // Lấy access token từ localStorage
    
        if (!token) {
          alert("Bạn chưa đăng nhập!");
          window.location.href = "../pages/login.html"; // Hoặc trang chính
          return;
        }
    
        fetch("http://localhost/webproject/tech-store-web/back-end/php/logout.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Xoá token khỏi localStorage
            localStorage.removeItem("accessToken");
    
            alert("Đăng xuất thành công!");
            window.location.href = "../pages/login.html"; // Hoặc trang chính
          } else {
            alert("Đăng xuất thất bại: " + data.message);
          }
        })
        .catch(error => {
          console.error("Lỗi đăng xuất:", error);
          alert("Đã xảy ra lỗi trong quá trình đăng xuất.");
        });
      });
    });
    
  });
}

// === CART COUNT ===
const cartIcon = document.querySelector('.cart-icon');
if (cartIcon) {
  const cartCount = 3;
  cartIcon.setAttribute('data-count', cartCount);
}
// === GLOBAL ===


const apiUrl = "http://localhost/webproject/tech-store-web/back-end/php/api/update-info-user";
 const token = localStorage.getItem("token") || ''; // Lấy access token từ localStorage


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
        document.getElementById('fullname').value = user.fullname;
        document.getElementById('email').value = user.email;
        document.getElementById('phone').value = user.phone;
        document.getElementById('gender').value = user.gender;
        document.getElementById('birthday').value = user.birthday;

        if (user.avatar) {
          document.getElementById('avatarImage').src = 'http://localhost/webproject/tech-store-web/assets/img/' + user.avatar;
        }
      } else {
        alert('Không thể tải thông tin người dùng: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Lỗi tải thông tin:', error);
    });
}

  // === Chọn ảnh avatar mới ===
  
   
// === PROFILE FORM SUBMIT ===
const profileForm = document.querySelector('.profile-form');
if (profileForm) {
  profileForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = {
      fullname: document.getElementById('fullname').value,
      phone: document.getElementById('phone').value,
      gender: document.getElementById('gender').value,
      birthday: document.getElementById('birthday').value
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

  // === LOGOUT ===
  document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'logoutBtn') {
     
      
      // Xóa thông tin đăng nhập
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
    }

});
});
