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

    if (!fullname || !userInput || !password || !confirm) {
      alert("Vui lòng điền đầy đủ thông tin!");
      registerBtn.disabled = false;
      registerBtn.textContent = originalText;
      return;
    }

    if (!validateUserInput(userInput)) {
      alert("Vui lòng nhập đúng định dạng email hoặc số điện thoại!");
      registerBtn.disabled = false;
      registerBtn.textContent = originalText;
      return;
    }

    if (!validatePassword(password)) {
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

    const API_URL =
      "http://localhost/webproject/tech-store-web/back-end/php/api/register";

    // Xác định gửi email hay phone cho API
    let payload = { fullname, password };
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInput)) {
      payload.email = userInput;
    } else {
      payload.phone = userInput;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();

      if (result.success) {
        alert("Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.");
        window.location.href = "login.html";
      } else {
        alert("Lỗi: " + (result.message || "Đăng ký thất bại!"));
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Có lỗi xảy ra khi kết nối tới server. Vui lòng thử lại!");
    } finally {
      registerBtn.disabled = false;
      registerBtn.textContent = originalText;
    }
  });
