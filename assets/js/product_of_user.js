document.addEventListener('DOMContentLoaded', function() {
    // Xử lý filter đơn hàng
    const searchBtn = document.getElementById('searchOrders');
    const timeFilter = document.getElementById('timeFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    searchBtn.addEventListener('click', function() {
        const timeValue = timeFilter.value;
        const statusValue = statusFilter.value;
        
        // Gọi API hoặc filter dữ liệu
        filterOrders(timeValue, statusValue);
    });
    
    function filterOrders(time, status) {
        console.log(`Filtering orders - Time: ${time}, Status: ${status}`);
        // Thực tế sẽ gọi API hoặc filter dữ liệu local
        // Hiển thị loading...
        
        // Giả lập API call
        setTimeout(() => {
            // Cập nhật UI dựa trên kết quả
            // document.getElementById('ordersList').innerHTML = ...;
        }, 500);
    }
    
    // Xử lý phân trang
    const paginationButtons = document.querySelectorAll('.pagination button');
    paginationButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.disabled) return;
            
            // Xử lý chuyển trang
            console.log('Changing page...');
        });
    });
    
    // Xử lý nút đăng xuất
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Xử lý đăng xuất
            console.log('Logging out...');
            window.location.href = '../login.html';
        });
    }
    
    // Load dữ liệu ban đầu
    loadInitialOrders();
    
    function loadInitialOrders() {
        // Gọi API để lấy danh sách đơn hàng
        // Hiển thị loading...
        
        // Giả lập dữ liệu
        setTimeout(() => {
            // document.getElementById('ordersList').innerHTML = ...;
        }, 300);
    }
});