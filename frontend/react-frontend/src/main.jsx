import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/reset.css";
import "./styles/general.css";
import App from "./App.jsx";
import Bugsnag from "./bugsnag/bugsnag.js";
import FallbackBoundary from "./bugsnag/FallbackBoundary.js";
import { initGA } from "./analytics/ga.js";

/**
 * DEBUG SWITCHES
 * - Set to true for a quick isolation build, then revert back to false.
 */
const DEBUG = true;
const DEBUG_RENDER_HELLO_ONLY = false; // isolate: mount works or not
const DEBUG_DISABLE_GA = false; // isolate: GA blocks render?
const DEBUG_DISABLE_BUGSNAG = false; // isolate: Bugsnag boundary blocks render?

// --- Global crash hooks (must be as early as possible) ---
console.log("[main] START");

window.onerror = (msg, src, line, col, err) => {
  console.log("[main] window.onerror:", { msg, src, line, col, err });
};

window.onunhandledrejection = (e) => {
  console.log("[main] unhandledrejection:", e?.reason ?? e);
};

// --- GA init should NEVER block render ---
if (!DEBUG_DISABLE_GA) {
  try {
    console.log("[main] GA init...");
    initGA();
    console.log("[main] GA init OK");
  } catch (e) {
    console.log("[main] GA init FAILED:", e);
  }
} else {
  console.log("[main] GA disabled by DEBUG switch");
}

// --- Bugsnag boundary should NEVER block render ---
const ReactPlugin = Bugsnag?.getPlugin?.("react");
if (DEBUG) {
  console.log("[main] Bugsnag exists:", !!Bugsnag);
  console.log("[main] Bugsnag react plugin:", ReactPlugin);
}

const ErrorBoundary = DEBUG_DISABLE_BUGSNAG
  ? ({ children }) => <>{children}</>
  : (ReactPlugin?.createErrorBoundary?.(React) ?? FallbackBoundary);

const rootEl = document.getElementById("root");
if (!rootEl) {
  // If this happens, index.html is wrong or root id is different
  console.log("[main] ERROR: #root not found in DOM");
} else {
  console.log("[main] #root found:", rootEl);
}

// --- Render ---
const root = ReactDOM.createRoot(rootEl);

if (DEBUG_RENDER_HELLO_ONLY) {
  root.render(<div style={{ padding: 24, fontSize: 24 }}>HELLO FROM VERCEL (debug)</div>);
} else {
  root.render(
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <App />
    </ErrorBoundary>
  );
}

console.log("[main] AFTER render call");
