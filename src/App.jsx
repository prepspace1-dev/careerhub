import React, { useState, useEffect } from "react";
import { ListChecks, BookOpen, NotebookPen, Briefcase, LogOut, Cloud, CloudOff, User } from "lucide-react";
import TasksTab from "./components/TasksTab";
import SkillsTab from "./components/SkillsTab";
import LogTab from "./components/LogTab";
import InterviewsTab from "./components/InterviewsTab";
import Auth from "./components/Auth";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { migrateLocalDataToSupabase } from "./db";

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

  const hasSupabase = isSupabaseConfigured();

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
        migrateLocalDataToSupabase(session.user.id);
      }
      setAuthInitialized(true);
    });

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await migrateLocalDataToSupabase(session.user.id);
      } else {
        setUser(null);
      }
      setAuthInitialized(true);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [hasSupabase]);

  const handleLogout = async () => {
    if (hasSupabase) {
      await supabase.auth.signOut();
      setUser(null);
      setUseLocalMode(false);
    }
  };

  if (!authInitialized) {
    return (
      <div style={appStyles.loadingScreen}>
        <div style={appStyles.spinner}></div>
        <div style={appStyles.loadingText}>Initializing Career Hub...</div>
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
                    <span style={{ ...appStyles.statusText, color: "#4ADE80" }}>Cloud Connected</span>
                  </>
                ) : (
                  <>
                    <CloudOff size={13} color="#F2A93B" />
                    <span style={{ ...appStyles.statusText, color: "#F2A93B" }}>Local Storage Mode</span>
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
                    onClick={() => setTab(t.id)}
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

            {/* Tab Panels */}
            <TasksTab active={tab === "tasks"} userId={user?.id} />
            <SkillsTab active={tab === "skills"} userId={user?.id} />
            <LogTab active={tab === "log"} userId={user?.id} />
            <InterviewsTab active={tab === "interviews"} userId={user?.id} />
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
