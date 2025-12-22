import React from "react";
import { Box, Typography } from "@mui/material";

import SideWidget from "../components/SidePanel/SideWidget.jsx";
import CartWidget from "../components/Cart/CartWidget.jsx";

import "../styles/sidePanel.css";
import "../styles/cart.css";

export default function HomePage() {
    const onLogout = () => {
        localStorage.removeItem("token");
        // navigate("/login") nếu bạn muốn
    };

    return (
        <Box className="layout">
            <SideWidget onLogout={onLogout} />

            <Box className="main" sx={{ p: 3 }}>
                <Typography variant="h4" fontWeight={800}>
                    Home
                </Typography>
            </Box>

            <CartWidget count={0} title="My cart" />
        </Box>
    );
}
