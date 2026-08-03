import React, { useState } from "react";
import { Plus, ExternalLink, Trash2, Filter } from "lucide-react";
import { DIFFICULTY_COLORS, TOPIC_LABEL, TOPIC_COLOR } from "../data/topics";
import { relativeDays } from "../utils";
import AddProblemModal from "./AddProblemModal";

/**
 * ProblemVault — Standalone database of all logged DSA problems
 *
 * Simple, uncluttered, no search bar (as requested).
 * Filter by difficulty (All, Easy, Medium, Hard) or status (Solved, Solving).
 */
export default function ProblemVault({
  active,
  problems = [],
  onPersistProblem,
  onDeleteProblem,
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState("all");

  if (!active) return null;

  const allProblems = problems || [];
  const solvedProblems = allProblems.filter((p) => p.status === "solved");
  const solvingProblems = allProblems.filter((p) => p.status === "solving");

  const easyCount = solvedProblems.filter((p) => p.difficulty === "Easy").length;
  const mediumCount = solvedProblems.filter((p) => p.difficulty === "Medium").length;
  const hardCount = solvedProblems.filter((p) => p.difficulty === "Hard").length;

  const avgConfidence =
    solvedProblems.length > 0
      ? (
          solvedProblems.reduce((sum, p) => sum + (p.confidence || 3), 0) /
          solvedProblems.length
        ).toFixed(1)
      : null;

  // Filtered problem list
  const filteredProblems = (() => {
    let list = allProblems;
    if (filter === "easy") list = allProblems.filter((p) => p.difficulty === "Easy");
    else if (filter === "medium") list = allProblems.filter((p) => p.difficulty === "Medium");
    else if (filter === "hard") list = allProblems.filter((p) => p.difficulty === "Hard");
    else if (filter === "solved") list = solvedProblems;
    else if (filter === "solving") list = solvingProblems;

    return [...list].sort(
      (a, b) =>
        new Date(b.solve_date || b.created_at || 0) -
        new Date(a.solve_date || a.created_at || 0)
    );
  })();

  async function handleSaveProblem(problem) {
    await onPersistProblem(problem);
    setShowAddModal(false);
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={s.pageHeader}>
        <div>
          <span style={s.eyebrow}>PROBLEM DATABASE</span>
          <h1 style={s.pageTitle}>Problem Vault</h1>
        </div>

        <button onClick={() => setShowAddModal(true)} style={s.logBtn}>
          <Plus size={13} /> Log Problem
        </button>
      </div>

      {/* Summary stats bar */}
      <div style={s.statsRow}>
        <div style={s.statBox}>
          <span style={{ ...s.statVal, color: "#38D9C9" }}>{solvedProblems.length}</span>
          <span style={s.statLbl}>Total Solved</span>
        </div>
        <div style={s.statBox}>
          <span style={{ ...s.statVal, color: DIFFICULTY_COLORS.Easy }}>{easyCount}</span>
          <span style={s.statLbl}>Easy</span>
        </div>
        <div style={s.statBox}>
          <span style={{ ...s.statVal, color: DIFFICULTY_COLORS.Medium }}>{mediumCount}</span>
          <span style={s.statLbl}>Medium</span>
        </div>
        <div style={s.statBox}>
          <span style={{ ...s.statVal, color: DIFFICULTY_COLORS.Hard }}>{hardCount}</span>
          <span style={s.statLbl}>Hard</span>
        </div>
        {avgConfidence !== null && (
          <div style={s.statBox}>
            <span style={{ ...s.statVal, color: "#F2A93B" }}>{avgConfidence}★</span>
            <span style={s.statLbl}>Avg Confidence</span>
          </div>
        )}
      </div>

      {/* Filter Pills */}
      <div style={s.filterRow}>
        <div style={s.filterLabel}>
          <Filter size={11} /> Filter:
        </div>

        {[
          { id: "all", label: `All (${allProblems.length})` },
          { id: "solved", label: `✓ Solved (${solvedProblems.length})` },
          { id: "solving", label: `⋯ Solving (${solvingProblems.length})` },
          { id: "easy", label: `Easy (${easyCount})` },
          { id: "medium", label: `Medium (${mediumCount})` },
          { id: "hard", label: `Hard (${hardCount})` },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              ...s.filterPill,
              background: filter === f.id ? "rgba(56,217,201,0.15)" : "transparent",
              color: filter === f.id ? "#38D9C9" : "#5D8DC1",
              borderColor: filter === f.id ? "#38D9C9" : "#1C2842",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Main Problems Table */}
      <div style={s.tableContainer}>
        {filteredProblems.length === 0 ? (
          <div style={s.emptyState}>
            {allProblems.length === 0
              ? 'No problems logged yet. Click "+ Log Problem" to add your first LeetCode problem!'
              : "No problems match this filter."}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Problem Title</th>
                  <th style={s.th}>Topic</th>
                  <th style={s.th}>Difficulty</th>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Confidence</th>
                  <th style={s.th}>Date</th>
                  <th style={s.th}></th>
                </tr>
              </thead>
              <tbody>
                {filteredProblems.map((p) => {
                  const topicName = TOPIC_LABEL[p.topic] || p.topic;
                  const topicColor = TOPIC_COLOR[p.topic] || "#38D9C9";

                  return (
                    <tr key={p.id} style={s.tr}>
                      {/* Title + Link */}
                      <td style={s.tdTitle}>
                        {p.url ? (
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noreferrer"
                            style={s.titleLink}
                          >
                            {p.title}
                            <ExternalLink size={11} style={{ marginLeft: 4, flexShrink: 0 }} />
                          </a>
                        ) : (
                          <span style={{ color: "#E7EDF5" }}>{p.title}</span>
                        )}
                      </td>

                      {/* Topic Chip */}
                      <td style={s.td}>
                        <span
                          style={{
                            ...s.topicChip,
                            background: `${topicColor}15`,
                            color: topicColor,
                            borderColor: `${topicColor}44`,
                          }}
                        >
                          {topicName}
                        </span>
                      </td>

                      {/* Difficulty Badge */}
                      <td style={s.td}>
                        <span
                          style={{
                            ...s.diffBadge,
                            background: `${DIFFICULTY_COLORS[p.difficulty]}20`,
                            color: DIFFICULTY_COLORS[p.difficulty],
                          }}
                        >
                          {p.difficulty}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={s.td}>
                        <span
                          style={{
                            ...s.statusTag,
                            color: p.status === "solved" ? "#4ADE80" : "#F2A93B",
                          }}
                        >
                          {p.status === "solved" ? "✓ Solved" : "⋯ Solving"}
                        </span>
                      </td>

                      {/* Confidence */}
                      <td style={s.td}>
                        {p.status === "solved" ? (
                          <span style={s.starRating}>
                            {"★".repeat(p.confidence || 3)}
                            <span style={{ color: "#2A3448" }}>
                              {"★".repeat(5 - (p.confidence || 3))}
                            </span>
                          </span>
                        ) : (
                          <span style={{ color: "#3A4560" }}>—</span>
                        )}
                      </td>

                      {/* Date */}
                      <td style={s.tdDate}>
                        {p.solve_date ? relativeDays(p.solve_date) : "—"}
                      </td>

                      {/* Actions */}
                      <td style={s.tdActions}>
                        <button
                          onClick={() => onDeleteProblem(p.id)}
                          style={s.deleteBtn}
                          title="Delete problem"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddProblemModal
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveProblem}
        />
      )}
    </div>
  );
}

const s = {
  pageHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    marginBottom: 16, flexWrap: "wrap", gap: 12,
  },
  eyebrow: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10.5, letterSpacing: 2, color: "#38D9C9",
    display: "block", marginBottom: 4, fontWeight: 600,
  },
  pageTitle: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 22, fontWeight: 700, color: "#E7EDF5", margin: 0,
  },
  logBtn: {
    display: "flex", alignItems: "center", gap: 6,
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, fontWeight: 700,
    background: "linear-gradient(135deg, #38D9C9 0%, #5D8DC1 100%)",
    color: "#0A0F1C", padding: "9px 16px", borderRadius: 10,
    boxShadow: "0 2px 14px rgba(56,217,201,0.25)", cursor: "pointer", border: "none",
  },
  statsRow: {
    display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18,
  },
  statBox: {
    background: "rgba(14,22,38,0.6)", border: "1px solid #1C2842",
    borderRadius: 14, padding: "12px 18px", display: "flex",
    flexDirection: "column", gap: 4, alignItems: "center", minWidth: 90,
  },
  statVal: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 20, fontWeight: 700,
  },
  statLbl: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 10.5, color: "#8493AA",
  },
  filterRow: {
    display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
    marginBottom: 16, background: "rgba(18,26,43,0.4)", padding: "10px 14px",
    borderRadius: 12, border: "1px solid #1C2842",
  },
  filterLabel: {
    display: "flex", alignItems: "center", gap: 5,
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: "#5D8DC1",
    fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5,
    marginRight: 4,
  },
  filterPill: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, fontWeight: 600,
    padding: "4px 12px", borderRadius: 16, border: "1px solid",
    cursor: "pointer", transition: "all 0.15s ease", whiteSpace: "nowrap",
  },
  tableContainer: {
    background: "rgba(14,22,38,0.55)", border: "1px solid #1C2842",
    borderRadius: 16, overflow: "hidden",
  },
  emptyState: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#5D8DC1",
    fontStyle: "italic", padding: "36px 20px", textAlign: "center",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: 1.2,
    color: "#5D8DC1", padding: "10px 14px", borderBottom: "1px solid #1C2842",
    textAlign: "left", textTransform: "uppercase", fontWeight: 600,
    background: "rgba(18,26,43,0.4)",
  },
  tr: { borderBottom: "1px solid #0D1526", transition: "background 0.12s ease" },
  tdTitle: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13.5,
    padding: "12px 14px", color: "#E7EDF5", verticalAlign: "middle",
  },
  titleLink: {
    color: "#38D9C9", textDecoration: "none",
    display: "inline-flex", alignItems: "center", fontWeight: 600,
  },
  td: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13,
    padding: "12px 14px", color: "#8493AA", verticalAlign: "middle",
  },
  tdDate: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5,
    padding: "12px 14px", color: "#5D8DC1", verticalAlign: "middle", whiteSpace: "nowrap",
  },
  tdActions: { padding: "12px 14px", textAlign: "right", verticalAlign: "middle" },
  topicChip: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 600,
    padding: "2px 8px", borderRadius: 8, border: "1px solid", whiteSpace: "nowrap",
  },
  diffBadge: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 700,
    padding: "2px 8px", borderRadius: 6,
  },
  statusTag: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600,
  },
  starRating: {
    color: "#F2A93B", fontSize: 12, letterSpacing: 1,
  },
  deleteBtn: {
    color: "#3A4560", padding: 5, borderRadius: 6, background: "none",
    border: "none", cursor: "pointer", transition: "all 0.15s ease",
    ":hover": { color: "#EF4444" },
  },
};
