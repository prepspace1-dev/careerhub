"use client";

import React, { useEffect } from "react";
import { triggerStreakCelebration, playMilestoneFanfare } from "@/lib/effects";
import { Flame, Trophy, Target, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MilestoneModal } from "@/types/app";

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: MilestoneModal | null;
}

export function CelebrationModal({ isOpen, onClose, milestone }: CelebrationModalProps) {
  useEffect(() => {
    if (isOpen) {
      triggerStreakCelebration();
      playMilestoneFanfare();
    }
  }, [isOpen]);

  if (!milestone) return null;

  const getIcon = () => {
    switch (milestone.type) {
      case "streak": return <Flame size={44} className="text-amber-500" />;
      case "dsa": return <Trophy size={44} className="text-emerald-500" />;
      case "project": return <Target size={44} className="text-purple-500" />;
      default: return <Sparkles size={44} className="text-blue-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md text-center p-8 border-blue-500/30 bg-card shadow-2xl">
        <DialogHeader className="text-center sm:text-center items-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 shadow-lg shadow-blue-500/20">
            {getIcon()}
          </div>

          <DialogTitle className="text-2xl font-extrabold tracking-tight text-foreground">
            {milestone.title}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground mt-2">
            {milestone.description}
          </DialogDescription>
        </DialogHeader>

        {milestone.xp && (
          <div className="my-3 flex justify-center">
            <Badge variant="blue" className="px-4 py-1 text-xs font-bold gap-1">
              <Sparkles size={14} />
              <span>+{milestone.xp} XP Earned</span>
            </Badge>
          </div>
        )}

        <Button
          size="lg"
          variant="gradient"
          onClick={onClose}
          className="w-full mt-4 py-5 font-bold shadow-lg shadow-blue-500/20"
        >
          Awesome! Keep Going →
        </Button>
      </DialogContent>
    </Dialog>
  );
}
