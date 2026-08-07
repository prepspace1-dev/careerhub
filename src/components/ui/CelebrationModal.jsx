import React, { useEffect } from "react";
import { triggerStreakCelebration, playMilestoneFanfare } from "../../utils/effects";
import { Flame, Trophy, Target, Sparkles, X } from "lucide-react";

export function CelebrationModal({ isOpen, onClose, milestone }) {
  useEffect(() => {
    if (isOpen) {
      triggerStreakCelebration();
      playMilestoneFanfare();
    }
  }, [isOpen]);

  if (!isOpen || !milestone) return null;

  const getIcon = () => {
    switch (milestone.type) {
      case "streak": return <Flame size={48} style={{ color: "var(--accent-amber)" }} />;
      case "dsa": return <Trophy size={48} style={{ color: "var(--accent-emerald)" }} />;
      case "project": return <Target size={48} style={{ color: "var(--accent-violet)" }} />;
      default: return <Sparkles size={48} style={{ color: "var(--accent-indigo)" }} />;
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(12px)",
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }} onClick={onClose} className="animate-fade-in">
      <div style={{
        width: "420px",
        maxWidth: "95vw",
        background: "linear-gradient(135deg, var(--bg-card), var(--bg-subtle))",
        backdropFilter: "blur(24px)",
        border: "1.5px solid var(--accent-indigo)",
        borderRadius: "24px",
        padding: "32px 28px",
        textAlign: "center",
        boxShadow: "0 20px 60px rgba(99, 102, 241, 0.35)",
        position: "relative",
        overflow: "hidden"
      }} onClick={(e) => e.stopPropagation()}>
        {/* Ambient Top Glow */}
        <div style={{
          position: "absolute",
          top: "-50px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "180px",
          height: "180px",
          borderRadius: "9999px",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(0,0,0,0) 70%)",
          pointerEvents: "none"
        }} />

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            color: "var(--text-muted)",
            padding: "4px"
          }}
        >
          <X size={20} />
        </button>

        {/* Icon Container with Glow */}
        <div style={{
          width: "88px",
          height: "88px",
          borderRadius: "24px",
          background: "rgba(99, 102, 241, 0.12)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px auto",
          boxShadow: "0 8px 30px var(--glow-accent)"
        }} className="hover-lift">
          {getIcon()}
        </div>

        {/* Title & Description */}
        <h3 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", marginBottom: "8px" }}>
          {milestone.title}
        </h3>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "24px" }}>
          {milestone.description}
        </p>

        {/* Reward Badge */}
        {milestone.xp && (
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            borderRadius: "9999px",
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            color: "var(--accent-emerald)",
            fontWeight: 800,
            fontSize: "13px",
            marginBottom: "24px"
          }}>
            <Sparkles size={14} />
            <span>+{milestone.xp} XP Earned</span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onClose}
          className="hover-lift"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))",
            color: "#fff",
            fontWeight: 800,
            fontSize: "14.5px",
            boxShadow: "0 8px 24px -4px var(--glow-accent)"
          }}
        >
          Awesome! Keep Going →
        </button>
      </div>
    </div>
  );
}
