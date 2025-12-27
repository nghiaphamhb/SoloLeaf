import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Alert,
} from "@mui/material";
import OrderCard from "./OrderCard.jsx";
import { apiRequest } from "../../apis/request/apiRequest.js";
import { toImageUrl } from "../../utils/imageUrl.js";
import Bugsnag from "../../bugsnag/bugsnag.js";

export default function OrdersPageContent() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("ALL"); // ALL | DELIVERING | DONE
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/api/orders/me", { method: "GET" });
        if (!cancelled) setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e?.message ? e.message : "Failed to load orders.");
        Bugsnag.notify(new Error(e.message));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // filter
  const filtered = useMemo(() => {
    if (status === "ALL") return orders;
    return orders.filter((o) => o.status === status);
  }, [orders, status]);

  // Adapter: backend order -> OrderCard order format
  const cardOrders = useMemo(() => {
    return filtered.map((o) => ({
      id: o.id,
      status: o.status,
      totalPrice: o.totalPrice,
      createdAt: o.createDate, // OrderCard expects date-like string

      restaurant: {
        name: o.resName ?? "Unknown restaurant",
        logo: o.resLogo ? toImageUrl(o.resLogo) : ``, // fallback
      },

      items: (o.items ?? []).map((it) => ({
        id: it.id ?? it.foodId ?? `${o.id}-${it.foodId}`, // stable key
        title: it.title,
        qty: it.qty,
        price: it.price,
        image: it.image ? toImageUrl(it.image) : null,
      })),
    }));
  }, [filtered]);

  const handleRepeat = (orderCardFormat) => {
    // TODO later: repeat order -> dispatch to cart, or call backend repeat endpoint
    console.log("repeat order:", orderCardFormat.id);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        My Orders
      </Typography>

      {/* Status tabs (optional but nice) */}
      <Box id="status" sx={{ mb: 2 }}>
        <ToggleButtonGroup exclusive value={status} onChange={(e, v) => v && setStatus(v)}>
          <ToggleButton value="ALL">All</ToggleButton>
          <ToggleButton value="DELIVERING">Delivering</ToggleButton>
          <ToggleButton value="DONE">Done</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {loading && <CircularProgress size={24} />}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && !cardOrders.length && (
        <Typography sx={{ opacity: 0.8 }}>No orders yet.</Typography>
      )}

      {!loading &&
        !error &&
        cardOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onRepeat={handleRepeat}
            className="order-card-box"
          />
        ))}
    </Box>
  );
}
