import React, { useState } from "react";
import { ArrowLeft, ExternalLink, Plus, Target, AlertTriangle, Pencil } from "lucide-react";
import { DIFFICULTY_COLORS, LEVEL_META, computeTopicLevel } from "../data/topics";
import { relativeDays, sortProblemsByDifficultyAndAge } from "../utils";
import AddProblemModal from "./AddProblemModal";

export default function TopicDashboard({ topic, category, problems, onBack, onPersistProblem, onDeleteProblem }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [filter, setFilter] = useState("all");

  // Data derived from problems
  const topicProblems = (problems || []).filter(p => p.topic === topic.id);
  const solved  = topicProblems.filter(p => p.status === "solved");
  const solving = topicProblems.filter(p => p.status === "solving");

  const easy   = solved.filter(p => p.difficulty === "Easy").length;
  const medium = solved.filter(p => p.difficulty === "Medium").length;
  const hard   = solved.filter(p => p.difficulty === "Hard").length;

  const avgConf = solved.length > 0
    ? (solved.reduce((s, p) => s + (p.confidence || 3), 0) / solved.length).toFixed(1)
    : null;

  const level = computeTopicLevel(topic.id, problems || []);
  const levelMeta = LEVEL_META[level];

  // Patterns from user's solved problems
  const patternCounts = {};
  solved.forEach(p => (p.patterns || []).forEach(pat => {
    patternCounts[pat] = (patternCounts[pat] || 0) + 1;
  }));
  const userPatterns = Object.keys(patternCounts);
  const topicPatterns = topic.patterns || [];

  // Needs revision: low confidence problems
  const needsRevision = solved
    .filter(p => (p.confidence || 3) <= 2)
    .sort((a, b) => new Date(a.solve_date) - new Date(b.solve_date));

  // Displayed problem list: Easy -> Medium -> Hard, with oldest uploaded first & newest uploaded last
  const displayProblems = (() => {
    let list = [];
    if (filter === "solved")   list = solved;
    else if (filter === "solving")  list = solving;
    else if (filter === "revision") list = needsRevision;
    else list = [...solving, ...solved];
    return sortProblemsByDifficultyAndAge(list);
  })();

  async function handleSaveProblem(problem) {
    await onPersistProblem(problem);
    setShowAddModal(false);
  }

  const accentColor = topic.color || category.color;

  return (
    <div className="fade-in">
      {/* Back */}
      <button onClick={onBack} style={s.backBtn}>
        <ArrowLeft size={14} />
        Back to Skills
      </button>

      {/* Header */}
      <div style={s.topicHeader}>
        <div>
          <div style={s.categoryLabel}>
            {category.icon} {category.label}
          </div>
          <h1 style={{ ...s.topicTitle, color: accentColor }}>{topic.label}</h1>
        </div>
        <div style={{
          ...s.levelBadge,
          background: levelMeta.bgColor,
          color: levelMeta.color,
          border: `1px solid ${levelMeta.color}44`,
        }}>
          {levelMeta.label}
        </div>
      </div>

      {/* Stats row */}
      <div style={s.statsRow}>
        <div style={s.statBox}>
          <span style={{ ...s.statVal, color: accentColor }}>{solved.length}</span>
          <span style={s.statLbl}>Solved</span>
        </div>
        {solving.length > 0 && (
          <div style={s.statBox}>
            <span style={{ ...s.statVal, color: "#F2A93B" }}>{solving.length}</span>
            <span style={s.statLbl}>In Progress</span>
          </div>
        )}
        <div style={s.statBox}>
          <span style={{ ...s.statVal, color: DIFFICULTY_COLORS.Easy }}>{easy}</span>
          <span style={s.statLbl}>Easy</span>
        </div>
        <div style={s.statBox}>
          <span style={{ ...s.statVal, color: DIFFICULTY_COLORS.Medium }}>{medium}</span>
          <span style={s.statLbl}>Medium</span>
        </div>
        <div style={s.statBox}>
          <span style={{ ...s.statVal, color: DIFFICULTY_COLORS.Hard }}>{hard}</span>
          <span style={s.statLbl}>Hard</span>
        </div>
        {avgConf !== null && (
          <div style={s.statBox}>
            <span style={{ ...s.statVal, color: "#F2A93B", fontSize: 18 }}>{avgConf}★</span>
            <span style={s.statLbl}>Avg Confidence</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div style={s.progressCard}>
        <div style={s.progressHeader}>
          <span style={s.progressLabel}>
            <Target size={11} style={{ marginRight: 5 }} />
            Practice Progress
          </span>
          <span style={s.progressFraction}>
            {solved.length} {solved.length === 1 ? "problem" : "problems"} solved
          </span>
        </div>
        <div style={s.progressTrack}>
          <div style={{
            ...s.progressFill,
            width: `${Math.min(100, solved.length * 10)}%`,
            background: solved.length >= 10 ? "#4ADE80" : accentColor,
          }} />
        </div>
      </div>

      {/* Patterns */}
      {(topicPatterns.length > 0 || userPatterns.length > 0) && (
        <div style={s.section}>
          <div style={s.sectionLabel}>Patterns</div>
          <div style={s.patternRow}>
            {topicPatterns.map(pat => {
              const learned = userPatterns.includes(pat);
              return (
                <span key={pat} style={{
                  ...s.patChip,
                  background:  learned ? `${accentColor}14` : "rgba(28,40,66,0.3)",
                  color:       learned ? accentColor : "#3A4560",
                  borderColor: learned ? `${accentColor}66` : "#1C2842",
                }}>
                  {learned ? "✓" : "○"} {pat}
                </span>
              );
            })}
            {/* Extra user patterns not in the default list */}
            {userPatterns.filter(p => !topicPatterns.includes(p)).map(pat => (
              <span key={pat} style={{ ...s.patChip, background: `${accentColor}14`, color: accentColor, borderColor: `${accentColor}66` }}>
                ✓ {pat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Needs Revision */}
      {needsRevision.length > 0 && (
        <div style={s.section}>
          <div style={{ ...s.sectionLabel, color: "#F2A93B" }}>
            <AlertTriangle size={11} style={{ marginRight: 5, color: "#F2A93B" }} />
            Needs Revision ({needsRevision.length})
          </div>
          <div style={s.revisionList}>
            {needsRevision.slice(0, 5).map(p => (
              <div key={p.id} style={s.revisionRow}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: DIFFICULTY_COLORS[p.difficulty], flexShrink: 0 }} />
                <span style={s.revTitle}>
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noreferrer" style={s.titleLink}>
                      {p.title} <ExternalLink size={10} style={{ marginLeft: 3, flexShrink: 0 }} />
                    </a>
                  ) : p.title}
                </span>
                <span style={s.revConf}>{"★".repeat(p.confidence || 1)}{"☆".repeat(5 - (p.confidence || 1))}</span>
                <span style={s.revDate}>{p.solve_date ? relativeDays(p.solve_date) : "—"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Problems table */}
      <div style={s.section}>
        {/* Table header row */}
        <div style={s.tableTopBar}>
          <div style={s.sectionLabel} className="no-margin">
            Problems ({topicProblems.length})
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            {(["all", "solved", "solving", "revision"]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 9.5, fontWeight: 600,
                  padding: "3px 10px", borderRadius: 20,
                  border: "1px solid",
                  borderColor: filter === f ? accentColor : "#1C2842",
                  background: filter === f ? `${accentColor}14` : "transparent",
                  color: filter === f ? accentColor : "#5D8DC1",
                  cursor: "pointer",
                }}
              >
                {f === "all" ? "All" : f === "solved" ? "Solved" : f === "solving" ? "In Progress" : "Revise"}
              </button>
            ))}
            <button onClick={() => setShowAddModal(true)} style={s.addBtn}>
              <Plus size={11} /> Log Problem
            </button>
          </div>
        </div>

        {displayProblems.length === 0 ? (
          <div style={s.emptyState}>
            {topicProblems.length === 0
              ? `No problems logged for ${topic.label} yet. Hit "Log Problem" to start!`
              : "No problems match this filter."}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={s.table}>
              <thead>
                <tr>
                  {["Title", "Difficulty", "Status", "Confidence", "Date", ""].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayProblems.map((p, idx) => (
                  <tr key={p.id || idx} style={{ borderBottom: "1px solid #0D1525" }}>
                    <td style={s.tdTitle}>
                      {p.url ? (
                        <a href={p.url} target="_blank" rel="noreferrer" style={s.titleLink}>
                          {p.title} <ExternalLink size={10} />
                        </a>
                      ) : (
                        <span style={{ color: "#C7D2E0" }}>{p.title}</span>
                      )}
                    </td>
                    <td style={s.td}>
                      <span style={{
                        ...s.diffBadge,
                        background: DIFFICULTY_COLORS[p.difficulty] + "22",
                        color: DIFFICULTY_COLORS[p.difficulty],
                      }}>
                        {p.difficulty}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={{ color: p.status === "solved" ? "#4ADE80" : "#F2A93B", fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}>
                        {p.status === "solved" ? "✓ Solved" : "⋯ Solving"}
                      </span>
                    </td>
                    <td style={s.td}>
                      {p.status === "solved" && (
                        <span style={{ color: "#F2A93B", fontSize: 13, letterSpacing: 1 }}>
                          {"★".repeat(p.confidence || 3)}
                          <span style={{ color: "#2A3448" }}>{"★".repeat(5 - (p.confidence || 3))}</span>
                        </span>
                      )}
                    </td>
                    <td style={{ ...s.td, color: "#5D8DC1", fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, whiteSpace: "nowrap" }}>
                      {p.solve_date ? relativeDays(p.solve_date) : "—"}
                    </td>
                    <td style={s.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
                        <button
                          onClick={() => setEditingProblem(p)}
                          style={{ color: "#5D8DC1", background: "transparent", border: "none", cursor: "pointer", padding: "2px 4px", display: "flex", alignItems: "center" }}
                          title="Edit problem details"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => onDeleteProblem(p.id)}
                          style={{ color: "#3A4560", fontSize: 14, padding: "1px 5px", lineHeight: 1, background: "transparent", border: "none", cursor: "pointer" }}
                          title="Delete problem"
                        >
                          ×
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(showAddModal || editingProblem) && (
        <AddProblemModal
          defaultTopic={topic.id}
          editProblem={editingProblem}
          onClose={() => {
            setShowAddModal(false);
            setEditingProblem(null);
          }}
          onSave={async (probData) => {
            await handleSaveProblem(probData);
            setEditingProblem(null);
          }}
        />
      )}
    </div>
  );
}

const s = {
  backBtn: {
    display: "flex", alignItems: "center", gap: 8,
    color: "#5D8DC1", fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11.5, fontWeight: 600, marginBottom: 22, padding: "6px 0",
    cursor: "pointer",
  },
  topicHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 20, flexWrap: "wrap", gap: 12,
  },
  categoryLabel: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: 1.2,
    color: "#5D8DC1", marginBottom: 6, textTransform: "uppercase",
  },
  topicTitle: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 26, fontWeight: 700, margin: 0,
  },
  levelBadge: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 700,
    padding: "6px 16px", borderRadius: 20, flexShrink: 0,
  },
  statsRow: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 },
  statBox: {
    background: "rgba(14,22,38,0.6)", border: "1px solid #1C2842", borderRadius: 14,
    padding: "12px 18px", display: "flex", flexDirection: "column", gap: 4,
    minWidth: 70, alignItems: "center",
  },
  statVal: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 20, fontWeight: 700, color: "#E7EDF5",
  },
  statLbl: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 10.5, color: "#8493AA", textAlign: "center",
  },
  progressCard: {
    background: "rgba(14,22,38,0.5)", border: "1px solid #1C2842",
    borderRadius: 14, padding: "14px 18px", marginBottom: 20,
    display: "flex", flexDirection: "column", gap: 10,
  },
  progressHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  progressLabel: {
    display: "flex", alignItems: "center",
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#5D8DC1",
    letterSpacing: 0.5, textTransform: "uppercase",
  },
  progressFraction: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: "#8493AA",
  },
  progressTrack: { background: "#121A2B", borderRadius: 6, height: 8, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 6, transition: "width 0.5s ease" },
  section: { marginBottom: 22 },
  sectionLabel: {
    display: "flex", alignItems: "center",
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: 1.5,
    color: "#5D8DC1", marginBottom: 10, textTransform: "uppercase", fontWeight: 600,
  },
  patternRow: { display: "flex", flexWrap: "wrap", gap: 7 },
  patChip: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, fontWeight: 600,
    padding: "3px 11px", borderRadius: 20, border: "1px solid", whiteSpace: "nowrap",
  },
  revisionList: { display: "flex", flexDirection: "column", gap: 8 },
  revisionRow: {
    display: "flex", alignItems: "center", gap: 10,
    background: "rgba(242,169,59,0.04)", border: "1px solid rgba(242,169,59,0.15)",
    borderRadius: 10, padding: "8px 12px",
  },
  revTitle: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#C7D2E0",
    flex: 1, display: "flex", alignItems: "center", flexWrap: "wrap",
  },
  titleLink: {
    color: "#38D9C9", textDecoration: "none",
    display: "inline-flex", alignItems: "center", gap: 4,
  },
  revConf: { fontSize: 11, color: "#F2A93B", letterSpacing: 1.5, flexShrink: 0 },
  revDate: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#5D8DC1", flexShrink: 0,
  },
  companyRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  companyChip: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600,
    padding: "5px 14px", borderRadius: 20, border: "1px solid",
    display: "flex", alignItems: "center", gap: 4,
  },
  tableTopBar: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", gap: 12, marginBottom: 10, flexWrap: "wrap",
  },
  addBtn: {
    display: "flex", alignItems: "center", gap: 5,
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, fontWeight: 700,
    background: "#38D9C9", color: "#0A0F1C",
    padding: "5px 12px", borderRadius: 8,
    boxShadow: "0 2px 10px rgba(56,217,201,0.25)", cursor: "pointer",
  },
  emptyState: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#5D8DC1",
    fontStyle: "italic", padding: "28px 0", textAlign: "center",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: 1.2,
    color: "#3A4560", padding: "6px 12px",
    borderBottom: "1px solid #1C2842", textAlign: "left", textTransform: "uppercase",
    fontWeight: 600,
  },
  td: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13,
    padding: "10px 12px", color: "#8493AA", verticalAlign: "middle",
  },
  tdTitle: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13.5,
    padding: "10px 12px", color: "#E7EDF5", verticalAlign: "middle",
    maxWidth: 240,
  },
  diffBadge: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 700,
    padding: "2px 8px", borderRadius: 6,
  },
};
