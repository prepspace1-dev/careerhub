import React, { useState } from "react";
import { Plus, Zap, Trash2, Calendar, Search } from "lucide-react";
import { dateKey, niceDate, generateUUID } from "../utils";

const STAGE_COLORS = {
  Applied: "#5D8DC1",
  "Interview scheduled": "#F2A93B",
  Interviewed: "#38D9C9",
  Offer: "#4ADE80",
  Rejected: "#7C8B9A",
};

const STAGES = ["Applied", "Interview scheduled", "Interviewed", "Offer", "Rejected"];

export default function InterviewsTab({ active, interviews, onPersistInterview, onDeleteInterview }) {
  const [company, setCompany] = useState("");
  const [stage, setStage] = useState("Applied");
  const [notes, setNotes] = useState("");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStage, setFilterStage] = useState("All");

  const list = interviews || [];

  function addEntry() {
    if (!company.trim()) return;
    const newEntry = {
      id: generateUUID(),
      company: company.trim(),
      stage,
      notes: notes.trim(),
      date: dateKey(new Date())
    };

    const nextList = [newEntry, ...list];
    onPersistInterview(newEntry, nextList);
    setCompany("");
    setNotes("");
    setStage("Applied");
  }

  function cycleStage(id) {
    const nextList = list.map((e) => {
      if (e.id === id) {
        const nextIndex = (STAGES.indexOf(e.stage) + 1) % STAGES.length;
        return { ...e, stage: STAGES[nextIndex] };
      }
      return e;
    });

    const updatedItem = nextList.find((e) => e.id === id);
    onPersistInterview(updatedItem, nextList);
  }

  function deleteEntry(id, e) {
    e.stopPropagation(); // Avoid triggering cycleStage
    const nextList = list.filter((item) => item.id !== id);
    onDeleteInterview(id, nextList);
  }

  // Monthly stats
  const now = new Date();
  const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const callsThisMonth = list.filter(
    (e) => e.date.startsWith(thisMonthKey) && ["Interview scheduled", "Interviewed", "Offer"].includes(e.stage)
  ).length;
  
  const targetGoal = 2;
  const goalProgress = Math.min(100, (callsThisMonth / targetGoal) * 100);

  // Filters
  const filteredList = list.filter((item) => {
    const matchesSearch = item.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStage = filterStage === "All" || item.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div style={{ display: active ? "block" : "none" }} className="fade-in">
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrowRow}>
            <span style={styles.eyebrow}>INTERVIEW TRACKER</span>
          </div>
          <h1 style={styles.title}>Companies & calls</h1>
        </div>
      </div>

      <div style={styles.goalCard}>
        <div style={styles.goalBox}>
          <Zap size={15} color="#F2A93B" />
          <span style={{ color: "#E7EDF5", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 600 }}>
            {callsThisMonth} interview call{callsThisMonth === 1 ? "" : "s"} this month
          </span>
          <span style={{ color: "#5D8DC1", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, marginLeft: "auto" }}>
            goal: {targetGoal}
          </span>
        </div>
        <div style={styles.goalTrack}>
          <div style={{ ...styles.goalFill, width: `${goalProgress}%`, background: goalProgress >= 100 ? "#4ADE80" : "#F2A93B" }} />
        </div>
      </div>

      <div style={styles.editorBox}>
        <div style={styles.inputRow}>
          <input
            style={styles.input}
            placeholder="Company name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <select
            style={styles.select}
            value={stage}
            onChange={(e) => setStage(e.target.value)}
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <textarea
          style={styles.textarea}
          rows={2}
          placeholder="Notes (role, contact, next step)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button style={styles.saveBtn} onClick={addEntry}>
          <Plus size={14} /> Add Application
        </button>
      </div>

      <div style={styles.divider} />

      <div style={styles.filterSection}>
        <div style={styles.searchBarRow}>
          <div style={styles.searchWrapper}>
            <Search size={14} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search companies..."
              style={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            style={styles.stageFilterDropdown}
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
          >
            <option value="All">All Stages</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.sectionLabel}>ALL ENTRIES ({filteredList.length})</div>
      {filteredList.length === 0 ? (
        <div style={styles.emptyState}>
          {searchQuery || filterStage !== "All"
            ? "No applications match your filters."
            : "No companies logged yet — add your first application above."}
        </div>
      ) : (
        <div style={styles.historyList}>
          {filteredList.map((e) => (
            <div
              key={e.id}
              onClick={() => cycleStage(e.id)}
              style={styles.historyItem}
            >
              <div style={styles.itemHeader}>
                <span style={styles.companyName}>{e.company}</span>
                <div style={styles.badgeRow}>
                  <span style={{ ...styles.todayTagSmall, background: STAGE_COLORS[e.stage] }}>
                    {e.stage}
                  </span>
                  <button 
                    onClick={(evt) => deleteEntry(e.id, evt)} 
                    style={styles.deleteBtn}
                    title="Delete Entry"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              {e.notes && <div style={styles.historyText}>{e.notes}</div>}
              <div style={styles.itemFooter}>
                <Calendar size={10} style={{ marginRight: 4 }} />
                <span>{niceDate(e.date)} · Tap card to update stage</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  loading: {
    minHeight: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#8493AA",
    fontFamily: "'IBM Plex Mono', monospace"
  },
  header: {
    marginBottom: 10
  },
  eyebrowRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 6
  },
  eyebrow: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    letterSpacing: 2,
    color: "#5D8DC1"
  },
  syncIndicator: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 9,
    color: "#38D9C9",
    background: "rgba(56, 217, 201, 0.1)",
    padding: "2px 6px",
    borderRadius: 4
  },
  title: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 19,
    fontWeight: 600,
    color: "#E7EDF5",
    margin: "0 0 6px"
  },
  goalCard: {
    background: "#0E1626",
    border: "1px solid #2A3448",
    borderRadius: 14,
    padding: "14px 16px",
    marginBottom: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8
  },
  goalBox: {
    display: "flex",
    alignItems: "center",
    gap: 8
  },
  goalTrack: {
    height: 4,
    background: "#121A2B",
    borderRadius: 2,
    overflow: "hidden"
  },
  goalFill: {
    height: "100%",
    transition: "width 0.3s ease"
  },
  editorBox: {
    background: "#0E1626",
    border: "1px solid #1C2842",
    borderRadius: 14,
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: 10
  },
  inputRow: {
    display: "flex",
    gap: 10
  },
  input: {
    flex: 2,
    background: "#121A2B",
    border: "1px solid #1C2842",
    borderRadius: 10,
    color: "#E7EDF5",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 13.5,
    padding: "10px 12px",
    outline: "none",
    transition: "border-color 0.2s ease",
    ":focus": {
      borderColor: "#38D9C9"
    }
  },
  select: {
    flex: 1,
    background: "#121A2B",
    border: "1px solid #1C2842",
    borderRadius: 10,
    color: "#E7EDF5",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 13.5,
    padding: "10px 12px",
    outline: "none"
  },
  textarea: {
    width: "100%",
    background: "#121A2B",
    border: "1px solid #1C2842",
    borderRadius: 10,
    color: "#E7EDF5",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 13.5,
    lineHeight: 1.5,
    padding: "10px 12px",
    resize: "vertical",
    outline: "none",
    transition: "border-color 0.2s ease",
    ":focus": {
      borderColor: "#38D9C9"
    }
  },
  saveBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    background: "#F2A93B",
    color: "#0A0F1C",
    border: "none",
    borderRadius: 8,
    padding: "10px 16px",
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 700,
    fontSize: 12,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(242, 169, 59, 0.15)"
  },
  divider: {
    height: 1,
    background: "#1C2842",
    margin: "18px 0 14px"
  },
  filterSection: {
    marginBottom: 14
  },
  searchBarRow: {
    display: "flex",
    gap: 8,
    alignItems: "center"
  },
  searchWrapper: {
    position: "relative",
    flex: 1
  },
  searchIcon: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#5D8DC1"
  },
  searchInput: {
    width: "100%",
    background: "#0E1626",
    border: "1px solid #1C2842",
    borderRadius: 8,
    color: "#E7EDF5",
    fontSize: 13,
    padding: "8px 10px 8px 32px",
    outline: "none",
    fontFamily: "'IBM Plex Sans', sans-serif"
  },
  stageFilterDropdown: {
    background: "#0E1626",
    border: "1px solid #1C2842",
    borderRadius: 8,
    color: "#E7EDF5",
    fontSize: 13,
    padding: "8px 10px",
    outline: "none",
    fontFamily: "'IBM Plex Sans', sans-serif"
  },
  sectionLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10.5,
    letterSpacing: 1.5,
    color: "#5D8DC1",
    marginBottom: 10
  },
  emptyState: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 12.5,
    color: "#5D8DC1",
    fontStyle: "italic",
    textAlign: "center",
    padding: "16px 0"
  },
  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: 10
  },
  historyItem: {
    textAlign: "left",
    background: "#0E1626",
    border: "1px solid #1C2842",
    borderRadius: 10,
    padding: "12px 14px",
    cursor: "pointer",
    transition: "all 0.15s ease",
    ":hover": {
      borderColor: "#38D9C9"
    }
  },
  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6
  },
  companyName: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 14.5,
    fontWeight: 600,
    color: "#E7EDF5"
  },
  badgeRow: {
    display: "flex",
    alignItems: "center",
    gap: 8
  },
  todayTagSmall: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 8.5,
    color: "#0A0F1C",
    borderRadius: 4,
    padding: "2px 6px",
    fontWeight: 600
  },
  deleteBtn: {
    color: "#8493AA",
    padding: "2px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    ":hover": {
      color: "#EF4444",
      background: "rgba(239, 68, 68, 0.1)"
    }
  },
  historyText: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 13,
    color: "#C7D2E0",
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
    background: "#121A2B",
    padding: "8px 10px",
    borderRadius: 6,
    margin: "6px 0"
  },
  itemFooter: {
    display: "flex",
    alignItems: "center",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 9.5,
    color: "#5D8DC1",
    marginTop: 4
  }
};
