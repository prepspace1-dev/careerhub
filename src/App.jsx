import React, { useState, useEffect } from "react";
import { LayoutDashboard, ListChecks, BookOpen, Database, Map, Building2, NotebookPen, Briefcase, LogOut, Cloud, CloudOff, User, RefreshCw, Award } from "lucide-react";
import OverviewTab from "./components/OverviewTab";
import TasksTab from "./components/TasksTab";
import SkillsTab from "./components/SkillsTab";
import ProblemVault from "./components/ProblemVault";
import RoadmapsTab from "./components/RoadmapsTab";
import CompanyPacksTab from "./components/CompanyPacksTab";
import LogTab from "./components/LogTab";
import InterviewsTab from "./components/InterviewsTab";
import Auth from "./components/Auth";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { 
  migrateLocalDataToSupabase, 
  fetchTasks, 
  saveTasks, 
  fetchSkills, 
  saveSkill, 
  fetchLogs, 
  saveLog, 
  fetchInterviews, 
  saveInterview,
  fetchProblems,
  saveProblem,
  deleteProblem,
  fetchRoadmapItems,
  saveRoadmapItem,
  fetchXPEvents
  // Phase 3+: fetchRevisionQueue, addXPEvent, getTotalXP, completeRevision
} from "./db";
import { DEFAULT_SKILLS } from "./utils";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", icon: ListChecks },
  { id: "skills", label: "Skills", icon: BookOpen },
  { id: "roadmaps", label: "Roadmaps", icon: Map },
  { id: "problems", label: "Problem Vault", icon: Database },
  { id: "companies", label: "Company Packs", icon: Building2 },
  { id: "log", label: "Log", icon: NotebookPen },
  { id: "interviews", label: "Interviews", icon: Briefcase },
];

