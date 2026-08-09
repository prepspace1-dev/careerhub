"use client";

import React from "react";
import { useApp } from "@/context/app-context";
import { csAiTopics } from "@/data/csAiData";
import { CheckCircle2, BookOpen, Layers, Lightbulb, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function LearnTab({ dayNum }: { dayNum: number }) {
  const { dayProgress, toggleTheoryRead } = useApp();
  const topic = csAiTopics.find((t) => t.day === dayNum) || csAiTopics[0];
  const isRead = dayProgress[dayNum]?.theoryRead;

  return (
    <div className="space-y-4">
      {/* Overview Card */}
      <Card className="p-6">
        <CardContent className="p-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-bold text-xs text-blue-500 uppercase tracking-wider">
              <BookOpen size={16} />
              <span>Core Theory & Overview</span>
            </div>
            <Button
              size="sm"
              variant={isRead ? "outline" : "default"}
              onClick={() => toggleTheoryRead(dayNum)}
              className={isRead ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" : "bg-blue-600 hover:bg-blue-700"}
            >
              {isRead ? <CheckCircle2 size={16} className="mr-1.5" /> : <Check size={16} className="mr-1.5" />}
              <span>{isRead ? "Theory Completed ✔" : "Mark Theory Read (+5%)"}</span>
            </Button>
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-foreground">
              {topic.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {topic.overview}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Operations / Key Concepts Section */}
      {topic.operations && topic.operations.length > 0 && (
        <Card className="p-6">
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center gap-2 font-bold text-xs text-purple-500 uppercase tracking-wider">
              <Layers size={16} />
              <span>Key Operations & Architecture Mechanics</span>
            </div>
            <div className="grid gap-2.5">
              {topic.operations.map((op, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border/60 bg-muted/30 p-3.5"
                >
                  <div className="text-xs font-bold text-foreground">
                    {idx + 1}. {op.name}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {op.detail}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real World Example & Takeaway */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topic.realWorldExample && (
          <Card className="p-5">
            <CardContent className="p-0 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-amber-500 uppercase tracking-wider">
                <Lightbulb size={16} />
                <span>Real World Application</span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {topic.realWorldExample}
              </p>
            </CardContent>
          </Card>
        )}

        {topic.takeaway && (
          <Card className="p-5">
            <CardContent className="p-0 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-emerald-500 uppercase tracking-wider">
                <CheckCircle2 size={16} />
                <span>Key Mastery Takeaway</span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {topic.takeaway}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
