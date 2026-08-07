import React from "react";
import { useApp } from "../../context/AppContext";
import { Code2, BrainCircuit, Kanban, Clock } from "lucide-react";

export function QuickMetrics() {
  const { 
    dsaSolvedCount, 
    dsaTotalCount, 
    csCompletedCount, 
    csTotalCount, 
    projectMilestonesDone, 
    projectMilestonesTotal, 
    userStats 
  } = useApp();

  const metrics = [
    {
      label: "DSA Solved",
      val: `${dsaSolvedCount} / ${dsaTotalCount}`,
      sub: `${Math.round((dsaSolvedCount / dsaTotalCount) * 100)}% Complete`,
      icon: Code2,
      color: "var(--accent-indigo)"
    },
    {
      label: "CS & AI Topics",
      val: `${csCompletedCount} / ${csTotalCount}`,
      sub: `${Math.round((csCompletedCount / csTotalCount) * 100)}% Complete`,
      icon: BrainCircuit,
      color: "var(--accent-violet)"
    },
    {
      label: "Project Deliverables",
      val: `${projectMilestonesDone} / ${projectMilestonesTotal}`,
      sub: "4 Build Sprints",
      icon: Kanban,
      color: "var(--accent-emerald)"
    },
    {
      label: "Hours Studied",
      val: `${(userStats.totalMinutes / 60).toFixed(1)} hrs`,
      sub: "Active Flow State",
      icon: Clock,
      color: "var(--accent-amber)"
    }
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
      gap: "16px",
      margin: "20px 0"
    }}>
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div key={idx} className="glass-card" style={{ padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)" }}>{m.label}</span>
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "var(--bg-input)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: m.color
              }}>
                <Icon size={16} />
              </div>
            </div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
              {m.val}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px", fontWeight: 500 }}>
              {m.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
}
