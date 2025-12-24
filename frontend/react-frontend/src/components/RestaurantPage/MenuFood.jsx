import React from "react";
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    Grid,
    Typography,
} from "@mui/material";

export default function MenuFood({ items, onAddToCart }) {
    return (
        <Box id="menu-section" className="menu-section">
            <Box id="menu-grid" className="menu-grid">
                <Grid container spacing={2} className="menu-grid__container">
                    {items.map((it) => {
                        const imgSrc = it?.image
                            ? `${import.meta.env.VITE_BACKEND_BASE}${it.image}`
                            : "";

                        return (
                            <Grid key={it.id} item xs={12} sm={6} md={3} lg={3} xl={3} sx={{ width: "200px" }}>
                                <Card className="menu-card" elevation={0}>
                                    {/* clickable area (button) BUT it does NOT contain the Add button anymore */}
                                    <CardActionArea className="menu-card__action">
                                        <Box className="menu-card__media">
                                            <CardMedia
                                                component="img"
                                                image={imgSrc}
                                                alt={it.title || "Food image"}
                                                className="menu-card__img"
                                            />
                                        </Box>

                                        <CardContent className="menu-card__body">
                                            <Box className="menu-card__header">
                                                <Typography className="menu-card__title">
                                                    {it.title ?? "—"}
                                                </Typography>

                                                {it.badge ? (
                                                    <Chip size="small" label={it.badge} className="menu-card__badge" />
                                                ) : null}
                                            </Box>

                                            <Box className="menu-card__meta">
                                                <span className="menu-card__star">⭐</span>
                                                <span>{typeof it.rating === "number" ? it.rating.toFixed(1) : "—"}</span>
                                                <span className="menu-card__dot">•</span>
                                                <span>{it.timeShip != null ? `${it.timeShip}m` : "—"}</span>
                                            </Box>

                                            <Typography className="menu-card__price">
                                                {it.price ?? "—"}₽
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>

                                    <CardActions className="menu-card__footer" sx={{ pt: 0, px: 2, pb: 2 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            className="menu-card__btn"
                                            onClick={() => onAddToCart?.(it)}
                                        >
                                            Add
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        </Box>
    );
}
