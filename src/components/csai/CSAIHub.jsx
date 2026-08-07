import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { csAiTopics } from "../../data/csAiData";
import { CheckCircle2, ArrowRight, Layers, LayoutGrid, RotateCw } from "lucide-react";

export function CSAIHub() {
  const { dayProgress, setCurrentDay, setActiveTab, toggleTheoryRead } = useApp();
  const [filterCategory, setFilterCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'flashcards'
  const [flippedCards, setFlippedCards] = useState({});

  const categories = ["All", "Systems Foundations", "Data & System Design", "Security, Cloud & AI", "Agentic AI & Engineering", "Mindset & Capstone"];

  const filteredTopics = filterCategory === "All"
    ? csAiTopics
    : csAiTopics.filter((t) => t.category === filterCategory);

  const toggleFlip = (day) => {
    setFlippedCards((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)" }}>
              CS & Modern AI Knowledge Base
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
              54 Core Systems & AI Engineering Topics across 30 Days.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            background: "var(--bg-input)",
            padding: "4px",
            borderRadius: "10px",
            border: "var(--glass-border)"
          }}>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                background: viewMode === "grid" ? "var(--bg-card)" : "transparent",
                color: viewMode === "grid" ? "var(--accent-indigo)" : "var(--text-secondary)",
                boxShadow: viewMode === "grid" ? "0 2px 8px rgba(0,0,0,0.2)" : "none"
              }}
            >
              <LayoutGrid size={14} />
              <span>Grid View</span>
            </button>

            <button
              onClick={() => setViewMode("flashcards")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                background: viewMode === "flashcards" ? "var(--accent-indigo)" : "transparent",
                color: viewMode === "flashcards" ? "#fff" : "var(--text-secondary)",
                boxShadow: viewMode === "flashcards" ? "0 2px 8px var(--glow-accent)" : "none"
              }}
            >
              <Layers size={14} />
              <span>3D Flashcards</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px", marginTop: "12px" }}>
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

      {/* FLASHCARDS VIEW */}
      {viewMode === "flashcards" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {filteredTopics.map((t) => {
            const isRead = dayProgress[t.day]?.theoryRead;
            const isFlipped = flippedCards[t.day];

            return (
              <div
                key={t.day}
                className="perspective-1000"
                style={{ height: "260px", cursor: "pointer" }}
                onClick={() => toggleFlip(t.day)}
              >
                <div className={`flashcard-inner ${isFlipped ? "flipped" : ""}`}>
                  {/* FRONT side */}
                  <div className="flashcard-front glass-card hover-lift" style={{
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    background: "linear-gradient(135deg, var(--bg-card), var(--bg-subtle))"
                  }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--accent-indigo)", letterSpacing: "0.5px" }}>
                          DAY {t.day < 10 ? `0${t.day}` : t.day} • {t.category}
                        </span>
                        {isRead && <CheckCircle2 size={16} style={{ color: "var(--accent-emerald)" }} />}
                      </div>

                      <h4 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "6px" }}>
                        {t.title}
                      </h4>
                      <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                        {t.subtitle}
                      </p>
                    </div>

                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "var(--accent-indigo)",
                      padding: "8px",
                      borderRadius: "8px",
                      background: "rgba(99, 102, 241, 0.1)"
                    }}>
                      <RotateCw size={14} />
                      <span>Tap to Flip Card</span>
                    </div>
                  </div>

                  {/* BACK side */}
                  <div className="flashcard-back glass-card" style={{
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    background: "linear-gradient(135deg, var(--bg-card-hover), var(--bg-card))"
                  }}>
                    <div style={{ overflowY: "auto" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-emerald)", marginBottom: "6px" }}>
                        CONCEPT RECALL KEY TAKEAWAYS
                      </div>
                      <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                        {t.overview}
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTheoryRead(t.day);
                        }}
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 700,
                          background: isRead ? "rgba(16, 185, 129, 0.2)" : "var(--accent-emerald)",
                          color: "#fff"
                        }}
                      >
                        {isRead ? "✓ Completed" : "Mark Completed"}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentDay(t.day);
                          setActiveTab("workspace");
                        }}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 700,
                          background: "var(--bg-input)",
                          color: "var(--text-primary)"
                        }}
                      >
                        Full Notes →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* STANDARD GRID VIEW */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {filteredTopics.map((t) => {
            const isRead = dayProgress[t.day]?.theoryRead;
            return (
              <div key={t.day} className="glass-card hover-lift" style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
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
      )}
    </div>
  );
}

