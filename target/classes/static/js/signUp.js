$("#form-signup").on("submit", function (e) {
    e.preventDefault();

    var fullname = $("#fullname").val();
    var email = $("#email").val();
    var password = $("#password").val();
    var confirm = $("#confirm").val();

    // Kiểm tra mật khẩu xác nhận
    if (password !== confirm) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
    }

    // Gửi dữ liệu dưới dạng JSON
    $.ajax({
        method: "POST",
        url: "/api/login/signUp",
        contentType: "application/json",
        data: JSON.stringify({
            fullname: fullname,
            username: email,
            password: password,
            roleId: 1
        })
    })
        .done(function (msg) {
            if (msg && msg.data) {
                window.location.href = "/";
            } else {
                alert((msg && msg.message) || "Đăng ký thất bại!");
            }
        })
        .fail(function (xhr) {
            alert("Lỗi mạng/Server: " + (xhr.status || "") + " " + (xhr.responseText || ""));
        });
});