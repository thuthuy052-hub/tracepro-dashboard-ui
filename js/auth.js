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
            
            // DEMO BYPASS: Đăng nhập ngay không cần API
            if (email === "demo" || email === "demo@tracepro.vn") {
                localStorage.setItem('tp_auth_token', 'demo-token-12345');
                localStorage.setItem('tp_user', JSON.stringify({ name: "Demo User", company: "TracePro", tenant_id: "TENANT-DEMO" }));
                window.location.href = 'dashboard.html';
                return;
            }

            // Auto-detect environment
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const API_URL = isLocal ? 'http://localhost:3000/api' : 'https://tracepro-backend-api.onrender.com/api';

            // Call real API
            fetch(`${API_URL}/auth/login`, {
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
                alert('Không thể kết nối tới Server API (' + API_URL + '). Vui lòng kiểm tra Render hoặc chạy Local.');
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
