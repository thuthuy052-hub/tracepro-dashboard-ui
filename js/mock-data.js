/* Mock Data for TracePro Dashboard Demo */

const MockData = {
    user: {
        name: "Nguyễn Văn A",
        company: "Thực phẩm Sạch Việt Nam",
        role: "Administrator",
        workspaceId: "WS-88219"
    },
    
    stats: {
        totalSynced: 1248,
        pending: 12,
        errors: 3,
        totalQR: 5820
    },

    // 7-day sync history for chart
    chartData: [45, 52, 38, 65, 48, 72, 55],

    // Sync History logs
    history: [
        {
            id: "SYNC-001",
            batchCode: "BATCH-2026-001",
            product: "Súp Cua Đóng Hộp 500g",
            timestamp: "2026-05-25 08:30:12",
            status: "success",
            traceId: "TRC-782193-01",
            payload: { gtin: "893000111222", mfg: "2026-05-20", exp: "2026-11-20" }
        },
        {
            id: "SYNC-002",
            batchCode: "BATCH-2026-002",
            product: "Tương Ớt Cay Đặc Biệt",
            timestamp: "2026-05-25 08:15:45",
            status: "success",
            traceId: "TRC-782193-02",
            payload: { gtin: "893000111333", mfg: "2026-05-21", exp: "2027-05-21" }
        },
        {
            id: "SYNC-003",
            batchCode: "BATCH-2026-003",
            product: "Nước Mắm Truyền Thống",
            timestamp: "2026-05-24 16:40:00",
            status: "error",
            errorMsg: "GTIN không hợp lệ chuẩn GS1",
            traceId: null,
            payload: { gtin: "12345", mfg: "2026-05-21", exp: "2028-05-21" }
        },
        {
            id: "SYNC-004",
            batchCode: "BATCH-2026-004",
            product: "Gạo ST25 Túi 5kg",
            timestamp: "2026-05-24 14:20:10",
            status: "pending",
            traceId: null,
            payload: { gtin: "893850111444", mfg: "2026-05-15", exp: "2026-11-15" }
        },
        {
            id: "SYNC-005",
            batchCode: "BATCH-2026-005",
            product: "Trà Sen Đặc Sản",
            timestamp: "2026-05-24 10:05:33",
            status: "success",
            traceId: "TRC-782193-05",
            payload: { gtin: "893000111555", mfg: "2026-05-18", exp: "2027-05-18" }
        }
    ],

    // QR Code List
    qrCodes: [
        {
            id: "QR-001",
            product: "Súp Cua Đóng Hộp 500g",
            batch: "BATCH-2026-001",
            expiry: "2026-11-20",
            qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://tracepro.vn/tr/TRC-782193-01"
        },
        {
            id: "QR-002",
            product: "Tương Ớt Cay Đặc Biệt",
            batch: "BATCH-2026-002",
            expiry: "2027-05-21",
            qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://tracepro.vn/tr/TRC-782193-02"
        },
        {
            id: "QR-003",
            product: "Gạo ST25 Túi 5kg",
            batch: "BATCH-2026-004",
            expiry: "2026-11-15",
            qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://tracepro.vn/tr/TRC-782193-04"
        }
    ],

    // Notifications
    notifications: [
        { id: 1, title: "Đồng bộ thành công", message: "Lô hàng BATCH-2026-002 đã được đẩy lên Cổng QG.", type: "success", time: "5 phút trước" },
        { id: 2, title: "Lỗi đồng bộ", message: "Giao dịch SYNC-003 thất bại do sai định dạng GS1.", type: "error", time: "1 giờ trước" },
        { id: 3, title: "Cảnh báo Token", message: "Token Cổng QG sẽ hết hạn sau 15 phút. Hệ thống đang tự động refresh.", type: "warning", time: "2 giờ trước" }
    ]
};

// Export to window if not using modules
window.MockData = MockData;
