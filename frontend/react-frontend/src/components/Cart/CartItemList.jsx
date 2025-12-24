import React from "react";
import { useDispatch } from "react-redux";
import { Box,Typography } from "@mui/material";
import { incQty, decQty } from "../../store/cartSlice";
import { useCartGroups } from "../../hooks/useCartGroups";
import CartItemRow from "./CartItemRow.jsx";

export default function CartItemsList() {
    const dispatch = useDispatch();
    const { groups, restIds, isEmpty } = useCartGroups();

    if (isEmpty) return null;

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
                            <CartItemRow
                                key={`${rid}-${it.id}`}
                                item={it}
                                showControls
                                onDec={() => dispatch(decQty(it.id))}
                                onInc={() => dispatch(incQty(it.id))}
                            />
                        ))}
                    </Box>
                );
            })}
        </>
    );
}
