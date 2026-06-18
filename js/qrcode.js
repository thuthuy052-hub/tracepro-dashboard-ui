/* QR Code Management Page Renderer */

window.RenderQRCode = async (container) => {
    try {
        const history = await window.TP_API.get('/history');
        // Only show successful syncs that have a traceId
        const qrData = history.filter(h => h.status === 'success' && h.trace_id);

        container.innerHTML = `
            <div class="qr-header-actions mb-4">
                <button class="btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"></path></svg>
                    Xuất File QR (Zip)
                </button>
            </div>
            <div class="qr-grid" id="qrGrid"></div>
            <!-- Modal ... -->
            <div id="qrModal" class="modal">
                <div class="modal-content glass">
                    <div class="modal-header">
                        <h3>Xem trước Mã QR Digital Link</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div id="qrPreviewContent" class="qr-preview-card"></div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-outline" onclick="window.print()">In Mã QR</button>
                    </div>
                </div>
            </div>
        `;

        const qrGrid = document.getElementById('qrGrid');
        qrGrid.innerHTML = qrData.map(qr => `
            <div class="card qr-card">
                <div class="qr-img-wrapper">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://tracepro.vn/tr/${qr.trace_id}" alt="QR">
                    <div class="qr-overlay">
                        <button class="btn-glass view-qr-btn" data-trace="${qr.trace_id}" data-name="${qr.tenSanPham}" data-batch="${qr.soLoMe}" data-exp="${qr.hanSuDung}">Xem chi tiết</button>
                    </div>
                </div>
                <div class="qr-info">
                    <h4>${qr.tenSanPham}</h4>
                    <p>Lô: <code>${qr.soLoMe}</code></p>
                    <p>HSD: <span>${qr.hanSuDung.split(' ')[0]}</span></p>
                </div>
            </div>
        `).join('');

        // Modal logic
        const modal = document.getElementById('qrModal');
        qrGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('view-qr-btn')) {
                const btn = e.target;
                showPreview({
                    traceId: btn.dataset.trace,
                    product: btn.dataset.name,
                    batch: btn.dataset.batch,
                    expiry: btn.dataset.exp
                });
            }
        });

        modal.querySelector('.close-modal').onclick = () => modal.style.display = 'none';

        const showPreview = (qr) => {
            document.getElementById('qrPreviewContent').innerHTML = `
                <div class="qr-label-header">◉ TracePro VN — Digital Link</div>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://tracepro.vn/tr/${qr.traceId}">
                <div class="qr-label-info">
                    <div><strong>SẢN PHẨM:</strong> ${qr.product}</div>
                    <div><strong>SỐ LÔ:</strong> ${qr.batch}</div>
                    <div><strong>HSD:</strong> ${qr.expiry.split(' ')[0]}</div>
                </div>
            `;
            modal.style.display = 'flex';
        };

    } catch (err) {
        container.innerHTML = `Lỗi tải QR: ${err.message}`;
    }
};

// CSS for QR page
const qrStyles = document.createElement('style');
qrStyles.textContent = `
    .qr-header-actions { display: flex; justify-content: space-between; align-items: center; }
    .qr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.5rem; }
    .qr-card { padding: 0; cursor: pointer; transition: var(--transition); }
    .qr-card:hover { transform: translateY(-5px); }
    .qr-img-wrapper { position: relative; padding: 1.5rem; background: white; border-radius: var(--radius-lg) var(--radius-lg) 0 0; display: flex; justify-content: center; overflow: hidden; }
    .qr-img-wrapper img { width: 100%; height: auto; max-width: 150px; }
    .qr-overlay { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.8); display: flex; align-items: center; justify-content: center; opacity: 0; transition: var(--transition); }
    .qr-card:hover .qr-overlay { opacity: 1; }
    .qr-info { padding: 1rem; }
    .qr-info h4 { font-size: 0.9rem; margin-bottom: 0.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .qr-info p { font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.25rem; }
    
    .modal { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 1000; display: none; align-items: center; justify-content: center; padding: 2rem; }
    .modal-content { width: 100%; max-width: 500px; border-radius: var(--radius-xl); overflow: hidden; }
    .modal-header { padding: 1.5rem; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; }
    .modal-body { padding: 2rem; display: flex; justify-content: center; }
    .modal-footer { padding: 1.5rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: flex-end; gap: 1rem; }
    .btn-glass { background: rgba(255,255,255,0.1); backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: var(--radius-md); font-weight: 600; color: white; }
    
    .qr-preview-card { background: white; color: black; padding: 2rem; border-radius: 8px; text-align: center; font-family: sans-serif; }
    .qr-label-header { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; margin-bottom: 1rem; color: #1e293b; }
    .qr-label-info { text-align: left; margin-top: 1rem; border-top: 1px solid #e2e8f0; padding-top: 1rem; }
    .label-row { font-size: 0.75rem; margin-bottom: 0.25rem; }
    .qr-label-footer { font-size: 0.6rem; color: #64748b; margin-top: 1rem; }
`;
document.head.appendChild(qrStyles);
