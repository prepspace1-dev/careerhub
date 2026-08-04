import React, { useState, useEffect } from "react";
import { X, FolderGit2, Sparkles, Layers, Globe, GitBranch, Cpu, FileText } from "lucide-react";
import { generateUUID } from "../utils";

const PHASES = [
  { id: "Idea", label: "💡 Discovery & Idea", color: "#A78BFA" },
  { id: "Building", label: "🏗️ Active Building", color: "#F2A93B" },
  { id: "Polishing", label: "⚡ Polishing & CI/CD", color: "#38D9C9" },
  { id: "Shipped", label: "🚀 Shipped to Production", color: "#4ADE80" },
];

export default function AddProjectModal({
  isOpen,
  onClose,
  onSave,
  editProject = null,
}) {
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [phase, setPhase] = useState("Building");
  const [category, setCategory] = useState("");
  const [techStack, setTechStack] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [architectureNotes, setArchitectureNotes] = useState("");
  const [starPitch, setStarPitch] = useState("");

  useEffect(() => {
    if (editProject) {
      setTitle(editProject.title || "");
      setTagline(editProject.tagline || "");
      setPhase(editProject.phase || "Building");
      setCategory(editProject.category || "");
      setTechStack(editProject.tech_stack || editProject.techStack || "");
      setGithubUrl(editProject.github_url || editProject.githubUrl || "");
      setDemoUrl(editProject.demo_url || editProject.demoUrl || "");
      setArchitectureNotes(editProject.architecture_notes || editProject.architectureNotes || "");
      setStarPitch(editProject.star_pitch || editProject.starPitch || "");
    } else {
      setTitle("");
      setTagline("");
      setPhase("Building");
      setCategory("");
      setTechStack("");
      setGithubUrl("");
      setDemoUrl("");
      setArchitectureNotes("");
      setStarPitch("");
    }
  }, [editProject, isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    const projectData = {
      id: editProject ? editProject.id : generateUUID(),
      title: title.trim(),
      tagline: tagline.trim(),
      phase,
      category: category.trim() || "Full-Stack Project",
      tech_stack: techStack.trim(),
      techStack: techStack.trim(),
      github_url: githubUrl.trim(),
      githubUrl: githubUrl.trim(),
      demo_url: demoUrl.trim(),
      demoUrl: demoUrl.trim(),
      architecture_notes: architectureNotes.trim(),
      architectureNotes: architectureNotes.trim(),
      star_pitch: starPitch.trim(),
      starPitch: starPitch.trim(),
      created_at: editProject ? editProject.created_at : new Date().toISOString(),
    };

    onSave(projectData);
    onClose();
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={styles.iconBadge}>
              <FolderGit2 size={20} color="#F2A93B" />
            </div>
            <div>
              <h2 style={styles.title}>{editProject ? "Edit Portfolio Project" : "Add New Portfolio Project"}</h2>
              <p style={styles.subtitle}>Track architecture, lifecycle phase, and STAR interview pitch</p>
            </div>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={18} color="#94A3B8" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Project Title */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Project Title <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Distributed Rate Limiter & Task Queue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* Tagline / Value Proposition */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Tagline / One-Liner Summary</label>
            <input
              type="text"
              placeholder="e.g. High-throughput sliding-window rate limiter handling 10k req/sec"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* Lifecycle Phase */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Lifecycle Phase</label>
            <div style={styles.phaseGrid}>
              {PHASES.map((p) => {
                const isSelected = phase === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPhase(p.id)}
                    style={{
                      ...styles.phaseBtn,
                      background: isSelected ? `${p.color}15` : "#0F172A",
                      borderColor: isSelected ? p.color : "#1E293B",
                      color: isSelected ? p.color : "#94A3B8",
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row: Category & Tech Stack (Free-form inputs per user feedback) */}
          <div style={styles.row}>
            <div style={{ ...styles.fieldGroup, flex: 1 }}>
              <label style={styles.label}>
                <Layers size={13} style={{ marginRight: 4, display: "inline" }} />
                Category
              </label>
              <input
                type="text"
                placeholder="e.g. Full-Stack, AI / LLM, Distributed Systems, CLI Tool"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={{ ...styles.fieldGroup, flex: 1 }}>
              <label style={styles.label}>
                <Cpu size={13} style={{ marginRight: 4, display: "inline" }} />
                Tech Stack (Comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Go, Redis, Docker, PostgreSQL, React, Next.js"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          {/* Row: GitHub & Live Demo */}
          <div style={styles.row}>
            <div style={{ ...styles.fieldGroup, flex: 1 }}>
              <label style={styles.label}>
                <GitBranch size={13} style={{ marginRight: 4, display: "inline" }} />
                GitHub Repository URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/username/project"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={{ ...styles.fieldGroup, flex: 1 }}>
              <label style={styles.label}>
                <Globe size={13} style={{ marginRight: 4, display: "inline" }} />
                Live Demo / Deployment URL
              </label>
              <input
                type="url"
                placeholder="https://my-app.vercel.app"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          {/* System Architecture Highlights */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              <FileText size={13} style={{ marginRight: 4, display: "inline" }} />
              System Architecture &amp; Key Engineering Challenges Solved
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Implemented Redis token bucket algorithm to prevent race conditions. Reduced latency from 120ms to 18ms using indexed PostgreSQL connection pools."
              value={architectureNotes}
              onChange={(e) => setArchitectureNotes(e.target.value)}
              style={styles.textarea}
            />
          </div>

          {/* STAR Interview Pitch */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              <Sparkles size={13} style={{ marginRight: 4, display: "inline", color: "#F2A93B" }} />
              STAR Interview Pitch (Situation, Task, Action, Result)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. S: Needed high-concurrency rate limiter for SDE portfolio. T: Limit 100 req/min per user. A: Built Go microservice with sliding window in Redis. R: Benchmarked 10k RPS with zero dropped tokens."
              value={starPitch}
              onChange={(e) => setStarPitch(e.target.value)}
              style={styles.textarea}
            />
          </div>

          {/* Footer Actions */}
          <div style={styles.footer}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn}>
              <Sparkles size={15} /> Save Project ⚡
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(5, 10, 20, 0.82)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 20,
  },
  modal: {
    background: "#0B132B",
    border: "1px solid #1E293B",
    borderRadius: 16,
    width: "100%",
    maxWidth: 680,
    maxHeight: "90vh",
    overflowY: "auto",
    padding: 24,
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottom: "1px solid #1E293B",
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: "rgba(242, 169, 59, 0.12)",
    border: "1px solid rgba(242, 169, 59, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: "#F8FAFC",
    margin: 0,
  },
  subtitle: {
    fontSize: 12.5,
    color: "#94A3B8",
    margin: "2px 0 0 0",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 6,
    borderRadius: 8,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  row: {
    display: "flex",
    gap: 16,
  },
  label: {
    fontSize: 12.5,
    fontWeight: 600,
    color: "#CBD5E1",
  },
  input: {
    background: "#0F172A",
    border: "1px solid #1E293B",
    borderRadius: 8,
    padding: "9px 12px",
    color: "#F8FAFC",
    fontSize: 13.5,
    outline: "none",
  },
  textarea: {
    background: "#0F172A",
    border: "1px solid #1E293B",
    borderRadius: 8,
    padding: "9px 12px",
    color: "#F8FAFC",
    fontSize: 13,
    outline: "none",
    resize: "vertical",
  },
  phaseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 8,
  },
  phaseBtn: {
    border: "1px solid #1E293B",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 12.5,
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
    paddingTop: 16,
    borderTop: "1px solid #1E293B",
  },
  cancelBtn: {
    background: "transparent",
    border: "1px solid #1E293B",
    borderRadius: 8,
    padding: "9px 16px",
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  submitBtn: {
    background: "linear-gradient(135deg, #F2A93B 0%, #D97706 100%)",
    border: "none",
    borderRadius: 8,
    padding: "9px 18px",
    color: "#0A0F1C",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
};
