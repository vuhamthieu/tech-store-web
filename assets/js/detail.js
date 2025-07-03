document.addEventListener("DOMContentLoaded", async function () {

  // Thumbnail click event
  const thumbnails = document.querySelectorAll(".thumbnail");
  const mainImage = document.getElementById("mainProductImage");

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", function () {
      thumbnails.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
      const imgSrc = this.querySelector("img").getAttribute("data-large");
      mainImage.src = imgSrc;
    });
  });

  // Quantity selector
  const decreaseBtn = document.getElementById("decreaseQty");
  const increaseBtn = document.getElementById("increaseQty");
  const quantityInput = document.getElementById("productQty");

  decreaseBtn?.addEventListener("click", function () {
    let value = parseInt(quantityInput.value);
    if (value > 1) {
      quantityInput.value = value - 1;
    }
  });

  increaseBtn?.addEventListener("click", function () {
    let value = parseInt(quantityInput.value);
    if (value < 10) {
      quantityInput.value = value + 1;
    }
  });

  // Variant selection
  const variantOptions = document.querySelectorAll(
    ".variant-option:not(.disabled)"
  );
  variantOptions.forEach((option) => {
    option.addEventListener("click", function () {
      const optionsContainer = this.parentElement;
      optionsContainer.querySelectorAll(".variant-option").forEach((opt) => {
        opt.classList.remove("selected");
      });
      this.classList.add("selected");
    });
  });

  // Add to cart button
  const addToCartBtn = document.querySelector(".add-to-cart");

  // Buy now button
  const buyNowBtn = document.querySelector(".buy-now");
  buyNowBtn?.addEventListener("click", function (e) {
    e.preventDefault();
    // Gather product info as in your add-to-cart logic
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token") || user.accessToken;
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    const quantity = Number(document.getElementById("productQty").value) || 1;
    let options = "";
    const selectedCapacity = document.querySelector("#capacityVariants .variant-option.selected");
    const selectedColor = document.querySelector("#colorVariants .variant-option.selected");
    options = [
      selectedCapacity ? selectedCapacity.textContent : "",
      selectedColor ? selectedColor.textContent : "",
    ].filter(Boolean).join(", ");

    const product = {
      product_id: productId,
      name: document.getElementById("productTitle").textContent,
      image: document.getElementById("mainProductImage").src,
      price: Number(document.getElementById("currentPrice").textContent.replace(/[^\d]/g, "")),
      quantity: quantity,
      options: options
    };
    localStorage.setItem("checkout", JSON.stringify([product]));
    window.location.href = "checkout.html";
  });

  // Rating stars
  const stars = document.querySelectorAll(".rating-input .star");
  const ratingInput = document.getElementById("reviewRating");

  stars.forEach((star) => {
    star.addEventListener("mouseover", function () {
      const value = parseInt(this.getAttribute("data-value"));
      stars.forEach((s) => s.classList.remove("hover"));
      for (let i = 0; i < value; i++) {
        stars[i].classList.add("hover");
      }
    });

    star.addEventListener("mouseout", function () {
      stars.forEach((s) => s.classList.remove("hover"));
      for (let i = 0; i < ratingInput.value; i++) {
        stars[i].classList.add("active");
      }
    });

    star.addEventListener("click", function () {
      const value = parseInt(this.getAttribute("data-value"));
      ratingInput.value = value;
      stars.forEach((s) => s.classList.remove("active"));
      for (let i = 0; i < value; i++) {
        stars[i].classList.add("active");
      }
    });
  });

  // Image upload
  const uploadPlaceholder = document.querySelector(".upload-placeholder");
  const fileInput = document.getElementById("reviewImages");

  uploadPlaceholder?.addEventListener("click", function () {
    fileInput.click();
  });

  fileInput?.addEventListener("change", function () {
    const files = this.files;
    const uploadPreview = document.querySelector(".upload-preview");

    if (files.length > 0) {
      uploadPreview.innerHTML = "";
    }

    for (let i = 0; i < Math.min(files.length, 3); i++) {
      const file = files[i];
      if (file.type.match("image.*")) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const imgContainer = document.createElement("div");
          imgContainer.className = "uploaded-image";
          imgContainer.innerHTML = `
            <img src="${e.target.result}" alt="Preview">
            <button class="remove-image-btn">&times;</button>
          `;
          uploadPreview.appendChild(imgContainer);

          imgContainer
            .querySelector(".remove-image-btn")
            .addEventListener("click", function () {
              imgContainer.remove();
              if (uploadPreview.children.length === 0) {
                uploadPreview.innerHTML = `
                  <div class="upload-placeholder">
                    <i class="fas fa-camera"></i>
                    <span>Thêm ảnh</span>
                  </div>
                `;
              }
            });
        };
        reader.readAsDataURL(file);
      }
    }
  });
  // Submit review
  const reviewForm = document.getElementById("reviewForm");
  reviewForm?.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get the rating and comment
    const rating = document.getElementById("reviewRating")?.value;
    const comment = document.getElementById("reviewContent")?.value;
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    // Validate input
    if (!rating || rating === "0") {
      alert("Vui lòng chọn số sao đánh giá!");
      return;
    }

    if (!comment?.trim()) {
      alert("Vui lòng nhập nội dung đánh giá!");
      return;
    }

    // Check if user is logged in and get token
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    console.log("Debug Info:", {
      token: token,
      user: user,
      isLoggedIn: isLoggedIn,
    });

    if (!token) {
      alert("Vui lòng đăng nhập để đánh giá sản phẩm!");
      window.location.href = "login.html";
      return;
    }

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      console.log("Request headers:", headers);

      const requestBody = {
        productId: productId,
        rating: parseInt(rating),
        comment: comment.trim(),
      };
      console.log("Request body:", requestBody);

      const response = await authFetch(
        "http://localhost/webproject/tech-store-web/back-end/php/api/add-review",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(requestBody),
        }
      );

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (data.success) {
        alert("Cảm ơn bạn đã đánh giá sản phẩm!");

        // Reset form
        this.reset();

        // Reset stars
        const stars = document.querySelectorAll(".rating-input .star");
        stars?.forEach((star) => star.classList.remove("active"));
        const ratingInput = document.getElementById("reviewRating");
        if (ratingInput) {
          ratingInput.value = "0";
        }

        // Reload reviews
        if (productId) {
          await loadReviews(productId);
        }
      } else {
        if (data.message === "Token không hợp lệ hoặc đã hết hạn") {
          console.log("Token validation failed. Current token:", token);
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
          localStorage.clear();
          window.location.href = "login.html";
        } else {
          alert(data.error || "Có lỗi xảy ra khi gửi đánh giá!");
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Có lỗi xảy ra khi gửi đánh giá!");
    }
  });

  // Helpful buttons
  document.querySelectorAll(".helpful-btn, .not-helpful-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const countSpan = this.querySelector("span") || this;
      let count = parseInt(countSpan.textContent.match(/\d+/)?.[0] || 0);
      count++;
      this.textContent = this.textContent.replace(/\d+/, count);
      this.classList.add("active");
    });
  });

  // Tab switching
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      this.classList.add("active");
      const tabId = this.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });

  // authFetch product details
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    alert("Không tìm thấy ID sản phẩm!");
    return;
  }

  try {
    const res = await authFetch(
      `http://localhost/webproject/tech-store-web/back-end/php/api/product-details?productId=${productId}`
    );
    const data = await res.json();

    const { product, productSpecifications, variants, gallery } = data;

    // Update product images
    if (gallery.length > 0) {
      mainImage.src = gallery[0].Thumbnail;

      const galleryContainer = document.querySelector(".thumbnail-gallery");
      galleryContainer.innerHTML = "";
      gallery.forEach((imgObj, index) => {
        const thumbnailDiv = document.createElement("div");
        thumbnailDiv.className = "thumbnail" + (index === 0 ? " active" : "");
        thumbnailDiv.innerHTML = `<img src="${imgObj.Thumbnail}" data-large="${imgObj.Thumbnail
          }" alt="Ảnh ${index + 1}">`;
        galleryContainer.appendChild(thumbnailDiv);
      });

      const newThumbnails = galleryContainer.querySelectorAll(".thumbnail");
      newThumbnails.forEach((thumb) => {
        thumb.addEventListener("click", function () {
          newThumbnails.forEach((t) => t.classList.remove("active"));
          this.classList.add("active");
          const imgSrc = this.querySelector("img").getAttribute("data-large");
          mainImage.src = imgSrc;
        });
      });
    }

    // Update product info
    document.getElementById("productTitle").textContent =
      product.Title || "Không tên";
    document.getElementById("currentPrice").textContent =
      Number(product.Price).toLocaleString("vi-VN") + "₫";
    document.getElementById("oldPrice").textContent = product.OldPrice
      ? Number(product.OldPrice).toLocaleString("vi-VN") + "₫"
      : "";
    document.getElementById("soldCount").textContent = product.SoldCount || 0;
    document.getElementById("stockInfo").textContent = product.Stock || 0;

    // Show average rating
    // Show average rating in the review summary
    // --- Update review summary section (already working) ---
    const avgRating = product.Rating ? parseFloat(product.Rating) : 0;
    const avgRatingSpan = document.getElementById("avg-rating");
    const avgStarsDiv = document.getElementById("avg-stars");

    if (avgRatingSpan) avgRatingSpan.textContent = avgRating.toFixed(1);
    if (avgStarsDiv) avgStarsDiv.innerHTML = "★".repeat(Math.round(avgRating)) + "☆".repeat(5 - Math.round(avgRating));

    // --- Update product meta section (lines 92-95) ---
    const productStarsDiv = document.getElementById("productStars");
    const ratingCountDiv = document.getElementById("ratingCount");
    if (productStarsDiv) productStarsDiv.innerHTML = "★".repeat(Math.round(avgRating)) + "☆".repeat(5 - Math.round(avgRating));
    if (ratingCountDiv) ratingCountDiv.textContent = `${product.TotalReviews || 0} đánh giá`;
    // Update variants (dung lượng & màu sắc từ VariantSpecifications)
    const capacityContainer = document.querySelector("#capacityVariants");
    const colorContainer = document.querySelector("#colorVariants");
    const capacitySection = document.getElementById("capacityVariantsSection");
    const colorSection = document.getElementById("colorVariantsSection");

    // Chỉ xử lý nếu là sản phẩm thuộc danh mục "Máy tính" (CategoryID = 1)
    if (Number(product.CategoryID) === 1 && variants.length > 0) {
      // Hiện phần lựa chọn ROM và Color
      capacitySection?.classList.remove("hidden");
      colorSection?.classList.remove("hidden");

      // ROM (Dung lượng)
      if (capacityContainer) {
        const capacities = [
          ...new Set(
            variants
              .flatMap((v) =>
                (v.Specifications || []).filter((s) => s.SpecKey === "ROM").map((s) => s.SpecValue)
              )
              .filter(Boolean)
          ),
        ];
        capacityContainer.innerHTML = "";
        capacities.forEach((cap) => {
          const div = document.createElement("div");
          div.className = "variant-option";
          div.textContent = cap;
          capacityContainer.appendChild(div);
        });
      }

      // Màu sắc (Color)
      if (colorContainer) {
        const colors = [
          ...new Set(
            variants
              .flatMap((v) =>
                (v.Specifications || []).filter((s) => s.SpecKey === "Color").map((s) => s.SpecValue)
              )
              .filter(Boolean)
          ),
        ];
        colorContainer.innerHTML = "";
        colors.forEach((color) => {
          const div = document.createElement("div");
          div.className = "variant-option";
          div.textContent = color;
          colorContainer.appendChild(div);
        });
      }
    } else {
      // Không phải sản phẩm "Máy tính" => Ẩn phần ROM và Màu
      capacitySection?.classList.add("hidden");
      colorSection?.classList.add("hidden");
    }


    // Update description
    document.querySelector("#description .description-content").innerHTML = `
  <h2 class="section-title">${product.Title}</h2>
  <div class="detailed-description">${(
        product.Description || "Không có mô tả."
      ).replace(/\n/g, "<br>")}</div>
`;

    // Update specifications
    const specsContainer = document.querySelector("#specs .specs-table");
    specsContainer.innerHTML = "";
    productSpecifications.forEach((spec) => {
      const row = document.createElement("div");
      row.className = "spec-row";
      row.innerHTML = `
        <div class="spec-name">${spec.SpecKey}</div>
        <div class="spec-value">${spec.SpecValue}</div>
      `;
      specsContainer.appendChild(row);
    });

    // Load reviews
    await loadReviews(productId);

    // --- Favorite (Heart) Button Logic ---

    const favoriteBtn = document.getElementById('favoriteBtn');
    const heartPath = document.getElementById('heartPath');
    let isFavorite = false;
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");

    // 1. Check if this product is already a favorite
    async function checkFavorite() {
      if (!token || !productId) return;
      try {
        const res = await authFetch(
          "http://localhost/webproject/tech-store-web/back-end/php/api/get-favorite-products",
          {
            headers: { "Authorization": `Bearer ${token}` }
          }
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          isFavorite = data.data.some(p => String(p.ProductID) === String(productId));
          updateHeartIcon();
        }
      } catch (err) {
        console.error("Lỗi khi kiểm tra yêu thích:", err);
      }
    }

    // 2. Toggle favorite on click
    favoriteBtn?.addEventListener("click", async () => {
      if (!token || !productId) return;
      const url = isFavorite
        ? "http://localhost/webproject/tech-store-web/back-end/php/api/remove-favorite-product"
        : "http://localhost/webproject/tech-store-web/back-end/php/api/add-favorite-product";
      try {
        const res = await authFetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ product_id: productId })
        });
        const data = await res.json();
        if (data.success) {
          isFavorite = !isFavorite;
          updateHeartIcon();
        } else {
          alert("Không thể cập nhật yêu thích!");
        }
      } catch (err) {
        console.error("Lỗi yêu thích:", err);
      }
    });

    // 3. Update heart icon UI
    function updateHeartIcon() {
      if (!heartPath) return;
      if (isFavorite) {
        heartPath.setAttribute("fill", "#ff4d4f");
        heartPath.setAttribute("stroke", "#ff4d4f");
        favoriteBtn.classList.add("active");
      } else {
        heartPath.setAttribute("fill", "none");
        heartPath.setAttribute("stroke", "#ccc");
        favoriteBtn.classList.remove("active");
      }
    }

    // Call checkFavorite on page load (after productId is available)
    checkFavorite();

    // Function để thêm event listeners cho variant options
    function addVariantEventListeners() {
      const variantOptions = document.querySelectorAll(".variant-option:not(.disabled)");
      variantOptions.forEach((option) => {
        // Xóa event listeners cũ nếu có
        option.removeEventListener("click", handleVariantClick);
        // Thêm event listener mới
        option.addEventListener("click", handleVariantClick);
      });
    }

    // Function xử lý click variant
    function handleVariantClick() {
      const optionsContainer = this.parentElement;
      optionsContainer.querySelectorAll(".variant-option").forEach((opt) => {
        opt.classList.remove("selected");
      });
      this.classList.add("selected");
    }

    // Gọi function sau khi render variants
    addVariantEventListeners();

    const cartIcon = document.querySelector(".cart-icon");
    if (cartIcon) cartIcon.style.display = "none";
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
    alert("Không thể tải dữ liệu sản phẩm.");
  }
});
let allReviews = [];  // Lưu toàn bộ đánh giá
let currentReviewIndex = 0;  // Theo dõi số lượng đã hiển thị

