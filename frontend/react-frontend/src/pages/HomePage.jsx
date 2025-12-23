import React from "react";
import { Box } from "@mui/material";

import SideWidget from "../components/SidePanel/SideWidget.jsx";
import CartWidget from "../components/Cart/CartWidget.jsx";
import HomePageContent from "../components/HomePage/HomePageContent.jsx";

import "../styles/sidePanel.css";
import "../styles/cart.css";
import "../styles/home.css";

export default function HomePage() {
    return (
        <Box className="layout">
            <SideWidget/>
            <HomePageContent/>
            <CartWidget count={0} title="My cart" />
        </Box>
    );
}
