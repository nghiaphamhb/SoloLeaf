import React from 'react';
import SideWidget from "../components/SidePanel/SideWidget.jsx";
import RestaurantPageContent from "../components/RestaurantPage/RestaurantPageContent.jsx";
import CartWidget from "../components/Cart/CartWidget.jsx";
import {Box} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";

export default function RestaurantPage() {
    const navigate = useNavigate();
    const { id } = useParams();  // restaurant's id is string

    const onLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <Box className="layout">
            <SideWidget/>
            <RestaurantPageContent resId={id}/>
            <CartWidget count={0} title="My cart" />
        </Box>
    )
}