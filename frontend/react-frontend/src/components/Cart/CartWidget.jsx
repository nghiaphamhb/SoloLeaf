import React, { useState } from "react";
import CartButton from "./CartButton";
import CartPanel from "./CartPanel";

export default function CartWidget({
                                       count = 0,
                                       title = "My cart",
                                       children,
                                       initialPrice = 0,
                                       totalPrice = 0,
                                       onApplyDiscount,
                                       onCheckout,
                                   }) {
    const [open, setOpen] = useState(false);

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
