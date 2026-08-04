import React, { useState } from "react";
import { FolderGit2, Plus, GitBranch, Globe, Sparkles, Trash2, Edit3, ChevronDown, ChevronUp, Cpu, FileText } from "lucide-react";
import AddProjectModal from "./AddProjectModal";

const PHASE_CONFIG = {
  Idea: { label: "💡 Discovery & Idea", color: "#A78BFA", bg: "rgba(167, 139, 250, 0.12)" },
  Building: { label: "🏗️ Active Building", color: "#F2A93B", bg: "rgba(242, 169, 59, 0.12)" },
  Polishing: { label: "⚡ Polishing & CI/CD", color: "#38D9C9", bg: "rgba(56, 217, 201, 0.12)" },
  Shipped: { label: "🚀 Shipped to Prod", color: "#4ADE80", bg: "rgba(74, 222, 128, 0.12)" },
};

export default function ProjectsTab({
  active,
  projects = [],
  onPersistProject,
  onDeleteProject,
}) {
  const [filterPhase, setFilterPhase] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [expandedPitchId, setExpandedPitchId] = useState(null);
  const [expandedArchId, setExpandedArchId] = useState(null);

  const list = projects || [];

  // Metrics
  const totalProjects = list.length;
  const ideaCount = list.filter((p) => p.phase === "Idea").length;
  const buildingCount = list.filter((p) => p.phase === "Building" || p.phase === "Polishing").length;
  const shippedCount = list.filter((p) => p.phase === "Shipped").length;

  // Filtered List
  const filteredList = list.filter((p) => {
    if (filterPhase === "All") return true;
    return p.phase === filterPhase;
  });

  function handleSaveProject(projectData) {
    const isEdit = list.some((p) => p.id === projectData.id);
    let nextList;
    if (isEdit) {
      nextList = list.map((p) => (p.id === projectData.id ? projectData : p));
    } else {
      nextList = [projectData, ...list];
    }

    onPersistProject(projectData, nextList);
    setEditingProject(null);
  }

  function handleDelete(id, e) {
    if (e) e.stopPropagation();
    const nextList = list.filter((p) => p.id !== id);
    onDeleteProject(id, nextList);
  }

  function openEdit(project, e) {
    if (e) e.stopPropagation();
    setEditingProject(project);
    setIsModalOpen(true);
  }

  function openNewModal() {
    setEditingProject(null);
    setIsModalOpen(true);
  }

  return (
    <div style={{ display: active ? "block" : "none" }} className="fade-in">
      {/* Header Banner */}
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrowRow}>
            <span style={styles.eyebrow}>PORTFOLIO STUDIO &amp; INTERVIEW ENGINE</span>
          </div>
          <h1 style={styles.title}>SDE Portfolio Projects</h1>
          <p style={styles.subtitle}>
            Design, build, and showcase high-impact engineering projects with architecture notes and STAR interview pitches.
          </p>
        </div>

        <button style={styles.addBtn} onClick={openNewModal}>
          <Plus size={16} /> + Add Project
        </button>
      </div>

      {/* Metrics Row */}
      <div style={styles.metricsGrid}>
        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>TOTAL PORTFOLIO</div>
          <div style={{ ...styles.metricVal, color: "#F8FAFC" }}>{totalProjects}</div>
          <div style={styles.metricSub}>Projects tracked</div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>💡 DISCOVERY &amp; IDEAS</div>
          <div style={{ ...styles.metricVal, color: "#A78BFA" }}>{ideaCount}</div>
          <div style={styles.metricSub}>Architecture planning</div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>🏗️ ACTIVE BUILDS</div>
          <div style={{ ...styles.metricVal, color: "#F2A93B" }}>{buildingCount}</div>
          <div style={styles.metricSub}>In active development</div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>🚀 SHIPPED TO PROD</div>
          <div style={{ ...styles.metricVal, color: "#4ADE80" }}>{shippedCount}</div>
          <div style={styles.metricSub}>Live portfolio assets</div>
        </div>
      </div>

      {/* Filter Pills Bar */}
      <div style={styles.filterRow}>
        {["All", "Idea", "Building", "Polishing", "Shipped"].map((phaseKey) => {
          const isSelected = filterPhase === phaseKey;
          const labelText =
            phaseKey === "All"
              ? "All Projects"
              : PHASE_CONFIG[phaseKey]
              ? PHASE_CONFIG[phaseKey].label
              : phaseKey;

          return (
            <button
              key={phaseKey}
              onClick={() => setFilterPhase(phaseKey)}
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

      {/* Projects Grid */}
      {filteredList.length === 0 ? (
        <div style={styles.emptyState}>
          <FolderGit2 size={44} color="#334155" />
          <h3 style={styles.emptyTitle}>No projects found</h3>
          <p style={styles.emptySub}>
            Start adding your portfolio projects, architecture notes, and STAR interview pitches.
          </p>
          <button style={styles.addBtn} onClick={openNewModal}>
            <Plus size={15} /> Add First Project
          </button>
        </div>
      ) : (
        <div style={styles.projectsGrid}>
          {filteredList.map((project) => {
            const phaseInfo = PHASE_CONFIG[project.phase] || PHASE_CONFIG.Building;
            const techList = (project.tech_stack || project.techStack || "")
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);

            const isPitchExpanded = expandedPitchId === project.id;
            const isArchExpanded = expandedArchId === project.id;

            return (
              <div key={project.id} style={styles.projectCard}>
                {/* Card Top: Badges */}
                <div style={styles.cardTopRow}>
                  <span
                    style={{
                      ...styles.phaseBadge,
                      color: phaseInfo.color,
                      background: phaseInfo.bg,
                      borderColor: `${phaseInfo.color}30`,
                    }}
                  >
                    {phaseInfo.label}
                  </span>

                  {(project.category || "").trim() && (
                    <span style={styles.categoryBadge}>{project.category}</span>
                  )}
                </div>

                {/* Card Title & Tagline */}
                <h2 style={styles.cardTitle}>{project.title}</h2>
                {project.tagline && <p style={styles.cardTagline}>{project.tagline}</p>}

                {/* Tech Stack Chips */}
                {techList.length > 0 && (
                  <div style={styles.techList}>
                    {techList.map((tech, idx) => (
                      <span key={idx} style={styles.techChip}>
                        <Cpu size={10} color="#38D9C9" />
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* System Architecture Highlights Dropdown / Block */}
                {(project.architecture_notes || project.architectureNotes) && (
                  <div style={styles.expandSection}>
                    <button
                      onClick={() => setExpandedArchId(isArchExpanded ? null : project.id)}
                      style={styles.expandToggleBtn}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <FileText size={13} color="#F2A93B" />
                        System Architecture Highlights
                      </span>
                      {isArchExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {isArchExpanded && (
                      <div style={styles.expandBody}>
                        {project.architecture_notes || project.architectureNotes}
                      </div>
                    )}
                  </div>
                )}

                {/* STAR Interview Pitch Dropdown / Block */}
                {(project.star_pitch || project.starPitch) && (
                  <div style={styles.expandSection}>
                    <button
                      onClick={() => setExpandedPitchId(isPitchExpanded ? null : project.id)}
                      style={{
                        ...styles.expandToggleBtn,
                        borderColor: isPitchExpanded ? "rgba(242, 169, 59, 0.3)" : "#1E293B",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#F2A93B" }}>
                        <Sparkles size={13} />
                        STAR Interview Pitch
                      </span>
                      {isPitchExpanded ? <ChevronUp size={14} color="#F2A93B" /> : <ChevronDown size={14} color="#F2A93B" />}
                    </button>
                    {isPitchExpanded && (
                      <div style={{ ...styles.expandBody, background: "rgba(242, 169, 59, 0.05)", borderColor: "rgba(242, 169, 59, 0.2)" }}>
                        {project.star_pitch || project.starPitch}
                      </div>
                    )}
                  </div>
                )}

                {/* Card Footer Actions */}
                <div style={styles.cardFooter}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {(project.github_url || project.githubUrl) && (
                      <a
                        href={project.github_url || project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.linkIconBtn}
                        title="View GitHub Repository"
                      >
                        <GitBranch size={14} /> GitHub
                      </a>
                    )}

                    {(project.demo_url || project.demoUrl) && (
                      <a
                        href={project.demo_url || project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ ...styles.linkIconBtn, color: "#4ADE80", borderColor: "rgba(74, 222, 128, 0.3)" }}
                        title="View Live Production Demo"
                      >
                        <Globe size={14} /> Live Demo
                      </a>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={(e) => openEdit(project, e)}
                      style={styles.iconBtn}
                      title="Edit project"
                    >
                      <Edit3 size={14} color="#CBD5E1" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(project.id, e)}
                      style={{ ...styles.iconBtn, hoverColor: "#EF4444" }}
                      title="Delete project"
                    >
                      <Trash2 size={14} color="#EF4444" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        editProject={editingProject}
      />
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
    color: "#F2A93B",
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
  addBtn: {
    background: "linear-gradient(135deg, #F2A93B 0%, #D97706 100%)",
    border: "none",
    borderRadius: 10,
    padding: "10px 18px",
    color: "#0A0F1C",
    fontSize: 13.5,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    boxShadow: "0 4px 14px rgba(242, 169, 59, 0.25)",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
    marginBottom: 24,
  },
  metricCard: {
    background: "#0B132B",
    border: "1px solid #1E293B",
    borderRadius: 12,
    padding: 16,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#64748B",
    letterSpacing: "0.05em",
    marginBottom: 6,
  },
  metricVal: {
    fontSize: 24,
    fontWeight: 800,
    marginBottom: 2,
  },
  metricSub: {
    fontSize: 12,
    color: "#94A3B8",
  },
  filterRow: {
    display: "flex",
    gap: 8,
    marginBottom: 24,
    overflowX: "auto",
    paddingBottom: 4,
  },
  filterPill: {
    border: "1px solid",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 12.5,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.2s ease",
  },
  emptyState: {
    background: "#0B132B",
    border: "1px dashed #1E293B",
    borderRadius: 16,
    padding: 48,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#F8FAFC",
    margin: 0,
  },
  emptySub: {
    fontSize: 13.5,
    color: "#94A3B8",
    margin: "0 0 8px 0",
    maxWidth: 400,
  },
  projectsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
    gap: 20,
  },
  projectCard: {
    background: "#0B132B",
    border: "1px solid #1E293B",
    borderRadius: 14,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s ease, border-color 0.2s ease",
  },
  cardTopRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 12,
  },
  phaseBadge: {
    fontSize: 11.5,
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 20,
    border: "1px solid",
  },
  categoryBadge: {
    fontSize: 11.5,
    fontWeight: 600,
    color: "#CBD5E1",
    background: "#1E293B",
    padding: "3px 10px",
    borderRadius: 20,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: "#F8FAFC",
    margin: "0 0 6px 0",
    lineHeight: 1.3,
  },
  cardTagline: {
    fontSize: 13,
    color: "#94A3B8",
    margin: "0 0 14px 0",
    lineHeight: 1.4,
  },
  techList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 14,
  },
  techChip: {
    fontSize: 11.5,
    color: "#38D9C9",
    background: "rgba(56, 217, 201, 0.08)",
    border: "1px solid rgba(56, 217, 201, 0.2)",
    borderRadius: 6,
    padding: "2px 8px",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  expandSection: {
    marginTop: 8,
  },
  expandToggleBtn: {
    width: "100%",
    background: "#0F172A",
    border: "1px solid #1E293B",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 600,
    color: "#CBD5E1",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
  },
  expandBody: {
    background: "#0F172A",
    border: "1px solid #1E293B",
    borderTop: "none",
    borderRadius: "0 0 8px 8px",
    padding: 12,
    fontSize: 12.5,
    color: "#CBD5E1",
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
  },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    paddingTop: 14,
    borderTop: "1px solid #1E293B",
  },
  linkIconBtn: {
    fontSize: 12,
    fontWeight: 600,
    color: "#94A3B8",
    border: "1px solid #1E293B",
    borderRadius: 6,
    padding: "5px 10px",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  iconBtn: {
    background: "transparent",
    border: "1px solid #1E293B",
    borderRadius: 6,
    padding: "5px 8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
