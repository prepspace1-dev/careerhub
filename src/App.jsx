import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { HeroBanner } from "./components/dashboard/HeroBanner";
import { QuickMetrics } from "./components/dashboard/QuickMetrics";
import { TimelineStrip } from "./components/dashboard/TimelineStrip";
import { DailyWorkspace } from "./components/daily/DailyWorkspace";
import { DSAVault } from "./components/dsa/DSAVault";
import { CSAIHub } from "./components/csai/CSAIHub";
import { ProjectsView } from "./components/projects/ProjectsView";
import { StatsView } from "./components/analytics/StatsView";
import { CommandPalette } from "./components/ui/CommandPalette";
import { CelebrationModal } from "./components/ui/CelebrationModal";
import Auth from "./components/Auth";

function MainContent() {
  const { activeTab } = useApp();

  return (
    <main style={{ flex: 1, padding: "28px", maxWidth: "1280px", margin: "0 auto", width: "100%" }}>
      {activeTab === "dashboard" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <HeroBanner />
          <QuickMetrics />
          <TimelineStrip />
        </div>
      )}

      {activeTab === "workspace" && <DailyWorkspace />}
      {activeTab === "roadmap" && <TimelineStrip />}
      {activeTab === "dsa" && <DSAVault />}
      {activeTab === "csai" && <CSAIHub />}
      {activeTab === "projects" && <ProjectsView />}
      {activeTab === "stats" && <StatsView />}
    </main>
  );
}

function AppShell() {
  const { isAuthenticated, authLoading, activeMilestoneModal, setActiveMilestoneModal } = useApp();

  if (authLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        color: "var(--text-muted)",
        fontSize: "14px",
        fontWeight: 600
      }}>
        Loading CAREERHUB V2...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header />
        <MainContent />
      </div>
      <CommandPalette />
      <CelebrationModal
        isOpen={!!activeMilestoneModal}
        onClose={() => setActiveMilestoneModal(null)}
        milestone={activeMilestoneModal}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
