import React, { useEffect, useMemo, useRef, useState } from "react";
import SearchHeader from "./SearchHeader.jsx";
import SearchFilters from "./SearchFilters.jsx";
import SearchResults from "./SearchResults.jsx";
import "../../styles/search.css";
import { apiRequest } from "../../apis/request/apiRequest.js";
import Bugsnag from "../../bugsnag/bugsnag.js";
import RestaurantTabs from "./RestaurantTabs.jsx";
import SearchRankWorker from "../../workers/searchRank.worker.js?worker";

const SEARCH_BASE = import.meta.env.VITE_SEARCH_BASE || "";

// util to add params into origin url
const buildAbsUrl = (path, params = {}) => {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    usp.set(k, String(v));
  });
  const qs = usp.toString();
  return qs ? `${SEARCH_BASE}${path}?${qs}` : `${SEARCH_BASE}${path}`;
};

// get keyword in the search bar after the time
function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);

  return debounced;
}

export default function SearchPageContent() {
  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q, 400);

  const [pageInfo, setPageInfo] = useState({ page: 0, size: 4, totalPages: 0 });
  const [loading, setLoading] = useState(false);

  const [restaurantTabs, setRestaurantTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  const [rankedItems, setRankedItems] = useState([]);

  const [aiMeta, setAiMeta] = useState({
    suggestion: null,
    detectedLang: "en",
    error: "",
  });

  const workerRef = useRef(null);
  const reqIdRef = useRef(0);

  // if worker has already data
  useEffect(() => {
    workerRef.current = new SearchRankWorker();

    workerRef.current.onmessage = (evt) => {
      const { reqId, items: out } = evt.data || {};
      // ignore old responses
      if (reqId !== reqIdRef.current) return;
      setRankedItems(out || []);
    };

    return () => {
      workerRef.current?.terminate?.();
      workerRef.current = null;
    };
  }, []);

  const baseParams = useMemo(() => {
    return { size: 4, sort: "idAsc" };
  }, []);

  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    freeShip: false,
    sort: baseParams.sort, // "idAsc"
  });

  const fetchSmart = async (nextPage, tabValue = activeTab, f = filters) => {
    setLoading(true);
    try {
      // prepare query to call api from nodejs
      const url = buildAbsUrl("/api/search/smart", {
        q: debouncedQ || undefined,
        page: nextPage,
        size: baseParams.size,
        sort: f.sort,
        tab: tabValue, // "all" or restaurantId
        limitTabs: 6,

        minPrice: f.minPrice || undefined,
        maxPrice: f.maxPrice || undefined,
        freeShip: f.freeShip ? true : undefined,
      });

      const data = await apiRequest(url, { method: "GET" });

      setRestaurantTabs(data?.tabs ?? []);

      setAiMeta({
        suggestion: data?.suggestion ?? null,
        detectedLang: data?.detectedLang ?? "en",
        error: data?.error ?? "",
      });

      const rawItems = data?.items ?? [];

      // send to worker
      if (!workerRef.current) {
        setRankedItems(rawItems);
      } else {
        reqIdRef.current += 1;
        const rid = reqIdRef.current;

        workerRef.current.postMessage({
          reqId: rid,
          query: debouncedQ || "",
          items: rawItems,
          options: {
            preferFreeShip: f.freeShip,
            minPrice: f.minPrice || null,
            maxPrice: f.maxPrice || null,
          },
        });

        // const buf = new ArrayBuffer(1024);
        // workerRef.current.postMessage(buf, [buf]);
      }

      setPageInfo({
        page: data?.page?.page ?? nextPage,
        size: data?.page?.size ?? baseParams.size,
        totalPages: data?.page?.totalPages ?? 0,
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setRestaurantTabs([]);
      setRankedItems([]);
      setPageInfo({ page: 0, size: baseParams.size, totalPages: 0 });
      Bugsnag.notify(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
    fetchSmart(0, tabValue, filters);
  };

  const handlePrevPage = () => {
    if (loading) return;
    if (pageInfo.page <= 0) return;
    fetchSmart(pageInfo.page - 1, activeTab, filters);
  };

  const handleNextPage = () => {
    if (loading) return;
    if (pageInfo.page >= pageInfo.totalPages - 1) return;
    fetchSmart(pageInfo.page + 1, activeTab, filters);
  };

  useEffect(() => {
    setActiveTab("all");
    fetchSmart(0, "all", filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  return (
    <div className="search-page">
      <div className="search-page__container">
        <div className="search-page__stack">
          <SearchHeader
            q={q}
            setQ={setQ}
            suggestion={aiMeta.suggestion}
            detectedLang={aiMeta.detectedLang}
            error={aiMeta.error}
          />
          <SearchFilters
            filters={filters}
            onChange={setFilters}
            onApply={() => fetchSmart(0, activeTab, filters)}
            onReset={() => {
              const next = { minPrice: "", maxPrice: "", freeShip: false, sort: baseParams.sort };
              setFilters(next);
              fetchSmart(0, activeTab, next);
            }}
          />
          <RestaurantTabs tabs={restaurantTabs} activeTab={activeTab} onChange={handleTabChange} />
          <SearchResults
            items={rankedItems}
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
