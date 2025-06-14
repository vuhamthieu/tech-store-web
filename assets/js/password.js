document.addEventListener('DOMContentLoaded', function() {
    console.log("JS loaded and DOM ready.");

    // Bước 1: Gửi yêu cầu OTP
    const requestForm = document.getElementById('requestOtpForm');
    if (requestForm) {
        requestForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailOrPhone = document.getElementById('emailOrPhone').value;

            if (!emailOrPhone) {
                alert('Vui lòng nhập email hoặc số điện thoại');
                return;
            }

            document.getElementById('userEmailOrPhone').textContent = emailOrPhone;

            document.getElementById('step1').classList.add('hidden');
            document.getElementById('step2').classList.remove('hidden');

            document.querySelector('.otp-input').focus();
            console.log('OTP sent to:', emailOrPhone);
        });
    }

    // Xử lý nhập OTP
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            if (this.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });

    // Bước 2: Xác thực OTP
    const verifyOtpForm = document.getElementById('verifyOtpForm');
    if (verifyOtpForm) {
        verifyOtpForm.addEventListener('submit', function(e) {
            e.preventDefault();

            let otp = '';
            otpInputs.forEach(input => otp += input.value);

            if (otp.length !== 6) {
                alert('Vui lòng nhập đầy đủ 6 chữ số OTP');
                return;
            }

            console.log('OTP verified:', otp);
            document.getElementById('step2').classList.add('hidden');
            document.getElementById('step3').classList.remove('hidden');
        });
    }

    // Gửi lại OTP
    const resendOtp = document.getElementById('resendOtp');
    if (resendOtp) {
        resendOtp.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Mã OTP mới đã được gửi lại');
            // Call API thực nếu cần
        });
    }

    // Bước 3: Đặt lại mật khẩu
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (newPassword !== confirmPassword) {
                alert('Mật khẩu xác nhận không khớp');
                return;
            }

            if (newPassword.length < 8) {
                alert('Mật khẩu phải có ít nhất 8 ký tự');
                return;
            }

            console.log('Password changed successfully');
            alert('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
            window.location.href = 'login.html';
        });
    }
});
