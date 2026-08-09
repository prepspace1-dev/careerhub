"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/context/app-context";
import { dsaProblems } from "@/data/dsaData";
import { Search, ExternalLink, CheckCircle2, RotateCcw, Circle, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DSAProblem } from "@/types/app";

export function DSAVault() {
  const { dsaStatus, updateDSAStatus, setCurrentDay, setActiveTab } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [activeProblem, setActiveProblem] = useState<DSAProblem | null>(null);
  const [showHint, setShowHint] = useState(false);

  const filteredProblems = useMemo(() => {
    return dsaProblems.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `#${p.leetcodeId}`.includes(searchTerm);

      const matchLevel = selectedLevel === "All" || p.level === selectedLevel;

      const currentStatus = dsaStatus[p.id]?.status || "Unsolved";
      const matchStatus = selectedStatus === "All" || currentStatus === selectedStatus;

      return matchSearch && matchLevel && matchStatus;
    });
  }, [searchTerm, selectedLevel, selectedStatus, dsaStatus]);

  const solvedCount = Object.values(dsaStatus).filter((item) => item.status === "Solved").length;

  const openDrawer = (p: DSAProblem) => {
    setActiveProblem(p);
    setShowHint(false);
  };

  return (
    <div className="space-y-6">
      {/* Vault Header */}
      <Card className="p-6">
        <CardContent className="p-0 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                30-Day DSA Mastery Vault
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                90 Curated Problems from Striver&apos;s Sheet & NeetCode 150.
              </p>
            </div>
            <Badge variant="blue" className="px-4 py-1.5 text-sm font-bold">
              {solvedCount} / 90 Solved
            </Badge>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search problems by name, topic, or LeetCode #..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-40 text-xs">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Difficulties</SelectItem>
                <SelectItem value="Easy">Easy (38)</SelectItem>
                <SelectItem value="Medium">Medium (45)</SelectItem>
                <SelectItem value="Hard">Hard (7)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Solved">Solved</SelectItem>
                <SelectItem value="Revision Required">Revision Required</SelectItem>
                <SelectItem value="Unsolved">Unsolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Problems Table */}
      <Card className="p-2 overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-border/60 text-muted-foreground font-semibold">
              <th className="p-3">Day</th>
              <th className="p-3">#</th>
              <th className="p-3">Problem Name</th>
              <th className="p-3">Topic</th>
              <th className="p-3">Level</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProblems.map((p) => {
              const currentStatus = dsaStatus[p.id]?.status || "Unsolved";
              const isSolved = currentStatus === "Solved";
              const isRevision = currentStatus === "Revision Required";

              return (
                <tr key={p.id} className="border-b border-border/40 hover:bg-accent/40 transition-colors">
                  <td className="p-3 font-bold text-blue-500">
                    <button
                      onClick={() => {
                        if (p.day) setCurrentDay(p.day);
                        setActiveTab("workspace");
                      }}
                      className="font-bold hover:underline"
                    >
                      Day {p.day}
                    </button>
                  </td>
                  <td className="p-3 text-muted-foreground">#{p.leetcodeId}</td>
                  <td className="p-3 font-bold text-foreground">
                    <button
                      onClick={() => openDrawer(p)}
                      className="inline-flex items-center gap-1.5 text-left font-bold text-foreground hover:text-blue-500"
                    >
                      <span>{p.title}</span>
                      <Lightbulb size={13} className="text-amber-500" />
                    </button>
                  </td>
                  <td className="p-3 text-muted-foreground">{p.topic}</td>
                  <td className="p-3">
                    <Badge
                      variant={
                        p.level === "Easy"
                          ? "easy"
                          : p.level === "Medium"
                          ? "medium"
                          : "hard"
                      }
                      className="text-[10px] px-2 py-0"
                    >
                      {p.level}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => updateDSAStatus(p.id, isSolved ? "Unsolved" : "Solved")}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/40 px-2.5 py-1 text-xs font-bold transition-all hover:bg-accent"
                    >
                      {isSolved ? (
                        <CheckCircle2 size={13} className="text-emerald-500" />
                      ) : isRevision ? (
                        <RotateCcw size={13} className="text-amber-500" />
                      ) : (
                        <Circle size={13} className="text-muted-foreground" />
                      )}
                      <span>{currentStatus}</span>
                    </button>
                  </td>
                  <td className="p-3">
                    <a
                      href={p.url || `https://leetcode.com/problems/${p.title.toLowerCase().replace(/ /g, "-")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-blue-500 hover:underline"
                    >
                      <span>LeetCode</span>
                      <ExternalLink size={12} />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Slide-over Detail Sheet */}
      <Sheet open={!!activeProblem} onOpenChange={(open) => !open && setActiveProblem(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md space-y-6 overflow-y-auto">
          {activeProblem && (
            <>
              <SheetHeader>
                <div className="text-xs font-bold text-blue-500">
                  Day {activeProblem.day} • LeetCode #{activeProblem.leetcodeId}
                </div>
                <SheetTitle className="text-xl font-extrabold text-foreground">
                  {activeProblem.title}
                </SheetTitle>
                <div className="flex gap-2 pt-1">
                  <Badge
                    variant={
                      activeProblem.level === "Easy"
                        ? "easy"
                        : activeProblem.level === "Medium"
                        ? "medium"
                        : "hard"
                    }
                  >
                    {activeProblem.level}
                  </Badge>
                  <Badge variant="secondary">{activeProblem.topic}</Badge>
                </div>
              </SheetHeader>

              {/* Progressive Hint Box */}
              <Card className="border-amber-500/30 bg-amber-500/10 p-4">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-500 mb-2">
                  <Lightbulb size={16} />
                  <span>Progressive Hint & Strategy</span>
                </div>
                {showHint ? (
                  <p className="text-xs leading-relaxed text-foreground">
                    {activeProblem.hint || "Focus on optimal space and time complexity using standard pattern techniques."}
                  </p>
                ) : (
                  <Button
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5 text-xs font-bold"
                    onClick={() => setShowHint(true)}
                  >
                    <Lightbulb size={14} />
                    <span>Reveal Hint 1 (Concept Pattern)</span>
                  </Button>
                )}
              </Card>

              {/* Status Update */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">
                  Update Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500 font-bold text-xs"
                    onClick={() => updateDSAStatus(activeProblem.id, "Solved")}
                  >
                    ✓ Mark Solved
                  </Button>
                  <Button
                    variant="outline"
                    className="border-amber-500/30 bg-amber-500/10 text-amber-500 font-bold text-xs"
                    onClick={() => updateDSAStatus(activeProblem.id, "Revision Required")}
                  >
                    ⚡ Revision Needed
                  </Button>
                </div>
              </div>

              {/* LeetCode Link */}
              <a
                href={activeProblem.url || `https://leetcode.com/problems/${activeProblem.title.toLowerCase().replace(/ /g, "-")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold">
                  <span>Solve Problem on LeetCode</span>
                  <ExternalLink size={15} />
                </Button>
              </a>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
