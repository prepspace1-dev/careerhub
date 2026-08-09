"use client";

import React from "react";
import { useApp } from "@/context/app-context";
import { Code2, BrainCircuit, Kanban, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function QuickMetrics() {
  const { 
    dsaSolvedCount, 
    dsaTotalCount, 
    csCompletedCount, 
    csTotalCount, 
    projectMilestonesDone, 
    projectMilestonesTotal, 
    userStats 
  } = useApp();

  const metrics = [
    {
      label: "DSA Solved",
      val: `${dsaSolvedCount} / ${dsaTotalCount}`,
      sub: `${Math.round((dsaSolvedCount / (dsaTotalCount || 1)) * 100)}% Complete`,
      icon: Code2,
      color: "text-blue-500 bg-blue-500/10"
    },
    {
      label: "CS & AI Topics",
      val: `${csCompletedCount} / ${csTotalCount}`,
      sub: `${Math.round((csCompletedCount / (csTotalCount || 1)) * 100)}% Complete`,
      icon: BrainCircuit,
      color: "text-purple-500 bg-purple-500/10"
    },
    {
      label: "Project Deliverables",
      val: `${projectMilestonesDone} / ${projectMilestonesTotal}`,
      sub: "4 Build Sprints",
      icon: Kanban,
      color: "text-emerald-500 bg-emerald-500/10"
    },
    {
      label: "Hours Studied",
      val: `${(userStats.totalMinutes / 60).toFixed(1)} hrs`,
      sub: "Active Flow State",
      icon: Clock,
      color: "text-amber-500 bg-amber-500/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <Card key={idx} className="p-5 transition-all hover:shadow-md">
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground">{m.label}</span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${m.color}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="text-2xl font-extrabold tracking-tight text-foreground">
                {m.val}
              </div>
              <div className="mt-1 text-xs font-medium text-muted-foreground">
                {m.sub}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
