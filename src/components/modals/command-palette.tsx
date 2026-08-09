"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/context/app-context";
import { dsaProblems } from "@/data/dsaData";
import { csAiTopics } from "@/data/csAiData";
import { projectsData } from "@/data/projectsData";
import { Search, Code2, BrainCircuit, Kanban, Calendar } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, setCurrentDay, setActiveTab } = useApp();
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const results: Array<{
      type: string;
      title: string;
      subtitle: string;
      icon: React.ElementType;
      action: () => void;
    }> = [];

    // Search Days
    for (let i = 1; i <= 30; i++) {
      if (`day ${i}`.includes(q) || `day${i}`.includes(q)) {
        results.push({
          type: "Day",
          title: `Day ${i} Workspace`,
          subtitle: `Jump to Day ${i}`,
          icon: Calendar,
          action: () => {
            setCurrentDay(i);
            setActiveTab("workspace");
          }
        });
      }
    }

    // Search DSA Problems
    dsaProblems.forEach((p) => {
      if (
        p.title.toLowerCase().includes(q) ||
        p.topic.toLowerCase().includes(q) ||
        `leetcode ${p.leetcodeId}`.includes(q) ||
        `#${p.leetcodeId}`.includes(q)
      ) {
        results.push({
          type: "DSA",
          title: `#${p.leetcodeId} ${p.title}`,
          subtitle: `Day ${p.day} · ${p.level} · ${p.topic}`,
          icon: Code2,
          action: () => {
            if (p.day) setCurrentDay(p.day);
            setActiveTab("workspace");
          }
        });
      }
    });

    // Search CS & AI Topics
    csAiTopics.forEach((t) => {
      if (
        t.title.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      ) {
        results.push({
          type: "CS & AI",
          title: t.title,
          subtitle: `Day ${t.day} · ${t.category}`,
          icon: BrainCircuit,
          action: () => {
            setCurrentDay(t.day);
            setActiveTab("workspace");
          }
        });
      }
    });

    // Search Projects
    projectsData.forEach((proj) => {
      if (
        proj.title.toLowerCase().includes(q) ||
        proj.subtitle.toLowerCase().includes(q)
      ) {
        results.push({
          type: "Project",
          title: proj.title,
          subtitle: proj.subtitle,
          icon: Kanban,
          action: () => {
            setActiveTab("projects");
          }
        });
      }
    });

    return results.slice(0, 10);
  }, [query, setCurrentDay, setActiveTab]);

  return (
    <Dialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden shadow-2xl">
        {/* Input Header */}
        <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            autoFocus
            type="text"
            placeholder="Type a problem, topic, or 'Day 12'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 bg-transparent text-sm text-foreground outline-none focus-visible:ring-0 shadow-none"
          />
        </div>

        {/* Results List */}
        <div className="max-h-[360px] overflow-y-auto p-2">
          {searchResults.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              {query.trim() ? "No matching topics or problems found." : "Start typing to search across 30 days of content..."}
            </div>
          ) : (
            <div className="space-y-1">
              {searchResults.map((res, idx) => {
                const Icon = res.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      res.action();
                      setCommandPaletteOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-accent/80"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-blue-500">
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-xs font-bold text-foreground">{res.title}</div>
                      <div className="truncate text-[11px] text-muted-foreground">{res.subtitle}</div>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {res.type}
                    </Badge>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
