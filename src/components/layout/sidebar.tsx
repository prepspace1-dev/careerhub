"use client";

import React from "react";
import { useApp } from "@/context/app-context";
import { 
  LayoutDashboard, 
  Map, 
  Code2, 
  BrainCircuit, 
  Kanban, 
  BarChart2, 
  Flame, 
  Sparkles,
  X 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TabType } from "@/types/app";

export function Sidebar() {
  const { 
    activeTab, 
    setActiveTab, 
    currentDay, 
    overallPercentage, 
    userStats, 
    mobileMenuOpen, 
    setMobileMenuOpen 
  } = useApp();

  const navItems: { id: TabType; label: string; icon: React.ElementType; badge?: string; count?: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "workspace", label: `Day ${currentDay} Workspace`, icon: Sparkles, badge: "Active" },
    { id: "roadmap", label: "30-Day Roadmap", icon: Map },
    { id: "dsa", label: "DSA Sheet", icon: Code2, count: "90" },
    { id: "csai", label: "CS & AI Hub", icon: BrainCircuit, count: "54" },
    { id: "projects", label: "Projects", icon: Kanban, count: "4" },
    { id: "stats", label: "Analytics", icon: BarChart2 }
  ];

  const handleNavClick = (id: TabType) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 min-w-60 flex-col border-r border-border/60 bg-background/95 p-5 transition-transform duration-300 lg:static lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="mb-6 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 font-bold text-white text-lg shadow-md shadow-blue-500/20">
              C
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-foreground">
                CAREERHUB
              </h1>
              <span className="font-bold text-[10px] tracking-wider text-blue-500 uppercase">
                30-Day OS
              </span>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-muted-foreground hover:text-foreground lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-1 flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all",
                  isActive
                    ? "bg-accent/80 text-foreground font-semibold shadow-sm border border-border/80"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <Icon
                  size={18}
                  className={cn(
                    "transition-colors",
                    isActive ? "text-blue-500" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <Badge variant="default" className="h-5 bg-blue-600 text-[10px] text-white px-2">
                    {item.badge}
                  </Badge>
                )}
                {item.count && (
                  <span className="text-xs font-semibold text-muted-foreground">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mini Streak Card */}
        <div className="mt-auto rounded-xl border border-border/60 bg-card p-3.5 shadow-sm">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">Overall Journey</span>
            <span className="font-bold text-blue-500">{overallPercentage}%</span>
          </div>
          <Progress value={overallPercentage} className="h-1.5" />
          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-amber-500 dark:text-amber-400">
            <Flame size={15} />
            <span>{userStats.streak} Day Streak!</span>
          </div>
        </div>
      </aside>
    </>
  );
}
