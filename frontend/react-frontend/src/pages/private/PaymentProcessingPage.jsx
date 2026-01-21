import React, { useEffect, useMemo, useState } from "react";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "../../apis/request/apiRequest.js";
import { useDispatch } from "react-redux";
import { clearCart, clearPromoCode } from "../../store/cartSlice.js";
import "../../styles/checkout.css";
import Bugsnag from "../../bugsnag/bugsnag.js";
import { trackEvent } from "../../analytics/ga.js";

export default function PaymentProcessingPage() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);

  // derived error (no setState in effect)
  const missingSessionError = useMemo(() => {
    return sessionId ? "" : "Missing session id.";
  }, [sessionId]);

  useEffect(() => {
    // if missing sessionId: do not poll
    if (!sessionId) return;

    let cancelled = false;
    let timerId = null;

    const poll = async () => {
      if (cancelled) return;

      try {
        const data = await apiRequest(`/api/orders/by-session/${sessionId}`, {
          method: "GET",
        });

        if (data?.status === "PENDING") {
          trackEvent("payment_success", {
            order_id: String(data?.id ?? ""),
            status: data?.status ?? "",
          });

          dispatch(clearCart());
          dispatch(clearPromoCode());
          navigate("/home", {
            replace: true,
            state: {
              justOrdered: {
                orderId: data?.id,
                status: data?.status,
                sessionId,
              },
            },
          });

          return;
        }
      } catch (e) {
        Bugsnag.notify(new Error(e.message));
        trackEvent("payment_failed", { reason: "not_paid" });
      }

      setAttempts((a) => {
        const next = a + 1;

        if (next > 15) {
          setError("Payment processing is taking longer than expected.");
          return next;
        }

        timerId = window.setTimeout(poll, 1000);
        return next;
      });
    };

    timerId = window.setTimeout(poll, 300);

    return () => {
      cancelled = true;
      if (timerId) window.clearTimeout(timerId);
    };
  }, [sessionId, dispatch, navigate]);

  const finalError = missingSessionError || error;

  return (
    <Box className="checkout-page">
      <Box className="checkout-page__panel">
        <Typography variant="h5" sx={{ mb: 2 }}>
          Processing your payment
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <CircularProgress />
        </Box>

        <Typography sx={{ opacity: 0.85, color: "white" }} className="cart-store__header">
          Please wait while we confirm your order… {sessionId ? `(attempt ${attempts}/15)` : ""}
        </Typography>

        {finalError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {finalError}
          </Alert>
        )}
      </Box>
    </Box>
  );
}
