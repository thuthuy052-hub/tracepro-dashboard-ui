/* CRM Leads Page Renderer */

window.RenderLeads = async (container) => {
    try {
        const response = await window.TP_API.get('/leads');
        const leadsData = response.data || [];
        
        container.innerHTML = `
            <div class="history-controls card glass mb-4">
                <div class="row">
                    <div class="col">
                        <label>Tìm kiếm Khách hàng</label>
                        <input type="text" id="leadsSearch" placeholder="Tên công ty, SĐT, Mã số thuế...">
                    </div>
                    <div class="col">
                        <label>Nguồn Data</label>
                        <select id="sourceFilter">
                            <option value="all">Tất cả nguồn</option>
                            <option value="AI_Bot_Weekly">Từ Web/AI Crawler</option>
                            <option value="Manual">Nhập tay</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Thời gian Lấy</th>
                                <th>Tên Khách Hàng (Nông sản/Thực phẩm)</th>
                                <th>Mã số thuế</th>
                                <th>Số điện thoại</th>
                                <th style="max-width: 200px">Ngành Phát Hiện</th>
                                <th>Công cụ</th>
                            </tr>
                        </thead>
                        <tbody id="leadsBody"></tbody>
                    </table>
                </div>
            </div>
        `;

        const renderRows = (filterSearch = '', filterSource = 'all') => {
            const body = document.getElementById('leadsBody');
            
            const filtered = leadsData.filter(item => {
                const matchesSource = filterSource === 'all' || item.source === filterSource;
                const searchLower = filterSearch.toLowerCase();
                const matchesSearch = 
                    (item.companyName && item.companyName.toLowerCase().includes(searchLower)) || 
                    (item.taxCode && item.taxCode.toLowerCase().includes(searchLower)) ||
                    (item.phone && item.phone.toLowerCase().includes(searchLower));
                    
                return matchesSource && matchesSearch;
            });

            if (filtered.length === 0) {
                body.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">Không tìm thấy dữ liệu phù hợp.</td></tr>`;
                return;
            }

            body.innerHTML = filtered.map(item => `
                <tr>
                    <td>${new Date(item.created_at).toLocaleString('vi-VN')}</td>
                    <td><strong>${item.companyName}</strong></td>
                    <td><code>${item.taxCode || '--'}</code></td>
                    <td><a href="tel:${item.phone}" style="color: var(--accent-primary); font-weight: bold;">${item.phone || '--'}</a></td>
                    <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${item.industry}">${item.industry || '--'}</td>
                    <td>
                        <button class="btn btn-primary" onclick="alert('Bắt đầu quy trình gọi điện (Tích hợp VOIP sau này) cho: ${item.companyName}')">Gọi ngay</button>
                    </td>
                </tr>
            `).join('');
        };

        const searchInput = document.getElementById('leadsSearch');
        const sourceSelect = document.getElementById('sourceFilter');

        searchInput.oninput = (e) => renderRows(e.target.value, sourceSelect.value);
        sourceSelect.onchange = (e) => renderRows(searchInput.value, e.target.value);

        // Render first time
        renderRows();

    } catch (err) {
        container.innerHTML = `<div class="error-msg">⚠️ Lỗi tải dữ liệu Khách hàng: ${err.message}</div>`;
    }
};

// CSS for CRM Leads page (Reusing history styles structure and adding specifics)
const leadsStyles = document.createElement('style');
leadsStyles.textContent = `
    .btn.btn-primary { background: var(--accent-primary, #00C853); color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.85rem;}
    .btn.btn-primary:hover { opacity: 0.9; }
`;
document.head.appendChild(leadsStyles);
