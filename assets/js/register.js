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
      function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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

          // Disable button and show loading
          registerBtn.disabled = true;
          registerBtn.textContent = "ĐANG TẠO TÀI KHOẢN...";

          const username = document.getElementById("fullname").value.trim();
          const email = document.getElementById("email").value.trim();
          const password = document.getElementById("password").value;
          const confirm = document.getElementById("confirmPassword").value;

          // Validation
          if (!username || !email || !password || !confirm) {
            alert("Vui lòng điền đầy đủ thông tin!");
            registerBtn.disabled = false;
            registerBtn.textContent = originalText;
            return;
          }

          if (!validateEmail(email)) {
            alert("Email không hợp lệ!");
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

          // ...existing code...
          const API_URL =
            "http://localhost/tech-store-web/back-end/php/api/register";

          try {
            // Send request to register.php
            const res = await fetch(API_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({ username, email, password }),
            });

            // Check response status
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }

            const result = await res.json();

            if (result.success) {
              alert(
                "Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập."
              );
              window.location.href = "login.html";
            } else {
              alert("Lỗi: " + (result.message || "Đăng ký thất bại!"));
            }
          } catch (error) {
            console.error("Lỗi kết nối:", error);
            alert("Có lỗi xảy ra khi kết nối tới server. Vui lòng thử lại!");
          } finally {
            // Reset button
            registerBtn.disabled = false;
            registerBtn.textContent = originalText;
          }
        });