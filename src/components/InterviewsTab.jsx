import React, { useState } from "react";
import { Plus, Trash2, Search, ExternalLink } from "lucide-react";
import { dateKey, niceDate, generateUUID } from "../utils";

const STAGE_COLORS = {
  Applied: "#5D8DC1",
  "Screening / OA": "#A78BFA",
  "Interview scheduled": "#F2A93B",
  Interviewed: "#38D9C9",
  Offer: "#4ADE80",
  Rejected: "#EF4444",
};

const STAGES = ["Applied", "Screening / OA", "Interview scheduled", "Interviewed", "Offer", "Rejected"];

const APPLICATION_TYPES = [
  { id: "Tailored", label: "📝 Tailored Application", bonus: "High Quality" },
  { id: "Referral", label: "🎯 Referral", bonus: "Highest Priority" },
  { id: "Outreach", label: "✉️ Recruiter Outreach", bonus: "High Response" },
  { id: "Cold Apply", label: "⚡ Cold Apply", bonus: "Standard" },
];

// Helper to encode/decode structured info in notes
function parseNotes(rawNotes) {
  if (!rawNotes) return { role: "", url: "", quality: "Tailored", text: "" };
  try {
    if (rawNotes.startsWith("{") && rawNotes.endsWith("}")) {
      const parsed = JSON.parse(rawNotes);
      return {
        role: parsed.role || "",
        url: parsed.url || "",
        quality: parsed.quality || "Tailored",
        text: parsed.text || "",
      };
    }
  } catch {
    // fallback plain text
  }
  return { role: "", url: "", quality: "Tailored", text: rawNotes };
}

function serializeNotes(data) {
  return JSON.stringify({
    role: data.role || "",
    url: data.url || "",
    quality: data.quality || "Tailored",
    text: data.text || "",
  });
}

