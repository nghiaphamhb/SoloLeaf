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
    }

    // Bắt sự kiện click
    $(document).on('click', '.logout', function (e) {
        e.preventDefault();
        // (tuỳ chọn) gọi API /auth/logout trước khi xoá token
        // fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).finally(() => {
        //   clearTokenEverywhere();
        //   window.location.replace(LOGIN_URL);
        // });
        try { localStorage.removeItem('userId'); } catch {}

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

            // Lưu userId cho các module khác dùng (cart.js)
            try { localStorage.setItem("userId", String(user.id ?? user.userId ?? "")); } catch {}
            // Báo cho cart.js biết đã có userId (để chuyển key khỏi GUEST)
            $(document).trigger("auth:ready", { userId: String(user.id ?? user.userId) });

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
