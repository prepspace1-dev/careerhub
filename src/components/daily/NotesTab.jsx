import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { FileText, Check } from "lucide-react";

export function NotesTab({ dayNum }) {
  const { dailyNotes, saveDayNote, dayProgress, saveReflection } = useApp();
  
  const [noteContent, setNoteContent] = useState(dailyNotes[dayNum] || "");
  const [savedStatus, setSavedStatus] = useState(false);

  const reflection = dayProgress[dayNum]?.reflection || { learned: "", difficult: "", revise: "" };
  const [learned, setLearned] = useState(reflection.learned || "");
  const [difficult, setDifficult] = useState(reflection.difficult || "");
  const [revise, setRevise] = useState(reflection.revise || "");

  // Autosave notes on change after 600ms
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDayNote(dayNum, noteContent);
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 1500);
    }, 600);
    return () => clearTimeout(timer);
  }, [noteContent, dayNum, saveDayNote]);

  const handleSaveReflection = () => {
    saveReflection(dayNum, { learned, difficult, revise });
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 1500);
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Rich Markdown Notes Editor */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-indigo)", fontWeight: 700, fontSize: "14px" }}>
            <FileText size={18} />
            <span>DAY {dayNum} NOTES & KEY CONCEPTS</span>
          </div>
          {savedStatus && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--accent-emerald)", fontWeight: 600 }}>
              <Check size={14} />
              <span>Autosaved</span>
            </div>
          )}
        </div>

        <textarea
          rows={10}
          placeholder="Write your notes, code snippets, or key takeaways here..."
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            background: "var(--bg-input)",
            border: "var(--glass-border)",
            color: "var(--text-primary)",
            fontSize: "14px",
            fontFamily: "var(--mono)",
            lineHeight: "1.6",
            outline: "none",
            resize: "vertical"
          }}
        />
      </div>

      {/* End of Day Reflection */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <h4 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px" }}>
          End-of-Day Reflection
        </h4>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px" }}>
              What did you learn today?
            </label>
            <input
              type="text"
              placeholder="e.g. Understood Floyd's cycle detection algorithm..."
              value={learned}
              onChange={(e) => setLearned(e.target.value)}
              onBlur={handleSaveReflection}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "var(--bg-input)",
                border: "var(--glass-border)",
                fontSize: "13px",
                color: "var(--text-primary)",
                outline: "none"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px" }}>
              What was difficult?
            </label>
            <input
              type="text"
              placeholder="e.g. Handling edge cases for empty linked lists..."
              value={difficult}
              onChange={(e) => setDifficult(e.target.value)}
              onBlur={handleSaveReflection}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "var(--bg-input)",
                border: "var(--glass-border)",
                fontSize: "13px",
                color: "var(--text-primary)",
                outline: "none"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px" }}>
              What should you revise later?
            </label>
            <input
              type="text"
              placeholder="e.g. Re-attempt #141 Cycle Detection cold tomorrow..."
              value={revise}
              onChange={(e) => setRevise(e.target.value)}
              onBlur={handleSaveReflection}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "var(--bg-input)",
                border: "var(--glass-border)",
                fontSize: "13px",
                color: "var(--text-primary)",
                outline: "none"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
