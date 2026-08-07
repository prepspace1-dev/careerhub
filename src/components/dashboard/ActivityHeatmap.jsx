import React from "react";
import { useApp } from "../../context/AppContext";
import { dsaProblems } from "../../data/dsaData";
import { Calendar } from "lucide-react";

export function ActivityHeatmap() {
  const { dayProgress, dsaStatus, currentDay, setCurrentDay, setActiveTab } = useApp();

  // Compute completion level for each day 1 to 30
  const getDayData = (dayNum) => {
    const progress = dayProgress[dayNum] || {};
    const theoryRead = !!progress.theoryRead;
    
    // Check DSA problems for this day
    const dayDSA = dsaProblems.filter((p) => p.day === dayNum);
    const dsaSolvedCount = dayDSA.filter((p) => dsaStatus[p.id]?.status === "Solved").length;
    const dsaTotalCount = dayDSA.length;

    // Calculate score (0 to 100)
    let score = 0;
    if (theoryRead) score += 40;
    if (dsaTotalCount > 0) {
      score += Math.round((dsaSolvedCount / dsaTotalCount) * 60);
    } else if (theoryRead) {
      score = 100;
    }

    let level = 0; // 0: 0%, 1: 1-33%, 2: 34-66%, 3: 67-100%
    if (score > 66) level = 3;
    else if (score > 33) level = 2;
    else if (score > 0) level = 1;

    return { dayNum, score, level, theoryRead, dsaSolvedCount, dsaTotalCount };
  };

  const days = Array.from({ length: 30 }, (_, i) => getDayData(i + 1));
  const activeCount = days.filter((d) => d.score > 0).length;

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
        marginBottom: "20px",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "38px",
            height: "38px",
            borderRadius: "12px",
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-emerald)"
          }}>
            <Calendar size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>
              30-Day Activity Matrix 🟩
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
              {activeCount} of 30 days active • Click any tile to jump to that day's workspace
            </p>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 600 }}>
          <span>Less</span>
          <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "rgba(255, 255, 255, 0.06)", border: "1px solid var(--border)" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "rgba(16, 185, 129, 0.3)" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "rgba(16, 185, 129, 0.65)" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "var(--accent-emerald)", boxShadow: "0 0 8px rgba(16, 185, 129, 0.5)" }} />
          <span>More</span>
        </div>
      </div>

      {/* Grid of 30 Days (5 columns x 6 rows or flex grid) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(36px, 1fr))",
        gap: "10px",
        padding: "4px"
      }}>
        {days.map((day) => {
          const isCurrent = day.dayNum === currentDay;

          let bg = "rgba(255, 255, 255, 0.05)";
          let border = "1px solid var(--border)";
          let boxShadow = "none";

          if (day.level === 3) {
            bg = "linear-gradient(135deg, #10b981, #059669)";
            border = "1px solid #10b981";
            boxShadow = "0 0 12px rgba(16, 185, 129, 0.4)";
          } else if (day.level === 2) {
            bg = "rgba(16, 185, 129, 0.55)";
            border = "1px solid rgba(16, 185, 129, 0.7)";
          } else if (day.level === 1) {
            bg = "rgba(16, 185, 129, 0.25)";
            border = "1px solid rgba(16, 185, 129, 0.4)";
          }

          if (isCurrent) {
            border = "2px solid var(--accent-indigo)";
            boxShadow = "0 0 14px var(--glow-accent)";
          }

          return (
            <button
              key={day.dayNum}
              onClick={() => {
                setCurrentDay(day.dayNum);
                setActiveTab("workspace");
              }}
              title={`Day ${day.dayNum}: ${day.score}% Complete (${day.dsaSolvedCount}/${day.dsaTotalCount} DSA Solved, Theory: ${day.theoryRead ? "Read" : "Pending"})`}
              className="hover-lift"
              style={{
                aspectRatio: "1",
                borderRadius: "10px",
                background: bg,
                border: border,
                boxShadow: boxShadow,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 800,
                color: day.level > 1 ? "#fff" : "var(--text-primary)",
                cursor: "pointer",
                position: "relative",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            >
              <span>{day.dayNum}</span>
              {isCurrent && (
                <div style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "9999px",
                  background: "var(--accent-indigo)"
                }} className="active-day-glow" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
