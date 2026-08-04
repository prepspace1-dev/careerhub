import React, { useState, useEffect, useRef } from "react";
import { LayoutDashboard, ListChecks, BookOpen, Database, Map, Building2, FolderKanban, Briefcase, LogOut, Cloud, CloudOff, User, RefreshCw, Award } from "lucide-react";
import OverviewTab from "./components/OverviewTab";
import TasksTab from "./components/TasksTab";
import SkillsTab from "./components/SkillsTab";
import ProblemVault from "./components/ProblemVault";
import RoadmapsTab from "./components/RoadmapsTab";
import CompanyPacksTab from "./components/CompanyPacksTab";
import ProjectsTab from "./components/ProjectsTab";
import InterviewsTab from "./components/InterviewsTab";
import ProfileTab from "./components/ProfileTab";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import Toast from "./components/Toast";
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
  fetchProjects,
  saveProject,
  deleteProject,
  fetchProfile,
  saveProfile,
  fetchTrash,
  saveTrash,
  fetchXPEvents
} from "./db";
import { DEFAULT_SKILLS, generateUUID } from "./utils";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", icon: ListChecks },
  { id: "skills", label: "Skills", icon: BookOpen },
  { id: "roadmaps", label: "Roadmaps", icon: Map },
  { id: "problems", label: "Problem Vault", icon: Database },
  { id: "companies", label: "Company Packs", icon: Building2 },
  { id: "projects", label: "Projects", icon: FolderKanban },
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
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState({});
  const [trash, setTrash] = useState([]);
  const [_xpEvents, setXpEvents] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Soft Delete & UI Prompt States
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, item: null, type: "", title: "", onConfirmAction: null });
  const [toast, setToast] = useState(null);

  const hasSupabase = isSupabaseConfigured();

  // Path-based Routing (e.g. /overview, /tasks, /projects)
  useEffect(() => {
    const validTabs = ["overview", "tasks", "skills", "roadmaps", "problems", "companies", "projects", "interviews", "profile"];

    const handleRouteChange = () => {
      const path = window.location.pathname.replace(/^\/+/, "").split("/")[0];
      const hash = window.location.hash.replace("#", "");

      let targetTab = "overview";
      if (validTabs.includes(path)) {
        targetTab = path;
      } else if (validTabs.includes(hash)) {
        targetTab = hash;
      }

      setTab(targetTab);

      // Normalize URL to clean path without hash (e.g. /overview)
      if (window.location.pathname !== `/${targetTab}` || window.location.hash) {
        window.history.replaceState({}, "", `/${targetTab}`);
      }
    };

    window.addEventListener("popstate", handleRouteChange);
    handleRouteChange(); // Run on mount

    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  const handleTabChange = (newTab) => {
    setTab(newTab);
    window.history.pushState({}, "", `/${newTab}`);
  };

  const hasInitiallyLoaded = useRef(false);

  // Listen to Supabase Auth State
  useEffect(() => {
    if (!hasSupabase) {
      setAuthInitialized(true);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const isSilentRefresh = hasInitiallyLoaded.current;
        if (!isSilentRefresh) {
          await migrateLocalDataToSupabase(session.user.id);
        }
        await loadAllUserData(session.user.id, isSilentRefresh);
      } else {
        setUser(null);
        hasInitiallyLoaded.current = false;
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
      loadAllUserData(null, hasInitiallyLoaded.current);
    }
  }, [useLocalMode, hasSupabase]);

  // Parallel Loader for User Data with Silent Background Refresh support
  async function loadAllUserData(userId, isSilent = false) {
    if (!isSilent && !hasInitiallyLoaded.current) {
      setDataLoaded(false);
    } else {
      setSyncing(true);
    }

    try {
      const [tasksData, skillsData, logsData, interviewsData, problemsData, roadmapData, projectsData, profileData, trashData, xpData] = await Promise.all([
        fetchTasks(userId),
        fetchSkills(userId, DEFAULT_SKILLS),
        fetchLogs(userId),
        fetchInterviews(userId),
        fetchProblems(userId),
        fetchRoadmapItems(userId),
        fetchProjects(userId),
        fetchProfile(userId),
        fetchTrash(userId),
        fetchXPEvents(userId),
      ]);
      
      setTasks(tasksData);
      setSkills(skillsData);
      setLogs(logsData);
      setInterviews(interviewsData);
      setProblems(problemsData || []);
      setRoadmapItems(roadmapData || {});
      setProjects(projectsData || []);
      setProfile(profileData || {});
      setTrash(trashData || []);
      setXpEvents(xpData || []);
      hasInitiallyLoaded.current = true;
    } catch (err) {
      console.error("Error loading application data:", err);
    } finally {
      setDataLoaded(true);
      setSyncing(false);
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

  /**
   * Persist project changes to database / storage
   */
  async function persistProject(projectData, nextProjects) {
    setProjects(nextProjects);
    setSyncing(true);
    try {
      await saveProject(user?.id, projectData, nextProjects);
    } catch (err) {
      console.error("Sync error saving project:", err);
    } finally {
      setSyncing(false);
    }
  }

  /**
   * Delete a project entry
   */
  async function deleteProjectEntry(projectId, nextProjects) {
    setProjects(nextProjects);
    setSyncing(true);
    try {
      await deleteProject(user?.id, projectId, nextProjects);
    } catch (err) {
      console.error("Sync error deleting project:", err);
    } finally {
      setSyncing(false);
    }
  }

  // Profile & Preferences Persist
  async function persistProfile(profileData) {
    setProfile(profileData);
    setSyncing(true);
    try {
      await saveProfile(user?.id, profileData);
    } catch (err) {
      console.error("Sync error saving profile:", err);
    } finally {
      setSyncing(false);
    }
  }

  // Request Soft Delete (opens confirmation modal)
  function requestSoftDelete(item, type, title, performDeleteFn) {
    setConfirmModal({
      isOpen: true,
      item,
      type,
      title: title || item.title || item.company || "Item",
      onConfirmAction: () => executeSoftDelete(item, type, title || item.title || item.company || "Item", performDeleteFn),
    });
  }

  // Execute Soft Delete (moves item to trash & shows Toast with Undo)
  async function executeSoftDelete(item, type, title, performDeleteFn) {
    setConfirmModal({ isOpen: false, item: null, type: "", title: "", onConfirmAction: null });

    const trashEntry = {
      id: generateUUID(),
      original_id: item.id,
      item_type: type,
      title: title || item.title || item.company || "Deleted item",
      data: item,
      deleted_at: new Date().toISOString(),
    };

    const nextTrash = [trashEntry, ...trash];
    setTrash(nextTrash);
    performDeleteFn(item.id);

    // Show Undo Toast
    setToast({
      message: `Moved "${trashEntry.title}" to Recycle Bin`,
      canUndo: true,
      lastTrashItem: trashEntry,
    });

    try {
      await saveTrash(user?.id, nextTrash);
    } catch (err) {
      console.error("Sync error saving trash:", err);
    }
  }

  // 1-Click Undo Toast Handler
  async function handleUndoToast() {
    if (!toast || !toast.lastTrashItem) return;
    const itemToRestore = toast.lastTrashItem;
    setToast(null);
    await restoreFromTrash(itemToRestore.id);
  }

  // Restore item from Trash back to active dataset
  async function restoreFromTrash(trashId) {
    const targetItem = trash.find((t) => t.id === trashId);
    if (!targetItem) return;

    const nextTrash = trash.filter((t) => t.id !== trashId);
    setTrash(nextTrash);

    const type = targetItem.item_type || targetItem.itemType;
    const origData = targetItem.data;

    if (type === "problem") {
      const nextProblems = [origData, ...problems.filter(p => p.id !== origData.id)];
      setProblems(nextProblems);
      await saveProblem(user?.id, origData, nextProblems);
    } else if (type === "interview") {
      const nextInterviews = [origData, ...interviews.filter(i => i.id !== origData.id)];
      setInterviews(nextInterviews);
      await saveInterview(user?.id, origData, nextInterviews);
    } else if (type === "project") {
      const nextProjects = [origData, ...projects.filter(p => p.id !== origData.id)];
      setProjects(nextProjects);
      await saveProject(user?.id, origData, nextProjects);
    } else if (type === "log") {
      const dateKey = origData.date;
      const text = origData.entry || origData.text;
      const nextLogs = { ...logs, [dateKey]: text };
      setLogs(nextLogs);
      await saveLog(user?.id, dateKey, text, nextLogs);
    }

    try {
      await saveTrash(user?.id, nextTrash);
    } catch (err) {
      console.error("Sync error updating trash:", err);
    }
  }

  // Delete Permanently from Trash
  async function permanentDeleteFromTrash(trashId) {
    const nextTrash = trash.filter((t) => t.id !== trashId);
    setTrash(nextTrash);
    try {
      await saveTrash(user?.id, nextTrash);
    } catch (err) {
      console.error("Sync error purging trash item:", err);
    }
  }

  // Empty Trash
  async function emptyTrashAll() {
    setTrash([]);
    try {
      await saveTrash(user?.id, []);
    } catch (err) {
      console.error("Sync error emptying trash:", err);
    }
  }

  // Import Full App Backup JSON
  async function handleImportAppData(importedData) {
    if (!importedData) return;
    if (importedData.tasks) setTasks(importedData.tasks);
    if (importedData.problems) setProblems(importedData.problems);
    if (importedData.interviews) setInterviews(importedData.interviews);
    if (importedData.projects) setProjects(importedData.projects);
    if (importedData.logs) setLogs(importedData.logs);
    if (importedData.roadmapItems) setRoadmapItems(importedData.roadmapItems);
    if (importedData.profile) setProfile(importedData.profile);
    if (importedData.trash) setTrash(importedData.trash);
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
                <div 
                  style={{
                    ...appStyles.userBox,
                    cursor: "pointer",
                    borderColor: tab === "profile" ? "#38D9C9" : "#1E293B",
                    background: tab === "profile" ? "rgba(56, 217, 201, 0.12)" : "rgba(18, 26, 43, 0.6)",
                    transition: "all 0.2s ease",
                  }}
                  onClick={() => handleTabChange("profile")}
                  title="Click to open Profile, Settings & Recycle Bin"
                >
                  <div style={{
                    ...appStyles.userAvatar,
                    background: tab === "profile" ? "rgba(56, 217, 201, 0.2)" : appStyles.userAvatar.background,
                  }}>
                    <User size={12} color={tab === "profile" ? "#38D9C9" : "#8493AA"} />
                  </div>
                  <div style={appStyles.userMeta}>
                    <span 
                      style={{ 
                        ...appStyles.userEmailText, 
                        color: tab === "profile" ? "#38D9C9" : "#E7EDF5",
                        fontWeight: tab === "profile" ? 700 : 500,
                      }} 
                      title={user.email}
                    >
                      {profile.name || user.email}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogout();
                    }} 
                    style={appStyles.logoutBtn} 
                    title="Log Out"
                  >
                    <LogOut size={13} />
                  </button>
                </div>
              ) : (
                <div 
                  style={{
                    ...appStyles.userBox,
                    cursor: "pointer",
                    borderColor: tab === "profile" ? "#38D9C9" : "#1E293B",
                    background: tab === "profile" ? "rgba(56, 217, 201, 0.12)" : "rgba(18, 26, 43, 0.6)",
                    transition: "all 0.2s ease",
                  }}
                  onClick={() => handleTabChange("profile")}
                  title="Click to open Profile, Settings & Recycle Bin"
                >
                  <div style={{
                    ...appStyles.userAvatar,
                    background: tab === "profile" ? "rgba(56, 217, 201, 0.2)" : appStyles.userAvatar.background,
                  }}>
                    <User size={12} color={tab === "profile" ? "#38D9C9" : "#8493AA"} />
                  </div>
                  <div style={appStyles.userMeta}>
                    <span style={{ ...appStyles.userEmailText, color: tab === "profile" ? "#38D9C9" : "#E7EDF5" }}>
                      {profile.name || "Guest Candidate"}
                    </span>
                  </div>
                </div>
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
                projects={projects}
                problems={problems}
                roadmapItems={roadmapItems}
                onNavigateToTab={handleTabChange}
              />
            )}
            {tab === "tasks" && (
              <TasksTab 
                active={true} 
                tasksHistory={tasks}
                problems={problems}
                interviews={interviews}
                roadmapItems={roadmapItems}
                onPersistTasks={persistTasks}
              />
            )}
            {tab === "skills" && (
              <SkillsTab 
                active={true} 
                problems={problems}
                roadmapItems={roadmapItems}
                onPersistProblem={persistProblem}
                onDeleteProblem={(id) => {
                  const p = problems.find((x) => x.id === id);
                  if (p) requestSoftDelete(p, "problem", p.title, deleteProblemEntry);
                }}
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
                onDeleteProblem={(id) => {
                  const p = problems.find((x) => x.id === id);
                  if (p) requestSoftDelete(p, "problem", p.title, deleteProblemEntry);
                }}
              />
            )}
            {tab === "companies" && (
              <CompanyPacksTab
                active={true}
                problems={problems}
              />
            )}
            {tab === "projects" && (
              <ProjectsTab
                active={true}
                projects={projects}
                onPersistProject={persistProject}
                onDeleteProject={(id) => {
                  const pr = projects.find((x) => x.id === id);
                  if (pr) requestSoftDelete(pr, "project", pr.title, deleteProjectEntry);
                }}
              />
            )}
            {tab === "interviews" && (
              <InterviewsTab 
                active={true} 
                interviews={interviews}
                onPersistInterview={persistInterview}
                onDeleteInterview={(id) => {
                  const inv = interviews.find((x) => x.id === id);
                  if (inv) requestSoftDelete(inv, "interview", inv.company, deleteInterview);
                }}
              />
            )}
            {tab === "profile" && (
              <ProfileTab
                active={true}
                user={user}
                profile={profile}
                onSaveProfile={persistProfile}
                trash={trash}
                onRestoreFromTrash={restoreFromTrash}
                onPermanentDeleteFromTrash={permanentDeleteFromTrash}
                onEmptyTrash={emptyTrashAll}
                fullAppData={{
                  tasks,
                  skills,
                  logs,
                  interviews,
                  problems,
                  roadmapItems,
                  projects,
                  profile,
                  trash,
                }}
                onImportAppData={handleImportAppData}
              />
            )}
          </div>
        </div>
      )}

      {/* Soft Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, item: null, type: "", title: "", onConfirmAction: null })}
        onConfirm={() => {
          if (confirmModal.onConfirmAction) confirmModal.onConfirmAction();
        }}
        title={confirmModal.title}
        itemType={confirmModal.type}
      />

      {/* Undo Toast Notification */}
      <Toast
        toast={toast}
        onUndo={handleUndoToast}
        onClose={() => setToast(null)}
      />
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
