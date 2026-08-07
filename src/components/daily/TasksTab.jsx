import React from "react";
import { useApp } from "../../context/AppContext";
import { dsaProblems } from "../../data/dsaData";
import { CheckSquare, Square, CheckCircle2 } from "lucide-react";

export function TasksTab({ dayNum }) {
  const { dayProgress, toggleDayTask } = useApp();
  const dayDsa = dsaProblems.filter((p) => p.day === dayNum);

  const defaultTasks = [
    { id: "read_theory", title: "Read Theory & Conceptual Guide" },
    ...dayDsa.map((p) => ({ id: `dsa_prob_${p.id}`, title: `Solve DSA #${p.leetcodeId}: ${p.title} (${p.level})` })),
    { id: "project_sprint", title: `Complete Day ${dayNum} Project Sprint Milestone` },
    { id: "write_reflection", title: "Write End-of-Day Notes & Reflection" }
  ];

  const currentDayTasks = dayProgress[dayNum]?.tasks || {};
  const completedCount = defaultTasks.filter((t) => currentDayTasks[t.id]).length;
  const progressPercent = Math.round((completedCount / defaultTasks.length) * 100);

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header Progress Card */}
      <div className="glass-card" style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>
              Today's Action Checklist
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              {completedCount} of {defaultTasks.length} tasks completed
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "18px", fontWeight: 800, color: "var(--accent-indigo)" }}>
            <CheckCircle2 size={20} />
            <span>{progressPercent}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ height: "8px", borderRadius: "9999px", background: "var(--border)", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${progressPercent}%`,
            background: "linear-gradient(90deg, var(--accent-indigo), var(--accent-emerald))",
            borderRadius: "9999px",
            transition: "width 0.4s ease"
          }} />
        </div>
      </div>

      {/* Task List */}
      <div className="glass-card" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {defaultTasks.map((t) => {
          const isDone = !!currentDayTasks[t.id];
          return (
            <button
              key={t.id}
              onClick={() => toggleDayTask(dayNum, t.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "14px 16px",
                borderRadius: "12px",
                background: isDone ? "rgba(16, 185, 129, 0.06)" : "var(--bg-input)",
                border: isDone ? "1px solid rgba(16, 185, 129, 0.25)" : "var(--glass-border)",
                textAlign: "left",
                transition: "all 0.15s ease"
              }}
            >
              <div style={{ color: isDone ? "var(--accent-emerald)" : "var(--text-muted)" }}>
                {isDone ? <CheckSquare size={20} /> : <Square size={20} />}
              </div>
              <span style={{
                fontSize: "14px",
                fontWeight: isDone ? 600 : 500,
                color: isDone ? "var(--text-muted)" : "var(--text-primary)",
                textDecoration: isDone ? "line-through" : "none",
                flex: 1
              }}>
                {t.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
