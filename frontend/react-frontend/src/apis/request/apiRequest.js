/* Generic async request helper that attaches Bearer token automatically (if token exists). */
/* Return JSON data */
import Bugsnag from "../../bugsnag/bugsnag.js";

export async function apiRequest(url, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  //  it attaches Bearer token if localStorage has
  const token = localStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });

  // Handle common auth failure
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token");
    Bugsnag.notify(new Error("Unauthorized"));
  }

  const text = await res.text(); // res & res.text are promises
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg = data?.message || `Request failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    Bugsnag.notify(err);
  }

  return data;
}
