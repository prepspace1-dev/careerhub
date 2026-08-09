"use client";

import React from "react";
import { useApp } from "@/context/app-context";
import { ArrowRight, Sparkles, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function HeroBanner() {
  const { 
    currentDay, 
    overallPercentage, 
    setActiveTab, 
    userProfile, 
    user,
    dsaSolvedCount,
    csCompletedCount,
    projectMilestonesDone
  } = useApp();

  const userEmailName = user?.email ? user.email.split("@")[0] : "Engineer";
  const displayName = userProfile?.displayName && userProfile.displayName !== "Sai"
    ? userProfile.displayName
    : (userProfile?.displayName || userEmailName);

  const placementReadiness = Math.round(overallPercentage * 0.95 + 5);
  const totalXP = (dsaSolvedCount * 50) + (csCompletedCount * 30) + (projectMilestonesDone * 100);

  let rankTitle = "Junior Engineer";
  let rankIcon = "🐣";
  let nextRankXP = 500;
  let prevRankXP = 0;

  if (totalXP >= 3000) {
    rankTitle = "Staff Architect";
    rankIcon = "👑";
    nextRankXP = 5000;
    prevRankXP = 3000;
  } else if (totalXP >= 1500) {
    rankTitle = "Senior Engineer";
    rankIcon = "⚡";
    nextRankXP = 3000;
    prevRankXP = 1500;
  } else if (totalXP >= 500) {
    rankTitle = "Mid-Level Engineer";
    rankIcon = "🚀";
    nextRankXP = 1500;
    prevRankXP = 500;
  }

  const xpProgressPercent = Math.min(100, Math.round(((totalXP - prevRankXP) / (nextRankXP - prevRankXP)) * 100));

  return (
    <Card className="relative overflow-hidden border-border/60 bg-gradient-to-br from-card via-card to-blue-500/5 p-6 sm:p-8">
      {/* Background Accent Glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Content */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="blue" className="px-3 py-1 gap-1.5 text-xs font-bold">
              <Sparkles size={13} />
              Day {currentDay} of 30
            </Badge>

            <Badge variant="secondary" className="px-3 py-1 gap-1.5 text-xs font-bold border border-amber-500/30 bg-amber-500/10 text-amber-500">
              <Zap size={13} />
              {rankIcon} {rankTitle} ({totalXP} XP)
            </Badge>

            <Badge variant="secondary" className="px-3 py-1 gap-1.5 text-xs font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
              <Target size={13} />
              Readiness: {placementReadiness}%
            </Badge>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Welcome back, {displayName} 👋
            </h2>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              You&apos;ve completed <span className="font-bold text-blue-500">{overallPercentage}%</span> of your 30-day SDE operating system. Keep building your streak!
            </p>
          </div>

          {/* Level XP Progress Bar */}
          <div className="max-w-md space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-muted-foreground">
              <span>Level XP: {totalXP} / {nextRankXP} XP</span>
              <span>{xpProgressPercent}% to next rank</span>
            </div>
            <Progress value={xpProgressPercent} className="h-2" />
          </div>

          <Button
            size="lg"
            variant="gradient"
            onClick={() => setActiveTab("workspace")}
            className="gap-2 shadow-lg shadow-blue-500/20"
          >
            <span>Continue Day {currentDay} Workspace</span>
            <ArrowRight size={16} />
          </Button>
        </div>

        {/* Right Progress Visual */}
        <div className="flex items-center justify-center lg:px-4">
          <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-4 border-muted bg-card shadow-inner">
            <svg className="absolute inset-0 h-full w-full -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="62"
                className="stroke-muted"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="62"
                className="stroke-blue-600 transition-all duration-700 ease-out"
                strokeWidth="8"
                strokeDasharray={389.5}
                strokeDashoffset={389.5 - (389.5 * overallPercentage) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="text-center">
              <div className="text-3xl font-extrabold tracking-tight text-foreground">
                {overallPercentage}%
              </div>
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Completed
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
