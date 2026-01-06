import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import leaf from "/leaf.png";

export default function SideFeatures() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const go = (path) => navigate(path);

  const isActive = (path) => pathname === path;

  return (
    <Box>
      <Box className="brand-logo">
        <Box component="img" src={leaf} alt="App logo" />
      </Box>

      <Box className="sidebar-content">
        <Typography variant="h4" className="sidebar-title">
          Menu
        </Typography>

        <Stack spacing={0.5}>
          <Button
            className="sidebar-item-btn"
            onClick={() => go("/home")}
            data-active={isActive("/home")}
          >
            <span className="sidebar-icon">🏠</span>
            <span className="sidebar-text">Home</span>
          </Button>

          <Button
            className="sidebar-item-btn"
            onClick={() => go("/search")}
            data-active={isActive("/search")}
          >
            <span className="sidebar-icon">🔍</span>
            <span className="sidebar-text">Search</span>
          </Button>

          {/*<Button*/}
          {/*  className="sidebar-item-btn"*/}
          {/*  onClick={() => go("/favourites")}*/}
          {/*  data-active={isActive("/favourites")}*/}
          {/*>*/}
          {/*  <span className="sidebar-icon">⭐️</span>*/}
          {/*  <span className="sidebar-text">Favourites</span>*/}
          {/*</Button>*/}

          <Button
            className="sidebar-item-btn"
            onClick={() => go("/orders")}
            data-active={isActive("/orders")}
          >
            <span className="sidebar-icon">🚴</span>
            <span className="sidebar-text">Orders</span>
          </Button>

          {/*<Button*/}
          {/*  className="sidebar-item-btn"*/}
          {/*  onClick={() => go("/messages")}*/}
          {/*  data-active={isActive("/messages")}*/}
          {/*>*/}
          {/*  <span className="sidebar-icon">✉️</span>*/}
          {/*  <span className="sidebar-text">Messages</span>*/}
          {/*</Button>*/}

          <Button
            className="sidebar-item-btn"
            onClick={() => go("/spin")}
            data-active={isActive("/spin")}
          >
            <span className="sidebar-icon">🎁</span>
            <span className="sidebar-text">Lucky Spin</span>
          </Button>

          {/*<Button*/}
          {/*  className="sidebar-item-btn"*/}
          {/*  onClick={() => go("/profile")}*/}
          {/*  data-active={isActive("/profile")}*/}
          {/*>*/}
          {/*  <span className="sidebar-icon">⚙️</span>*/}
          {/*  <span className="sidebar-text">Profile</span>*/}
          {/*</Button>*/}
        </Stack>
      </Box>
    </Box>
  );
}
