/* Sync History Page Renderer */

window.RenderHistory = async (container) => {
    try {
        const historyData = await window.TP_API.get('/history');
        
        container.innerHTML = `
            <div class="history-controls card glass mb-4">
                <div class="row">
                    <div class="col">
                        <label>Tìm kiếm</label>
                        <input type="text" id="historySearch" placeholder="Mã lô, tên sản phẩm...">
                    </div>
                    <div class="col">
                        <label>Trạng thái</label>
                        <select id="statusFilter">
                            <option value="all">Tất cả trạng thái</option>
                            <option value="success">Thành công</option>
                            <option value="error">Lỗi</option>
                        </select>
                    </div>
                    <!-- ... other filters ... -->
                </div>
            </div>

            <div class="card">
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Thời gian</th>
                                <th>Mã lô</th>
                                <th>Sản phẩm</th>
                                <th>GTIN</th>
                                <th>Trạng thái</th>
                                <th>Trace ID</th>
                            </tr>
                        </thead>
                        <tbody id="historyBody"></tbody>
                    </table>
                </div>
            </div>
        `;

        const renderRows = (filter = 'all', search = '') => {
            const body = document.getElementById('historyBody');
            const filtered = historyData.filter(item => {
                const matchesFilter = filter === 'all' || item.status === filter;
                const matchesSearch = item.tenSanPham.toLowerCase().includes(search.toLowerCase()) || 
                                    item.soLoMe.toLowerCase().includes(search.toLowerCase());
                return matchesFilter && matchesSearch;
            });

            body.innerHTML = filtered.map(item => `
                <tr>
                    <td>${new Date(item.timestamp).toLocaleString('vi-VN')}</td>
                    <td><code>${item.soLoMe}</code></td>
                    <td><strong>${item.tenSanPham}</strong></td>
                    <td>${item.gtin}</td>
                    <td><span class="status-badge status-${item.status}">${item.status === 'success' ? 'Thành công' : 'Lỗi'}</span></td>
                    <td>${item.traceId || '--'}</td>
                </tr>
            `).join('');
        };

        const searchInput = document.getElementById('historySearch');
        const statusSelect = document.getElementById('statusFilter');

        searchInput.oninput = (e) => renderRows(statusSelect.value, e.target.value);
        statusSelect.onchange = (e) => renderRows(e.target.value, searchInput.value);

        renderRows();

    } catch (err) {
        container.innerHTML = `<div class="error-msg">⚠️ Lỗi tải lịch sử: ${err.message}</div>`;
    }
};

// CSS for History page
const historyStyles = document.createElement('style');
historyStyles.textContent = `
    .history-controls .row { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1.5rem; }
    .history-controls label { display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; }
    .pagination { display: flex; align-items: center; justify-content: center; gap: 1rem; }
    .page-numbers { display: flex; gap: 0.5rem; }
    .page-numbers span { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 4px; cursor: pointer; border: 1px solid var(--border-subtle); }
    .page-numbers span.active { background: var(--accent-primary); color: white; border-color: var(--accent-primary); }
    .icon-btn.small { padding: 4px; }
`;
document.head.appendChild(historyStyles);
