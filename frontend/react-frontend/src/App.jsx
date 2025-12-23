import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from './pages/LandingPage';
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/Security/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage.jsx";
import RestaurantPage from "./pages/RestaurantPage.jsx";
import ProtectedLayout from "./layouts/ProtectedLayout.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* that routes dont need authentication */}
                <Route path="/" element={<LandingPage/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/register" element={<RegisterPage/>} />

                {/* authentication */}
                <Route element={<ProtectedLayout/>}>
                    <Route path="/home" element={<HomePage/>}/>
                    <Route path="/restaurant/:id" element={<RestaurantPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}