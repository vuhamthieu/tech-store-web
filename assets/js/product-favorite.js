document.addEventListener("DOMContentLoaded", function () {
    const wishlistContainer = document.getElementById("wishlistItems");
    const emptyWishlist = document.getElementById("emptyWishlist");
    const clearBtn = document.getElementById("clearWishlist");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortBy = document.getElementById("sortBy");

    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination-container';
    document.querySelector('.profile-content').appendChild(paginationContainer);

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Vui lòng đăng nhập để xem danh sách yêu thích!");
        window.location.href = "login.html";
        return;
    }

    let allProducts = [];
    let currentPage = 1;
    const productsPerPage = 6; // 2 hàng x 3 cột

    async function loadWishlist() {
        try {
            console.log("Calling API with token:", token);
            const res = await fetch("http://localhost/webproject/tech-store-web/back-end/php/api/get-favorite-products", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            console.log("API Response status:", res.status);

            if (res.status === 401) {
                alert("Token đã hết hạn, vui lòng đăng nhập lại!");
                window.location.href = "login.html";
                return;
            }

            const data = await res.json();
            console.log("API Response data:", data);

            if (data.success && Array.isArray(data.data)) {
                allProducts = data.data.map(p => ({
                    ProductID: p.ProductID,
                    Name: p.Title,
                    MainImage: p.Thumbnail || p.MainImage || "https://via.placeholder.com/150",
                    Price: parseFloat(p.Price),
                    CreatedAt: p.CreatedAt,
                    Category: p.CategoryName || "khac"
                }));
            } else {
                allProducts = [];
            }

            renderWishlist(allProducts);
        } catch (err) {
            console.error("Lỗi tải wishlist:", err);
            allProducts = [];
            renderWishlist([]);
        }
    }

    function renderWishlist(products) {
        wishlistContainer.innerHTML = "";

        if (products.length === 0) {
            emptyWishlist.style.display = "block";
            paginationContainer.style.display = "none";
            return;
        }

        emptyWishlist.style.display = "none";
        paginationContainer.style.display = "flex";

        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const paginatedProducts = products.slice(startIndex, endIndex);

        const gridContainer = document.createElement('div');
        gridContainer.className = 'wishlist-grid';

        paginatedProducts.forEach(product => {
            const item = document.createElement("div");
            item.className = "wishlist-item";
            const name = product.Name || "Không tên";
            const price = parseFloat(product.Price) || 0;
            const image = product.MainImage || "https://via.placeholder.com/150";

            item.innerHTML = `
                <img src="${image}" alt="${name}" class="wishlist-thumb" style="max-width:100px;max-height:100px;object-fit:contain;display:block;margin:0 auto 10px;">
                <div class="wishlist-info">
                    <h4>${name}</h4>
                    <p class="wishlist-price">${formatCurrency(price)}</p>
                </div>
                <button class="btn-remove" data-id="${product.ProductID}">
                    <i class="fas fa-times"></i>
                </button>
            `;

            item.querySelector(".btn-remove").addEventListener("click", function () {
                removeFavorite(product.ProductID);
            });

            gridContainer.appendChild(item);
        });

        wishlistContainer.appendChild(gridContainer);
        renderPagination(products.length);
    }

    function renderPagination(totalProducts) {
        paginationContainer.innerHTML = "";

        const totalPages = Math.ceil(totalProducts / productsPerPage);
        if (totalPages <= 1) {
            paginationContainer.style.display = "none";
            return;
        }

        const prevButton = document.createElement('button');
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.className = 'pagination-btn';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                filterAndSort();
            }
        });
        paginationContainer.appendChild(prevButton);

        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            const firstPageButton = document.createElement('button');
            firstPageButton.textContent = '1';
            firstPageButton.className = 'pagination-btn';
            firstPageButton.addEventListener('click', () => {
                currentPage = 1;
                filterAndSort();
            });
            paginationContainer.appendChild(firstPageButton);
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'pagination-ellipsis';
                paginationContainer.appendChild(ellipsis);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                filterAndSort();
            });
            paginationContainer.appendChild(pageButton);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'pagination-ellipsis';
                paginationContainer.appendChild(ellipsis);
            }

            const lastPageButton = document.createElement('button');
            lastPageButton.textContent = totalPages;
            lastPageButton.className = 'pagination-btn';
            lastPageButton.addEventListener('click', () => {
                currentPage = totalPages;
                filterAndSort();
            });
            paginationContainer.appendChild(lastPageButton);
        }

        const nextButton = document.createElement('button');
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.className = 'pagination-btn';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                filterAndSort();
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    async function removeFavorite(productId) {
        try {
            const res = await fetch("http://localhost/webproject/tech-store-web/back-end/php/api/remove-favorite-product", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ product_id: productId })
            });

            const data = await res.json();
            if (data.success) {
                allProducts = allProducts.filter(p => p.ProductID !== productId);
                if (allProducts.length <= (currentPage - 1) * productsPerPage && currentPage > 1) {
                    currentPage--;
                }
                renderWishlist(allProducts);
            } else {
                alert("Lỗi khi xóa sản phẩm yêu thích.");
            }
        } catch (err) {
            console.error("Lỗi khi gửi yêu cầu xóa:", err);
        }
    }

    clearBtn.addEventListener("click", async function () {
        if (allProducts.length === 0) return;
        if (!confirm("Bạn có chắc muốn xóa tất cả sản phẩm yêu thích?")) return;

        await Promise.all(allProducts.map(p =>
            fetch("http://localhost/webproject/tech-store-web/back-end/php/api/remove-favorite-product", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ product_id: p.ProductID })
            })
        ));

        allProducts = [];
        currentPage = 1;
        renderWishlist([]);
    });

    function filterAndSort() {
        currentPage = 1;
        let filtered = [...allProducts];
        const category = categoryFilter.value;
        const sort = sortBy.value;

        if (category !== "all") {
            filtered = filtered.filter(p => (p.Category || "").toLowerCase() === category.toLowerCase());
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

    function formatCurrency(value) {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(value);
    }

    loadWishlist();
});
