import React, { useState, useEffect, useMemo } from "react";
import { Check, Zap, Plus, Minus, RotateCcw, Calendar } from "lucide-react";

import { dateKey, tasksFor, dayComplete } from "../utils";

const APPS_TARGET = 3;

const NOTE_PLACEHOLDERS = {
  dsa: "e.g. Reversed a linked list, explained approach out loud",
  apps: "e.g. Companies applied to today",
  learn: "e.g. What concept, in one line",
  review: "e.g. What you re-solved",
  project: "e.g. Feature you shipped",
  recap: "e.g. What you can now explain cold",
};

export default function TasksTab({ active, tasksHistory, onPersistTasks }) {
  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => dateKey(today), [today]);
  
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const [noteDrafts, setNoteDrafts] = useState({});

  const history = tasksHistory || {};

  // Update drafts when selecting a different date
  useEffect(() => {
    const data = tasksHistory || {};
    if (data[selectedDateKey]) {
      setNoteDrafts(data[selectedDateKey].notes || {});
    } else {
      setNoteDrafts({});
    }
  }, [selectedDateKey, tasksHistory]);

  function persist(nextHistory) {
    const activeData = nextHistory[selectedDateKey] || {};
    onPersistTasks(nextHistory, selectedDateKey, activeData);
  }

  const selectedDate = new Date(selectedDateKey + "T00:00:00");
  const isSelectedToday = selectedDateKey === todayKey;
  const tasks = tasksFor(selectedDate);
  const selectedData = history[selectedDateKey] || {};

  function toggleTask(id) {
    const nextHistory = {
      ...history,
      [selectedDateKey]: {
        ...selectedData,
        [id]: !selectedData[id]
      }
    };
    persist(nextHistory);
  }

  function changeApps(delta) {
    const cur = selectedData.appsCount || 0;
    const next = Math.max(0, cur + delta);
    const nextHistory = {
      ...history,
      [selectedDateKey]: {
        ...selectedData,
        appsCount: next,
        apps: next >= APPS_TARGET
      }
    };
    persist(nextHistory);
  }

  function resetDay() {
    const nextHistory = { ...history };
    delete nextHistory[selectedDateKey];
    persist(nextHistory);
    setNoteDrafts({});
  }

  function updateNoteDraft(id, text) {
    setNoteDrafts((prev) => ({ ...prev, [id]: text }));
  }

  async function saveNote(id) {
    const text = noteDrafts[id] || "";
    const nextHistory = {
      ...history,
      [selectedDateKey]: {
        ...selectedData,
        notes: {
          ...(selectedData.notes || {}),
          [id]: text
        }
      }
    };
    await persist(nextHistory);
  }

  // Calculate Streak
  let streak = dayComplete(todayKey, history) ? 1 : 0;
  {
    let cursor = new Date(today);
    cursor.setDate(cursor.getDate() - 1);
    // Limit loop to avoid browser hanging (max 365 days check)
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

  // Last 7 Days Track
  const trail = [];
  {
    let cursor = new Date(today);
    for (let i = 0; i < 7; i++) {
      const key = dateKey(cursor);
      trail.unshift({
        key,
        date: new Date(cursor),
        complete: dayComplete(key, history)
      });
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  // Week Stats
  let weekApps = 0, weekDsa = 0;
  trail.forEach(({ key }) => {
    const d = history[key];
    if (d) {
      weekApps += d.appsCount || 0;
      if (d.dsa) weekDsa++;
    }
  });

  const doneCount = tasks.filter((t) => selectedData[t.id]).length;
  const allDone = doneCount === tasks.length;

  return (
    <div style={{ display: active ? "block" : "none" }} className="fade-in">
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrowRow}>
            <span style={styles.eyebrow}>{isSelectedToday ? "DAILY CIRCUIT" : "HISTORIC CIRCUITS"}</span>
          </div>
          <h1 style={styles.title}>
            {selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            {!isSelectedToday && <span style={styles.pastTag}>Viewing Past Day</span>}
          </h1>
        </div>
        <div style={styles.streakBox}>
          <Zap size={18} color="#F2A93B" fill={streak > 0 ? "#F2A93B" : "none"} />
          <span style={styles.streakNum}>{streak}</span>
          <span style={styles.streakLabel}>day streak</span>
        </div>
      </div>

      <div style={styles.progressTrack}>
        <div style={{ ...styles.progressFill, width: `${tasks.length ? (doneCount / tasks.length) * 100 : 0}%` }} />
      </div>
      <div style={styles.progressLabel}>
        {doneCount} / {tasks.length} closed {allDone ? "— circuit complete ⚡" : ""}
      </div>

      <div style={styles.taskList}>
        {tasks.map((task, i) => {
          const done = !!selectedData[task.id];
          const isLast = i === tasks.length - 1;
          return (
            <div style={styles.taskRow} key={task.id}>
              <div style={styles.nodeCol}>
                <button
                  onClick={() => task.id !== "apps" && toggleTask(task.id)}
                  aria-pressed={done}
                  style={{
                    ...styles.node,
                    background: done ? "#F2A93B" : "#121A2B",
                    borderColor: done ? "#F2A93B" : "#2A3448",
                    cursor: task.id === "apps" ? "default" : "pointer"
                  }}
                >
                  {done && <Check size={14} color="#0A0F1C" strokeWidth={3} />}
                </button>
                {!isLast && <div style={{ ...styles.trace, background: done ? "#F2A93B" : "#2A3448" }} />}
              </div>
              <div style={styles.taskContent}>
                <div style={styles.taskLabel}>{task.label}</div>
                <div style={styles.taskSub}>{task.sub}</div>
                <textarea
                  style={styles.noteInput}
                  value={noteDrafts[task.id] || ""}
                  onChange={(e) => updateNoteDraft(task.id, e.target.value)}
                  onBlur={() => saveNote(task.id)}
                  placeholder={NOTE_PLACEHOLDERS[task.id] || "What did you do?"}
                  rows={2}
                />
                {task.id === "apps" && (
                  <div style={styles.counterRow}>
                    <button style={styles.counterBtn} onClick={() => changeApps(-1)}>
                      <Minus size={14} color="#E7EDF5" />
                    </button>
                    <span style={styles.counterNum}>{selectedData.appsCount || 0}</span>
                    <button style={styles.counterBtn} onClick={() => changeApps(1)}>
                      <Plus size={14} color="#E7EDF5" />
                    </button>
                    <span style={styles.counterTarget}>/ {APPS_TARGET} target</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.actionRow}>
        <button style={styles.resetBtn} onClick={resetDay}>
          <RotateCcw size={12} /> reset this day
        </button>
        {!isSelectedToday && (
          <button style={styles.todayBtn} onClick={() => setSelectedDateKey(todayKey)}>
            <Calendar size={12} /> back to today
          </button>
        )}
      </div>

      <div style={styles.divider} />
      
      <div style={styles.sectionLabel}>LAST 7 DAYS (Tap day to edit)</div>
      <div style={styles.trailRow}>
        {trail.map(({ key, date, complete }) => {
          const isActiveDay = key === selectedDateKey;
          return (
            <button 
              key={key} 
              onClick={() => setSelectedDateKey(key)} 
              style={{
                ...styles.trailCell,
                border: isActiveDay ? "1px solid rgba(56, 217, 201, 0.4)" : "1px solid transparent",
                borderRadius: 8,
                padding: "6px 2px",
                background: isActiveDay ? "rgba(56, 217, 201, 0.05)" : "transparent"
              }}
            >
              <div
                style={{
                  ...styles.trailDot,
                  background: complete ? "#F2A93B" : "transparent",
                  borderColor: complete ? "#F2A93B" : "#2A3448"
                }}
              />
              <div style={{
                ...styles.trailLabel,
                color: isActiveDay ? "#38D9C9" : "#5D8DC1",
                fontWeight: isActiveDay ? 700 : 400
              }}>
                {key === todayKey ? "Today" : date.toLocaleDateString(undefined, { weekday: "short" })}
              </div>
            </button>
          );
        })}
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <div style={styles.statNum}>{weekDsa}</div>
          <div style={styles.statLabel}>DSA solved</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statNum}>{weekApps}</div>
          <div style={styles.statLabel}>apps sent</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statNum}>{trail.filter((t) => t.complete).length}</div>
          <div style={styles.statLabel}>full days</div>
        </div>
      </div>
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18
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
    display: "flex",
    alignItems: "center",
    gap: 4,
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
    margin: "0 0 6px",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8
  },
  pastTag: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    color: "#F2A93B",
    background: "rgba(242, 169, 59, 0.1)",
    padding: "2px 6px",
    borderRadius: 4,
    fontWeight: 400
  },
  streakBox: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    background: "#121A2B",
    border: "1px solid #2A3448",
    borderRadius: 20,
    padding: "6px 12px",
    flexShrink: 0
  },
  streakNum: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 700,
    color: "#F2A93B",
    fontSize: 14
  },
  streakLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    color: "#8493AA"
  },
  progressTrack: {
    height: 6,
    background: "#121A2B",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6
  },
  progressFill: {
    height: "100%",
    background: "#F2A93B",
    transition: "width 0.3s ease"
  },
  progressLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    color: "#8493AA",
    marginBottom: 18
  },
  taskList: {
    display: "flex",
    flexDirection: "column"
  },
  taskRow: {
    display: "flex",
    gap: 14
  },
  nodeCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  node: {
    width: 26,
    height: 26,
    borderRadius: "50%",
    border: "2px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    padding: 0
  },
  trace: {
    width: 2,
    flex: 1,
    minHeight: 28,
    margin: "2px 0"
  },
  taskContent: {
    paddingBottom: 20,
    flex: 1
  },
  taskLabel: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 14.5,
    fontWeight: 600,
    color: "#E7EDF5"
  },
  taskSub: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 12,
    color: "#8493AA",
    marginTop: 2
  },
  noteInput: {
    width: "100%",
    marginTop: 8,
    background: "#121A2B",
    border: "1px solid #1C2842",
    borderRadius: 8,
    color: "#E7EDF5",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 12.5,
    padding: "8px 10px",
    resize: "vertical",
    outline: "none",
    transition: "border-color 0.2s ease",
    ":focus": {
      borderColor: "#38D9C9"
    }
  },
  counterRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 8
  },
  counterBtn: {
    width: 22,
    height: 22,
    borderRadius: 6,
    border: "1px solid #2A3448",
    background: "#121A2B",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 0
  },
  counterNum: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 13,
    color: "#E7EDF5",
    minWidth: 14,
    textAlign: "center"
  },
  counterTarget: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10.5,
    color: "#5D8DC1"
  },
  actionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6
  },
  resetBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "none",
    border: "none",
    color: "#5D8DC1",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    cursor: "pointer",
    padding: 0
  },
  todayBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "none",
    border: "none",
    color: "#38D9C9",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    cursor: "pointer",
    padding: 0
  },
  divider: {
    height: 1,
    background: "#1C2842",
    margin: "18px 0 14px"
  },
  sectionLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10.5,
    letterSpacing: 1.5,
    color: "#5D8DC1",
    marginBottom: 10
  },
  trailRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 4
  },
  trailCell: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    cursor: "pointer"
  },
  trailDot: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    border: "2px solid"
  },
  trailLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 9,
    textAlign: "center"
  },
  statsRow: {
    display: "flex",
    gap: 10
  },
  statBox: {
    flex: 1,
    background: "#121A2B",
    border: "1px solid #1C2842",
    borderRadius: 10,
    padding: "10px 8px",
    textAlign: "center"
  },
  statNum: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 18,
    fontWeight: 700,
    color: "#F2A93B"
  },
  statLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 9.5,
    color: "#8493AA",
    marginTop: 2
  }
};
