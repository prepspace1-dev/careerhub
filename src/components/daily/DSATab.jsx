import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { dsaProblems } from "../../data/dsaData";
import { ExternalLink, HelpCircle, CheckCircle2, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";

export function DSATab({ dayNum }) {
  const { dsaStatus, updateDSAStatus } = useApp();
  const dayProblems = dsaProblems.filter((p) => p.day === dayNum);
  const [openHintId, setOpenHintId] = useState(null);

  const getDifficultyBadge = (level) => {
    switch (level) {
      case "Easy":
        return { bg: "rgba(16, 185, 129, 0.15)", color: "var(--accent-emerald)", border: "rgba(16, 185, 129, 0.3)" };
      case "Medium":
        return { bg: "rgba(245, 158, 11, 0.15)", color: "var(--accent-amber)", border: "rgba(245, 158, 11, 0.3)" };
      case "Hard":
        return { bg: "rgba(244, 63, 94, 0.15)", color: "var(--accent-rose)", border: "rgba(244, 63, 94, 0.3)" };
      default:
        return { bg: "var(--bg-input)", color: "var(--text-secondary)", border: "var(--border)" };
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {dayProblems.map((prob) => {
        const current = dsaStatus[prob.id] || { status: "Unsolved", notes: "" };
        const badge = getDifficultyBadge(prob.level);
        const isHintOpen = openHintId === prob.id;

        return (
          <div key={prob.id} className="glass-card" style={{ padding: "20px" }}>
            {/* Top Bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)" }}>
                  #{prob.leetcodeId}
                </span>
                <h4 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {prob.title}
                </h4>
                <span style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: "6px",
                  background: badge.bg,
                  color: badge.color,
                  border: `1px solid ${badge.border}`
                }}>
                  {prob.level}
                </span>
              </div>

              {/* Status Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  onClick={() => updateDSAStatus(prob.id, "Solved")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 700,
                    background: current.status === "Solved" ? "var(--accent-emerald)" : "var(--bg-input)",
                    color: current.status === "Solved" ? "#fff" : "var(--text-secondary)",
                    border: "var(--glass-border)"
                  }}
                >
                  <CheckCircle2 size={14} />
                  <span>Solved</span>
                </button>

                <button
                  onClick={() => updateDSAStatus(prob.id, "Revision Required")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 700,
                    background: current.status === "Revision Required" ? "var(--accent-amber)" : "var(--bg-input)",
                    color: current.status === "Revision Required" ? "#fff" : "var(--text-secondary)",
                    border: "var(--glass-border)"
                  }}
                >
                  <RotateCcw size={14} />
                  <span>Revision</span>
                </button>

                {/* LeetCode Direct Link */}
                <a
                  href={prob.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 700,
                    background: "rgba(99, 102, 241, 0.15)",
                    color: "var(--accent-indigo)",
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                    textDecoration: "none"
                  }}
                >
                  <span>LeetCode</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>

            {/* Hint Accordion Toggle */}
            <div style={{ marginTop: "8px" }}>
              <button
                onClick={() => setOpenHintId(isHintOpen ? null : prob.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--accent-indigo)"
                }}
              >
                <HelpCircle size={14} />
                <span>{isHintOpen ? "Hide Intuition & Strategy" : "Show Intuition & Strategy"}</span>
                {isHintOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {isHintOpen && (
                <div style={{
                  marginTop: "8px",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  background: "var(--bg-input)",
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  border: "var(--glass-border)",
                  lineHeight: "1.5"
                }}>
                  💡 <strong>Intuition:</strong> {prob.hint}
                </div>
              )}
            </div>

            {/* Notes Input */}
            <div style={{ marginTop: "12px" }}>
              <input
                type="text"
                placeholder="Personal notes (e.g., 'Used sliding window with hashset')..."
                value={current.notes || ""}
                onChange={(e) => updateDSAStatus(prob.id, current.status, { notes: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  background: "var(--bg-input)",
                  border: "var(--glass-border)",
                  fontSize: "12px",
                  color: "var(--text-primary)",
                  outline: "none"
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
