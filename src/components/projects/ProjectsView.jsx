import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { projectsData } from "../../data/projectsData";
import { CheckSquare, Square, Copy, Check, Sparkles } from "lucide-react";

export function ProjectsView() {
  const { projectMilestones, toggleProjectMilestone } = useApp();
  const [copiedIdx, setCopiedIdx] = useState(null);

  const copyBullet = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)" }}>
          30-Day Capstone Project Sprints
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
          4 Deployed, Production-Grade Projects to showcase on your GitHub and resume.
        </p>
      </div>

      {/* Projects Grid */}
      <div style={{ display: "grid", gap: "24px" }}>
        {projectsData.map((proj) => {
          const projMap = projectMilestones[proj.id] || {};
          const doneCount = proj.milestones.filter((m) => projMap[m.day]).length;
          const totalCount = proj.milestones.length;
          const progressPercent = Math.round((doneCount / totalCount) * 100);

          return (
            <div key={proj.id} className="glass-card hover-lift" style={{ padding: "28px" }}>
              {/* Top Details */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <span style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "9999px",
                    background: "rgba(99, 102, 241, 0.15)",
                    color: "var(--accent-indigo)"
                  }}>
                    WEEK {proj.week} SPRINT
                  </span>
                  <h3 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)", marginTop: "6px" }}>
                    {proj.title}
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    {proj.subtitle}
                  </p>
                </div>

                <div style={{ padding: "8px 16px", borderRadius: "10px", background: "rgba(99, 102, 241, 0.12)", color: "var(--accent-indigo)", fontWeight: 700, fontSize: "14px" }}>
                  {progressPercent}% Complete
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
                {proj.techStack.map((tech, i) => (
                  <span key={i} style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "4px 12px",
                    borderRadius: "9999px",
                    background: "var(--bg-input)",
                    color: "var(--text-secondary)",
                    border: "var(--glass-border)"
                  }}>
                    {tech}
                  </span>
                ))}
              </div>

              {/* Milestones Checklist */}
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>
                  Daily Build Deliverables
                </h4>
                <div style={{ display: "grid", gap: "8px" }}>
                  {proj.milestones.map((m) => {
                    const isDone = !!projMap[m.day];
                    return (
                      <button
                        key={m.day}
                        onClick={() => toggleProjectMilestone(proj.id, m.day)}
                        className="hover-lift"
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                          padding: "12px 14px",
                          borderRadius: "10px",
                          background: isDone ? "rgba(16, 185, 129, 0.06)" : "var(--bg-input)",
                          border: isDone ? "1px solid rgba(16, 185, 129, 0.25)" : "var(--glass-border)",
                          textAlign: "left"
                        }}
                      >
                        <div style={{ color: isDone ? "var(--accent-emerald)" : "var(--text-muted)", marginTop: "2px" }}>
                          {isDone ? <CheckSquare size={18} /> : <Square size={18} />}
                        </div>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                            Day {m.day}: {m.title}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                            {m.deliverable}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Resume Bullets Section */}
              <div style={{ padding: "16px", borderRadius: "12px", background: "var(--bg-input)", border: "var(--glass-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent-indigo)", fontWeight: 700, fontSize: "13px", marginBottom: "10px" }}>
                  <Sparkles size={14} />
                  <span>RESUME BULLET POINTS (READY TO COPY)</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {proj.resumeBullets.map((bullet, idx) => {
                    const uniqueKey = `${proj.id}-${idx}`;
                    const isCopied = copiedIdx === uniqueKey;
                    return (
                      <div key={idx} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                        <span>• {bullet}</span>
                        <button
                          onClick={() => copyBullet(bullet, uniqueKey)}
                          title="Copy bullet"
                          style={{ color: isCopied ? "var(--accent-emerald)" : "var(--text-muted)", padding: "4px" }}
                        >
                          {isCopied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

