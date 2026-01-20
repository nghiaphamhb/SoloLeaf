import React, { useEffect, useMemo, useRef } from "react";

/**
 * WheelCanvas
 * - draws a wheel with segments
 * - rotates by `angle` (radians)
 */
export default function WheelCanvas({
  size = 320,
  angle = 0, // radians
  segments = [],
}) {
  const canvasRef = useRef(null);

  const radius = useMemo(() => Math.floor(size / 2), [size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d"); // call canvas API
    if (!ctx) return;

    // HiDPI support
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Clear
    ctx.clearRect(0, 0, size, size);

    // Wheel center
    const cx = radius;
    const cy = radius;

    // Background circle
    ctx.beginPath(); 
    ctx.arc(cx, cy, radius - 2, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(0,0,0,0.12)";
    ctx.stroke();

    if (!segments.length) {
      // Placeholder text
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.font = "16px system-ui, -apple-system, Segoe UI, Roboto";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("No segments", cx, cy);
      return;
    }

    const n = segments.length;
    const step = (Math.PI * 2) / n;

    // Draw segments (rotate by `angle`)
    for (let i = 0; i < n; i++) {
      const start = angle + i * step;
      const end = start + step;

      // Slice
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius - 6, start, end);
      ctx.closePath();

      // Alternate colors (don’t hardcode fancy palette)
      ctx.fillStyle = i % 2 === 0 ? "#f6f3ef" : "#ffffff";
      ctx.fill();

      ctx.strokeStyle = "rgba(0,0,0,0.10)";
      ctx.stroke();

      // Text
      const mid = (start + end) / 2;
      const tx = cx + Math.cos(mid) * (radius * 0.62);
      const ty = cy + Math.sin(mid) * (radius * 0.62);

      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(mid);
      ctx.fillStyle = "rgba(0,0,0,0.75)";
      ctx.font = "bold 14px system-ui, -apple-system, Segoe UI, Roboto";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(segments[i]?.label ?? ""), 0, 0);
      ctx.restore();
    }

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.15)";
    ctx.stroke();

    // Pointer (top)
    ctx.beginPath();
    ctx.moveTo(cx, cy - (radius - 2));
    ctx.lineTo(cx - 10, cy - (radius - 26));
    ctx.lineTo(cx + 10, cy - (radius - 26));
    ctx.closePath();
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fill();
  }, [size, angle, segments, radius]);

  return <canvas ref={canvasRef} aria-label="Discount wheel" />;
}
