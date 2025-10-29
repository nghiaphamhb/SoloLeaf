/* ================== ENDPOINT ================== */
const API_RESTAURANT_DETAIL = (id) => `/api/restaurant/detail/${id}`;

$(function () {
    function getRestaurantId() {
        const match = window.location.pathname.match(/\/restaurant\/(\d+)/);
        return match ? match[1] : null;
    }

    const restaurantId = getRestaurantId();
    if (!restaurantId) {
        renderError("Không tìm thấy tham số id trên URL.");
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) { alert("Bạn chưa đăng nhập!"); window.location.href = "/signIn"; return; }

    const headers = { "Authorization": `Bearer ${token}` };

    // API trả cả detail + categories
    $.ajax({
        method: "GET",
        url: API_RESTAURANT_DETAIL(restaurantId),
        headers: headers
    })
        .done(function (resp) {
            const d = resp && resp.data ? resp.data : {};
            renderRestaurantHeaderFromApi(d);

            // categories: [{ name, foodList: [{image,title,rating,timeShip,freeShip}, ...] }]
            const categoriesArr = Array.isArray(d.categories) ? d.categories : [];

            // Tạo map {catName: foodList[]} để tái dùng hàm render hiện có
            const grouped = {};
            categoriesArr.forEach(cat => {
                const name = cat?.name || "Danh mục";
                grouped[name] = Array.isArray(cat?.foodList)
                    ? cat.foodList.map(food => ({
                        imageUrl: food?.image ? `/images/${food.image}` : "/img/food-placeholder.jpg",
                        name: food?.title || "No title",
                        price: food?.price ?? 0,                 // nếu API chưa trả giá, cho 0
                        rating: typeof food?.rating === "number" ? food.rating : "—",
                        prepMinutes: food?.timeShip || "",       // có thể là "15-20 min" hoặc null
                        freeShip: !!food?.freeShip,
                    }))
                    : [];
            });

            renderCategoryTabs(grouped);
            const firstCat = Object.keys(grouped)[0];
            renderMenuGrid(grouped[firstCat], firstCat);

            // Đổi tab
            $("#category-tabs").on("click", "a[data-cat]", function (e) {
                e.preventDefault();
                const cat = $(this).data("cat");
                $("#category-tabs a").removeClass("active");
                $(this).addClass("active");
                renderMenuGrid(grouped[cat], cat);
            });
        })
        .fail(function (xhr) {
            console.error("Lỗi gọi API:", xhr.status, xhr.responseText);
            renderError("Không tải được dữ liệu. Vui lòng thử lại.");
        });
});

/* ================== RENDER HELPERS ================== */
/* header print error message */
function renderError(msg) {
    $("#restaurant-header").replaceWith(
        `<div>${msg}</div>`
    );
}

/* API Restaurant header */
function renderRestaurantHeaderFromApi(d) {
    // logo, name, subtitle
    $("#rest-logo").attr("src", d.image ? `/images/${d.image}` : "/img/placeholder.png");
    $("#rest-name").text(d.title || "Restaurant");
    $("#rest-cuisines").text(d.subtitle || "");

    const $badges = $("#rest-badges");
    $badges.empty();
    if (d.freeship) {
        $badges.append(`<span class="badge" style="color: #0a7a0a; background: #e6f6e6;">Free delivery</span>`);
    }
    if (typeof d.promo === "number" && d.promo > 0) {
        $badges.append(`<span class="badge"  style="color: #b34700; background: #fff1e6;">${d.promo}% OFF</span>`);
    }

    $("#rest-desc").text(d.description || "");
    $("#rest-rating").text(
        typeof d.rating === "number" ? d.rating : "—"
    );
    $("#rest-address").text(d.address || "—");
}

/* Categories */
function renderCategoryTabs(grouped) {
    const $tabs = $("#category-tabs").empty();
    Object.keys(grouped).forEach((cat, idx) => {
        const a = $(`
      <a href="#" class="nav-link ${idx === 0 ? "active" : ""}" data-cat="${escapeHtml(cat)}">${escapeHtml(cat)}</a>
    `);
        $tabs.append($("<li class='nav-item'></li>").append(a));
    });
}

function renderMenuGrid(items, catName) {
    const $grid = $("#menu-grid").empty();
    if (!items || !items.length) {
        $grid.append(
            `<div class="col-12"><div class="alert alert-warning">Chưa có món trong nhóm "${escapeHtml(
                catName || ""
            )}".</div></div>`
        );
        return;
    }

    items.forEach((m) => {
        const freeBadge = m.freeShip ? `<span class="label_freeship">Free delivery</span>` : '';
        const prepText  = m.prepMinutes ? `${escapeHtml(m.prepMinutes)}`
            : ""; // API dùng timeShip, đã map sang prepMinutes
        const priceText = (typeof m.price === "number")
            ? `$${Number(m.price).toFixed(2)}`
            : "";

        const card = $(`
      <div class="menu-card">
          <div class="menu-card__media">
            <img src="${escapeAttr(m.imageUrl)}" class="menu-card__img" alt="${escapeAttr(m.name)}" />
          </div>
          <div class="menu-card__body">
            <div class="menu-card__header">
              <h6 class="menu-card__title">${escapeHtml(m.name)}</h6>
              ${freeBadge} <!-- gợi ý: thêm class="menu-card__badge" trong freeBadge -->
            </div>
            <div class="menu-card__meta">
              <span class="menu-card__rating" aria-label="Rating">
                <span class="menu-card__star" aria-hidden="true">⭐</span>
                ${m.rating ?? "—"}
              </span>
              ${prepText ? `<span class="menu-card__dot">·</span><span class="menu-card__prep">${prepText}</span>` : ""}
            </div>
            <div class="menu-card__footer">
              <div class="menu-card__price">${priceText}</div>
              <button class="menu-card__btn buttons" aria-label="Add ${escapeAttr(m.name)} to cart">Add</button>
            </div>
          </div>
        </div>
    `);
        $grid.append(card);
    });
}

/* nhỏ gọn tránh XSS khi chèn text vào HTML */
function escapeHtml(s) {
    return String(s ?? "")
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function escapeAttr(s) {
    return escapeHtml(s);
}
