import React from "react";
import { useApp } from "../../context/AppContext";
import { CheckCircle2, Sparkles, Lock } from "lucide-react";

export function TimelineStrip() {
  const { currentDay, setCurrentDay, dayProgress, setActiveTab } = useApp();

  return (
    <div style={{ margin: "28px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
            30-Day Master Roadmap
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Select any day to launch its theory, tasks, and DSA solver.
          </p>
        </div>
      </div>

      {/* Horizontal Scrollable Track */}
      <div style={{
        display: "flex",
        gap: "12px",
        overflowX: "auto",
        paddingBottom: "12px",
        scrollbarWidth: "thin"
      }}>
        {Array.from({ length: 30 }, (_, i) => i + 1).map((dayNum) => {
          const isCurrent = dayNum === currentDay;
          const isCompleted = dayProgress[dayNum]?.theoryRead;
          const isPast = dayNum < currentDay;

          return (
            <button
              key={dayNum}
              onClick={() => {
                setCurrentDay(dayNum);
                setActiveTab("workspace");
              }}
              className={`glass-card ${isCurrent ? "active-day-glow" : ""}`}
              style={{
                minWidth: "110px",
                padding: "16px 14px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                textAlign: "center",
                cursor: "pointer",
                background: isCurrent 
                  ? "var(--bg-card-hover)" 
                  : isCompleted 
                  ? "rgba(16, 185, 129, 0.08)" 
                  : "var(--bg-card)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 700, color: isCurrent ? "var(--accent-indigo)" : "var(--text-muted)" }}>
                <span>DAY</span>
                <span style={{ fontSize: "16px", fontWeight: 800 }}>{dayNum < 10 ? `0${dayNum}` : dayNum}</span>
              </div>

              {isCompleted ? (
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700, color: "var(--accent-emerald)" }}>
                  <CheckCircle2 size={14} />
                  <span>Done</span>
                </div>
              ) : isCurrent ? (
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700, color: "var(--accent-indigo)" }}>
                  <Sparkles size={14} />
                  <span>Active</span>
                </div>
              ) : isPast ? (
                <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>
                  In Progress
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--text-muted)" }}>
                  <Lock size={12} />
                  <span>Locked</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
