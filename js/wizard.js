/* Setup Wizard Renderer */

window.RenderWizard = (container) => {
    container.innerHTML = `
        <div class="wizard-container card glass">
            <div class="wizard-steps">
                <div class="step-item active" data-step="1">
                    <div class="step-circle">1</div>
                    <span>Doanh nghiệp</span>
                </div>
                <div class="step-line"></div>
                <div class="step-item" data-step="2">
                    <div class="step-circle">2</div>
                    <span>Kết nối ERP</span>
                </div>
                <div class="step-line"></div>
                <div class="step-item" data-step="3">
                    <div class="step-circle">3</div>
                    <span>Hoàn tất</span>
                </div>
            </div>

            <div class="wizard-body mt-4">
                <div class="wizard-page active" id="step1">
                    <h3>Xác nhận thông tin cơ sở</h3>
                    <p class="text-secondary mb-4">Thông tin này sẽ được dùng để đăng ký với Cổng TXNG Quốc gia.</p>
                    <form class="wizard-form">
                        <div class="form-group mb-4">
                            <label>Tên Doanh nghiệp / Hợp tác xã</label>
                            <input type="text" value="Thực phẩm Sạch Việt Nam" required>
                        </div>
                        <div class="form-group mb-4">
                            <label>Mã số thuế</label>
                            <input type="text" value="0101234567" required>
                        </div>
                        <div class="form-group mb-4">
                            <label>Địa chỉ trụ sở</label>
                            <input type="text" value="Số 10, Đường ABC, Quận 1, TP.HCM" required>
                        </div>
                        <button type="button" class="btn-primary next-step" data-next="2">Tiếp tục: Kết nối ERP</button>
                    </form>
                </div>

                <div class="wizard-page" id="step2">
                    <h3>Kết nối với nền tảng quản lý</h3>
                    <p class="text-secondary mb-4">Chọn nền tảng bạn đang dùng để quản lý kho và bán hàng.</p>
                    <div class="erp-selection-grid mb-4">
                        <div class="erp-option active" data-erp="kiotviet">
                            <div class="erp-logo">KV</div>
                            <span>KiotViet</span>
                        </div>
                        <div class="erp-option" data-erp="sapo">
                            <div class="erp-logo">SP</div>
                            <span>Sapo</span>
                        </div>
                        <div class="erp-option" data-erp="misa">
                            <div class="erp-logo">MS</div>
                            <span>Misa AMIS</span>
                        </div>
                    </div>
                    
                    <div id="erpConnectArea">
                        <div class="card bg-primary mb-4">
                            <p class="text-secondary" style="font-size: 0.9rem;">Bạn sẽ được chuyển đến trang xác thực của <strong>KiotViet</strong> để cấp quyền truy cập dữ liệu phiếu xuất kho.</p>
                        </div>
                        <button type="button" class="btn-primary" id="btnConnectERP">Bắt đầu kết nối (Authorize)</button>
                    </div>
                    
                    <button type="button" class="btn-ghost mt-4 prev-step" data-prev="1">Quay lại</button>
                </div>

                <div class="wizard-page" id="step3">
                    <div class="success-animation">
                        <div class="success-icon">✓</div>
                    </div>
                    <h3>Thiết lập thành công!</h3>
                    <p class="text-secondary mb-4">TracePro đã kết nối thành công với KiotViet. Mọi lệnh xuất kho mới của bạn sẽ được tự động đồng bộ sang chuẩn GS1 và đẩy lên Cổng QG.</p>
                    
                    <div class="card bg-primary mb-4">
                        <ul class="check-list">
                            <li>✓ Đã map 48 sản phẩm từ KiotViet</li>
                            <li>✓ Đã kích hoạt Token Cổng QG</li>
                            <li>✓ Đã sẵn sàng sinh mã QR Digital Link</li>
                        </ul>
                    </div>

                    <button type="button" class="btn-primary" onclick="window.location.hash='overview'">Về Bảng điều khiển</button>
                </div>
            </div>
        </div>
    `;

    // Wizard Logic
    const goToStep = (stepNum) => {
        // Update steps UI
        document.querySelectorAll('.step-item').forEach(item => {
            const num = parseInt(item.dataset.step);
            item.classList.toggle('active', num === stepNum);
            item.classList.toggle('completed', num < stepNum);
        });

        // Show page
        document.querySelectorAll('.wizard-page').forEach(page => page.classList.remove('active'));
        document.getElementById(`step${stepNum}`).classList.add('active');
    };

    container.querySelectorAll('.next-step').forEach(btn => {
        btn.onclick = () => goToStep(parseInt(btn.dataset.next));
    });

    container.querySelectorAll('.prev-step').forEach(btn => {
        btn.onclick = () => goToStep(parseInt(btn.dataset.prev));
    });

    const btnConnect = document.getElementById('btnConnectERP');
    if (btnConnect) {
        btnConnect.onclick = () => {
            btnConnect.innerHTML = 'Đang kết nối...';
            btnConnect.disabled = true;
            
            setTimeout(() => {
                alert('Kết nối KiotViet thành công!');
                goToStep(3);
            }, 2000);
        };
    }

    // Toggle ERP selection
    container.querySelectorAll('.erp-option').forEach(opt => {
        opt.onclick = () => {
            container.querySelectorAll('.erp-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
        };
    });
};

// CSS for Wizard
const wizardStyles = document.createElement('style');
wizardStyles.textContent = `
    .wizard-container { max-width: 700px; margin: 0 auto; padding: 3rem; }
    .wizard-steps { display: flex; align-items: center; justify-content: space-between; margin-bottom: 3rem; }
    .step-item { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: var(--text-muted); position: relative; }
    .step-circle { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--text-muted); display: flex; align-items: center; justify-content: center; font-weight: 700; transition: var(--transition); }
    .step-item span { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
    .step-item.active .step-circle { border-color: var(--accent-primary); background: var(--accent-primary); color: white; }
    .step-item.active span { color: var(--text-primary); }
    .step-item.completed .step-circle { border-color: var(--accent-success); background: var(--accent-success); color: white; }
    .step-line { flex: 1; height: 2px; background: var(--border-subtle); margin: 0 1rem; margin-top: -20px; }
    
    .wizard-page { display: none; animation: fadeIn 0.3s; }
    .wizard-page.active { display: block; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    
    .erp-selection-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .erp-option { padding: 1.5rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; gap: 0.5rem; cursor: pointer; transition: var(--transition); }
    .erp-option:hover { border-color: var(--accent-primary); background: rgba(59, 130, 246, 0.05); }
    .erp-option.active { border-color: var(--accent-primary); background: rgba(59, 130, 246, 0.1); }
    .erp-logo { width: 48px; height: 48px; background: rgba(255,255,255,0.05); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2rem; }
    
    .success-animation { display: flex; justify-content: center; margin-bottom: 2rem; }
    .success-icon { width: 80px; height: 80px; background: var(--accent-success); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: white; animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
    
    .check-list { list-style: none; padding: 1rem; }
    .check-list li { margin-bottom: 0.5rem; color: var(--accent-success); font-weight: 500; font-size: 0.9rem; }
`;
document.head.appendChild(wizardStyles);
