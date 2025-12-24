import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItems } from "../../store/cartSelector.js";
import { incQty, decQty } from "../../store/cartSlice";
import {Avatar, Box, IconButton, Typography} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

function formatRuble(n) {
    const v = Number(n || 0);
    return `${v.toFixed(2)} ₽`;
}

export default function CartItemsList() {
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);

    // Group items by restaurant: groups[restId] = { name, items[] }
    const groups = useMemo(() => {
        const g = {};
        for (const it of cartItems) {
            const rid = String(it.restId ?? "UNKNOWN");
            if (!g[rid]) g[rid] = { name: it.restName ?? "UNKNOWN", items: [] };
            g[rid].items.push(it);
        }
        return g;
    }, [cartItems]);

    const restIds = useMemo(() => Object.keys(groups), [groups]);

    if (!cartItems.length) return null;


    return (
        <>
            {restIds.map((rid) => {
                const store = groups[rid];

                return (
                    <Box className="cart-store" key={rid}>
                        <Box className="cart-store__header">
                            <Typography className="cart-store__name" component="span">
                                {store.name}
                            </Typography>
                        </Box>

                        {store.items.map((it) => (
                            <Box className="cart-item" key={`${rid}-${it.id}`}>
                                <Avatar
                                    variant="rounded"
                                    className="cart-item__img"
                                    src={`${import.meta.env.VITE_BACKEND_BASE}${it.image}`}
                                    alt={it.title ?? ""}
                                />

                                <Box className="cart-item__info">
                                    <Box className="cart-item__top">
                                        <Typography className="cart-item__name" component="span">
                                            {it.title}
                                        </Typography>

                                        <Box className="cart-item__controls">
                                            <IconButton
                                                type="button"
                                                className="cart-item__decrease"
                                                size="small"
                                                onClick={() => dispatch(decQty(it.id))}
                                                aria-label="Decrease quantity"
                                            >
                                                <RemoveIcon fontSize="small" />
                                            </IconButton>

                                            <Typography component="span">{it.qty}</Typography>

                                            <IconButton
                                                type="button"
                                                className="cart-item__increase"
                                                size="small"
                                                onClick={() => dispatch(incQty(it.id))}
                                                aria-label="Increase quantity"
                                            >
                                                <AddIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    <Box className="cart-item__meta">
                                        <Typography className="cart-item__qty" component="span">
                                            x {it.qty}
                                        </Typography>

                                        <Typography className="cart-item__price" component="span">
                                            {formatRuble(it.price * it.qty)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                );
            })}
        </>
    );
}
