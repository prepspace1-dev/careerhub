"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/app-context";
import { dsaProblems } from "@/data/dsaData";
import { csAiTopics } from "@/data/csAiData";
import { projectsData } from "@/data/projectsData";
import { triggerStreakCelebration, playSuccessSound, toggleSound, isSoundEnabled } from "@/lib/effects";
import { 
  Search, 
  Sun, 
  Moon, 
  Flame, 
  Edit2, 
  Check, 
  LogOut, 
  Menu, 
  Code2, 
  BrainCircuit, 
  Kanban, 
  X, 
  Volume2, 
  VolumeX 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TabType } from "@/types/app";

export function Header() {
  const { 
    theme, 
    toggleTheme, 
    currentDay, 
    userStats, 
    userProfile, 
    updateDisplayName, 
    user, 
    logout,
    setMobileMenuOpen,
    setActiveTab,
    setCurrentDay
  } = useApp();

  const userEmail = user?.email || "Local Offline Mode";
  const defaultEmailName = user?.email ? user.email.split("@")[0] : "Engineer";
  const currentDisplayName = userProfile?.displayName && userProfile.displayName !== "Sai" 
    ? userProfile.displayName 
    : defaultEmailName;

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(currentDisplayName);
  const [menuOpen, setMenuOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNameInput(currentDisplayName);
  }, [currentDisplayName]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      updateDisplayName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  const initialLetter = currentDisplayName.charAt(0).toUpperCase();

  const cleanQuery = searchQuery.trim().toLowerCase();
  let searchResults: Array<{ id: number; title: string; day?: number; type: TabType; icon: React.ElementType; label: string }> = [];

  if (cleanQuery.length > 0) {
    const matchedDSA = dsaProblems
      .filter(p => p.title.toLowerCase().includes(cleanQuery) || p.topic.toLowerCase().includes(cleanQuery))
      .slice(0, 4)
      .map(p => ({ id: p.id, title: p.title, day: p.day, type: "dsa" as TabType, icon: Code2, label: `Day ${p.day} • ${p.topic}` }));

    const matchedCS = csAiTopics
      .filter(t => t.title.toLowerCase().includes(cleanQuery) || t.category.toLowerCase().includes(cleanQuery))
      .slice(0, 4)
      .map(t => ({ id: t.day, title: t.title, day: t.day, type: "csai" as TabType, icon: BrainCircuit, label: `Day ${t.day} • ${t.category}` }));

    const matchedProjects = projectsData
      .filter(p => p.title.toLowerCase().includes(cleanQuery) || p.subtitle.toLowerCase().includes(cleanQuery))
      .slice(0, 2)
      .map(p => ({ id: p.id, title: p.title, type: "projects" as TabType, icon: Kanban, label: p.subtitle }));

    searchResults = [...matchedDSA, ...matchedCS, ...matchedProjects];
  }

  const handleSelectSearchResult = (item: { day?: number; type: TabType }) => {
    if (item.day) {
      setCurrentDay(item.day);
    }
    setActiveTab(item.type);
    setSearchQuery("");
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/60 bg-background/95 px-6 backdrop-blur-md">
      {/* Left: Mobile Hamburger Menu & Header Search Bar */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden"
          title="Open Menu"
        >
          <Menu size={18} />
        </Button>

        {/* Compact Header Search */}
        <div ref={searchRef} className="relative">
          <div className="flex w-60 sm:w-72 items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 transition-all focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <Search size={15} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Search topics, problems..."
              value={searchQuery}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              className="w-full bg-transparent text-xs font-medium text-foreground outline-none placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Live Search Results Dropdown */}
          {searchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute top-11 left-0 z-50 flex max-h-96 w-80 flex-col gap-1 overflow-y-auto rounded-xl border border-border/60 bg-popover p-2 shadow-2xl backdrop-blur-md">
              {searchResults.length > 0 ? (
                searchResults.map((item, idx) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={`${item.type}-${item.id || idx}`}
                      onClick={() => handleSelectSearchResult(item)}
                      className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-accent/80"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-blue-500">
                        <ItemIcon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-xs font-bold text-foreground">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {item.label}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No matching topics or problems found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        <Badge variant="blue" className="hidden sm:inline-flex px-3 py-1 text-xs">
          Day {currentDay} of 30
        </Badge>

        <button
          onClick={() => {
            triggerStreakCelebration();
            playSuccessSound();
          }}
          className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-500 hover:bg-amber-500/20 transition-all"
          title="Click to celebrate streak!"
        >
          <Flame size={15} />
          <span>{userStats.streak} Days 🔥</span>
        </button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const isMuted = !isSoundEnabled();
            toggleSound();
            if (isMuted) playSuccessSound();
          }}
          title={isSoundEnabled() ? "Mute Sounds" : "Enable Sounds"}
          className="h-9 w-9"
        >
          {isSoundEnabled() ? <Volume2 size={16} className="text-blue-500" /> : <VolumeX size={16} className="text-muted-foreground" />}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          title="Toggle Theme"
          className="h-9 w-9"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </Button>

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 p-1 pr-3 transition-colors hover:bg-accent"
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs">
                {initialLetter}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline text-xs font-semibold text-foreground">
              {currentDisplayName}
            </span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 z-50 flex w-60 flex-col gap-3 rounded-xl border border-border/60 bg-popover p-4 shadow-2xl">
              <div className="border-b border-border/60 pb-2.5">
                <div className="text-sm font-bold text-foreground">
                  {currentDisplayName}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {userEmail}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-muted-foreground">
                  Display Name
                </label>
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      autoFocus
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                      className="h-8 text-xs"
                    />
                    <Button size="icon" className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700" onClick={handleSaveName}>
                      <Check size={14} />
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="flex w-full items-center justify-between rounded-md border border-border/60 bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
                  >
                    <span>{currentDisplayName}</span>
                    <Edit2 size={12} className="text-muted-foreground" />
                  </button>
                )}
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="w-full justify-start gap-2"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
