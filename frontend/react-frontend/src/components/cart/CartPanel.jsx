import React, { useState } from "react";
import { Box, Drawer, Typography, IconButton, TextField, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import Bugsnag from "../../bugsnag/bugsnag.js";
import { useDispatch } from "react-redux";
import { clearPromoCode } from "../../store/cartSlice.js";

export default function CartPanel({
  open,
  onClose,
  title = "My cart",
  count = 0,
  children,
  initialPrice = 0,
  totalPrice = 0,
  onApplyDiscount,
}) {
  const [discountCode, setDiscountCode] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleApply = async () => {
    const code = discountCode.trim();
    if (!code) return;

    try {
      await onApplyDiscount?.(code);
      setDiscountCode(""); // clear input after apply
    } catch (e) {
      Bugsnag.notify(e.message);
    }
  };

  const handleGoCheckout = () => {
    onClose?.();
    navigate("/checkout");
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      TransitionProps={{
        onEntered: () => {
          setDiscountCode("");
        },
      }}
    >
      <Box role="presentation" className="cart-panel">
        {/* HEADER */}
        <Box className="cart-panel__header">
          <Typography className="cart-panel__title">
            {title} ({count})
          </Typography>

          <IconButton onClick={onClose} aria-label="Close cart" className="cart-panel__close">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* BODY */}
        <Box className="cart-panel__body">
          {children ? (
            children
          ) : (
            <Typography sx={{ opacity: 0.9 }}>Cart is empty. Add some items 🙂</Typography>
          )}
        </Box>

        {/* FOOTER */}
        <Box component="footer" className="cart-panel__footer">
          <Box className="cart-summary">
            <Box className="cart-summary__row">
              <span>Initial price</span>
              <span>{initialPrice} ₽</span>
            </Box>

            <Box className="cart-summary__row">
              <span>Discount</span>

              <Box className="discount-cell">
                <TextField
                  size="small"
                  value={discountCode}
                  onChange={(e) => {
                    const v = e.target.value;
                    setDiscountCode(v);

                    if (!v.trim()) {
                      dispatch(clearPromoCode());
                    }
                  }}
                  placeholder="Enter code"
                  className="discount-input"
                />

                <Button
                  type="button"
                  variant="contained"
                  onClick={handleApply}
                  className="btn-apply-discount"
                >
                  Apply
                </Button>
              </Box>
            </Box>

            <Box className="cart-summary__row cart-summary__row--total">
              <span>Total price</span>
              <span>{totalPrice} ₽</span>
            </Box>
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={handleGoCheckout}
            className="cart-checkout-btn"
          >
            Order
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