async function loadReviews(productId) {
  try {
    const res = await authFetch(
      `http://localhost/webproject/tech-store-web/back-end/php/api/get-reviews?productId=${productId}`
    );
    allReviews = await res.json();
    currentReviewIndex = 0; // reset index

    const totalReviewsSpan = document.getElementById("total-reviews");
    const ratingCountDiv = document.getElementById("ratingCount");
    if (totalReviewsSpan) totalReviewsSpan.textContent = allReviews.length;
    if (ratingCountDiv) ratingCountDiv.textContent = `${allReviews.length} đánh giá`;

    const reviewsList = document.querySelector(".reviews-list");
    const header = reviewsList.querySelector(".reviews-header");
    reviewsList.innerHTML = "";
    if (header) reviewsList.appendChild(header);

    renderMoreReviews(15); // Hiển thị 15 đánh giá đầu tiên
  } catch (error) {
    console.error("Lỗi khi tải đánh giá:", error);
    document.querySelector(".reviews-list").innerHTML = "<p>Không thể tải đánh giá.</p>";
  }
  document.querySelectorAll(".review-helpful").forEach((section) => {
    const reviewId = section.getAttribute("data-review-id");
    const stored = localStorage.getItem(`review-feedback-${reviewId}`);
  
    const helpfulBtn = section.querySelector(".helpful-btn");
    const notHelpfulBtn = section.querySelector(".not-helpful-btn");
  
    if (stored === "helpful") {
      helpfulBtn?.classList.add("active");
      const countSpan = helpfulBtn.querySelector("span");
      if (countSpan) {
        let count = parseInt(countSpan.textContent || "0");
        countSpan.textContent = count + 1;
      }
    } else if (stored === "not-helpful") {
      notHelpfulBtn?.classList.add("active");
      const countSpan = notHelpfulBtn.querySelector("span");
      if (countSpan) {
        let count = parseInt(countSpan.textContent || "0");
        countSpan.textContent = count + 1;
      }
    }
  });
  const reviewCount = allReviews.length;
  localStorage.setItem(`reviewCount_${productId}`, reviewCount);
  
  setupHelpfulButtons();
}
function renderMoreReviews(count) {
  const reviewsList = document.querySelector(".reviews-list");
  const nextIndex = currentReviewIndex + count;
  const reviewsToRender = allReviews.slice(currentReviewIndex, nextIndex);

  reviewsToRender.forEach((review) => {
    const reviewItem = document.createElement("div");
    reviewItem.className = "review-item";
    reviewItem.setAttribute("data-review-id", review.ReviewID);
    reviewItem.innerHTML = `
      <div class="reviewer-info">
        <div class="reviewer-avatar">
          <img src="${review.Avatar ? 'http://localhost/webproject/tech-store-web/assets/img/' + review.Avatar : 'https://via.placeholder.com/50x50'}" alt="${review.FullName}">
        </div>
        <div class="reviewer-details">
          <div class="reviewer-name">${review.FullName}</div>
          <div class="review-date">${new Date(review.CreatedAt).toLocaleDateString("vi-VN")}</div>
        </div>
      </div>
      <div class="review-content">
        <div class="review-rating">
          <div class="stars">${"★".repeat(review.Rating)}${"☆".repeat(5 - review.Rating)}</div>
        </div>
        <div class="review-text">
          <p>${review.Comment}</p>
        </div>
        ${review.Images ? `
          <div class="review-images">
            ${review.Images.map(img => `
              <div class="review-image">
                <img src="${img}" alt="Hình ảnh đánh giá">
              </div>`).join("")}
          </div>` : ""}
        <div class="review-helpful" data-review-id="${review.ReviewID}">
  <span class="helpful-text">Đánh giá này có hữu ích không?</span>
  <button class="helpful-btn">Có (<span class="count">${review.HelpfulCount || 0}</span>)</button>
  <button class="not-helpful-btn">Không (<span class="count">${review.NotHelpfulCount || 0}</span>)</button>
</div>

      </div>
    `;
    reviewsList.appendChild(reviewItem);
  });

  currentReviewIndex = nextIndex;

  const existingButton = document.querySelector(".load-more-reviews");
  if (currentReviewIndex < allReviews.length) {
    if (!existingButton) {
      const loadMoreDiv = document.createElement("div");
      loadMoreDiv.className = "load-more-reviews";
      loadMoreDiv.innerHTML = `<button class="load-more-btn">Xem Thêm Đánh Giá</button>`;
      reviewsList.appendChild(loadMoreDiv);

      // Thêm sự kiện click
      loadMoreDiv.querySelector(".load-more-btn").addEventListener("click", () => {
        renderMoreReviews(15);
      });
    }
  } else {
    if (existingButton) existingButton.remove(); // Ẩn nút nếu hết
  }
}


