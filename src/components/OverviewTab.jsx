import React from "react";
import { Zap, Briefcase, Award, TrendingUp, Calendar, ArrowRight, Clipboard, Star } from "lucide-react";
import { niceDate } from "../utils";

export default function OverviewTab({ active, tasksHistory, skills, interviews, logs, onNavigateToTab }) {
  const history = tasksHistory || {};
  const skillMap = skills || {};
  const interviewList = interviews || [];
  const logEntries = logs || {};

  // 1. Calculate Streak (dynamic helper)
  const streak = (() => {
    const today = new Date();
    let count = 0;
    let checkDate = new Date(today);
    
    // Check up to 30 days back
    for (let i = 0; i < 30; i++) {
      const off = checkDate.getTimezoneOffset();
      const local = new Date(checkDate.getTime() - off * 60000);
      const key = local.toISOString().slice(0, 10);
      const dayData = history[key];
      
      const dayNum = checkDate.getDay();
      const isWk = dayNum === 0 || dayNum === 6;
      const requiredKeys = isWk ? ["project", "recap"] : ["dsa", "apps", "learn", "review"];
      
      const hasData = dayData && requiredKeys.every(k => !!dayData[k]);
      
      if (hasData) {
        count++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // If checking today and it's not complete, check yesterday to preserve streak
        if (i === 0) {
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
        break;
      }
    }
    return count;
  })();

  // 2. DSA Problems Count
  const dsaCount = Object.values(history).filter(d => !!d.dsa).length;

  // 3. Skill Readiness Level (% of skills at Level 2/Comfortable or Level 3/Strong)
  const skillReadiness = (() => {
    const values = Object.values(skillMap);
    if (!values.length) return 0;
    const readyCount = values.filter(v => v >= 2).length;
    return Math.round((readyCount / values.length) * 100);
  })();

  // 4. Interview Pipeline Stats
  const activePipelines = interviewList.filter(item => item.stage !== "Rejected").length;
  const upcomingInterviews = interviewList
    .filter(item => item.stage === "Interview scheduled" || item.stage === "Interviewed")
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  // 5. Dynamic Daily Focus Prompt (PM Recommendations)
  const getDailyFocus = () => {
    const day = new Date().getDay();
    const recommendations = [
      {
        day: "Sunday",
        focus: "Recap & Retro",
        desc: "Review your DSA logs, explain the week's concepts out loud to test mastery, and plan your target goals for the upcoming sprint week."
      },
      {
        day: "Monday",
        focus: "Weekly Kickoff",
        desc: "Target 3-5 tailored recruiter applications, study a new core data structure, and kick off your weekday DSA streak cold."
      },
      {
        day: "Tuesday",
        focus: "Core Concepts & Code",
        desc: "Solve a medium DSA problem on trees/graphs, write code for your personal project, and review yesterday's problem cold."
      },
      {
        day: "Wednesday",
        focus: "Midweek Pipeline Check",
        desc: "Follow up on pending applications, close out 1 DSA recursion problem, and review REST API or Spring Boot concepts."
      },
      {
        day: "Thursday",
        focus: "Database & System Design",
        desc: "Learn SQL joins/indexes or OS fundamentals, apply to 3 roles, and re-solve your weekday DSA problem list cold."
      },
      {
        day: "Friday",
        focus: "Weekly Closeout",
        desc: "Consolidate your logs, run a concepts review, send final applications, and complete your evening review circuit."
      },
      {
        day: "Saturday",
        focus: "Project Ship Day",
        desc: "Focus purely on shipping a concrete feature for your inventory, RAG, or UPI project. Avoid starting new code, just extend!"
      }
    ];
    return recommendations[day];
  };

  const todayFocus = getDailyFocus();

  // 6. Recent Logs Preview
  const recentLogs = Object.keys(logEntries)
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 2)
    .map(key => ({
      date: key,
      text: logEntries[key]
    }));

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
          <span className="stat-card-footer">Active circuit loops</span>
        </div>

        <div className="stat-card" style={{ borderLeft: "4px solid var(--teal)" }}>
          <div className="stat-card-header">
            <span className="stat-card-label">DSA Mastered</span>
            <Award size={14} color="var(--teal)" />
          </div>
          <span className="stat-card-value">{dsaCount} Problems</span>
          <span className="stat-card-footer">Solved & explained cold</span>
        </div>

        <div className="stat-card" style={{ borderLeft: "4px solid var(--green)" }}>
          <div className="stat-card-header">
            <span className="stat-card-label">Job Readiness</span>
            <TrendingUp size={14} color="var(--green)" />
          </div>
          <span className="stat-card-value">{skillReadiness}%</span>
          <span className="stat-card-footer">Skills comfortable+</span>
        </div>

        <div className="stat-card" style={{ borderLeft: "4px solid var(--blue)" }}>
          <div className="stat-card-header">
            <span className="stat-card-label">Active Pipes</span>
            <Briefcase size={14} color="var(--blue)" />
          </div>
          <span className="stat-card-value">{activePipelines} Roles</span>
          <span className="stat-card-footer">Excluding rejections</span>
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
            <button 
              onClick={() => onNavigateToTab("tasks")} 
              style={styles.actionBtn}
            >
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
              <div style={styles.emptyState}>No interviews scheduled. Get applying!</div>
            )}
          </div>
          <div style={styles.cardActions}>
            <button 
              onClick={() => onNavigateToTab("interviews")} 
              style={styles.actionBtn}
            >
              Manage Pipeline <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Worklogs */}
      <div style={styles.cardBox}>
        <div style={styles.cardHeader}>
          <Clipboard size={16} color="var(--blue)" />
          <h2 style={styles.cardTitle}>Recent Dev Logs</h2>
        </div>
        <div style={styles.logsBody}>
          {recentLogs.length > 0 ? (
            <div style={styles.logsList}>
              {recentLogs.map((log) => (
                <div key={log.date} style={styles.logItem}>
                  <span style={styles.logDate}>{niceDate(log.date)}</span>
                  <p style={styles.logText}>
                    {log.text.replace(/#tags:\s*.*\n*/g, "").substring(0, 100)}
                    {log.text.length > 100 ? "..." : ""}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>No logs written yet for this period.</div>
          )}
        </div>
        <div style={styles.cardActions}>
          <button 
            onClick={() => onNavigateToTab("log")} 
            style={styles.actionBtn}
          >
            Open Logs <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    marginBottom: 24,
    textAlign: "left"
  },
  eyebrow: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    letterSpacing: 2,
    color: "#5D8DC1",
    display: "block",
    marginBottom: 6
  },
  title: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 22,
    fontWeight: 600,
    color: "#E7EDF5",
    margin: 0
  },
  cardBox: {
    background: "#0E1626",
    border: "1px solid #1C2842",
    borderRadius: 18,
    padding: "20px 22px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    textAlign: "left"
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    borderBottom: "1px solid #1C2842",
    paddingBottom: 12
  },
  cardTitle: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 13.5,
    fontWeight: 600,
    color: "#E7EDF5",
    margin: 0
  },
  recommendationBody: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    flexGrow: 1
  },
  focusLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 13,
    fontWeight: 700,
    color: "#E7EDF5"
  },
  focusDesc: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 13,
    color: "#8493AA",
    lineHeight: 1.55
  },
  timelineBody: {
    flexGrow: 1
  },
  emptyState: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 12.5,
    color: "#5D8DC1",
    fontStyle: "italic",
    padding: "16px 0"
  },
  actionBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "var(--teal)",
    fontSize: 11.5,
    fontWeight: 600,
    fontFamily: "'IBM Plex Mono', monospace",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    alignSelf: "flex-start"
  },
  logsBody: {
    flexGrow: 1
  },
  logsList: {
    display: "flex",
    flexDirection: "column",
    gap: 12
  },
  logItem: {
    borderLeft: "2px solid #1C2842",
    paddingLeft: 12
  },
  logDate: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    color: "#F2A93B",
    display: "block",
    marginBottom: 4
  },
  logText: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 12.5,
    color: "#C7D2E0",
    lineHeight: 1.5,
    margin: 0
  },
  cardActions: {
    marginTop: "auto",
    paddingTop: 12,
    borderTop: "1px dashed #192235"
  }
};
