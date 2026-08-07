import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { dsaProblems } from "../../data/dsaData";
import { Search, ExternalLink, CheckCircle2, RotateCcw, Circle } from "lucide-react";

export function DSAVault() {
  const { dsaStatus, updateDSAStatus, setCurrentDay, setActiveTab } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredProblems = useMemo(() => {
    return dsaProblems.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `#${p.leetcodeId}`.includes(searchTerm);

      const matchLevel = selectedLevel === "All" || p.level === selectedLevel;

      const currentStatus = dsaStatus[p.id]?.status || "Unsolved";
      const matchStatus = selectedStatus === "All" || currentStatus === selectedStatus;

      return matchSearch && matchLevel && matchStatus;
    });
  }, [searchTerm, selectedLevel, selectedStatus, dsaStatus]);

  const solvedCount = Object.values(dsaStatus).filter((item) => item.status === "Solved").length;

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Vault Header */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)" }}>
              30-Day DSA Mastery Vault
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
              90 Curated Problems from Striver's Sheet & NeetCode 150.
            </p>
          </div>
          <div style={{ padding: "8px 16px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.12)", color: "var(--accent-emerald)", fontWeight: 700, fontSize: "14px" }}>
            {solvedCount} / 90 Solved
          </div>
        </div>

        {/* Filter Bar */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 14px",
            borderRadius: "10px",
            background: "var(--bg-input)",
            border: "var(--glass-border)",
            flex: 1,
            minWidth: "220px"
          }}>
            <Search size={16} style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search problems by name, topic, or LeetCode #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: "transparent", border: "none", outline: "none", fontSize: "13px", color: "var(--text-primary)", width: "100%" }}
            />
          </div>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              background: "var(--bg-input)",
              border: "var(--glass-border)",
              fontSize: "13px",
              color: "var(--text-primary)",
              outline: "none"
            }}
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy (38)</option>
            <option value="Medium">Medium (45)</option>
            <option value="Hard">Hard (7)</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              background: "var(--bg-input)",
              border: "var(--glass-border)",
              fontSize: "13px",
              color: "var(--text-primary)",
              outline: "none"
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Solved">Solved</option>
            <option value="Revision Required">Revision Required</option>
            <option value="Unsolved">Unsolved</option>
          </select>
        </div>
      </div>

      {/* Problems Table */}
      <div className="glass-card" style={{ padding: "8px", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: "var(--glass-border)", color: "var(--text-muted)", fontWeight: 600 }}>
              <th style={{ padding: "12px 16px" }}>Day</th>
              <th style={{ padding: "12px 16px" }}>#</th>
              <th style={{ padding: "12px 16px" }}>Problem Name</th>
              <th style={{ padding: "12px 16px" }}>Topic</th>
              <th style={{ padding: "12px 16px" }}>Level</th>
              <th style={{ padding: "12px 16px" }}>Status</th>
              <th style={{ padding: "12px 16px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProblems.map((p) => {
              const currentStatus = dsaStatus[p.id]?.status || "Unsolved";
              const isSolved = currentStatus === "Solved";
              const isRevision = currentStatus === "Revision Required";

              return (
                <tr key={p.id} style={{ borderBottom: "var(--glass-border)" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--accent-indigo)" }}>
                    <button
                      onClick={() => {
                        setCurrentDay(p.day);
                        setActiveTab("workspace");
                      }}
                      style={{ color: "var(--accent-indigo)", fontWeight: 700 }}
                    >
                      Day {p.day}
                    </button>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>#{p.leetcodeId}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--text-primary)" }}>{p.title}</td>
                  <td style={{ padding: "12px 16px", color: "var(--text-secondary)" }}>{p.topic}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "6px",
                      background: p.level === "Easy" ? "rgba(16, 185, 129, 0.15)" : p.level === "Medium" ? "rgba(245, 158, 11, 0.15)" : "rgba(244, 63, 94, 0.15)",
                      color: p.level === "Easy" ? "var(--accent-emerald)" : p.level === "Medium" ? "var(--accent-amber)" : "var(--accent-rose)"
                    }}>
                      {p.level}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <button
                      onClick={() => updateDSAStatus(p.id, isSolved ? "Unsolved" : "Solved")}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "4px 10px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 700,
                        background: isSolved
                          ? "rgba(16, 185, 129, 0.15)"
                          : isRevision
                          ? "rgba(245, 158, 11, 0.15)"
                          : "var(--bg-input)",
                        color: isSolved
                          ? "var(--accent-emerald)"
                          : isRevision
                          ? "var(--accent-amber)"
                          : "var(--text-muted)",
                        border: isSolved
                          ? "1px solid rgba(16, 185, 129, 0.3)"
                          : isRevision
                          ? "1px solid rgba(245, 158, 11, 0.3)"
                          : "var(--glass-border)"
                      }}
                    >
                      {isSolved ? (
                        <CheckCircle2 size={13} style={{ color: "var(--accent-emerald)" }} />
                      ) : isRevision ? (
                        <RotateCcw size={13} style={{ color: "var(--accent-amber)" }} />
                      ) : (
                        <Circle size={13} style={{ color: "var(--text-muted)" }} />
                      )}
                      <span>{currentStatus}</span>
                    </button>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--accent-indigo)", display: "inline-flex", alignItems: "center", gap: "4px" }}
                    >
                      <span>LeetCode</span>
                      <ExternalLink size={13} />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
