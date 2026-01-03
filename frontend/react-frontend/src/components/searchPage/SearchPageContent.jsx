import React, { useEffect, useMemo, useState } from "react";
import SearchHeader from "./SearchHeader.jsx";
import SearchFilters from "./SearchFilters.jsx";
import SearchResults from "./SearchResults.jsx";
import "../../styles/search.css";
import { apiRequest } from "../../apis/request/apiRequest.js";
import Bugsnag from "../../bugsnag/bugsnag.js";

function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);

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
  const [pageInfo, setPageInfo] = useState({ page: 0, size: 4, totalPages: 0 });
  const [loading, setLoading] = useState(false);

  const baseParams = useMemo(() => {
    return { size: 4, sort: "idAsc" };
  }, []);

  const fetchFoods = async (nextPage) => {
    setLoading(true);
    try {
      const url = buildUrl("/api/food", {
        q: debouncedQ || undefined,
        page: nextPage,
        size: baseParams.size,
        sort: baseParams.sort,
      });

      const res = await apiRequest(url, { method: "GET" });

      const data = res?.data;
      setItems(data?.items ?? []);

      setPageInfo({
        page: data?.page ?? nextPage,
        size: data?.size ?? baseParams.size,
        totalPages: data?.totalPages ?? 0,
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setItems([]);
      setPageInfo({ page: 0, size: baseParams.size, totalPages: 0 });
      Bugsnag.notify(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, baseParams.size, baseParams.sort]);

  const handlePrevPage = () => {
    if (loading) return;
    const p = pageInfo.page ?? 0;
    if (p <= 0) return;
    fetchFoods(p - 1);
  };

  const handleNextPage = () => {
    if (loading) return;
    const p = pageInfo.page ?? 0;
    const total = pageInfo.totalPages ?? 0;
    if (total <= 0) return;
    if (p >= total - 1) return;
    fetchFoods(p + 1);
  };

  return (
    <div className="search-page">
      <div className="search-page__container">
        <div className="search-page__stack">
          <SearchHeader q={q} setQ={setQ} />
          <SearchFilters />
          <SearchResults
            items={items}
            loading={loading}
            page={pageInfo.page}
            totalPages={pageInfo.totalPages}
            onPrev={handlePrevPage}
            onNext={handleNextPage}
          />
        </div>
      </div>
    </div>
  );
}
