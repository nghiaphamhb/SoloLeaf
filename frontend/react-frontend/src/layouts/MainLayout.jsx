import React from "react";
import { Box } from "@mui/material";

import SideWidget from "../components/SidePanel/SideWidget.jsx";
import CartWidget from "../components/Cart/CartWidget.jsx";

import "../styles/sidePanel.css";
import "../styles/cart.css";
import "../styles/home.css";
import "../styles/restaurant.css";

export default function MainLayout( {children} ) {
    return (
        <Box className="layout">
            <SideWidget/>
            {children}
            <CartWidget count={0} title="My cart" />
        </Box>
    );
}