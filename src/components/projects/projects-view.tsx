"use client";

import React, { useState } from "react";
import { useApp } from "@/context/app-context";
import { projectsData } from "@/data/projectsData";
import { CheckSquare, Square, Copy, Check, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function ProjectsView() {
  const { projectMilestones, toggleProjectMilestone } = useApp();
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);

  const copyBullet = (text: string, key: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedIdx(key);
      setTimeout(() => setCopiedIdx(null), 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <CardContent className="p-0 space-y-1">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            30-Day Capstone Project Sprints
          </h2>
          <p className="text-sm text-muted-foreground">
            4 Deployed, Production-Grade Projects to showcase on your GitHub and resume.
          </p>
        </CardContent>
      </Card>

      {/* Projects List */}
      <div className="space-y-6">
        {projectsData.map((proj) => {
          const projMap = projectMilestones[proj.id] || {};
          const doneCount = proj.milestones.filter((m) => projMap[m.day]).length;
          const totalCount = proj.milestones.length;
          const progressPercent = Math.round((doneCount / (totalCount || 1)) * 100);

          return (
            <Card key={proj.id} className="p-6 transition-all hover:shadow-lg">
              <CardContent className="p-0 space-y-6">
                {/* Top Details */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <Badge variant="blue" className="text-[10px] uppercase font-bold mb-1">
                      Sprint Project #{proj.id}
                    </Badge>
                    <h3 className="text-xl font-extrabold text-foreground">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {proj.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="px-3 py-1 text-xs font-bold text-blue-500 bg-blue-500/10">
                      {progressPercent}% Complete
                    </Badge>
                  </div>
                </div>

                {/* Progress Bar */}
                <Progress value={progressPercent} className="h-1.5" />

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {proj.techStack.map((tech, i) => (
                    <Badge key={i} variant="outline" className="text-[11px] font-semibold bg-muted/30">
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* Milestones Checklist */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Daily Build Deliverables
                  </h4>
                  <div className="grid gap-2">
                    {proj.milestones.map((m) => {
                      const isDone = !!projMap[m.day];
                      return (
                        <button
                          key={m.day}
                          onClick={() => toggleProjectMilestone(proj.id, m.day)}
                          className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all hover:bg-accent/60 ${
                            isDone 
                              ? "border-emerald-500/30 bg-emerald-500/10 text-muted-foreground" 
                              : "border-border/60 bg-muted/30 text-foreground"
                          }`}
                        >
                          <div className={isDone ? "text-emerald-500 mt-0.5" : "text-muted-foreground mt-0.5"}>
                            {isDone ? <CheckSquare size={18} /> : <Square size={18} />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-foreground">
                              Day {m.day}: {m.title}
                            </div>
                            <div className="text-[11px] text-muted-foreground mt-0.5">
                              {m.deliverable}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Resume Bullets Section */}
                <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-500 uppercase tracking-wider">
                    <Sparkles size={14} />
                    <span>Resume Bullet Points (Ready to Copy)</span>
                  </div>
                  <div className="space-y-2">
                    {proj.resumeBullets ? (
                      proj.resumeBullets.map((bullet, idx) => {
                        const uniqueKey = `${proj.id}-${idx}`;
                        const isCopied = copiedIdx === uniqueKey;
                        return (
                          <div key={idx} className="flex items-start justify-between gap-3 text-xs text-muted-foreground leading-relaxed">
                            <span>• {bullet}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => copyBullet(bullet, uniqueKey)}
                              className="h-6 w-6 shrink-0"
                            >
                              {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                            </Button>
                          </div>
                        );
                      })
                    ) : proj.description ? (
                      <div className="flex items-start justify-between gap-3 text-xs text-muted-foreground leading-relaxed">
                        <span>• {proj.description}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => copyBullet(proj.description || "", `${proj.id}-desc`)}
                          className="h-6 w-6 shrink-0"
                        >
                          {copiedIdx === `${proj.id}-desc` ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
