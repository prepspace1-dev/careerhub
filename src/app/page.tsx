"use client";

import React from "react";
import { useApp } from "@/context/app-context";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { HeroBanner } from "@/components/dashboard/hero-banner";
import { QuickMetrics } from "@/components/dashboard/quick-metrics";
import { ActivityHeatmap } from "@/components/dashboard/activity-heatmap";
import { RevisionRadar } from "@/components/dashboard/revision-radar";
import { TimelineStrip } from "@/components/dashboard/timeline-strip";
import { DailyWorkspace } from "@/components/daily/daily-workspace";
import { DSAVault } from "@/components/dsa/dsa-vault";
import { CSAIHub } from "@/components/csai/csai-hub";
import { ProjectsView } from "@/components/projects/projects-view";
import { StatsView } from "@/components/analytics/stats-view";
import { CommandPalette } from "@/components/modals/command-palette";
import { CelebrationModal } from "@/components/modals/celebration-modal";
import { Auth } from "@/components/auth/auth";

function MainContent() {
  const { activeTab } = useApp();

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto p-6 sm:p-8 space-y-6">
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <HeroBanner />
          <QuickMetrics />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityHeatmap />
            <RevisionRadar />
          </div>
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

export default function Home() {
  const { isAuthenticated, authLoading, activeMilestoneModal, setActiveMilestoneModal } = useApp();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground text-sm font-semibold">
        Loading CAREERHUB V2...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
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
