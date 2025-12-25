import React from "react";
import { Box, Button, Typography } from "@mui/material";

export default function SideUser({ user, onLogout }) {
  return (
    <Box className="user-panel">
      <Box className="user-info">
        <Typography className="fullname">💠 {user?.fullname || "Anonymous"}</Typography>

        <Typography className="email">{user?.email || "anonymous@email.com"}</Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button className="logout-btn" title="Logout" onClick={onLogout}>
          Logout
        </Button>
      </Box>
    </Box>
  );
}
