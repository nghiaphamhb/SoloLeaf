import React, { useState } from "react";
import { Avatar, Box, Menu, MenuItem, Typography, Divider } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useNavigate } from "react-router-dom";

export default function SideUser({ user, onLogout }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate("/profile");
  };

  const handleLogout = () => {
    handleClose();
    onLogout();
  };
  return (
    <>
      <Box className="user-panel" onClick={handleOpen} sx={{ cursor: "pointer" }}>
        <Box className="user-info">
          <Avatar className="user-avatar" src={user?.imageUrl} alt="User avatar" />
          <Typography className="fullname">{user?.fullname || "Anonymous"}</Typography>
        </Box>
      </Box>

      {/* DROPDOWN MENU */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            width: 160,
          },
        }}
      >
        <MenuItem onClick={handleProfile}>
          <PersonOutlineIcon fontSize="small" />
          <span>Profile</span>
        </MenuItem>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.10)" }} />
        <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
          <LogoutIcon fontSize="small" />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
