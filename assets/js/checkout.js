// Select Shipping Method
const shippingOptions = document.querySelectorAll('.shipping-option');
shippingOptions.forEach(option => {
    option.addEventListener('click', () => {
        shippingOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
    });
});

// Select Payment Method
const paymentOptions = document.querySelectorAll('.payment-option');
paymentOptions.forEach(option => {
    option.addEventListener('click', () => {
        paymentOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
    });
});

// Apply Voucher
const voucherBtn = document.querySelector('.voucher-input button');
voucherBtn.addEventListener('click', () => {
    const voucherInput = document.querySelector('.voucher-input input');
    if (voucherInput.value.trim() === '') {
        alert('Vui lòng nhập mã giảm giá');
    } else {
        alert(`Áp dụng mã: ${voucherInput.value}`);
        // In a real app, validate and apply discount
    }
});

// Checkout Button with Loading Animation
const checkoutBtn = document.getElementById('checkoutBtn');
const btnText = document.getElementById('btnText');
const loadingSpinner = document.getElementById('loadingSpinner');
const successModal = document.getElementById('successModal');
const closeModal = document.getElementById('closeModal');

checkoutBtn.addEventListener('click', () => {
    // Show loading spinner
    btnText.style.display = 'none';
    loadingSpinner.style.display = 'block';

    // Simulate API call (2 seconds delay)
    setTimeout(() => {
        // Hide spinner, show success modal
        loadingSpinner.style.display = 'none';
        btnText.style.display = 'inline';
        successModal.style.display = 'flex';
    }, 2000);
});

// Close Modal
closeModal.addEventListener('click', () => {
    successModal.style.display = 'none';
    // Redirect to home or order detail page in real app
    // window.location.href = "/";
});