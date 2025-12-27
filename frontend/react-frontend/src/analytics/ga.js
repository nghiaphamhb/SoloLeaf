let initialized = false;

export function initGA() {
  // Only initialize in production builds
  if (!import.meta.env.PROD) return;

  const gaId = import.meta.env.VITE_GA_ID;
  if (!gaId) return;

  if (initialized) return;
  initialized = true;

  // Load gtag script dynamically
  const script1 = document.createElement("script");
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script1);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = window.gtag || gtag;

  window.gtag("js", new Date());

  // Avoid collecting any PII; also you can disable automatic page_view
  // because SPA will send page_view manually on route changes.
  window.gtag("config", gaId, { send_page_view: false });
}

export function trackPageView(path) {
  if (!import.meta.env.PROD) return;

  const gaId = import.meta.env.VITE_GA_ID;
  if (!gaId || typeof window.gtag !== "function") return;

  window.gtag("event", "page_view", {
    page_path: path,
  });
}

export function trackEvent(name, params = {}) {
  if (!import.meta.env.PROD) return;

  if (typeof window.gtag !== "function") return;

  window.gtag("event", name, params);
}
