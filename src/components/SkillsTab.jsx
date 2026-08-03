import React, { useState } from "react";
import { ChevronDown, ChevronUp, ChevronRight, Plus, Sparkles } from "lucide-react";
import { TOPICS, LEVEL_META, computeTopicLevel } from "../data/topics";
import AddProblemModal from "./AddProblemModal";
import TopicDashboard from "./TopicDashboard";
import ConceptDashboard from "./ConceptDashboard";

/**
 * SkillsTab v2 — SDE Product Manager Redesign
 *
 * 1. Collapsible Subject Categories with cute toggle up/down icons.
 * 2. DSA category has Problem Vault logging (LeetCode links, patterns, etc.).
 * 3. Non-DSA categories (Core Java, SQL, CS Fundamentals, Backend) have concept notes & interview cheat sheets.
 * 4. 1-click status pills (Not Started | Learning | Mastered) + full notes editor per topic!
 */
export default function SkillsTab({ 
  active, 
  problems = [], 
  roadmapItems = {}, 
  onPersistProblem, 
  onDeleteProblem,
  onPersistRoadmapItem 
}) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // State to track collapsed status for each category (default: all expanded)
  const [collapsed, setCollapsed] = useState({});

  if (!active) return null;

  const allProblems = problems || [];

  function toggleCategory(catId, e) {
    if (e) e.stopPropagation();
    setCollapsed(prev => ({ ...prev, [catId]: !prev[catId] }));
  }

  function openTopic(topic, category) {
    setSelectedTopic(topic);
    setSelectedCategory(category);
  }

  function closeTopic() {
    setSelectedTopic(null);
    setSelectedCategory(null);
  }

  async function handleSaveProblem(problem) {
    await onPersistProblem(problem);
    setShowAddModal(false);
  }

  // Handle status update for non-DSA subtopics
  async function handleStatusChange(categoryId, subtopicId, newStatus, e) {
    if (e) e.stopPropagation();
    if (onPersistRoadmapItem) {
      const currentNotes = roadmapItems[categoryId]?.[subtopicId]?.notes || "";
      await onPersistRoadmapItem(categoryId, subtopicId, newStatus, currentNotes);
    }
  }

  // Helper to get non-DSA subtopic status
  function getSubtopicStatus(categoryId, subtopicId) {
    const catData = roadmapItems[categoryId];
    if (catData && catData[subtopicId] && catData[subtopicId].status) {
      return catData[subtopicId].status;
    }
    return "not_started";
  }

  // ── Topic Dashboard / Concept Dashboard drill-down ────────────────────────
  if (selectedTopic && selectedCategory) {
    if (selectedCategory.id === "dsa") {
      return (
        <TopicDashboard
          topic={selectedTopic}
          category={selectedCategory}
          problems={allProblems}
          onBack={closeTopic}
          onPersistProblem={onPersistProblem}
          onDeleteProblem={onDeleteProblem}
        />
      );
    } else {
      return (
        <ConceptDashboard
          topic={selectedTopic}
          category={selectedCategory}
          roadmapItems={roadmapItems}
          onBack={closeTopic}
          onPersistRoadmapItem={onPersistRoadmapItem}
        />
      );
    }
  }

  // ── Main Skills View ───────────────────────────────────────────────────────
  return (
    <div className="fade-in">
      {/* Page Header */}
      <div style={s.pageHeader}>
        <div>
          <span style={s.eyebrow}>
            <Sparkles size={11} style={{ marginRight: 4, verticalAlign: "middle" }} />
            LEARNING MAP
          </span>
          <h1 style={s.pageTitle}>Skill & Knowledge Hub</h1>
        </div>

        {/* Quick action: Log DSA problem */}
        <button onClick={() => setShowAddModal(true)} style={s.logBtn}>
          <Plus size={13} /> Log DSA Problem
        </button>
      </div>

      {/* Beginner-friendly subtitle banner */}
      <div style={s.banner}>
        <span style={s.bannerIcon}>🌱</span>
        <div>
          <div style={s.bannerTitle}>Beginner-Friendly Prep Dashboard</div>
          <div style={s.bannerDesc}>
            Track your coding practice under <strong>DSA</strong> and set your learning milestones for <strong>Java, SQL &amp; CS Core</strong> with 1-click status pills!
          </div>
        </div>
      </div>

      {/* Category Accordion / Tree */}
      <div style={s.tree}>
        {Object.values(TOPICS).map(category => {
          const isCollapsed = !!collapsed[category.id];
          const isDSA = category.id === "dsa";

          // Calculate completed items for header
          const totalSubtopics = category.subtopics.length;
          let completedCount = 0;

          if (isDSA) {
            completedCount = category.subtopics.filter(st => {
              const count = allProblems.filter(p => p.topic === st.id && p.status === "solved").length;
              return count > 0;
            }).length;
          } else {
            completedCount = category.subtopics.filter(st => {
              return getSubtopicStatus(category.id, st.id) === "mastered";
            }).length;
          }

          return (
            <div key={category.id} style={s.categoryCard}>
              {/* Collapsible Category Header */}
              <div 
                style={s.catHeader} 
                onClick={(e) => toggleCategory(category.id, e)}
              >
                <div style={s.catLeft}>
                  <span style={{ ...s.catAccent, background: category.color }} />
                  <span style={{ ...s.catTitle, color: category.color }}>
                    {category.icon} {category.fullLabel}
                  </span>
                  <span style={s.catSummary}>
                    {completedCount} of {totalSubtopics} topics completed
                  </span>
                </div>

                {/* Cute toggle icon */}
                <button 
                  style={s.toggleBtn} 
                  onClick={(e) => toggleCategory(category.id, e)}
                  title={isCollapsed ? "Expand section" : "Minimize section"}
                >
                  {isCollapsed ? (
                    <ChevronDown size={16} color="#38D9C9" />
                  ) : (
                    <ChevronUp size={16} color="#8493AA" />
                  )}
                </button>
              </div>

              {/* Subtopic Rows (Rendered when expanded) */}
              {!isCollapsed && (
                <div style={s.subtopicList}>
                  {category.subtopics.map((topic, idx) => {
                    const isLast = idx === category.subtopics.length - 1;

                    // --- DSA Row ---
                    if (isDSA) {
                      const level = computeTopicLevel(topic.id, allProblems);
                      const meta = LEVEL_META[level];
                      const solvedCount = allProblems.filter(p => p.topic === topic.id && p.status === "solved").length;
                      const solvingCount = allProblems.filter(p => p.topic === topic.id && p.status === "solving").length;

                      return (
                        <div
                          key={topic.id}
                          onClick={() => openTopic(topic, category)}
                          style={{
                            ...s.topicRow,
                            borderBottom: isLast ? "none" : "1px solid #0D1526",
                          }}
                          className="clickable-row"
                        >
                          {/* Level Dot */}
                          <span style={{
                            ...s.levelDot,
                            background: meta.color,
                            boxShadow: level > 0 ? `0 0 8px ${meta.color}88` : "none",
                          }} />

                          {/* Topic Name */}
                          <div style={s.topicTextWrap}>
                            <span style={s.topicLabel}>{topic.label}</span>
                            {solvedCount > 0 && (
                              <span style={s.solvedTag}>
                                ✓ {solvedCount} {solvedCount === 1 ? "problem" : "problems"}
                              </span>
                            )}
                          </div>

                          {/* In Progress Tag */}
                          {solvingCount > 0 && (
                            <span style={s.solvingBadge}>{solvingCount} solving</span>
                          )}

                          {/* Level Chip */}
                          <span style={{
                            ...s.levelChip,
                            background: meta.bgColor,
                            color: meta.color,
                          }}>
                            {meta.label}
                          </span>

                          <ChevronRight size={14} color="#3A4560" />
                        </div>
                      );
                    }

                    // --- Non-DSA Row (Java, SQL, CS Core, Backend) ---
                    const currentStatus = getSubtopicStatus(category.id, topic.id);
                    const topicNotes = roadmapItems[category.id]?.[topic.id]?.notes || "";

                    return (
                      <div
                        key={topic.id}
                        onClick={() => openTopic(topic, category)}
                        style={{
                          ...s.topicRow,
                          borderBottom: isLast ? "none" : "1px solid #0D1526",
                          cursor: "pointer",
                        }}
                      >
                        {/* Status Icon */}
                        <span style={{
                          ...s.levelDot,
                          background: currentStatus === "mastered" ? "#4ADE80" : currentStatus === "learning" ? "#F2A93B" : "#2A3448",
                          boxShadow: currentStatus === "mastered" ? "0 0 8px rgba(74,222,128,0.5)" : "none",
                        }} />

                        {/* Topic Name */}
                        <div style={s.topicTextWrap}>
                          <span style={{ ...s.topicLabel, color: currentStatus === "mastered" ? "#E7EDF5" : "#A6B4C9" }}>
                            {topic.label}
                          </span>
                          {topicNotes && (
                            <span style={s.notesIndicatorTag} title="Has notes">
                              📝 Notes
                            </span>
                          )}
                        </div>

                        {/* Interactive Status Pills */}
                        <div style={s.statusPillGroup}>
                          <button
                            onClick={(e) => handleStatusChange(category.id, topic.id, "not_started", e)}
                            style={{
                              ...s.pillBtn,
                              background: currentStatus === "not_started" ? "rgba(42,52,72,0.5)" : "transparent",
                              color: currentStatus === "not_started" ? "#8493AA" : "#3A4560",
                              borderColor: currentStatus === "not_started" ? "#5D8DC1" : "#1C2842",
                            }}
                          >
                            Not Started
                          </button>

                          <button
                            onClick={(e) => handleStatusChange(category.id, topic.id, "learning", e)}
                            style={{
                              ...s.pillBtn,
                              background: currentStatus === "learning" ? "rgba(242,169,59,0.15)" : "transparent",
                              color: currentStatus === "learning" ? "#F2A93B" : "#3A4560",
                              borderColor: currentStatus === "learning" ? "#F2A93B" : "#1C2842",
                            }}
                          >
                            📖 Learning
                          </button>

                          <button
                            onClick={(e) => handleStatusChange(category.id, topic.id, "mastered", e)}
                            style={{
                              ...s.pillBtn,
                              background: currentStatus === "mastered" ? "rgba(74,222,128,0.15)" : "transparent",
                              color: currentStatus === "mastered" ? "#4ADE80" : "#3A4560",
                              borderColor: currentStatus === "mastered" ? "#4ADE80" : "#1C2842",
                              fontWeight: currentStatus === "mastered" ? 700 : 500,
                            }}
                          >
                            ✓ Mastered
                          </button>
                        </div>

                        <ChevronRight size={14} color="#3A4560" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
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
    boxShadow: "0 2px 14px rgba(56,217,201,0.25)", cursor: "pointer",
  },
  banner: {
    display: "flex", alignItems: "center", gap: 14,
    background: "rgba(18,26,43,0.45)", border: "1px solid #1C2842",
    borderRadius: 14, padding: "14px 18px", marginBottom: 20,
  },
  bannerIcon: { fontSize: 22, flexShrink: 0 },
  bannerTitle: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, fontWeight: 700,
    color: "#E7EDF5", marginBottom: 2,
  },
  bannerDesc: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#8493AA",
    lineHeight: 1.4,
  },
  tree: { display: "flex", flexDirection: "column", gap: 14 },
  categoryCard: {
    background: "rgba(14,22,38,0.55)",
    border: "1px solid #1C2842",
    borderRadius: 16, overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  },
  catHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 18px", background: "rgba(18,26,43,0.6)",
    cursor: "pointer", userSelect: "none",
    transition: "background 0.15s ease",
  },
  catLeft: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  catAccent: { width: 4, height: 18, borderRadius: 2, flexShrink: 0 },
  catTitle: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 13.5, fontWeight: 700,
  },
  catSummary: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: "#5D8DC1",
    marginLeft: 6,
  },
  toggleBtn: {
    background: "rgba(28,40,66,0.5)", border: "1px solid #1C2842",
    borderRadius: 8, padding: "4px 8px", display: "flex", alignItems: "center",
    cursor: "pointer", transition: "all 0.15s ease",
  },
  subtopicList: { display: "flex", flexDirection: "column" },
  topicRow: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "12px 18px", width: "100%", textAlign: "left",
    background: "transparent", transition: "background 0.12s ease",
  },
  topicTextWrap: { display: "flex", alignItems: "center", gap: 8, flex: 1 },
  levelDot: {
    width: 9, height: 9, borderRadius: "50%", flexShrink: 0,
  },
  topicLabel: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 13.5, fontWeight: 500, color: "#E7EDF5", flex: 1,
  },
  solvedTag: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#4ADE80",
    background: "rgba(74,222,128,0.1)", padding: "1px 7px", borderRadius: 6,
  },
  notesIndicatorTag: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#38D9C9",
    background: "rgba(56,217,201,0.1)", padding: "1px 7px", borderRadius: 6,
  },
  solvingBadge: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 600,
    background: "rgba(242,169,59,0.12)", color: "#F2A93B",
    padding: "2px 8px", borderRadius: 8, flexShrink: 0,
  },
  levelChip: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 700,
    padding: "3px 10px", borderRadius: 10, flexShrink: 0,
  },
  statusPillGroup: { display: "flex", gap: 6, flexShrink: 0, flexWrap: "wrap" },
  pillBtn: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5,
    padding: "3px 10px", borderRadius: 14, border: "1px solid",
    cursor: "pointer", transition: "all 0.15s ease", whiteSpace: "nowrap",
  },
};
