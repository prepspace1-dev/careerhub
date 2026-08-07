import React from "react";
import { ExternalLink, BookOpen, Video, Code, ShieldCheck } from "lucide-react";

export function ResourcesTab({ dayNum }) {
  const resources = [
    {
      title: "NeetCode 150 Video & Pattern Walkthroughs",
      category: "Video Course",
      icon: Video,
      url: "https://neetcode.io/practice"
    },
    {
      title: "Striver's SDE Sheet Problem Set",
      category: "DSA Sheet",
      icon: Code,
      url: "https://takeuforward.org/strivers-a2zdsa-course/strivers-a2z-dsa-course-sheet-2/"
    },
    {
      title: "MDN Web Docs — JavaScript & Web Standards",
      category: "Official Documentation",
      icon: BookOpen,
      url: "https://developer.mozilla.org/"
    },
    {
      title: "System Design Primer GitHub Repository",
      category: "Reference Guide",
      icon: ShieldCheck,
      url: "https://github.com/donnemartin/system-design-primer"
    }
  ];

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div className="glass-card" style={{ padding: "20px" }}>
        <h4 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
          Curated Learning Resources for Day {dayNum}
        </h4>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
          Hand-picked documentation, video tutorials, and cheatsheets.
        </p>

        <div style={{ display: "grid", gap: "10px" }}>
          {resources.map((r, idx) => {
            const Icon = r.icon;
            return (
              <a
                key={idx}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  background: "var(--bg-input)",
                  border: "var(--glass-border)",
                  textDecoration: "none",
                  transition: "all 0.15s ease"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: "rgba(99, 102, 241, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent-indigo)"
                  }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{r.title}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{r.category}</div>
                  </div>
                </div>
                <ExternalLink size={16} style={{ color: "var(--accent-indigo)" }} />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
