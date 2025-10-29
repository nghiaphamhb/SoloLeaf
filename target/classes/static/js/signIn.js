$(document).ready(function(){
    $("#form-signin").on("submit", function (e) {
        e.preventDefault();
        var username = $("#username").val();
        var password = $("#password").val();

        $.ajax({
            method: "POST",
            url: "/api/login/signIn",
            data: {
                username: username,
                password: password
            }
        })
            .done(function (msg) {
                if (msg && msg.data) {
                    console.log("[Client] Get token: " + msg.data);
                    localStorage.setItem("token", msg.data);
                    window.location.href = "/home";
                } else {
                    alert((msg && msg.message) || "Đăng nhập thất bại!");
                }
            })
            .fail(function (xhr) {
                alert("Lỗi mạng/Server: " + (xhr.status || "") + " " + (xhr.responseText || ""));
            });
    });

})