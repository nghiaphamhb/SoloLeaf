$(document).ready(function () {
    // Lấy token JWT từ localStorage
    var token = localStorage.getItem("token");
    var linkUser = "/api/user"
    var linkRestaurant = "/api/restaurant";
    var linkMenuCategory = "/api/category-menu";
    if (!token) {
        alert("Bạn chưa đăng nhập!");
        window.location.href = "/signIn"; // redirect đến login nếu chưa có token
        return;
    }

    // user
    $.ajax({
        method: "GET",
        url: linkUser,
        headers: { "Authorization": `Bearer ${token}` }
    })
        .done(function (msg) {
            const box = $("#user-info").empty();
            const user = Array.isArray(msg?.data) ? msg.data[0] : msg?.data;

            if (user && (user.fullname || user.email)) {
                const name  = user.fullname || "Người dùng";
                const email = user.email || "";

                const html = `
                    <div class="name">${name}</div>
                    <div class="email">${email}</div>
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


    // restaurant
    $.ajax({
        method: "GET",
        url: linkRestaurant,
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .done(function (msg) {
            // msg.data chứa mảng nhà hàng
            if (msg.data && msg.data.length > 0) {
                console.log(msg.data);

                // Xóa phần cũ nếu có
                $("#feature-restaurant").empty();

                // Lặp qua từng nhà hàng
                $.each(msg.data, function (index, value) {
                    var html = `
                <div class="col-md-6 col-lg-4">
                    <a href="/restaurant/${value.id}" class="text-dark text-decoration-none">
                        <div class="restaurant-card d-flex align-items-center p-3 mb-4">
                            <img src="${'/images/' + value.image }"
                             class="img-fluid rounded" alt="${value.title}">
                            <div class="ms-3 w-100">
                                <p class="name mb-1">${value.title}</p>
                                <p class="category mb-1">${value.subtitle || ''}</p>
                                <div>
                                    <i class="mdi mdi-star text-warning"></i>
                                    <span class="fw-bold">${value.rating.toFixed(1)}</span> 
                                </div>
                                <span class="badge bg-success">${value.freeship ? 'Free delivery' : ''}</span>
                            </div>
                        </div>
                    </a>
                </div>
                `;
                    $("#feature-restaurant").append(html);
                });

            } else {
                $("#feature-restaurant").html("<p>Không có nhà hàng nào.</p>");
                console.log(msg.data);
            }
        })
        .fail(function (xhr) {
            console.error("Lỗi mạng/Server: ", xhr.status, xhr.responseText);
            alert("Lỗi khi tải danh sách nhà hàng!");
        });

    // foods
    $.ajax({
        method: "GET",
        url: linkMenuCategory,
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .done(function (msg) {
            const hasData = msg && Array.isArray(msg.data) && msg.data.length > 0;
            const $menu = $("#menu-sections"); // id mới
            $menu.empty();

            if (!hasData) {
                $menu.html("<p>Không có dữ liệu menu.</p>");
                return;
            }

            msg.data.forEach(function (category) {
                const catName = category?.name ?? "Danh mục";
                const foods = Array.isArray(category?.foodList) ? category.foodList : [];

                // Tạo khối danh mục riêng
                let catHtml = `
        <div class="menu-section">
          <h5 class="menu-section-title">${catName}</h5>
          <div class="menu-items">
      `;

                // Thêm từng món ăn dưới tiêu đề danh mục
                foods.forEach(function (food) {
                    const img = food?.image ? `/images/${food.image}` : "/images/placeholder.png";
                    const title = food?.title ?? "No title";
                    const badge = food?.freeShip ? `<span class="menu-badge">Free delivery</span>` : '';

                    catHtml += `
          <div class="menu-item">
            <img src="${img}" alt="${title}" class="menu-item-img">
            <div class="menu-item-info">
              <p class="menu-item-title">${title}</p>
              ${badge}
            </div>
          </div>
        `;
                });

                catHtml += `</div></div>`;
                $menu.append(catHtml);
            });
        })
        .fail(function (xhr) {
            console.error("Lỗi mạng/Server: ", xhr.status, xhr.responseText);
            alert("Lỗi khi tải danh sách menu!");
        });




});
