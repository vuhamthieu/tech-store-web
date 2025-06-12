document.addEventListener("DOMContentLoaded", async function () {
  // Thumbnail click event
  const mainImage = document.getElementById("mainProductImage");
  const galleryContainer = document.getElementById("thumbnailGallery");
  const productTitle = document.getElementById("productTitle");
  const descriptionContent = document.querySelector(
    "#description .description-content"
  );
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
    const { product, gallery } = data;

    // Hiển thị tên sản phẩm
    if (productTitle) productTitle.textContent = product?.Title || "Không tên";

    // Hiển thị giá
    const currentPrice = document.getElementById("currentPrice");
    const oldPrice = document.getElementById("oldPrice");
    if (currentPrice)
      currentPrice.textContent = product?.CurrentPrice
        ? Number(product.CurrentPrice).toLocaleString("vi-VN") + "₫"
        : "0₫";
    if (oldPrice)
      oldPrice.textContent =
        product?.OldPrice && product.OldPrice > product.CurrentPrice
          ? Number(product.OldPrice).toLocaleString("vi-VN") + "₫"
          : "";

    // Hiển thị số lượng đã bán và tồn kho
    const soldCount = document.getElementById("soldCount");
    const stockInfo = document.getElementById("stockInfo");
    if (soldCount) soldCount.textContent = product?.SoldCount || 0;
    if (stockInfo) stockInfo.textContent = product?.Stock || 0;

    // Hiển thị rating và số lượng đánh giá
    const productStars = document.getElementById("productStars");
    const ratingCount = document.getElementById("ratingCount");
    if (productStars) {
      const rating = Math.round(product?.Rating || 0);
      productStars.innerHTML =
        "★★★★★".slice(0, rating) + "☆☆☆☆☆".slice(0, 5 - rating);
    }
    if (ratingCount)
      ratingCount.textContent = (product?.RatingCount || 0) + " đánh giá";

    // Hiển thị ảnh chính
    if (gallery && gallery.length > 0 && mainImage) {
      mainImage.src = gallery[0].Thumbnail;
    } else if (mainImage) {
      mainImage.src = "https://via.placeholder.com/400x400?text=No+Image";
    }

    // Render gallery ảnh
    if (galleryContainer) {
      if (gallery && gallery.length > 0) {
        galleryContainer.innerHTML = (gallery || [])
          .map(
            (img, index) => `
                    <div class="thumbnail${index === 0 ? " active" : ""}">
                        <img src="${img.Thumbnail}" data-large="${
              img.Thumbnail
            }" alt="Ảnh ${index + 1}">
                    </div>
                `
          )
          .join("");
        // Xử lý click vào ảnh trong gallery
        galleryContainer.addEventListener("click", (e) => {
          const img = e.target.closest("img");
          if (img && mainImage) {
            mainImage.src = img.dataset.large;
            galleryContainer
              .querySelectorAll(".thumbnail")
              .forEach((th) => th.classList.remove("active"));
            img.parentElement.classList.add("active");
          }
        });
      } else {
        galleryContainer.innerHTML = "<div>Không có ảnh sản phẩm</div>";
      }
    }

    // Hiển thị mô tả sản phẩm
    if (descriptionContent) {
      descriptionContent.innerHTML = `
                <h2 class="section-title">${product?.Title || ""}</h2>
                <div class="detailed-description">${
                  product?.Description || "Không có mô tả."
                }</div>
            `;
    }

    // Render thông số kỹ thuật
    const specsTable = document.querySelector("#specs .specs-table");
    if (
      specsTable &&
      Array.isArray(data.productSpecifications) &&
      data.productSpecifications.length > 0
    ) {
      specsTable.innerHTML = data.productSpecifications
        .map(
          (spec) => `
                <div class="spec-row"><span class="spec-key">${spec.SpecKey}</span>: <span class="spec-value">${spec.SpecValue}</span></div>
            `
        )
        .join("");
    } else if (specsTable) {
      specsTable.innerHTML = "<div>Không có thông số kỹ thuật.</div>";
    }

    // Render variant (nếu có)
    const capacityVariants = document.getElementById("capacityVariants");
    const capacitySection = document.getElementById("capacityVariantsSection");
    const colorVariants = document.getElementById("colorVariants");
    const colorSection = document.getElementById("colorVariantsSection");
    if (Array.isArray(data.variants) && data.variants.length > 0) {
      // Giả sử có các trường Capacity, Color trong mỗi variant
      const capacities = [
        ...new Set(data.variants.map((v) => v.Capacity).filter(Boolean)),
      ];
      const colors = [
        ...new Set(data.variants.map((v) => v.Color).filter(Boolean)),
      ];
      if (capacities.length > 0 && capacityVariants) {
        capacityVariants.innerHTML = capacities
          .map(
            (v, idx) => `
                    <div class="variant-option${
                      idx === 0 ? " selected" : ""
                    }" data-value="${v}">${v}</div>
                `
          )
          .join("");
        capacitySection.style.display = "";
      } else if (capacitySection) {
        capacitySection.style.display = "none";
      }
      if (colors.length > 0 && colorVariants) {
        colorVariants.innerHTML = colors
          .map(
            (v, idx) => `
                    <div class="variant-option${
                      idx === 0 ? " selected" : ""
                    }" data-value="${v}">${v}</div>
                `
          )
          .join("");
        colorSection.style.display = "";
      } else if (colorSection) {
        colorSection.style.display = "none";
      }
    } else {
      if (capacitySection) capacitySection.style.display = "none";
      if (colorSection) colorSection.style.display = "none";
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
    alert("Không thể tải dữ liệu sản phẩm.");
  }

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
  });
});