export default function InterviewsTab({
  active,
  interviews,
  onPersistInterview,
  onDeleteInterview,
}) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState("Applied");
  const [quality, setQuality] = useState("Tailored");
  const [notesText, setNotesText] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStage, setFilterStage] = useState("All");
  const [viewMode, setViewMode] = useState("board"); // 'board' or 'list'
  const [showAddForm, setShowAddForm] = useState(false);

  const list = interviews || [];

  function handleAddApplication() {
    if (!company.trim()) return;

    const notesPayload = serializeNotes({
      role: role.trim() || "SDE Engineer",
      url: url.trim(),
      quality,
      text: notesText.trim(),
    });

    const newEntry = {
      id: generateUUID(),
      company: company.trim(),
      stage,
      notes: notesPayload,
      date: dateKey(new Date()),
    };

    const nextList = [newEntry, ...list];
    onPersistInterview(newEntry, nextList);

    // Reset form
    setCompany("");
    setRole("");
    setUrl("");
    setNotesText("");
    setStage("Applied");
    setQuality("Tailored");
    setShowAddForm(false);
  }

  function cycleStage(id) {
    const nextList = list.map((e) => {
      if (e.id === id) {
        // Map current stage to index or fallback
        const normalizedStage = STAGES.includes(e.stage) ? e.stage : "Applied";
        const nextIndex = (STAGES.indexOf(normalizedStage) + 1) % STAGES.length;
        return { ...e, stage: STAGES[nextIndex] };
      }
      return e;
    });

    const updatedItem = nextList.find((e) => e.id === id);
    onPersistInterview(updatedItem, nextList);
  }

  function deleteEntry(id, e) {
    if (e) e.stopPropagation();
    const nextList = list.filter((item) => item.id !== id);
    onDeleteInterview(id, nextList);
  }

  // ── Metrics Calculation ──────────────────────────────────────────────────
  const totalApps = list.length;
  const highQualityApps = list.filter((item) => {
    const p = parseNotes(item.notes);
    return p.quality === "Referral" || p.quality === "Tailored" || p.quality === "Outreach";
  }).length;

  const qualityRatio = totalApps > 0 ? Math.round((highQualityApps / totalApps) * 100) : 0;

  const interviewsScheduled = list.filter(
    (e) => e.stage === "Interview scheduled" || e.stage === "Interviewed"
  ).length;

  const offersCount = list.filter((e) => e.stage === "Offer").length;

  // Filtered List
  const filteredList = list.filter((item) => {
    const parsed = parseNotes(item.notes);
    const matchesSearch =
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parsed.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parsed.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = filterStage === "All" || item.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div style={{ display: active ? "block" : "none" }} className="fade-in">
      {/* Page Header */}
      <div style={s.pageHeader}>
        <div>
          <span style={s.eyebrow}>CAREER PIPELINE</span>
          <h1 style={s.pageTitle}>Job Applications &amp; Interviews</h1>
        </div>

        <button onClick={() => setShowAddForm(!showAddForm)} style={s.addBtn}>
          <Plus size={13} /> {showAddForm ? "Cancel" : "Add Application"}
        </button>
      </div>

      {/* Metrics Banner */}
      <div style={s.metricsRow}>
        <div style={s.metricCard}>
          <span style={{ ...s.metricVal, color: "#38D9C9" }}>{totalApps}</span>
          <span style={s.metricLbl}>Total Applications</span>
        </div>
        <div style={s.metricCard}>
          <span style={{ ...s.metricVal, color: "#4ADE80" }}>{qualityRatio}%</span>
          <span style={s.metricLbl}>High Quality Apps</span>
        </div>
        <div style={s.metricCard}>
          <span style={{ ...s.metricVal, color: "#F2A93B" }}>{interviewsScheduled}</span>
          <span style={s.metricLbl}>Interviews Active</span>
        </div>
        <div style={s.metricCard}>
          <span style={{ ...s.metricVal, color: "#A78BFA" }}>{offersCount}</span>
          <span style={s.metricLbl}>Offers Received</span>
        </div>
      </div>

      {/* Add Application Form (Collapsible / Toggleable) */}
      {showAddForm && (
        <div style={s.formCard} className="fade-in">
          <div style={s.formTitle}>Track New Application</div>

          <div style={s.formGrid}>
            <input
              style={s.input}
              placeholder="Company Name (e.g. Google, Stripe, Razorpay)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <input
              style={s.input}
              placeholder="Role Title (e.g. SDE 1, Backend Engineer)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div style={s.formGrid}>
            <input
              style={s.input}
              placeholder="Job Posting URL / Link (e.g. https://...)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <select
              style={s.select}
              value={stage}
              onChange={(e) => setStage(e.target.value)}
            >
              {STAGES.map((stg) => (
                <option key={stg} value={stg}>
                  {stg}
                </option>
              ))}
            </select>
          </div>

          {/* Application Quality Type */}
          <div style={s.qualityRow}>
            <span style={s.qualityLabel}>Application Type:</span>
            {APPLICATION_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setQuality(t.id)}
                style={{
                  ...s.qualityBtn,
                  background: quality === t.id ? "rgba(56,217,201,0.15)" : "transparent",
                  color: quality === t.id ? "#38D9C9" : "#8493AA",
                  borderColor: quality === t.id ? "#38D9C9" : "#1C2842",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <textarea
            style={s.textarea}
            rows={2}
            placeholder="Notes & Outcomes (e.g. Asked LC 215, referred by Alex, HR recruiter screen scheduled)"
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
          />

          <div style={s.formActions}>
            <button onClick={handleAddApplication} style={s.saveBtn}>
              <Plus size={13} /> Save Application
            </button>
          </div>
        </div>
      )}

      {/* Filter and View Switcher */}
      <div style={s.filterRow}>
        <div style={s.searchBox}>
          <Search size={14} color="#5D8DC1" />
          <input
            style={s.searchInput}
            placeholder="Search company, role, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          style={s.stageSelect}
          value={filterStage}
          onChange={(e) => setFilterStage(e.target.value)}
        >
          <option value="All">All Pipeline Stages</option>
          {STAGES.map((stg) => (
            <option key={stg} value={stg}>
              {stg}
            </option>
          ))}
        </select>

        {/* Board / List view switcher */}
        <div style={s.viewSwitch}>
          <button
            onClick={() => setViewMode("board")}
            style={{
              ...s.switchBtn,
              background: viewMode === "board" ? "#38D9C9" : "transparent",
              color: viewMode === "board" ? "#0A0F1C" : "#8493AA",
            }}
          >
            Pipeline Board
          </button>
          <button
            onClick={() => setViewMode("list")}
            style={{
              ...s.switchBtn,
              background: viewMode === "list" ? "#38D9C9" : "transparent",
              color: viewMode === "list" ? "#0A0F1C" : "#8493AA",
            }}
          >
            Ledger View
          </button>
        </div>
      </div>

      {/* ── KANBAN BOARD VIEW ────────────────────────────────────────────────── */}
      {viewMode === "board" ? (
        <div className="kanban-board" style={s.boardGrid}>
          {STAGES.map((colStage) => {
            const colEntries = filteredList.filter((item) => item.stage === colStage);
            const colColor = STAGE_COLORS[colStage] || "#5D8DC1";

            return (
              <div key={colStage} style={s.boardCol}>
                <div style={s.boardColHeader}>
                  <span style={{ ...s.colTitle, color: colColor }}>{colStage}</span>
                  <span style={s.colCount}>{colEntries.length}</span>
                </div>

                <div style={s.cardStack}>
                  {colEntries.length === 0 ? (
                    <div style={s.emptyCol}>Empty stage</div>
                  ) : (
                    colEntries.map((item) => {
                      const p = parseNotes(item.notes);
                      const typeLabel =
                        APPLICATION_TYPES.find((t) => t.id === p.quality)?.label || p.quality;

                      return (
                        <div
                          key={item.id}
                          onClick={() => cycleStage(item.id)}
                          style={s.pipelineCard}
                          title="Click card to advance pipeline stage"
                        >
                          <div style={s.cardHeader}>
                            <span style={s.cardCompany}>{item.company}</span>
                            <button
                              onClick={(e) => deleteEntry(item.id, e)}
                              style={s.delBtn}
                              title="Delete application"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          {p.role && <div style={s.cardRole}>{p.role}</div>}

                          {p.url && (
                            <a
                              href={p.url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              style={s.cardUrl}
                            >
                              <ExternalLink size={10} style={{ marginRight: 3 }} /> View Job Link
                            </a>
                          )}

                          {p.text && <div style={s.cardText}>{p.text}</div>}

                          <div style={s.cardFooter}>
                            <span style={s.typeTag}>{typeLabel}</span>
                            <span style={s.cardDate}>{niceDate(item.date)}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── TABLE / LEDGER VIEW ───────────────────────────────────────────── */
        <div style={s.tableCard}>
          {filteredList.length === 0 ? (
            <div style={s.emptyState}>No applications match your criteria.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Company &amp; Role</th>
                    <th style={s.th}>Link</th>
                    <th style={s.th}>Type</th>
                    <th style={s.th}>Stage</th>
                    <th style={s.th}>Notes &amp; Outcome</th>
                    <th style={s.th}>Applied Date</th>
                    <th style={s.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((item) => {
                    const p = parseNotes(item.notes);
                    const colColor = STAGE_COLORS[item.stage] || "#5D8DC1";
                    const typeLabel =
                      APPLICATION_TYPES.find((t) => t.id === p.quality)?.label || p.quality;

                    return (
                      <tr key={item.id} style={s.tr}>
                        <td style={s.tdCompany}>
                          <div style={s.compTitle}>{item.company}</div>
                          <div style={s.compRole}>{p.role || "Software Engineer"}</div>
                        </td>

                        <td style={s.td}>
                          {p.url ? (
                            <a
                              href={p.url}
                              target="_blank"
                              rel="noreferrer"
                              style={s.linkBtn}
                            >
                              Link <ExternalLink size={10} />
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>

                        <td style={s.td}>
                          <span style={s.typeChip}>{typeLabel}</span>
                        </td>

                        <td style={s.td}>
                          <button
                            onClick={() => cycleStage(item.id)}
                            style={{
                              ...s.stagePill,
                              background: `${colColor}18`,
                              color: colColor,
                              borderColor: `${colColor}44`,
                            }}
                            title="Click to cycle stage"
                          >
                            {item.stage} ↺
                          </button>
                        </td>

                        <td style={s.tdNotes}>
                          {p.text ? p.text : <span style={{ color: "#3A4560" }}>—</span>}
                        </td>

                        <td style={s.tdDate}>{niceDate(item.date)}</td>

                        <td style={s.tdActions}>
                          <button
                            onClick={(e) => deleteEntry(item.id, e)}
                            style={s.delBtn}
                            title="Delete entry"
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
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: 2,
    color: "#38D9C9", display: "block", marginBottom: 4, fontWeight: 600,
  },
  pageTitle: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, fontWeight: 700,
    color: "#E7EDF5", margin: 0,
  },
  addBtn: {
    display: "flex", alignItems: "center", gap: 6,
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, fontWeight: 700,
    background: "linear-gradient(135deg, #38D9C9 0%, #5D8DC1 100%)",
    color: "#0A0F1C", padding: "9px 16px", borderRadius: 10,
    boxShadow: "0 2px 14px rgba(56,217,201,0.25)", cursor: "pointer", border: "none",
  },
  metricsRow: {
    display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18,
  },
  metricCard: {
    background: "rgba(14,22,38,0.6)", border: "1px solid #1C2842",
    borderRadius: 14, padding: "12px 18px", display: "flex",
    flexDirection: "column", gap: 4, alignItems: "center", minWidth: 110, flex: 1,
  },
  metricVal: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 20, fontWeight: 700,
  },
  metricLbl: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 10.5, color: "#8493AA",
    textAlign: "center",
  },
  formCard: {
    background: "rgba(14,22,38,0.65)", border: "1px solid #1C2842",
    borderRadius: 16, padding: "18px 20px", marginBottom: 20,
    display: "flex", flexDirection: "column", gap: 12,
  },
  formTitle: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 700,
    color: "#E7EDF5", marginBottom: 4,
  },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  input: {
    background: "#0E1626", border: "1px solid #1C2842", borderRadius: 10,
    color: "#E7EDF5", fontSize: 13, fontFamily: "'IBM Plex Sans', sans-serif",
    padding: "9px 12px", outline: "none", width: "100%",
  },
  select: {
    background: "#0E1626", border: "1px solid #1C2842", borderRadius: 10,
    color: "#E7EDF5", fontSize: 13, fontFamily: "'IBM Plex Mono', monospace",
    padding: "9px 12px", outline: "none", width: "100%", cursor: "pointer",
  },
  qualityRow: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  qualityLabel: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#5D8DC1",
  },
  qualityBtn: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5,
    padding: "4px 10px", borderRadius: 14, border: "1px solid",
    cursor: "pointer", transition: "all 0.15s ease",
  },
  textarea: {
    background: "#0E1626", border: "1px solid #1C2842", borderRadius: 10,
    color: "#E7EDF5", fontSize: 13, fontFamily: "'IBM Plex Sans', sans-serif",
    padding: "10px 12px", outline: "none", resize: "vertical", width: "100%",
  },
  formActions: { display: "flex", justifyContent: "flex-end" },
  saveBtn: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, fontWeight: 700,
    background: "#38D9C9", color: "#0A0F1C", padding: "8px 16px",
    borderRadius: 8, cursor: "pointer", border: "none",
  },
  filterRow: {
    display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap",
    marginBottom: 18, background: "rgba(18,26,43,0.4)", padding: "10px 14px",
    borderRadius: 14, border: "1px solid #1C2842",
  },
  searchBox: {
    display: "flex", alignItems: "center", gap: 8, background: "#0E1626",
    border: "1px solid #1C2842", borderRadius: 10, padding: "6px 12px", flex: 1,
    minWidth: 200,
  },
  searchInput: {
    background: "transparent", border: "none", color: "#E7EDF5",
    fontSize: 12.5, fontFamily: "'IBM Plex Sans', sans-serif", outline: "none",
    width: "100%",
  },
  stageSelect: {
    background: "#0E1626", border: "1px solid #1C2842", borderRadius: 10,
    color: "#5D8DC1", fontSize: 11.5, fontFamily: "'IBM Plex Mono', monospace",
    padding: "7px 12px", outline: "none", cursor: "pointer",
  },
  viewSwitch: {
    display: "flex", background: "#0E1626", border: "1px solid #1C2842",
    borderRadius: 10, padding: 2,
  },
  switchBtn: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, fontWeight: 600,
    padding: "5px 12px", borderRadius: 8, border: "none", cursor: "pointer",
    transition: "all 0.15s ease",
  },
  boardGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14, alignItems: "flex-start",
  },
  boardCol: {
    background: "rgba(14,22,38,0.55)", border: "1px solid #1C2842",
    borderRadius: 14, padding: "12px", display: "flex", flexDirection: "column", gap: 10,
  },
  boardColHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    paddingBottom: 8, borderBottom: "1px solid #121A2B",
  },
  colTitle: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, fontWeight: 700,
  },
  colCount: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#8493AA",
    background: "#121A2B", padding: "2px 7px", borderRadius: 10,
  },
  cardStack: { display: "flex", flexDirection: "column", gap: 10 },
  emptyCol: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: "#3A4560",
    fontStyle: "italic", textAlign: "center", padding: "16px 0",
  },
  pipelineCard: {
    background: "#0E1626", border: "1px solid #1C2842", borderRadius: 12,
    padding: "12px", display: "flex", flexDirection: "column", gap: 6,
    cursor: "pointer", transition: "border-color 0.15s ease",
  },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardCompany: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 700, color: "#E7EDF5",
  },
  delBtn: {
    background: "none", border: "none", color: "#3A4560", cursor: "pointer", padding: 2,
  },
  cardRole: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, fontWeight: 500, color: "#38D9C9",
  },
  cardUrl: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#5D8DC1",
    textDecoration: "none", display: "inline-flex", alignItems: "center",
  },
  cardText: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#8493AA",
    lineHeight: 1.35,
  },
  cardFooter: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    paddingTop: 6, borderTop: "1px solid #121A2B", marginTop: 4,
  },
  typeTag: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, color: "#A78BFA",
  },
  cardDate: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, color: "#5D8DC1",
  },
  tableCard: {
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
  tr: { borderBottom: "1px solid #0D1526" },
  tdCompany: {
    fontFamily: "'IBM Plex Sans', sans-serif", padding: "12px 14px", verticalAlign: "middle",
  },
  compTitle: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 13.5, fontWeight: 700, color: "#E7EDF5",
  },
  compRole: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#38D9C9", marginTop: 2,
  },
  td: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, padding: "12px 14px",
    color: "#8493AA", verticalAlign: "middle",
  },
  tdNotes: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, padding: "12px 14px",
    color: "#8493AA", verticalAlign: "middle", maxWidth: 220,
  },
  tdDate: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: "#5D8DC1",
    padding: "12px 14px", verticalAlign: "middle", whiteSpace: "nowrap",
  },
  tdActions: { padding: "12px 14px", textAlign: "right", verticalAlign: "middle" },
  linkBtn: {
    color: "#38D9C9", textDecoration: "none", fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10.5, display: "inline-flex", alignItems: "center", gap: 3,
  },
  typeChip: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#A78BFA",
    background: "rgba(167,139,250,0.1)", padding: "2px 8px", borderRadius: 8,
  },
  stagePill: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, fontWeight: 600,
    padding: "3px 10px", borderRadius: 12, border: "1px solid", cursor: "pointer",
  },
};
