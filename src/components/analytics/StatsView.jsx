import React from "react";
import { useApp } from "../../context/AppContext";
import { Flame, CheckCircle2, Award, Target, Sparkles } from "lucide-react";

export function StatsView() {
  const { 
    dsaSolvedCount, 
    dsaTotalCount, 
    overallPercentage, 
    userStats,
    dayProgress,
    csCompletedCount,
    projectMilestonesDone,
    projectMilestonesTotal
  } = useApp();

  const placementReadiness = Math.round(overallPercentage * 0.95 + 5);

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)" }}>
          Analytics & Placement Readiness Engine
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
          Track your learning velocity, consistency streak, and placement readiness index.
        </p>
      </div>

      {/* Top Metrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <div className="glass-card hover-lift" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-emerald)", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
            <Target size={18} />
            <span>READINESS INDEX</span>
          </div>
          <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--accent-emerald)" }}>{placementReadiness}%</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>SDE Interview Target</div>
        </div>

        <div className="glass-card hover-lift" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-amber)", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
            <Flame size={18} />
            <span>CURRENT STREAK</span>
          </div>
          <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--accent-amber)" }}>{userStats.streak} Days</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Daily Consistency</div>
        </div>

        <div className="glass-card hover-lift" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-indigo)", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
            <CheckCircle2 size={18} />
            <span>OVERALL PROGRESS</span>
          </div>
          <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--text-primary)" }}>{overallPercentage}%</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Curriculum Complete</div>
        </div>

        <div className="glass-card hover-lift" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-violet)", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
            <Award size={18} />
            <span>DSA SOLVED</span>
          </div>
          <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--text-primary)" }}>{dsaSolvedCount} / {dsaTotalCount}</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Problems Completed</div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkles size={16} style={{ color: "var(--accent-indigo)" }} />
          <span>Curriculum Mastery Breakdown</span>
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {/* DSA */}
          <div style={{ padding: "16px", borderRadius: "12px", background: "var(--bg-input)", border: "var(--glass-border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
              <span>DSA Problem Sheet</span>
              <span style={{ color: "var(--accent-emerald)" }}>{Math.round((dsaSolvedCount / dsaTotalCount) * 100)}%</span>
            </div>
            <div style={{ height: "6px", borderRadius: "9999px", background: "var(--border)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.round((dsaSolvedCount / dsaTotalCount) * 100)}%`, background: "var(--accent-emerald)" }} />
            </div>
          </div>

          {/* CS & AI */}
          <div style={{ padding: "16px", borderRadius: "12px", background: "var(--bg-input)", border: "var(--glass-border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
              <span>CS & Modern AI Hub</span>
              <span style={{ color: "var(--accent-indigo)" }}>{Math.round((csCompletedCount / 30) * 100)}%</span>
            </div>
            <div style={{ height: "6px", borderRadius: "9999px", background: "var(--border)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.round((csCompletedCount / 30) * 100)}%`, background: "var(--accent-indigo)" }} />
            </div>
          </div>

          {/* Projects */}
          <div style={{ padding: "16px", borderRadius: "12px", background: "var(--bg-input)", border: "var(--glass-border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
              <span>Capstone Projects</span>
              <span style={{ color: "var(--accent-violet)" }}>
                {projectMilestonesTotal > 0 ? Math.round((projectMilestonesDone / projectMilestonesTotal) * 100) : 0}%
              </span>
            </div>
            <div style={{ height: "6px", borderRadius: "9999px", background: "var(--border)", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${projectMilestonesTotal > 0 ? Math.round((projectMilestonesDone / projectMilestonesTotal) * 100) : 0}%`,
                background: "var(--accent-violet)"
              }} />
            </div>
          </div>
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
                className="hover-lift"
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
                  color: isCompleted ? "#fff" : "var(--text-muted)",
                  boxShadow: isCompleted ? "0 2px 10px rgba(16, 185, 129, 0.25)" : "none"
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

