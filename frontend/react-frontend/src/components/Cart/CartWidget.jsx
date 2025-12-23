import React, { useState } from "react";
import CartButton from "./CartButton";
import CartPanel from "./CartPanel";
import {useSelector} from "react-redux";
import {selectCartCount, selectCartInitialPrice, selectCartTotalPrice} from "../../store/cartSelector.js";

export default function CartWidget({
                                       title = "My cart",
                                       children,
                                       onApplyDiscount,
                                       onCheckout,
                                   }) {
    const [open, setOpen] = useState(false);

    // get state from the store
    const count = useSelector(selectCartCount);
    const initialPrice = useSelector(selectCartInitialPrice);
    const totalPrice = useSelector(selectCartTotalPrice);

    return (
        <>
            {!open && (<CartButton count={count} onOpen={() => setOpen(true)} />)}

            <CartPanel
                open={open}
                onClose={() => setOpen(false)}
                title={title}
                count={count}
                initialPrice={initialPrice}
                totalPrice={totalPrice}
                onApplyDiscount={onApplyDiscount}
                onCheckout={onCheckout}
            >
                {children}
            </CartPanel>
        </>
    );
}
