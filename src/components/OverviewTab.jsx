import React from "react";
import { Zap, Briefcase, Award, TrendingUp, Calendar, ArrowRight, Star, Map, Database, Building2, BookOpen, FolderKanban } from "lucide-react";
import { niceDate } from "../utils";
import { ROADMAPS } from "../data/roadmaps";

export default function OverviewTab({
  active,
  tasksHistory,
  interviews,
  projects = [],
  problems = [],
  roadmapItems = {},
  onNavigateToTab,
}) {
  const history = tasksHistory || {};
  const interviewList = interviews || [];

  // 1. Calculate Streak
  const streak = (() => {
    const today = new Date();
    let count = 0;
    let checkDate = new Date(today);

    for (let i = 0; i < 30; i++) {
      const off = checkDate.getTimezoneOffset();
      const local = new Date(checkDate.getTime() - off * 60000);
      const key = local.toISOString().slice(0, 10);
      const dayData = history[key];

      const dayNum = checkDate.getDay();
      const isWk = dayNum === 0 || dayNum === 6;
      const requiredKeys = isWk ? ["project", "recap"] : ["dsa", "apps", "learn", "review"];

      const hasData = dayData && requiredKeys.every((k) => !!dayData[k]);

      if (hasData) {
        count++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        if (i === 0) {
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
        break;
      }
    }
    return count;
  })();

  // 2. Real DSA Problems Solved Count from problems v2 state
  const solvedProblems = (problems || []).filter((p) => p.status === "solved");
  const solvedCount = solvedProblems.length;

  // 3. Curriculum Roadmap Progress across all 6 tracks
  const overallRoadmapProgress = (() => {
    const allRoadmapTracks = Object.values(ROADMAPS);
    const allItems = allRoadmapTracks.flatMap((rm) => rm.sections.flatMap((s) => s.items));
    if (allItems.length === 0) return 0;

    let done = 0;
    allRoadmapTracks.forEach((rm) => {
      const savedTrack = roadmapItems[rm.id] || {};
      rm.sections.forEach((sec) => {
        sec.items.forEach((item) => {
          if (savedTrack[item.id]?.status === "mastered") done++;
        });
      });
    });

    return Math.round((done / allItems.length) * 100);
  })();

  // 4. Interview Pipeline Stats
  const activePipelines = interviewList.filter((item) => item.stage !== "Rejected").length;
  const upcomingInterviews = interviewList
    .filter((item) => item.stage === "Interview scheduled" || item.stage === "Interviewed")
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  // 5. Daily Focus Prompt
  const getDailyFocus = () => {
    const day = new Date().getDay();
    const recommendations = [
      {
        day: "Sunday",
        focus: "Recap & Retro",
        desc: "Review your DSA logs, explain the week's concepts out loud to test mastery, and plan your target goals for the upcoming sprint week.",
      },
      {
        day: "Monday",
        focus: "Weekly Kickoff",
        desc: "Target 3-5 tailored recruiter applications, study a new core data structure, and kick off your weekday DSA streak cold.",
      },
      {
        day: "Tuesday",
        focus: "Core Concepts & Code",
        desc: "Solve a medium DSA problem on trees/graphs, write code for your personal project, and review yesterday's problem cold.",
      },
      {
        day: "Wednesday",
        focus: "Midweek Pipeline Check",
        desc: "Follow up on pending applications, close out 1 DSA recursion problem, and review REST API or Spring Boot concepts.",
      },
      {
        day: "Thursday",
        focus: "Database & System Design",
        desc: "Learn SQL joins/indexes or OS fundamentals, apply to 3 roles, and re-solve your weekday DSA problem list cold.",
      },
      {
        day: "Friday",
        focus: "Weekly Closeout",
        desc: "Consolidate your logs, run a concepts review, send final applications, and complete your evening review circuit.",
      },
      {
        day: "Saturday",
        focus: "Project Ship Day",
        desc: "Focus purely on shipping a concrete feature for your inventory, RAG, or UPI project. Avoid starting new code, just extend!",
      },
    ];
    return recommendations[day];
  };

  const todayFocus = getDailyFocus();

  return (
    <div style={{ display: active ? "block" : "none" }} className="fade-in">
      {/* Title */}
      <div style={styles.header}>
        <span style={styles.eyebrow}>CAREER COCKPIT</span>
        <h1 style={styles.title}>Developer Command Center</h1>
      </div>

      {/* Stats Widgets Row */}
      <div className="overview-grid stats-row" style={{ marginBottom: 24 }}>
        <div className="stat-card" style={{ borderLeft: "4px solid var(--yellow)" }}>
          <div className="stat-card-header">
            <span className="stat-card-label">Daily Streak</span>
            <Zap size={14} color="var(--yellow)" fill="var(--yellow)" />
          </div>
          <span className="stat-card-value">{streak} Days</span>
          <span className="stat-card-footer">Active daily tasks</span>
        </div>

        <div className="stat-card" style={{ borderLeft: "4px solid var(--teal)" }}>
          <div className="stat-card-header">
            <span className="stat-card-label">DSA Mastered</span>
            <Award size={14} color="var(--teal)" />
          </div>
          <span className="stat-card-value">{solvedCount} Problems</span>
          <span className="stat-card-footer">Solved &amp; logged</span>
        </div>

        <div className="stat-card" style={{ borderLeft: "4px solid var(--green)" }}>
          <div className="stat-card-header">
            <span className="stat-card-label">Curriculum Done</span>
            <TrendingUp size={14} color="var(--green)" />
          </div>
          <span className="stat-card-value">{overallRoadmapProgress}%</span>
          <span className="stat-card-footer">Across all 6 roadmaps</span>
        </div>

        <div className="stat-card" style={{ borderLeft: "4px solid var(--blue)" }}>
          <div className="stat-card-header">
            <span className="stat-card-label">Active Pipes</span>
            <Briefcase size={14} color="var(--blue)" />
          </div>
          <span className="stat-card-value">{activePipelines} Roles</span>
          <span className="stat-card-footer">Interview pipeline</span>
        </div>
      </div>

      {/* Quick Launchpad Hub */}
      <div style={styles.launchpadContainer}>
        <div style={styles.launchpadTitle}>⚡ Quick Navigation Launchpad</div>
        <div style={styles.launchpadGrid}>
          <button onClick={() => onNavigateToTab("skills")} style={styles.launchBtn}>
            <BookOpen size={14} color="#38D9C9" /> Skills Map
          </button>
          <button onClick={() => onNavigateToTab("roadmaps")} style={styles.launchBtn}>
            <Map size={14} color="#4ADE80" /> Roadmaps
          </button>
          <button onClick={() => onNavigateToTab("problems")} style={styles.launchBtn}>
            <Database size={14} color="#F2A93B" /> Problem Vault
          </button>
          <button onClick={() => onNavigateToTab("companies")} style={styles.launchBtn}>
            <Building2 size={14} color="#60A5FA" /> Company Packs
          </button>
          <button onClick={() => onNavigateToTab("projects")} style={styles.launchBtn}>
            <FolderKanban size={14} color="#F2A93B" /> Projects Studio
          </button>
        </div>
      </div>

      {/* Main Grid: Focus & Timelines */}
      <div className="overview-grid" style={{ marginBottom: 24 }}>
        {/* PM Focus Recommendation */}
        <div style={styles.cardBox}>
          <div style={styles.cardHeader}>
            <Star size={16} color="var(--yellow)" fill="var(--yellow)" />
            <h2 style={styles.cardTitle}>PM Daily Recommendations</h2>
          </div>
          <div style={styles.recommendationBody}>
            <div style={styles.focusLabel}>
              {todayFocus.day} Focus: <span style={{ color: "var(--yellow)" }}>{todayFocus.focus}</span>
            </div>
            <p style={styles.focusDesc}>{todayFocus.desc}</p>
          </div>
          <div style={styles.cardActions}>
            <button onClick={() => onNavigateToTab("tasks")} style={styles.actionBtn}>
              Start Checklist <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Upcoming Interview Timeline */}
        <div style={styles.cardBox}>
          <div style={styles.cardHeader}>
            <Calendar size={16} color="var(--teal)" />
            <h2 style={styles.cardTitle}>Upcoming Schedule</h2>
          </div>
          <div style={styles.timelineBody}>
            {upcomingInterviews.length > 0 ? (
              <div className="timeline-container">
                {upcomingInterviews.map((item) => (
                  <div
                    key={item.id}
                    className={`timeline-node ${item.stage === "Interview scheduled" ? "orange" : ""}`}
                  >
                    <div className="timeline-node-time">{niceDate(item.date)}</div>
                    <div className="timeline-node-title">{item.company}</div>
                    <div className="timeline-node-desc">Stage: {item.stage}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>No interviews scheduled yet. Log upcoming interviews in the Interviews tab!</div>
            )}
          </div>
          <div style={styles.cardActions}>
            <button onClick={() => onNavigateToTab("interviews")} style={styles.actionBtn}>
              Manage Pipeline <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Projects Studio */}
      <div style={styles.cardBox}>
        <div style={styles.cardHeader}>
          <FolderKanban size={16} color="#38D9C9" />
          <h2 style={styles.cardTitle}>Portfolio Projects Studio</h2>
        </div>
        <div style={styles.logsBody}>
          {projects.length > 0 ? (
            <div style={styles.logsList}>
              {projects.slice(0, 2).map((proj) => (
                <div key={proj.id} style={styles.logItem}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: "#E7EDF5", fontSize: 13 }}>
                      {proj.title}
                    </span>
                    <span style={{ fontSize: 10, color: "#38D9C9", background: "rgba(56, 217, 201, 0.12)", padding: "2px 8px", borderRadius: 10 }}>
                      {proj.phase || "Building"}
                    </span>
                  </div>
                  <p style={{ ...styles.logText, marginTop: 4 }}>
                    {proj.tagline || proj.category || "SDE Portfolio Project"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>No portfolio projects added yet.</div>
          )}
        </div>
        <div style={styles.cardActions}>
          <button onClick={() => onNavigateToTab("projects")} style={styles.actionBtn}>
            Projects Studio <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: { marginBottom: 24, textAlign: "left" },
  eyebrow: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: 2,
    color: "#5D8DC1", display: "block", marginBottom: 6,
  },
  title: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, fontWeight: 600,
    color: "#E7EDF5", margin: 0,
  },
  launchpadContainer: {
    background: "rgba(14,22,38,0.55)", border: "1px solid #1C2842",
    borderRadius: 16, padding: "16px 20px", marginBottom: 24,
  },
  launchpadTitle: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, fontWeight: 700,
    color: "#5D8DC1", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12,
  },
  launchpadGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10,
  },
  launchBtn: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, fontWeight: 600,
    background: "rgba(18,26,43,0.6)", border: "1px solid #1C2842", borderRadius: 10,
    color: "#E7EDF5", padding: "10px 14px", display: "flex", alignItems: "center",
    gap: 8, cursor: "pointer", transition: "all 0.15s ease",
  },
  cardBox: {
    background: "#0E1626", border: "1px solid #1C2842", borderRadius: 18,
    padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16,
    textAlign: "left",
  },
  cardHeader: {
    display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #1C2842",
    paddingBottom: 12,
  },
  cardTitle: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 13.5, fontWeight: 600,
    color: "#E7EDF5", margin: 0,
  },
  recommendationBody: {
    display: "flex", flexDirection: "column", gap: 8, flexGrow: 1,
  },
  focusLabel: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 700,
    color: "#E7EDF5",
  },
  focusDesc: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#8493AA",
    lineHeight: 1.55,
  },
  timelineBody: { flexGrow: 1 },
  emptyState: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: "#5D8DC1",
    fontStyle: "italic", padding: "16px 0",
  },
  actionBtn: {
    display: "flex", alignItems: "center", gap: 6, color: "var(--teal)",
    fontSize: 11.5, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace",
    background: "none", border: "none", cursor: "pointer", padding: 0,
    alignSelf: "flex-start",
  },
  logsBody: { flexGrow: 1 },
  logsList: { display: "flex", flexDirection: "column", gap: 12 },
  logItem: { borderLeft: "2px solid #1C2842", paddingLeft: 12 },
  logDate: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#F2A93B",
    display: "block", marginBottom: 4,
  },
  logText: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: "#C7D2E0",
    lineHeight: 1.5, margin: 0,
  },
  cardActions: {
    marginTop: "auto", paddingTop: 12, borderTop: "1px dashed #192235",
  },
};
