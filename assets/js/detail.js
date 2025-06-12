document.addEventListener("DOMContentLoaded", async function () {
    // Thumbnail click event
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainProductImage');

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
    // Helpful buttons
    document.querySelectorAll('.helpful-btn, .not-helpful-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const countSpan = this.querySelector('span') || this;
            let count = parseInt(countSpan.textContent.match(/\d+/)?.[0] || 0);
            count++;
            this.textContent = this.textContent.replace(/\d+/, count);
            this.classList.add('active');
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
//Detail

document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  if (!productId) return alert("Không xác định sản phẩm!");

  try {
    const res = await fetch(
      `http://localhost/webproject/tech-store-web/back-end/php/api/getProduct.php?id=${productId}`
    );
    if (!res.ok) throw new Error("Lỗi khi tải dữ liệu");
    const data = await res.json();

    const { product, productSpecifications, variants, gallery } = data;

    // 1. Hiển thị thông tin cơ bản
    document.querySelector(".product-title").textContent = product.name;
    document.querySelector(".current-price").textContent =
      Number(product.price).toLocaleString("vi-VN") + "₫";
    document.querySelector(".old-price").textContent =
      Number(product.oldPrice).toLocaleString("vi-VN") + "₫";
    document.querySelector(
      ".stock-info"
    ).textContent = `Còn ${product.stock} sản phẩm`;
    document.querySelector(".rating .stars").textContent = "★★★★★".slice(
      0,
      Math.round(product.rating)
    );
    document.querySelector(".rating .rating-count").textContent = `${Number(
      product.ratingCount
    ).toLocaleString("vi-VN")} đánh giá`;
    document.querySelector(".sold-count span").textContent = `${(
      product.sold / 1000
    ).toFixed(1)}k`;

    const mainImage = document.getElementById("mainProductImage");
    const galleryContainer = document.querySelector(".thumbnail-gallery");

    function renderGallery(images) {
      galleryContainer.innerHTML = "";
      images.forEach((url, idx) => {
        const thumb = document.createElement("div");
        thumb.className = "thumbnail" + (idx === 0 ? " active" : "");
        thumb.innerHTML = `<img src="${url}" data-large="${url}" alt="Ảnh ${
          idx + 1
        }">`;
        galleryContainer.appendChild(thumb);
        thumb.addEventListener("click", () => {
          document
            .querySelectorAll(".thumbnail")
            .forEach((t) => t.classList.remove("active"));
          thumb.classList.add("active");
          mainImage.src = url;
        });
      });
      if (images.length > 0) mainImage.src = images[0];
    }

    // 2. Render màu sắc
    const colorContainer = document
      .querySelectorAll(".variant-section")[1]
      .querySelector(".variant-options");
    colorContainer.innerHTML = "";
    variants.colors.forEach((color, idx) => {
      const div = document.createElement("div");
      div.className = "variant-option" + (idx === 0 ? " selected" : "");
      div.textContent = color;
      colorContainer.appendChild(div);
      div.addEventListener("click", () => {
        colorContainer
          .querySelectorAll(".variant-option")
          .forEach((c) => c.classList.remove("selected"));
        div.classList.add("selected");
        if (gallery[color]) renderGallery(gallery[color]);
      });
    });

    // 3. Render dung lượng
    const capacityContainer = document
      .querySelectorAll(".variant-section")[0]
      .querySelector(".variant-options");
    capacityContainer.innerHTML = "";
    variants.capacity.forEach((cap, idx) => {
      const div = document.createElement("div");
      div.className = "variant-option" + (idx === 0 ? " selected" : "");
      if (cap === "1TB") div.classList.add("disabled");
      div.textContent = cap;
      capacityContainer.appendChild(div);
      if (!div.classList.contains("disabled")) {
        div.addEventListener("click", () => {
          capacityContainer
            .querySelectorAll(".variant-option")
            .forEach((c) => c.classList.remove("selected"));
          div.classList.add("selected");
        });
      }
    });

    // 4. Khởi tạo ảnh lần đầu theo màu đầu tiên
    const defaultColor = variants.colors[0];
    if (gallery[defaultColor]) renderGallery(gallery[defaultColor]);

    // 5. Xử lý tăng/giảm số lượng
    const qtyInput = document.getElementById("productQty");
    document.getElementById("decreaseQty").addEventListener("click", () => {
      if (+qtyInput.value > 1) qtyInput.value = +qtyInput.value - 1;
    });
    document.getElementById("increaseQty").addEventListener("click", () => {
      if (+qtyInput.value < 10) qtyInput.value = +qtyInput.value + 1;
    });

    // 6. Thêm vào giỏ / Mua ngay (demo alert)
    document.querySelector(".add-to-cart").addEventListener("click", () => {
      alert("Sản phẩm đã được thêm vào giỏ hàng!");
    });
    document.querySelector(".buy-now").addEventListener("click", () => {
      alert("Chuyển đến thanh toán!");
    });

    // 7. (Nếu cần) hiển thị thông số kỹ thuật: productSpecifications
  } catch (err) {
    console.error(err);
    alert("Không thể tải sản phẩm");
  }
});

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
});
