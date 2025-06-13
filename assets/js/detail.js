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
  addToCartBtn?.addEventListener("click", function () {
    alert("Sản phẩm đã được thêm vào giỏ hàng!");
  });

  // Buy now button
  const buyNowBtn = document.querySelector(".buy-now");
  buyNowBtn?.addEventListener("click", function () {
    alert("Chuyển đến trang thanh toán!");
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
  reviewForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Cảm ơn bạn đã đánh giá sản phẩm!");
    this.reset();
    stars.forEach((star) => star.classList.remove("active"));
    ratingInput.value = "0";

    const uploadPreview = document.querySelector(".upload-preview");
    uploadPreview.innerHTML = `
      <div class="upload-placeholder">
        <i class="fas fa-camera"></i>
        <span>Thêm ảnh</span>
      </div>
    `;
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
<<<<<<< HEAD

    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Detail product fetch
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (!productId) {
        alert("Không tìm thấy ID sản phẩm!");
        return;
    }

    try {
        const res = await fetch(`http://localhost/webproject/tech-store-web/back-end/php/api/product_detail.php?id=${productId}`);
        const data = await res.json();

        const { product, productSpecifications, variants, gallery } = data;

        if (gallery.length > 0) {
            mainImage.src = gallery[0].ImageURL;
        }

        const galleryContainer = document.querySelector(".thumbnail-gallery");
        galleryContainer.innerHTML = "";
        gallery.forEach((imgObj, index) => {
            const thumbnailDiv = document.createElement("div");
            thumbnailDiv.className = "thumbnail" + (index === 0 ? " active" : "");
            thumbnailDiv.innerHTML = `<img src="${imgObj.ImageURL}" data-large="${imgObj.ImageURL}" alt="Ảnh ${index + 1}">`;
            galleryContainer.appendChild(thumbnailDiv);
        });

        galleryContainer.addEventListener("click", (e) => {
            const img = e.target.closest("img");
            if (img) {
                mainImage.src = img.dataset.large;
                galleryContainer.querySelectorAll(".thumbnail").forEach(th => th.classList.remove("active"));
                img.parentElement.classList.add("active");
            }
        });

        document.querySelector(".product-title").textContent = product.Name || "Không tên";
        document.querySelector(".current-price").textContent = `${parseInt(product.Price).toLocaleString()}₫`;
        document.querySelector(".old-price").textContent = `${parseInt(product.OldPrice).toLocaleString()}₫`;
        document.querySelector(".sold-count span").textContent = product.Sold || 0;
        document.querySelector(".stock-info").textContent = `Còn ${product.Stock || 0} sản phẩm`;

        const capacityContainer = document.querySelectorAll(".variant-section")[0]?.querySelector(".variant-options");
        const colorContainer = document.querySelectorAll(".variant-section")[1]?.querySelector(".variant-options");

        if (capacityContainer && variants.length > 0) {
            const capacities = [...new Set(variants.map(v => v.Capacity))];
            capacityContainer.innerHTML = "";
            capacities.forEach(cap => {
                const div = document.createElement("div");
                div.className = "variant-option";
                div.textContent = cap;
                capacityContainer.appendChild(div);
            });
        }

        if (colorContainer && variants.length > 0) {
            const colors = [...new Set(variants.map(v => v.Color))];
            colorContainer.innerHTML = "";
            colors.forEach(color => {
                const div = document.createElement("div");
                div.className = "variant-option";
                div.textContent = color;
                colorContainer.appendChild(div);
            });
        }

        document.querySelector("#description .description-content").innerHTML = `
            <h2 class="section-title">${product.Name}</h2>
            <div class="detailed-description">${product.Description || "Không có mô tả."}</div>
        `;

        const specsContainer = document.querySelector("#specs .specs-table");
        specsContainer.innerHTML = "";
        productSpecifications.forEach(spec => {
            const row = document.createElement("div");
            row.className = "spec-row";
            row.innerHTML = `
                <div class="spec-name">${spec.SpecKey}</div>
                <div class="spec-value">${spec.SpecValue}</div>`;
            specsContainer.appendChild(row);
        });

    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        alert("Không thể tải dữ liệu sản phẩm.");
    }
    //Reviewer
    const reviewContainer = document.querySelector(".product-reviews-container");
  

  const reviewsList = document.getElementById("reviewsList");
  const avgRatingEl = document.getElementById("avg-rating");
  const totalReviewsEl = document.getElementById("total-reviews");
  const ratingBreakdownEl = document.getElementById("rating-breakdown");

  const starsInput = document.querySelectorAll("#ratingStars .star");
  const reviewRatingInput = document.getElementById("reviewRating");
  const reviewContentInput = document.getElementById("reviewContent");
 

  let currentRating = 0;

  // Gán sự kiện chọn sao
  starsInput.forEach(star => {
    star.addEventListener("click", () => {
      currentRating = parseInt(star.dataset.value);
      reviewRatingInput.value = currentRating;
      updateStarDisplay(currentRating);
    });
=======
>>>>>>> 0265ed639caca64714e9da7c94a9701262b82c95
  });

  // Fetch product details
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    alert("Không tìm thấy ID sản phẩm!");
    return;
  }

  try {
    const res = await fetch(
      `http://localhost/webproject/tech-store-web/back-end/php/api/product_details.php?productId=${productId}`
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
        thumbnailDiv.innerHTML = `<img src="${imgObj.Thumbnail}" data-large="${imgObj.Thumbnail}" alt="Ảnh ${index + 1}">`;
        galleryContainer.appendChild(thumbnailDiv);
      });
    }

    // Update product info
    document.getElementById("productTitle").textContent = product.Title || "Không tên";
    document.getElementById("currentPrice").textContent = 
      Number(product.Price).toLocaleString("vi-VN") + "₫";
    document.getElementById("oldPrice").textContent = product.OldPrice
      ? Number(product.OldPrice).toLocaleString("vi-VN") + "₫"
      : "";
    document.getElementById("soldCount").textContent = product.SoldCount || 0;
    document.getElementById("stockInfo").textContent = product.Stock || 0;

    // Update variants
    const capacityContainer = document.querySelector("#capacityVariants");
    const colorContainer = document.querySelector("#colorVariants");

    if (capacityContainer && variants.length > 0) {
      const capacities = [...new Set(variants.map((v) => v.Capacity))];
      capacityContainer.innerHTML = "";
      capacities.forEach((cap) => {
        const div = document.createElement("div");
        div.className = "variant-option";
        div.textContent = cap;
        capacityContainer.appendChild(div);
      });
    }

    if (colorContainer && variants.length > 0) {
      const colors = [...new Set(variants.map((v) => v.Color))];
      colorContainer.innerHTML = "";
      colors.forEach((color) => {
        const div = document.createElement("div");
        div.className = "variant-option";
        div.textContent = color;
        colorContainer.appendChild(div);
      });
    }

    // Update description
    document.querySelector("#description .description-content").innerHTML = `
      <h2 class="section-title">${product.Title}</h2>
      <div class="detailed-description">${product.Description || "Không có mô tả."}</div>
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

  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
    alert("Không thể tải dữ liệu sản phẩm.");
  }
});

async function loadReviews(productId) {
  try {
    const res = await fetch(
      `http://localhost/webproject/tech-store-web/back-end/php/api/reviews/get_reviews.php?productId=${productId}`
    );
    const reviews = await res.json();

    const reviewsList = document.querySelector(".reviews-list");
    
    if (!reviews || reviews.length === 0) {
      reviewsList.innerHTML = "<p>Chưa có đánh giá nào cho sản phẩm này.</p>";
      return;
    }

    // Clear existing reviews except the header
    const header = reviewsList.querySelector(".reviews-header");
    reviewsList.innerHTML = "";
    if (header) reviewsList.appendChild(header);

    // Add each review
    reviews.forEach(review => {
      const reviewItem = document.createElement("div");
      reviewItem.className = "review-item";
      reviewItem.innerHTML = `
        <div class="reviewer-info">
          <div class="reviewer-avatar">
            <img src="${review.Avatar || 'https://via.placeholder.com/50x50'}" alt="${review.FullName}">
          </div>
          <div class="reviewer-details">
            <div class="reviewer-name">${review.FullName}</div>
            <div class="review-date">${new Date(review.CreatedAt).toLocaleDateString('vi-VN')}</div>
          </div>
        </div>
        <div class="review-content">
          <div class="review-rating">
            <div class="stars">${'★'.repeat(review.Rating)}${'☆'.repeat(5 - review.Rating)}</div>
            <div class="review-title">${review.Title || ''}</div>
          </div>
          <div class="review-text">
            <p>${review.Comment}</p>
          </div>
          ${review.Images ? `
          <div class="review-images">
            ${review.Images.map(img => `
              <div class="review-image">
                <img src="${img}" alt="Hình ảnh đánh giá">
              </div>
            `).join('')}
          </div>` : ''}
          <div class="review-helpful">
            <span class="helpful-text">Đánh giá này có hữu ích không?</span>
            <button class="helpful-btn">Có (${review.HelpfulCount || 0})</button>
            <button class="not-helpful-btn">Không (${review.NotHelpfulCount || 0})</button>
          </div>
        </div>
      `;
      reviewsList.appendChild(reviewItem);
    });

    // Add load more button
    const loadMoreDiv = document.createElement("div");
    loadMoreDiv.className = "load-more-reviews";
    loadMoreDiv.innerHTML = `
      <button class="load-more-btn">Xem Thêm Đánh Giá</button>
    `;
    reviewsList.appendChild(loadMoreDiv);

  } catch (error) {
    console.error("Lỗi khi tải đánh giá:", error);
    document.querySelector(".reviews-list").innerHTML = "<p>Không thể tải đánh giá.</p>";
  }
