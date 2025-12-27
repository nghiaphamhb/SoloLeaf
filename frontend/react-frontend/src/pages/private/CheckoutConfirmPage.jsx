import React, { useMemo, useState } from "react";
import { Box, Button, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../apis/request/apiRequest.js";
import "../../styles/checkout.css";
import { useCartGroups } from "../../hooks/useCartGroups";
import CartItemRow from "../../components/cart/CartItemRow.jsx";
import Bugsnag from "../../bugsnag/bugsnag.js";
import { useSelector } from "react-redux";
import { selectCartPromoCode } from "../../store/cartSelector.js";

function formatRuble(n) {
  const v = Number(n || 0);
  return `${v.toFixed(2)} ₽`;
}

export default function CheckoutConfirmPage() {
  const navigate = useNavigate();
  const { items, total, groups, restIds, isEmpty, firstRestId } = useCartGroups();
  const promoCode = useSelector(selectCartPromoCode);

  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [pricing, setPricing] = useState(null);
  // pricing = { totalBefore, totalAfter, currency, discount }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const trimmedPromo = useMemo(() => String(promoCode || "").trim(), [promoCode]);

  const handleBack = () => navigate(-1);

  const handlePay = async () => {
    setError("");
    setPricing(null);

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
      promoCode: trimmedPromo || null,
    };

    try {
      setPaying(true);

      const { data } = await apiRequest("/api/payment/create-checkout-session", {
        method: "POST",
        body: JSON.stringify(reqBody),
      });

      const discountAmount = Number(data?.discount?.discountAmount ?? 0);
      if (trimmedPromo && discountAmount === 0) {
        setError("There is no restaurant to apply the code.");
      }

      // Save breakdown for UI (even if we redirect immediately)
      setPricing({
        totalBefore: data?.totalBefore,
        totalAfter: data?.totalAfter,
        currency: data?.currency,
        discount: data?.discount || null,
      });

      const url = data?.url;
      if (!url) {
        Bugsnag.notify(new Error("Invalid payment."));
        setError("The code is invalid");
        return;
      }

      await sleep(2000);
      window.location.assign(url);
    } catch (e) {
      const msg = e?.message ? String(e.message) : "Payment init failed.";
      setError(`Payment init failed: ${msg}`);
      Bugsnag.notify(new Error(msg));
    } finally {
      setPaying(false);
    }
  };

  const shownTotal = pricing?.totalAfter != null ? pricing.totalAfter : total;

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

        {!isEmpty && trimmedPromo ? (
          <Typography sx={{ mb: 1, color: "white" }}>
            Code applied: <b>{trimmedPromo}</b>
          </Typography>
        ) : null}

        {isEmpty ? (
          <Typography sx={{ opacity: 0.8 }}>Cart is empty.</Typography>
        ) : (
          <>
            {restIds.map((rid) => {
              const storeGroup = groups[rid];

              return (
                <Box className="cart-store" key={rid}>
                  <Box className="cart-store__header">
                    <Typography className="cart-store__name">{storeGroup.name}</Typography>
                  </Box>

                  {storeGroup.items.map((it) => (
                    <CartItemRow key={`${rid}-${it.id}`} item={it} showControls={false} />
                  ))}
                </Box>
              );
            })}

            {/* Pricing breakdown from backend */}
            {pricing ? (
              <Box
                sx={{
                  mt: 2,
                  p: 1.5,
                  border: "1px dashed rgba(0,0,0,0.2)",
                  borderRadius: 2,
                  color: "white",
                }}
              >
                <Typography sx={{ fontWeight: 600, mb: 1 }}>Pricing (server)</Typography>

                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                  <Typography>Total before</Typography>
                  <Typography>{formatRuble(pricing.totalBefore)}</Typography>
                </Box>

                {pricing.discount ? (
                  <>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                      <Typography sx={{ opacity: 0.8 }}>
                        Discount ({pricing.discount.percent}% · {pricing.discount.restaurantName})
                      </Typography>
                      <Typography>- {formatRuble(pricing.discount.discountAmount)}</Typography>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                    <Typography sx={{ opacity: 0.8 }}>Discount</Typography>
                    <Typography>{formatRuble(0)}</Typography>
                  </Box>
                )}

                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mt: 1 }}>
                  <Typography sx={{ fontWeight: 600 }}>Total after</Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {formatRuble(pricing.totalAfter)}
                  </Typography>
                </Box>
              </Box>
            ) : null}

            <Box className="checkout-footer">
              <Typography variant="h6" className="checkout-total">
                Total: {formatRuble(shownTotal)}
              </Typography>

              <Box className="checkout-actions">
                <Button variant="outlined" onClick={handleBack} disabled={paying}>
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
