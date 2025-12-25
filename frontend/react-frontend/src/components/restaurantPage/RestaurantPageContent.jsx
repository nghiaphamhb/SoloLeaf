import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Alert, Typography } from "@mui/material";
import "../../styles/restaurant.css";
import RestaurantInfo from "./RestaurantInfo.jsx";
import CategorySubnav from "./CategorySubnav.jsx";
import MenuFood from "./MenuFood.jsx";
import { apiRequest } from "../../apis/request/apiRequest.js";
import { useDispatch } from "react-redux";
import { addItem } from "../../store/cartSlice.js";

export default function RestaurantPageContent({ resId }) {
  // send action to the reducer of store
  const dispatch = useDispatch();
  const handleAddToCart = (food) => {
    if (!food) return;

    dispatch(
      addItem({
        ...food,
        restId: restaurant?.id ?? "UNKNOWN",
        restName: restaurant?.title ?? restaurant?.name ?? "UNKNOWN",
      })
    );
  };

  const [restaurant, setRestaurant] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!resId) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await apiRequest(`/api/restaurant/detail/${resId}`, { method: "GET" });

        if (!cancelled) {
          setRestaurant(data ?? null);
          setActiveTab(0);
        }
      } catch (e) {
        if (!cancelled) setError("Errors when downloading restaurant page: " + e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [resId]);

  const categories = restaurant?.categories ?? [];
  const currentCategory = categories[activeTab] ?? null;
  const items = currentCategory?.foodList ?? [];

  return (
    <Box component="main" className="restaurant-page">
      {loading && <CircularProgress size={22} />}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && !restaurant ? (
        <Typography sx={{ opacity: 0.8 }}>This restaurant does not exist.</Typography>
      ) : null}

      {!loading && restaurant ? (
        <>
          <RestaurantInfo restaurant={restaurant} />

          <CategorySubnav
            categories={categories}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <MenuFood items={items} onAddToCart={handleAddToCart} />
        </>
      ) : null}
    </Box>
  );
}
