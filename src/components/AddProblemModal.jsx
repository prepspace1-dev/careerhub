import React, { useState } from "react";
import { X, Star, AlertCircle, ChevronDown, ChevronRight } from "lucide-react";
import { ALL_SUBTOPICS, PATTERNS, DIFFICULTY_COLORS, DIFFICULTIES } from "../data/topics";
import { dateKey } from "../utils";

export default function AddProblemModal({ onClose, onSave, defaultTopic = "" }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [topic, setTopic] = useState(defaultTopic);
  const [difficulty, setDifficulty] = useState("Medium");
  const [status, setStatus] = useState("solved");
  const [confidence, setConfidence] = useState(3);
  const [selectedPatterns, setSelectedPatterns] = useState([]);
  const [notes, setNotes] = useState("");
  const [showPatterns, setShowPatterns] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function togglePattern(p) {
    setSelectedPatterns(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  }

  async function handleSave() {
    if (!title.trim()) { setError("Problem title is required."); return; }
    if (!topic) { setError("Please select a topic."); return; }
    setError("");
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        url: url.trim(),
        topic,
        difficulty,
        status,
        confidence: status === "solved" ? confidence : 3,
        patterns: selectedPatterns,
        notes: notes.trim(),
        solve_date: dateKey(new Date()),
        platform: "LeetCode",
      });
    } finally {
      setSaving(false);
    }
  }

  const confLabels = ["", "Blackout", "Hard", "OK", "Easy", "Perfect"];

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <span style={s.heading}>Log a Problem</span>
            <span style={s.subheading}>Track any coding problem you solved or are working on</span>
          </div>
          <button onClick={onClose} style={s.closeBtn}><X size={16} /></button>
        </div>

        {error && (
          <div style={s.errorBox}>
            <AlertCircle size={13} style={{ flexShrink: 0 }} /> {error}
          </div>
        )}

        {/* Title */}
        <label style={s.fieldGroup}>
          <span style={s.label}>Problem Title <span style={s.req}>*</span></span>
          <input
            style={s.input}
            placeholder='e.g. "Two Sum", "Maximum Subarray"...'
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
        </label>

        {/* URL */}
        <label style={s.fieldGroup}>
          <span style={s.label}>
            LeetCode / Problem URL <span style={s.optional}>(optional)</span>
          </span>
          <input
            style={s.input}
            placeholder="https://leetcode.com/problems/two-sum/"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
        </label>

        {/* Topic + Difficulty */}
        <div style={s.twoCol}>
          <label style={s.fieldGroup}>
            <span style={s.label}>Topic <span style={s.req}>*</span></span>
            <select style={s.select} value={topic} onChange={e => setTopic(e.target.value)}>
              <option value="">— Select topic —</option>
              {ALL_SUBTOPICS.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </label>

          <div style={s.fieldGroup}>
            <span style={s.label}>Difficulty</span>
            <div style={s.btnGroup}>
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  style={{
                    ...s.diffBtn,
                    background: difficulty === d ? DIFFICULTY_COLORS[d] + "22" : "transparent",
                    color: difficulty === d ? DIFFICULTY_COLORS[d] : "#5D8DC1",
                    borderColor: difficulty === d ? DIFFICULTY_COLORS[d] : "#1C2842",
                    fontWeight: difficulty === d ? 700 : 500,
                  }}
                  onClick={() => setDifficulty(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Status */}
        <div style={s.fieldGroup}>
          <span style={s.label}>Status</span>
          <div style={s.btnGroup}>
            {["solving", "solved"].map(st => (
              <button
                key={st}
                style={{
                  ...s.statusBtn,
                  background: status === st
                    ? (st === "solved" ? "rgba(74,222,128,0.15)" : "rgba(242,169,59,0.15)")
                    : "transparent",
                  color: status === st
                    ? (st === "solved" ? "#4ADE80" : "#F2A93B")
                    : "#8493AA",
                  borderColor: status === st
                    ? (st === "solved" ? "#4ADE80" : "#F2A93B")
                    : "#1C2842",
                }}
                onClick={() => setStatus(st)}
              >
                {st === "solved" ? "✓  Solved" : "⋯  Solving"}
              </button>
            ))}
          </div>
        </div>

        {/* Confidence — only for solved */}
        {status === "solved" && (
          <div style={s.fieldGroup}>
            <span style={s.label}>How confident are you with this problem?</span>
            <div style={s.starRow}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setConfidence(n)} style={s.starBtn}>
                  <Star
                    size={26}
                    fill={n <= confidence ? "#F2A93B" : "transparent"}
                    color={n <= confidence ? "#F2A93B" : "#2A3448"}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
              <span style={s.confLabel}>— {confLabels[confidence]}</span>
            </div>
          </div>
        )}

        {/* Patterns (collapsible) */}
        <div style={s.fieldGroup}>
          <button style={s.patternToggle} onClick={() => setShowPatterns(p => !p)}>
            {showPatterns ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            Patterns used
            {selectedPatterns.length > 0 && (
              <span style={s.patternCount}>{selectedPatterns.length} selected</span>
            )}
          </button>
          {showPatterns && (
            <div style={s.patternGrid}>
              {PATTERNS.map(p => (
                <button
                  key={p}
                  style={{
                    ...s.patternChip,
                    background: selectedPatterns.includes(p)
                      ? "rgba(56,217,201,0.15)" : "rgba(18,26,43,0.6)",
                    color: selectedPatterns.includes(p) ? "#38D9C9" : "#5D8DC1",
                    borderColor: selectedPatterns.includes(p) ? "#38D9C9" : "#1C2842",
                  }}
                  onClick={() => togglePattern(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <label style={s.fieldGroup}>
          <span style={s.label}>Notes <span style={s.optional}>(optional)</span></span>
          <textarea
            style={s.textarea}
            rows={2}
            placeholder="Key insight, approach, or mistake to avoid..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </label>

        {/* Actions */}
        <div style={s.actions}>
          <button style={s.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={s.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Problem"}
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(6px)",
    zIndex: 1000,
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "16px",
    animation: "fadeIn 0.15s ease",
  },
  modal: {
    background: "#0E1626",
    border: "1px solid #1C2842",
    borderRadius: 22,
    padding: "24px",
    width: "100%", maxWidth: 560,
    maxHeight: "90vh", overflowY: "auto",
    display: "flex", flexDirection: "column", gap: 18,
    boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(56,217,201,0.04)",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    borderBottom: "1px solid #1C2842", paddingBottom: 16, gap: 12,
  },
  heading: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 16, fontWeight: 700, color: "#E7EDF5", display: "block", marginBottom: 3,
  },
  subheading: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 11.5, color: "#5D8DC1", display: "block",
  },
  closeBtn: {
    color: "#5D8DC1", padding: 4, borderRadius: 6, display: "flex", flexShrink: 0,
  },
  errorBox: {
    display: "flex", alignItems: "center", gap: 8,
    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: 10, padding: "9px 12px",
    fontSize: 12.5, color: "#FCA5A5",
    fontFamily: "'IBM Plex Sans', sans-serif",
  },
  fieldGroup: {
    display: "flex", flexDirection: "column", gap: 7, width: "100%",
  },
  label: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10.5, fontWeight: 600, color: "#5D8DC1",
    letterSpacing: 0.5, textTransform: "uppercase",
  },
  req: { color: "#EF4444" },
  optional: { color: "#3A4560", textTransform: "none", letterSpacing: 0, fontWeight: 400 },
  input: {
    background: "#121A2B", border: "1px solid #1C2842", borderRadius: 10,
    color: "#E7EDF5", fontSize: 13.5, padding: "10px 14px",
    outline: "none", fontFamily: "'IBM Plex Sans', sans-serif", width: "100%",
    transition: "border-color 0.15s",
  },
  select: {
    background: "#121A2B", border: "1px solid #1C2842", borderRadius: 10,
    color: "#E7EDF5", fontSize: 13.5, padding: "10px 14px",
    outline: "none", fontFamily: "'IBM Plex Sans', sans-serif", width: "100%",
  },
  textarea: {
    background: "#121A2B", border: "1px solid #1C2842", borderRadius: 10,
    color: "#E7EDF5", fontSize: 13, padding: "10px 14px",
    outline: "none", fontFamily: "'IBM Plex Sans', sans-serif",
    resize: "vertical", width: "100%",
  },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  btnGroup: { display: "flex", gap: 6, flexWrap: "wrap" },
  diffBtn: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11, padding: "6px 14px", borderRadius: 9, border: "1px solid",
    cursor: "pointer", transition: "all 0.15s ease",
  },
  statusBtn: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11.5, fontWeight: 600, padding: "7px 20px",
    borderRadius: 10, border: "1px solid", cursor: "pointer",
    transition: "all 0.15s ease", flex: 1, textAlign: "center",
  },
  starRow: { display: "flex", alignItems: "center", gap: 4 },
  starBtn: { display: "flex", padding: 2, lineHeight: 1 },
  confLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11, color: "#F2A93B", marginLeft: 8,
  },
  patternToggle: {
    display: "flex", alignItems: "center", gap: 7,
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12, color: "#5D8DC1", padding: "4px 0", textAlign: "left",
  },
  patternCount: {
    background: "rgba(56,217,201,0.12)", color: "#38D9C9",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10, fontWeight: 700, padding: "1px 8px", borderRadius: 10,
  },
  patternGrid: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 },
  patternChip: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10, fontWeight: 600,
    padding: "3px 10px", borderRadius: 20, border: "1px solid",
    cursor: "pointer", transition: "all 0.12s ease",
  },
  actions: {
    display: "flex", gap: 10,
    paddingTop: 10, borderTop: "1px solid #1C2842", marginTop: 2,
  },
  cancelBtn: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12, color: "#8493AA",
    padding: "10px 20px", borderRadius: 10, border: "1px solid #1C2842",
    flex: 1, cursor: "pointer",
  },
  saveBtn: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12, fontWeight: 700,
    background: "linear-gradient(135deg, #38D9C9 0%, #5D8DC1 100%)",
    color: "#0A0F1C", padding: "10px 20px", borderRadius: 10,
    flex: 2, cursor: "pointer",
    boxShadow: "0 2px 16px rgba(56,217,201,0.3)",
    transition: "opacity 0.15s",
  },
};
