import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/public/LandingPage.jsx";
import LoginPage from "./pages/public/LoginPage.jsx";
import RegisterPage from "./pages/public/RegisterPage.jsx";
import HomePage from "./pages/private/mainLayout/HomePage.jsx";
import RestaurantPage from "./pages/private/mainLayout/RestaurantPage.jsx";
import ProtectedLayout from "./layouts/ProtectedLayout.jsx";
import CheckoutConfirmPage from "./pages/private/CheckoutConfirmPage.jsx";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import OrdersPage from "./pages/private/mainLayout/OrdersPage.jsx";
import PaymentProcessingPage from "./pages/private/PaymentProcessingPage.jsx";
import SpinPage from "./pages/private/mainLayout/SpinPage.jsx";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* that routes dont need authentication */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* authentication */}
          <Route element={<ProtectedLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/restaurant/:id" element={<RestaurantPage />} />
            <Route path="/checkout" element={<CheckoutConfirmPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/payment/processing" element={<PaymentProcessingPage />} />
            <Route path="/spin" element={<SpinPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
