import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/reset.css";
import "./styles/general.css";
import App from "./App.jsx";
import Bugsnag from "./bugsnag/bugsnag.js";
import FallbackBoundary from "./bugsnag/FallbackBoundary.js";

// Prevent white screen when error render (crash UI)
const ErrorBoundary = Bugsnag.getPlugin("react")?.createErrorBoundary(React) ?? FallbackBoundary;

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary fallback={<div>Something went wrong</div>}>
    <App />
  </ErrorBoundary>
);
