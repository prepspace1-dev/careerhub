import React from "react";
import { useApp } from "../../context/AppContext";
import { ProgressRing } from "../ui/ProgressRing";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroBanner() {
  const { currentDay, overallPercentage, setActiveTab, userProfile } = useApp();

  return (
    <div className="glass-card animate-fade-in" style={{
      padding: "28px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "24px",
      background: "linear-gradient(135deg, var(--bg-card), var(--glow-accent))",
      border: "var(--glass-border)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Left Content */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <span style={{
            fontSize: "12px",
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: "9999px",
            background: "rgba(99, 102, 241, 0.15)",
            color: "var(--accent-indigo)",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px"
          }}>
            <Sparkles size={13} />
            Day {currentDay} of 30
          </span>
          <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>
            • 30-Day SDE Transformation
          </span>
        </div>

        <h2 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", marginBottom: "8px" }}>
          Welcome back, {userProfile?.displayName || "Engineer"} 👋
        </h2>

        <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: "20px", maxWidth: "520px" }}>
          You've completed <strong style={{ color: "var(--accent-indigo)" }}>{overallPercentage}%</strong> of your journey. Keep up the momentum!
        </p>

        {/* Dynamic Progress Bar */}
        <div style={{ width: "100%", maxWidth: "480px", marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px" }}>
            <span>Overall Completion</span>
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingRight: "12px" }}>
        <ProgressRing percentage={overallPercentage} size={130} strokeWidth={10} />
      </div>
    </div>
  );
}
