// --- Tiny helpers ---
function normalize(s) {
    return (s || "")
        .toString()
        .toLowerCase()
        .trim();
}

// util: split query into keywords (tokens)
function tokenize(q) {
    return normalize(q).split(/\s+/).filter(Boolean);
}

// item ranking
function scoreItem(item, tokens, opts) {
    const title = normalize(item?.title);
    if (!title) return 0;

    let score = 0;

    // 1) Exact/contains token matches
    for (const t of tokens) {
        if (!t) continue;
        if (title === t) score += 50;
        else if (title.startsWith(t)) score += 30;
        else if (title.includes(t)) score += 20;
    }

    // 2) Bonus: freeShip
    if (opts?.preferFreeShip && item?.freeShip) score += 8;

    // 3) Bonus: rating (0..5) -> scale
    const rating = Number(item?.rating ?? 0);
    if (!Number.isNaN(rating)) score += Math.min(5, rating) * 2;

    // 4) Price preference
    const price = Number(item?.price ?? 0);
    if (!Number.isNaN(price)) {
        const min = opts?.minPrice != null ? Number(opts.minPrice) : null;
        const max = opts?.maxPrice != null ? Number(opts.maxPrice) : null;

        if (min != null && price < min) score -= 6;
        if (max != null && price > max) score -= 6;
    }

    return score;
}

// stable tie-breaker: keep original order if we have same foods' scores
function sortWithStableTie(items) {
    return items
        .map((x, idx) => ({ ...x, __idx: idx }))
        .sort((a, b) => {
            if (b.__score !== a.__score) return b.__score - a.__score;  // bigger score 'll be first
            return a.__idx - b.__idx;   // smaller original index 'll be first
        })
        .map(({ __idx, ...rest }) => rest); // remove __idx field
}

// --- Worker entry ---
self.onmessage = (evt) => {
    const msg = evt?.data || {};
    const { reqId, query, items, options } = msg;

    const tokens = tokenize(query);
    const ranked = (items || []).map((it) => {
        const sc = scoreItem(it, tokens, options);
        return { ...it, __score: sc };
    });

    const sorted = sortWithStableTie(ranked);

    self.postMessage({
        reqId,
        items: sorted,
    });
};
