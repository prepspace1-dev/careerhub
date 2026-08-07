import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { dsaProblems } from "../../data/dsaData";
import { csAiTopics } from "../../data/csAiData";
import { projectsData } from "../../data/projectsData";
import { Search, X, Code2, BrainCircuit, Kanban, Calendar } from "lucide-react";

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, setCurrentDay, setActiveTab } = useApp();
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const results = [];

    // Search Days
    for (let i = 1; i <= 30; i++) {
      if (`day ${i}`.includes(q) || `day${i}`.includes(q)) {
        results.push({
          type: "Day",
          title: `Day ${i} Workspace`,
          subtitle: `Jump to Day ${i}`,
          icon: Calendar,
          action: () => {
            setCurrentDay(i);
            setActiveTab("workspace");
          }
        });
      }
    }

    // Search DSA Problems
    dsaProblems.forEach((p) => {
      if (
        p.title.toLowerCase().includes(q) ||
        p.topic.toLowerCase().includes(q) ||
        `leetcode ${p.leetcodeId}`.includes(q) ||
        `#${p.leetcodeId}`.includes(q)
      ) {
        results.push({
          type: "DSA",
          title: `#${p.leetcodeId} ${p.title}`,
          subtitle: `Day ${p.day} · ${p.level} · ${p.topic}`,
          icon: Code2,
          action: () => {
            setCurrentDay(p.day);
            setActiveTab("workspace");
          }
        });
      }
    });

    // Search CS & AI Topics
    csAiTopics.forEach((t) => {
      if (
        t.title.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      ) {
        results.push({
          type: "CS & AI",
          title: t.title,
          subtitle: `Day ${t.day} · ${t.category}`,
          icon: BrainCircuit,
          action: () => {
            setCurrentDay(t.day);
            setActiveTab("workspace");
          }
        });
      }
    });

    // Search Projects
    projectsData.forEach((proj) => {
      if (
        proj.title.toLowerCase().includes(q) ||
        proj.category.toLowerCase().includes(q)
      ) {
        results.push({
          type: "Project",
          title: proj.title,
          subtitle: proj.subtitle,
          icon: Kanban,
          action: () => {
            setActiveTab("projects");
          }
        });
      }
    });

    return results.slice(0, 10); // Limit to top 10 matches
  }, [query, setCurrentDay, setActiveTab]);

  if (!commandPaletteOpen) return null;

  return (
    <div
      onClick={() => setCommandPaletteOpen(false)}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "120px",
        zIndex: 100
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "580px",
          maxHeight: "480px",
          background: "var(--bg-card)",
          border: "var(--glass-border)",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Input Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", borderBottom: "var(--glass-border)" }}>
          <Search size={20} style={{ color: "var(--text-muted)" }} />
          <input
            autoFocus
            type="text"
            placeholder="Type a problem, topic, or 'Day 12'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "16px",
              color: "var(--text-primary)"
            }}
          />
          <button onClick={() => setCommandPaletteOpen(false)} style={{ color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ padding: "12px", overflowY: "auto", flex: 1 }}>
          {searchResults.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
              {query.trim() ? "No matching topics or problems found." : "Start typing to search across 30 days of content..."}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {searchResults.map((res, idx) => {
                const Icon = res.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      res.action();
                      setCommandPaletteOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      textAlign: "left",
                      width: "100%",
                      background: "transparent",
                      transition: "background 0.15s ease"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "var(--bg-input)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent-indigo)"
                    }}>
                      <Icon size={16} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{res.title}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{res.subtitle}</div>
                    </div>
                    <span style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: "var(--bg-input)",
                      color: "var(--text-secondary)"
                    }}>
                      {res.type}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
