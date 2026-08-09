"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { storageService } from "@/lib/storage";
import { dsaProblems } from "@/data/dsaData";
import { csAiTopics } from "@/data/csAiData";
import { projectsData } from "@/data/projectsData";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { playSuccessSound, triggerConfetti } from "@/lib/effects";
import { 
  AppContextType, 
  TabType, 
  DayProgress, 
  DSAProblemStatus, 
  MilestoneModal, 
  UserProfileState,
  UserStats
} from "@/types/app";

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // Theme state
  const [theme, setThemeState] = useState<"dark" | "light">("dark");
  
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Navigation & Day State
  const [activeTab, setActiveTabState] = useState<TabType>("dashboard");
  const [currentDay, setCurrentDayState] = useState<number>(1);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Milestone Celebration Modal State
  const [activeMilestoneModal, setActiveMilestoneModal] = useState<MilestoneModal | null>(null);

  // User Data State
  const [dayProgress, setDayProgress] = useState<Record<number, DayProgress>>({});
  const [dsaStatus, setDsaStatus] = useState<Record<number, DSAProblemStatus>>({});
  const [projectMilestones, setProjectMilestones] = useState<Record<number, Record<number, boolean>>>({});
  const [dailyNotes, setDailyNotes] = useState<Record<number, string>>({});
  const [userProfile, setUserProfile] = useState<UserProfileState>({ displayName: "" });

  useEffect(() => {
    setThemeState(storageService.getTheme());
    setCurrentDayState(storageService.getCurrentDay());
    setDayProgress(storageService.getDayProgress());
    setDsaStatus(storageService.getDSAStatus());
    setProjectMilestones(storageService.getProjectMilestones());
    setDailyNotes(storageService.getDailyNotes());
    setUserProfile(storageService.getUserProfile());
  }, []);

  const getPathForTab = (tab: TabType, day: number) => {
    switch (tab) {
      case "dashboard": return "/dashboard";
      case "workspace": return `/workspace/day-${day}`;
      case "roadmap": return "/roadmap";
      case "dsa": return "/dsa-sheet";
      case "csai": return "/cs-ai-hub";
      case "projects": return "/projects";
      case "stats": return "/analytics";
      default: return "/dashboard";
    }
  };

  const parsePathRoute = () => {
    if (typeof window === "undefined") return;
    const path = window.location.pathname;
    if (path.startsWith("/workspace")) {
      const dayStr = path.replace("/workspace/day-", "").replace("/workspace", "");
      const dayNum = parseInt(dayStr, 10);
      if (!isNaN(dayNum) && dayNum >= 1 && dayNum <= 30) {
        setCurrentDayState(dayNum);
        storageService.setCurrentDay(dayNum);
      }
      setActiveTabState("workspace");
    } else if (path === "/roadmap") {
      setActiveTabState("roadmap");
    } else if (path === "/dsa-sheet") {
      setActiveTabState("dsa");
    } else if (path === "/cs-ai-hub") {
      setActiveTabState("csai");
    } else if (path === "/projects") {
      setActiveTabState("projects");
    } else if (path === "/analytics" || path === "/stats") {
      setActiveTabState("stats");
    } else {
      setActiveTabState("dashboard");
    }
  };

  useEffect(() => {
    parsePathRoute();
    const handlePopState = () => parsePathRoute();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
    if (typeof window !== "undefined") {
      const newPath = getPathForTab(tab, currentDay);
      if (window.location.pathname !== newPath) {
        window.history.pushState(null, "", newPath);
      }
    }
  };

  const setCurrentDay = (day: number) => {
    const validDay = Math.min(Math.max(day, 1), 30);
    setCurrentDayState(validDay);
    storageService.setCurrentDay(validDay);
    if (activeTab === "workspace" && typeof window !== "undefined") {
      const newPath = getPathForTab("workspace", validDay);
      if (window.location.pathname !== newPath) {
        window.history.pushState(null, "", newPath);
      }
    }
  };

  const getActiveUser = async () => {
    if (user) return user;
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user ?? null;
  };

  const loadAllUserDataFromSupabase = async (currentUser: any) => {
    if (!supabase || !currentUser) return;
    const userId = currentUser.id;

    try {
      let nameToUse = currentUser.user_metadata?.display_name || "";
      if (!nameToUse && currentUser.email) {
        const namePart = currentUser.email.split("@")[0];
        nameToUse = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      }
      const finalName = nameToUse || "Engineer";

      try {
        const { data: profileData } = await (supabase.from("user_profiles") as any)
          .upsert({
            user_id: userId,
            email: currentUser.email || "",
            display_name: finalName,
            updated_at: new Date().toISOString()
          }, { onConflict: "user_id" })
          .select()
          .maybeSingle();

        setUserProfile({ displayName: finalName });
        storageService.saveUserProfile({ displayName: finalName });

        if (profileData?.current_day) {
          setCurrentDayState(profileData.current_day);
          storageService.setCurrentDay(profileData.current_day);
        }
      } catch (e) {
        console.warn("user_profiles upsert notice:", e);
      }

      // Fetch DSA Submissions
      const dsaMap: Record<number, DSAProblemStatus> = {};
      const { data: dsaSubmissionsRows } = await (supabase.from("dsa_submissions") as any)
        .select("*")
        .eq("user_id", userId);

      if (Array.isArray(dsaSubmissionsRows)) {
        dsaSubmissionsRows.forEach((row: any) => {
          if (row.problem_id) {
            dsaMap[row.problem_id] = {
              status: (row.status as any) || "Solved",
              notes: row.personal_notes || "",
              bookmarked: !!row.bookmarked
            };
          }
        });
      }

      if (Object.keys(dsaMap).length > 0) {
        setDsaStatus(dsaMap);
        storageService.saveDSAStatus(dsaMap);
      }

      // Fetch Daily Progress
      const { data: primaryProgRows } = await (supabase.from("daily_progress") as any)
        .select("*")
        .eq("user_id", userId);

      if (Array.isArray(primaryProgRows)) {
        const progressMap: Record<number, DayProgress> = {};
        primaryProgRows.forEach((row: any) => {
          const dayNum = row.day_number || row.day;
          if (dayNum) {
            progressMap[dayNum] = {
              theoryRead: !!(row.theory_completed || row.learn),
              tasks: row.tasks_completed || {},
              reflection: row.reflection || {}
            };
          }
        });
        setDayProgress(progressMap);
        storageService.saveDayProgress(progressMap);
      }

      // Fetch Project Milestones
      const { data: milestoneRows } = await (supabase.from("project_milestones") as any)
        .select("*")
        .eq("user_id", userId);

      if (Array.isArray(milestoneRows)) {
        const milestoneMap: Record<number, Record<number, boolean>> = {};
        milestoneRows.forEach((row: any) => {
          if (!milestoneMap[row.project_id]) milestoneMap[row.project_id] = {};
          milestoneMap[row.project_id][row.day_number] = !!row.completed;
        });
        setProjectMilestones(milestoneMap);
        storageService.saveProjectMilestones(milestoneMap);
      }

      // Fetch Daily Notes
      const { data: primaryNoteRows } = await (supabase.from("daily_notes") as any)
        .select("*")
        .eq("user_id", userId);

      if (Array.isArray(primaryNoteRows)) {
        const notesMap: Record<number, string> = {};
        primaryNoteRows.forEach((row: any) => {
          const dayNum = row.day_number || row.day;
          if (dayNum) {
            notesMap[dayNum] = row.content || row.entry || "";
          }
        });
        setDailyNotes(notesMap);
        storageService.saveDailyNotes(notesMap);
      }
    } catch (err) {
      console.error("Error loading user data from Supabase DB:", err);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        loadAllUserDataFromSupabase(currentUser);
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        loadAllUserDataFromSupabase(currentUser);
      }
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleFocus = async () => {
      const activeUser = await getActiveUser();
      if (supabase && activeUser) {
        loadAllUserDataFromSupabase(activeUser);
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("focus", handleFocus);
      return () => window.removeEventListener("focus", handleFocus);
    }
  }, [user]);

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setIsOfflineMode(false);
  };

  const loginOffline = () => {
    setIsOfflineMode(true);
    setAuthLoading(false);
  };

  const updateDisplayName = async (name: string) => {
    const cleanName = name.trim();
    if (!cleanName) return;

    const updated = { displayName: cleanName };
    setUserProfile(updated);
    storageService.saveUserProfile(updated);

    const activeUser = await getActiveUser();
    if (supabase && activeUser) {
      try {
        await supabase.auth.updateUser({
          data: { display_name: cleanName }
        });

        await (supabase.from("user_profiles") as any).upsert({
          user_id: activeUser.id,
          email: activeUser.email || "",
          display_name: cleanName,
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id" });
      } catch (err) {
        console.error("Error saving display name to Supabase:", err);
      }
    }
  };

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    storageService.setTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const syncDailyProgressToSupabase = async (dayNum: number, updatedDayProgressMap: Record<number, DayProgress>) => {
    if (!supabase) return;
    const activeUser = await getActiveUser();
    if (!activeUser) return;

    try {
      const dayData = updatedDayProgressMap[dayNum] || { tasks: {}, theoryRead: false, reflection: {} };
      
      const { error } = await (supabase.from("daily_progress") as any).upsert({
        user_id: activeUser.id,
        day_number: dayNum,
        theory_completed: !!dayData.theoryRead,
        tasks_completed: dayData.tasks || {},
        reflection: dayData.reflection || {},
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id,day_number" });

      if (error) console.error("[Supabase Error] daily_progress upsert:", error);
    } catch (err) {
      console.error("Supabase daily_progress sync error:", err);
    }
  };

  const syncDSAStatusToSupabase = async (problemId: number, status: string, extra: Partial<DSAProblemStatus> = {}) => {
    if (!supabase) return;
    const activeUser = await getActiveUser();
    if (!activeUser) return;

    try {
      const prob = dsaProblems.find((p) => p.id === problemId);
      const leetcodeId = prob ? prob.leetcodeId : problemId;

      const { error } = await (supabase.from("dsa_submissions") as any).upsert({
        user_id: activeUser.id,
        problem_id: problemId,
        leetcode_id: leetcodeId,
        status: status,
        personal_notes: extra?.notes || "",
        bookmarked: !!extra?.bookmarked,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id,problem_id" });

      if (error) console.error("[Supabase Error] dsa_submissions upsert failed:", error);
    } catch (err) {
      console.error("Supabase dsa_submissions sync error:", err);
    }
  };

  const syncProjectMilestoneToSupabase = async (projectId: number, dayNum: number, isDone: boolean) => {
    if (!supabase) return;
    const activeUser = await getActiveUser();
    if (!activeUser) return;

    try {
      const { error } = await (supabase.from("project_milestones") as any).upsert({
        user_id: activeUser.id,
        project_id: projectId,
        day_number: dayNum,
        completed: isDone,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id,project_id,day_number" });

      if (error) console.error("[Supabase Error] project_milestones upsert:", error);
    } catch (err) {
      console.error("Supabase project_milestones sync error:", err);
    }
  };

  const syncDailyNoteToSupabase = async (dayNum: number, noteContent: string) => {
    if (!supabase) return;
    const activeUser = await getActiveUser();
    if (!activeUser) return;

    try {
      const { error } = await (supabase.from("daily_notes") as any).upsert({
        user_id: activeUser.id,
        day_number: dayNum,
        content: noteContent,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id,day_number" });

      if (error) console.error("[Supabase Error] daily_notes upsert:", error);
    } catch (err) {
      console.error("Supabase daily_notes sync error:", err);
    }
  };

  const toggleDayTask = (dayNum: number, taskId: string) => {
    let nextProgress: Record<number, DayProgress> | null = null;
    let isChecked = false;

    setDayProgress((prev) => {
      const dayData = prev[dayNum] || { tasks: {}, theoryRead: false };
      const currentTasks = dayData.tasks || {};
      isChecked = !currentTasks[taskId];
      const updatedTasks = { ...currentTasks, [taskId]: isChecked };

      let newTheoryRead = dayData.theoryRead;
      if (taskId === "read_theory") {
        newTheoryRead = isChecked;
      }

      nextProgress = {
        ...prev,
        [dayNum]: { ...dayData, theoryRead: newTheoryRead, tasks: updatedTasks }
      };

      storageService.saveDayProgress(nextProgress);
      return nextProgress;
    });

    if (isChecked) {
      playSuccessSound();
      triggerConfetti();
    }

    if (nextProgress) {
      syncDailyProgressToSupabase(dayNum, nextProgress);
    }

    if (taskId.startsWith("dsa_prob_")) {
      const problemId = parseInt(taskId.replace("dsa_prob_", ""), 10);
      if (!isNaN(problemId)) {
        const isNowChecked = !dayProgress[dayNum]?.tasks?.[taskId];
        updateDSAStatus(problemId, isNowChecked ? "Solved" : "Unsolved", {}, false);
      }
    }

    if (taskId === "project_sprint") {
      const proj = projectsData.find((p) => p.days.includes(dayNum));
      if (proj) {
        toggleProjectMilestone(proj.id, dayNum, false);
      }
    }
  };

  const toggleTheoryRead = (dayNum: number) => {
    let nextProgress: Record<number, DayProgress> | null = null;
    let isReadNow = false;

    setDayProgress((prev) => {
      const dayData = prev[dayNum] || { tasks: {}, theoryRead: false };
      isReadNow = !dayData.theoryRead;
      const updatedTasks = { ...dayData.tasks, read_theory: isReadNow };

      nextProgress = {
        ...prev,
        [dayNum]: { ...dayData, theoryRead: isReadNow, tasks: updatedTasks }
      };

      storageService.saveDayProgress(nextProgress);
      return nextProgress;
    });

    if (isReadNow) {
      playSuccessSound();
      triggerConfetti();
    }

    if (nextProgress) {
      syncDailyProgressToSupabase(dayNum, nextProgress);
    }
  };

  const updateDSAStatus = (problemId: number, newStatus: string, extra: Partial<DSAProblemStatus> = {}, syncChecklist = true) => {
    const itemToSync = { status: newStatus as any, ...extra };

    setDsaStatus((prev) => {
      const current = prev[problemId] || { status: "Unsolved", notes: "", bookmarked: false };
      const updatedMap = { ...prev, [problemId]: { ...current, ...itemToSync } };
      storageService.saveDSAStatus(updatedMap);

      if (newStatus === "Solved") {
        playSuccessSound();
        triggerConfetti();

        const solvedNum = Object.values(updatedMap).filter((item) => item.status === "Solved").length;
        if (solvedNum === 1) {
          setActiveMilestoneModal({
            type: "dsa",
            title: "🎉 First DSA Problem Solved!",
            description: "Congratulations! You've taken the first step towards algorithm mastery.",
            xp: 50
          });
        } else if (solvedNum === 10) {
          setActiveMilestoneModal({
            type: "dsa",
            title: "🏆 10 Problems Solved Milestone!",
            description: "Double digits! You're sharpening your problem-solving speed every day.",
            xp: 200
          });
        } else if (solvedNum === 50) {
          setActiveMilestoneModal({
            type: "dsa",
            title: "⚡ Halfway DSA Master (50 Solved)!",
            description: "Sensational effort! You have tackled 50 core interview problems.",
            xp: 500
          });
        }
      }

      return updatedMap;
    });

    syncDSAStatusToSupabase(problemId, newStatus, itemToSync);

    if (syncChecklist) {
      const prob = dsaProblems.find((p) => p.id === problemId);
      if (prob && prob.day) {
        const taskId = `dsa_prob_${problemId}`;
        const isSolved = newStatus === "Solved";

        setDayProgress((prev) => {
          const dayData = prev[prob.day!] || { tasks: {}, theoryRead: false };
          const updatedTasks = { ...dayData.tasks, [taskId]: isSolved };
          const updatedDayProgress = { ...prev, [prob.day!]: { ...dayData, tasks: updatedTasks } };
          storageService.saveDayProgress(updatedDayProgress);
          syncDailyProgressToSupabase(prob.day!, updatedDayProgress);
          return updatedDayProgress;
        });
      }
    }
  };

  const toggleProjectMilestone = (projectId: number, dayNum: number, syncChecklist = true) => {
    const currentDone = !!projectMilestones[projectId]?.[dayNum];
    const isNowDone = !currentDone;

    setProjectMilestones((prev) => {
      const projMap = prev[projectId] || {};
      const updatedProjMap = { ...projMap, [dayNum]: isNowDone };
      const updatedMap = { ...prev, [projectId]: updatedProjMap };
      storageService.saveProjectMilestones(updatedMap);
      return updatedMap;
    });

    if (isNowDone) {
      playSuccessSound();
      triggerConfetti();
    }

    syncProjectMilestoneToSupabase(projectId, dayNum, isNowDone);

    if (syncChecklist) {
      setDayProgress((prev) => {
        const dayData = prev[dayNum] || { tasks: {}, theoryRead: false };
        const updatedTasks = { ...dayData.tasks, project_sprint: isNowDone };
        const updatedDayProgress = { ...prev, [dayNum]: { ...dayData, tasks: updatedTasks } };
        storageService.saveDayProgress(updatedDayProgress);
        syncDailyProgressToSupabase(dayNum, updatedDayProgress);
        return updatedDayProgress;
      });
    }
  };

  const saveDayNote = (dayNum: number, noteContent: string) => {
    setDailyNotes((prev) => {
      const updated = { ...prev, [dayNum]: noteContent };
      storageService.saveDailyNotes(updated);
      return updated;
    });

    syncDailyNoteToSupabase(dayNum, noteContent);
  };

  const saveReflection = (dayNum: number, reflectionObj: Record<string, unknown>) => {
    let nextProgress: Record<number, DayProgress> | null = null;
    setDayProgress((prev) => {
      const dayData = prev[dayNum] || { tasks: {}, theoryRead: false };
      nextProgress = {
        ...prev,
        [dayNum]: { ...dayData, reflection: reflectionObj }
      };
      storageService.saveDayProgress(nextProgress);
      return nextProgress;
    });

    if (nextProgress) {
      syncDailyProgressToSupabase(dayNum, nextProgress);
    }
  };

  const dsaSolvedCount = Object.values(dsaStatus).filter((item) => item.status === "Solved").length;
  const dsaTotalCount = dsaProblems.length;

  const csCompletedCount = Object.values(dayProgress).filter((dp) => dp.theoryRead).length;
  const csTotalCount = csAiTopics.length;

  let projectMilestonesTotal = 0;
  let projectMilestonesDone = 0;
  projectsData.forEach((p) => {
    p.milestones.forEach((m) => {
      projectMilestonesTotal++;
      if (projectMilestones[p.id] && projectMilestones[p.id][m.day]) {
        projectMilestonesDone++;
      }
    });
  });

  let realTotalMinutes = 0;
  csAiTopics.forEach((t) => {
    if (dayProgress[t.day]?.theoryRead) {
      realTotalMinutes += t.timeMinutes || 60;
    }
  });

  let realStreak = 0;
  for (let d = 1; d <= 30; d++) {
    if (dayProgress[d]?.theoryRead) {
      realStreak++;
    } else {
      break;
    }
  }

  const computedUserStats: UserStats = {
    streak: realStreak,
    totalMinutes: realTotalMinutes
  };

  const dsaRatio = dsaSolvedCount / (dsaTotalCount || 1);
  const csRatio = csCompletedCount / 30;
  const projRatio = projectMilestonesTotal > 0 ? projectMilestonesDone / projectMilestonesTotal : 0;
  
  const overallPercentage = Math.min(100, Math.round((dsaRatio * 40 + csRatio * 30 + projRatio * 30)));
  const isAuthenticated = !!user || isOfflineMode;

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        user,
        session,
        authLoading,
        isAuthenticated,
        isOfflineMode,
        loginOffline,
        logout,
        activeTab,
        setActiveTab,
        currentDay,
        setCurrentDay,
        commandPaletteOpen,
        setCommandPaletteOpen,
        mobileMenuOpen,
        setMobileMenuOpen,
        dayProgress,
        toggleDayTask,
        toggleTheoryRead,
        dsaStatus,
        updateDSAStatus,
        projectMilestones,
        toggleProjectMilestone,
        dailyNotes,
        saveDayNote,
        saveReflection,
        userStats: computedUserStats,
        userProfile,
        updateDisplayName,
        dsaSolvedCount,
        dsaTotalCount,
        csCompletedCount,
        csTotalCount,
        projectMilestonesDone,
        projectMilestonesTotal,
        overallPercentage,
        activeMilestoneModal,
        setActiveMilestoneModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
