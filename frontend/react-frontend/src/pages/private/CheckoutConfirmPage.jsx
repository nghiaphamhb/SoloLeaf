import React, { useState } from "react";
import { Box, Button, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../apis/request/apiRequest.js";
import "../../styles/checkout.css";
import { useCartGroups } from "../../hooks/useCartGroups";
import CartItemRow from "../../components/cart/CartItemRow.jsx";

function formatRuble(n) {
    const v = Number(n || 0);
    return `${v.toFixed(2)} ₽`;
}

export default function CheckoutConfirmPage() {
    const navigate = useNavigate();
    const { items, total, groups, restIds, isEmpty, firstRestId } = useCartGroups();

    const [paying, setPaying] = useState(false);
    const [error, setError] = useState("");

    const handleBack = () => navigate(-1);

    const handlePay = async () => {
        setError("");

        if (isEmpty) {
            setError("Cart is empty.");
            return;
        }

        const resId = firstRestId;
        if (!resId) {
            setError("Missing restaurant id in cart.");
            return;
        }

        const reqBody = {
            resId,
            items: items.map((it) => ({
                id: it.id,
                title: it.title,
                price: it.price,
                qty: it.qty,
            })),
        };

        try {
            setPaying(true);

            const data = await apiRequest("/api/payment/create-checkout-session", {
                method: "POST",
                body: JSON.stringify(reqBody),
            });

            const url = data?.url;
            if (!url) throw new Error("Missing checkout URL from server.");

            window.location.assign(url);
        } catch (e) {
            setError(e?.message ? `Payment init failed: ${e.message}` : "Payment init failed.");
        } finally {
            setPaying(false);
        }
    };

    return (
        <Box className="checkout-page" sx={{ p: 2 }}>
            <Box className="checkout-page__panel">
                <Typography variant="h5" sx={{ mb: 1 }}>
                    Confirm your order
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {isEmpty ? (
                    <Typography sx={{ opacity: 0.8 }}>Cart is empty.</Typography>
                ) : (
                    <>
                        {restIds.map((rid) => {
                            const storeGroup = groups[rid];

                            return (
                                <Box className="cart-store" key={rid}>
                                    <Box className="cart-store__header">
                                        <Typography className="cart-store__name">
                                            {storeGroup.name}
                                        </Typography>
                                    </Box>

                                    {storeGroup.items.map((it) => (
                                        <CartItemRow
                                            key={`${rid}-${it.id}`}
                                            item={it}
                                            showControls={false}
                                        />
                                    ))}
                                </Box>
                            );
                        })}

                        <Box className="checkout-footer">
                            <Typography variant="h6" className="checkout-total">
                                Total: {formatRuble(total)}
                            </Typography>

                            <Box className="checkout-actions">
                                <Button variant="outlined" onClick={handleBack}>
                                    Back
                                </Button>

                                <Button variant="contained" onClick={handlePay} disabled={paying}>
                                    {paying ? "Redirecting..." : "Pay"}
                                </Button>
                            </Box>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
}
