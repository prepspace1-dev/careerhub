import React from "react";

export function ProgressRing({ percentage = 0, size = 110, strokeWidth = 9 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--border)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated fill ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-indigo)" />
            <stop offset="100%" stopColor="var(--accent-emerald)" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
          {percentage}%
        </span>
        <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Done
        </span>
      </div>
    </div>
  );
}