<<<<<<< HEAD

  function displaySummary(reviews) {
    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + parseInt(r.Rating), 0);
    const avg = total > 0 ? (sum / total).toFixed(1) : 0;

    avgRatingEl.textContent = avg;
    totalReviewsEl.textContent = total;

    const counts = [0, 0, 0, 0, 0, 0]; // index 1–5
    reviews.forEach(r => counts[r.Rating]++);

    ratingBreakdownEl.innerHTML = "";
    for (let i = 5; i >= 1; i--) {
      const percent = total > 0 ? (counts[i] / total * 100).toFixed(1) : 0;
      const bar = `
        <div class="rating-bar">
          <span class="rating-label">${i} sao</span>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${percent}%"></div>
          </div>
          <span class="rating-count">${counts[i]}</span>
        </div>
      `;
      ratingBreakdownEl.innerHTML += bar;
    }
  }

  function renderStars(count) {
    return "★".repeat(count) + "☆".repeat(5 - count);
  }

  function formatDate(datetime) {
    const date = new Date(datetime);
    return date.toLocaleDateString("vi-VN");
  }

  // Gửi đánh giá mới
  reviewForm.addEventListener("submit", e => {
    e.preventDefault();

    const rating = parseInt(reviewRatingInput.value);
    const comment = reviewContentInput.value.trim();
    const userId = 1; // TODO: thay bằng ID người dùng thực (lấy từ session nếu cần)

    if (!rating || !comment) {
      alert("Vui lòng chọn sao và nhập nội dung.");
      return;
    }

    fetch("http://localhost/webproject/tech-store-web/back-end/php/api/reviews/add_review.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ productId, userId, rating, comment })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Đánh giá đã được gửi.");
          reviewForm.reset();
          reviewRatingInput.value = 0;
          updateStarDisplay(0);
          loadReviews(); // Tải lại danh sách đánh giá
        } else {
          alert(data.error || "Có lỗi xảy ra.");
        }
      })
      .catch(err => {
        console.error("Lỗi khi gửi đánh giá:", err);
        alert("Không thể gửi đánh giá.");
      });
  });

  // Khởi chạy
  loadReviews();
  });
=======
}
>>>>>>> 0265ed639caca64714e9da7c94a9701262b82c95
