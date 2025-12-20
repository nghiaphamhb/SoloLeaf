$(document).ready(function () {
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
             </div>
             <div class="cart-item__meta">
               <span class="cart-item__price">x ${it.qty}</span>
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

    function formatRuble(n){
        const v = Number(n)||0;
        return v.toLocaleString('ru-RU') + " ₽";
    }

    function getCartTotal() {
        return cartState.reduce((s, it) => s + (Number(it.price)||0) * (Number(it.qty)||0), 0);
    }


    function getCurrentUserId() {
        var uid = localStorage.getItem("userId");
        return uid ? String(uid) : "GUEST";
    }

    function getCartKey() {
        return "CART_STATE__U_" + getCurrentUserId() + "__R_GLOBAL";
    }

    const cartState = loadCart();
    renderCartPanel();

    $(document).on("click", ".cart-checkout-btn", function (e) {
        localStorage.removeItem(getCartKey()); // Xóa giỏ hàng của người dùng hiện tại
        setTimeout(function() {
            window.location.href = "/home";
        }, 100);
    });

});

