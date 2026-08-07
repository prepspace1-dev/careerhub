import React from "react";
import { useApp } from "../../context/AppContext";
import { csAiTopics } from "../../data/csAiData";
import { CheckCircle2, BookOpen, Layers, Lightbulb, Check } from "lucide-react";

export function LearnTab({ dayNum }) {
  const { dayProgress, toggleTheoryRead } = useApp();
  const topic = csAiTopics.find((t) => t.day === dayNum) || csAiTopics[0];
  const isRead = dayProgress[dayNum]?.theoryRead;

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Overview Card */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-indigo)", fontWeight: 700, fontSize: "14px" }}>
            <BookOpen size={18} />
            <span>CORE THEORY & OVERVIEW</span>
          </div>
          <button
            onClick={() => toggleTheoryRead(dayNum)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "13px",
              background: isRead ? "rgba(16, 185, 129, 0.15)" : "var(--accent-indigo)",
              color: isRead ? "var(--accent-emerald)" : "#fff",
              border: isRead ? "1px solid rgba(16, 185, 129, 0.3)" : "none"
            }}
          >
            {isRead ? <CheckCircle2 size={16} /> : <Check size={16} />}
            <span>{isRead ? "Theory Completed ✔" : "Mark Theory Read (+5%)"}</span>
          </button>
        </div>

        <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
          {topic.title}
        </h3>
        <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
          {topic.overview}
        </p>
      </div>

      {/* Key Operations Section */}
      {topic.operations && topic.operations.length > 0 && (
        <div className="glass-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-violet)", fontWeight: 700, fontSize: "14px", marginBottom: "16px" }}>
            <Layers size={18} />
            <span>HOW IT WORKS: KEY OPERATIONS</span>
          </div>
          <div style={{ display: "grid", gap: "12px" }}>
            {topic.operations.map((op, idx) => (
              <div key={idx} style={{
                padding: "14px 18px",
                borderRadius: "12px",
                background: "var(--bg-input)",
                border: "var(--glass-border)"
              }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                  {idx + 1}. {op.name}
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                  {op.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real World Example & Takeaway */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="glass-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-amber)", fontWeight: 700, fontSize: "13px", marginBottom: "8px" }}>
            <Lightbulb size={16} />
            <span>REAL WORLD APPLICATION</span>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
            {topic.realWorldExample}
          </p>
        </div>

        <div className="glass-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-emerald)", fontWeight: 700, fontSize: "13px", marginBottom: "8px" }}>
            <CheckCircle2 size={16} />
            <span>KEY TAKEAWAY</span>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
            {topic.takeaway}
          </p>
        </div>
      </div>
    </div>
  );
}
