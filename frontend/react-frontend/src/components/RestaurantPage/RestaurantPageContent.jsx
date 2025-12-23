import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Alert, Typography } from "@mui/material";
import "../../styles/restaurant.css";
import RestaurantInfo from "./RestaurantInfo.jsx";
import CategorySubnav from "./CategorySubnav.jsx";
import MenuFood from "./MenuFood.jsx";

export default function RestaurantPageContent({
                                                  resId,
                                                  onAddToCart,
                                              }) {
    const [restaurant, setRestaurant] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!resId) return;

        const token = localStorage.getItem("token");
        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                setError("");

                const res = await fetch(`/api/restaurant/detail/${resId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();

                if (!cancelled) {
                    setRestaurant(json?.data ?? null);
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

    console.log(categories);

    return (
        <Box component="main" className="restaurant-page">
            {loading && <CircularProgress size={22} />}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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

                    <MenuFood items={items} onAddToCart={onAddToCart} />
                </>
            ) : null}
        </Box>
    );
}
