import React, { useState } from "react";
import {
    Box,
    Drawer,
    Typography,
    IconButton,
    TextField,
    Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {useNavigate} from "react-router-dom";

export default function CartPanel(
    {
        open,
        onClose,
        title = "My cart",
        count = 0,
        children,
        initialPrice = 0,
        totalPrice = 0,
        // onApplyDiscount,
    }
) {
    const [discountCode, setDiscountCode] = useState("");
    const [discountHelp, setDiscountHelp] = useState("");
    const navigate = useNavigate();

    const handleApply = () => {
        setDiscountHelp("Applied!");
    };

    const handleGoCheckout = () => {
        onClose?.();          // close drawer
        navigate("/checkout"); // go confirm page
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box role="presentation" className="cart-panel">
                {/* Header */}
                <Box className="cart-panel__header">
                    <Typography className="cart-panel__title">
                        {title} ({count})
                    </Typography>

                    <IconButton
                        onClick={onClose}
                        aria-label="Close cart"
                        className="cart-panel__close"
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Body */}
                <Box className="cart-panel__body">
                    {children ? (
                        children
                    ) : (
                        <Typography sx={{ opacity: 0.9 }}>
                            Cart is empty. Add some items 🙂
                        </Typography>
                    )}
                </Box>

                {/* Footer */}
                <Box component="footer" className="cart-panel__footer">
                    <Box className="cart-summary">
                        <Box className="cart-summary__row">
                            <span>Initial price</span>
                            <span>{initialPrice} ₽</span>
                        </Box>

                        <Box className="cart-summary__row">
                            <span>Discount</span>

                            <Box className="discount-cell">
                                <small
                                    className={`discount-help ${
                                        discountHelp ? "discount-help--visible" : ""
                                    }`}
                                >
                                    {discountHelp}
                                </small>

                                <TextField
                                    size="small"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value)}
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