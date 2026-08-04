import React, { useState, useEffect, useMemo } from "react";
import { Check, Zap, Plus, Minus, RotateCcw, Calendar, RefreshCw, Sparkles, CheckCircle2, Save } from "lucide-react";
import { dateKey, tasksFor, dayComplete } from "../utils";

const DSA_TARGET = 3;
const APPS_TARGET = 3;

const NOTE_PLACEHOLDERS = {
  dsa: "e.g. Reversed a linked list, Two Sum (explained approach out loud)",
  apps: "e.g. Google (SDE 1), Stripe (Backend), Razorpay",
  learn: "e.g. SQL Indexing & B-Trees, Java Multithreading",
  review: "e.g. Re-solved LRU Cache cold without hints",
  project: "e.g. Feature shipped or API endpoint built",
  recap: "e.g. Concepts explained cold during evening review",
};

export default function TasksTab({
  active,
  tasksHistory,
  problems = [],
  interviews = [],
  _roadmapItems = {},
  onPersistTasks,
}) {
  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => dateKey(today), [today]);

  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const [noteDrafts, setNoteDrafts] = useState({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  const history = tasksHistory || {};

  // Auto-calculated activity for the selected date
  const solvedProblemsDate = useMemo(() => {
    return (problems || []).filter(
      (p) => p.status === "solved" && p.solve_date === selectedDateKey
    );
  }, [problems, selectedDateKey]);

  const applicationsDate = useMemo(() => {
    return (interviews || []).filter((i) => i.date === selectedDateKey);
  }, [interviews, selectedDateKey]);

  const selectedDate = new Date(selectedDateKey + "T00:00:00");
  const isSelectedToday = selectedDateKey === todayKey;
  const tasks = tasksFor(selectedDate);
  const selectedData = history[selectedDateKey] || {};

  // Load existing data + auto-fill defaults on date switch
  useEffect(() => {
    const data = tasksHistory || {};
    const dayData = data[selectedDateKey] || {};
    const existingNotes = dayData.notes || {};

    // Auto-sync notes from cross-tab activity if notes are empty
    const updatedNotes = { ...existingNotes };

    if (!updatedNotes.dsa && solvedProblemsDate.length > 0) {
      updatedNotes.dsa = `Solved ${solvedProblemsDate.length} problem(s): ` +
        solvedProblemsDate.map((p) => p.title).join(", ");
    }

    if (!updatedNotes.apps && applicationsDate.length > 0) {
      updatedNotes.apps = `Applied to ${applicationsDate.length} company(ies): ` +
        applicationsDate.map((a) => a.company).join(", ");
    }

    setNoteDrafts(updatedNotes);
  }, [selectedDateKey, tasksHistory, solvedProblemsDate, applicationsDate]);

  function syncActivityFromTabs() {
    const nextDsaCount = Math.max(selectedData.dsaCount || 0, solvedProblemsDate.length);
    const nextAppsCount = Math.max(selectedData.appsCount || 0, applicationsDate.length);

    const autoNotes = { ...noteDrafts };
    if (solvedProblemsDate.length > 0) {
      autoNotes.dsa = `Solved ${solvedProblemsDate.length} problem(s): ` +
        solvedProblemsDate.map((p) => p.title).join(", ");
    }
    if (applicationsDate.length > 0) {
      autoNotes.apps = `Applied to ${applicationsDate.length} company(ies): ` +
        applicationsDate.map((a) => a.company).join(", ");
    }

    setNoteDrafts(autoNotes);

    const nextHistory = {
      ...history,
      [selectedDateKey]: {
        ...selectedData,
        dsaCount: nextDsaCount,
        dsa: nextDsaCount >= DSA_TARGET,
        appsCount: nextAppsCount,
        apps: nextAppsCount >= APPS_TARGET,
        notes: autoNotes,
      },
    };

    onPersistTasks(nextHistory, selectedDateKey, nextHistory[selectedDateKey]);
    setSaveSuccessMsg("Auto-synced today's activity from Problem Vault & Interviews!");
    setTimeout(() => setSaveSuccessMsg(""), 3000);
  }

  function toggleTask(id) {
    const nextHistory = {
      ...history,
      [selectedDateKey]: {
        ...selectedData,
        [id]: !selectedData[id],
      },
    };
    onPersistTasks(nextHistory, selectedDateKey, nextHistory[selectedDateKey]);
  }

  function changeApps(delta) {
    const cur = selectedData.appsCount !== undefined ? selectedData.appsCount : applicationsDate.length;
    const next = Math.max(0, cur + delta);
    const nextHistory = {
      ...history,
      [selectedDateKey]: {
        ...selectedData,
        appsCount: next,
        apps: next >= APPS_TARGET,
      },
    };
    onPersistTasks(nextHistory, selectedDateKey, nextHistory[selectedDateKey]);
  }

  function changeDsaCount(delta) {
    const cur = selectedData.dsaCount !== undefined ? selectedData.dsaCount : solvedProblemsDate.length;
    const next = Math.max(0, cur + delta);
    const nextHistory = {
      ...history,
      [selectedDateKey]: {
        ...selectedData,
        dsaCount: next,
        dsa: next >= DSA_TARGET,
      },
    };
    onPersistTasks(nextHistory, selectedDateKey, nextHistory[selectedDateKey]);
  }

  function updateNoteDraft(id, text) {
    setNoteDrafts((prev) => ({ ...prev, [id]: text }));
  }

  // Explicit Save Button Handler
  function handleSaveCircuit() {
    const dsaCountVal = selectedData.dsaCount !== undefined ? selectedData.dsaCount : solvedProblemsDate.length;
    const appsCountVal = selectedData.appsCount !== undefined ? selectedData.appsCount : applicationsDate.length;

    const autoDsa = dsaCountVal >= DSA_TARGET || !!selectedData.dsa;
    const autoApps = appsCountVal >= APPS_TARGET || !!selectedData.apps;

    const nextDayData = {
      ...selectedData,
      dsaCount: dsaCountVal,
      dsa: autoDsa,
      appsCount: appsCountVal,
      apps: autoApps,
      learn: selectedData.learn !== undefined ? selectedData.learn : true,
      review: selectedData.review !== undefined ? selectedData.review : true,
      notes: noteDrafts,
    };

    const nextHistory = {
      ...history,
      [selectedDateKey]: nextDayData,
    };

    onPersistTasks(nextHistory, selectedDateKey, nextDayData);

    setSaveSuccessMsg("⚡ Circuit Saved Successfully! Streak Updated!");
    setTimeout(() => setSaveSuccessMsg(""), 3500);
  }

  function resetDay() {
    const nextHistory = { ...history };
    delete nextHistory[selectedDateKey];
    onPersistTasks(nextHistory, selectedDateKey, {});
    setNoteDrafts({});
  }

  // Calculate Streak
  let streak = dayComplete(todayKey, history) ? 1 : 0;
  {
    let cursor = new Date(today);
    cursor.setDate(cursor.getDate() - 1);
    for (let i = 0; i < 365; i++) {
      const key = dateKey(cursor);
      if (dayComplete(key, history)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Trail - Last 7 Days
  const trail = [];
  {
    let cursor = new Date(today);
    for (let i = 0; i < 7; i++) {
      const key = dateKey(cursor);
      trail.unshift({
        key,
        date: new Date(cursor),
        complete: dayComplete(key, history),
      });
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  const doneCount = tasks.filter((t) => selectedData[t.id]).length;
  const allDone = doneCount === tasks.length;

  const currentDsaCount = selectedData.dsaCount !== undefined ? selectedData.dsaCount : solvedProblemsDate.length;
  const currentAppsCount = selectedData.appsCount !== undefined ? selectedData.appsCount : applicationsDate.length;

  return (
    <div style={{ display: active ? "block" : "none" }} className="fade-in">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrowRow}>
            <span style={styles.eyebrow}>
              {isSelectedToday ? "DAILY CIRCUIT" : "HISTORIC CIRCUITS"}
            </span>
          </div>
          <h1 style={styles.title}>
            {selectedDate.toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
            {!isSelectedToday && <span style={styles.pastTag}>Viewing Past Day</span>}
          </h1>
        </div>

        {/* Streak Counter */}
        <div style={styles.streakBox}>
          <Zap size={18} color="#F2A93B" fill={streak > 0 ? "#F2A93B" : "none"} />
          <span style={styles.streakNum}>{streak}</span>
          <span style={styles.streakLabel}>day streak</span>
        </div>
      </div>

      {/* Cross-Tab Auto-Sync Banner */}
      <div style={styles.syncBanner}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Sparkles size={16} color="#38D9C9" />
          <div style={{ fontSize: 12.5, color: "#C7D2E0" }}>
            Cross-Tab Activity Today:{" "}
            <strong style={{ color: "#38D9C9" }}>{solvedProblemsDate.length}</strong> DSA Solved ·{" "}
            <strong style={{ color: "#4ADE80" }}>{applicationsDate.length}</strong> Applications Sent
          </div>
        </div>

        <button onClick={syncActivityFromTabs} style={styles.syncBtn}>
          <RefreshCw size={12} /> Auto-Sync Activity
        </button>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressTrack}>
        <div
          style={{
            ...styles.progressFill,
            width: `${tasks.length ? (doneCount / tasks.length) * 100 : 0}%`,
          }}
        />
      </div>
      <div style={styles.progressLabel}>
        {doneCount} / {tasks.length} closed {allDone ? "— circuit complete ⚡" : ""}
      </div>

      {/* Task Items */}
      <div style={styles.taskList}>
        {tasks.map((task, i) => {
          const done = !!selectedData[task.id];
          const isLast = i === tasks.length - 1;

          return (
            <div style={styles.taskRow} key={task.id}>
              <div style={styles.nodeCol}>
                <button
                  onClick={() => toggleTask(task.id)}
                  aria-pressed={done}
                  style={{
                    ...styles.node,
                    background: done ? "#F2A93B" : "#121A2B",
                    borderColor: done ? "#F2A93B" : "#2A3448",
                    cursor: "pointer",
                  }}
                >
                  {done && <Check size={14} color="#0A0F1C" strokeWidth={3} />}
                </button>
                {!isLast && (
                  <div
                    style={{
                      ...styles.trace,
                      background: done ? "#F2A93B" : "#2A3448",
                    }}
                  />
                )}
              </div>

              <div style={styles.taskContent}>
                <div style={styles.taskLabelRow}>
                  <div style={styles.taskLabel}>{task.label}</div>
                  {task.id === "dsa" && (
                    <span style={styles.targetBadge}>
                      {currentDsaCount}/{DSA_TARGET} Solved
                    </span>
                  )}
                  {task.id === "apps" && (
                    <span style={styles.targetBadge}>
                      {currentAppsCount}/{APPS_TARGET} Applied
                    </span>
                  )}
                </div>

                <div style={styles.taskSub}>{task.sub}</div>

                <textarea
                  style={styles.noteInput}
                  value={noteDrafts[task.id] || ""}
                  onChange={(e) => updateNoteDraft(task.id, e.target.value)}
                  placeholder={NOTE_PLACEHOLDERS[task.id] || "What did you do?"}
                  rows={2}
                />

                {/* Counters for DSA and Apps */}
                {task.id === "dsa" && (
                  <div style={styles.counterRow}>
                    <button style={styles.counterBtn} onClick={() => changeDsaCount(-1)}>
                      <Minus size={13} color="#E7EDF5" />
                    </button>
                    <span style={styles.counterNum}>{currentDsaCount}</span>
                    <button style={styles.counterBtn} onClick={() => changeDsaCount(1)}>
                      <Plus size={13} color="#E7EDF5" />
                    </button>
                    <span style={styles.counterTarget}>/ {DSA_TARGET} target</span>
                  </div>
                )}

                {task.id === "apps" && (
                  <div style={styles.counterRow}>
                    <button style={styles.counterBtn} onClick={() => changeApps(-1)}>
                      <Minus size={13} color="#E7EDF5" />
                    </button>
                    <span style={styles.counterNum}>{currentAppsCount}</span>
                    <button style={styles.counterBtn} onClick={() => changeApps(1)}>
                      <Plus size={13} color="#E7EDF5" />
                    </button>
                    <span style={styles.counterTarget}>/ {APPS_TARGET} target</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Explicit Save & Complete Circuit Action Bar */}
      <div style={styles.saveActionCard}>
        {saveSuccessMsg && (
          <div style={styles.successToast}>
            <CheckCircle2 size={16} color="#4ADE80" />
            {saveSuccessMsg}
          </div>
        )}

        <div style={styles.saveBtnRow}>
          <button onClick={handleSaveCircuit} style={styles.primarySaveBtn}>
            <Save size={15} /> Save &amp; Complete Circuit ⚡
          </button>

          <button style={styles.resetBtn} onClick={resetDay}>
            <RotateCcw size={12} /> Reset Day
          </button>

          {!isSelectedToday && (
            <button style={styles.todayBtn} onClick={() => setSelectedDateKey(todayKey)}>
              <Calendar size={12} /> Back to Today
            </button>
          )}
        </div>
      </div>

      <div style={styles.divider} />

      {/* Historic Trail */}
      <div style={styles.sectionLabel}>LAST 7 DAYS (Tap day to view/edit)</div>
      <div style={styles.trailRow}>
        {trail.map(({ key, date, complete }) => {
          const isActiveDay = key === selectedDateKey;
          return (
            <button
              key={key}
              onClick={() => setSelectedDateKey(key)}
              style={{
                ...styles.trailCell,
                border: isActiveDay
                  ? "1px solid rgba(56, 217, 201, 0.4)"
                  : "1px solid transparent",
                borderRadius: 8,
                padding: "6px 2px",
                background: isActiveDay ? "rgba(56, 217, 201, 0.05)" : "transparent",
              }}
            >
              <div
                style={{
                  ...styles.trailDot,
                  background: complete ? "#F2A93B" : "transparent",
                  borderColor: complete ? "#F2A93B" : "#2A3448",
                }}
              >
                {complete && <Check size={10} color="#0A0F1C" strokeWidth={3} />}
              </div>
              <span style={styles.trailDay}>
                {date.toLocaleDateString(undefined, { weekday: "narrow" })}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    marginBottom: 16, flexWrap: "wrap", gap: 12,
  },
  eyebrowRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 },
  eyebrow: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: 2,
    color: "#5D8DC1", fontWeight: 600,
  },
  title: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 20, fontWeight: 700,
    color: "#E7EDF5", margin: 0, display: "flex", alignItems: "center", gap: 10,
    flexWrap: "wrap",
  },
  pastTag: {
    fontSize: 10.5, color: "#F2A93B", background: "rgba(242,169,59,0.12)",
    padding: "2px 8px", borderRadius: 8, border: "1px solid rgba(242,169,59,0.3)",
  },
  streakBox: {
    display: "flex", alignItems: "center", gap: 6, background: "rgba(14,22,38,0.6)",
    border: "1px solid #1C2842", borderRadius: 12, padding: "8px 14px",
  },
  streakNum: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 18, fontWeight: 700,
    color: "#F2A93B",
  },
  streakLabel: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: "#8493AA",
  },
  syncBanner: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    background: "rgba(18,26,43,0.5)", border: "1px solid #1C2842",
    borderRadius: 14, padding: "12px 16px", marginBottom: 18, flexWrap: "wrap", gap: 10,
  },
  syncBtn: {
    display: "flex", alignItems: "center", gap: 6,
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600,
    color: "#38D9C9", background: "rgba(56,217,201,0.12)", border: "1px solid rgba(56,217,201,0.3)",
    borderRadius: 8, padding: "6px 12px", cursor: "pointer",
  },
  progressTrack: { height: 6, background: "#121A2B", borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", background: "#F2A93B", transition: "width 0.3s ease" },
  progressLabel: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#8493AA",
    marginTop: 6, marginBottom: 20, textAlign: "right",
  },
  taskList: { display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 },
  taskRow: { display: "flex", gap: 16, alignItems: "flex-start" },
  nodeCol: { display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 },
  node: {
    width: 24, height: 24, borderRadius: "50%", border: "2px solid",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
    transition: "all 0.15s ease",
  },
  trace: { width: 2, height: 110, marginTop: 4 },
  taskContent: { flex: 1, display: "flex", flexDirection: "column", gap: 6 },
  taskLabelRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  taskLabel: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 700, color: "#E7EDF5",
  },
  targetBadge: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, fontWeight: 600,
    color: "#38D9C9", background: "rgba(56,217,201,0.1)", padding: "2px 8px", borderRadius: 8,
  },
  taskSub: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#8493AA",
  },
  noteInput: {
    background: "#0E1626", border: "1px solid #1C2842", borderRadius: 10,
    color: "#E7EDF5", fontSize: 13, fontFamily: "'IBM Plex Sans', sans-serif",
    padding: "9px 12px", outline: "none", resize: "vertical", width: "100%",
  },
  counterRow: { display: "flex", alignItems: "center", gap: 8, marginTop: 2 },
  counterBtn: {
    background: "#121A2B", border: "1px solid #2A3448", borderRadius: 6,
    width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", padding: 0,
  },
  counterNum: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 700,
    color: "#E7EDF5", minWidth: 20, textAlign: "center",
  },
  counterTarget: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#5D8DC1",
  },
  saveActionCard: {
    background: "rgba(14,22,38,0.65)", border: "1px solid #1C2842",
    borderRadius: 16, padding: "16px 20px", marginBottom: 20,
    display: "flex", flexDirection: "column", gap: 12,
  },
  successToast: {
    display: "flex", alignItems: "center", gap: 8,
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 600,
    color: "#4ADE80", background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)",
    padding: "10px 14px", borderRadius: 10,
  },
  saveBtnRow: { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" },
  primarySaveBtn: {
    display: "flex", alignItems: "center", gap: 8,
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, fontWeight: 700,
    background: "linear-gradient(135deg, #F2A93B 0%, #38D9C9 100%)",
    color: "#0A0F1C", padding: "10px 20px", borderRadius: 10,
    cursor: "pointer", border: "none", boxShadow: "0 2px 14px rgba(242,169,59,0.25)",
  },
  resetBtn: {
    display: "flex", alignItems: "center", gap: 6,
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#8493AA",
    background: "none", border: "none", cursor: "pointer", marginLeft: "auto",
  },
  todayBtn: {
    display: "flex", alignItems: "center", gap: 6,
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#38D9C9",
    background: "none", border: "none", cursor: "pointer",
  },
  divider: { height: 1, background: "#1C2842", margin: "20px 0" },
  sectionLabel: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: 1.5,
    color: "#5D8DC1", marginBottom: 12, fontWeight: 700,
  },
  trailRow: { display: "flex", gap: 8, justifyContent: "space-between" },
  trailCell: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
    cursor: "pointer", flex: 1,
  },
  trailDot: {
    width: 20, height: 20, borderRadius: "50%", border: "2px solid #2A3448",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  trailDay: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#8493AA",
  },
};
