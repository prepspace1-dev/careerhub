import React, { useState, useEffect } from "react";
import { Zap, ChevronRight } from "lucide-react";
import { fetchSkills, saveSkill } from "../db";

const LEVELS = [
  { key: 0, label: "Not started", color: "#5D8DC1", fill: "transparent", border: "#2A3448" },
  { key: 1, label: "Learning", color: "#F2A93B", fill: "#F2A93B", border: "#F2A93B" },
  { key: 2, label: "Comfortable", color: "#38D9C9", fill: "#38D9C9", border: "#38D9C9" },
  { key: 3, label: "Strong", color: "#4ADE80", fill: "#4ADE80", border: "#4ADE80" },
];

const CATEGORIES = [
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    items: [
      { id: "arrays", label: "Arrays", level: 3 },
      { id: "strings", label: "Strings", level: 3 },
      { id: "linkedlist", label: "Linked Lists", level: 1 },
      { id: "stacksqueues", label: "Stacks & Queues", level: 0 },
      { id: "trees", label: "Trees", level: 0 },
      { id: "graphs", label: "Graphs (basic)", level: 0 },
    ],
  },
  {
    id: "java",
    title: "Core Java",
    items: [
      { id: "syntax", label: "Syntax & Basics", level: 2 },
      { id: "oop", label: "OOP Concepts", level: 1 },
      { id: "collections", label: "Collections Framework", level: 1 },
      { id: "exceptions", label: "Exception Handling", level: 0 },
    ],
  },
  {
    id: "db",
    title: "Databases (SQL)",
    items: [
      { id: "sqlbasics", label: "SQL Basics (queries)", level: 1 },
      { id: "joins", label: "Joins & Aggregates", level: 0 },
      { id: "jdbc", label: "JDBC (Java + DB)", level: 0 },
    ],
  },
  {
    id: "cs",
    title: "CS Fundamentals",
    items: [
      { id: "dbmsconcepts", label: "DBMS Concepts", level: 0 },
      { id: "os", label: "OS Basics", level: 0 },
      { id: "networking", label: "Networking Basics", level: 0 },
    ],
  },
  {
    id: "tools",
    title: "Frameworks & Tools",
    items: [
      { id: "springboot", label: "Spring Boot", level: 0 },
      { id: "restapi", label: "REST APIs", level: 0 },
      { id: "git", label: "Git / GitHub", level: 0 },
    ],
  },
  {
    id: "projects",
    title: "Projects",
    items: [
      { id: "inventory", label: "Inventory Tracker", level: 1 },
      { id: "rag", label: "RAG Project", level: 1 },
      { id: "upi", label: "UPI Transaction Project", level: 1 },
    ],
  },
];

const DEFAULTS = {};
CATEGORIES.forEach((c) => c.items.forEach((i) => (DEFAULTS[i.id] = i.level)));

