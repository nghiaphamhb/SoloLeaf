import React, { useMemo, useState } from "react";
import { Box, Button, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiRequest } from "../apis/request/apiRequest";
import { selectCartItems, selectCartInitialPrice } from "../store/cartSelector";
import "../styles/checkout.css";

function formatRuble(n) {
    const v = Number(n || 0);
    return `${v.toFixed(2)} ₽`;
}

export default function CheckoutConfirmPage() {
    const navigate = useNavigate();
    const items = useSelector(selectCartItems);
    const total = useSelector(selectCartInitialPrice);

    const [paying, setPaying] = useState(false);
    const [error, setError] = useState("");

    // Group by restaurant
    const groups = useMemo(() => {
        const g = {};
        for (const it of items) {
            const rid = String(it.restId ?? "UNKNOWN");
            if (!g[rid]) g[rid] = { name: it.restName ?? "UNKNOWN", items: [] };
            g[rid].items.push(it);
        }
        return g;
    }, [items]);

    const restIds = useMemo(() => Object.keys(groups), [groups]);

    const handleBack = () => navigate(-1);

    const handlePay = async () => {
        setError("");

        if (!items.length) {
            setError("Cart is empty.");
            return;
        }

        // Build payload for backend Stripe session creation
        const payload = items.map((it) => ({
            id: it.id,
            qty: it.qty,
            title: it.title,
            price: it.price,
        }));

        try {
            setPaying(true);

            // Your backend endpoint:
            // POST /create-checkout-session -> { url: "https://checkout.stripe.com/..." }
            const data = await apiRequest("/api/payment/create-checkout-session", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            const url = data?.url;
            if (!url) throw new Error("Missing checkout URL from server.");

            // Redirect to Stripe Checkout
            window.location.assign(url);
        } catch (e) {
            console.error("[PAY] error:", e);
            setError(e?.message ? `Payment init failed: ${e.message}` : "Payment init failed.")
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

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {!items.length ? (
                    <Typography sx={{ opacity: 0.8 }}>Cart is empty.</Typography>
                ) : (
                    <>
                        {/* Keep your old CSS classes for item rendering if you want */}
                        {restIds.map((rid) => {
                            const store = groups[rid];
                            return (
                                <div className="cart-store" key={rid}>
                                    <div className="cart-store__header">
                                        <span className="cart-store__name">{store.name}</span>
                                    </div>

                                    {store.items.map((it) => (
                                        <div className="cart-item" key={`${rid}-${it.id}`}>
                                            <img className="cart-item__img"
                                                 src={`${import.meta.env.VITE_BACKEND_BASE}${it.image}`}
                                                 alt="" />
                                            <div className="cart-item__info">
                                                <div className="cart-item__top">
                                                    <span className="cart-item__name">{it.title}</span>
                                                </div>
                                                <div className="cart-item__meta">
                                                    <span className="cart-item__qty">x {it.qty}</span>
                                                    <span className="cart-item__price">{formatRuble(it.price * it.qty)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
