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
