"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/app-context";
import { csAiTopics } from "@/data/csAiData";
import { LearnTab } from "./learn-tab";
import { TasksTab } from "./tasks-tab";
import { DSATab } from "./dsa-tab";
import { NotesTab } from "./notes-tab";
import { ResourcesTab } from "./resources-tab";
import { BookOpen, CheckSquare, Code2, FileText, Link as LinkIcon, Clock, Play, Pause, RotateCcw, Columns } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DailyWorkspace() {
  const { currentDay } = useApp();
  const [activeTab, setActiveTab] = useState("learn");
  const [splitPaneMode, setSplitPaneMode] = useState(false);

  // Pomodoro Focus Timer State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timerSeconds]);

  const toggleTimer = () => setTimerActive(!timerActive);
  const resetTimer = () => {
    setTimerActive(false);
    setTimerSeconds(25 * 60);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const topic = csAiTopics.find((t) => t.day === currentDay) || csAiTopics[0];

  return (
    <div className="space-y-6">
      {/* Workspace Header Banner */}
      <Card className="p-6">
        <CardContent className="p-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="blue" className="text-[10px] uppercase tracking-wider font-bold">
                  Day {currentDay < 10 ? `0${currentDay}` : currentDay} Workspace
                </Badge>
                <span className="text-xs font-semibold text-muted-foreground">
                  {topic.category}
                </span>
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                {topic.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {topic.subtitle}
              </p>
            </div>

            {/* Actions Right: Pomodoro Timer & Split View */}
            <div className="flex items-center gap-3">
              <Button
                variant={splitPaneMode ? "default" : "outline"}
                size="sm"
                onClick={() => setSplitPaneMode(!splitPaneMode)}
                className="gap-1.5 text-xs font-bold"
              >
                <Columns size={15} />
                <span>{splitPaneMode ? "Single View" : "Split View"}</span>
              </Button>

              {/* Pomodoro Timer */}
              <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-1.5">
                <Clock size={15} className={timerActive ? "text-emerald-500" : "text-blue-500"} />
                <span className="font-mono text-xs font-bold text-foreground">
                  {formatTimer(timerSeconds)}
                </span>
                <button
                  onClick={toggleTimer}
                  className={timerActive ? "text-amber-500 hover:text-amber-600" : "text-emerald-500 hover:text-emerald-600"}
                  title={timerActive ? "Pause" : "Start"}
                >
                  {timerActive ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button onClick={resetTimer} className="text-muted-foreground hover:text-foreground" title="Reset">
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Sub Tab Selection */}
          {!splitPaneMode && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full pt-2">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="learn" className="gap-1.5 text-xs">
                  <BookOpen size={14} />
                  <span>Learn Theory</span>
                </TabsTrigger>
                <TabsTrigger value="tasks" className="gap-1.5 text-xs">
                  <CheckSquare size={14} />
                  <span>Today's Tasks</span>
                </TabsTrigger>
                <TabsTrigger value="dsa" className="gap-1.5 text-xs">
                  <Code2 size={14} />
                  <span>DSA Solver</span>
                </TabsTrigger>
                <TabsTrigger value="notes" className="gap-1.5 text-xs">
                  <FileText size={14} />
                  <span>Notes & Reflection</span>
                </TabsTrigger>
                <TabsTrigger value="resources" className="gap-1.5 text-xs">
                  <LinkIcon size={14} />
                  <span>Resources</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Content Rendering */}
      {splitPaneMode ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LearnTab dayNum={currentDay} />
          <div className="space-y-6">
            <TasksTab dayNum={currentDay} />
            <NotesTab dayNum={currentDay} />
          </div>
        </div>
      ) : (
        <>
          {activeTab === "learn" && <LearnTab dayNum={currentDay} />}
          {activeTab === "tasks" && <TasksTab dayNum={currentDay} />}
          {activeTab === "dsa" && <DSATab dayNum={currentDay} />}
          {activeTab === "notes" && <NotesTab dayNum={currentDay} />}
          {activeTab === "resources" && <ResourcesTab dayNum={currentDay} />}
        </>
      )}
    </div>
  );
}
