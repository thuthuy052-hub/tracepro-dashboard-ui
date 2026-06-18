/* Overview Dashboard Renderer */

window.RenderDashboard = async (container) => {
    try {
        const stats = await window.TP_API.get('/dashboard/stats');
        const history = await window.TP_API.get('/history');
        const chartData = [45, 52, 38, 65, 48, 72, 55]; // Chart still mock in this step

        container.innerHTML = `
            <div class="stats-grid">
                <div class="card">
                    <div class="card-title">Tổng số lô đã đồng bộ <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg></div>
                    <div class="card-value">${stats.totalSynced.toLocaleString()}</div>
                    <div class="card-trend trend-up"><span>▲ 12%</span> <small>so với tháng trước</small></div>
                </div>
                <!-- ... other cards ... -->
                <div class="card">
                    <div class="card-title">Đang chờ xử lý</div>
                    <div class="card-value">${stats.pending}</div>
                </div>
                <div class="card">
                    <div class="card-title">Lỗi đồng bộ</div>
                    <div class="card-value text-error">${stats.errors}</div>
                </div>
                <div class="card">
                    <div class="card-title">QR Code đã sinh</div>
                    <div class="card-value">${stats.totalQR.toLocaleString()}</div>
                </div>
            </div>

            <div class="main-grid">
                <div class="col-8">
                    <div class="card">
                        <div class="card-title">Hiệu suất đồng bộ (7 ngày gần nhất)</div>
                        <div class="chart-container" id="syncChart"></div>
                    </div>
                </div>
                <!-- ... -->
                <div class="col-12 mt-4">
                    <div class="card">
                        <div class="card-title">Hoạt động gần đây (Server Data)</div>
                        <div class="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Thời gian</th>
                                        <th>Mã lô</th>
                                        <th>Sản phẩm</th>
                                        <th>Trạng thái</th>
                                        <th>Trace ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${history.map(item => `
                                        <tr>
                                            <td>${new Date(item.timestamp).toLocaleString('vi-VN')}</td>
                                            <td><code>${item.soLoMe}</code></td>
                                            <td><strong>${item.tenSanPham}</strong></td>
                                            <td><span class="status-badge status-${item.status}">${item.status === 'success' ? 'Thành công' : 'Lỗi'}</span></td>
                                            <td>${item.traceId || '--'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Render Chart
        const chart = document.getElementById('syncChart');
        const maxVal = Math.max(...chartData);
        chartData.forEach(val => {
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.height = `${(val/maxVal)*100}%`;
            bar.setAttribute('data-value', val);
            chart.appendChild(bar);
        });

    } catch (err) {
        container.innerHTML = `<div class="error-msg">⚠️ Lỗi tải dữ liệu từ Server: ${err.message}</div>`;
    }
};

// Add CSS for ERP status list
const style = document.createElement('style');
style.textContent = `
    .erp-item { display: flex; align-items: center; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--border-subtle); }
    .erp-icon { width: 40px; height: 40px; background: rgba(255,255,255,0.05); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: var(--accent-primary); }
    .erp-item.active .erp-icon { background: rgba(59, 130, 246, 0.1); }
    .erp-info { display: flex; flex-direction: column; gap: 2px; }
    .erp-info strong { font-size: 0.9rem; }
`;
document.head.appendChild(style);
