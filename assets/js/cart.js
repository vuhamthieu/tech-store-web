document.addEventListener("DOMContentLoaded", async function () {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const accessToken = localStorage.getItem("access_token");
    const userId = user.UserID || user.id || 0;

    const cartItemsContainer = document.querySelector(".cart-items");
    const totalPriceEl = document.querySelector(".total-price .amount");
    const totalCountEl = document.querySelector(".footer-left span");

    if (!userId || !accessToken) {
        cartItemsContainer.innerHTML = `<div class="cart-empty"><i class="fas fa-shopping-cart"></i><p>Vui lòng đăng nhập để xem giỏ hàng!</p></div>`;
        totalPriceEl.textContent = "0 ₫";
        totalCountEl.textContent = "Tổng thanh toán (0 sản phẩm):";
        return;
    }

    try {
        const res = await fetch(
            `http://localhost/webproject/tech-store-web/back-end/php/api/cart`,
            {
                headers: {
                    "Authorization": `Bearer ${accessToken}`, // Truyền token
                }
            }
        );
        const cart = await res.json();

        if (!cart.length) {
            cartItemsContainer.innerHTML = `<div class="cart-empty"><i class="fas fa-shopping-cart"></i><p>Giỏ hàng của bạn đang trống!</p><a href="../pages/product.html" class="btn-shopping">MUA NGAY</a></div>`;
            totalPriceEl.textContent = "0 ₫";
            totalCountEl.textContent = "Tổng thanh toán (0 sản phẩm):";
            return;
        }

        let total = 0, count = 0;
        cartItemsContainer.innerHTML = cart.map((item) => {
            const itemTotal = item.Price * item.Quantity;
            total += itemTotal;
            count += item.Quantity;
            return `
                <div class="cart-item" data-id="${item.ProductID}">
                    <div class="col-select"><input type="checkbox" class="item-select"></div>
                    <div class="col-product">
                        <img src="${item.Thumbnail}" alt="${item.Title}" class="cart-thumb">
                        <span class="cart-title">${item.Title}</span>
                    </div>
                    <div class="col-price">${Number(item.Price).toLocaleString("vi-VN")} ₫</div>
                    <div class="col-quantity">
                        <button class="qty-btn minus">-</button>
                        <input type="number" min="1" max="${item.Stock}" value="${item.Quantity}" class="qty-input">
                        <button class="qty-btn plus">+</button>
                    </div>
                    <div class="col-total">${itemTotal.toLocaleString("vi-VN")} ₫</div>
                    <div class="col-action"><button class="delete-btn"><i class="fas fa-trash"></i></button></div>
                </div>
            `;
        }).join("");

        totalPriceEl.textContent = total.toLocaleString("vi-VN") + " ₫";
        totalCountEl.textContent = `Tổng thanh toán (${count} sản phẩm):`;
    } catch (error) {
        console.error("Lỗi khi tải giỏ hàng:", error);
        cartItemsContainer.innerHTML = `<div class="cart-empty"><i class="fas fa-shopping-cart"></i><p>Không thể tải giỏ hàng!</p></div>`;
    }
});