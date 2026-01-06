import express from "express";
import { getJson } from "../services/javaClient.js";
import { cacheGet, cacheSet } from "../services/cache.js";

import { detectLang, normalizeBasic } from "../services/langDetect.js";
import { ruToEnQuery } from "../services/ruToEn.js";
import { normalizeQuery, suggestDidYouMean } from "../services/aiQuery.js";

const router = express.Router();

// GET /api/search/smart?q=burger&page=0&size=4&sort=idAsc&tab=all&limitTabs=6
router.get("/smart", async (req, res) => {
    try {
        const authHeader = req.headers["authorization"]; // "Bearer ..."

        // Raw query from client
        const qRaw = (req.query.q || "").toString().trim();

        // EN/RU-only enforcement + normalization
        const lang = detectLang(qRaw);

        if (lang === "invalid" || lang === "mixed") {
            return res.json({
                query: qRaw,
                detectedLang: lang,
                error: "Only English or Russian input is supported",
                suggestion: null,
                tabs: [],
                page: { page: 0, size: 0, totalPages: 0, totalItems: 0 },
                items: [],
            });
        }

        // Normalize + RU->EN mapping (if needed)
        const qBasic = normalizeBasic(qRaw);
        const qForSearch = lang === "ru" ? ruToEnQuery(qBasic) : qBasic;
        const qNorm = normalizeQuery(qForSearch);

        // IMPORTANT:
        // suggestion is ONLY for display in FE.
        // We do NOT retry search using suggestion.
        const suggestion = qNorm ? suggestDidYouMean(qNorm) : null;

        const page = Number(req.query.page ?? 0);
        const size = Number(req.query.size ?? 4);
        const sort = (req.query.sort || "idAsc").toString();

        const tab = (req.query.tab ?? "all").toString(); // "all" or restaurantId
        const restaurantId = tab === "all" ? undefined : tab;

        const minPrice = req.query.minPrice ?? undefined;
        const maxPrice = req.query.maxPrice ?? undefined;
        const freeShip = req.query.freeShip ?? undefined;

        const limitTabs = Number(req.query.limitTabs ?? 6);

        const authKey = authHeader ? authHeader.slice(0, 24) : "anon";
        const cacheKey = JSON.stringify({
            authKey,
            q: qNorm, // cache based on actual query used for search (mapped+normalized)
            lang,
            page,
            size,
            sort,
            tab,
            minPrice,
            maxPrice,
            freeShip,
            limitTabs,
        });

        // check if payload is already in cache -> dont need to call Java
        const cached = cacheGet(cacheKey);
        if (cached) return res.json(cached);

        // Call Java APIs in parallel
        const [foodsRaw, tabsRaw] = await Promise.all([
            getJson(
                "/api/food",
                {
                    q: qNorm || undefined,
                    page,
                    size,
                    sort,
                    restaurantId,
                    minPrice,
                    maxPrice,
                    freeShip,
                },
                authHeader
            ),
            qNorm
                ? getJson("/api/restaurant/tabs", { q: qNorm, limit: limitTabs }, authHeader)
                : Promise.resolve(null),
        ]);

        // Handle different Java response shapes:
        // - wrapper { status, data, success }
        // - already unwrapped
        const foods = foodsRaw?.data ?? foodsRaw;
        const tabsList = tabsRaw ? (Array.isArray(tabsRaw) ? tabsRaw : tabsRaw?.data ?? []) : [];

        const payload = {
            query: qRaw,            // original user query (RU or EN)
            detectedLang: lang,
            normalizedQuery: qNorm, // mapped+normalized query used for search
            suggestion,             // ONLY for FE display
            tabs: tabsList.map((r) => ({ id: r.id, title: r.title, image: r.image ?? null })),
            page: {
                page: foods?.page ?? page,
                size: foods?.size ?? size,
                totalPages: foods?.totalPages ?? 0,
                totalItems: foods?.totalItems ?? 0,
            },
            items: foods?.items ?? [],
        };

        cacheSet(cacheKey, payload, 45_000); // 45 seconds
        return res.json(payload);
    } catch (e) {
        return res.status(500).json({
            error: "nodejs-microservices failed",
            message: e?.message || String(e),
        });
    }
});

export default router;
