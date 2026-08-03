import React, { useState } from "react";
import { CheckSquare, Square, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { ROADMAPS } from "../data/roadmaps";

/**
 * RoadmapsTab — Structured SDE Learning Paths (Beginner to Top-Notch)
 *
 * 6 Core Tracks: DSA, Java, SQL, Operating Systems, Computer Networks, Spring Boot.
 * Interactive checkable items that persist to Supabase & local storage.
 */
export default function RoadmapsTab({
  active,
  roadmapItems = {},
  onPersistRoadmapItem,
}) {
  const [activeTrackId, setActiveTrackId] = useState("dsa");
  const [collapsedSections, setCollapsedSections] = useState({});

  if (!active) return null;

  const currentRoadmap = ROADMAPS[activeTrackId] || ROADMAPS.dsa;
  const trackSavedItems = roadmapItems[activeTrackId] || {};

  // Compute total items and completed items for the active track
  const allItems = currentRoadmap.sections.flatMap((s) => s.items);
  const totalCount = allItems.length;
  const completedCount = allItems.filter(
    (item) => trackSavedItems[item.id]?.status === "mastered"
  ).length;

  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  function toggleItemCheck(itemId) {
    const isMastered = trackSavedItems[itemId]?.status === "mastered";
    const nextStatus = isMastered ? "not_started" : "mastered";
    const currentNotes = trackSavedItems[itemId]?.notes || "";

    if (onPersistRoadmapItem) {
      onPersistRoadmapItem(activeTrackId, itemId, nextStatus, currentNotes);
    }
  }

  function toggleSection(sectionId) {
    setCollapsedSections((prev) => ({
      ...prev,
      [`${activeTrackId}_${sectionId}`]: !prev[`${activeTrackId}_${sectionId}`],
    }));
  }

  const trackColor = currentRoadmap.color || "#38D9C9";

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div style={s.pageHeader}>
        <div>
          <span style={s.eyebrow}>
            <Sparkles size={11} style={{ marginRight: 4, verticalAlign: "middle" }} />
            CURRICULUM PATHS
          </span>
          <h1 style={s.pageTitle}>SDE Learning Roadmaps</h1>
        </div>
      </div>

      {/* Beginner-to-Top-Notch Banner */}
      <div style={s.banner}>
        <span style={s.bannerEmoji}>🎯</span>
        <div>
          <div style={s.bannerTitle}>Day 0 to Offer Ready Curriculum</div>
          <div style={s.bannerDesc}>
            Structured step-by-step checklists designed to take you from core fundamentals to production-grade software engineering interviews.
          </div>
        </div>
      </div>

      {/* Track Switcher Pills */}
      <div style={s.trackPillRow}>
        {Object.values(ROADMAPS).map((rm) => {
          const isSelected = rm.id === activeTrackId;
          const rmItems = rm.sections.flatMap((sec) => sec.items);
          const rmDone = rmItems.filter(
            (it) => roadmapItems[rm.id]?.[it.id]?.status === "mastered"
          ).length;

          return (
            <button
              key={rm.id}
              onClick={() => setActiveTrackId(rm.id)}
              style={{
                ...s.trackPill,
                background: isSelected ? `${rm.color}18` : "rgba(18,26,43,0.5)",
                color: isSelected ? rm.color : "#5D8DC1",
                borderColor: isSelected ? rm.color : "#1C2842",
              }}
            >
              <span style={{ fontWeight: 700 }}>{rm.label}</span>
              <span
                style={{
                  ...s.pillBadge,
                  background: isSelected ? `${rm.color}33` : "rgba(42,52,72,0.5)",
                  color: isSelected ? rm.color : "#8493AA",
                }}
              >
                {rmDone}/{rmItems.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Track Header Card */}
      <div style={s.trackCard}>
        <div style={s.trackCardHeader}>
          <div>
            <h2 style={{ ...s.trackTitle, color: trackColor }}>
              {currentRoadmap.label}
            </h2>
            <p style={s.trackDesc}>{currentRoadmap.description}</p>
          </div>

          {/* Progress Ring / Percentage */}
          <div style={s.progressBox}>
            <div style={{ ...s.progressPctText, color: trackColor }}>
              {progressPct}%
            </div>
            <div style={s.progressSubtext}>
              {completedCount} of {totalCount} completed
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={s.progressTrack}>
          <div
            style={{
              ...s.progressFill,
              width: `${progressPct}%`,
              background: trackColor,
            }}
          />
        </div>
      </div>

      {/* Sections and Items Checklist */}
      <div style={s.sectionsList}>
        {currentRoadmap.sections.map((section) => {
          const sectionKey = `${activeTrackId}_${section.id}`;
          const isCollapsed = !!collapsedSections[sectionKey];

          const secDone = section.items.filter(
            (it) => trackSavedItems[it.id]?.status === "mastered"
          ).length;

          return (
            <div key={section.id} style={s.sectionCard}>
              {/* Section Header */}
              <div
                style={s.sectionHeader}
                onClick={() => toggleSection(section.id)}
              >
                <div style={s.sectionHeaderLeft}>
                  <span style={{ ...s.secAccent, background: trackColor }} />
                  <span style={s.sectionTitle}>{section.label}</span>
                  <span style={s.secBadge}>
                    {secDone}/{section.items.length} completed
                  </span>
                </div>

                <button style={s.toggleBtn}>
                  {isCollapsed ? (
                    <ChevronDown size={16} color={trackColor} />
                  ) : (
                    <ChevronUp size={16} color="#8493AA" />
                  )}
                </button>
              </div>

              {/* Section Items Checklist */}
              {!isCollapsed && (
                <div style={s.itemsContainer}>
                  {section.items.map((item, idx) => {
                    const isChecked = trackSavedItems[item.id]?.status === "mastered";
                    const isLast = idx === section.items.length - 1;

                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleItemCheck(item.id)}
                        style={{
                          ...s.itemRow,
                          borderBottom: isLast ? "none" : "1px solid #0D1526",
                          background: isChecked ? "rgba(74,222,128,0.03)" : "transparent",
                        }}
                      >
                        {/* Checkbox Icon */}
                        <button style={s.checkBtn}>
                          {isChecked ? (
                            <CheckSquare size={18} color="#4ADE80" />
                          ) : (
                            <Square size={18} color="#2A3448" />
                          )}
                        </button>

                        {/* Item Info */}
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              ...s.itemTitle,
                              color: isChecked ? "#E7EDF5" : "#C7D2E0",
                              textDecoration: isChecked ? "line-through" : "none",
                              opacity: isChecked ? 0.85 : 1,
                            }}
                          >
                            {item.label}
                          </div>
                          {item.description && (
                            <div style={s.itemDesc}>{item.description}</div>
                          )}
                        </div>

                        {/* Status Badge */}
                        <span
                          style={{
                            ...s.statusBadge,
                            background: isChecked ? "rgba(74,222,128,0.12)" : "rgba(42,52,72,0.4)",
                            color: isChecked ? "#4ADE80" : "#5D8DC1",
                            borderColor: isChecked ? "#4ADE80" : "#1C2842",
                          }}
                        >
                          {isChecked ? "✓ Complete" : "Pending"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
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
  banner: {
    display: "flex", alignItems: "center", gap: 14,
    background: "rgba(18,26,43,0.45)", border: "1px solid #1C2842",
    borderRadius: 14, padding: "14px 18px", marginBottom: 20,
  },
  bannerEmoji: { fontSize: 22, flexShrink: 0 },
  bannerTitle: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, fontWeight: 700,
    color: "#E7EDF5", marginBottom: 2,
  },
  bannerDesc: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#8493AA",
    lineHeight: 1.4,
  },
  trackPillRow: {
    display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20,
  },
  trackPill: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
    padding: "8px 14px", borderRadius: 14, border: "1px solid",
    display: "flex", alignItems: "center", gap: 8,
    cursor: "pointer", transition: "all 0.15s ease",
  },
  pillBadge: {
    fontSize: 9.5, fontWeight: 700, padding: "2px 7px", borderRadius: 10,
  },
  trackCard: {
    background: "rgba(14,22,38,0.65)", border: "1px solid #1C2842",
    borderRadius: 18, padding: "20px 24px", marginBottom: 20,
  },
  trackCardHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    gap: 16, marginBottom: 14, flexWrap: "wrap",
  },
  trackTitle: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 20, fontWeight: 700,
    margin: "0 0 4px 0",
  },
  trackDesc: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: "#8493AA",
    margin: 0,
  },
  progressBox: { display: "flex", flexDirection: "column", alignItems: "flex-end" },
  progressPctText: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 24, fontWeight: 700,
    lineHeight: 1.2,
  },
  progressSubtext: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: "#5D8DC1",
  },
  progressTrack: {
    height: 6, background: "#121A2B", borderRadius: 3, overflow: "hidden",
  },
  progressFill: {
    height: "100%", borderRadius: 3, transition: "width 0.4s ease",
  },
  sectionsList: { display: "flex", flexDirection: "column", gap: 14 },
  sectionCard: {
    background: "rgba(14,22,38,0.55)", border: "1px solid #1C2842",
    borderRadius: 16, overflow: "hidden",
  },
  sectionHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 18px", background: "rgba(18,26,43,0.5)",
    cursor: "pointer", userSelect: "none",
  },
  sectionHeaderLeft: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  secAccent: { width: 4, height: 18, borderRadius: 2, flexShrink: 0 },
  sectionTitle: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 13.5, fontWeight: 700,
    color: "#E7EDF5",
  },
  secBadge: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: "#5D8DC1",
    marginLeft: 6,
  },
  toggleBtn: {
    background: "rgba(28,40,66,0.5)", border: "1px solid #1C2842",
    borderRadius: 8, padding: "4px 8px", display: "flex", alignItems: "center",
    cursor: "pointer",
  },
  itemsContainer: { display: "flex", flexDirection: "column" },
  itemRow: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "12px 18px", cursor: "pointer", transition: "background 0.12s ease",
  },
  checkBtn: {
    background: "none", border: "none", padding: 0, display: "flex",
    alignItems: "center", cursor: "pointer", flexShrink: 0,
  },
  itemTitle: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13.5, fontWeight: 600,
    lineHeight: 1.3,
  },
  itemDesc: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11.5, color: "#8493AA",
    marginTop: 2, lineHeight: 1.3,
  },
  statusBadge: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 600,
    padding: "3px 10px", borderRadius: 12, border: "1px solid",
    flexShrink: 0, whiteSpace: "nowrap",
  },
};
