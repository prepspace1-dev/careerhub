"use client";

import React, { useState } from "react";
import { useApp } from "@/context/app-context";
import { dsaProblems } from "@/data/dsaData";
import { ExternalLink, HelpCircle, CheckCircle2, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export function DSATab({ dayNum }: { dayNum: number }) {
  const { dsaStatus, updateDSAStatus } = useApp();
  const dayProblems = dsaProblems.filter((p) => p.day === dayNum);
  const [openHintId, setOpenHintId] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {dayProblems.map((prob) => {
        const current = dsaStatus[prob.id] || { status: "Unsolved", notes: "" };
        const isHintOpen = openHintId === prob.id;

        return (
          <Card key={prob.id} className="p-5">
            <CardContent className="p-0 space-y-3">
              {/* Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-muted-foreground">
                    #{prob.leetcodeId}
                  </span>
                  <h4 className="text-sm font-bold text-foreground">
                    {prob.title}
                  </h4>
                  <Badge
                    variant={
                      prob.level === "Easy"
                        ? "easy"
                        : prob.level === "Medium"
                        ? "medium"
                        : "hard"
                    }
                    className="text-[10px] px-2 py-0"
                  >
                    {prob.level}
                  </Badge>
                </div>

                {/* Status Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={current.status === "Solved" ? "default" : "outline"}
                    onClick={() => updateDSAStatus(prob.id, "Solved")}
                    className={current.status === "Solved" ? "bg-emerald-600 hover:bg-emerald-700 h-8 text-xs gap-1" : "h-8 text-xs gap-1"}
                  >
                    <CheckCircle2 size={13} />
                    <span>Solved</span>
                  </Button>

                  <Button
                    size="sm"
                    variant={current.status === "Revision Required" ? "default" : "outline"}
                    onClick={() => updateDSAStatus(prob.id, "Revision Required")}
                    className={current.status === "Revision Required" ? "bg-amber-600 hover:bg-amber-700 h-8 text-xs gap-1" : "h-8 text-xs gap-1"}
                  >
                    <RotateCcw size={13} />
                    <span>Revision</span>
                  </Button>

                  <a
                    href={prob.url || `https://leetcode.com/problems/${prob.title.toLowerCase().replace(/ /g, "-")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" variant="outline" className="h-8 text-xs gap-1 border-blue-500/30 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
                      <span>LeetCode</span>
                      <ExternalLink size={12} />
                    </Button>
                  </a>
                </div>
              </div>

              {/* Hint Accordion */}
              <div>
                <button
                  onClick={() => setOpenHintId(isHintOpen ? null : prob.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:underline"
                >
                  <HelpCircle size={14} />
                  <span>{isHintOpen ? "Hide Intuition & Strategy" : "Show Intuition & Strategy"}</span>
                  {isHintOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {isHintOpen && (
                  <div className="mt-2 rounded-lg border border-border/60 bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
                    💡 <strong>Intuition:</strong> {prob.hint || "Focus on optimal space and time complexity using standard pattern techniques."}
                  </div>
                )}
              </div>

              {/* Notes Input */}
              <Input
                type="text"
                placeholder="Personal notes (e.g., 'Used sliding window with hashset')..."
                value={current.notes || ""}
                onChange={(e) => updateDSAStatus(prob.id, current.status, { notes: e.target.value })}
                className="h-8 text-xs"
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
