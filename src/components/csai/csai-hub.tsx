"use client";

import React, { useState } from "react";
import { useApp } from "@/context/app-context";
import { csAiTopics } from "@/data/csAiData";
import { CheckCircle2, ArrowRight, Layers, LayoutGrid, RotateCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CSAIHub() {
  const { dayProgress, setCurrentDay, setActiveTab, toggleTheoryRead } = useApp();
  const [filterCategory, setFilterCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "flashcards">("grid");
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const categories = ["All", "Systems Foundations", "Data & System Design", "Security, Cloud & AI", "Agentic AI & Engineering", "Mindset & Capstone"];

  const filteredTopics = filterCategory === "All"
    ? csAiTopics
    : csAiTopics.filter((t) => t.category === filterCategory);

  const toggleFlip = (day: number) => {
    setFlippedCards((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <CardContent className="p-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                CS & Modern AI Knowledge Base
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                54 Core Systems & AI Engineering Topics across 30 Days.
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 rounded-xl border border-border/60 bg-muted/40 p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 gap-1.5 text-xs font-bold"
              >
                <LayoutGrid size={14} />
                <span>Grid View</span>
              </Button>

              <Button
                variant={viewMode === "flashcards" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("flashcards")}
                className="h-8 gap-1.5 text-xs font-bold"
              >
                <Layers size={14} />
                <span>3D Flashcards</span>
              </Button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={filterCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory(cat)}
                className="h-8 text-xs font-semibold whitespace-nowrap"
              >
                {cat}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FLASHCARDS VIEW */}
      {viewMode === "flashcards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((t) => {
            const isRead = dayProgress[t.day]?.theoryRead;
            const isFlipped = flippedCards[t.day];

            return (
              <div
                key={t.day}
                className="h-64 cursor-pointer perspective-1000"
                onClick={() => toggleFlip(t.day)}
              >
                <div className={`flashcard-inner ${isFlipped ? "flipped" : ""}`}>
                  {/* FRONT side */}
                  <Card className="flashcard-front p-5 border-border/60 shadow-md">
                    <CardContent className="flex h-full flex-col justify-between p-0">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="blue" className="text-[10px] font-bold">
                            DAY {t.day < 10 ? `0${t.day}` : t.day} • {t.category}
                          </Badge>
                          {isRead && <CheckCircle2 size={16} className="text-emerald-500" />}
                        </div>

                        <h4 className="text-base font-extrabold text-foreground">
                          {t.title}
                        </h4>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {t.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-500/10 p-2 text-xs font-bold text-blue-500">
                        <RotateCw size={14} />
                        <span>Tap to Flip Card</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* BACK side */}
                  <Card className="flashcard-back p-5 border-blue-500/30 bg-muted/90 shadow-xl">
                    <CardContent className="flex h-full flex-col justify-between p-0">
                      <div className="overflow-y-auto space-y-1.5">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500">
                          Concept Recall Key Takeaways
                        </div>
                        <p className="text-xs text-foreground leading-relaxed">
                          {t.overview}
                        </p>
                      </div>

                      <div className="flex gap-2 pt-3">
                        <Button
                          size="sm"
                          variant={isRead ? "outline" : "default"}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTheoryRead(t.day);
                          }}
                          className={isRead ? "flex-1 text-xs h-8 border-emerald-500/30 bg-emerald-500/10 text-emerald-500" : "flex-1 text-xs h-8 bg-emerald-600 hover:bg-emerald-700"}
                        >
                          {isRead ? "✓ Completed" : "Mark Completed"}
                        </Button>

                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentDay(t.day);
                            setActiveTab("workspace");
                          }}
                          className="text-xs h-8"
                        >
                          Full Notes →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* STANDARD GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map((t) => {
            const isRead = dayProgress[t.day]?.theoryRead;
            return (
              <Card key={t.day} className="flex flex-col justify-between p-5 transition-all hover:shadow-md">
                <CardContent className="p-0 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="blue" className="text-[10px]">
                        DAY {t.day < 10 ? `0${t.day}` : t.day}
                      </Badge>
                      {isRead && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                          <CheckCircle2 size={13} />
                          Done
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-foreground">
                      {t.title}
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {t.subtitle}
                    </p>
                    <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {t.overview}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCurrentDay(t.day);
                      setActiveTab("workspace");
                    }}
                    className="justify-start gap-1.5 p-0 text-xs font-bold text-blue-500 hover:text-blue-600 hover:bg-transparent"
                  >
                    <span>Study Day {t.day} Topic</span>
                    <ArrowRight size={14} />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
