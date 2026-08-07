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

  // User Data State
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

  // Listen to Supabase Auth State
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        const namePart = session.user.email.split("@")[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        setUserProfile((prev) => ({ ...prev, displayName: prev.displayName || formattedName }));
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        const namePart = session.user.email.split("@")[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        setUserProfile((prev) => ({ ...prev, displayName: prev.displayName || formattedName }));
      }
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const updateDisplayName = (name) => {
    const updated = { ...userProfile, displayName: name };
    setUserProfile(updated);
    storageService.saveUserProfile(updated);
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

  // Keyboard shortcut for Command Palette (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // --- TWO-WAY REACTIVE STATE SYNCHRONIZATION ---

  // 1. Toggle Day Task Checkbox (Syncs to Theory, DSA Solver/Vault & Project Milestones)
  const toggleDayTask = (dayNum, taskId) => {
    setDayProgress((prev) => {
      const dayData = prev[dayNum] || { tasks: {}, theoryRead: false };
      const currentTasks = dayData.tasks || {};
      const isNowChecked = !currentTasks[taskId];
      const updatedTasks = { ...currentTasks, [taskId]: isNowChecked };

      let newTheoryRead = dayData.theoryRead;
      if (taskId === "read_theory") {
        newTheoryRead = isNowChecked;
      }

      const updatedDayProgress = {
        ...prev,
        [dayNum]: { ...dayData, theoryRead: newTheoryRead, tasks: updatedTasks }
      };

      storageService.saveDayProgress(updatedDayProgress);
      return updatedDayProgress;
    });

    // Sync to DSA Status if task is a DSA problem
    if (taskId.startsWith("dsa_prob_")) {
      const problemId = parseInt(taskId.replace("dsa_prob_", ""), 10);
      if (!isNaN(problemId)) {
        const isNowChecked = !dayProgress[dayNum]?.tasks?.[taskId];
        updateDSAStatus(problemId, isNowChecked ? "Solved" : "Unsolved", {}, false); // false to avoid loop recursion
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
    setDayProgress((prev) => {
      const dayData = prev[dayNum] || { tasks: {}, theoryRead: false };
      const newTheoryRead = !dayData.theoryRead;
      const updatedTasks = { ...dayData.tasks, read_theory: newTheoryRead };

      const updatedDayProgress = {
        ...prev,
        [dayNum]: { ...dayData, theoryRead: newTheoryRead, tasks: updatedTasks }
      };

      storageService.saveDayProgress(updatedDayProgress);
      return updatedDayProgress;
    });
  };

  // 3. Update DSA Status (Syncs to Checklist task 'dsa_prob_X' in Today's Tasks)
  const updateDSAStatus = (problemId, newStatus, extra = {}, syncChecklist = true) => {
    setDsaStatus((prev) => {
      const current = prev[problemId] || { status: "Unsolved", notes: "", bookmarked: false };
      const updatedItem = { ...current, status: newStatus, ...extra };
      const updatedMap = { ...prev, [problemId]: updatedItem };
      storageService.saveDSAStatus(updatedMap);
      return updatedMap;
    });

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
          return updatedDayProgress;
        });
      }
    }
  };

  // 4. Toggle Project Milestone (Syncs to Checklist task 'project_sprint' in Today's Tasks)
  const toggleProjectMilestone = (projectId, dayNum, syncChecklist = true) => {
    let isNowDone = false;
    setProjectMilestones((prev) => {
      const projMap = prev[projectId] || {};
      isNowDone = !projMap[dayNum];
      const updatedProjMap = { ...projMap, [dayNum]: isNowDone };
      const updatedMap = { ...prev, [projectId]: updatedProjMap };
      storageService.saveProjectMilestones(updatedMap);
      return updatedMap;
    });

    if (syncChecklist) {
      setDayProgress((prev) => {
        const dayData = prev[dayNum] || { tasks: {}, theoryRead: false };
        const updatedTasks = { ...dayData.tasks, project_sprint: isNowDone };
        const updatedDayProgress = { ...prev, [dayNum]: { ...dayData, tasks: updatedTasks } };
        storageService.saveDayProgress(updatedDayProgress);
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
  };

  // Save Reflection
  const saveReflection = (dayNum, reflectionObj) => {
    setDayProgress((prev) => {
      const dayData = prev[dayNum] || { tasks: {}, theoryRead: false };
      const updated = {
        ...prev,
        [dayNum]: { ...dayData, reflection: reflectionObj }
      };
      storageService.saveDayProgress(updated);
      return updated;
    });
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
