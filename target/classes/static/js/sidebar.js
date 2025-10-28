$(document).ready(function () {
    const linkOut = '/';
    const linkUser = "/api/user/me";
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Bạn chưa đăng nhập!");
        window.location.href = "/signIn";
        return;
    }

    function clearTokenEverywhere() {
        try { localStorage.removeItem('token'); } catch {}
        try { sessionStorage.removeItem('token'); } catch {}
        // Nếu có dùng axios/jQuery headers mặc định thì bỏ comment để gỡ:
        // if (window.axios && axios.defaults?.headers?.common) {
        //   delete axios.defaults.headers.common['Authorization'];
        // }
        // $.ajaxSetup({ headers: {} });
    }

    // Bắt sự kiện click
    $(document).on('click', '.logout', function (e) {
        e.preventDefault();
        // (tuỳ chọn) gọi API /auth/logout trước khi xoá token
        // fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).finally(() => {
        //   clearTokenEverywhere();
        //   window.location.replace(LOGIN_URL);
        // });

        clearTokenEverywhere();
        window.location.replace(linkOut);
    });

    // user profile (fullname + username(email) )
    $.ajax({
        method: "GET",
        url: linkUser,
        headers: { "Authorization": `Bearer ${token}` }
    })
        .done(function (msg) {
            const box = $(".user-info").empty();

            const user = Array.isArray(msg?.data) ? msg.data[0] : (msg?.data || msg);

            if (user && (user.fullname || user.username)) {
                const fullname  = user.fullname || "Người dùng";
                const username  = user.username || "";

                const html = `
                    <div class="fullname">👤${fullname}</div>
                    <div class="username">${username}</div>
                `;
                box.html(html);
            } else {
                box.html(`<p>No user</p>`);
            }
        })
        .fail(function (xhr) {
            console.error("Lỗi mạng/Server: ", xhr.status, xhr.responseText);
            alert("Lỗi khi tải user!");
        });
});
