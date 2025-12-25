import React from "react";
import { Box } from "@mui/material";

import SideWidget from "../components/sidePanel/SideWidget.jsx";
import CartWidget from "../components/cart/CartWidget.jsx";

import "../styles/sidePanel.css";
import "../styles/cart.css";
import "../styles/home.css";
import "../styles/restaurant.css";
import "../styles/orders.css";

// component layout
export default function MainLayout({ children }) {
  return (
    <Box className="layout">
      <SideWidget />
      {children}
      <CartWidget title="My cart" />
    </Box>
  );
}
