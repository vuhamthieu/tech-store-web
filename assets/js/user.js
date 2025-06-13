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
        fetch('http://localhost/webproject/tech-store-web/back-end/php/api/update_user.php', {
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
  });
  