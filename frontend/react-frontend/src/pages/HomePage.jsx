import React from 'react';
import FeaturesPanel from "../components/SidePanel/FeaturesPanel.jsx";
import UserPanel from "../components/SidePanel/UserPanel.jsx";
import {Box} from "@mui/material";
import "../styles/sidePanel.css";

export default function HomePage() {
    return (
        <Box className="layout">
            <Box className="sidebar">
                <FeaturesPanel/>
                <UserPanel/>
            </Box>


        </Box>
    );
}