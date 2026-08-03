import React, { useState } from "react";
import { ArrowLeft, Sparkles, Target, ChevronRight, Lightbulb, ShieldCheck } from "lucide-react";
import { COMPANY_PACKS, computeCompanyReadiness } from "../data/companies";
import { TOPIC_LABEL } from "../data/topics";

/**
 * CompanyPacksTab — Targeted preparation for top SDE companies
 *
 * Displays company cards with real-time readiness scores calculated from user's solved problems.
 * Click a company card to view required topic breakdowns, must-do patterns, and interview tips.
 */
export default function CompanyPacksTab({ active, problems = [] }) {
  const [selectedPack, setSelectedPack] = useState(null);

  if (!active) return null;

  function openPack(pack) {
    setSelectedPack(pack);
  }

  function closePack() {
    setSelectedPack(null);
  }

  // ── Drill-Down Company Pack View ─────────────────────────────────────────────
  if (selectedPack) {
    const readiness = computeCompanyReadiness(selectedPack, problems);
    const solvedProblems = (problems || []).filter((p) => p.status === "solved");
    const reqs = selectedPack.topicRequirements || {};

    return (
      <div className="fade-in">
        {/* Back button */}
        <button onClick={closePack} style={s.backBtn}>
          <ArrowLeft size={14} />
          Back to Company Packs
        </button>

        {/* Company Header */}
        <div style={s.detailHeader}>
          <div>
            <div style={s.diffTag}>
              {selectedPack.emoji} {selectedPack.difficulty} Difficulty
            </div>
            <h1 style={{ ...s.detailTitle, color: selectedPack.color }}>
              {selectedPack.name}
            </h1>
            <p style={s.detailDesc}>{selectedPack.description}</p>
          </div>

          {/* Readiness Score Badge */}
          <div style={{ ...s.readinessCard, borderColor: `${selectedPack.color}44` }}>
            <div style={{ ...s.readinessVal, color: selectedPack.color }}>
              {readiness}%
            </div>
            <div style={s.readinessLbl}>Readiness Score</div>
          </div>
        </div>

        {/* Topic Requirements Breakdown */}
        <div style={s.section}>
          <div style={s.sectionLabel}>
            <Target size={12} style={{ marginRight: 6 }} />
            Required Topic Targets
          </div>

          <div style={s.topicGrid}>
            {Object.entries(reqs).map(([topicId, requiredCount]) => {
              const solvedCount = solvedProblems.filter((p) => p.topic === topicId).length;
              const pct = Math.min(100, Math.round((solvedCount / requiredCount) * 100));
              const topicName = TOPIC_LABEL[topicId] || topicId;

              return (
                <div key={topicId} style={s.topicTargetCard}>
                  <div style={s.topicTargetHeader}>
                    <span style={s.topicName}>{topicName}</span>
                    <span style={s.topicCount}>
                      {solvedCount} / {requiredCount} solved
                    </span>
                  </div>
                  <div style={s.progressTrack}>
                    <div
                      style={{
                        ...s.progressFill,
                        width: `${pct}%`,
                        background: pct >= 100 ? "#4ADE80" : selectedPack.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Must-Do Patterns */}
        {selectedPack.mustDoPatterns && (
          <div style={s.section}>
            <div style={s.sectionLabel}>
              <ShieldCheck size={12} style={{ marginRight: 6 }} />
              Must-Do Patterns for {selectedPack.shortName}
            </div>

            <div style={s.patternRow}>
              {selectedPack.mustDoPatterns.map((pat) => (
                <span
                  key={pat}
                  style={{
                    ...s.patternChip,
                    background: `${selectedPack.color}15`,
                    color: selectedPack.color,
                    borderColor: `${selectedPack.color}44`,
                  }}
                >
                  ⚡ {pat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Interview Tips & Strategy */}
        {selectedPack.tips && (
          <div style={s.section}>
            <div style={s.sectionLabel}>
              <Lightbulb size={12} style={{ marginRight: 6 }} />
              Interview Strategy &amp; Tips
            </div>

            <div style={s.tipsList}>
              {selectedPack.tips.map((tip, idx) => (
                <div key={idx} style={s.tipCard}>
                  <span style={s.tipNumber}>{idx + 1}</span>
                  <span style={s.tipText}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Main Company Packs Grid ────────────────────────────────────────────────
  return (
    <div className="fade-in">
      {/* Page Header */}
      <div style={s.pageHeader}>
        <div>
          <span style={s.eyebrow}>
            <Sparkles size={11} style={{ marginRight: 4, verticalAlign: "middle" }} />
            TARGETED PREPARATION
          </span>
          <h1 style={s.pageTitle}>Company Prep Packs</h1>
        </div>
      </div>

      {/* Subtitle banner */}
      <div style={s.banner}>
        <span style={s.bannerEmoji}>🏢</span>
        <div>
          <div style={s.bannerTitle}>Targeted Interview Prep Packs</div>
          <div style={s.bannerDesc}>
            Custom benchmarks, must-do patterns, and readiness scores calculated specifically for Google, Amazon, Microsoft, Meta, TCS, Accenture, and Startups.
          </div>
        </div>
      </div>

      {/* Grid of Company Cards */}
      <div style={s.companyGrid}>
        {COMPANY_PACKS.map((pack) => {
          const readiness = computeCompanyReadiness(pack, problems);

          return (
            <div
              key={pack.id}
              onClick={() => openPack(pack)}
              style={s.card}
              className="clickable-card"
            >
              <div style={s.cardTop}>
                <div style={s.cardBrand}>
                  <span style={s.emoji}>{pack.emoji}</span>
                  <div>
                    <h3 style={{ ...s.companyName, color: pack.color }}>{pack.name}</h3>
                    <span style={s.diffBadge}>{pack.difficulty}</span>
                  </div>
                </div>

                {/* Readiness Pill */}
                <div
                  style={{
                    ...s.readinessBadge,
                    background: `${pack.color}15`,
                    color: pack.color,
                    borderColor: `${pack.color}44`,
                  }}
                >
                  {readiness}% Ready
                </div>
              </div>

              <p style={s.cardDesc}>{pack.description}</p>

              <div style={s.cardFooter}>
                <span style={s.patternCount}>
                  {pack.mustDoPatterns?.length || 0} Key Patterns
                </span>
                <span style={{ ...s.viewBtn, color: pack.color }}>
                  View Pack <ChevronRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  pageHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    marginBottom: 16, flexWrap: "wrap", gap: 12,
  },
  eyebrow: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10.5, letterSpacing: 2, color: "#38D9C9",
    display: "block", marginBottom: 4, fontWeight: 600,
  },
  pageTitle: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 22, fontWeight: 700, color: "#E7EDF5", margin: 0,
  },
  banner: {
    display: "flex", alignItems: "center", gap: 14,
    background: "rgba(18,26,43,0.45)", border: "1px solid #1C2842",
    borderRadius: 14, padding: "14px 18px", marginBottom: 20,
  },
  bannerEmoji: { fontSize: 22, flexShrink: 0 },
  bannerTitle: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 12.5, fontWeight: 700,
    color: "#E7EDF5", marginBottom: 2,
  },
  bannerDesc: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#8493AA",
    lineHeight: 1.4,
  },
  companyGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 16,
  },
  card: {
    background: "rgba(14,22,38,0.55)", border: "1px solid #1C2842",
    borderRadius: 18, padding: "20px", display: "flex", flexDirection: "column",
    justifyContent: "space-between", gap: 14, cursor: "pointer",
    transition: "all 0.15s ease",
  },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  cardBrand: { display: "flex", alignItems: "center", gap: 12 },
  emoji: { fontSize: 24, flexShrink: 0 },
  companyName: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, fontWeight: 700, margin: "0 0 2px 0",
  },
  diffBadge: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#5D8DC1",
  },
  readinessBadge: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 700,
    padding: "4px 10px", borderRadius: 12, border: "1px solid", flexShrink: 0,
  },
  cardDesc: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12.5, color: "#8493AA",
    margin: 0, lineHeight: 1.45,
  },
  cardFooter: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    paddingTop: 12, borderTop: "1px solid #121A2B",
  },
  patternCount: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: "#5D8DC1",
  },
  viewBtn: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, fontWeight: 700,
    display: "flex", alignItems: "center", gap: 3,
  },
  backBtn: {
    display: "flex", alignItems: "center", gap: 8,
    color: "#5D8DC1", fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11.5, fontWeight: 600, marginBottom: 20, padding: "4px 0",
    cursor: "pointer", background: "none", border: "none",
  },
  detailHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    background: "rgba(14,22,38,0.65)", border: "1px solid #1C2842",
    borderRadius: 18, padding: "22px 24px", marginBottom: 22, flexWrap: "wrap", gap: 16,
  },
  diffTag: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#5D8DC1",
    marginBottom: 4, fontWeight: 600,
  },
  detailTitle: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 24, fontWeight: 700, margin: "0 0 6px 0",
  },
  detailDesc: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#8493AA", margin: 0,
  },
  readinessCard: {
    background: "rgba(18,26,43,0.5)", border: "1px solid", borderRadius: 16,
    padding: "12px 20px", display: "flex", flexDirection: "column", alignItems: "center",
  },
  readinessVal: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 26, fontWeight: 700, lineHeight: 1.1,
  },
  readinessLbl: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 10.5, color: "#8493AA", marginTop: 2,
  },
  section: { marginBottom: 22 },
  sectionLabel: {
    display: "flex", alignItems: "center",
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: 1.5,
    color: "#5D8DC1", marginBottom: 12, textTransform: "uppercase", fontWeight: 700,
  },
  topicGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 12,
  },
  topicTargetCard: {
    background: "rgba(14,22,38,0.55)", border: "1px solid #1C2842",
    borderRadius: 12, padding: "12px 14px",
  },
  topicTargetHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8,
  },
  topicName: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#E7EDF5",
  },
  topicCount: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: "#5D8DC1",
  },
  progressTrack: { height: 6, background: "#121A2B", borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3, transition: "width 0.4s ease" },
  patternRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  patternChip: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600,
    padding: "4px 12px", borderRadius: 16, border: "1px solid",
  },
  tipsList: { display: "flex", flexDirection: "column", gap: 10 },
  tipCard: {
    display: "flex", alignItems: "flex-start", gap: 12,
    background: "rgba(14,22,38,0.55)", border: "1px solid #1C2842",
    borderRadius: 12, padding: "12px 16px",
  },
  tipNumber: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 700,
    background: "rgba(56,217,201,0.12)", color: "#38D9C9",
    width: 22, height: 22, borderRadius: "50%", display: "flex",
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  tipText: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#C7D2E0", lineHeight: 1.45,
  },
};