// Thêm vào giỏ hàng với animation
document.getElementById("addToCartBtn")?.addEventListener("click", async function (e) {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token") || user.accessToken;
  const userId = user.UserID || user.id || 0;

  if (!userId) {
    alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
    window.location.href = 'login.html';
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  if (!productId) {
    alert("Không tìm thấy sản phẩm!");
    return;
  }

  const quantity = Number(document.getElementById("productQty").value) || 1;
  let options = "";
  const selectedCapacity = document.querySelector("#capacityVariants .variant-option.selected");
  const selectedColor = document.querySelector("#colorVariants .variant-option.selected");
  options = [
    selectedCapacity ? selectedCapacity.textContent : "",
    selectedColor ? selectedColor.textContent : "",
  ].filter(Boolean).join(", ");

  try {
    const res = await authFetch(
      "http://localhost/webproject/tech-store-web/back-end/php/api/add-to-cart",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: quantity,
          options: options,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      // Get product image for animation
      const productImage = document.getElementById("mainProductImage").src;

      // Get positions for animation
      const addToCartBtn = document.getElementById("addToCartBtn");
      const cartIcon = document.querySelector(".cart-icon");

      const startRect = addToCartBtn.getBoundingClientRect();
      const endRect = cartIcon.getBoundingClientRect();

      // Create flying animation
      createFlyingAnimation(productImage, startRect, endRect);

      // Show success message
      showSuccessMessage("Đã thêm vào giỏ hàng!");

      // Update cart badge
      setTimeout(() => {
        updateCartBadge();
      }, 800);

      // Reload cart data
      try {
        const cartRes = await authFetch(
          "http://localhost/webproject/tech-store-web/back-end/php/api/cart",
          {
            headers: { "Authorization": `Bearer ${token}` }
          }
        );
        const cartData = await cartRes.json();
        localStorage.setItem("cart", JSON.stringify(cartData));
      } catch (err) {
        console.error("Lỗi khi cập nhật giỏ hàng:", err);
      }

    } else {
      alert(data.error || "Không thể thêm vào giỏ hàng.");
    }
  } catch (err) {
    alert("Có lỗi khi thêm vào giỏ hàng.");
    console.error(err);
  }
});

// Cart Animation Functions
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const badge = document.getElementById("cartBadge");
  const cartCount = cart.length; // Đếm số loại sản phẩm khác nhau

  if (badge) {
    badge.textContent = cartCount;
    if (cartCount > 0) {
      badge.classList.add("show");
    } else {
      badge.classList.remove("show");
    }
  }
}

