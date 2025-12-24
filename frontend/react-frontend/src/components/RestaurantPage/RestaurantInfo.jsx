import React from "react";
import { Avatar, Box, Card, CardContent, Chip, Typography } from "@mui/material";

export default function RestaurantInfo({ restaurant }) {
  const img = restaurant?.image ? `${import.meta.env.VITE_BACKEND_BASE}${restaurant.image}` : "";

  return (
    <Card id="restaurant-header" className="restaurant-header" elevation={0}>
      <Box className="restaurant-header__logo">
        <Avatar src={img} alt="Restaurant logo" className="restaurant-header__avatar" />
      </Box>

      <CardContent className="restaurant-header__info">
        <Box className="restaurant-header__top">
          <Box>
            <Typography variant="h5" className="restaurant-header__name" id="rest-name">
              {restaurant.title ?? "—"}
            </Typography>

            <Typography variant="body2" className="restaurant-header__subtitle" id="rest-subtitle">
              {restaurant.subtitle ?? "—"}
            </Typography>
          </Box>

          <Box className="restaurant-header__badges" id="rest-badges">
            {(restaurant.badges ?? []).map((b, idx) => (
              <Chip
                key={idx}
                label={b.label}
                size="small"
                className={`rest-badge rest-badge--${b.type || "default"}`}
              />
            ))}
          </Box>

          {!!restaurant.desc && (
            <Typography variant="body2" className="restaurant-header__desc" id="rest-desc">
              {restaurant.desc}
            </Typography>
          )}

          <Box className="restaurant-header__meta">
            <Typography variant="body2" className="restaurant-header__rating">
              <span id="rest-rating">
                {Number.isFinite(Number(restaurant?.rating)) ? restaurant.rating : "-"}
              </span>{" "}
              ratings
            </Typography>

            <Typography variant="body2" className="restaurant-header__address">
              <span id="rest-address">{restaurant.address ?? "—"}</span>
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
