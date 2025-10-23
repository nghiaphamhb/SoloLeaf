(() => {
    const LOGIN_URL = '/';

    function clearTokenEverywhere() {
        // 1) xóa localStorage / sessionStorage
        try { localStorage.removeItem('token'); } catch {}
        try { sessionStorage.removeItem('token'); } catch {}

        // 3) Gỡ header mặc định nếu app đã set trước đó
        // if (window.axios && axios.defaults?.headers?.common) {
        //     delete axios.defaults.headers.common['Authorization'];
        // }
        // if (window.$ && $.ajaxSetup) {
        //     $.ajaxSetup({ headers: {} });
        // }

        // 4) Xóa state UI cơ bản (nếu có phần hiển thị user)
        // const box = document.getElementById('user-info');
        // if (box) box.innerHTML = '<p>No user</p>';
    }

    // async function revokeServerSession() {
    //     // Tuỳ chọn: gọi API logout để revoke refresh token phía server (nếu dùng)
    //     try {
    //         await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    //     } catch { /* im lặng nếu lỗi mạng */ }
    // }

    // Gắn handler khi bấm nút .logout
    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('.logout');
        if (!btn) return;

        e.preventDefault();
        // await revokeServerSession();
        clearTokenEverywhere();
        location.replace(LOGIN_URL);
    });
})();
