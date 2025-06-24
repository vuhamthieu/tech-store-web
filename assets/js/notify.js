document.addEventListener('DOMContentLoaded', () => {
    const notificationsList = document.getElementById('notificationsList');
    const emptyNotifications = document.getElementById('emptyNotifications');
    const markAllReadBtn = document.getElementById('markAllRead');
    const clearNotificationsBtn = document.getElementById('clearNotifications');

    let notifications = [];

    async function fetchNotifications() {
        try {
            const res = await fetch('http://localhost/webproject/tech-store-web/back-end/php/api/get-notification');
            const data = await res.json();

            if (data.success) {
                notifications = data.data;
                renderNotifications();
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error('Lỗi khi lấy thông báo:', err);
        }
    }

    function renderNotifications() {
        notificationsList.innerHTML = '';
        const hasNotifications = notifications.length > 0;

        if (!hasNotifications) {
            emptyNotifications.style.display = 'block';
            return;
        }

        emptyNotifications.style.display = 'none';

        notifications.forEach(notification => {
            const item = document.createElement('div');
            item.className = `notification-item ${notification.IsRead == 0 ? 'unread' : ''}`;
            item.dataset.id = notification.NotificationID;

            item.innerHTML = `
                <div class="notification-content">
                    <h3 class="notification-title">${notification.Title}</h3>
                    <p class="notification-text">${notification.Content}</p>
                    <span class="notification-date">${notification.CreatedAt}</span>
                </div>
                <button class="btn btn-delete" title="Xóa thông báo">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;

            // Sự kiện đánh dấu đã đọc
            item.querySelector('.notification-content').addEventListener('click', () => {
                if (notification.IsRead == 0) {
                    markAsRead(notification.NotificationID);
                    item.classList.remove('unread');
                    notification.IsRead = 1;
                }
            });

            // Sự kiện xóa thông báo
            item.querySelector('.btn-delete').addEventListener('click', () => {
                deleteNotification(notification.NotificationID);
            });

            notificationsList.appendChild(item);
        });
    }

    async function markAsRead(id) {
        try {
            await fetch('http://localhost/webproject/tech-store-web/back-end/php/api/mark-noti-is-read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notification_id: id })
            });
        } catch (err) {
            console.error('Lỗi khi đánh dấu đã đọc:', err);
        }
    }

    async function deleteNotification(id) {
        try {
            const res = await fetch('http://localhost/webproject/tech-store-web/back-end/php/api/delete-noti', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notification_id: id })
            });

            const data = await res.json();
            if (data.success) {
                notifications = notifications.filter(n => n.NotificationID !== id);
                renderNotifications();
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error('Lỗi khi xóa thông báo:', err);
        }
    }

    markAllReadBtn.addEventListener('click', async () => {
        const unread = notifications.filter(n => n.IsRead == 0);
        await Promise.all(unread.map(n => markAsRead(n.NotificationID)));
        notifications.forEach(n => n.IsRead = 1);
        renderNotifications();
    });

    clearNotificationsBtn.addEventListener('click', async () => {
        await Promise.all(notifications.map(n => deleteNotification(n.NotificationID)));
    });
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
           'Authorization': 'Bearer ' + localStorage.getItem("access_token")
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
     //LOG
     document.addEventListener("DOMContentLoaded", function () {
        const logoutBtn = document.getElementById("logoutBtn");
      
        logoutBtn.addEventListener("click", function (e) {
          e.preventDefault(); // Ngăn chuyển trang ngay lập tức
      
          const token = localStorage.getItem("access_token"); // Lấy access token từ localStorage
      
          if (!token) {
            alert("Bạn chưa đăng nhập!");
            window.location.href = "../pages/login.html"; // Hoặc trang chính
            return;
          }
      
          fetch("http://localhost/webproject/tech-store-web/back-end/php/logout.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            }
          })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              // Xoá token khỏi localStorage
              localStorage.removeItem("access_token");
      
              alert("Đăng xuất thành công!");
              window.location.href = "../pages/login.html"; // Hoặc trang chính
            } else {
              alert("Đăng xuất thất bại: " + data.message);
            }
          })
          .catch(error => {
            console.error("Lỗi đăng xuất:", error);
            alert("Đã xảy ra lỗi trong quá trình đăng xuất.");
          });
        });
      });
      
    fetchNotifications();
});
