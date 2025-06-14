function togglePassword() {
  const passwordInput = document.getElementById("password");
  const toggleBtn = document.querySelector(".toggle-password i");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleBtn.classList.remove("fa-eye");
    toggleBtn.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    toggleBtn.classList.remove("fa-eye-slash");
    toggleBtn.classList.add("fa-eye");
  }
}

// Hàm validate email
function validateUserInput(input) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^0\d{9,10}$/;
  return emailRegex.test(input) || phoneRegex.test(input);
}

// Hàm validate mật khẩu
function validatePassword(password) {
  // Ít nhất 6 ký tự
  return password.length >= 6;
}
document
  .getElementById("registerForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const registerBtn = document.querySelector(".login-btn");
    const originalText = registerBtn.textContent;

    registerBtn.disabled = true;
    registerBtn.textContent = "ĐANG TẠO TÀI KHOẢN...";

    const fullname = document.getElementById("fullname").value.trim();
    const userInput = document.getElementById("user").value.trim();
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^0\d{9,10}$/;

    if (!fullname || !userInput || !password || !confirm) {
      alert("Vui lòng điền đầy đủ thông tin!");
      registerBtn.disabled = false;
      registerBtn.textContent = originalText;
      return;
    }
    if (!emailRegex.test(userInput) && !phoneRegex.test(userInput)) {
      alert("Vui lòng nhập đúng định dạng email hoặc số điện thoại!");
      registerBtn.disabled = false;
      registerBtn.textContent = originalText;
      return;
    }
    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      registerBtn.disabled = false;
      registerBtn.textContent = originalText;
      return;
    }
    if (password !== confirm) {
      alert("Mật khẩu không khớp!");
      registerBtn.disabled = false;
      registerBtn.textContent = originalText;
      return;
    }

    // Gửi đúng trường backend yêu cầu
    let payload = {
      username: fullname,
      user: userInput,
      password: password,
      role: 1
    };

    try {
      const res = await fetch(
        "http://localhost/webproject/tech-store-web/back-end/php/api/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await res.json();
      if (result.success) {
        alert("Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.");
        window.location.href = "login.html";
      } else {
        alert(result.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      alert("Lỗi kết nối server!");
    } finally {
      registerBtn.disabled = false;
      registerBtn.textContent = originalText;
    }
  });