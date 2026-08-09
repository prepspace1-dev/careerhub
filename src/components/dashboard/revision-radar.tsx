"use client";

import React from "react";
import { useApp } from "@/context/app-context";
import { dsaProblems } from "@/data/dsaData";
import { RotateCcw, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function RevisionRadar() {
  const { dsaStatus, updateDSAStatus, setCurrentDay, setActiveTab } = useApp();

  const revisionProblems: Array<{
    id: number;
    title: string;
    leetcodeId?: number;
    day?: number;
    status: string;
    bookmarked?: boolean;
    notes?: string;
  }> = [];

  Object.entries(dsaStatus).forEach(([idStr, item]) => {
    if (item.status === "Revision Required" || item.bookmarked) {
      const prob = dsaProblems.find((p) => p.id === parseInt(idStr, 10));
      if (prob) {
        revisionProblems.push({
          id: prob.id,
          title: prob.title,
          leetcodeId: prob.leetcodeId,
          day: prob.day,
          status: item.status,
          bookmarked: item.bookmarked,
          notes: item.notes
        });
      }
    }
  });

  return (
    <Card className="p-6">
      <CardContent className="p-0 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-500">
              <RotateCcw size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight text-foreground">
                Smart Revision Radar 🔁
              </h3>
              <p className="text-xs text-muted-foreground">
                {revisionProblems.length > 0
                  ? `${revisionProblems.length} items flagged for review`
                  : "All clear! No items flagged for revision"}
              </p>
            </div>
          </div>

          {revisionProblems.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("dsa")}
              className="text-xs font-bold text-blue-500 hover:text-blue-600"
            >
              View Vault →
            </Button>
          )}
        </div>

        {/* Content */}
        {revisionProblems.length === 0 ? (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-500">
            <Sparkles size={20} className="shrink-0" />
            <span className="text-xs font-medium leading-relaxed">
              Awesome job! You have no pending revisions. Mark any problem as <strong>Revision Required</strong> in the DSA sheet to queue it here.
            </span>
          </div>
        ) : (
          <div className="space-y-2.5">
            {revisionProblems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="blue" className="text-[10px] px-2 py-0">
                      Day {item.day}
                    </Badge>
                    <Badge
                      variant={item.status === "Revision Required" ? "medium" : "purple"}
                      className="text-[10px] px-2 py-0"
                    >
                      {item.status === "Revision Required" ? "Revision Required" : "Bookmarked"}
                    </Badge>
                  </div>
                  <h4 className="truncate text-xs font-bold text-foreground">
                    #{item.leetcodeId} {item.title}
                  </h4>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (item.day) setCurrentDay(item.day);
                      setActiveTab("workspace");
                    }}
                    className="h-8 gap-1 text-xs font-bold text-blue-500 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20"
                  >
                    <span>Practice</span>
                    <ArrowRight size={12} />
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateDSAStatus(item.id, "Solved", { bookmarked: false })}
                    title="Mark as Mastered"
                    className="h-8 gap-1 text-xs font-bold text-emerald-500 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20"
                  >
                    <CheckCircle2 size={13} />
                    <span>Done</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
