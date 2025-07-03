document.addEventListener("DOMContentLoaded", async function () {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    // Make token lookup more robust by checking multiple possible keys
    const accessToken = localStorage.getItem("token") || localStorage.getItem("access_token") || user.accessToken;
    const userId = user.UserID || user.id || 0;

    // === UPDATE USER INFO IN HEADER ===
    const userInfoContainer = document.querySelector(".user-info");
    if (userInfoContainer && user.FullName) {
        userInfoContainer.innerHTML = `
            <a href="user.html">
                <img src="${user.Avatar
                ? 'http://localhost/webproject/tech-store-web/assets/img/' + user.Avatar
                : "https://scontent.fhan19-1.fna.fbcdn.net/v/t39.30808-1/482236741_636204415676991_5392700582177539028_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=110&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeF-ZMG_JcvB5jG-9TdeZq09X-xSXJw_HWhf7FJcnD8daPet7y5DQKkl_3Yqsodo_HgQX3sQqkAQzWspJYhKvzRp&_nc_ohc=Oguzvd7HXB0Q7kNvwFUs_9J&_nc_oc=AdlwzdkAon8zboaTFw_4eXUzLshM9PSe8wQI0qqyV_7t7dOq2GiJlhl7WBha0hVidAgl-5__FNyd7vzW0REYkRzR&_nc_zt=24&_nc_ht=scontent.fhan19-1.fna&_nc_gid=FwyM96FZ-5f-jGuI43dbDQ&oh=00_AfOVhVAEK4Zlebyh3XPaZLvLcsll7BQcFTh9bZWnE8YcQg&oe=6855F6D6"
            }" 
                   alt="Avatar"
                   class="user-avatar"
                   style="width:40px;height:40px;border-radius:50%;"> 
            </a>
            <div class="user-dropdown">
                <span class="user-name">${user.FullName}</span>
                <div class="dropdown-content">
                    <a href="user.html">Thông tin tài khoản</a>
                    <a href="#" id="logout-btn">Đăng xuất</a>
                </div>
            </div>
        `;

        // Thêm sự kiện đăng xuất
        document.addEventListener('click', function (e) {
            if (e.target && e.target.id === 'logout-btn') {
                e.preventDefault();

                // Xóa thông tin đăng nhập
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                localStorage.removeItem('access_token');

                // Reload lại trang
                window.location.reload();
            }
        });
    }

    const cartItemsContainer = document.querySelector(".cart-items");
    const totalPriceEl = document.querySelector(".total-price .amount");
    const totalCountEl = document.querySelector(".footer-left span");

    if (!userId || !accessToken) {
        showEmptyCart("Vui lòng đăng nhập để xem giỏ hàng!");
        return;
    }

    try {
        const res = await authFetch(
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
                const res = await authFetch('http://localhost/webproject/tech-store-web/back-end/php/api/remove-from-cart', {
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

    // Lắng nghe sự kiện chọn/bỏ chọn sản phẩm
    cartItemsContainer.addEventListener('change', function (e) {
        if (e.target.classList.contains('item-select')) {
            updateCartTotals();
        }
    });

    // Lắng nghe sự kiện chọn/bỏ chọn tất cả
    const selectAllCheckbox = document.getElementById('select-all');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function () {
            const allCheckboxes = cartItemsContainer.querySelectorAll('.item-select');
            allCheckboxes.forEach(cb => cb.checked = selectAllCheckbox.checked);
            updateCartTotals();
        });
    }

    // --- Helper Functions ---
    function updateCartTotals() {
        const cartItems = document.querySelectorAll('.cart-item');
        let total = 0;
        let count = 0;

        // Lấy tất cả các checkbox đã được chọn
        const checkedItems = document.querySelectorAll('.cart-item .item-select:checked');

        if (cartItems.length === 0) {
            showEmptyCart("Giỏ hàng của bạn đang trống!");
            return;
        }

        // Nếu không có sản phẩm nào được chọn, tổng = 0
        if (checkedItems.length === 0) {
            totalPriceEl.textContent = "0 ₫";
            totalCountEl.textContent = "Tổng thanh toán (0 sản phẩm):";
            return;
        }

        checkedItems.forEach(checkbox => {
            const item = checkbox.closest('.cart-item');
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
            const res = await authFetch('http://localhost/webproject/tech-store-web/back-end/php/api/update-cart-quantity', {
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

        // Lấy tất cả các cart-item đã được tick chọn
        const checkedItems = document.querySelectorAll('.cart-item .item-select:checked');
        if (checkedItems.length === 0) {
            alert("Vui lòng chọn ít nhất một sản phẩm để mua!");
            return;
        }

        // Tạo danh sách sản phẩm đã chọn
        const selectedProducts = Array.from(checkedItems).map(checkbox => {
            const item = checkbox.closest('.cart-item');
            return {
                ProductID: item.dataset.id,
                Quantity: Number(item.querySelector('.qty-input').value),
                Options: item.dataset.options,
                Title: item.querySelector('.cart-title').textContent,
                Price: Number(item.dataset.price),
                Thumbnail: item.querySelector('.cart-thumb').src
            };
        });

        // Lưu vào localStorage để trang checkout dùng
        localStorage.setItem("checkout", JSON.stringify(selectedProducts));
        window.location.href = "checkout.html";
    });
});