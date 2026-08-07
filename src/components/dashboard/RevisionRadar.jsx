import React from "react";
import { useApp } from "../../context/AppContext";
import { RotateCcw, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

export function RevisionRadar() {
  const { dsaStatus, dsaProblems, updateDSAStatus, setCurrentDay, setActiveTab } = useApp();

  // Find problems marked Revision Required or Bookmarked
  const revisionProblems = [];
  Object.entries(dsaStatus).forEach(([idStr, item]) => {
    if (item.status === "Revision Required" || item.bookmarked) {
      const prob = dsaProblems.find((p) => p.id === parseInt(idStr, 10));
      if (prob) {
        revisionProblems.push({
          ...prob,
          status: item.status,
          bookmarked: item.bookmarked,
          notes: item.notes
        });
      }
    }
  });

  return (
    <div className="glass-card animate-fade-in hover-lift" style={{
      padding: "24px 28px",
      background: "var(--bg-card)",
      border: "var(--glass-border)",
      borderRadius: "20px"
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "16px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "38px",
            height: "38px",
            borderRadius: "12px",
            background: "rgba(245, 158, 11, 0.15)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-amber)"
          }}>
            <RotateCcw size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>
              Smart Revision Radar 🔁
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
              {revisionProblems.length > 0
                ? `${revisionProblems.length} items flagged for review to prevent memory decay`
                : "All clear! No items flagged for revision"}
            </p>
          </div>
        </div>

        {revisionProblems.length > 0 && (
          <button
            onClick={() => setActiveTab("dsa")}
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "var(--accent-indigo)",
              background: "transparent",
              border: "none",
              cursor: "pointer"
            }}
          >
            View Vault →
          </button>
        )}
      </div>

      {/* Content */}
      {revisionProblems.length === 0 ? (
        <div style={{
          padding: "20px",
          borderRadius: "14px",
          background: "rgba(16, 185, 129, 0.08)",
          border: "1px dashed rgba(16, 185, 129, 0.3)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          color: "var(--accent-emerald)"
        }}>
          <Sparkles size={20} />
          <span style={{ fontSize: "13.5px", fontWeight: 600 }}>
            Awesome job! You have no pending revisions. Mark any problem as <strong>Revision Required</strong> in the DSA sheet to queue it here.
          </span>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {revisionProblems.slice(0, 3).map((item) => (
            <div
              key={item.id}
              style={{
                padding: "14px 18px",
                borderRadius: "14px",
                background: "var(--bg-subtle)",
                border: "var(--glass-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "14px"
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "6px",
                    background: "rgba(99, 102, 241, 0.15)",
                    color: "var(--accent-indigo)"
                  }}>
                    Day {item.day}
                  </span>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "6px",
                    background: item.status === "Revision Required" ? "rgba(245, 158, 11, 0.15)" : "rgba(139, 92, 246, 0.15)",
                    color: item.status === "Revision Required" ? "var(--accent-amber)" : "var(--accent-violet)"
                  }}>
                    {item.status === "Revision Required" ? "Revision Required" : "Bookmarked"}
                  </span>
                </div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  #{item.leetcodeId} {item.title}
                </h4>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  onClick={() => {
                    setCurrentDay(item.day);
                    setActiveTab("workspace");
                  }}
                  className="hover-lift"
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    background: "rgba(99, 102, 241, 0.15)",
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                    color: "var(--accent-indigo)",
                    fontSize: "12px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <span>Practice</span>
                  <ArrowRight size={12} />
                </button>

                <button
                  onClick={() => updateDSAStatus(item.id, "Solved", { bookmarked: false })}
                  title="Mark as Mastered"
                  className="hover-lift"
                  style={{
                    padding: "6px 10px",
                    borderRadius: "8px",
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    color: "var(--accent-emerald)",
                    fontSize: "12px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <CheckCircle2 size={13} />
                  <span>Done</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
