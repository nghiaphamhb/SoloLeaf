import React from 'react';
import {Box} from "@mui/material";

import FeaturesPanel from "../components/SidePanel/FeaturesPanel.jsx";
import UserPanel from "../components/SidePanel/UserPanel.jsx";
import CartWidget from "../components/ShoppingCart/CartWidget.jsx";

import "../styles/sidePanel.css";
import "../styles/cart.css";

export default function HomePage() {
    return (
        <Box className="layout">
            <Box className="sidebar">
                <FeaturesPanel/>
                <UserPanel/>
            </Box>
            <CartWidget />

        </Box>
    );
}