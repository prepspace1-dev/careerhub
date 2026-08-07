import React from "react";
import { useApp } from "../../context/AppContext";
import { ProgressRing } from "../ui/ProgressRing";
import { ArrowRight, Sparkles, Target } from "lucide-react";

export function HeroBanner() {
  const { currentDay, overallPercentage, setActiveTab, userProfile, user } = useApp();

  const userEmailName = user?.email ? user.email.split("@")[0] : "Engineer";
  const displayName = userProfile?.displayName && userProfile.displayName !== "Sai"
    ? userProfile.displayName
    : (userProfile?.displayName || userEmailName);

  // Placement Readiness Index (weighted score based on overall percentage)
  const placementReadiness = Math.round(overallPercentage * 0.95 + 5);

  return (
    <div className="glass-card animate-fade-in hover-lift" style={{
      padding: "32px 36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "24px",
      background: "linear-gradient(135deg, var(--bg-card), var(--glow-accent))",
      border: "var(--glass-border)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Accent Glow */}
      <div style={{
        position: "absolute",
        top: "-60px",
        right: "-60px",
        width: "200px",
        height: "200px",
        borderRadius: "9999px",
        background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%)",
        pointerEvents: "none"
      }} />

      {/* Left Content */}
      <div style={{ flex: 1, zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
          <span style={{
            fontSize: "12px",
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: "9999px",
            background: "rgba(99, 102, 241, 0.15)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            color: "var(--accent-indigo)",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <Sparkles size={13} />
            Day {currentDay} of 30
          </span>

          <span style={{
            fontSize: "12px",
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: "9999px",
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            color: "var(--accent-emerald)",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <Target size={13} />
            Readiness: {placementReadiness}%
          </span>
        </div>

        <h2 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", marginBottom: "8px" }}>
          Welcome back, {displayName} 👋
        </h2>

        <p style={{ fontSize: "14.5px", color: "var(--text-secondary)", marginBottom: "20px", maxWidth: "540px", lineHeight: "1.5" }}>
          You've completed <strong style={{ color: "var(--accent-indigo)" }}>{overallPercentage}%</strong> of your 30-day SDE operating system. Keep up the momentum today!
        </p>

        {/* Dynamic Progress Bar */}
        <div style={{ width: "100%", maxWidth: "480px", marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px" }}>
            <span>Overall Curriculum Completion</span>
            <span>{overallPercentage}%</span>
          </div>
          <div style={{ height: "8px", borderRadius: "9999px", background: "var(--border)", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${overallPercentage}%`,
              background: "linear-gradient(90deg, var(--accent-indigo), var(--accent-emerald))",
              borderRadius: "9999px",
              transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
            }} />
          </div>
        </div>

        {/* Main Action Button */}
        <button
          onClick={() => setActiveTab("workspace")}
          className="hover-lift"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 24px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))",
            color: "#fff",
            fontWeight: 700,
            fontSize: "14px",
            boxShadow: "0 8px 20px -4px var(--glow-accent)"
          }}
        >
          <span>Continue Day {currentDay} Workspace</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Right Progress Ring Visual */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingRight: "12px", zIndex: 1 }}>
        <ProgressRing percentage={overallPercentage} size={135} strokeWidth={10} />
      </div>
    </div>
  );
}

