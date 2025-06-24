document.addEventListener("DOMContentLoaded", function () {
    const favoriteBtn = document.getElementById('favoriteBtn');
    const heartPath = document.getElementById('heartPath');
  
    // Lấy productId từ URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    if (!productId) {
      console.error("Không tìm thấy productId trong URL!");
      return;
    }
  
    let isFavorite = false;
  
    // Kiểm tra xem sản phẩm có đang được yêu thích không
    fetch(`http://localhost/webproject/tech-store-web/back-end/php/api/is_favorite.php?product_id=${productId}`)
      .then(res => res.json())
      .then(data => {
        isFavorite = !!data.is_favorite;
        updateHeartIcon();
      })
      .catch(err => {
        console.error("Lỗi khi kiểm tra sản phẩm yêu thích:", err);
      });
  
    // Sự kiện click để thêm/xoá yêu thích
    favoriteBtn?.addEventListener("click", () => {
      const url = isFavorite
        ? "http://localhost:8080/webproject/tech-store-web/back-end/php/api/remove_favorite"
        : "http://localhost:8080/webproject/tech-store-web/back-end/php/api/add_favorite";
  
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            isFavorite = !isFavorite;
            updateHeartIcon();
          } else {
            alert("Không thể cập nhật yêu thích!");
          }
        })
        .catch(err => {
          console.error("Lỗi khi gửi yêu cầu yêu thích:", err);
        });
    });
  
    // Hàm cập nhật icon trái tim
    function updateHeartIcon() {
      if (isFavorite) {
        heartPath.setAttribute("fill", "#ff4d4f");
        heartPath.setAttribute("stroke", "#ff4d4f");
      } else {
        heartPath.setAttribute("fill", "none");
        heartPath.setAttribute("stroke", "#ccc");
      }
    }
  });
  