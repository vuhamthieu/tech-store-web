// Hàm fetch tự động refresh token khi hết hạn
async function authFetch(url, options = {}, retry = true) {
    let token = localStorage.getItem("token") || localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    const expiresAtStr = localStorage.getItem("access_token_expires_at");

    const now = Date.now();
    const expiresAt = expiresAtStr ? new Date(expiresAtStr).getTime() : 0;

    options.headers = options.headers || {};

    if (expiresAt && expiresAt <= now && refreshToken && retry) {
        // Token đã hết hạn → gọi refresh
        const refreshed = await tryRefreshToken();
        if (refreshed.success) {
            token = refreshed.access_token;
        } else {
            localStorage.clear();
            window.location.href = "login.html";
            return;
        }
    }

    if (token) {
        options.headers["Authorization"] = `Bearer ${token}`;
    }

    let response = await fetch(url, options);

    if (response.status === 401 && refreshToken && retry) {
        const refreshed = await tryRefreshToken();

        if (refreshed.success) {
            token = refreshed.access_token;
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

async function tryRefreshToken() {
    const refreshToken = localStorage.getItem("refresh_token");

    try {
        const res = await fetch('/back-end/php/refresh-token', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken })
        });

        const data = await res.json();

        if (data.success && data.access_token) {
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("access_token_expires_at", data.access_token_expires_at); // vẫn là chuỗi
            return { success: true, access_token: data.access_token };
        }
    } catch (e) {
        console.error("Refresh token failed:", e);
    }

    return { success: false };
}

function isLoggedIn() {
    return !!localStorage.getItem("token");
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

// Function cập nhật thông tin user trên tất cả các trang
function updateUserInfoInHeader() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn && user.UserID) {
        // Cập nhật tên user trong header
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(element => {
            element.textContent = user.FullName || user.full_name || 'User';
        });

        // Cập nhật avatar nếu có
        const avatarElements = document.querySelectorAll('.user-avatar');
        avatarElements.forEach(element => {
            if (user.Avatar) {
                element.src = 'http://localhost/webproject/tech-store-web/assets/img/' + user.Avatar;
            }
        });
    }
}

// Gọi function cập nhật khi trang load
document.addEventListener('DOMContentLoaded', function () {
    updateUserInfoInHeader();
});

// Lắng nghe sự thay đổi trong localStorage để cập nhật real-time
window.addEventListener('storage', function (e) {
    if (e.key === 'user') {
        updateUserInfoInHeader();
    }
});
