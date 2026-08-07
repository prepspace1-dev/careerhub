import React from "react";
import { useApp } from "../../context/AppContext";
import { 
  LayoutDashboard, 
  Map, 
  Code2, 
  BrainCircuit, 
  Kanban, 
  BarChart2, 
  Flame, 
  Sparkles,
  X 
} from "lucide-react";

export function Sidebar() {
  const { activeTab, setActiveTab, currentDay, overallPercentage, userStats, mobileMenuOpen, setMobileMenuOpen } = useApp();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "workspace", label: `Day ${currentDay} Workspace`, icon: Sparkles, badge: "Active" },
    { id: "roadmap", label: "30-Day Roadmap", icon: Map },
    { id: "dsa", label: "DSA Sheet", icon: Code2, count: "90" },
    { id: "csai", label: "CS & AI Hub", icon: BrainCircuit, count: "54" },
    { id: "projects", label: "Projects", icon: Kanban, count: "4" },
    { id: "stats", label: "Analytics", icon: BarChart2 }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="mobile-backdrop"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 40
          }}
        />
      )}

      {/* Main Sidebar Container (Desktop Sticky / Mobile Drawer Overlay) */}
      <aside
        className={`app-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}
        style={{
          width: "240px",
          minWidth: "240px",
          height: "100vh",
          position: "sticky",
          top: 0,
          borderRight: "var(--glass-border)",
          background: "var(--bg-subtle)",
          display: "flex",
          flexDirection: "column",
          padding: "20px 16px",
          zIndex: 50
        }}
      >
        {/* Brand Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", padding: "0 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, var(--accent-indigo), var(--accent-violet))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: "18px",
              boxShadow: "0 4px 12px var(--glow-accent)"
            }}>
              C
            </div>
            <div>
              <h1 style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.5px", color: "var(--text-primary)" }}>
                CAREERHUB
              </h1>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--accent-indigo)", textTransform: "uppercase", letterSpacing: "1px" }}>
                30-Day OS
              </span>
            </div>
          </div>

          {/* Close Mobile Drawer Button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-close-btn"
            style={{ color: "var(--text-muted)", display: "none" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Items */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  background: isActive ? "var(--bg-card)" : "transparent",
                  border: isActive ? "1px solid var(--border-glow)" : "1px solid transparent",
                  textAlign: "left",
                  position: "relative"
                }}
              >
                <Icon size={18} style={{ color: isActive ? "var(--accent-indigo)" : "var(--text-muted)" }} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: "9999px",
                    background: "var(--accent-indigo)",
                    color: "#fff"
                  }}>
                    {item.badge}
                  </span>
                )}
                {item.count && (
                  <span style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--text-muted)"
                  }}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mini Streak Card */}
        <div style={{
          padding: "14px",
          borderRadius: "12px",
          background: "var(--bg-card)",
          border: "var(--glass-border)",
          marginTop: "auto"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>Overall Journey</span>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "var(--accent-indigo)" }}>{overallPercentage}%</span>
          </div>
          <div style={{ width: "100%", height: "6px", borderRadius: "9999px", background: "var(--border)", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${overallPercentage}%`,
              background: "linear-gradient(90deg, var(--accent-indigo), var(--accent-emerald))",
              borderRadius: "9999px",
              transition: "width 0.5s ease"
            }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "10px", fontSize: "12px", fontWeight: 700, color: "var(--accent-amber)" }}>
            <Flame size={15} />
            <span>{userStats.streak} Day Streak!</span>
          </div>
        </div>
      </aside>
    </>
  );
}
