/* Utility functions for TracePro Dashboard */

const Utils = {
    formatDate: (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    generateToast: (message, type = 'info') => {
        // Simple alert for now, could be a custom toast component
        console.log(`[Toast ${type}]: ${message}`);
    },
    
    copyToClipboard: (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Đã sao chép vào bộ nhớ tạm!');
        });
    }
};

window.Utils = Utils;
