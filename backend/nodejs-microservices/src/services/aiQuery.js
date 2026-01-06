export function normalizeQuery(q) {
    return (q || "")
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
}

// Levenshtein distance (typo detection)
function levenshtein(a, b) {
    const s = a || "";
    const t = b || "";
    const n = s.length;
    const m = t.length;
    if (n === 0) return m;
    if (m === 0) return n;

    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = 0; i <= n; i++) dp[i][0] = i;
    for (let j = 0; j <= m; j++) dp[0][j] = j;

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            const cost = s[i - 1] === t[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost
            );
        }
    }

    return dp[n][m];
}

// Vocabulary for suggestions (extend as you wish)
const VOCAB = [
    "burger",
    "hamburger",
    "pho",
    "bun",
    "chicken",
    "ramen",
    "candy",
    "sandwich",
    "soup",
    "pelmeni",
    "roll",
    "superset",
    "fries",
    "spicy",
    "hot",
];

export function suggestDidYouMean(q) {
    const nq = normalizeQuery(q);
    if (!nq) return null;

    const tokens = nq.split(" ").filter(Boolean);
    if (tokens.length === 0) return null;

    const first = tokens[0];

    let best = null;
    let bestDist = Infinity;

    for (const w of VOCAB) {
        const d = levenshtein(first, w);
        if (d < bestDist) {
            bestDist = d;
            best = w;
        }
    }

    // Small typo threshold (tweak if needed)
    if (!best) return null;
    if (best === first) return null;

    // Keep it conservative: only suggest for small typos
    if (bestDist <= 2) {
        return [best, ...tokens.slice(1)].join(" ");
    }

    return null;
}
