import React from "react";
import { Box, Typography } from "@mui/material";

export default function ItemCard({ food }) {
  const img = food?.image ? `${import.meta.env.VITE_BACKEND_BASE}${food.image}` : "";
  const title = food?.title ?? "No title";
  const freeShip = !!food?.freeShip;

  return (
    <Box className="food-card">
      <Box component="img" src={img} alt={title} className="food-card__img" />

      <Box className="food-card__info">
        <Typography className="food-card__title">{title}</Typography>
        {freeShip && <Typography className="badge-menu">Free delivery</Typography>}
      </Box>
    </Box>
  );
}
