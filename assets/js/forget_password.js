document.addEventListener('DOMContentLoaded', function () {
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
  
    const requestOtpForm = document.getElementById('requestOtpForm');
    const verifyOtpForm = document.getElementById('verifyOtpForm');
    const resetPasswordForm = document.getElementById('resetPasswordForm');
  
    const userEmailOrPhoneSpan = document.getElementById('userEmailOrPhone');
    const resendOtpLink = document.getElementById('resendOtp');
    const backBtn = document.getElementById('backToStep1');
  
    let otp = null;
    let contact = '';
    let isSendingOtp = false;
    let isResendingOtp = false;
  
    function autoFillOtp(otpValue) {
      otpValue = String(otpValue);
      if (!otpValue || otpValue.length !== 6) return;
      const otpInputs = document.querySelectorAll('.otp-input');
      for (let i = 0; i < 6; i++) {
        otpInputs[i].value = otpValue.charAt(i);
      }
    }
  
    function isValidEmailOrPhone(value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^0\d{9,10}$/;
      return emailRegex.test(value) || phoneRegex.test(value);
    }
  
    requestOtpForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (isSendingOtp) return;
  
      contact = document.getElementById('emailOrPhone').value.trim();
      if (!contact || !isValidEmailOrPhone(contact)) {
        alert('Vui lòng nhập đúng định dạng email hoặc số điện thoại!');
        return;
      }
  
      isSendingOtp = true;
      const submitBtn = requestOtpForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Đang gửi...';
  
      fetch('http://localhost/webproject/tech-store-web/back-end/php/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact })
      })
        .then(res => res.json())
        .then(data => {
          otp = data.otp ?? null;
          console.log('✅ Gửi OTP thành công:', otp);
          userEmailOrPhoneSpan.textContent = contact;
          step1.classList.add('hidden');
          step2.classList.remove('hidden');
          setTimeout(() => {
            if (otp) console.log(`💬 Mã OTP (test): ${otp}`);
            autoFillOtp(otp);
          }, 1000);
        })
        .catch(err => {
          console.error('❌ Lỗi khi gửi OTP:', err);
          alert('Không thể gửi mã OTP. Vui lòng thử lại sau.');
        })
        .finally(() => {
          setTimeout(() => {
            isSendingOtp = false;
            submitBtn.disabled = false;
            submitBtn.textContent = 'Gửi yêu cầu';
          }, 1000);
        });
    });
  
    if (backBtn) {
      backBtn.addEventListener('click', function (e) {
        e.preventDefault();
        step2.classList.add('hidden');
        step1.classList.remove('hidden');
      });
    }
  
    verifyOtpForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const otpInputs = document.querySelectorAll('.otp-input');
      const enteredOtp = Array.from(otpInputs).map(input => input.value).join('');
  
      if (enteredOtp.length !== 6 || !/^\d{6}$/.test(enteredOtp)) {
        alert('Vui lòng nhập đúng 6 chữ số OTP.');
        return;
      }
  
      if (enteredOtp !== String(otp)) {
        alert('OTP không đúng.');
        return;
      }
  
      step2.classList.add('hidden');
      step3.classList.remove('hidden');
    });
  
    resendOtpLink.addEventListener('click', function (e) {
      e.preventDefault();
  
      if (isResendingOtp || !contact) {
        alert('Thiếu thông tin người dùng hoặc đang gửi lại.');
        return;
      }
  
      isResendingOtp = true;
      resendOtpLink.textContent = 'Đang gửi lại...';
  
      fetch('http://localhost/webproject/tech-store-web/back-end/php/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact })
      })
        .then(res => res.json())
        .then(data => {
          otp = data.otp ?? null;
          console.log('🔄 OTP mới từ server:', otp);
          setTimeout(() => {
            autoFillOtp(otp);
          }, 1000);
        })
        .catch(err => {
          console.error('❌ Lỗi khi gửi lại OTP:', err);
          alert('Không thể gửi lại OTP. Vui lòng thử lại sau.');
        })
        .finally(() => {
          setTimeout(() => {
            isResendingOtp = false;
            resendOtpLink.textContent = 'Gửi lại mã';
          }, 1000);
        });
    });
  
    resetPasswordForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const newPassword = document.getElementById('newPassword').value.trim();
      const confirmPassword = document.getElementById('confirmPassword').value.trim();
  
      const passwordValid =
        newPassword.length >= 8 &&
        /\d/.test(newPassword) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  
      if (!passwordValid) {
        alert('Mật khẩu không đủ mạnh. Vui lòng đảm bảo:\n- Tối thiểu 8 ký tự\n- Có số\n- Có ký tự đặc biệt');
        return;
      }
  
      if (newPassword !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp.');
        return;
      }
  
      fetch('http://localhost/webproject/tech-store-web/back-end/php/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: contact,
          otp: otp,
          newPassword: newPassword
        })
      })
        .then(res => {
          if (!res.ok) throw new Error(`Lỗi HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          if (data.success) {
            alert('✅ Đặt lại mật khẩu thành công! Bạn sẽ được chuyển đến trang đăng nhập.');
            window.location.href = 'login.html';
          } else {
            alert(`❌ ${data.message || 'Đặt lại mật khẩu thất bại.'}`);
          }
        })
        .catch(err => {
          console.error('❌ Lỗi xử lý:', err);
          alert('Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.');
        });
    });
  });
  