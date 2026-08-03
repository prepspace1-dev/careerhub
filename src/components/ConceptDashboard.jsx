import React, { useState, useEffect } from "react";
import { ArrowLeft, Check, FileText } from "lucide-react";

export default function ConceptDashboard({
  topic,
  category,
  roadmapItems = {},
  onBack,
  onPersistRoadmapItem,
}) {
  const categoryData = roadmapItems[category.id] || {};
  const topicData = categoryData[topic.id] || {};

  const currentStatus = topicData.status || "not_started";
  const initialNotes = topicData.notes || "";

  const [notes, setNotes] = useState(initialNotes);
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state if topicData changes
  useEffect(() => {
    setNotes(topicData.notes || "");
    setStatus(topicData.status || "not_started");
  }, [topic.id, category.id, roadmapItems, topicData.notes, topicData.status]);

  async function handleStatusChange(newStatus) {
    setStatus(newStatus);
    setSaving(true);
    try {
      await onPersistRoadmapItem(category.id, topic.id, newStatus, notes);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveNotes() {
    setSaving(true);
    try {
      await onPersistRoadmapItem(category.id, topic.id, status, notes);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.error("Error saving notes:", err);
    } finally {
      setSaving(false);
    }
  }

  const accentColor = topic.color || category.color || "#38D9C9";

  return (
    <div className="fade-in">
      {/* Back button */}
      <button onClick={onBack} style={s.backBtn}>
        <ArrowLeft size={14} />
        Back to Skill Map
      </button>

      {/* Header card */}
      <div style={s.headerCard}>
        <div>
          <div style={{ ...s.categoryTag, color: accentColor }}>
            {category.icon} {category.fullLabel || category.label}
          </div>
          <h1 style={s.title}>{topic.label}</h1>
        </div>

        {/* 1-Click Status Selector */}
        <div style={s.statusGroup}>
          <button
            onClick={() => handleStatusChange("not_started")}
            style={{
              ...s.statusBtn,
              background: status === "not_started" ? "rgba(42,52,72,0.6)" : "transparent",
              color: status === "not_started" ? "#8493AA" : "#3A4560",
              borderColor: status === "not_started" ? "#5D8DC1" : "#1C2842",
            }}
          >
            Not Started
          </button>

          <button
            onClick={() => handleStatusChange("learning")}
            style={{
              ...s.statusBtn,
              background: status === "learning" ? "rgba(242,169,59,0.18)" : "transparent",
              color: status === "learning" ? "#F2A93B" : "#3A4560",
              borderColor: status === "learning" ? "#F2A93B" : "#1C2842",
            }}
          >
            📖 Learning
          </button>

          <button
            onClick={() => handleStatusChange("mastered")}
            style={{
              ...s.statusBtn,
              background: status === "mastered" ? "rgba(74,222,128,0.18)" : "transparent",
              color: status === "mastered" ? "#4ADE80" : "#3A4560",
              borderColor: status === "mastered" ? "#4ADE80" : "#1C2842",
              fontWeight: status === "mastered" ? 700 : 500,
            }}
          >
            ✓ Mastered
          </button>
        </div>
      </div>

      {/* Notes / Interview Cheat Sheet Section */}
      <div style={s.sectionCard}>
        <div style={s.sectionHeader}>
          <div style={s.sectionTitle}>
            <FileText size={15} color={accentColor} />
            <span>Concept Notes &amp; Revision Cheat Sheet</span>
          </div>
          {savedSuccess && (
            <span style={s.savedBadge}>
              <Check size={12} /> Saved to Cloud
            </span>
          )}
        </div>

        <p style={s.sectionDesc}>
          Jot down key definitions, code snippets, interview questions, or formulas for <strong>{topic.label}</strong>.
        </p>

        <textarea
          style={s.textarea}
          rows={10}
          placeholder={`Write your revision notes for ${topic.label} here...\n\nExample:\n- Key Definition:\n- Important Interview Question:\n- Common pitfalls:`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div style={s.actionsRow}>
          <button onClick={handleSaveNotes} style={{ ...s.saveBtn, background: accentColor }} disabled={saving}>
            {saving ? "Saving..." : "Save Notes"}
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  backBtn: {
    display: "flex", alignItems: "center", gap: 8,
    color: "#5D8DC1", fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11.5, fontWeight: 600, marginBottom: 20, padding: "4px 0",
    cursor: "pointer", background: "none", border: "none",
  },
  headerCard: {
    background: "rgba(14,22,38,0.65)", border: "1px solid #1C2842",
    borderRadius: 18, padding: "20px 24px", marginBottom: 20,
    display: "flex", justifyContent: "space-between", alignItems: "center",
    flexWrap: "wrap", gap: 16,
  },
  categoryTag: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 700,
    letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4,
  },
  title: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 24, fontWeight: 700,
    color: "#E7EDF5", margin: 0,
  },
  statusGroup: { display: "flex", gap: 8, flexWrap: "wrap" },
  statusBtn: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5,
    padding: "7px 16px", borderRadius: 12, border: "1px solid",
    cursor: "pointer", transition: "all 0.15s ease",
  },
  sectionCard: {
    background: "rgba(14,22,38,0.55)", border: "1px solid #1C2842",
    borderRadius: 18, padding: "22px 24px", marginBottom: 20,
  },
  sectionHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    display: "flex", alignItems: "center", gap: 8,
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 700,
    color: "#E7EDF5",
  },
  savedBadge: {
    display: "flex", alignItems: "center", gap: 4,
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#4ADE80",
    background: "rgba(74,222,128,0.1)", padding: "3px 10px", borderRadius: 10,
  },
  sectionDesc: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: "#8493AA",
    marginBottom: 14, lineHeight: 1.4,
  },
  textarea: {
    width: "100%", background: "#0E1626", border: "1px solid #1C2842",
    borderRadius: 12, color: "#E7EDF5", fontSize: 13.5, fontFamily: "'IBM Plex Sans', sans-serif",
    padding: "14px 16px", outline: "none", resize: "vertical",
    lineHeight: 1.6, marginBottom: 16,
  },
  actionsRow: { display: "flex", justifyContent: "flex-end" },
  saveBtn: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 700,
    color: "#0A0F1C", padding: "10px 22px", borderRadius: 10,
    cursor: "pointer", border: "none",
    boxShadow: "0 2px 12px rgba(56,217,201,0.25)",
  },
};
