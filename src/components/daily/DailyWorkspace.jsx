import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { csAiTopics } from "../../data/csAiData";
import { LearnTab } from "./LearnTab";
import { TasksTab } from "./TasksTab";
import { DSATab } from "./DSATab";
import { NotesTab } from "./NotesTab";
import { ResourcesTab } from "./ResourcesTab";
import { BookOpen, CheckSquare, Code2, FileText, Link, Clock } from "lucide-react";

export function DailyWorkspace() {
  const { currentDay } = useApp();
  const [activeTab, setActiveTab] = useState("learn");

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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
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

          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)", fontWeight: 600, padding: "8px 14px", borderRadius: "10px", background: "var(--bg-input)" }}>
            <Clock size={16} style={{ color: "var(--accent-indigo)" }} />
            <span>Est. Time: {topic.timeMinutes || 60} mins</span>
          </div>
        </div>

        {/* Tab Navigation Buttons */}
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
      </div>

      {/* Tab Content Display */}
      {activeTab === "learn" && <LearnTab dayNum={currentDay} />}
      {activeTab === "tasks" && <TasksTab dayNum={currentDay} />}
      {activeTab === "dsa" && <DSATab dayNum={currentDay} />}
      {activeTab === "notes" && <NotesTab dayNum={currentDay} />}
      {activeTab === "resources" && <ResourcesTab dayNum={currentDay} />}
    </div>
  );
}
