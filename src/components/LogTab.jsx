import React, { useState, useEffect, useMemo } from "react";
import { Save, Check, Calendar, Search, Sparkles, Tag } from "lucide-react";
import { fetchLogs, saveLog, fetchTasks } from "../db";
import { dateKey, niceDate } from "../utils";

const ALL_TAGS = [
  { label: "DSA", color: "#38D9C9", bg: "rgba(56, 217, 201, 0.08)" },
  { label: "Applications", color: "#F2A93B", bg: "rgba(242, 169, 59, 0.08)" },
  { label: "Core Java", color: "#4ADE80", bg: "rgba(74, 222, 128, 0.08)" },
  { label: "Spring Boot", color: "#60A5FA", bg: "rgba(96, 165, 250, 0.08)" },
  { label: "Databases", color: "#F472B6", bg: "rgba(244, 114, 182, 0.08)" },
  { label: "Projects", color: "#A78BFA", bg: "rgba(167, 139, 250, 0.08)" },
  { label: "CS Basics", color: "#F87171", bg: "rgba(248, 113, 113, 0.08)" },
  { label: "System Design", color: "#FB7185", bg: "rgba(251, 113, 133, 0.08)" }
];

// Parser helper to switch between freeform and guided layout
function parseLogEntry(text) {
  const result = {
    mode: "freeform",
    accomplished: "",
    blockers: "",
    plan: "",
    tags: []
  };

  if (!text) return result;

  // Extract tags from the header if they exist (format: #tags: tag1, tag2)
  const tagMatch = text.match(/#tags:\s*(.*)/);
  if (tagMatch && tagMatch[1]) {
    result.tags = tagMatch[1].split(",").map((t) => t.trim()).filter(Boolean);
  }

  // Detect guided sections
  if (text.includes("### 🏆 Accomplished") || text.includes("### 🛑 Blockers") || text.includes("### 🎯 Tomorrow's Plan")) {
    result.mode = "guided";

    // Extract Accomplished
    const accomplishedMatch = text.match(/### 🏆 Accomplished\n([\s\S]*?)(?=\n###|$)/);
    if (accomplishedMatch) result.accomplished = accomplishedMatch[1].trim();

    // Extract Blockers
    const blockersMatch = text.match(/### 🛑 Blockers\n([\s\S]*?)(?=\n###|$)/);
    if (blockersMatch) result.blockers = blockersMatch[1].trim();

    // Extract Plan
    const planMatch = text.match(/### 🎯 Tomorrow's Plan\n([\s\S]*?)(?=\n###|$)/);
    if (planMatch) result.plan = planMatch[1].trim();
  } else {
    // If no section headings, clean the tags header out for the freeform text representation
    result.mode = "freeform";
  }

  return result;
}

// Compile guided structure into single markdown string
function compileLogEntry(mode, data) {
  let tagsHeader = "";
  if (data.tags && data.tags.length > 0) {
    tagsHeader = `#tags: ${data.tags.join(", ")}\n\n`;
  }

  if (mode === "freeform") {
    // Clean existing tags if any and prepend current tags
    const cleanedText = data.freeformText ? data.freeformText.replace(/#tags:\s*.*\n*/g, "").trim() : "";
    return `${tagsHeader}${cleanedText}`;
  }

  // Compile Guided sections
  return `${tagsHeader}### 🏆 Accomplished\n${data.accomplished || "Nothing logged"}\n\n### 🛑 Blockers\n${data.blockers || "None"}\n\n### 🎯 Tomorrow's Plan\n${data.plan || "Same direction"}`;
}

export default function LogTab({ active, userId }) {
  const [entries, setEntries] = useState(null);
  const [tasksHistory, setTasksHistory] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  
  // Editor state
  const [editorMode, setEditorMode] = useState("guided"); // 'guided' or 'freeform'
  const [freeformText, setFreeformText] = useState("");
  const [accomplished, setAccomplished] = useState("");
  const [blockers, setBlockers] = useState("");
  const [plan, setPlan] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  
  const [savedFlash, setSavedFlash] = useState(false);
  const [syncing, setSyncing] = useState(false);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState("All");

  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => dateKey(today), [today]);

  useEffect(() => {
    if (!active) return;
    (async () => {
      setSyncing(true);
      const logData = await fetchLogs(userId);
      setEntries(logData);
      
      const taskData = await fetchTasks(userId);
      setTasksHistory(taskData);

      if (!selectedDate) {
        loadEntryData(todayKey, logData);
      } else {
        loadEntryData(selectedDate, logData);
      }
      setSyncing(false);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, userId]);

  function loadEntryData(key, allEntries = entries) {
    setSelectedDate(key);
    const entryText = allEntries[key] || "";
    const parsed = parseLogEntry(entryText);
    
    setEditorMode(parsed.mode);
    setSelectedTags(parsed.tags);
    
    if (parsed.mode === "guided") {
      setAccomplished(parsed.accomplished);
      setBlockers(parsed.blockers);
      setPlan(parsed.plan);
      setFreeformText("");
    } else {
      // For freeform, strip out the tags line for cleaner editing experience
      const displayFreeform = entryText.replace(/#tags:\s*.*\n*/g, "").trim();
      setFreeformText(displayFreeform);
      setAccomplished("");
      setBlockers("");
      setPlan("");
    }
  }

  // Toggles the editor mode and compiles/parses state dynamically
  function handleModeToggle(newMode) {
    if (newMode === editorMode) return;
    
    if (newMode === "freeform") {
      // Guided -> Freeform: Compile guided fields to freeform
      const compiled = compileLogEntry("guided", { accomplished, blockers, plan, tags: [] }).replace(/#tags:\s*.*\n*/g, "").trim();
      setFreeformText(compiled);
    } else {
      // Freeform -> Guided: Try to parse whatever is in the freeform editor
      const parsed = parseLogEntry(freeformText);
      setAccomplished(parsed.accomplished || freeformText);
      setBlockers(parsed.blockers || "");
      setPlan(parsed.plan || "");
    }
    
    setEditorMode(newMode);
  }

  function handleTagClick(tagLabel) {
    setSelectedTags(prev => 
      prev.includes(tagLabel) ? prev.filter(t => t !== tagLabel) : [...prev, tagLabel]
    );
  }

  async function save() {
    let finalContent = "";
    if (editorMode === "freeform") {
      finalContent = compileLogEntry("freeform", { freeformText, tags: selectedTags });
    } else {
      finalContent = compileLogEntry("guided", { accomplished, blockers, plan, tags: selectedTags });
    }

    const nextEntries = { ...entries, [selectedDate]: finalContent };
    setEntries(nextEntries);
    
    try {
      await saveLog(userId, selectedDate, finalContent, nextEntries);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1400);
    } catch (e) {
      console.error("Failed to save daily log:", e);
    }
  }

  if (!entries) return <div style={styles.loading}>loading…</div>;

  // Filter logs based on search text and tag selections
  const filteredPastDates = Object.keys(entries)
    .filter((k) => {
      const content = entries[k] || "";
      const parsed = parseLogEntry(content);
      const matchesSearch = content.toLowerCase().includes(searchQuery.toLowerCase()) || niceDate(k).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = filterTag === "All" || parsed.tags.includes(filterTag);
      return content.trim().length > 0 && matchesSearch && matchesTag;
    })
    .sort((a, b) => (a < b ? 1 : -1));

  const isSelectedToday = selectedDate === todayKey;

  // Compile character & word count based on editor mode
  const currentContentText = editorMode === "freeform" 
    ? freeformText 
    : `${accomplished} ${blockers} ${plan}`;
  const wordCount = currentContentText.trim() ? currentContentText.trim().split(/\s+/).length : 0;

  // Fetch metrics for selected day to show in editor header
  const selectedDayStats = tasksHistory[selectedDate];
  const selectedDayTasks = selectedDayStats ? (
    () => {
      const d = new Date(selectedDate + "T00:00:00");
      const isWk = d.getDay() === 0 || d.getDay() === 6;
      const count = (selectedDayStats.dsa ? 1 : 0) + 
                    (selectedDayStats.apps ? 1 : 0) + 
                    (selectedDayStats.learn ? 1 : 0) + 
                    (selectedDayStats.review ? 1 : 0) +
                    (selectedDayStats.project ? 1 : 0) +
                    (selectedDayStats.recap ? 1 : 0);
      const total = isWk ? 2 : 4;
      return { count, total, completed: count === total };
    }
  )() : null;

  return (
    <div style={{ display: active ? "block" : "none" }} className="fade-in">
      {/* Tab Title */}
      <div style={styles.header}>
        <div style={styles.eyebrowRow}>
          <span style={styles.eyebrow}>WORKLOG & INSIGHTS</span>
          {syncing && <span style={styles.syncIndicator}>Syncing</span>}
        </div>
        <h1 style={styles.title}>Redesigned Developer Log</h1>
      </div>

      {/* Main Logging Card */}
      <div style={styles.editorBox}>
        {/* Editor Sub-Header */}
        <div style={styles.editorHeader}>
          <div style={appStyles.editorMetaRow}>
            <Calendar size={14} color="#5D8DC1" />
            <span style={styles.editorDate}>
              {niceDate(selectedDate)}
              {isSelectedToday && <span style={styles.todayTag}>TODAY</span>}
            </span>
          </div>

          <div style={appStyles.modeToggleRow}>
            <button 
              onClick={() => handleModeToggle("guided")} 
              style={{
                ...appStyles.modeBtn, 
                color: editorMode === "guided" ? "#0A0F1C" : "#8493AA",
                background: editorMode === "guided" ? "#38D9C9" : "transparent"
              }}
            >
              Guided
            </button>
            <button 
              onClick={() => handleModeToggle("freeform")} 
              style={{
                ...appStyles.modeBtn, 
                color: editorMode === "freeform" ? "#0A0F1C" : "#8493AA",
                background: editorMode === "freeform" ? "#38D9C9" : "transparent"
              }}
            >
              Freeform
            </button>
          </div>
        </div>

        {/* Selected Day Stats Reminder */}
        {selectedDayStats && (
          <div style={appStyles.statsBanner}>
            <Sparkles size={11} color="#F2A93B" />
            <span style={appStyles.statsBannerText}>
              Day Metrics: {selectedDayTasks?.count}/{selectedDayTasks?.total} tasks closed 
              {selectedDayStats.appsCount > 0 && ` · 💼 ${selectedDayStats.appsCount} apps`}
              {selectedDayStats.dsa && ` · 💻 DSA solved`}
              {selectedDayTasks?.completed && ` · ⚡ Circuit Complete`}
            </span>
          </div>
        )}

        {/* Inputs */}
        {editorMode === "guided" ? (
          <div style={appStyles.guidedForm}>
            <div style={appStyles.guidedField}>
              <span style={appStyles.fieldLabel}>🏆 What did you accomplish today?</span>
              <textarea
                style={styles.textarea}
                rows={3}
                value={accomplished}
                onChange={(e) => setAccomplished(e.target.value)}
                placeholder="e.g. Solved reversed linked list problem, completed collections module, applied to 3 companies."
              />
            </div>
            
            <div style={appStyles.guidedField}>
              <span style={appStyles.fieldLabel}>🛑 Any blockers or challenges?</span>
              <textarea
                style={{ ...styles.textarea, minHeight: "56px" }}
                rows={2}
                value={blockers}
                onChange={(e) => setBlockers(e.target.value)}
                placeholder="e.g. Struggled with recursion base cases, SQL query join took too long. (Write 'None' if clear path)"
              />
            </div>

            <div style={appStyles.guidedField}>
              <span style={appStyles.fieldLabel}>🎯 What's the priority for tomorrow?</span>
              <textarea
                style={{ ...styles.textarea, minHeight: "56px" }}
                rows={2}
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                placeholder="e.g. Review trees algorithms, fix UPI project transaction bug."
              />
            </div>
          </div>
        ) : (
          <div style={appStyles.freeformForm}>
            <textarea
              style={styles.textarea}
              rows={8}
              value={freeformText}
              onChange={(e) => setFreeformText(e.target.value)}
              placeholder="Write a free-form daily entry. Share whatever is on your mind, concepts explored, interview experiences..."
            />
          </div>
        )}

        {/* Daily Focus Tags */}
        <div style={appStyles.tagsSection}>
          <div style={appStyles.tagsLabelRow}>
            <Tag size={11} color="#5D8DC1" />
            <span>DAILY FOCUS TAGS (Select tags)</span>
          </div>
          <div style={appStyles.tagsGrid}>
            {ALL_TAGS.map(tag => {
              const isSelected = selectedTags.includes(tag.label);
              return (
                <button
                  key={tag.label}
                  onClick={() => handleTagClick(tag.label)}
                  style={{
                    ...appStyles.tagPill,
                    color: isSelected ? tag.color : "#8493AA",
                    borderColor: isSelected ? tag.color : "#1C2842",
                    background: isSelected ? tag.bg : "rgba(18, 26, 43, 0.4)",
                    boxShadow: isSelected ? `0 2px 8px rgba(0,0,0,0.2)` : "none"
                  }}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save Bar */}
        <div style={styles.saveBar}>
          <button style={{ ...styles.saveBtn, background: savedFlash ? "#4ADE80" : "#F2A93B" }} onClick={save}>
            {savedFlash ? <Check size={14} /> : <Save size={14} />}
            {savedFlash ? "Saved Entry" : "Save Log Entry"}
          </button>
          <div style={appStyles.editorFooterWord}>
            {wordCount} word{wordCount === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <div style={styles.divider} />

      {/* Past Log History Section */}
      <div style={styles.historySection}>
        <div style={appStyles.historyHeaderContainer}>
          <div style={styles.sectionLabel}>PAST ENTRIES ({filteredPastDates.length})</div>
          
          <div style={appStyles.filtersContainer}>
            <div style={styles.searchWrapper}>
              <Search size={12} style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search..."
                style={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select
              style={styles.stageFilterDropdown}
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
            >
              <option value="All">All Tags</option>
              {ALL_TAGS.map(t => (
                <option key={t.label} value={t.label}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* History List */}
        {filteredPastDates.length === 0 ? (
          <div style={styles.emptyState}>
            {searchQuery || filterTag !== "All"
              ? "No entries match your search criteria."
              : "Nothing logged yet — entries build up here day by day."}
          </div>
        ) : (
          <div style={styles.historyList}>
            {filteredPastDates.map((key) => {
              const entryText = entries[key] || "";
              const parsed = parseLogEntry(entryText);
              
              // Get metrics for this historical day
              const stats = tasksHistory[key];
              const isFullDay = stats && (
                historyStats => {
                  const d = new Date(key + "T00:00:00");
                  const isWk = d.getDay() === 0 || d.getDay() === 6;
                  const count = (historyStats.dsa ? 1 : 0) + 
                                (historyStats.apps ? 1 : 0) + 
                                (historyStats.learn ? 1 : 0) + 
                                (historyStats.review ? 1 : 0) +
                                (historyStats.project ? 1 : 0) +
                                (historyStats.recap ? 1 : 0);
                  const total = isWk ? 2 : 4;
                  return count === total;
                }
              )(stats);

              // Build content snippet for preview
              let snippetText = "";
              if (parsed.mode === "guided") {
                snippetText = parsed.accomplished 
                  ? `🏆 ${parsed.accomplished.slice(0, 100)}${parsed.accomplished.length > 100 ? "..." : ""}`
                  : "Accomplishments logged.";
              } else {
                const cleaned = entryText.replace(/#tags:\s*.*\n*/g, "").trim();
                snippetText = cleaned ? `${cleaned.slice(0, 110)}${cleaned.length > 110 ? "..." : ""}` : "No text logged.";
              }

              return (
                <button
                  key={key}
                  onClick={() => loadEntryData(key)}
                  style={{
                    ...styles.historyItem,
                    borderColor: key === selectedDate ? "#38D9C9" : "#1C2842",
                    background: key === selectedDate ? "rgba(56, 217, 201, 0.03)" : "#0E1626"
                  }}
                >
                  <div style={appStyles.historyItemHeader}>
                    <div style={styles.historyDate}>
                      {niceDate(key)}
                      {key === todayKey && <span style={styles.todayTagSmall}>TODAY</span>}
                    </div>
                    
                    {/* Inline Day Metrics Badge */}
                    {stats && (
                      <div style={appStyles.inlineMetrics}>
                        {stats.appsCount > 0 && <span style={appStyles.miniBadge}>💼 {stats.appsCount}</span>}
                        {stats.dsa && <span style={appStyles.miniBadge}>💻 DSA</span>}
                        {isFullDay && <span style={{ ...appStyles.miniBadge, color: "#F2A93B", border: "1px solid rgba(242, 169, 59, 0.3)" }}>⚡ FULL</span>}
                      </div>
                    )}
                  </div>
                  
                  {/* Sneak Preview Text */}
                  <div style={styles.historyText}>{snippetText}</div>

                  {/* Render Tags */}
                  {parsed.tags.length > 0 && (
                    <div style={appStyles.historyItemTags}>
                      {parsed.tags.map(tag => {
                        const config = ALL_TAGS.find(c => c.label === tag) || { color: "#8493AA", bg: "rgba(132, 147, 170, 0.08)" };
                        return (
                          <span 
                            key={tag} 
                            style={{ 
                              ...appStyles.miniTagPill, 
                              color: config.color, 
                              background: config.bg,
                              borderColor: `${config.color}22`
                            }}
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Styled specific to the designer log layout additions
const appStyles = {
  editorMetaRow: {
    display: "flex",
    alignItems: "center",
    gap: 6
  },
  modeToggleRow: {
    display: "flex",
    background: "#121A2B",
    border: "1px solid #1C2842",
    borderRadius: 8,
    padding: "2px",
    gap: 2
  },
  modeBtn: {
    fontSize: 10,
    fontWeight: 600,
    fontFamily: "'IBM Plex Mono', monospace",
    padding: "3px 8px",
    borderRadius: 6,
    transition: "all 0.15s ease"
  },
  statsBanner: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(242, 169, 59, 0.05)",
    border: "1px solid rgba(242, 169, 59, 0.15)",
    borderRadius: 10,
    padding: "8px 12px",
    marginTop: 2,
    marginBottom: 2
  },
  statsBannerText: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10.5,
    color: "#F2A93B"
  },
  guidedForm: {
    display: "flex",
    flexDirection: "column",
    gap: 12
  },
  guidedField: {
    display: "flex",
    flexDirection: "column",
    gap: 6
  },
  fieldLabel: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 12.5,
    fontWeight: 600,
    color: "#E7EDF5",
    display: "flex",
    alignItems: "center"
  },
  freeformForm: {
    width: "100%"
  },
  tagsSection: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    borderTop: "1px solid #1C2842",
    paddingTop: 12,
    marginTop: 4
  },
  tagsLabelRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    color: "#5D8DC1",
    fontWeight: 500
  },
  tagsGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6
  },
  tagPill: {
    fontSize: 11,
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 500,
    padding: "4px 10px",
    borderRadius: 12,
    border: "1px solid",
    cursor: "pointer",
    transition: "all 0.15s ease"
  },
  editorFooterWord: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    color: "#8493AA"
  },
  historyHeaderContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10
  },
  filtersContainer: {
    display: "flex",
    gap: 8,
    alignItems: "center"
  },
  historyItemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%"
  },
  inlineMetrics: {
    display: "flex",
    gap: 4
  },
  miniBadge: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 8.5,
    color: "#8493AA",
    background: "#121A2B",
    border: "1px solid #1C2842",
    borderRadius: 4,
    padding: "1px 5px",
    fontWeight: 600
  },
  historyItemTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 8
  },
  miniTagPill: {
    fontSize: 9.5,
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: 8,
    border: "1px solid"
  }
};

const styles = {
  loading: { minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#8493AA", fontFamily: "'IBM Plex Mono', monospace" },
  header: { marginBottom: 10 },
  eyebrowRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 },
  eyebrow: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: 2, color: "#5D8DC1" },
  syncIndicator: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#38D9C9", background: "rgba(56, 217, 201, 0.1)", padding: "2px 6px", borderRadius: 4 },
  title: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 19, fontWeight: 600, color: "#E7EDF5", margin: "0 0 6px" },
  editorBox: { background: "#0E1626", border: "1px solid #1C2842", borderRadius: 14, padding: "16px 16px 14px", display: "flex", flexDirection: "column", gap: 10 },
  editorHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 },
  editorDate: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#E7EDF5", display: "flex", alignItems: "center" },
  todayTag: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#0A0F1C", background: "#F2A93B", borderRadius: 4, padding: "2px 6px", letterSpacing: 0.5, marginLeft: 8 },
  todayTagSmall: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: "#0A0F1C", background: "#F2A93B", borderRadius: 4, padding: "1px 5px", marginLeft: 8 },
  textarea: { width: "100%", background: "#121A2B", border: "1px solid #1C2842", borderRadius: 10, color: "#E7EDF5", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13.5, lineHeight: 1.6, padding: "12px 14px", resize: "vertical", outline: "none" },
  saveBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 },
  saveBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 7, color: "#0A0F1C", border: "none", borderRadius: 8, padding: "9px 16px", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 12, cursor: "pointer", boxShadow: "0 4px 12px rgba(242, 169, 59, 0.15)" },
  divider: { height: 1, background: "#1C2842", margin: "18px 0 14px" },
  historySection: { display: "flex", flexDirection: "column", gap: 12 },
  sectionLabel: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: 1.5, color: "#5D8DC1" },
  searchWrapper: { position: "relative", width: "180px" },
  searchIcon: { position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#5D8DC1" },
  searchInput: { width: "100%", background: "#0E1626", border: "1px solid #1C2842", borderRadius: 6, color: "#E7EDF5", fontSize: 11.5, padding: "4px 8px 4px 26px", outline: "none", fontFamily: "'IBM Plex Sans', sans-serif" },
  stageFilterDropdown: { background: "#0E1626", border: "1px solid #1C2842", borderRadius: 8, color: "#E7EDF5", fontSize: 13, padding: "8px 10px", outline: "none", fontFamily: "'IBM Plex Sans', sans-serif" },
  emptyState: { fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: "#5D8DC1", fontStyle: "italic", textAlign: "center", padding: "16px 0" },
  historyList: { display: "flex", flexDirection: "column", gap: 10 },
  historyItem: { textAlign: "left", border: "1px solid", borderRadius: 10, padding: "12px 14px", width: "100%", cursor: "pointer", transition: "all 0.15s ease" },
  historyDate: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#F2A93B", marginBottom: 6, display: "flex", alignItems: "center" },
  historyText: { fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#C7D2E0", lineHeight: 1.5, whiteSpace: "pre-wrap" }
};
