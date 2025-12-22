import React from "react";
import { Box, Typography } from "@mui/material";

import SideWidget from "../components/SidePanel/SideWidget.jsx";
import CartWidget from "../components/Cart/CartWidget.jsx";
import HomeContent from "../components/HomePage/HomeContent.jsx";

import "../styles/sidePanel.css";
import "../styles/cart.css";
import "../styles/home.css";
import {useNavigate} from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <Box className="layout">
            <SideWidget onLogout={onLogout} />
            <HomeContent />
            <CartWidget count={0} title="My cart" />
        </Box>
    );
}
