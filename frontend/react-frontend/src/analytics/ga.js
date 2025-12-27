let initialized = false;
let queue = []; // events fired before gtag is ready

function isProd() {
  // Vite sets PROD true only for production build
  return Boolean(import.meta.env.PROD);
}

function getGaId() {
  return import.meta.env.VITE_GA_ID;
}

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function flushQueue() {
  if (!isBrowser()) return;
  if (typeof window.gtag !== "function") return;

  const q = queue;
  queue = [];
  for (const item of q) {
    try {
      window.gtag(...item);
    } catch (e) {
      console.error(e);
    }
  }
}

export function initGA() {
  // Only initialize in production builds
  if (!isProd()) return;

  const gaId = getGaId();
  if (!gaId) return;

  // Must be in browser
  if (!isBrowser()) return;

  if (initialized) return;
  initialized = true;

  try {
    // 1) Load gtag script dynamically (avoid duplicates)
    const existing = document.querySelector(
      `script[src*="googletagmanager.com/gtag/js?id=${gaId}"]`
    );
    if (!existing) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
      script.onload = () => {
        // once loaded, flush queued events
        flushQueue();
      };
      document.head.appendChild(script);
    }

    // 2) Initialize dataLayer + gtag (safe)
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = window.gtag || gtag;

    // 3) Boot GA
    window.gtag("js", new Date());

    // Disable auto page_view because SPA will send manually on route changes
    window.gtag("config", gaId, { send_page_view: false });

    // In case script already loaded very fast
    flushQueue();
  } catch (e) {
    // Never block rendering

    console.log("[ga] init failed:", e);
  }
}

export function trackPageView(path) {
  if (!isProd()) return;

  const gaId = getGaId();
  if (!gaId) return;

  if (!isBrowser()) return;

  try {
    const payload = ["event", "page_view", { page_path: String(path || "/") }];

    if (typeof window.gtag === "function") {
      window.gtag(...payload);
    } else {
      // queue until gtag is ready
      queue.push(payload);
    }
  } catch (e) {
    console.log("[ga] trackPageView failed:", e);
  }
}

export function trackEvent(name, params = {}) {
  if (!isProd()) return;

  const gaId = getGaId();
  if (!gaId) return;

  if (!isBrowser()) return;

  try {
    const safeName = String(name || "").trim();
    if (!safeName) return;

    const payload = ["event", safeName, { ...params }];

    if (typeof window.gtag === "function") {
      window.gtag(...payload);
    } else {
      queue.push(payload);
    }
  } catch (e) {
    console.log("[ga] trackEvent failed:", e);
  }
}
