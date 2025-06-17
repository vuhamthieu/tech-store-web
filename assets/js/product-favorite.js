document.addEventListener("DOMContentLoaded", function () {
    const wishlistContainer = document.getElementById("wishlistItems");
    const emptyWishlist = document.getElementById("emptyWishlist");
    const clearBtn = document.getElementById("clearWishlist");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortBy = document.getElementById("sortBy");

    let allProducts = [];

    // Tải danh sách sản phẩm yêu thích từ API
    function loadWishlist() {
        fetch("http://localhost/webproject/tech-store-web/back-end/php/api/get-favorite-products")
            .then(res => res.json())
            .then(data => {
                if (data.success && Array.isArray(data.data)) {
                    allProducts = data.data;
                    renderWishlist(allProducts);
                } else {
                    allProducts = [];
                    renderWishlist([]);
                }
            })
            .catch(err => {
                console.error("Lỗi tải wishlist:", err);
                renderWishlist([]);
            });
    }

    // Hiển thị danh sách sản phẩm
    function renderWishlist(products) {
        wishlistContainer.innerHTML = "";
        if (products.length === 0) {
            emptyWishlist.style.display = "block";
            return;
        }

        emptyWishlist.style.display = "none";

        products.forEach(product => {
            const item = document.createElement("div");
            item.className = "wishlist-item";
            item.innerHTML = `
                <img src="${product.MainImage}" alt="${product.Name}">
                <div class="wishlist-info">
                    <h4>${product.Name}</h4>
                    <p>Giá: ${formatCurrency(product.Price)}</p>
                    <button class="btn btn-remove" data-id="${product.ProductID}">
                        <i class="fas fa-times"></i> Xóa
                    </button>
                </div>
            `;
            item.querySelector(".btn-remove").addEventListener("click", function () {
                removeFavorite(product.ProductID, item);
            });
            wishlistContainer.appendChild(item);
        });
    }

    // Xóa một sản phẩm khỏi danh sách yêu thích
    function removeFavorite(productId, element) {
        fetch("http://localhost/webproject/tech-store-web/back-end/php/api/remove-favorite-product", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ product_id: productId })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    element.remove();
                    allProducts = allProducts.filter(p => p.ProductID !== productId);
                    if (allProducts.length === 0) {
                        renderWishlist([]);
                    }
                } else {
                    alert("Lỗi khi xóa sản phẩm yêu thích.");
                }
            })
            .catch(err => {
                console.error("Lỗi khi gửi yêu cầu xóa:", err);
            });
    }

    // Xóa tất cả sản phẩm yêu thích
    clearBtn.addEventListener("click", function () {
        if (allProducts.length === 0) return;
        if (!confirm("Bạn có chắc muốn xóa tất cả sản phẩm yêu thích?")) return;

        allProducts.forEach(product => {
            removeFavorite(product.ProductID, document.querySelector(`.btn-remove[data-id="${product.ProductID}"]`)?.closest(".wishlist-item"));
        });
    });

    // Lọc và sắp xếp
    function filterAndSort() {
        let filtered = [...allProducts];

        const category = categoryFilter.value;
        const sort = sortBy.value;

        if (category !== "all") {
            filtered = filtered.filter(p => p.Category?.toLowerCase() === category);
        }

        switch (sort) {
            case "newest":
                filtered.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
                break;
            case "oldest":
                filtered.sort((a, b) => new Date(a.CreatedAt) - new Date(b.CreatedAt));
                break;
            case "price_asc":
                filtered.sort((a, b) => a.Price - b.Price);
                break;
            case "price_desc":
                filtered.sort((a, b) => b.Price - a.Price);
                break;
        }

        renderWishlist(filtered);
    }

    categoryFilter.addEventListener("change", filterAndSort);
    sortBy.addEventListener("change", filterAndSort);

    // Hàm định dạng tiền tệ
    function formatCurrency(value) {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(value);
    }
      // === AVATAR UPLOAD ===
    const avatarInput = document.getElementById('avatarInput');
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const avatarImage = document.getElementById('avatarImage');
  
    changeAvatarBtn.addEventListener('click', function () {
      avatarInput.click();
    });
  
    avatarInput.addEventListener('change', function (e) {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (file.size > 2 * 1024 * 1024) return alert('Ảnh không được quá 2MB');
        if (!file.type.match('image.*')) return alert('Chỉ chấp nhận ảnh');
  
        const reader = new FileReader();
        reader.onload = function (event) {
          avatarImage.src = event.target.result;
          uploadAvatarToServer(file);
        };
        reader.readAsDataURL(file);
      }
    });
  
    function uploadAvatarToServer(file) {
      const formData = new FormData();
      formData.append('avatar', file);
  
      fetch('http://localhost/webproject/tech-store-web/back-end/php/api/update-avatar-user', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        body: formData
      })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            alert('Cập nhật ảnh thành công!');
          } else {
            alert('Lỗi: ' + result.message);
          }
        })
        .catch(error => {
          console.error('Upload avatar error:', error);
          alert('Không thể tải lên ảnh đại diện!');
        });
    }

    // Khởi động
    loadWishlist();
});
