"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/app-context";
import { FileText, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export function NotesTab({ dayNum }: { dayNum: number }) {
  const { dailyNotes, saveDayNote, dayProgress, saveReflection } = useApp();
  
  const [noteContent, setNoteContent] = useState(dailyNotes[dayNum] || "");
  const [savedStatus, setSavedStatus] = useState(false);

  const reflection = dayProgress[dayNum]?.reflection || { learned: "", difficult: "", revise: "" };
  const [learned, setLearned] = useState((reflection.learned as string) || "");
  const [difficult, setDifficult] = useState((reflection.difficult as string) || "");
  const [revise, setRevise] = useState((reflection.revise as string) || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      saveDayNote(dayNum, noteContent);
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 1500);
    }, 600);
    return () => clearTimeout(timer);
  }, [noteContent, dayNum, saveDayNote]);

  const handleSaveReflection = () => {
    saveReflection(dayNum, { learned, difficult, revise });
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 1500);
  };

  return (
    <div className="space-y-4">
      {/* Markdown Notes Editor */}
      <Card className="p-6">
        <CardContent className="p-0 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xs text-blue-500 uppercase tracking-wider">
              <FileText size={16} />
              <span>Day {dayNum} Notes & Key Concepts</span>
            </div>
            {savedStatus && (
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
                <Check size={14} />
                <span>Autosaved</span>
              </div>
            )}
          </div>

          <Textarea
            rows={10}
            placeholder="Write your notes, code snippets, or key takeaways here..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className="font-mono text-xs leading-relaxed bg-muted/30 resize-y"
          />
        </CardContent>
      </Card>

      {/* End of Day Reflection */}
      <Card className="p-6">
        <CardContent className="p-0 space-y-4">
          <h4 className="text-sm font-bold text-foreground">
            End-of-Day Reflection
          </h4>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                What did you learn today?
              </label>
              <Input
                type="text"
                placeholder="e.g. Understood Floyd's cycle detection algorithm..."
                value={learned}
                onChange={(e) => setLearned(e.target.value)}
                onBlur={handleSaveReflection}
                className="text-xs"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                What was difficult?
              </label>
              <Input
                type="text"
                placeholder="e.g. Handling edge cases for empty linked lists..."
                value={difficult}
                onChange={(e) => setDifficult(e.target.value)}
                onBlur={handleSaveReflection}
                className="text-xs"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                What should you revise later?
              </label>
              <Input
                type="text"
                placeholder="e.g. Re-attempt #141 Cycle Detection cold tomorrow..."
                value={revise}
                onChange={(e) => setRevise(e.target.value)}
                onBlur={handleSaveReflection}
                className="text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
