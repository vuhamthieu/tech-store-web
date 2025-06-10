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

document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const loginBtn = document.querySelector(".login-btn");
    const originalText = loginBtn.textContent;
    const username = document.getElementById("user").value.trim();
    const password = document.getElementById("password").value;

    // Debug - kiểm tra giá trị
    console.log('Sending:', { user: username, password });

    if (!username || !password) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    try {
        loginBtn.disabled = true;
        loginBtn.textContent = "ĐANG ĐĂNG NHẬP...";

        const res = await fetch("http://localhost/tech-store-web/back-end/php/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user: username, password })
        });

        const data = await res.json();
        console.log('Response:', data); // Debug - kiểm tra response

        if (data.success) {
            localStorage.setItem("user", JSON.stringify(data.data));
            localStorage.setItem("isLoggedIn", "true");
            window.location.href = "product.html";
        } else {
            alert(data.message || "Đăng nhập thất bại!");
        }
    } catch (error) {
        console.error('Login error:', error);
        alert("Lỗi kết nối server!");
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = originalText;
    }
});