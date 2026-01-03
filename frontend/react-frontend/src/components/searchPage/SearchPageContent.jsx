import React, { useEffect, useMemo, useState } from "react";
import SearchHeader from "./SearchHeader.jsx";
import SearchFilters from "./SearchFilters.jsx";
import SearchResults from "./SearchResults.jsx";
import "../../styles/search.css";
import { apiRequest } from "../../apis/request/apiRequest.js";
import Bugsnag from "../../bugsnag/bugsnag.js";
import RestaurantTabs from "./RestaurantTabs.jsx";

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

  const [restaurantTabs, setRestaurantTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  const baseParams = useMemo(() => {
    return { size: 4, sort: "idAsc" };
  }, []);

  const fetchTabs = async () => {
    try {
      if (!debouncedQ) {
        setRestaurantTabs([]);
        setActiveTab("all");
        return;
      }

      const url = buildUrl("/api/restaurant/tabs", {
        q: debouncedQ,
        limit: 6,
      });

      const res = await apiRequest(url, { method: "GET" });

      const payload = res?.data;

      const list = Array.isArray(payload) ? payload : [];

      const tabs = list.map((r) => ({
        id: r.id,
        title: r.title,
        image: r.image ?? null,
      }));

      setRestaurantTabs(tabs);

      // Nếu tab đang chọn không còn trong tabs -> reset về All
      if (activeTab !== "all" && !tabs.some((t) => String(t.id) === String(activeTab))) {
        setActiveTab("all");
      }
    } catch (e) {
      setRestaurantTabs([]);
      setActiveTab("all");
      Bugsnag.notify(e);
    }
  };

  const fetchFoods = async (nextPage, tabValue = activeTab) => {
    setLoading(true);
    try {
      const url = buildUrl("/api/food", {
        q: debouncedQ || undefined,
        restaurantId: tabValue === "all" ? undefined : tabValue,
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

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
    fetchFoods(0, tabValue);
  };

  const handlePrevPage = () => {
    if (loading) return;
    if (pageInfo.page <= 0) return;
    fetchFoods(pageInfo.page - 1, activeTab);
  };

  const handleNextPage = () => {
    if (loading) return;
    if (pageInfo.page >= pageInfo.totalPages - 1) return;
    fetchFoods(pageInfo.page + 1, activeTab);
  };

  useEffect(() => {
    fetchTabs(); // cập nhật danh sách restaurants theo query
    fetchFoods(0, "all"); // query mới thì reset về All trang 0
    setActiveTab("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  return (
    <div className="search-page">
      <div className="search-page__container">
        <div className="search-page__stack">
          <SearchHeader q={q} setQ={setQ} />
          <SearchFilters />
          <RestaurantTabs tabs={restaurantTabs} activeTab={activeTab} onChange={handleTabChange} />
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
