"use client";

import React from "react";
import { useApp } from "@/context/app-context";
import { CheckCircle2, Sparkles, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function TimelineStrip() {
  const { currentDay, setCurrentDay, dayProgress, setActiveTab } = useApp();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-extrabold tracking-tight text-foreground">
          30-Day Master Roadmap
        </h3>
        <p className="text-xs text-muted-foreground">
          Select any day to launch its theory, tasks, and DSA solver.
        </p>
      </div>

      {/* Horizontal Scrollable Track */}
      <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((dayNum) => {
          const isCurrent = dayNum === currentDay;
          const isCompleted = dayProgress[dayNum]?.theoryRead;
          const isPast = dayNum < currentDay;

          return (
            <button
              key={dayNum}
              onClick={() => {
                setCurrentDay(dayNum);
                setActiveTab("workspace");
              }}
              className="focus:outline-none"
            >
              <Card
                className={cn(
                  "flex min-w-[110px] flex-col items-center gap-2 p-3.5 text-center transition-all hover:scale-105",
                  isCurrent && "border-2 border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/20",
                  isCompleted && !isCurrent && "border-emerald-500/30 bg-emerald-500/10"
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs font-bold",
                    isCurrent ? "text-blue-500" : "text-muted-foreground"
                  )}
                >
                  <span>DAY</span>
                  <span className="text-base font-extrabold">{dayNum < 10 ? `0${dayNum}` : dayNum}</span>
                </div>

                {isCompleted ? (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                    <CheckCircle2 size={13} />
                    <span>Done</span>
                  </div>
                ) : isCurrent ? (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-blue-500">
                    <Sparkles size={13} />
                    <span>Active</span>
                  </div>
                ) : isPast ? (
                  <div className="text-[11px] font-semibold text-muted-foreground">
                    Pending
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Lock size={12} />
                    <span>Locked</span>
                  </div>
                )}
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
}
