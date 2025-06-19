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

function validateUserInput(input) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^0\d{9,10}$/;
  return emailRegex.test(input) || phoneRegex.test(input);
}

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const loginBtn = document.querySelector(".login-btn");
    const originalText = loginBtn.textContent;
    const userInput = document.getElementById("user").value.trim();
    const password = document.getElementById("password").value;

    if (!userInput || !password) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // Validate email hoặc số điện thoại
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^0\d{9,10}$/;
    if (!emailRegex.test(userInput) && !phoneRegex.test(userInput)) {
      alert("Vui lòng nhập đúng định dạng email hoặc số điện thoại!");
      return;
    }

    try {
      loginBtn.disabled = true;
      loginBtn.textContent = "ĐANG ĐĂNG NHẬP...";

      console.log('Sending login request...');
      const res = await fetch(
        "http://localhost/webproject/tech-store-web/back-end/php/api/login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: userInput,
            password: password,
          }),
        }
      );

      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const responseText = await res.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text:', responseText);
        alert('Lỗi phản hồi từ server!');
        return;
      }

      console.log('Parsed response:', data);

      if (data.success) {
        // Make sure data.access_token exists and is not undefined
        if (!data.access_token) {
          console.error('No token received from server');
          alert('Đăng nhập thất bại: Không nhận được token');
          return;
        }

        // Store the token
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.data));

        localStorage.setItem("isLoggedIn", "true");

        console.log('Login successful!');
        console.log('Stored token:', data.access_token);
        console.log('Stored user:', data.data);

        window.location.href = "product.html";
      } else {
        alert(data.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error('Login error:', error);
      alert("Lỗi kết nối server: " + error.message);
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = originalText;
    }
  });
