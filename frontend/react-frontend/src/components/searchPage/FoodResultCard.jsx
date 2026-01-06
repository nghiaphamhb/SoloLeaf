import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import { toImageUrl } from "../../utils/imageUrl.js";

export default function FoodResultCard({ food }) {
  const imageUrl = food?.image ? toImageUrl(food.image) : "";

  return (
    <Card className="food-card" variant="outlined">
      <CardActionArea>
        <CardMedia
          className="food-card__media"
          component="img"
          image={imageUrl}
          alt={food?.title || "Food"}
        />
        <CardContent className="food-card__content">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <Typography className="food-card__title" noWrap>
              {food?.title || "Untitled"}
            </Typography>
            <Typography className="food-card__price">{food?.price ?? 0}₽</Typography>
          </div>

          <div
            className="food-card__chips"
            style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}
          >
            {food?.freeShip ? <Chip size="small" label="Free ship" /> : null}
            {food?.timeShip ? <Chip size="small" label={food.timeShip} /> : null}
            <Chip size="small" label={`★ ${food?.rating ?? 0}`} />
          </div>
        </CardContent>
      </CardActionArea>
      <div
        className="food-card__footer"
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}
      >
        <Button size="small" variant="contained">
          Add
        </Button>
      </div>
    </Card>
  );
}
