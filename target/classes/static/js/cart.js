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
              <div class="cart-item__controls">
                  <button class="cart-item__decrease" data-id="${it.id}">−</button>
                  <span>${it.qty}</span>
                  <button class="cart-item__increase" data-id="${it.id}">+</button>
              </div>
            </div>
            <div class="cart-item__meta">
              <span class="cart-item__qty">x ${it.qty}</span>   
              <span class="cart-item__price">${it.price} ₽</span>
            </div>
          </div>
        </div>
      `);
        });

        // Cập nhật badge số lượng
        const totalQty = cartState.reduce((sum, it) => sum + it.qty, 0);
        $("#cartCount").text(totalQty);
    }

    // Sự kiện thay đổi số lượng khi bấm nút "+/-"
    $(document).on("click", ".cart-item__decrease, .cart-item__increase", function () {
        const id = $(this).data("id");
        const found = cartState.find(p => p.id === id);
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

        renderCartPanel();
    });


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


