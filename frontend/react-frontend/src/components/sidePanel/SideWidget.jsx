import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import SideFeatures from "./SideFeatures";
import SideUser from "./SideUser";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../apis/request/apiRequest.js";
import { clearCartStorage } from "../../store/cartPersist.js";
import { clearCart } from "../../store/cartSlice.js";
import { useDispatch } from "react-redux";
import Bugsnag from "../../bugsnag.js";

export default function SideWidget() {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearCart());
    clearCartStorage();
    navigate("/login");
  };

  useEffect(() => {
    let cancelled = false;

    async function loadMe() {
      try {
        const { data } = await apiRequest("/api/user/me", {
          method: "GET",
        });

        // Your backend shape: { status, description, data, true }
        if (!cancelled) {
          setUser(data ?? null);
        }
      } catch (e) {
        console.error(e);
        Bugsnag.notify(new Error(e.message));
        if (!cancelled) setUser(null);
      }
    }

    void (async () => {
      await loadMe();
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box className="sidebar">
      <SideFeatures />
      <Box>
        <SideUser user={user} onLogout={onLogout} />
      </Box>
    </Box>
  );
}
