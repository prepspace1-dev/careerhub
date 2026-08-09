"use client";

import React from "react";
import { useApp } from "@/context/app-context";
import { Flame, CheckCircle2, Award, Target, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function StatsView() {
  const { 
    dsaSolvedCount, 
    dsaTotalCount, 
    overallPercentage, 
    userStats,
    dayProgress,
    csCompletedCount,
    projectMilestonesDone,
    projectMilestonesTotal
  } = useApp();

  const placementReadiness = Math.round(overallPercentage * 0.95 + 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <CardContent className="p-0 space-y-1">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            Analytics & Placement Readiness Engine
          </h2>
          <p className="text-sm text-muted-foreground">
            Track your learning velocity, consistency streak, and placement readiness index.
          </p>
        </CardContent>
      </Card>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <CardContent className="p-0 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 uppercase tracking-wider">
              <Target size={16} />
              <span>Readiness Index</span>
            </div>
            <div className="text-3xl font-extrabold text-emerald-500">
              {placementReadiness}%
            </div>
            <div className="text-xs text-muted-foreground">
              SDE Interview Target
            </div>
          </CardContent>
        </Card>

        <Card className="p-5">
          <CardContent className="p-0 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 uppercase tracking-wider">
              <Flame size={16} />
              <span>Current Streak</span>
            </div>
            <div className="text-3xl font-extrabold text-amber-500">
              {userStats.streak} Days
            </div>
            <div className="text-xs text-muted-foreground">
              Daily Consistency
            </div>
          </CardContent>
        </Card>

        <Card className="p-5">
          <CardContent className="p-0 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-500 uppercase tracking-wider">
              <CheckCircle2 size={16} />
              <span>Overall Progress</span>
            </div>
            <div className="text-3xl font-extrabold text-foreground">
              {overallPercentage}%
            </div>
            <div className="text-xs text-muted-foreground">
              Curriculum Complete
            </div>
          </CardContent>
        </Card>

        <Card className="p-5">
          <CardContent className="p-0 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-500 uppercase tracking-wider">
              <Award size={16} />
              <span>DSA Solved</span>
            </div>
            <div className="text-3xl font-extrabold text-foreground">
              {dsaSolvedCount} / {dsaTotalCount}
            </div>
            <div className="text-xs text-muted-foreground">
              Problems Completed
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className="p-6">
        <CardContent className="p-0 space-y-5">
          <h3 className="text-base font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Sparkles size={16} className="text-blue-500" />
            <span>Curriculum Mastery Breakdown</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* DSA */}
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">DSA Problem Sheet</span>
                <span className="text-emerald-500">{Math.round((dsaSolvedCount / (dsaTotalCount || 1)) * 100)}%</span>
              </div>
              <Progress value={Math.round((dsaSolvedCount / (dsaTotalCount || 1)) * 100)} className="h-1.5" />
            </div>

            {/* CS & AI */}
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">CS & Modern AI Hub</span>
                <span className="text-blue-500">{Math.round((csCompletedCount / 30) * 100)}%</span>
              </div>
              <Progress value={Math.round((csCompletedCount / 30) * 100)} className="h-1.5" />
            </div>

            {/* Projects */}
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">Capstone Projects</span>
                <span className="text-purple-500">
                  {projectMilestonesTotal > 0 ? Math.round((projectMilestonesDone / projectMilestonesTotal) * 100) : 0}%
                </span>
              </div>
              <Progress value={projectMilestonesTotal > 0 ? Math.round((projectMilestonesDone / projectMilestonesTotal) * 100) : 0} className="h-1.5" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 30-Day Heatmap Grid */}
      <Card className="p-6">
        <CardContent className="p-0 space-y-4">
          <h3 className="text-base font-extrabold tracking-tight text-foreground">
            30-Day Activity Heatmap
          </h3>

          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((dayNum) => {
              const isCompleted = dayProgress[dayNum]?.theoryRead;
              return (
                <div
                  key={dayNum}
                  className={`flex h-10 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                    isCompleted
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                      : "bg-muted/40 text-muted-foreground border border-border/60"
                  }`}
                  title={`Day ${dayNum}: ${isCompleted ? "Completed" : "Incomplete"}`}
                >
                  D{dayNum}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
