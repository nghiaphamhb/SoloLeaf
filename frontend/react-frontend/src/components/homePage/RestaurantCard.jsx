import React from "react";
import { Box, Typography } from "@mui/material";
import { toImageUrl } from "../../utils/imageUrl.js";

export default function RestaurantCard({ restaurant, onClick }) {
  const img = restaurant?.image ? toImageUrl(restaurant.image) : "";

  const title = restaurant?.title ?? "No title";
  const subtitle = restaurant?.subtitle ?? "";
  const rating = typeof restaurant?.rating === "number" ? restaurant.rating.toFixed(1) : "—";
  const freeship = !!restaurant?.freeship;

  return (
    <Box onClick={onClick} className="restaurant-card">
      <Box component="img" src={img} alt={title} className="restaurant-card__img" />

      <Box className="restaurant-card__info">
        <Typography variant="h5" className="restaurant-card__title">
          {title}
        </Typography>
        <Typography className="restaurant-card__subtitle">{subtitle}</Typography>
        <Typography className="restaurant-card__rating">{rating}</Typography>
        <Typography variant="body2" className="badge-freeship">
          {freeship ? "Free ship" : ""}
        </Typography>
      </Box>
    </Box>
  );
}
