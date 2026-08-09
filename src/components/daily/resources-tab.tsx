"use client";

import React from "react";
import { csAiTopics } from "@/data/csAiData";
import { ExternalLink, Link as LinkIcon, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ResourcesTab({ dayNum }: { dayNum: number }) {
  const topic = csAiTopics.find((t) => t.day === dayNum) || csAiTopics[0];

  const defaultResources = [
    { title: `${topic.title} — Conceptual Guide & Deep Dive`, type: "Documentation", url: "https://developer.mozilla.org" },
    { title: "Standard Algorithm & Data Structure Visualizer", type: "Interactive Tool", url: "https://visualgo.net" },
    { title: "SDE Technical Interview Preparation Sheet", type: "Cheat Sheet", url: "https://leetcode.com" }
  ];

  return (
    <Card className="p-6">
      <CardContent className="p-0 space-y-4">
        <div className="flex items-center gap-2 font-bold text-xs text-blue-500 uppercase tracking-wider">
          <BookOpen size={16} />
          <span>Curated Reading & External Resources</span>
        </div>

        <div className="space-y-2.5">
          {defaultResources.map((res, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                  <LinkIcon size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    {res.title}
                  </h4>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {res.type}
                  </span>
                </div>
              </div>

              <a href={res.url} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="h-8 gap-1 text-xs">
                  <span>Open</span>
                  <ExternalLink size={12} />
                </Button>
              </a>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
