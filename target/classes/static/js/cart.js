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

    const cartState = [];

    function renderCartPanel() {
        const $body = $("#cartPanel .cart-panel__body");
        $body.empty();

        // render từng món
        $.each(cartState, function(_, it) {
            $body.append(`
        <div class="cart-item">
          <img class="cart-item__img" src="${it.image}" alt="">
          <div class="cart-item__info">
            <div class="cart-item__top">
              <span class="cart-item__name">${it.title}</span>
              <button class="cart-item__remove">×</button>
            </div>
            <div class="cart-item__meta">
              <span class="cart-item__qty">${it.qty}×</span>   
              <span class="cart-item__price">${it.price} ₽</span>
            </div>
          </div>
        </div>
      `);
        });

        // Cập nhật badge số lượng
        $("#cartCount").text(cartState.length);
    }

    // Lắng nghe sự kiện 'cart:add'
    $(document).on("cart:add", function(e, item) {
        let found = undefined;

        if (item.id != null) {
            found = cartState.find(p => p.id === item.id);
        }

        if (found) {
            found.qty += item.qty;
        } else {
            cartState.push({ ...item });
        }

        renderCartPanel();
    });
});


