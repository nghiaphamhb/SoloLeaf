import React from "react";
import { Box, Typography } from "@mui/material";
import ItemCard from "./ItemCard";

export default function CategoryMenu({ category }) {
    const name = category?.name ?? "Category";
    const foods = Array.isArray(category?.foodList) ? category.foodList : [];

    return (
        <Box className="menu-section">
            <Typography variant="h6" className="menu-section__title">{name}</Typography>

            <Box className="menu-items">
                {foods.map((food, idx) => (
                    <ItemCard key={food?.id ?? idx} food={food} />
                ))}
            </Box>
        </Box>
    );
}
