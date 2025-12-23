import React, { useEffect, useState } from "react";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

import RestaurantCard from "./RestaurantCard";
import CategoryMenu from "./CategoryMenu.jsx";
import {apiRequest} from "../../apis/request/apiRequest.js";

export default function HomePageContent() {
    const navigate = useNavigate();

    const [restaurants, setRestaurants] = useState([]);
    const [menuCategories, setMenuCategories] = useState([]);

    const [loadingRestaurants, setLoadingRestaurants] = useState(true);
    const [loadingMenu, setLoadingMenu] = useState(true);

    const [errorRestaurants, setErrorRestaurants] = useState("");
    const [errorMenu, setErrorMenu] = useState("");

    useEffect(() => {
        // Restaurants
        (async () => {
            try {
                setLoadingRestaurants(true);
                setErrorRestaurants("");

                const { data }  = await apiRequest(`/api/restaurant`, { "method": "GET" });
                setRestaurants(Array.isArray(data) ? data : []);
            } catch (e) {
                setErrorRestaurants("Errors when downloading restaurant lists: " + e.message);
            } finally {
                setLoadingRestaurants(false);
            }
        })();

        // Menu categories
        (async () => {
            try {
                setLoadingMenu(true);
                setErrorMenu("");

                const { data } = await apiRequest(`/api/food/category-menu`, { "method": "GET" });
                setMenuCategories(Array.isArray(data) ? data : []);
            } catch (e) {
                setErrorMenu("Error when loading menu list: " + e.message);
            } finally {
                setLoadingMenu(false);
            }
        })();
    }, [navigate]);

    return (
        <Box className="main" component="main">
            <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
                Discover restaurants
            </Typography>

            {loadingRestaurants && <CircularProgress size={22} />}
            {errorRestaurants && <Alert severity="error" sx={{ mb: 2 }}>{errorRestaurants}</Alert>}

            <Box id="feature-restaurant" sx={{ display: "grid", gap: 2 }}>
                {(!loadingRestaurants && restaurants.length === 0) ? (
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
            {errorMenu && <Alert severity="error" sx={{ mb: 2 }}>{errorMenu}</Alert>}

            <Box id="menu-sections" sx={{ display: "grid", gap: 3 }}>
                {(!loadingMenu && menuCategories.length === 0) ? (
                    <Typography sx={{ opacity: 0.8 }}>No menu data.</Typography>
                ) : (
                    menuCategories.map((cat, idx) => (
                        <CategoryMenu key={cat?.id ?? idx} category={cat} />
                    ))
                )}
            </Box>

        </Box>
    );
}
