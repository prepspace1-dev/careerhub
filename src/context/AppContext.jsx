import React, { createContext, useContext, useState, useEffect } from "react";
import { storageService } from "../services/storageService";
import { dsaProblems } from "../data/dsaData";
import { csAiTopics } from "../data/csAiData";
import { projectsData } from "../data/projectsData";
import { supabase, isSupabaseConfigured } from "../supabaseClient";

const AppContext = createContext();

export function AppProvider({ children }) {
  // Theme state
  const [theme, setThemeState] = useState(() => storageService.getTheme());
  
  // Auth state
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Navigation & Day State
  const [activeTab, setActiveTabState] = useState("dashboard");
  const [currentDay, setCurrentDayState] = useState(() => storageService.getCurrentDay());
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User Data State (Initialized from LocalStorage, but overwritten immediately by Supabase Cloud DB on login/sync)
  const [dayProgress, setDayProgress] = useState(() => storageService.getDayProgress());
  const [dsaStatus, setDsaStatus] = useState(() => storageService.getDSAStatus());
  const [projectMilestones, setProjectMilestones] = useState(() => storageService.getProjectMilestones());
  const [dailyNotes, setDailyNotes] = useState(() => storageService.getDailyNotes());
  const [userProfile, setUserProfile] = useState(() => storageService.getUserProfile());

  // Clean HTML5 History API Path Routing
  const getPathForTab = (tab, day) => {
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

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    const newPath = getPathForTab(tab, currentDay);
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, "", newPath);
    }
  };

  const setCurrentDay = (day) => {
    const validDay = Math.min(Math.max(day, 1), 30);
    setCurrentDayState(validDay);
    storageService.setCurrentDay(validDay);
    if (activeTab === "workspace") {
      const newPath = getPathForTab("workspace", validDay);
      if (window.location.pathname !== newPath) {
        window.history.pushState(null, "", newPath);
      }
    }
  };

  // --- SUPABASE CLOUD DATA LOAD (SUPABASE DB IS THE ABSOLUTE PRIMARY GROUND TRUTH) ---
  const loadAllUserDataFromSupabase = async (currentUser) => {
    if (!supabase || !currentUser) return;
    const userId = currentUser.id;

    try {
      // 1. Fetch Profile & Display Name
      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      let nameToUse = currentUser.user_metadata?.display_name || profileData?.display_name || "";
      if (!nameToUse && currentUser.email) {
        const namePart = currentUser.email.split("@")[0];
        nameToUse = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      }
      const finalName = nameToUse || "Engineer";
      setUserProfile({ displayName: finalName });
      storageService.saveUserProfile({ displayName: finalName });

      if (profileData?.current_day) {
        setCurrentDayState(profileData.current_day);
        storageService.setCurrentDay(profileData.current_day);
      }

      // 2. Fetch DSA Submissions from Supabase Cloud DB
      const { data: dsaRows } = await supabase
        .from("dsa_submissions")
        .select("*")
        .eq("user_id", userId);

      if (Array.isArray(dsaRows)) {
        const dsaMap = {};
        dsaRows.forEach((row) => {
          dsaMap[row.problem_id] = {
            status: row.status || "Unsolved",
            notes: row.personal_notes || "",
            bookmarked: !!row.bookmarked
          };
        });
        setDsaStatus(dsaMap);
        storageService.saveDSAStatus(dsaMap);
      }

      // 3. Fetch Daily Progress & Checklists from Supabase Cloud DB
      const { data: progressRows } = await supabase
        .from("daily_progress")
        .select("*")
        .eq("user_id", userId);

      if (Array.isArray(progressRows)) {
        const progressMap = {};
        progressRows.forEach((row) => {
          progressMap[row.day_number] = {
            theoryRead: !!row.theory_completed,
            tasks: row.tasks_completed || {},
            reflection: row.reflection || {}
          };
        });
        setDayProgress(progressMap);
        storageService.saveDayProgress(progressMap);
      }

      // 4. Fetch Project Milestones from Supabase Cloud DB
      const { data: milestoneRows } = await supabase
        .from("project_milestones")
        .select("*")
        .eq("user_id", userId);

      if (Array.isArray(milestoneRows)) {
        const milestoneMap = {};
        milestoneRows.forEach((row) => {
          if (!milestoneMap[row.project_id]) milestoneMap[row.project_id] = {};
          milestoneMap[row.project_id][row.day_number] = !!row.completed;
        });
        setProjectMilestones(milestoneMap);
        storageService.saveProjectMilestones(milestoneMap);
      }

      // 5. Fetch Daily Notes from Supabase Cloud DB
      const { data: noteRows } = await supabase
        .from("daily_notes")
        .select("*")
        .eq("user_id", userId);

      if (Array.isArray(noteRows)) {
        const notesMap = {};
        noteRows.forEach((row) => {
          notesMap[row.day_number] = row.content || "";
        });
        setDailyNotes(notesMap);
        storageService.saveDailyNotes(notesMap);
      }
    } catch (err) {
      console.error("Error loading user data from Supabase DB:", err);
    }
  };

  // Listen to Supabase Auth State & Sync Data
  useEffect(() => {
    if (!isSupabaseConfigured()) {
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

  // Window Focus Auto-Refetch (Guarantees fresh data when switching tabs / Incognito windows)
  useEffect(() => {
    const handleFocus = () => {
      if (supabase && user) {
        loadAllUserDataFromSupabase(user);
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user]);

  // Realtime Supabase Database Subscription (Instantly syncs across concurrent tabs/windows)
  useEffect(() => {
    if (!supabase || !user) return;

    const channel = supabase
      .channel(`db-sync-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public" },
        () => {
          loadAllUserDataFromSupabase(user);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

  // Update Display Name both locally and in Supabase Database + Auth Metadata
  const updateDisplayName = async (name) => {
    const cleanName = name.trim();
    if (!cleanName) return;

    const updated = { displayName: cleanName };
    setUserProfile(updated);
    storageService.saveUserProfile(updated);

    if (supabase && user) {
      try {
        await supabase.auth.updateUser({
          data: { display_name: cleanName }
        });

        await supabase.from("user_profiles").upsert({
          user_id: user.id,
          email: user.email,
          display_name: cleanName,
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id" });
      } catch (err) {
        console.error("Error saving display name to Supabase:", err);
      }
    }
  };

  // Apply Theme class to document root
  useEffect(() => {
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

  // --- TWO-WAY REACTIVE STATE SYNCHRONIZATION WITH SUPABASE DATABASE UPSERTS ---

  // Helper to push daily progress to Supabase
  const syncDailyProgressToSupabase = async (dayNum, updatedDayProgressMap) => {
    if (supabase && user) {
      try {
        const dayData = updatedDayProgressMap[dayNum] || { tasks: {}, theoryRead: false, reflection: {} };
        await supabase.from("daily_progress").upsert({
          user_id: user.id,
          day_number: dayNum,
          theory_completed: !!dayData.theoryRead,
          tasks_completed: dayData.tasks || {},
          reflection: dayData.reflection || {},
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id,day_number" });
      } catch (err) {
        console.error("Supabase daily_progress sync error:", err);
      }
    }
  };

  // Helper to push DSA Status to Supabase
  const syncDSAStatusToSupabase = async (problemId, status, extra = {}) => {
    if (supabase && user) {
      try {
        const prob = dsaProblems.find((p) => p.id === problemId);
        const leetcodeId = prob ? prob.leetcodeId : problemId;

        await supabase.from("dsa_submissions").upsert({
          user_id: user.id,
          problem_id: problemId,
          leetcode_id: leetcodeId,
          status: status,
          personal_notes: extra?.notes || "",
          bookmarked: !!extra?.bookmarked,
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id,problem_id" });
      } catch (err) {
        console.error("Supabase dsa_submissions sync error:", err);
      }
    }
  };

  // Helper to push Project Milestones to Supabase
  const syncProjectMilestoneToSupabase = async (projectId, dayNum, isDone) => {
    if (supabase && user) {
      try {
        await supabase.from("project_milestones").upsert({
          user_id: user.id,
          project_id: projectId,
          day_number: dayNum,
          completed: isDone,
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id,project_id,day_number" });
      } catch (err) {
        console.error("Supabase project_milestones sync error:", err);
      }
    }
  };

  // Helper to push Daily Notes to Supabase
  const syncDailyNoteToSupabase = async (dayNum, noteContent) => {
    if (supabase && user) {
      try {
        await supabase.from("daily_notes").upsert({
          user_id: user.id,
          day_number: dayNum,
          content: noteContent,
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id,day_number" });
      } catch (err) {
        console.error("Supabase daily_notes sync error:", err);
      }
    }
  };

  // 1. Toggle Day Task Checkbox (Syncs to Theory, DSA Solver/Vault & Project Milestones)
  const toggleDayTask = (dayNum, taskId) => {
    let nextProgress = null;

    setDayProgress((prev) => {
      const dayData = prev[dayNum] || { tasks: {}, theoryRead: false };
      const currentTasks = dayData.tasks || {};
      const isNowChecked = !currentTasks[taskId];
      const updatedTasks = { ...currentTasks, [taskId]: isNowChecked };

      let newTheoryRead = dayData.theoryRead;
      if (taskId === "read_theory") {
        newTheoryRead = isNowChecked;
      }

      nextProgress = {
        ...prev,
        [dayNum]: { ...dayData, theoryRead: newTheoryRead, tasks: updatedTasks }
      };

      storageService.saveDayProgress(nextProgress);
      return nextProgress;
    });

    if (nextProgress) {
      syncDailyProgressToSupabase(dayNum, nextProgress);
    }

    // Sync to DSA Status if task is a DSA problem
    if (taskId.startsWith("dsa_prob_")) {
      const problemId = parseInt(taskId.replace("dsa_prob_", ""), 10);
      if (!isNaN(problemId)) {
        const isNowChecked = !dayProgress[dayNum]?.tasks?.[taskId];
        updateDSAStatus(problemId, isNowChecked ? "Solved" : "Unsolved", {}, false);
      }
    }

    // Sync to Project Milestones if task is project sprint
    if (taskId === "project_sprint") {
      const proj = projectsData.find((p) => p.days.includes(dayNum));
      if (proj) {
        toggleProjectMilestone(proj.id, dayNum, false);
      }
    }
  };

  // 2. Toggle Theory Read (Syncs to Checklist task 'read_theory')
  const toggleTheoryRead = (dayNum) => {
    let nextProgress = null;
    setDayProgress((prev) => {
      const dayData = prev[dayNum] || { tasks: {}, theoryRead: false };
      const newTheoryRead = !dayData.theoryRead;
      const updatedTasks = { ...dayData.tasks, read_theory: newTheoryRead };

      nextProgress = {
        ...prev,
        [dayNum]: { ...dayData, theoryRead: newTheoryRead, tasks: updatedTasks }
      };

      storageService.saveDayProgress(nextProgress);
      return nextProgress;
    });

    if (nextProgress) {
      syncDailyProgressToSupabase(dayNum, nextProgress);
    }
  };

  // 3. Update DSA Status (Syncs to Checklist task 'dsa_prob_X' in Today's Tasks + Supabase DB)
  const updateDSAStatus = (problemId, newStatus, extra = {}, syncChecklist = true) => {
    const itemToSync = { status: newStatus, ...extra };

    setDsaStatus((prev) => {
      const current = prev[problemId] || { status: "Unsolved", notes: "", bookmarked: false };
      const updatedMap = { ...prev, [problemId]: { ...current, ...itemToSync } };
      storageService.saveDSAStatus(updatedMap);
      return updatedMap;
    });

    // Cloud Upsert to Supabase
    syncDSAStatusToSupabase(problemId, newStatus, itemToSync);

    if (syncChecklist) {
      const prob = dsaProblems.find((p) => p.id === problemId);
      if (prob) {
        const taskId = `dsa_prob_${problemId}`;
        const isSolved = newStatus === "Solved";

        setDayProgress((prev) => {
          const dayData = prev[prob.day] || { tasks: {}, theoryRead: false };
          const updatedTasks = { ...dayData.tasks, [taskId]: isSolved };
          const updatedDayProgress = { ...prev, [prob.day]: { ...dayData, tasks: updatedTasks } };
          storageService.saveDayProgress(updatedDayProgress);
          syncDailyProgressToSupabase(prob.day, updatedDayProgress);
          return updatedDayProgress;
        });
      }
    }
  };

  // 4. Toggle Project Milestone (Syncs to Checklist task 'project_sprint' in Today's Tasks + Supabase DB)
  const toggleProjectMilestone = (projectId, dayNum, syncChecklist = true) => {
    const currentDone = !!projectMilestones[projectId]?.[dayNum];
    const isNowDone = !currentDone;

    setProjectMilestones((prev) => {
      const projMap = prev[projectId] || {};
      const updatedProjMap = { ...projMap, [dayNum]: isNowDone };
      const updatedMap = { ...prev, [projectId]: updatedProjMap };
      storageService.saveProjectMilestones(updatedMap);
      return updatedMap;
    });

    // Cloud Upsert to Supabase
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

  // Save Daily Notes
  const saveDayNote = (dayNum, noteContent) => {
    setDailyNotes((prev) => {
      const updated = { ...prev, [dayNum]: noteContent };
      storageService.saveDailyNotes(updated);
      return updated;
    });

    syncDailyNoteToSupabase(dayNum, noteContent);
  };

  // Save Reflection
  const saveReflection = (dayNum, reflectionObj) => {
    let nextProgress = null;
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

  // --- STATS COMPUTATION ---
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

  // Calculate real total study minutes from completed topics
  let realTotalMinutes = 0;
  csAiTopics.forEach((t) => {
    if (dayProgress[t.day]?.theoryRead) {
      realTotalMinutes += t.timeMinutes || 60;
    }
  });

  // Calculate real consecutive days streak
  let realStreak = 0;
  for (let d = 1; d <= 30; d++) {
    if (dayProgress[d]?.theoryRead) {
      realStreak++;
    } else {
      break;
    }
  }

  const computedUserStats = {
    streak: realStreak,
    totalMinutes: realTotalMinutes
  };

  const dsaRatio = dsaSolvedCount / dsaTotalCount;
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
        overallPercentage
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
