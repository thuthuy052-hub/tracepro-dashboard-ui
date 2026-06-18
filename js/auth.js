/* Auth logic for TracePro Dashboard */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const toggleRegister = document.getElementById('toggleRegister');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            
            // Basic UI feedback
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Đang xác thực...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            
            // Call real API
            fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('tp_auth_token', data.token);
                    localStorage.setItem('tp_user', JSON.stringify(data.user));
                    window.location.href = 'dashboard.html';
                } else {
                    alert(data.message || 'Lỗi đăng nhập');
                    resetBtn();
                }
            })
            .catch(err => {
                console.error(err);
                alert('Không thể kết nối tới Server API (localhost:3000)');
                resetBtn();
            });

            function resetBtn() {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }
        });
    }
    
    if (toggleRegister) {
        toggleRegister.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Tính năng đăng ký đang được bảo trì. Vui lòng dùng tài khoản dùng thử.');
        });
    }
});