updateCartBadge();

function createFlyingAnimation(productImage, startRect, endRect) {
  const flyingItem = document.createElement("div");
  flyingItem.className = "flying-item";
  flyingItem.innerHTML = `<img src="${productImage}" alt="Product">`;

  // Set initial position
  flyingItem.style.left = startRect.left + "px";
  flyingItem.style.top = startRect.top + "px";

  document.body.appendChild(flyingItem);

  // Trigger animation
  setTimeout(() => {
    flyingItem.style.left = endRect.left + "px";
    flyingItem.style.top = endRect.top + "px";
    flyingItem.style.transform = "scale(0.3)";
    flyingItem.style.opacity = "0";
  }, 50);

  // Remove element after animation
  setTimeout(() => {
    document.body.removeChild(flyingItem);
  }, 800);
}

function showSuccessMessage(message) {
  const successDiv = document.createElement("div");
  successDiv.className = "cart-success";
  successDiv.textContent = message;
  document.body.appendChild(successDiv);

  setTimeout(() => successDiv.classList.add("show"), 100);

  setTimeout(() => {
    successDiv.classList.remove("show");
    setTimeout(() => document.body.removeChild(successDiv), 300);
  }, 2000);
}

// Update cart badge on page load
updateCartBadge();
function setupHelpfulButtons() {
  document.querySelectorAll(".review-item").forEach((reviewItem) => {
    const reviewId = reviewItem.getAttribute("data-review-id");
    const helpfulBtn = reviewItem.querySelector(".helpful-btn");
    const notHelpfulBtn = reviewItem.querySelector(".not-helpful-btn");

    helpfulBtn?.addEventListener("click", () =>
      handleHelpfulClick(reviewId, true, helpfulBtn)
    );
    notHelpfulBtn?.addEventListener("click", () =>
      handleHelpfulClick(reviewId, false, notHelpfulBtn)
    );
  });
}

function handleHelpfulClick(reviewId, isHelpful, button) {
  const storageKey = `review-feedback-${reviewId}`;
  const alreadyVoted = localStorage.getItem(storageKey);

  if (alreadyVoted) {
    alert("Bạn đã đánh giá nhận xét này rồi!");
    return;
  }

  // Tăng số lượng
  const countSpan = button.querySelector("span") || button;
  let count = parseInt(countSpan.textContent.match(/\d+/)?.[0] || 0);
  count++;
  button.textContent = button.textContent.replace(/\d+/, count);
  button.classList.add("active");

  // Ghi nhớ là đã vote
  localStorage.setItem(storageKey, isHelpful ? "helpful" : "not-helpful");
}