export default function SkillsTab({ active, userId }) {
  const [levels, setLevels] = useState(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!active) return;
    (async () => {
      setSyncing(true);
      const data = await fetchSkills(userId, DEFAULTS);
      setLevels(data);
      setSyncing(false);
    })();
  }, [active, userId]);

  if (!levels) return <div style={styles.loading}>loading…</div>;

  async function cycle(id) {
    const cur = levels[id] ?? 0;
    const nextLevel = (cur + 1) % LEVELS.length;
    const nextLevels = { ...levels, [id]: nextLevel };
    setLevels(nextLevels);

    try {
      await saveSkill(userId, id, nextLevel, nextLevels);
    } catch (e) {
      console.error("Failed to save skill update:", e);
    }
  }

  const allItems = CATEGORIES.flatMap((c) => c.items.map((i) => ({ ...i, cat: c.title })));
  const counts = [0, 0, 0, 0];
  allItems.forEach((i) => counts[levels[i.id] ?? 0]++);

  // Focus next: items that are Level 0 or 1, sorted by level ascending
  const focusNext = allItems
    .filter((i) => (levels[i.id] ?? 0) <= 1)
    .sort((a, b) => (levels[a.id] ?? 0) - (levels[b.id] ?? 0))
    .slice(0, 4);

  // Total Progress Percentage
  const maxScore = allItems.length * 3;
  const currentScore = allItems.reduce((acc, item) => acc + (levels[item.id] ?? 0), 0);
  const progressPercent = Math.round((currentScore / maxScore) * 100);

  return (
    <div style={{ display: active ? "block" : "none" }} className="fade-in">
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrowRow}>
            <span style={styles.eyebrow}>SKILL MAP</span>
            {syncing && <span style={styles.syncIndicator}>Syncing</span>}
          </div>
          <h1 style={styles.title}>Where you stand</h1>
        </div>
        <div style={styles.percentBox}>
          <span style={styles.percentNum}>{progressPercent}%</span>
          <span style={styles.percentLabel}>mastery</span>
        </div>
      </div>
      
      <p style={styles.subtitle}>Tap any skill to advance it: Not started → Learning → Comfortable → Strong</p>

      <div style={styles.summaryRow}>
        {LEVELS.map((l) => (
          <div style={styles.summaryBox} key={l.key}>
            <div style={{ ...styles.summaryNum, color: l.color }}>{counts[l.key]}</div>
            <div style={styles.summaryLabel}>{l.label}</div>
          </div>
        ))}
      </div>

      {focusNext.length > 0 && (
        <div style={styles.focusBox}>
          <div style={styles.focusHeader}>
            <Zap size={13} color="#F2A93B" />
            <span>FOCUS NEXT</span>
          </div>
          <div style={styles.focusList}>
            {focusNext.map((f) => (
              <div key={f.id} style={styles.focusItem}>
                <ChevronRight size={12} color="#5D8DC1" />
                <span style={{ color: "#E7EDF5", fontWeight: 500 }}>{f.label}</span>
                <span style={{ color: "#5D8DC1", fontSize: 10.5 }}>· {f.cat}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={styles.divider} />

      {CATEGORIES.map((cat) => (
        <div key={cat.id} style={styles.categoryBlock}>
          <div style={styles.categoryTitle}>{cat.title}</div>
          <div style={styles.itemColumn}>
            {cat.items.map((item) => {
              const lvl = levels[item.id] ?? 0;
              const meta = LEVELS[lvl];
              return (
                <button 
                  key={item.id} 
                  onClick={() => cycle(item.id)} 
                  style={{
                    ...styles.itemRow,
                    borderColor: lvl > 0 ? "rgba(28, 40, 66, 0.8)" : "#1C2842",
                    background: lvl > 0 ? "rgba(14, 22, 38, 0.9)" : "#0E1626"
                  }}
                >
                  <span style={styles.itemLabel}>{item.label}</span>
                  <span style={styles.itemRight}>
                    <span style={{ ...styles.statusTag, color: meta.color }}>
                      {meta.label}
                    </span>
                    <span style={styles.dotsRow}>
                      {LEVELS.slice(1).map((l) => (
                        <span 
                          key={l.key} 
                          style={{
                            ...styles.dot,
                            background: lvl >= l.key ? l.fill : "transparent",
                            borderColor: lvl >= l.key ? l.color : "#2A3448"
                          }} 
                        />
                      ))}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
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
  percentBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    background: "rgba(56, 217, 201, 0.08)",
    border: "1px solid rgba(56, 217, 201, 0.2)",
    borderRadius: 12,
    padding: "6px 12px",
    flexShrink: 0
  },
  percentNum: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 700,
    color: "#38D9C9",
    fontSize: 14
  },
  percentLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 8.5,
    color: "#8493AA"
  },
  subtitle: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 12.5,
    color: "#8493AA",
    margin: "0 0 20px",
    lineHeight: 1.5
  },
  summaryRow: {
    display: "flex",
    gap: 8,
    marginBottom: 18
  },
  summaryBox: {
    flex: 1,
    background: "#0E1626",
    border: "1px solid #1C2842",
    borderRadius: 10,
    padding: "10px 4px",
    textAlign: "center"
  },
  summaryNum: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 18,
    fontWeight: 700
  },
  summaryLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 8.5,
    color: "#8493AA",
    marginTop: 3,
    lineHeight: 1.3
  },
  focusBox: {
    background: "#0E1626",
    border: "1px solid #2A3448",
    borderRadius: 12,
    padding: "14px 16px",
    marginBottom: 22
  },
  focusHeader: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10.5,
    letterSpacing: 1.5,
    color: "#F2A93B",
    marginBottom: 10
  },
  focusList: {
    display: "flex",
    flexDirection: "column",
    gap: 7
  },
  focusItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 13
  },
  divider: {
    height: 1,
    background: "#1C2842",
    margin: "18px 0 14px"
  },
  categoryBlock: {
    marginBottom: 26
  },
  categoryTitle: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    letterSpacing: 1.5,
    color: "#5D8DC1",
    marginBottom: 10,
    textTransform: "uppercase"
  },
  itemColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 8
  },
  itemRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    border: "1px solid",
    borderRadius: 10,
    padding: "12px 14px",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.2s ease",
    ":hover": {
      transform: "translateX(2px)"
    }
  },
  itemLabel: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 13.5,
    fontWeight: 500,
    color: "#E7EDF5"
  },
  itemRight: {
    display: "flex",
    alignItems: "center",
    gap: 10
  },
  statusTag: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10.5,
    minWidth: 78,
    textAlign: "right"
  },
  dotsRow: {
    display: "flex",
    gap: 3
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    border: "1.5px solid"
  }
};
