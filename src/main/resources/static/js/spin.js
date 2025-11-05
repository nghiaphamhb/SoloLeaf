// Lucky Spin – mỗi ngày 1 lượt (client-only MVP)
$(function () {
    const WHEEL = $("#spinWheel");
    const BTN_SPIN = $("#btnSpin");
    const NOTE = $("#spinNote");
    const MODAL = $("#spinModal");
    const MODAL_CLOSE = $("#spinModalClose");
    const PRIZE_CLOSE = $("#prizeClose");
    const BTN_COPY_CODE = $("#btnCopyCode");
    const BTN_COPY_ALL = $("#btnCopyAll");
    const BTN_CLEAR = $("#btnClearCoupons");
    const PRIZE_MAIN = $("#prizeMain");
    const PRIZE_CODE = $("#prizeCode");
    const PRIZE_META = $("#prizeMeta");
    const PRIZE_USE_NOW = $("#prizeUseNow");
    const MY_COUPONS = $("#myCoupons");

    const LS_LAST = "SPIN_LAST_DATE";
    const LS_COUPONS = "SPIN_COUPONS";

    const linkPromoApi = "/api/promo";
    const PALETTE = ["#FDE68A","#A7F3D0","#93C5FD","#FCA5A5","#FBCFE8","#BBF7D0","#BAE6FD","#FED7AA"];
    let OFFERS = []; // danh sách chuẩn hoá từ API

    function renderSlicesFrom(items){
        if (!Array.isArray(items) || !items.length){
            WHEEL.html('<p style="text-align:center;margin:20px 0;">None promo code.</p>');
            OFFERS = [];
            return;
        }

        // Chuẩn hoá để phần “trao thưởng” dùng ổn
        OFFERS = items.map((it, i)=>({
            id: it.id,
            percent: it.percent,
            startDate: it.startDate || "",
            endDate:  it.endDate  || "",
            resId:  it.resId,
            resTitle: it.resTitle,
            color: PALETTE[i % PALETTE.length],
        }));

        const n = items.length;
        const step = 360 / n;

        const html = OFFERS.map((p, i)=>{
            const start = i * step;
            const end   = (i + 1) * step;
            const ang   = start + step/2;
            const flip  = ang > 180 ? " flip" : "";
            return `
      <div class="slice${flip}" style="--start:${start}deg;--end:${end}deg;--ang:${ang}deg;--bg:${p.color}">
        <span>${p.resTitle}<br>- ${p.percent} %</span>
      </div>`;
        }).join("");

        WHEEL.removeClass("empty").html(html);
    }


    // Helper ngày (yyyy-mm-dd)
    function todayKey() {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${dd}`;
    }

    function loadCoupons() {
        try { return JSON.parse(localStorage.getItem(LS_COUPONS) || "[]"); }
        catch { return []; }
    }

    function saveCoupons(list) {
        localStorage.setItem(LS_COUPONS, JSON.stringify(list));
    }

    function renderCoupons() {
        const list = loadCoupons();
        if (!list.length) {
            MY_COUPONS.addClass("empty").html(`<p>Chưa có mã — quay để nhận ngay!</p>`);
            return;
        }
        MY_COUPONS.removeClass("empty").html(list.map(c => {
            return `
        <div class="coupon">
          <div class="c-top">
            <div class="store">🏷️ ${escapeHTML(c.store)}</div>
            <div class="code">${escapeHTML(c.code)}</div>
          </div>
          <div class="c-bottom">
            <small>${escapeHTML(c.title)} • HSD: ${formatDateTime(c.expireAt)}</small>
          </div>
        </div>`;
        }).join(""));
    }

    function escapeHTML(s) {
        return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    }
    function formatDateTime(ts) {
        const d = new Date(ts);
        return d.toLocaleString();
    }

    function updateDailyState() {
        const last = localStorage.getItem(LS_LAST);
        const today = todayKey();
        BTN_SPIN.prop("disabled", false).text("Spin now");
        // if (last === today) {
        //     BTN_SPIN.prop("disabled", true).text("Hết lượt hôm nay");
        //     NOTE.html(`Hãy quay lại vào ngày mai 📅`);
        // } else {
        //     BTN_SPIN.prop("disabled", false).text("Quay ngay");
        //     NOTE.html(`Bạn còn <b>1</b> lượt quay hôm nay.`);
        // }
    }

    // Tạo code: 3-3-4 kiểu ABC-12Z-9KQ3
    function genCode(prefix) {
        const A = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0,3);
        const B = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0,3);
        const C = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0,4);
        return `${(prefix||"SPN").toUpperCase()}-${A}-${B}${C}`;
    }

    // Chọn ngẫu nhiên index phần thưởng
    function pickPrizeIndex() {
        if (!OFFERS.length) return 0;
        return Math.floor(Math.random() * OFFERS.length);
    }

    // Tính góc quay tới index phần thưởng đó
    function spinToIndex(idx) {
        const n = OFFERS.length || 1;
        const fullTurns = 6;
        const sliceAngle = 360 / n;
        const targetFromZero = idx * sliceAngle + sliceAngle/2;
        const targetDeg = fullTurns * 360 + (360 - targetFromZero);
        const jitter = (Math.random()*12 - 6);
        return targetDeg + jitter;
    }

    function openModal(prize, code, metaText) {
        PRIZE_MAIN.text(prize.label);
        PRIZE_CODE.text(code);
        PRIZE_META.text(metaText);
        MODAL.addClass("show").attr("aria-hidden", "false");
    }
    function closeModal() {
        MODAL.removeClass("show").attr("aria-hidden", "true");
    }

    // ==== Begin logic ====
    var token = localStorage.getItem("token");
    if (!token) {
        alert("Need login!");
        window.location.href = "/signIn";
        return;
    }

    // Khởi tạo
    renderCoupons();
    updateDailyState();

    // Khởi tạo bánh
    $.ajax({
        method: "GET",
        url: linkPromoApi,
        headers: { "Authorization": "Bearer " + token },
    }).done(function (msg) {
        const items = (msg && msg.data) || [];
        renderSlicesFrom(items);
    })
        .fail(function (){
            console.error("Load offers error");
            WHEEL.html('<div style="text-align:center;margin:20px 0;">Cannot load promo codes.</div>');
        });

    // Events
    BTN_SPIN.on("click", function () {
        const last = localStorage.getItem(LS_LAST);
        const today = todayKey();
        // if (last === today) return; // đã quay

        const idx = pickPrizeIndex();
        const deg = spinToIndex(idx);

        // Hiệu ứng quay
        WHEEL.css({ transition: "transform 3.2s cubic-bezier(.2,.9,.2,1.02)", transform: `rotate(${deg}deg)` });
        // BTN_SPIN.prop("disabled", true); // vô hiệu hóa nút quay

        setTimeout(() => {
            // Xác nhận trúng
            const p = OFFERS[idx];
            // const code = genCode(p.slug); tạo mã promo code (để sau này điền mã giảm)
            const now = Date.now();
            // const exp = now + p.ttlHours * 3600 * 1000; thoi gian ton tai

            // Lưu mã
            const list = loadCoupons();
            list.unshift({ // thêm phần tử vào đầu mảng
                // code,
                id: p.id,
                percent: p.percent,
                startDate: p.startDate || "",
                endDate:  p.endDate  || "",
                resId:  p.resId,
                resTitle: p.resTitle
            });
            saveCoupons(list);
            renderCoupons();

            // Khoá lượt hôm nay
            localStorage.setItem(LS_LAST, today);
            updateDailyState();

            // Modal
            // const meta = `HSD: ${p.ttlHours} giờ • Đơn tối thiểu ${p.min ? (p.min.toLocaleString() + "₫") : "không"}`
            // openModal(p, code, meta);

            // Link dùng ngay (có thể điều hướng theo cửa hàng)
            PRIZE_USE_NOW.attr("href", `/home?store=${encodeURIComponent(p.slug)}`);
        }, 3300);
    });

    MODAL_CLOSE.on("click", closeModal);
    PRIZE_CLOSE.on("click", closeModal);
    MODAL.on("click", (e) => { if (e.target === MODAL[0]) closeModal(); });

    BTN_COPY_CODE.on("click", function () {
        const code = PRIZE_CODE.text().trim();
        navigator.clipboard.writeText(code).then(() => {
            BTN_COPY_CODE.text("Copied");
            setTimeout(()=>BTN_COPY_CODE.text("Copy"), 1200);
        });
    });

    BTN_COPY_ALL.on("click", function () {
        const list = loadCoupons();
        if (!list.length) return;
        const txt = list.map(c => `${c.code} — ${c.title} @ ${c.store} (HSD ${formatDateTime(c.expireAt)})`).join("\n");
        navigator.clipboard.writeText(txt).then(() => {
            BTN_COPY_ALL.text("Copied");
            setTimeout(()=>BTN_COPY_ALL.text("Copy all"), 1200);
        });
    });

    BTN_CLEAR.on("click", function () {
        if (!confirm("Xoá toàn bộ mã đã lưu?")) return;
        saveCoupons([]);
        renderCoupons();
    });

    // Giữ lại transform cuối để wheel không bật ngược khi hover
    WHEEL.on("transitionend", function () {
        const st = getComputedStyle(this).transform;
        this.style.transition = "none";
        this.style.transform = st === "none" ? "" : st;
        // force reflow để transition off áp dụng
        void this.offsetHeight;
    });

});
