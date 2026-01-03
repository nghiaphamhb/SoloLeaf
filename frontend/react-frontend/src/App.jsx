import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";

import { store } from "./store/store.js";
import { trackPageView } from "./analytics/ga.js";

import LandingPage from "./pages/public/LandingPage.jsx";
import LoginPage from "./pages/public/LoginPage.jsx";
import RegisterPage from "./pages/public/RegisterPage.jsx";
import HomePage from "./pages/private/mainLayout/HomePage.jsx";
import RestaurantPage from "./pages/private/mainLayout/RestaurantPage.jsx";
import OrdersPage from "./pages/private/mainLayout/OrdersPage.jsx";
import SpinPage from "./pages/private/mainLayout/SpinPage.jsx";
import ProtectedLayout from "./layouts/ProtectedLayout.jsx";
import CheckoutConfirmPage from "./pages/private/CheckoutConfirmPage.jsx";
import PaymentProcessingPage from "./pages/private/PaymentProcessingPage.jsx";
import SearchPage from "./pages/private/mainLayout/SearchPage.jsx";

function AnalyticsListener() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return null;
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AnalyticsListener />
        <Routes>
          {/* public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* protected */}
          <Route element={<ProtectedLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/restaurant/:id" element={<RestaurantPage />} />
            <Route path="/checkout" element={<CheckoutConfirmPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/payment/processing" element={<PaymentProcessingPage />} />
            <Route path="/spin" element={<SpinPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
