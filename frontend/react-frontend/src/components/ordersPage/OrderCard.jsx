import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Box, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import orderLogo from "/order.png";

function formatDateTime(iso) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${date}, ${time}`;
}

function statusText(status) {
  if (status === "DELIVERING") return "Delivering";
  if (status === "DONE") return "Done";
  return status ?? "Unknown";
}

export default function OrderCard({ order }) {
  const previewImages = (order.items ?? [])
    .map((it) => it.image)
    .filter(Boolean)
    .slice(0, 6);

  return (
    <Accordion
      className="order-card"
      disableGutters // turn off padding/gutters around accordion
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ width: "100%" }}>
          {/* Header */}
          <Box className="order-header" sx={{ borderRadius: "2rem" }}>
            <Box className="header-left" sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                component="img"
                src={orderLogo}
                alt=""
                sx={{ width: 56, height: 56, borderRadius: "14px", objectFit: "cover" }}
              />

              <Box className="rest-info">
                <Typography variant="h6" sx={{ m: 0 }}>
                  Order #{order.id}
                </Typography>

                <Typography sx={{ m: 0, opacity: 0.85 }}>
                  {formatDateTime(order.createdAt)}
                </Typography>
              </Box>
            </Box>

            <Box
              className="header-right"
              sx={{ display: "flex", alignItems: "flex-end", gap: 1.5, flexDirection: "column" }}
            >
              <Box
                component="span"
                className={`status ${order.status === "DONE" ? "status--done" : "status--delivering"}`}
              >
                {statusText(order.status)}
              </Box>

              <Box component="span" className="total-price">
                {order.totalPrice} ₽
              </Box>
            </Box>
          </Box>

          {/* Body preview row */}
          <Box className="order-body">
            <Box className="body-item" sx={{ display: "flex", gap: 1 }}>
              {previewImages.map((src, idx) => (
                <Box
                  key={`${order.id}-prev-${idx}`}
                  component="img"
                  src={src}
                  alt=""
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "10px",
                    objectFit: "cover",
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </AccordionSummary>

      <AccordionDetails className="order-details">
        <Typography className="order-details__title">This order has the items below:</Typography>

        {(order.items ?? []).map((it) => (
          <div className="order-item-row" key={it.id}>
            <div className="order-item-left">
              <img className="order-item-img" src={it.image} alt="" />
              <div style={{ minWidth: 0 }}>
                <div className="order-item-name">{it.title}</div>
                <div className="order-item-meta">
                  {it.qty} x {it.price} ₽/each
                </div>
              </div>
            </div>

            <div className="order-item-right">
              <div className="order-item-price">{(it.price * it.qty).toFixed(0)} ₽</div>
            </div>
          </div>
        ))}
      </AccordionDetails>
    </Accordion>
  );
}
