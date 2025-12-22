import React from "react";
import { Box, Typography } from "@mui/material";
import FoodItemCard from "./ItemCard";

export default function CategorySection({ category }) {
    const name = category?.name ?? "Category";
    const foods = Array.isArray(category?.foodList) ? category.foodList : [];

    return (
        <Box className="menu-section">
            <Typography className="menu-section__title">{name}</Typography>

            <Box className="menu-items">
                {foods.map((food, idx) => (
                    <FoodItemCard key={food?.id ?? idx} food={food} />
                ))}
            </Box>
        </Box>
    );
}
