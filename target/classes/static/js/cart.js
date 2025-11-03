$(document).ready(function () {
    const $cartFab = $("#cartFab");
    const $cartPanel = $("#cartPanel");
    const $cartCloseBtn = $("#cartCloseBtn");
    const $cartBackdrop = $("#cartBackdrop");

    function openCart() {
        $cartPanel.addClass("is-open");
        $cartBackdrop.addClass("is-active");
    }

    function closeCart() {
        $cartPanel.removeClass("is-open");
        $cartBackdrop.removeClass("is-active");
    }

    // Sự kiện click
    $cartFab.on("click", openCart);
    $cartCloseBtn.on("click", closeCart);
    $cartBackdrop.on("click", closeCart);

    // Esc để đóng
    $(document).on("keydown", function (e) {
        if (e.key === "Escape") {
            closeCart();
        }
    });

    function getCurrentUserId() {
        var uid = localStorage.getItem("userId");
        return uid ? String(uid) : "GUEST";
    }
    // Home page: dùng GLOBAL theo user
    function getCartKey() {
        return "CART_STATE__U_" + getCurrentUserId() + "__R_GLOBAL";
    }

    function loadCart() {
        try {
            var key = getCartKey();
            const raw = localStorage.getItem(key);
            if (!raw) return [];
            const arr = JSON.parse(raw);
            if (!Array.isArray(arr)) return [];
            return arr
                .map(function (it) {
                    return {
                        id: it.id,
                        title: String(it.title || ""),
                        image: String(it.image || ""),
                        price: Number(it.price) || 0,
                        qty: Number(it.qty) || 0,
                        // GIỮ LẠI 2 TRƯỜNG NÀY
                        restId: it.restId != null ? String(it.restId) : undefined,
                        restName: it.restName != null ? String(it.restName) : ""
                    };
                })
                .filter(function (it) { return it.id != null && it.qty > 0; });
        } catch (e) {
            console.warn("Load cart failed:", e);
            return [];
        }
    }

    function saveCart() {
        try {
            var key = getCartKey();
            localStorage.setItem(key, JSON.stringify(cartState));
        } catch (e) {
            console.warn("Save cart failed:", e);
        }
    }

    $(document).on("auth:ready", function (e, data) {
        // Khi userId được set (sau /me), nạp lại giỏ theo key mới và render
        cartState.length = 0;
        Array.prototype.push.apply(cartState, loadCart());
        renderCartPanel();
    });

    const cartState = loadCart();
    renderCartPanel();

    function renderCartPanel() {
        const $body = $("#cartPanel .cart-panel__body").empty();

        // Nhóm theo restId
        const groups = {};
        cartState.forEach(function(it){
            const rid = String(it.restId || "UNKNOWN");
            if (!groups[rid]) groups[rid] = { name: it.restName || ("Store " + rid), items: [] };
            groups[rid].items.push(it);
        });

        // Render từng nhóm
        Object.keys(groups).forEach(function(rid){
            const g = groups[rid];
            // Header cửa hàng
            $body.append(
                `<div class="cart-store">
         <div class="cart-store__header">
           <span class="cart-store__name">${g.name}</span>
         </div>
       </div>`
            );
            const $store = $body.children().last();

            // Items của cửa hàng
            g.items.forEach(function(it){
                $store.append(
                    `<div class="cart-item">
           <img class="cart-item__img" src="${it.image}" alt="">
           <div class="cart-item__info">
             <div class="cart-item__top">
               <span class="cart-item__name">${it.title}</span>
               <div class="cart-item__controls">
                 <button class="cart-item__decrease" data-id="${it.id}" data-rest-id="${it.restId}">−</button>
                 <span>${it.qty}</span>
                 <button class="cart-item__increase" data-id="${it.id}" data-rest-id="${it.restId}">+</button>
               </div>
             </div>
             <div class="cart-item__meta">
               <span class="cart-item__qty">x ${it.qty}</span>
               <span class="cart-item__price">${Number(it.price).toFixed(2)} ₽</span>
             </div>
           </div>
         </div>`
                );
            });
        });

        // Badge & tổng tiền toàn giỏ
        const totalQty = cartState.reduce((s,it)=>s+it.qty,0);
        $("#cartCount").text(totalQty);

        const initPrice = cartState.reduce((s,it)=>s+it.price*it.qty,0);
        $("#initial-price").text(initPrice.toFixed(2) + " ₽");
        const discount = 0;
        $("#total-price").text((initPrice-discount).toFixed(2) + " ₽");
    }

    function findByKey(id, rid) {
        return cartState.find(function(p){ return p.id===id && String(p.restId)===String(rid); });
    }

    // Sự kiện thay đổi số lượng khi bấm nút "+/-"
    $(document).on("click", ".cart-item__decrease, .cart-item__increase", function () {
        const id = $(this).data("id");
        const rid = String($(this).data("rest-id"));
        const found = findByKey(id, rid);
        if (!found) return;

        if ($(this).hasClass("cart-item__decrease")) {
            found.qty -= 1;
            if (found.qty <= 0) {
                const idx = cartState.indexOf(found);
                if (idx !== -1) cartState.splice(idx, 1);
            }
        }

        if ($(this).hasClass("cart-item__increase")) {
            found.qty += 1;
        }
        saveCart();
        renderCartPanel();
    });


    // Lắng nghe sự kiện 'cart:add'
    $(document).on("cart:add", function(e, item) {
        const id  = item.id;
        const rid = String(item.restId);
        let found = findByKey(id, rid);

        if (found) {
            found.qty += Number(item.qty)||1;
        } else {
            cartState.push({
                id: id,
                title: String(item.title||""),
                image: String(item.image||""),
                price: Number(item.price)||0,
                qty: Number(item.qty)||1,
                restId: rid,
                restName: String(item.restName||"")
            });
        }
        saveCart();
        renderCartPanel();
    });
});


