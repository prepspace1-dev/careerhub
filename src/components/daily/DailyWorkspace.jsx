import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { csAiTopics } from "../../data/csAiData";
import { LearnTab } from "./LearnTab";
import { TasksTab } from "./TasksTab";
import { DSATab } from "./DSATab";
import { NotesTab } from "./NotesTab";
import { ResourcesTab } from "./ResourcesTab";
import { BookOpen, CheckSquare, Code2, FileText, Link, Clock, Play, Pause, RotateCcw, Columns } from "lucide-react";

export function DailyWorkspace() {
  const { currentDay } = useApp();
  const [activeTab, setActiveTab] = useState("learn");
  const [splitPaneMode, setSplitPaneMode] = useState(false);

  // Pomodoro Focus Timer State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const toggleTimer = () => setTimerActive(!timerActive);
  const resetTimer = () => {
    setTimerActive(false);
    setTimerSeconds(25 * 60);
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const topic = csAiTopics.find((t) => t.day === currentDay) || csAiTopics[0];

  const tabs = [
    { id: "learn", label: "Learn Theory", icon: BookOpen },
    { id: "tasks", label: "Today's Tasks", icon: CheckSquare },
    { id: "dsa", label: "DSA Solver", icon: Code2 },
    { id: "notes", label: "Notes & Reflection", icon: FileText },
    { id: "resources", label: "Resources", icon: Link }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Workspace Header Banner */}
      <div className="glass-card" style={{ padding: "24px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{
                fontSize: "12px",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "9999px",
                background: "rgba(99, 102, 241, 0.15)",
                color: "var(--accent-indigo)"
              }}>
                DAY {currentDay < 10 ? `0${currentDay}` : currentDay} WORKSPACE
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
                {topic.category}
              </span>
            </div>

            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
              {topic.title}
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
              {topic.subtitle}
            </p>
          </div>

          {/* Actions Right: Pomodoro Timer & Split-Pane Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            {/* Split Pane View Toggle */}
            <button
              onClick={() => setSplitPaneMode(!splitPaneMode)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "10px",
                background: splitPaneMode ? "var(--accent-indigo)" : "var(--bg-input)",
                color: splitPaneMode ? "#fff" : "var(--text-secondary)",
                fontSize: "12.5px",
                fontWeight: 700,
                border: "var(--glass-border)"
              }}
              title="Toggle Side-by-Side Split View"
            >
              <Columns size={15} />
              <span>{splitPaneMode ? "Single View" : "Split View"}</span>
            </button>

            {/* Integrated Pomodoro Focus Timer */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 12px",
              borderRadius: "10px",
              background: "var(--bg-input)",
              border: "var(--glass-border)"
            }}>
              <Clock size={15} style={{ color: timerActive ? "var(--accent-emerald)" : "var(--accent-indigo)" }} />
              <span style={{ fontSize: "13px", fontWeight: 800, fontFamily: "var(--mono)", color: "var(--text-primary)", minWidth: "46px" }}>
                {formatTimer(timerSeconds)}
              </span>
              <button
                onClick={toggleTimer}
                style={{
                  color: timerActive ? "var(--accent-amber)" : "var(--accent-emerald)",
                  padding: "2px 4px",
                  display: "flex",
                  alignItems: "center"
                }}
                title={timerActive ? "Pause Timer" : "Start Focus Timer"}
              >
                {timerActive ? <Pause size={15} /> : <Play size={15} />}
              </button>
              <button
                onClick={resetTimer}
                style={{ color: "var(--text-muted)", padding: "2px 4px", display: "flex", alignItems: "center" }}
                title="Reset Timer to 25m"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Buttons (Hidden in Split-Pane mode to simplify view) */}
        {!splitPaneMode && (
          <div style={{ display: "flex", gap: "8px", marginTop: "24px", borderTop: "var(--glass-border)", paddingTop: "16px", overflowX: "auto" }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 16px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                    background: isActive ? "var(--bg-card-hover)" : "transparent",
                    border: isActive ? "1px solid var(--border-glow)" : "1px solid transparent"
                  }}
                >
                  <Icon size={16} style={{ color: isActive ? "var(--accent-indigo)" : "var(--text-muted)" }} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Tab Content Display */}
      {splitPaneMode ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div>
            <LearnTab dayNum={currentDay} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <TasksTab dayNum={currentDay} />
            <NotesTab dayNum={currentDay} />
          </div>
        </div>
      ) : (
        <>
          {activeTab === "learn" && <LearnTab dayNum={currentDay} />}
          {activeTab === "tasks" && <TasksTab dayNum={currentDay} />}
          {activeTab === "dsa" && <DSATab dayNum={currentDay} />}
          {activeTab === "notes" && <NotesTab dayNum={currentDay} />}
          {activeTab === "resources" && <ResourcesTab dayNum={currentDay} />}
        </>
      )}
    </div>
  );
}

