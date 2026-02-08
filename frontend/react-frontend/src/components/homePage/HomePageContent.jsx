import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import RestaurantCard from "./RestaurantCard";
import CategoryMenu from "./CategoryMenu.jsx";
import { apiRequest } from "../../apis/request/apiRequest.js";
import Bugsnag from "../../bugsnag/bugsnag.js";
import { enablePushUnified } from "../../push/pushClient.js";
import { Toast } from "./Toast.jsx";

export default function HomePageContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [restaurants, setRestaurants] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);

  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(true);

  const [errorRestaurants, setErrorRestaurants] = useState("");
  const [errorMenu, setErrorMenu] = useState("");

  //  Order success toast + push prompt
  const [showOrderToast, setShowOrderToast] = useState(false);
  const [orderToastText, setOrderToastText] = useState("");
  const [showPushPrompt, setShowPushPrompt] = useState(false);
  const [pushError, setPushError] = useState("");
  const [pushLoading, setPushLoading] = useState(false);

  // prevent duplicate prompt if component re-renders
  const handledOrderIdRef = useRef(null);

  // load data
  useEffect(() => {
    // Restaurants
    (async () => {
      try {
        setLoadingRestaurants(true);
        setErrorRestaurants("");

        const { data } = await apiRequest(`/api/restaurant`, { method: "GET" });
        setRestaurants(Array.isArray(data) ? data : []);
      } catch (e) {
        setErrorRestaurants("Errors when downloading restaurant lists: " + e.message);
        Bugsnag.notify(new Error(e.message));
      } finally {
        setLoadingRestaurants(false);
      }
    })();

    // Menu categories
    (async () => {
      try {
        setLoadingMenu(true);
        setErrorMenu("");

        const { data } = await apiRequest(`/api/food/category-menu`, { method: "GET" });
        setMenuCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        setErrorMenu("Error when loading menu list: " + e.message);
        Bugsnag.notify(new Error(e.message));
      } finally {
        setLoadingMenu(false);
      }
    })();
  }, []);

  // Handle "orderId" state from PaymentProcessingPage
  useEffect(() => {
    const justOrdered = location.state?.justOrdered;
    const orderId = justOrdered?.orderId;
    if (!orderId) return;

    // avoid duplicate prompt per orderId, not forever
    if (handledOrderIdRef.current === orderId) return;
    handledOrderIdRef.current = orderId;

    setOrderToastText(`Order successfully! Order #${orderId}`);
    setShowOrderToast(true);

    const t = window.setTimeout(() => setShowPushPrompt(true), 1200);

    try {
      window.history.replaceState(null, "", window.location.pathname);
    } catch (e) {
      setErrorMenu("Error when loading homepage: " + e.message);
      Bugsnag.notify(new Error(e.message));
    }

    return () => window.clearTimeout(t);
  }, [location.state]);

  async function onEnablePush() {
    try {
      setPushError("");
      setPushLoading(true);
      await enablePushUnified();
      setShowPushPrompt(false);

      // debug: call api to simulate order's status changing
      // eslint-disable-next-line
      const { data } = await apiRequest(
        `/api/debug/orders/${handledOrderIdRef.current}/simulate/start`,
        { method: "POST" }
      );

      // optional: show a success toast (reuse snackbar)
      setOrderToastText("Enabled order tracking notifications!");
      setShowOrderToast(true);
    } catch (e) {
      setPushError(e?.message || "Enable push failed");
      Bugsnag.notify(new Error(e?.message || "Enable push failed"));
    } finally {
      setPushLoading(false);
    }
  }

  function onDismissPush() {
    setPushError("");
    setShowPushPrompt(false);
  }

  return (
    <Box className="main" component="main">
      <Toast
        showOrderToast={showOrderToast}
        setShowOrderToast={setShowOrderToast}
        orderToastText={orderToastText}
        showPushPrompt={showPushPrompt}
        onDismissPush={onDismissPush}
        onEnablePush={onEnablePush}
        pushLoading={pushLoading}
        pushError={pushError}
      />
      <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
        Discover restaurants
      </Typography>

      {loadingRestaurants && <CircularProgress size={22} />}
      {errorRestaurants && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorRestaurants}
        </Alert>
      )}

      <Box id="feature-restaurant" sx={{ display: "grid", gap: 2 }}>
        {!loadingRestaurants && restaurants.length === 0 ? (
          <Typography sx={{ opacity: 0.8 }}>There are no restaurants.</Typography>
        ) : (
          restaurants.map((r) => (
            <RestaurantCard
              key={r.id}
              restaurant={r}
              onClick={() => navigate(`/restaurant/${r.id}`)}
            />
          ))
        )}
      </Box>

      <Typography variant="h5" fontWeight={800} sx={{ mt: 4, mb: 1 }}>
        Discover foods
      </Typography>

      {loadingMenu && <CircularProgress size={22} />}
      {errorMenu && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMenu}
        </Alert>
      )}

      <Box id="menu-sections" sx={{ display: "grid", gap: 3 }}>
        {!loadingMenu && menuCategories.length === 0 ? (
          <Typography sx={{ opacity: 0.8 }}>No menu data.</Typography>
        ) : (
          menuCategories.map((cat, idx) => <CategoryMenu key={cat?.id ?? idx} category={cat} />)
        )}
      </Box>
    </Box>
  );
}
