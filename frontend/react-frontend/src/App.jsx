import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from './pages/LandingPage';
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage.jsx";
import RestaurantPage from "./pages/RestaurantPage.jsx";
import ProtectedLayout from "./layouts/ProtectedLayout.jsx";
import {store} from "./store/store.js";
import {Provider} from "react-redux";

export default function App() {
    return (
        <Provider store={store}>
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
        </Provider>

    );
}