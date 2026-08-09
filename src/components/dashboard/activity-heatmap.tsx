"use client";

import React from "react";
import { useApp } from "@/context/app-context";
import { dsaProblems } from "@/data/dsaData";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ActivityHeatmap() {
  const { dayProgress, dsaStatus, currentDay, setCurrentDay, setActiveTab } = useApp();

  const getDayData = (dayNum: number) => {
    const progress = dayProgress[dayNum] || {};
    const theoryRead = !!progress.theoryRead;
    
    const dayDSA = dsaProblems.filter((p) => p.day === dayNum);
    const dsaSolvedCount = dayDSA.filter((p) => dsaStatus[p.id]?.status === "Solved").length;
    const dsaTotalCount = dayDSA.length;

    let score = 0;
    if (theoryRead) score += 40;
    if (dsaTotalCount > 0) {
      score += Math.round((dsaSolvedCount / dsaTotalCount) * 60);
    } else if (theoryRead) {
      score = 100;
    }

    let level = 0;
    if (score > 66) level = 3;
    else if (score > 33) level = 2;
    else if (score > 0) level = 1;

    return { dayNum, score, level, theoryRead, dsaSolvedCount, dsaTotalCount };
  };

  const days = Array.from({ length: 30 }, (_, i) => getDayData(i + 1));
  const activeCount = days.filter((d) => d.score > 0).length;

  return (
    <Card className="p-6">
      <CardContent className="p-0 space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight text-foreground">
                30-Day Activity Matrix 🟩
              </h3>
              <p className="text-xs text-muted-foreground">
                {activeCount} of 30 days active • Click any tile to jump to workspace
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
            <span>Less</span>
            <div className="h-3 w-3 rounded-sm border border-border bg-muted/40" />
            <div className="h-3 w-3 rounded-sm bg-emerald-500/30" />
            <div className="h-3 w-3 rounded-sm bg-emerald-500/65" />
            <div className="h-3 w-3 rounded-sm bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span>More</span>
          </div>
        </div>

        {/* Grid of 30 Days */}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
          {days.map((day) => {
            const isCurrent = day.dayNum === currentDay;

            return (
              <button
                key={day.dayNum}
                onClick={() => {
                  setCurrentDay(day.dayNum);
                  setActiveTab("workspace");
                }}
                title={`Day ${day.dayNum}: ${day.score}% Complete (${day.dsaSolvedCount}/${day.dsaTotalCount} DSA Solved)`}
                className={cn(
                  "relative flex aspect-square flex-col items-center justify-center rounded-lg text-xs font-bold transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500",
                  day.level === 3 && "bg-emerald-600 text-white shadow-md shadow-emerald-600/30",
                  day.level === 2 && "bg-emerald-500/60 text-white border border-emerald-500/70",
                  day.level === 1 && "bg-emerald-500/25 text-foreground border border-emerald-500/40",
                  day.level === 0 && "bg-muted/40 text-muted-foreground border border-border/60",
                  isCurrent && "border-2 border-blue-500 ring-2 ring-blue-500/20"
                )}
              >
                <span>{day.dayNum}</span>
                {isCurrent && (
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
