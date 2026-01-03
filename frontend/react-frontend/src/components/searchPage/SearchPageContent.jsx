import React, {useEffect, useMemo, useState} from "react";
import SearchHeader from "./SearchHeader.jsx";
import SearchFilters from "./SearchFilters.jsx";
import SearchResults from "./SearchResults.jsx";
import "../../styles/search.css";
import {apiRequest} from "../../apis/request/apiRequest.js";
import Bugsnag from "../../bugsnag/bugsnag.js";

function useDebouncedValue(value, delayMs) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(t);
    }, [value, delayMs])

    return debounced;
}

// util to add params into origin url
function buildUrl(path, params = {}) {
    const usp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") return;
        usp.set(k, String(v));
    });
    const qs = usp.toString();
    return qs ? `${path}?${qs}` : path;
}

export default function SearchPageContent() {
    const [q, setQ] = useState("");
    const debouncedQ = useDebouncedValue(q, 400);

    const [items, setItems] = useState([]);
    const [pageInfo, setPageInfo] = useState({ page: 0, size: 6, totalPages: 0 });
    const [loading, setLoading] = useState(false);

    const baseParams = useMemo(() => {
        return { size: 6, sort: "idAsc" };
    }, []);

    // Fetch page 0 when query changes
    useEffect(() => {
        const run = async () => {
            setLoading(true);
            try {
                const url = buildUrl("/api/food", {
                    q: debouncedQ || undefined,
                    page: 0,
                    size: baseParams.size,
                    sort: baseParams.sort,
                });

                const res = await apiRequest(url, { method: "GET" });

                const data = res?.data; // ResponseData -> data
                const newItems = data?.items ?? [];
                setItems(newItems);

                setPageInfo({
                    page: data?.page ?? 0,
                    size: data?.size ?? baseParams.size,
                    totalPages: data?.totalPages ?? 0,
                });
            } catch (e) {
                setItems([]);
                setPageInfo({ page: 0, size: baseParams.size, totalPages: 0 });
                Bugsnag.notify(e);
            } finally {
                setLoading(false);
            }
        };

        run();
    }, [debouncedQ, baseParams.size, baseParams.sort]);

    const handleLoadMore = async () => {
        const nextPage = (pageInfo.page ?? 0) + 1;
        if (nextPage >= pageInfo.totalPages) return;

        setLoading(true);
        try {
            const url = buildUrl("/api/food", {
                q: debouncedQ || undefined,
                page: nextPage,
                size: pageInfo.size,
                sort: baseParams.sort,
            });

            const res = await apiRequest(url, { method: "GET" });

            const data = res?.data;
            const moreItems = data?.items ?? [];

            setItems((prev) => [...prev, ...moreItems]);
            setPageInfo((prev) => ({
                ...prev, // old states
                page: data?.page ?? nextPage,
                totalPages: data?.totalPages ?? prev.totalPages,
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-page">
            <div className="search-page__container">
                <div className="search-page__stack">
                    <SearchHeader q={q} setQ={setQ}/>
                    <SearchFilters />
                    <SearchResults
                        items={items}
                        loading={loading}
                        page={pageInfo.page}
                        totalPages={pageInfo.totalPages}
                        onLoadMore={handleLoadMore}
                    />
                </div>
            </div>
        </div>
    );
}
