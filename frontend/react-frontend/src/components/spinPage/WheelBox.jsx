import React, { useCallback, useMemo, useState } from "react";
import { Alert, Box, Button, Card, Chip, Typography } from "@mui/material";

import WheelCanvas from "./WheelCanvas.jsx";
import { apiRequest } from "../../apis/request/apiRequest.js";
import Bugsnag from "../../bugsnag.js";

const PERCENTS = [5, 10, 15, 20];
const SEGMENTS = [
  { label: "5%" },
  { label: "10%" },
  { label: "15%" },
  { label: "20%" },
  { label: "5%" },
  { label: "10%" },
  { label: "15%" },
  { label: "20%" },
];

export default function WheelBox({ copyText, formatTime }) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [angle, setAngle] = useState(0);

  const wheelSegments = useMemo(() => SEGMENTS, []);

  const animateToPercent = useCallback(
    async (percent) => {
      const labels = wheelSegments.map((s) => s.label);
      const targetLabel = `${percent}%`;

      const candidates = [];
      for (let i = 0; i < labels.length; i++) {
        if (labels[i] === targetLabel) candidates.push(i);
      }
      if (!candidates.length) throw new Error("Invalid wheel segment mapping.");

      const targetIdx = candidates[Math.floor(Math.random() * candidates.length)];
      const n = wheelSegments.length;
      const step = (Math.PI * 2) / n;
      const targetMid = targetIdx * step + step / 2;

      const spins = 6;
      const startAngle = angle;
      const endAngle = spins * Math.PI * 2 - targetMid;

      const duration = 2400;
      const t0 = performance.now();
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

      await new Promise((resolve) => {
        const tick = (now) => {
          const t = Math.min(1, (now - t0) / duration);
          const k = easeOutCubic(t);
          setAngle(startAngle + (endAngle - startAngle) * k);

          if (t < 1) requestAnimationFrame(tick);
          else resolve();
        };
        requestAnimationFrame(tick);
      });
    },
    [angle, wheelSegments]
  );

  const handleSpin = useCallback(async () => {
    if (spinning) return;

    setError("");
    setResult(null);
    setSpinning(true);

    try {
      const percent = PERCENTS[Math.floor(Math.random() * PERCENTS.length)];

      // 1) Animation
      await animateToPercent(percent);

      // 2) Backend generates the real promo code
      const { data } = await apiRequest("/api/promo/spin", {
        method: "POST",
        body: JSON.stringify({ percent }),
      });

      if (!data?.code) {
        throw new Error("Promo spin failed: missing code from server.");
      }

      // Normalize to your UI state
      const discount = {
        code: data.code,
        percent: data.percent ?? percent,
        resId: data.resId,
        restaurantName: data.resTitle,
        startDate: data.startDate,
        endDate: data.endDate,
      };

      setResult(discount);
    } catch (e) {
      const msg = e?.message ? String(e.message) : "Spin failed.";
      setError(msg);
      Bugsnag.notify(new Error(msg));
    } finally {
      setSpinning(false);
    }
  }, [animateToPercent, spinning]);

  return (
    <Card className="lucky-discount__card">
      <Typography variant="h5" className="lucky-discount__title">
        Lucky Spin
      </Typography>

      <Typography className="lucky-discount__desc">
        Spin to get a random discount by restaurants
      </Typography>

      {error && (
        <Alert severity="error" className="lucky-discount__alert">
          {error}
        </Alert>
      )}

      <Box className="lucky-discount__wheelBox">
        <Box className="lucky-discount__wheelCenter lucky-discount__wheelText">
          <WheelCanvas size={320} angle={angle} segments={wheelSegments} />
        </Box>

        {spinning ? (
          <Typography className="lucky-discount__spinning">Spinning...</Typography>
        ) : null}
      </Box>

      <Box className="lucky-discount__actions">
        <Button
          className="lucky-discount__spinBtn"
          variant="contained"
          onClick={handleSpin}
          disabled={spinning}
        >
          {spinning ? "Spinning..." : "Spin"}
        </Button>

        {result ? (
          <>
            <Chip label={`${result.percent}% OFF`} />
            <Chip label={`For: ${result.restaurantName ?? `Restaurant #${result.resId}`}`} />
            <Chip
              label={`Code: ${result.code}`}
              onClick={() => copyText(result.code)}
              className="lucky-discount__codeChip"
            />
            <Typography className="lucky-discount__validUntil">
              Valid until: {formatTime(result.endDate)}
            </Typography>
          </>
        ) : null}
      </Box>

      <Box className="lucky-discount__tip">
        <Typography>Tip: click the code chip to copy the code.</Typography>
      </Box>
    </Card>
  );
}
