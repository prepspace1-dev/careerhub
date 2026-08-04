import React, { useState, useEffect } from "react";
import { User, Award, GitBranch, Briefcase, Code, Globe, Save, Trash2, RotateCcw, Download, Upload, ShieldCheck, Sparkles, AlertCircle, CheckCircle2, Cpu } from "lucide-react";
import { niceDate } from "../utils";

export default function ProfileTab({
  active,
  user,
  profile = {},
  onSaveProfile,
  trash = [],
  onRestoreFromTrash,
  onPermanentDeleteFromTrash,
  onEmptyTrash,
  // Complete data for backup export / import
  fullAppData = {},
  onImportAppData,
}) {
  // Form States
  const [name, setName] = useState("");
  const [targetRole, setTargetRole] = useState("Full-Stack SDE");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [leetcode, setLeetcode] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");

  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [filterTrashType, setFilterTrashType] = useState("All");

  useEffect(() => {
    setName(profile.name || (user?.email ? user.email.split("@")[0] : "SDE Candidate"));
    setTargetRole(profile.target_role || profile.targetRole || "Full-Stack Software Engineer");
    setGithub(profile.github || "");
    setLinkedin(profile.linkedin || "");
    setLeetcode(profile.leetcode || "");
    setPortfolioUrl(profile.portfolio_url || profile.portfolioUrl || "");
  }, [profile, user]);

  function handleProfileSubmit(e) {
    e.preventDefault();
    const updatedProfile = {
      ...profile,
      name: name.trim(),
      target_role: targetRole.trim(),
      targetRole: targetRole.trim(),
      github: github.trim(),
      linkedin: linkedin.trim(),
      leetcode: leetcode.trim(),
      portfolio_url: portfolioUrl.trim(),
      portfolioUrl: portfolioUrl.trim(),
    };
    onSaveProfile(updatedProfile);
    setSaveSuccessMsg("Profile & preferences updated successfully! ✨");
    setTimeout(() => setSaveSuccessMsg(""), 3500);
  }

  // ── SDE Rank Calculation ───────────────────────────────────────────────────
  const problemsList = fullAppData.problems || [];
  const solvedCount = problemsList.filter((p) => p.status === "solved").length;
  const interviewsList = fullAppData.interviews || [];
  const projectsList = fullAppData.projects || [];
  const shippedProjectsCount = projectsList.filter((p) => p.phase === "Shipped").length;

  let sdeRank = "🌱 Novice Candidate";
  let sdeRankColor = "#A78BFA";
  if (solvedCount >= 75 || shippedProjectsCount >= 5) {
    sdeRank = "🔥 Top-Tier Senior SDE Ready";
    sdeRankColor = "#EF4444";
  } else if (solvedCount >= 30 || shippedProjectsCount >= 2) {
    sdeRank = "🚀 SDE 1 Interview Ready";
    sdeRankColor = "#4ADE80";
  } else if (solvedCount >= 10 || shippedProjectsCount >= 1) {
    sdeRank = "⚡ SDE Apprentice";
    sdeRankColor = "#F2A93B";
  }

  // Filtered Trash
  const filteredTrash = (trash || []).filter((item) => {
    if (filterTrashType === "All") return true;
    return (item.item_type || item.itemType) === filterTrashType;
  });

  // Export JSON Backup
  function handleExportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullAppData, null, 2));
    const downloadAnchor = document.createElement("a");
    const todayStr = new Date().toISOString().split("T")[0];
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `career-hub-backup-${todayStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  // Import JSON Backup
  function handleImportFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed && typeof parsed === "object") {
          onImportAppData(parsed);
          setSaveSuccessMsg("Backup restored successfully!");
          setTimeout(() => setSaveSuccessMsg(""), 3500);
        }
      } catch {
        alert("Invalid JSON backup file format.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div style={{ display: active ? "block" : "none" }} className="fade-in">
      {/* Header Banner */}
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrowRow}>
            <span style={styles.eyebrow}>DEVELOPER CONTROL CENTER</span>
          </div>
          <h1 style={styles.title}>User Profile &amp; Settings</h1>
          <p style={styles.subtitle}>
            Manage your SDE candidate profile, social links, career rank, data backups, and Recycle Bin.
          </p>
        </div>

        <div style={{ ...styles.rankBadge, borderColor: sdeRankColor, color: sdeRankColor }}>
          <Sparkles size={14} color={sdeRankColor} />
          {sdeRank}
        </div>
      </div>

      {/* Grid: Left Column Profile Form / Right Column Stats & Backup */}
      <div style={styles.mainGrid}>
        {/* Left Card: Candidate Identity & Links */}
        <div style={styles.cardBox}>
          <div style={styles.cardHeader}>
            <User size={18} color="#38D9C9" />
            <h2 style={styles.cardTitle}>Candidate Profile &amp; Handles</h2>
          </div>

          <form onSubmit={handleProfileSubmit} style={styles.form}>
            {saveSuccessMsg && (
              <div style={styles.successToast}>
                <CheckCircle2 size={15} color="#4ADE80" />
                {saveSuccessMsg}
              </div>
            )}

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Target SDE Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full-Stack SDE / Backend Infrastructure"
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <GitBranch size={13} style={{ marginRight: 4, display: "inline" }} />
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/your-username"
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <Briefcase size={13} style={{ marginRight: 4, display: "inline" }} />
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/your-username"
                style={styles.input}
              />
            </div>

            <div style={styles.row}>
              <div style={{ ...styles.fieldGroup, flex: 1 }}>
                <label style={styles.label}>
                  <Code size={13} style={{ marginRight: 4, display: "inline" }} />
                  LeetCode Handle
                </label>
                <input
                  type="text"
                  value={leetcode}
                  onChange={(e) => setLeetcode(e.target.value)}
                  placeholder="e.g. leetcode_pro"
                  style={styles.input}
                />
              </div>

              <div style={{ ...styles.fieldGroup, flex: 1 }}>
                <label style={styles.label}>
                  <Globe size={13} style={{ marginRight: 4, display: "inline" }} />
                  Portfolio Site URL
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://myportfolio.dev"
                  style={styles.input}
                />
              </div>
            </div>

            <button type="submit" style={styles.saveBtn}>
              <Save size={15} /> Save Profile &amp; Preferences
            </button>
          </form>
        </div>

        {/* Right Column: Career Benchmarks & Data Backup */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Career Benchmarks */}
          <div style={styles.cardBox}>
            <div style={styles.cardHeader}>
              <Award size={18} color="#F2A93B" />
              <h2 style={styles.cardTitle}>Career Metrics &amp; Benchmarks</h2>
            </div>

            <div style={styles.statsGrid}>
              <div style={styles.statTile}>
                <div style={styles.statNum}>{solvedCount}</div>
                <div style={styles.statName}>DSA Solved</div>
              </div>
              <div style={styles.statTile}>
                <div style={styles.statNum}>{interviewsList.length}</div>
                <div style={styles.statName}>Job Apps</div>
              </div>
              <div style={styles.statTile}>
                <div style={styles.statNum}>{shippedProjectsCount}</div>
                <div style={styles.statName}>Projects Shipped</div>
              </div>
              <div style={styles.statTile}>
                <div style={styles.statNum}>{trash.length}</div>
                <div style={styles.statName}>Items in Trash</div>
              </div>
            </div>
          </div>

          {/* Backup & Import Data */}
          <div style={styles.cardBox}>
            <div style={styles.cardHeader}>
              <ShieldCheck size={18} color="#4ADE80" />
              <h2 style={styles.cardTitle}>Data Backup &amp; Recovery</h2>
            </div>
            <p style={styles.backupDesc}>
              Export your entire Career Hub dataset to a JSON backup file or restore from a previous backup.
            </p>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={handleExportJSON} style={styles.exportBtn}>
                <Download size={14} /> Export Backup (JSON)
              </button>

              <label style={styles.importBtn}>
                <Upload size={14} /> Import Backup
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RECYCLE BIN / TRASH OS SECTION
         ───────────────────────────────────────────────────────────── */}
      <div style={{ ...styles.cardBox, marginTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Trash2 size={18} color="#EF4444" />
            <div>
              <h2 style={{ ...styles.cardTitle, margin: 0 }}>Recycle Bin (Trash OS)</h2>
              <p style={{ fontSize: 12, color: "#94A3B8", margin: "2px 0 0 0" }}>
                Soft-deleted items are stored safely here. Click <strong>Restore</strong> to send them back to their exact original location.
              </p>
            </div>
          </div>

          {trash.length > 0 && (
            <button onClick={onEmptyTrash} style={styles.emptyTrashBtn}>
              <Trash2 size={13} /> Empty Trash
            </button>
          )}
        </div>

        {/* Filter Pills Bar */}
        <div style={styles.filterRow}>
          {["All", "problem", "interview", "project", "log"].map((typeKey) => {
            const isSelected = filterTrashType === typeKey;
            const labelText =
              typeKey === "All"
                ? "All Trash"
                : typeKey === "problem"
                ? "Problems"
                : typeKey === "interview"
                ? "Interviews"
                : typeKey === "project"
                ? "Projects"
                : "Logs";

            return (
              <button
                key={typeKey}
                onClick={() => setFilterTrashType(typeKey)}
                style={{
                  ...styles.filterPill,
                  background: isSelected ? "#1E293B" : "transparent",
                  borderColor: isSelected ? "#38D9C9" : "#1E293B",
                  color: isSelected ? "#38D9C9" : "#94A3B8",
                  fontWeight: isSelected ? 600 : 400,
                }}
              >
                {labelText}
              </button>
            );
          })}
        </div>

        {/* Trash Item List */}
        {filteredTrash.length === 0 ? (
          <div style={styles.emptyTrashState}>
            <AlertCircle size={32} color="#334155" />
            <div style={{ fontSize: 13.5, color: "#94A3B8" }}>No deleted items in Recycle Bin</div>
          </div>
        ) : (
          <div style={styles.trashList}>
            {filteredTrash.map((item) => {
              const itemType = item.item_type || item.itemType || "item";

              return (
                <div key={item.id} style={styles.trashRow}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={styles.trashIconBadge}>
                      <Cpu size={14} color="#F2A93B" />
                    </div>

                    <div>
                      <div style={styles.trashTitleRow}>
                        <span style={styles.trashTitle}>{item.title}</span>
                        <span style={styles.typeTag}>{itemType}</span>
                      </div>
                      <div style={styles.trashDate}>
                        Deleted on {niceDate((item.deleted_at || item.deletedAt || "").split("T")[0])}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => onRestoreFromTrash(item.id)}
                      style={styles.restoreBtn}
                      title="Restore to original location"
                    >
                      <RotateCcw size={13} /> Restore
                    </button>
                    <button
                      onClick={() => onPermanentDeleteFromTrash(item.id)}
                      style={styles.permDeleteBtn}
                      title="Delete permanently"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 16,
  },
  eyebrowRow: {
    marginBottom: 4,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "#38D9C9",
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    color: "#F8FAFC",
    margin: "0 0 6px 0",
  },
  subtitle: {
    fontSize: 13.5,
    color: "#94A3B8",
    margin: 0,
    maxWidth: 620,
  },
  rankBadge: {
    fontSize: 12.5,
    fontWeight: 700,
    padding: "8px 16px",
    borderRadius: 20,
    border: "1px solid",
    background: "rgba(15, 23, 42, 0.6)",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
  },
  cardBox: {
    background: "#0B132B",
    border: "1px solid #1E293B",
    borderRadius: 16,
    padding: 24,
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: "1px solid #1E293B",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#F8FAFC",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  successToast: {
    background: "rgba(74, 222, 128, 0.12)",
    border: "1px solid rgba(74, 222, 128, 0.3)",
    borderRadius: 8,
    padding: "8px 12px",
    color: "#4ADE80",
    fontSize: 12.5,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  row: {
    display: "flex",
    gap: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "#CBD5E1",
  },
  input: {
    background: "#0F172A",
    border: "1px solid #1E293B",
    borderRadius: 8,
    padding: "9px 12px",
    color: "#F8FAFC",
    fontSize: 13,
    outline: "none",
  },
  saveBtn: {
    background: "linear-gradient(135deg, #38D9C9 0%, #0EA5E9 100%)",
    border: "none",
    borderRadius: 8,
    padding: "10px 18px",
    color: "#0A0F1C",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 6,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
  },
  statTile: {
    background: "#0F172A",
    border: "1px solid #1E293B",
    borderRadius: 10,
    padding: 14,
    textAlign: "center",
  },
  statNum: {
    fontSize: 22,
    fontWeight: 800,
    color: "#F8FAFC",
  },
  statName: {
    fontSize: 11.5,
    color: "#94A3B8",
    marginTop: 2,
  },
  backupDesc: {
    fontSize: 13,
    color: "#94A3B8",
    margin: "0 0 16px 0",
    lineHeight: 1.45,
  },
  exportBtn: {
    background: "#0F172A",
    border: "1px solid #1E293B",
    borderRadius: 8,
    padding: "9px 14px",
    color: "#F8FAFC",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  importBtn: {
    background: "#0F172A",
    border: "1px solid #1E293B",
    borderRadius: 8,
    padding: "9px 14px",
    color: "#38D9C9",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  filterRow: {
    display: "flex",
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    border: "1px solid",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 12,
    cursor: "pointer",
  },
  emptyTrashState: {
    background: "#0F172A",
    border: "1px dashed #1E293B",
    borderRadius: 12,
    padding: 32,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  trashList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  trashRow: {
    background: "#0F172A",
    border: "1px solid #1E293B",
    borderRadius: 10,
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  trashIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: "rgba(242, 169, 59, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  trashTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  trashTitle: {
    fontSize: 13.5,
    fontWeight: 600,
    color: "#F8FAFC",
  },
  typeTag: {
    fontSize: 11,
    fontWeight: 600,
    color: "#F2A93B",
    background: "rgba(242, 169, 59, 0.12)",
    borderRadius: 4,
    padding: "1px 6px",
    textTransform: "capitalize",
  },
  trashDate: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 2,
  },
  restoreBtn: {
    background: "rgba(74, 222, 128, 0.15)",
    border: "1px solid rgba(74, 222, 128, 0.3)",
    borderRadius: 6,
    padding: "6px 12px",
    color: "#4ADE80",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  permDeleteBtn: {
    background: "transparent",
    border: "1px solid #1E293B",
    borderRadius: 6,
    padding: "6px 10px",
    color: "#EF4444",
    cursor: "pointer",
  },
  emptyTrashBtn: {
    background: "rgba(239, 68, 68, 0.12)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: 8,
    padding: "6px 12px",
    color: "#EF4444",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
};
