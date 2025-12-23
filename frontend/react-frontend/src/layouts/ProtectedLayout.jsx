import React from "react";
import { Outlet } from "react-router-dom";
import ProtectedRoute from "../components/Security/ProtectedRoute.jsx";

// route layout
export default function ProtectedLayout() {
    return (
        <ProtectedRoute>
            <Outlet />  {/* render nested route here */}
        </ProtectedRoute>
    );
}
