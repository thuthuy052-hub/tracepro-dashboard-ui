/* Main App Controller for TracePro Dashboard */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Auth Check
    const token = localStorage.getItem('tp_auth_token');
    // Auto-detect environment: Local or Cloud (Render)
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_URL = isLocal ? 'http://localhost:3000/api' : 'https://tracepro-backend-api.onrender.com/api';

    if (!token && !window.location.href.includes('index.html')) {
        window.location.href = 'index.html';
        return;
    }

    // Header helper
    const getHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });

    // 2. Initialize User Info
    const initUserInfo = () => {
        const userStr = localStorage.getItem('tp_user');
        if (userStr) {
            const user = JSON.parse(userStr);
            document.getElementById('sidebarUserName').innerText = user.name;
            document.getElementById('sidebarWorkspace').innerText = user.company;
            document.getElementById('sidebarAvatar').innerText = user.name.charAt(0);
        }
    };

    // 3. Routing Logic
    const contentArea = document.getElementById('contentArea');
    const pageTitle = document.getElementById('pageTitle');
    const navLinks = document.querySelectorAll('.nav-link');

    const routes = {
        'overview': { title: 'Bảng điều khiển', render: window.RenderDashboard },
        'history': { title: 'Lịch sử đồng bộ', render: window.RenderHistory },
        'qrcode': { title: 'Quản lý QR Code', render: window.RenderQRCode },
        'leads': { title: 'Khách Hàng (CRM)', render: window.RenderLeads },
        'wizard': { title: 'Setup Wizard', render: window.RenderWizard },
        'settings': { title: 'Cấu hình API', render: () => contentArea.innerHTML = '<h2>Settings Page Coming Soon</h2>' }
    };

    const navigateTo = (pageId) => {
        const route = routes[pageId] || routes['overview'];
        
        // Update Title
        pageTitle.innerText = route.title;
        document.title = `${route.title} | TracePro VN`;

        // Update UI state
        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageId);
        });

        // Render Content
        contentArea.innerHTML = '<div class="loader-wrapper"><div class="loader"></div></div>';
        
        setTimeout(() => {
            if (typeof route.render === 'function') {
                route.render(contentArea);
            } else {
                contentArea.innerHTML = `<h2>View for ${pageId} not implemented yet.</h2>`;
            }
        }, 300);
    };

    // Handle Nav Clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.dataset.page;
            window.location.hash = pageId;
            navigateTo(pageId);
        });
    });

    // Handle Hash Change (Back/Forward)
    window.addEventListener('hashchange', () => {
        const pageId = window.location.hash.replace('#', '') || 'overview';
        navigateTo(pageId);
    });

    // 4. Notification Panel logic
    const notifyBtn = document.getElementById('notifyBtn');
    const notificationPanel = document.getElementById('notificationPanel');
    
    if (notifyBtn) {
        notifyBtn.addEventListener('click', () => {
            notificationPanel.classList.toggle('active');
            renderNotifications();
        });
    }

    const renderNotifications = () => {
        const list = document.getElementById('notificationList');
        const items = window.MockData.notifications;
        list.innerHTML = items.map(n => `
            <div class="notify-item ${n.type}">
                <div class="notify-icon">${n.type === 'success' ? '✓' : n.type === 'error' ? '!' : 'i'}</div>
                <div class="notify-body">
                    <h4>${n.title}</h4>
                    <p>${n.message}</p>
                    <small>${n.time}</small>
                </div>
            </div>
        `).join('');
    };

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (notificationPanel.classList.contains('active') && 
            !notificationPanel.contains(e.target) && 
            !notifyBtn.contains(e.target)) {
            notificationPanel.classList.remove('active');
        }
    });

    // 5. Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('tp_auth_token');
            localStorage.removeItem('tp_user');
            window.location.href = 'index.html';
        });
    }

    // Utility for global access to API
    window.TP_API = {
        get: async (endpoint) => {
            const res = await fetch(`${API_URL}${endpoint}`, { headers: getHeaders() });
            return res.json();
        },
        post: async (endpoint, data) => {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });
            return res.json();
        }
    };

    // Initial Load
    initUserInfo();
    const initialPage = window.location.hash.replace('#', '') || 'overview';
    navigateTo(initialPage);
});
