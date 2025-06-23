document.addEventListener("DOMContentLoaded", async function () {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    // Make token lookup more robust by checking multiple possible keys
    const accessToken = localStorage.getItem("token") || localStorage.getItem("access_token") || user.accessToken;
    const userId = user.UserID || user.id || 0;

    const cartItemsContainer = document.querySelector(".cart-items");
    const totalPriceEl = document.querySelector(".total-price .amount");
    const totalCountEl = document.querySelector(".footer-left span");

    if (!userId || !accessToken) {
        showEmptyCart("Vui lòng đăng nhập để xem giỏ hàng!");
        return;
    }

    try {
        const res = await fetch(
            `http://localhost/webproject/tech-store-web/back-end/php/api/cart`,
            {
                method: 'GET',
                headers: { "Authorization": `Bearer ${accessToken}` }
            }
        );

        if (res.status === 401) {
            localStorage.clear();
            showEmptyCart("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại!");
            return;
        }

        const cart = await res.json();
        localStorage.setItem("cart", JSON.stringify(cart));

        if (!cart.length) {
            showEmptyCart("Giỏ hàng của bạn đang trống!");
            return;
        }

        cartItemsContainer.innerHTML = cart.map((item) => {
            return `
                <div class="cart-item" data-price="${item.Price}" data-id="${item.ProductID}" data-options="${item.Options || ''}">
                    <div class="col-select"><input type="checkbox" class="item-select"></div>
                    <div class="col-product">
                        <img src="${item.Thumbnail}" alt="${item.Title}" class="cart-thumb">
                        <div class="product-info">
                           <span class="cart-title">${item.Title}</span>
                           <span class="cart-options">${item.Options || ''}</span>
                        </div>
                    </div>
                    <div class="col-price">${Number(item.Price).toLocaleString("vi-VN")} ₫</div>
                    <div class="col-quantity">
                        <button class="qty-btn minus">-</button>
                        <input type="number" min="1" max="${item.Stock}" value="${item.Quantity}" class="qty-input">
                        <button class="qty-btn plus">+</button>
                    </div>
                    <div class="col-total">${(item.Price * item.Quantity).toLocaleString("vi-VN")} ₫</div>
                    <div class="col-action"><button class="delete-btn"><i class="fas fa-trash"></i></button></div>
                </div>
            `;
        }).join("");

        updateCartTotals();

    } catch (error) {
        console.error("Lỗi khi tải giỏ hàng:", error);
        showEmptyCart("Không thể tải giỏ hàng!");
    }

    // --- Event Listeners ---
    cartItemsContainer.addEventListener('click', async (e) => {
        const cartItem = e.target.closest('.cart-item');
        if (!cartItem) return;

        // Handle Delete
        const deleteBtn = e.target.closest('.delete-btn');
        if (deleteBtn) {
            const productId = cartItem.dataset.id;
            const options = cartItem.dataset.options;

            if (!confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
                return;
            }

            try {
                const res = await fetch('http://localhost/webproject/tech-store-web/back-end/php/api/remove-from-cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({ product_id: productId, options: options })
                });

                const result = await res.json();
                if (result.success) {
                    cartItem.remove();
                    updateCartTotals();
                } else {
                    alert(result.message || 'Không thể xóa sản phẩm.');
                }
            } catch (error) {
                console.error('Lỗi khi xóa sản phẩm:', error);
                alert('Có lỗi xảy ra khi xóa sản phẩm.');
            }
            return;
        }

        // Handle Quantity Minus
        if (e.target.classList.contains('minus')) {
            const qtyInput = cartItem.querySelector('.qty-input');
            let quantity = parseInt(qtyInput.value, 10);
            if (quantity > 1) {
                quantity--;
                await updateQuantity(cartItem, quantity, qtyInput);
            }
            return;
        }

        // Handle Quantity Plus
        if (e.target.classList.contains('plus')) {
            const qtyInput = cartItem.querySelector('.qty-input');
            let quantity = parseInt(qtyInput.value, 10);
            const max = parseInt(qtyInput.getAttribute('max'), 10);
            if (quantity < max) {
                quantity++;
                await updateQuantity(cartItem, quantity, qtyInput);
            }
            return;
        }
    });

    // --- Helper Functions ---
    function updateCartTotals() {
        const cartItems = document.querySelectorAll('.cart-item');
        let total = 0;
        let count = 0;

        if (cartItems.length === 0) {
            showEmptyCart("Giỏ hàng của bạn đang trống!");
            return;
        }

        cartItems.forEach(item => {
            const price = parseFloat(item.dataset.price);
            const quantity = Number(item.querySelector('.qty-input').value);
            total += price * quantity;
            count += quantity;
        });

        totalPriceEl.textContent = total.toLocaleString("vi-VN") + " ₫";
        totalCountEl.textContent = `Tổng thanh toán (${count} sản phẩm):`;
    }

    function showEmptyCart(message) {
        cartItemsContainer.innerHTML = `<div class="cart-empty"><i class="fas fa-shopping-cart"></i><p>${message}</p><a href="../pages/product.html" class="btn-shopping">MUA NGAY</a></div>`;
        totalPriceEl.textContent = "0 ₫";
        totalCountEl.textContent = "Tổng thanh toán (0 sản phẩm):";
    }

    // Helper function to update quantity in backend and UI
    async function updateQuantity(cartItem, quantity, qtyInput) {
        const productId = cartItem.dataset.id;
        const options = cartItem.dataset.options;
        try {
            const res = await fetch('http://localhost/webproject/tech-store-web/back-end/php/api/update-cart-quantity', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    productId: productId,
                    quantity: quantity,
                    options: options
                })
            });
            const result = await res.json();
            if (result.success) {
                qtyInput.value = quantity;
                updateCartTotals();
            } else {
                alert(result.message || 'Không thể cập nhật số lượng.');
            }
        } catch (error) {
            alert('Có lỗi xảy ra khi cập nhật số lượng.');
        }
    }

    document.querySelector(".checkout-btn")?.addEventListener("click", function (e) {
        e.preventDefault();
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        console.log("Cart before checkout:", cart);
        localStorage.setItem("checkout", JSON.stringify(cart));
        console.log("Checkout after set:", localStorage.getItem("checkout"));
        window.location.href = "checkout.html";
    });
});