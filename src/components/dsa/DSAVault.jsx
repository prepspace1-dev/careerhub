import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { dsaProblems } from "../../data/dsaData";
import { Search, ExternalLink, CheckCircle2, RotateCcw, Circle, X, Sparkles, Lightbulb } from "lucide-react";

export function DSAVault() {
  const { dsaStatus, updateDSAStatus, setCurrentDay, setActiveTab } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [activeProblem, setActiveProblem] = useState(null);
  const [showHint, setShowHint] = useState(false);

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

  const openDrawer = (p) => {
    setActiveProblem(p);
    setShowHint(false);
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative" }}>
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
                <tr key={p.id} style={{ borderBottom: "var(--glass-border)" }} className="hover-lift">
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
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--text-primary)" }}>
                    <button
                      onClick={() => openDrawer(p)}
                      style={{
                        textAlign: "left",
                        color: "var(--text-primary)",
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                      title="Click to view problem details & hints"
                    >
                      <span>{p.title}</span>
                      <Lightbulb size={13} style={{ color: "var(--accent-amber)" }} />
                    </button>
                  </td>
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

      {/* SLIDE-OVER HINT & DETAIL DRAWER MODAL */}
      {activeProblem && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 60,
          display: "flex",
          justifyContent: "flex-end"
        }} onClick={() => setActiveProblem(null)}>
          <div style={{
            width: "440px",
            maxWidth: "90vw",
            height: "100%",
            background: "var(--bg-card)",
            backdropFilter: "blur(20px)",
            borderLeft: "var(--glass-border)",
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            boxShadow: "-10px 0 40px rgba(0,0,0,0.5)",
            overflowY: "auto"
          }} onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent-indigo)" }}>
                Day {activeProblem.day} • LeetCode #{activeProblem.leetcodeId}
              </span>
              <button onClick={() => setActiveProblem(null)} style={{ color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>

            <div>
              <h3 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
                {activeProblem.title}
              </h3>
              <div style={{ display: "flex", gap: "8px" }}>
                <span style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "6px",
                  background: activeProblem.level === "Easy" ? "rgba(16, 185, 129, 0.15)" : activeProblem.level === "Medium" ? "rgba(245, 158, 11, 0.15)" : "rgba(244, 63, 94, 0.15)",
                  color: activeProblem.level === "Easy" ? "var(--accent-emerald)" : activeProblem.level === "Medium" ? "var(--accent-amber)" : "var(--accent-rose)"
                }}>
                  {activeProblem.level}
                </span>
                <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "6px", background: "var(--bg-input)", color: "var(--text-secondary)" }}>
                  {activeProblem.topic}
                </span>
              </div>
            </div>

            {/* Progressive Hint Box */}
            <div style={{
              padding: "16px",
              borderRadius: "12px",
              background: "rgba(245, 158, 11, 0.08)",
              border: "1px solid rgba(245, 158, 11, 0.2)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-amber)", fontWeight: 700, fontSize: "13px", marginBottom: "8px" }}>
                <Lightbulb size={16} />
                <span>Progressive Hint & Pattern Guidance</span>
              </div>

              {showHint ? (
                <p style={{ fontSize: "13.5px", color: "var(--text-primary)", lineHeight: "1.6" }}>
                  {activeProblem.hint}
                </p>
              ) : (
                <button
                  onClick={() => setShowHint(true)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    background: "var(--accent-amber)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "12px",
                    marginTop: "4px"
                  }}
                >
                  <Sparkles size={14} />
                  <span>Reveal Hint 1 (Concept Pattern)</span>
                </button>
              )}
            </div>

            {/* Quick Status Action Buttons */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                UPDATE STATUS
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => updateDSAStatus(activeProblem.id, "Solved")}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "10px",
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    color: "var(--accent-emerald)",
                    fontWeight: 700,
                    fontSize: "12px"
                  }}
                >
                  ✓ Mark Solved
                </button>
                <button
                  onClick={() => updateDSAStatus(activeProblem.id, "Revision Required")}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "10px",
                    background: "rgba(245, 158, 11, 0.15)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    color: "var(--accent-amber)",
                    fontWeight: 700,
                    fontSize: "12px"
                  }}
                >
                  ⚡ Revision Needed
                </button>
              </div>
            </div>

            {/* External Link Button */}
            <a
              href={activeProblem.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))",
                color: "#fff",
                fontWeight: 700,
                fontSize: "13px",
                textDecoration: "none",
                marginTop: "auto"
              }}
            >
              <span>Solve Problem on LeetCode</span>
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