export default function App() {
  const [tab, setTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [useLocalMode, setUseLocalMode] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  
  // Central Data States
  const [tasks, setTasks] = useState({});
  const [skills, setSkills] = useState({});
  const [logs, setLogs] = useState({});
  const [interviews, setInterviews] = useState([]);
  // v2 data
  const [problems, setProblems] = useState([]);
  const [roadmapItems, setRoadmapItems] = useState({});
  const [_xpEvents, setXpEvents] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const hasSupabase = isSupabaseConfigured();

  // Hash-based Routing
  useEffect(() => {
    const handleHashChange = () => {
      const currentHash = window.location.hash.replace("#", "");
      const validTabs = ["overview", "tasks", "skills", "roadmaps", "problems", "companies", "log", "interviews"];
      if (validTabs.includes(currentHash)) {
        setTab(currentHash);
      } else {
        // Fallback default
        setTab("overview");
        window.location.hash = "#overview";
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Run on mount

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleTabChange = (newTab) => {
    window.location.hash = `#${newTab}`;
  };

  // Listen to Supabase Auth State
  useEffect(() => {
    if (!hasSupabase) {
      setAuthInitialized(true);
      return;
    }

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        migrateLocalDataToSupabase(session.user.id).then(() => {
          loadAllUserData(session.user.id);
        });
      } else {
        setAuthInitialized(true);
      }
    });

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await migrateLocalDataToSupabase(session.user.id);
        await loadAllUserData(session.user.id);
      } else {
        setUser(null);
        setDataLoaded(false);
      }
      setAuthInitialized(true);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [hasSupabase]);

  // Load data for guest / offline mode
  useEffect(() => {
    if (useLocalMode || !hasSupabase) {
      loadAllUserData(null);
    }
  }, [useLocalMode, hasSupabase]);

  // Parallel Loader for User Data
  async function loadAllUserData(userId) {
    setDataLoaded(false);
    try {
      const [tasksData, skillsData, logsData, interviewsData, problemsData, roadmapData, xpData] = await Promise.all([
        fetchTasks(userId),
        fetchSkills(userId, DEFAULT_SKILLS),
        fetchLogs(userId),
        fetchInterviews(userId),
        fetchProblems(userId),
        fetchRoadmapItems(userId),
        fetchXPEvents(userId),
      ]);
      
      setTasks(tasksData);
      setSkills(skillsData);
      setLogs(logsData);
      setInterviews(interviewsData);
      setProblems(problemsData || []);
      setRoadmapItems(roadmapData || {});
      setXpEvents(xpData || []);
    } catch (err) {
      console.error("Error loading application data:", err);
    } finally {
      setDataLoaded(true);
    }
  }

  const handleLogout = async () => {
    if (hasSupabase) {
      await supabase.auth.signOut();
      setUser(null);
      setUseLocalMode(false);
      setDataLoaded(false);
    }
  };

  // Centralized Persist Functions (Optimistic UI updates + Background syncing)
  async function persistTasks(nextTasks, selectedDateKey, activeDayData) {
    setTasks(nextTasks);
    setSyncing(true);
    try {
      await saveTasks(user?.id, selectedDateKey, activeDayData, nextTasks);
    } catch (err) {
      console.error("Sync error saving tasks:", err);
    } finally {
      setSyncing(false);
    }
  }

  // NOTE: Legacy skill level persist — levels are now computed from problems (Phase 2)
  // Kept for potential future use. eslint-disable-line no-unused-vars
  async function _persistSkill(skillId, nextLevel, nextSkills) {
    setSkills(nextSkills);
    setSyncing(true);
    try {
      await saveSkill(user?.id, skillId, nextLevel, nextSkills);
    } catch (err) {
      console.error("Sync error saving skill:", err);
    } finally {
      setSyncing(false);
    }
  }

  async function persistLog(selectedDateKey, draftText, nextLogs) {
    setLogs(nextLogs);
    setSyncing(true);
    try {
      await saveLog(user?.id, selectedDateKey, draftText, nextLogs);
    } catch (err) {
      console.error("Sync error saving log:", err);
    } finally {
      setSyncing(false);
    }
  }

  async function persistInterview(newEntry, nextList) {
    setInterviews(nextList);
    setSyncing(true);
    try {
      await saveInterview(user?.id, newEntry, nextList);
    } catch (err) {
      console.error("Sync error saving interview:", err);
    } finally {
      setSyncing(false);
    }
  }

  async function deleteInterview(id, nextList) {
    setInterviews(nextList);
    setSyncing(true);
    try {
      if (supabase && user?.id) {
        await supabase
          .from("interviews")
          .delete()
          .eq("id", id);
      } else {
        const stringValue = JSON.stringify(nextList);
        if (window.storage && typeof window.storage.set === "function") {
          await window.storage.set("interview-log-data", stringValue, false);
        } else {
          localStorage.setItem("interview-log-data", stringValue);
        }
      }
    } catch (err) {
      console.error("Sync error deleting interview:", err);
    } finally {
      setSyncing(false);
    }
  }

  // ── v2 Problem Vault Functions ──────────────────────────────────────────────

  /**
   * Optimistically add/update a problem in state, then sync to Supabase.
   * Returns the saved problem (with ID).
   */
  async function persistProblem(problem) {
    setSyncing(true);
    try {
      const saved = await saveProblem(user?.id, problem, problems);
      setProblems(prev => {
        const idx = prev.findIndex(p => p.id === saved.id);
        if (idx >= 0) return prev.map((p, i) => i === idx ? saved : p);
        return [saved, ...prev];
      });
      return saved;
    } catch (err) {
      console.error("Sync error saving problem:", err);
      throw err;
    } finally {
      setSyncing(false);
    }
  }

  /**
   * Delete a problem by ID and remove it from local state.
   */
  async function deleteProblemEntry(problemId) {
    setProblems(prev => prev.filter(p => p.id !== problemId));
    setSyncing(true);
    try {
      await deleteProblem(user?.id, problemId, problems);
    } catch (err) {
      console.error("Sync error deleting problem:", err);
    } finally {
      setSyncing(false);
    }
  }

  /**
   * Save a non-DSA subtopic status (not_started | learning | mastered).
   * Stored in roadmap_items table keyed by (categoryId, subtopicId).
   */
  async function persistRoadmapItem(categoryId, subtopicId, status, notes = "") {
    // Optimistic update
    setRoadmapItems(prev => ({
      ...prev,
      [categoryId]: {
        ...(prev[categoryId] || {}),
        [subtopicId]: { status, notes },
      },
    }));
    setSyncing(true);
    try {
      await saveRoadmapItem(
        user?.id,
        categoryId,
        subtopicId,
        status,
        notes,
        roadmapItems
      );
    } catch (err) {
      console.error("Sync error saving roadmap item:", err);
    } finally {
      setSyncing(false);
    }
  }

  // Display initialization loader
  if (!authInitialized || ( (user || useLocalMode) && !dataLoaded )) {
    return (
      <div style={appStyles.loadingScreen}>
        <div style={appStyles.spinner}></div>
        <div style={appStyles.loadingText}>
          {!authInitialized ? "Initializing Career Hub..." : "Synchronizing with Supabase..."}
        </div>
      </div>
    );
  }

  // If user is not authenticated and hasn't explicitly chosen local mode, show Auth screen
  const showAuth = !user && (!useLocalMode || !hasSupabase) && hasSupabase;

  return (
    <div className={`app-container ${showAuth ? "auth-mode" : ""}`}>
      {showAuth ? (
        <div className="card fade-in">
          <Auth 
            onAuthSuccess={(sessionUser) => setUser(sessionUser)} 
            onSkipAuth={() => setUseLocalMode(true)} 
          />
        </div>
      ) : (
        <div className="dashboard-shell fade-in">
          {/* Left Sidebar Shell */}
          <div className="sidebar">
            <div className="brand-container">
              <Award size={18} color="var(--teal)" />
              <span className="brand-title">Career Hub</span>
            </div>

            {/* Sync Status Header */}
            <div style={appStyles.statusHeaderCompact}>
              <div style={appStyles.statusRow}>
                {user ? (
                  <>
                    <Cloud size={12} color="#4ADE80" />
                    <span style={{ ...appStyles.statusText, color: "#4ADE80" }}>
                      {syncing ? "Syncing..." : "Cloud Sync Active"}
                    </span>
                    {syncing && <RefreshCw size={9} style={{ animation: "spin 1s linear infinite", color: "#38D9C9" }} />}
                  </>
                ) : (
                  <>
                    <CloudOff size={12} color="#F2A93B" />
                    <span style={{ ...appStyles.statusText, color: "#F2A93B" }}>
                      {syncing ? "Saving..." : "Offline Mode"}
                    </span>
                    {syncing && <RefreshCw size={9} style={{ animation: "spin 1s linear infinite", color: "#F2A93B" }} />}
                  </>
                )}
              </div>
            </div>

            {/* Sidebar Navigation */}
            <div className="nav-list">
              {TABS.map((t) => {
                const Icon = t.icon;
                const isActive = tab === t.id;
                return (
                  <button
                    key={t.id}
                    className={`nav-btn ${isActive ? "active" : ""}`}
                    onClick={() => handleTabChange(t.id)}
                  >
                    <Icon size={14} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* User Profile & Logout footer */}
            <div style={appStyles.sidebarFooter}>
              {user ? (
                <div style={appStyles.userBox}>
                  <div style={appStyles.userAvatar}>
                    <User size={12} color="#8493AA" />
                  </div>
                  <div style={appStyles.userMeta}>
                    <span style={appStyles.userEmailText} title={user.email}>
                      {user.email}
                    </span>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    style={appStyles.logoutBtn} 
                    title="Log Out"
                  >
                    <LogOut size={13} />
                  </button>
                </div>
              ) : (
                hasSupabase && (
                  <button 
                    onClick={() => setUseLocalMode(false)} 
                    style={appStyles.loginBtnSidebar}
                  >
                    Connect Account
                  </button>
                )
              )}
            </div>
          </div>

          {/* Main Dashboard Layout Work Area */}
          <div className="main-content">
            {tab === "overview" && (
              <OverviewTab 
                active={true}
                tasksHistory={tasks}
                skills={skills}
                interviews={interviews}
                logs={logs}
                problems={problems}
                roadmapItems={roadmapItems}
                onNavigateToTab={handleTabChange}
              />
            )}
            {tab === "tasks" && (
              <TasksTab 
                active={true} 
                tasksHistory={tasks}
                onPersistTasks={persistTasks}
              />
            )}
            {tab === "skills" && (
              <SkillsTab 
                active={true} 
                problems={problems}
                roadmapItems={roadmapItems}
                onPersistProblem={persistProblem}
                onDeleteProblem={deleteProblemEntry}
                onPersistRoadmapItem={persistRoadmapItem}
              />
            )}
            {tab === "roadmaps" && (
              <RoadmapsTab
                active={true}
                roadmapItems={roadmapItems}
                onPersistRoadmapItem={persistRoadmapItem}
              />
            )}
            {tab === "problems" && (
              <ProblemVault
                active={true}
                problems={problems}
                onPersistProblem={persistProblem}
                onDeleteProblem={deleteProblemEntry}
              />
            )}
            {tab === "companies" && (
              <CompanyPacksTab
                active={true}
                problems={problems}
              />
            )}
            {tab === "log" && (
              <LogTab 
                active={true} 
                logs={logs}
                tasksHistory={tasks}
                onPersistLog={persistLog}
              />
            )}
            {tab === "interviews" && (
              <InterviewsTab 
                active={true} 
                interviews={interviews}
                onPersistInterview={persistInterview}
                onDeleteInterview={deleteInterview}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const appStyles = {
  loadingScreen: {
    minHeight: "100vh",
    background: "#0A0F1C",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16
  },
  spinner: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "3px solid #1C2842",
    borderTopColor: "#38D9C9",
    animation: "spin 0.8s linear infinite"
  },
  loadingText: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    color: "#8493AA"
  },
  statusHeaderCompact: {
    background: "rgba(18, 26, 43, 0.4)",
    border: "1px solid #1C2842",
    borderRadius: 10,
    padding: "6px 10px",
    display: "flex",
    justifyContent: "center"
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: 6
  },
  statusText: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 9,
    fontWeight: 600
  },
  sidebarFooter: {
    marginTop: "auto",
    paddingTop: 16,
    borderTop: "1px solid var(--border)"
  },
  userBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%"
  },
  userAvatar: {
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "#121A2B",
    border: "1px solid #1C2842",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  userMeta: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    overflow: "hidden"
  },
  userEmailText: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 9.5,
    color: "#8493AA",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    textAlign: "left"
  },
  logoutBtn: {
    color: "#8493AA",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px",
    borderRadius: 6,
    cursor: "pointer",
    background: "none",
    ":hover": {
      color: "#EF4444",
      background: "rgba(239, 68, 68, 0.1)"
    }
  },
  loginBtnSidebar: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 9.5,
    fontWeight: 600,
    background: "#38D9C9",
    color: "#0A0F1C",
    padding: "6px 12px",
    borderRadius: 8,
    width: "100%",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(56, 217, 201, 0.15)"
  }
};
