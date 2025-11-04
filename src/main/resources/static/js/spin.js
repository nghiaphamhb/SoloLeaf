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
    const SPIN = $("#spinWheel");

    const LS_LAST = "SPIN_LAST_DATE";
    const LS_COUPONS = "SPIN_COUPONS";

    // 8 giải (theo thứ tự lát s0..s7 – 0°..315° mỗi 45°)
    const PRIZES = [
        { label: "-10% K-Burger", store: "K-Burger", type: "percent", value: 10, min: 100000, ttlHours: 48, slug: "kburger" },
        { label: "FreeShip Yakitoriya", store: "Yakitoriya", type: "freeship", value: 1, min: 0, ttlHours: 24, slug: "yakitoriya" },
        { label: "-20% Pizza Loco", store: "Pizza Loco", type: "percent", value: 20, min: 120000, ttlHours: 48, slug: "pizza-loco" },
        { label: "-15k Bún Bò", store: "Bún Bò", type: "amount", value: 15000, min: 60000, ttlHours: 24, slug: "bunbo" },
        { label: "-25% Sushi Zen", store: "Sushi Zen", type: "percent", value: 25, min: 150000, ttlHours: 72, slug: "sushizen" },
        { label: "-30k Gà Rán", store: "Gà Rán", type: "amount", value: 30000, min: 100000, ttlHours: 48, slug: "garan" },
        { label: "-15% Healthy Bar", store: "Healthy Bar", type: "percent", value: 15, min: 80000, ttlHours: 24, slug: "healthy" },
        { label: "🎁 Mystery – Any store", store: "Any store", type: "mystery", value: 1, min: 0, ttlHours: 24, slug: "mystery" }
    ];

    // Helper ngày (yyyy-mm-dd)
    function todayKey() {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${dd}`;
    }


    function loadSlices() {
        try { return JSON.parse(localStorage.getItem(LS_COUPONS) || "[]"); }
        catch { return []; }
    }

    function renderSlices() {
        const list = loadSlices();
        if (!list.length) {
            SPIN.addClass("empty").html(`<p>Chưa có mã — quay để nhận ngay!</p>`);
            return;
        }
        SPIN.removeClass("empty").html(list.map(s => {
            return `<div class="slice s${s.id}"><span>-10%<br>K-Burger</span></div>`;
        }).join(""));
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
        BTN_SPIN.prop("disabled", false).text("Quay ngay");
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

    function pickPrizeIndex() {
        // Có thể gán trọng số nếu muốn. Hiện tại đều nhau.
        return Math.floor(Math.random() * PRIZES.length);
    }

    function spinToIndex(idx) {
        const fullTurns = 6; // quay 6 vòng cho đã
        const sliceAngle = 360 / PRIZES.length; // 45
        // Pointer ở trên (0°). Ta cần đưa "lát trúng" vào vị trí 0° (đầu trên).
        // Lát s0 chiếm 0..45°, s1:45..90°, ... Ta ngắm giữa lát:
        const targetFromZero = idx * sliceAngle + sliceAngle/2; // trung tâm lát
        // Đảo chiều vì CSS rotate theo chiều kim đồng hồ, pointer cố định.
        const targetDeg = fullTurns * 360 + (360 - targetFromZero);
        // Thêm jitter nhỏ ±6° cho tự nhiên
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

    // Sự kiện
    BTN_SPIN.on("click", function () {
        const last = localStorage.getItem(LS_LAST);
        const today = todayKey();
        // if (last === today) return; // đã quay

        const idx = pickPrizeIndex();
        const deg = spinToIndex(idx);

        WHEEL.css({ transition: "transform 3.2s cubic-bezier(.2,.9,.2,1.02)", transform: `rotate(${deg}deg)` });
        BTN_SPIN.prop("disabled", true);

        setTimeout(() => {
            // Xác nhận trúng
            const p = PRIZES[idx];
            const code = genCode(p.slug);
            const now = Date.now();
            const exp = now + p.ttlHours * 3600 * 1000;

            // Lưu mã
            const list = loadCoupons();
            list.unshift({
                code,
                store: p.store,
                title: p.label,
                type: p.type,
                value: p.value,
                min: p.min,
                expireAt: exp
            });
            saveCoupons(list);
            renderCoupons();

            // Khoá lượt hôm nay
            localStorage.setItem(LS_LAST, today);
            updateDailyState();

            // Modal
            const meta = `HSD: ${p.ttlHours} giờ • Đơn tối thiểu ${p.min ? (p.min.toLocaleString() + "₫") : "không"}`
            openModal(p, code, meta);

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

    // Khởi tạo
    renderSlices();
    renderCoupons();
    updateDailyState();

    // Giữ lại transform cuối để wheel không bật ngược khi hover
    WHEEL.on("transitionend", function () {
        const st = getComputedStyle(this).transform;
        this.style.transition = "none";
        this.style.transform = st === "none" ? "" : st;
        // force reflow để transition off áp dụng
        void this.offsetHeight;
    });

});
