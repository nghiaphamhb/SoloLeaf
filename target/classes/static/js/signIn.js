$(document).ready(function () {
    $("#form-signin").on("submit", function (e) {
        e.preventDefault();
        var username = $("#username").val();
        var password = $("#password").val();

        $.ajax({
            method: "POST",
            url: "/api/login/signIn",
            data: { username: username, password: password }
        })
            .done(function (msg) {
                var token = msg && msg.data;
                if (!token) {
                    alert((msg && msg.message) || "Login failed!");
                    return;
                }

                // 1) Lưu token
                try { localStorage.setItem("token", token); } catch (e) {}

                // 2) Gọi /api/user/me để lấy userId (nếu chưa có)
                if (!localStorage.getItem("userId")) {
                    $.ajax({
                        method: "GET",
                        url: "/api/user/me",
                        headers: { "Authorization": "Bearer " + token }
                    })
                        .done(function (res) {
                            var data = res && res.data;
                            var user = Array.isArray(data) ? data[0] : (data || res);
                            if (user && (user.id != null || user.userId != null)) {
                                try {
                                    localStorage.setItem("userId", String(user.id != null ? user.id : user.userId));
                                } catch (e) {}
                            }
                        })
                        .always(function () {
                            window.location.href = "/home";
                        });
                } else {
                    window.location.href = "/home";
                }
            })
            .fail(function (xhr) {
                alert("Lỗi mạng/Server: " + (xhr.status || "") + " " + (xhr.responseText || ""));
            });
    });
});
