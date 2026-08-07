import React from "react";
import { useApp } from "../../context/AppContext";
import { Flame, CheckCircle2, Award, Clock } from "lucide-react";

export function StatsView() {
  const { 
    dsaSolvedCount, 
    dsaTotalCount, 
    overallPercentage, 
    userStats,
    dayProgress 
  } = useApp();

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)" }}>
          Analytics & Progress Dashboard
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
          Track your daily study consistency and transformation trajectory.
        </p>
      </div>

      {/* Top Metrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        <div className="glass-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-amber)", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
            <Flame size={18} />
            <span>CURRENT STREAK</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-primary)" }}>{userStats.streak} Days</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Daily Consistency</div>
        </div>

        <div className="glass-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-indigo)", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
            <CheckCircle2 size={18} />
            <span>OVERALL PROGRESS</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-primary)" }}>{overallPercentage}%</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Journey Complete</div>
        </div>

        <div className="glass-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-emerald)", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
            <Award size={18} />
            <span>DSA PROBLEMS</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-primary)" }}>{dsaSolvedCount} / {dsaTotalCount}</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Solved</div>
        </div>

        <div className="glass-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-violet)", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
            <Clock size={18} />
            <span>STUDY TIME</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-primary)" }}>{(userStats.totalMinutes / 60).toFixed(1)} hrs</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Logged</div>
        </div>
      </div>

      {/* 30-Day Heatmap Grid */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "16px" }}>
          30-Day Activity Heatmap
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: "10px" }}>
          {Array.from({ length: 30 }, (_, i) => i + 1).map((dayNum) => {
            const isCompleted = dayProgress[dayNum]?.theoryRead;
            return (
              <div
                key={dayNum}
                style={{
                  height: "44px",
                  borderRadius: "8px",
                  background: isCompleted ? "var(--accent-emerald)" : "var(--bg-input)",
                  border: "var(--glass-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "12px",
                  color: isCompleted ? "#fff" : "var(--text-muted)"
                }}
                title={`Day ${dayNum}: ${isCompleted ? "Completed" : "Incomplete"}`}
              >
                D{dayNum}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
