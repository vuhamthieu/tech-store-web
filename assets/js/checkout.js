const modal = document.getElementById('checkout-container');
  const productAPI = 'https://api.example.com/product/123'; // ← thay link API thật

  let product = null;

  async function loadCheckoutData() {
    const res = await fetch(productAPI);
    product = await res.json();

    document.getElementById('checkout-img').src = product.mainImage;
    document.getElementById('checkout-name').textContent = product.name;
    document.getElementById('checkout-price').textContent = product.price.toLocaleString('vi-VN') + '₫';
    document.getElementById('checkout-old-price').textContent = product.oldPrice.toLocaleString('vi-VN') + '₫';
    document.getElementById('checkout-discount').textContent = product.discount;
    document.getElementById('checkout-stock').textContent = product.stock + ' sản phẩm';
    document.getElementById('temp-total').textContent = product.price.toLocaleString('vi-VN') + '₫';

    updateTotal();
  }

  function updateTotal() {
    const shippingFee = parseInt(document.getElementById('shipping').value);
    const voucherCode = document.getElementById('voucher').value.trim();

    let discount = 0;
    if (voucherCode === 'GIAM10') discount = 50000;
    if (voucherCode === 'FREESHIP') discount = shippingFee;

    const total = product.price - discount + shippingFee;
    document.getElementById('discount-amount').textContent = discount.toLocaleString('vi-VN') + '₫';
    document.getElementById('shipping-fee').textContent = shippingFee.toLocaleString('vi-VN') + '₫';
    document.getElementById('final-total').textContent = total.toLocaleString('vi-VN') + '₫';
  }

  document.getElementById('voucher').addEventListener('input', updateTotal);
  document.getElementById('shipping').addEventListener('change', updateTotal);
  document.querySelector('.close').onclick = () => modal.style.display = 'none';

  document.getElementById('placeOrderBtn').onclick = () => {
    alert('Đặt hàng thành công!');
    modal.style.display = 'none';
  };

  loadCheckoutData();