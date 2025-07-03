// Hàm fetch tự động refresh token khi hết hạn
async function authFetch(url, options = {}, retry = true) {
    let token = localStorage.getItem("token") || localStorage.getItem("access_token");
    let refreshToken = localStorage.getItem("refresh_token");

    options.headers = options.headers || {};
    if (token) {
        options.headers["Authorization"] = `Bearer ${token}`;
    }

    let response = await fetch(url, options);

    if (response.status === 401 && refreshToken && retry) {
        // Gọi API refresh token
        const refreshRes = await fetch('/back-end/php/refresh_token.php', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken })
        });
        const refreshData = await refreshRes.json();

        if (refreshData.success && refreshData.access_token) {
            // Lưu lại token mới
            localStorage.setItem("token", refreshData.access_token);
            localStorage.setItem("access_token", refreshData.access_token);
            token = refreshData.access_token;
            // Gửi lại request ban đầu với token mới (chỉ thử lại 1 lần)
            options.headers["Authorization"] = `Bearer ${token}`;
            return await authFetch(url, options, false);
        } else {
            localStorage.clear();
            window.location.href = "login.html";
            return;
        }
    }

    return response;
}

function isLoggedIn() {
    return !!localStorage.getItem("token");
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
