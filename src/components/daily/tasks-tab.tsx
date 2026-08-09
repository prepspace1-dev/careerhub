"use client";

import React from "react";
import { useApp } from "@/context/app-context";
import { dsaProblems } from "@/data/dsaData";
import { CheckSquare, Square, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function TasksTab({ dayNum }: { dayNum: number }) {
  const { dayProgress, toggleDayTask } = useApp();
  const dayDsa = dsaProblems.filter((p) => p.day === dayNum);

  const defaultTasks = [
    { id: "read_theory", title: "Read Theory & Conceptual Guide" },
    ...dayDsa.map((p) => ({ id: `dsa_prob_${p.id}`, title: `Solve DSA #${p.leetcodeId}: ${p.title} (${p.level})` })),
    { id: "project_sprint", title: `Complete Day ${dayNum} Project Sprint Milestone` },
    { id: "write_reflection", title: "Write End-of-Day Notes & Reflection" }
  ];

  const currentDayTasks = dayProgress[dayNum]?.tasks || {};
  const completedCount = defaultTasks.filter((t) => currentDayTasks[t.id]).length;
  const progressPercent = Math.round((completedCount / (defaultTasks.length || 1)) * 100);

  return (
    <div className="space-y-4">
      {/* Header Progress Card */}
      <Card className="p-5">
        <CardContent className="p-0 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-foreground">
                Today&apos;s Action Checklist
              </h3>
              <p className="text-xs text-muted-foreground">
                {completedCount} of {defaultTasks.length} tasks completed
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-lg font-extrabold text-blue-500">
              <CheckCircle2 size={20} />
              <span>{progressPercent}%</span>
            </div>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </CardContent>
      </Card>

      {/* Task List */}
      <Card className="p-3">
        <CardContent className="p-0 space-y-1.5">
          {defaultTasks.map((t) => {
            const isDone = !!currentDayTasks[t.id];
            return (
              <button
                key={t.id}
                onClick={() => toggleDayTask(dayNum, t.id)}
                className={cn(
                  "flex w-full items-center gap-3.5 rounded-xl border p-3.5 text-left transition-all hover:bg-accent/60",
                  isDone 
                    ? "border-emerald-500/30 bg-emerald-500/10 text-muted-foreground line-through"
                    : "border-border/60 bg-muted/30 text-foreground font-medium"
                )}
              >
                <div className={isDone ? "text-emerald-500" : "text-muted-foreground"}>
                  {isDone ? <CheckSquare size={20} /> : <Square size={20} />}
                </div>
                <span className="text-xs sm:text-sm flex-1">
                  {t.title}
                </span>
              </button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
