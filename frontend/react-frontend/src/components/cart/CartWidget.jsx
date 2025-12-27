import React, { useState, useCallback } from "react";
import CartButton from "./CartButton";
import CartPanel from "./CartPanel";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartCount,
  selectCartInitialPrice,
  selectCartTotalPrice,
  selectCartPromoCode,
} from "../../store/cartSelector.js";
import { setPromoCode, clearPromoCode } from "../../store/cartSlice.js";
import CartItemsList from "./CartItemList.jsx";

export default function CartWidget({ title = "My cart" }) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const count = useSelector(selectCartCount);
  const initialPrice = useSelector(selectCartInitialPrice);
  const totalPrice = useSelector(selectCartTotalPrice);
  const promoCode = useSelector(selectCartPromoCode);

  const handleApplyDiscount = useCallback(
    async (code) => {
      const trimmed = String(code || "").trim();
      if (!trimmed) {
        dispatch(clearPromoCode());
        throw new Error("Enter code");
      }
      dispatch(setPromoCode(trimmed));
    },
    [dispatch]
  );

  return (
    <>
      {!open && <CartButton count={count} onOpen={() => setOpen(true)} />}

      <CartPanel
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        count={count}
        initialPrice={initialPrice}
        totalPrice={totalPrice}
        promoCode={promoCode}
        onApplyDiscount={handleApplyDiscount}
      >
        <CartItemsList />
      </CartPanel>
    </>
  );
}
