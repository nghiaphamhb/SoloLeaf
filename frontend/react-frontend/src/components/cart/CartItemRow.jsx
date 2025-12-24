import React from "react";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

// Comments in English
function formatRuble(n) {
    const v = Number(n || 0);
    return `${v.toFixed(2)} ₽`;
}

export default function CartItemRow({
                                        item,
                                        showControls = false,
                                        onDec,
                                        onInc,
                                    }) {
    const imgSrc = `${import.meta.env.VITE_BACKEND_BASE}${item.image}`;

    return (
        <Box className="cart-item">
            <Avatar
                variant="rounded"
                className="cart-item__img"
                src={imgSrc}
                alt={item.title ?? ""}
            />

            <Box className="cart-item__info">
                <Box className="cart-item__top">
                    <Typography className="cart-item__name" component="span">
                        {item.title}
                    </Typography>

                    {showControls ? (
                        <Box className="cart-item__controls">
                            <IconButton
                                type="button"
                                className="cart-item__decrease"
                                size="small"
                                onClick={onDec}
                                aria-label="Decrease quantity"
                            >
                                <RemoveIcon fontSize="small" />
                            </IconButton>

                            <Typography component="span">{item.qty}</Typography>

                            <IconButton
                                type="button"
                                className="cart-item__increase"
                                size="small"
                                onClick={onInc}
                                aria-label="Increase quantity"
                            >
                                <AddIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ) : null}
                </Box>

                <Box className="cart-item__meta">
                    <Typography className="cart-item__qty" component="span">
                        x {item.qty}
                    </Typography>

                    <Typography className="cart-item__price" component="span">
                        {formatRuble(item.price * item.qty)}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
