import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { csAiTopics } from "../../data/csAiData";
import { CheckCircle2, ArrowRight } from "lucide-react";

export function CSAIHub() {
  const { dayProgress, setCurrentDay, setActiveTab } = useApp();
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = ["All", "Systems Foundations", "Data & System Design", "Security, Cloud & AI", "Agentic AI & Engineering", "Mindset & Capstone"];

  const filteredTopics = filterCategory === "All"
    ? csAiTopics
    : csAiTopics.filter((t) => t.category === filterCategory);

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)" }}>
          CS & Modern AI Knowledge Base
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px", marginBottom: "16px" }}>
          54 Core Systems & AI Engineering Topics across 30 Days.
        </p>

        {/* Category Filters */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: filterCategory === cat ? 700 : 500,
                background: filterCategory === cat ? "var(--accent-indigo)" : "var(--bg-input)",
                color: filterCategory === cat ? "#fff" : "var(--text-secondary)",
                border: "var(--glass-border)"
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Topics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {filteredTopics.map((t) => {
          const isRead = dayProgress[t.day]?.theoryRead;
          return (
            <div key={t.day} className="glass-card" style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-indigo)" }}>
                    DAY {t.day < 10 ? `0${t.day}` : t.day}
                  </span>
                  {isRead && (
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700, color: "var(--accent-emerald)" }}>
                      <CheckCircle2 size={13} />
                      Completed
                    </span>
                  )}
                </div>

                <h4 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                  {t.title}
                </h4>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px" }}>
                  {t.subtitle}
                </p>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {t.overview}
                </p>
              </div>

              <button
                onClick={() => {
                  setCurrentDay(t.day);
                  setActiveTab("workspace");
                }}
                style={{
                  marginTop: "16px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--accent-indigo)"
                }}
              >
                <span>Study Day {t.day} Topic</span>
                <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
