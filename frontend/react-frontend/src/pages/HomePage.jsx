import React from "react";
import { Box, Typography } from "@mui/material";

import SideWidget from "../components/SidePanel/SideWidget.jsx";
import CartWidget from "../components/Cart/CartWidget.jsx";
import HomeContent from "../components/HomePage/HomeContent.jsx";

import "../styles/sidePanel.css";
import "../styles/cart.css";
import "../styles/home.css";

export default function HomePage() {
    const onLogout = () => {
        localStorage.removeItem("token");
        // navigate("/login") nếu bạn muốn
    };

    return (
        <Box className="layout">
            <SideWidget onLogout={onLogout} />
            <HomeContent />
            <CartWidget count={0} title="My cart" />
        </Box>
    );
}
