import React from 'react';
import {Box, Button, Stack, Typography} from "@mui/material";
import leaf from "/leaf.png";
import { Link } from "react-router-dom";

export default function FeaturesPanel() {
    // const navigate = useNavigate();
    //
    // // Optional: call backend when user clicks a menu item (for logging/analytics)
    // const pingBackend = async (eventName) => {
    //     try {
    //         // NOTE: adjust endpoint to your backend
    //         await fetch(`${import.meta.env.VITE_BACKEND_BASE}/api/ui-events`, {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ event: eventName, ts: Date.now() }),
    //         });
    //     } catch (_) {
    //         // ignore logging errors
    //     }
    // };
    //
    // const onMenuClick = async (path, eventName) => {
    //     // If you truly want a request on every click:
    //     await pingBackend(eventName);
    //     navigate(path);
    // };
    return (
        <Box>
            <Box className="brand-logo">
                <Box
                    component="img"
                    src={leaf}
                    alt="App logo"/>
            </Box>

            <Box className="sidebar-content">
                <Typography
                    variant="h4"
                    className="sidebar-title"
                >Menu
                </Typography>
                <Stack spacing={0.5}>
                    <Button
                        className="sidebar-item-btn"
                        // onClick={() => onMenuClick("/home", "menu_home")}
                    >
                        <span className="sidebar-icon">🏠</span>
                        <span className="sidebar-text">Home</span>
                    </Button>

                    <Button
                        className="sidebar-item-btn"
                        // onClick={() => onMenuClick("/search", "menu_search")}
                    >
                        <span className="sidebar-icon">🔍</span>
                        <span className="sidebar-text">Search</span>
                    </Button>

                    <Button
                        className="sidebar-item-btn"
                        // onClick={() => onMenuClick("/favourites", "menu_favourites")}
                    >
                        <span className="sidebar-icon">⭐️</span>
                        <span className="sidebar-text">Favourites</span>
                    </Button>

                    <Button
                        className="sidebar-item-btn"
                        // onClick={() => onMenuClick("/orders", "menu_orders")}
                    >
                        <span className="sidebar-icon">🚴</span>
                        <span className="sidebar-text">Orders</span>
                    </Button>

                    <Button
                        className="sidebar-item-btn"
                        // onClick={() => onMenuClick("/messages", "menu_messages")}
                    >
                        <span className="sidebar-icon">✉️</span>
                        <span className="sidebar-text">Messages</span>
                    </Button>

                    <Button
                        className="sidebar-item-btn"
                        // onClick={() => onMenuClick("/spin", "menu_lucky_spin")}
                    >
                        <span className="sidebar-icon">🎁</span>
                        <span className="sidebar-text">Lucky Spin</span>
                    </Button>

                    <Button
                        className="sidebar-item-btn"
                        // onClick={() => onMenuClick("/profile", "menu_profile")}
                    >
                        <span className="sidebar-icon">⚙️</span>
                        <span className="sidebar-text">Profile</span>
                    </Button>
                </Stack>
            </Box>
        </Box>
        );
}