// Convert Base64URL (VAPID public key) -> Uint8Array for PushManager.subscribe()
// Example: urlBase64ToUint8Array("BOr...-__") => Uint8Array([...bytes])
function base64UrlToUint8Array(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";

  const bin = atob(s);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

// helper: get value from localStorage
export function getFromLocalStorage() {
  let deviceId = localStorage.getItem("soleaf_device_id");
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("soleaf_device_id", deviceId);
  }

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Missing auth token. Please login first.");
  return { deviceId, token };
}

// enable web push (two variants): WebKit declarative & legacy (Edge/Chrome)
export async function enablePushUnified() {
  if (!window.isSecureContext) {
    throw new Error("Web Push requires HTTPS (secure context).");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission not granted");
  }

  const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  if (!publicKey) throw new Error("Missing VITE_VAPID_PUBLIC_KEY");

  let sub;

  // Path 1: WebKit Declarative (no SW)
  if ("pushManager" in window) {
    sub = await window.pushManager.getSubscription();
    if (!sub) {
      sub = await window.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64UrlToUint8Array(publicKey),
      });
    }
  } else {
    // Path 2: Legacy Push (Edge/Chrome) via Service Worker
    if (!("serviceWorker" in navigator)) {
      throw new Error("Service Worker is not supported in this browser");
    }

    // we have already register sw.js in the main.jsx
    const reg =
      (await navigator.serviceWorker.getRegistration()) ??
      (await navigator.serviceWorker.register("/sw.js"));

    await navigator.serviceWorker.ready;

    sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64UrlToUint8Array(publicKey),
      });
    }
  }

  if (!sub) throw new Error("Failed to obtain push subscription");

  const json = sub.toJSON();
  if (!json?.keys?.p256dh || !json?.keys?.auth) {
    throw new Error("Subscription keys missing (p256dh/auth)");
  }

  const { deviceId, token } = getFromLocalStorage();

  // send subscription to backend
  const res = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      endpoint: sub.endpoint,
      keys: json.keys,
      deviceId,
      userAgent: navigator.userAgent,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Subscribe API failed: ${res.status} ${text}`);
  }

  return sub;
}
