const JAVA_BASE_URL = process.env.VITE_BACKEND_BASE || "http://localhost:8080";

function buildUrl(path, params = {}) {
    const usp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") return;
        usp.set(k, String(v));
    });
    const qs = usp.toString();
    return qs ? `${JAVA_BASE_URL}${path}?${qs}` : `${JAVA_BASE_URL}${path}`;
}

export async function getJson(path, params, authHeader) {
    const url = buildUrl(path, params);

    const headers = { Accept: "application/json" };
    if (authHeader) headers["Authorization"] = authHeader;

    const r = await fetch(url, {
        method: "GET",
        headers,
    });

    if (!r.ok) {
        const txt = await r.text().catch(() => "");
        throw new Error(`Java API ${r.status} ${r.statusText} url=${url} body=${txt}`);
    }

    return await r.json();
}

