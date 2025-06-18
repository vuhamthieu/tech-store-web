document.addEventListener('DOMContentLoaded', function () {
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');

    const requestOtpForm = document.getElementById('requestOtpForm');
    const verifyOtpForm = document.getElementById('verifyOtpForm');
    const resetPasswordForm = document.getElementById('resetPasswordForm');

    const userEmailOrPhoneSpan = document.getElementById('userEmailOrPhone');
    const resendOtpLink = document.getElementById('resendOtp');

    let contact = '';
    let otp = '';

    // Bước 1: Gửi OTP
    requestOtpForm.addEventListener('submit', function (e) {
        e.preventDefault();

        contact = document.getElementById('emailOrPhone').value.trim();

        if (!contact) {
            alert('Vui lòng nhập email hoặc số điện thoại.');
            return;
        }

        fetch('http://localhost/webproject/tech-store-web/back-end/php/api/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contact })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                otp = data.otp; // Lưu OTP để xác minh ở bước 3
                userEmailOrPhoneSpan.textContent = contact;
                step1.classList.add('hidden');
                step2.classList.remove('hidden');
            } else {
                alert(data.message || 'Không thể gửi OTP.');
            }
        })
        .catch(err => {
            console.error(err);
            alert('Lỗi kết nối máy chủ.');
        });
    });

    // Bước 2: Nhập OTP
    verifyOtpForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const otpInputs = document.querySelectorAll('.otp-input');
        const enteredOtp = Array.from(otpInputs).map(input => input.value).join('');

        if (enteredOtp.length !== 6 || !/^\d{6}$/.test(enteredOtp)) {
            alert('Vui lòng nhập đúng 6 chữ số OTP.');
            return;
        }

        if (enteredOtp !== otp) {
            alert('OTP không đúng.');
            return;
        }

        step2.classList.add('hidden');
        step3.classList.remove('hidden');
    });

    // Gửi lại OTP
    resendOtpLink.addEventListener('click', function (e) {
        e.preventDefault();

        if (!contact) {
            alert('Thiếu thông tin người dùng.');
            return;
        }

        fetch('http://localhost/webproject/tech-store-web/back-end/php/api/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contact })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                otp = data.otp;
                alert('Đã gửi lại mã OTP.');
            } else {
                alert(data.message || 'Gửi lại OTP thất bại.');
            }
        })
        .catch(err => {
            console.error(err);
            alert('Lỗi kết nối khi gửi lại OTP.');
        });
    });
    // Bước 3: Đặt lại mật khẩu
    resetPasswordForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const newPassword = document.getElementById('newPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();

        const passwordValid =
            newPassword.length >= 8 &&
            /\d/.test(newPassword) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

        if (!passwordValid) {
            alert('Mật khẩu không đủ mạnh. Vui lòng kiểm tra lại.');
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
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.');
                window.location.href = 'login.html';
            } else {
                alert(data.message || 'Đặt lại mật khẩu thất bại.');
            }
        })
        .catch(err => {
            console.error(err);
            alert('Lỗi kết nối máy chủ.');
        });
    });

    // Tự động chuyển focus giữa các ô nhập OTP
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });
});
