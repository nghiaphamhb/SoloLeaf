$(document).ready(function () {
    let appliedCoupon  = null;

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

    function renderCartPanel() {
        const $body = $("#cartPanel .cart-panel__body").empty();

        const groups = {};
        cartState.forEach(function(it){
            const rid = String(it.restId || "UNKNOWN");
            if (!groups[rid]) groups[rid] = { name: it.restName, items: [] };
            groups[rid].items.push(it);
        });

        Object.keys(groups).forEach(function(rid){
            const g = groups[rid];
            $body.append(
                `<div class="cart-store">
         <div class="cart-store__header">
           <span class="cart-store__name">${g.name}</span>
         </div>
       </div>`
            );
            const $store = $body.children().last();

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
               <span class="cart-item__price">${Number(it.price * it.qty).toFixed(2)} ₽</span>
             </div>
           </div>
         </div>`
                );
            });
        });

        const totalQty = cartState.reduce((s,it)=>s+it.qty,0);
        $("#cartCount").text(totalQty);

        const initPrice = getCartTotal();
        $("#initial-price").text(formatRuble(initPrice.toFixed(2)));

        // KHÔNG set #total-price ở đây; để updateTotals() làm
    }

    function findByKey(id, rid) {
        return cartState.find(function(p){ return p.id===id && String(p.restId)===String(rid); });
    }

    function formatRuble(n){
        const v = Number(n)||0;
        return v.toLocaleString('ru-RU') + " ₽";
    }

    function getCartTotal() {
        return cartState.reduce((s, it) => s + (Number(it.price)||0) * (Number(it.qty)||0), 0);
    }

    function getSubtotalByRest(restId) {
        const rid = String(restId);
        return cartState
            .filter(it => String(it.restId) === rid)
            .reduce((s, it) => s + (Number(it.price)||0) * (Number(it.qty)||0), 0);
    }

    // Cập nhật tổng tiền khi discount thay đổi
    function updateTotals(){
        const initial = getCartTotal(); // tổng giỏ “sạch”
        let discount = 0;

        if (appliedCoupon){
            const subtotal = getSubtotalByRest(appliedCoupon.resId);
            discount = Math.min(
                Math.round(subtotal * (Number(appliedCoupon.percent)||0) / 100),
                subtotal
            );
            const $amt = $("#discount-amount");
            if ($amt.length){
                $amt.text("- " + formatRuble(discount));
            }
        }

        $("#initial-price").text(formatRuble(initial.toFixed(2)));
        $("#total-price").text(formatRuble(Math.max(0, initial - discount).toFixed(2)));
    }

    const cartState = loadCart();
    renderCartPanel();
    updateTotals();

    $(document).on("auth:ready", function (e, data) {
        // Khi userId được set (sau /me), nạp lại giỏ theo key mới và render
        cartState.length = 0;
        Array.prototype.push.apply(cartState, loadCart());
        renderCartPanel();
        updateTotals();
    });

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
        updateTotals();
    });

    $(document).on("click", ".cart-checkout-btn", function (e) {
        // delete applied coupon
        try{
            const code = appliedCoupon.code || null;
            const coupons = loadCoupons();
            const updated = coupons.filter(c => normalizeCode(c.code) !== code);
            saveCoupons(updated);
            console.log("Coupons after removal:", updated);
        } catch (e) {
            console.log("No coupon code to remove.");
        }

        // Xoá toàn bộ giỏ hàng hiện tại (RAM + localStorage) rồi render lại
        cartState.length = 0;
        saveCart();
        renderCartPanel();
        updateTotals();

        window.location.href = "/payment";
    });

    $(document).on("click", ".cart-cancel-btn", function (e) {
        // console.log("Triggering cart:return event...");  // Debug log
        // $(document).trigger("cart:return", null);
        setTimeout(function() {
            window.location.href = "/home";
        }, 100);
    });

});

