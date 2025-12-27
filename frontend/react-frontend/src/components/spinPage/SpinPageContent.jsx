import React, { useCallback } from "react";
import { Box } from "@mui/material";
import WheelBox from "./WheelBox.jsx";
import DiscountBox from "./DiscountBox.jsx";
import Bugsnag from "../../bugsnag/bugsnag.js";

export default function SpinPageContent() {
  const copyText = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      Bugsnag.notify(e instanceof Error ? e : new Error(String(e)));
    }
  }, []);

  const formatTime = useCallback((iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return Number.isNaN(d.getTime()) ? String(iso) : d.toLocaleString();
    } catch (e) {
      Bugsnag.notify(e instanceof Error ? e : new Error(String(e)));
      return String(iso);
    }
  }, []);

  return (
    <Box className="lucky-discount__layout">
      <WheelBox copyText={copyText} formatTime={formatTime} />
      <DiscountBox copyText={copyText} formatTime={formatTime} />
    </Box>
  );
}
