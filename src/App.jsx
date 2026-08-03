import React, { useState, useEffect } from "react";
import { ListChecks, BookOpen, NotebookPen, Briefcase, LogOut, Cloud, CloudOff, User, RefreshCw } from "lucide-react";
import TasksTab from "./components/TasksTab";
import SkillsTab from "./components/SkillsTab";
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
  saveInterview 
} from "./db";
import { DEFAULT_SKILLS } from "./utils";

const TABS = [
  { id: "tasks", label: "Tasks", icon: ListChecks },
  { id: "skills", label: "Skills", icon: BookOpen },
  { id: "log", label: "Log", icon: NotebookPen },
  { id: "interviews", label: "Interviews", icon: Briefcase },
];

export default function App() {
  const [tab, setTab] = useState("tasks");
  const [user, setUser] = useState(null);
  const [useLocalMode, setUseLocalMode] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  
  // Central Data States
  const [tasks, setTasks] = useState({});
  const [skills, setSkills] = useState({});
  const [logs, setLogs] = useState({});
  const [interviews, setInterviews] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const hasSupabase = isSupabaseConfigured();

  // Hash-based Routing
  useEffect(() => {
    const handleHashChange = () => {
      const currentHash = window.location.hash.replace("#", "");
      const validTabs = ["tasks", "skills", "log", "interviews"];
      if (validTabs.includes(currentHash)) {
        setTab(currentHash);
      } else {
        // Fallback default
        setTab("tasks");
        window.location.hash = "#tasks";
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
      const [tasksData, skillsData, logsData, interviewsData] = await Promise.all([
        fetchTasks(userId),
        fetchSkills(userId, DEFAULT_SKILLS),
        fetchLogs(userId),
        fetchInterviews(userId)
      ]);
      
      setTasks(tasksData);
      setSkills(skillsData);
      setLogs(logsData);
      setInterviews(interviewsData);
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

  async function persistSkill(skillId, nextLevel, nextSkills) {
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
    <div className="app-container">
      <div className="card fade-in">
        {showAuth ? (
          <Auth 
            onAuthSuccess={(sessionUser) => setUser(sessionUser)} 
            onSkipAuth={() => setUseLocalMode(true)} 
          />
        ) : (
          <>
            {/* Top Sync & Profile Bar */}
            <div style={appStyles.statusHeader}>
              <div style={appStyles.statusRow}>
                {user ? (
                  <>
                    <Cloud size={13} color="#4ADE80" />
                    <span style={{ ...appStyles.statusText, color: "#4ADE80" }}>
                      {syncing ? "Syncing..." : "Cloud Sync Active"}
                    </span>
                    {syncing && <RefreshCw size={10} style={{ animation: "spin 1s linear infinite", color: "#38D9C9" }} />}
                  </>
                ) : (
                  <>
                    <CloudOff size={13} color="#F2A93B" />
                    <span style={{ ...appStyles.statusText, color: "#F2A93B" }}>
                      {syncing ? "Saving..." : "Local Storage Mode"}
                    </span>
                    {syncing && <RefreshCw size={10} style={{ animation: "spin 1s linear infinite", color: "#F2A93B" }} />}
                  </>
                )}
              </div>
              
              <div style={appStyles.userRow}>
                {user ? (
                  <>
                    <div style={appStyles.userInfo} title={user.email}>
                      <User size={11} color="#8493AA" />
                      <span style={appStyles.userEmail}>{user.email}</span>
                    </div>
                    <button 
                      onClick={handleLogout} 
                      style={appStyles.logoutBtn} 
                      title="Log Out"
                    >
                      <LogOut size={13} />
                    </button>
                  </>
                ) : (
                  hasSupabase && (
                    <button 
                      onClick={() => setUseLocalMode(false)} 
                      style={appStyles.loginBtn}
                    >
                      Connect Account
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Tab Bar Navigation */}
            <div style={appStyles.tabBar}>
              {TABS.map((t) => {
                const Icon = t.icon;
                const isActive = tab === t.id;
                return (
                  <button
                    key={t.id}
                    className="tab-btn"
                    onClick={() => handleTabChange(t.id)}
                    style={{
                      ...appStyles.tabBtn,
                      background: isActive ? "#F2A93B" : "#0E1626",
                      color: isActive ? "#0A0F1C" : "#8493AA",
                      borderColor: isActive ? "#F2A93B" : "#1C2842",
                    }}
                  >
                    <Icon size={13} />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Panels with Pre-Loaded Props */}
            {tab === "tasks" && (
              <TasksTab 
                active={true} 
                userId={user?.id}
                tasksHistory={tasks}
                onPersistTasks={persistTasks}
              />
            )}
            {tab === "skills" && (
              <SkillsTab 
                active={true} 
                userId={user?.id}
                skills={skills}
                onPersistSkill={persistSkill}
              />
            )}
            {tab === "log" && (
              <LogTab 
                active={true} 
                userId={user?.id}
                logs={logs}
                tasksHistory={tasks}
                onPersistLog={persistLog}
              />
            )}
            {tab === "interviews" && (
              <InterviewsTab 
                active={true} 
                userId={user?.id}
                interviews={interviews}
                onPersistInterview={persistInterview}
                onDeleteInterview={deleteInterview}
              />
            )}
          </>
        )}
      </div>
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
  statusHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    background: "rgba(18, 26, 43, 0.4)",
    border: "1px solid #1C2842",
    borderRadius: 14,
    padding: "6px 12px",
    gap: 8,
    flexWrap: "wrap"
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: 6
  },
  statusText: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 9.5,
    fontWeight: 600
  },
  userRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginLeft: "auto"
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    maxWidth: "140px",
    overflow: "hidden"
  },
  userEmail: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 9.5,
    color: "#8493AA",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden"
  },
  logoutBtn: {
    color: "#8493AA",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px",
    borderRadius: 6,
    ":hover": {
      color: "#EF4444",
      background: "rgba(239, 68, 68, 0.1)"
    }
  },
  loginBtn: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 9,
    fontWeight: 600,
    background: "#38D9C9",
    color: "#0A0F1C",
    padding: "3px 8px",
    borderRadius: 6,
    boxShadow: "0 2px 6px rgba(56, 217, 201, 0.15)"
  },
  tabBar: {
    display: "flex",
    gap: 6,
    marginBottom: 24,
    overflowX: "auto",
    paddingBottom: 2
  },
  tabBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    border: "1px solid",
    borderRadius: 20,
    padding: "8px 14px",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: "nowrap"
  }
};
