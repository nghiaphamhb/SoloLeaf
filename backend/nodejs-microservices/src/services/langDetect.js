export function detectLang(q) {
    const s = (q || "").trim();
    if (!s) return "empty";

    const hasCyr = /[А-Яа-яЁё]/.test(s);
    const hasLat = /[A-Za-z]/.test(s);

    // Allow digits + spaces + basic punctuation
    const hasOther = /[^0-9A-Za-zА-Яа-яЁё\s\-']/g.test(s);

    if (hasOther) return "invalid";
    if (hasCyr && !hasLat) return "ru";
    if (hasLat && !hasCyr) return "en";

    // Mixed scripts (e.g., "бурger") -> treat as invalid or pick one strategy
    return "mixed";
}

export function normalizeBasic(q) {
    return (q || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
}
