const STORAGE_KEYS = {
  THEME: "careerhub_theme",
  CURRENT_DAY: "careerhub_current_day",
  DAY_PROGRESS: "careerhub_day_progress",
  DSA_STATUS: "careerhub_dsa_status",
  PROJECT_MILESTONES: "careerhub_project_milestones",
  DAILY_NOTES: "careerhub_daily_notes",
  USER_STATS: "careerhub_user_stats",
  USER_PROFILE: "careerhub_user_profile",
} as const;

function getLocalJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
}

function setLocalJSON<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

export const storageService = {
  getTheme(): "dark" | "light" {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem(STORAGE_KEYS.THEME) as "dark" | "light") || "dark";
  },
  setTheme(theme: "dark" | "light") {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  getCurrentDay(): number {
    if (typeof window === "undefined") return 1;
    const day = parseInt(localStorage.getItem(STORAGE_KEYS.CURRENT_DAY) || "1", 10);
    return isNaN(day) || day < 1 || day > 30 ? 1 : day;
  },
  setCurrentDay(day: number) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.CURRENT_DAY, day.toString());
  },

  getDayProgress(): Record<number, any> {
    return getLocalJSON(STORAGE_KEYS.DAY_PROGRESS, {});
  },
  saveDayProgress(dayProgressMap: Record<number, any>) {
    setLocalJSON(STORAGE_KEYS.DAY_PROGRESS, dayProgressMap);
  },

  getDSAStatus(): Record<number, any> {
    return getLocalJSON(STORAGE_KEYS.DSA_STATUS, {});
  },
  saveDSAStatus(dsaStatusMap: Record<number, any>) {
    setLocalJSON(STORAGE_KEYS.DSA_STATUS, dsaStatusMap);
  },

  getProjectMilestones(): Record<number, Record<number, boolean>> {
    return getLocalJSON(STORAGE_KEYS.PROJECT_MILESTONES, {});
  },
  saveProjectMilestones(milestonesMap: Record<number, Record<number, boolean>>) {
    setLocalJSON(STORAGE_KEYS.PROJECT_MILESTONES, milestonesMap);
  },

  getDailyNotes(): Record<number, string> {
    return getLocalJSON(STORAGE_KEYS.DAILY_NOTES, {});
  },
  saveDailyNotes(notesMap: Record<number, string>) {
    setLocalJSON(STORAGE_KEYS.DAILY_NOTES, notesMap);
  },

  getUserStats() {
    return getLocalJSON(STORAGE_KEYS.USER_STATS, {
      streak: 0,
      totalMinutes: 0,
      lastActive: null,
    });
  },
  saveUserStats(stats: any) {
    setLocalJSON(STORAGE_KEYS.USER_STATS, stats);
  },

  getUserProfile(): { displayName: string } {
    return getLocalJSON(STORAGE_KEYS.USER_PROFILE, {
      displayName: "",
    });
  },
  saveUserProfile(profile: { displayName: string }) {
    setLocalJSON(STORAGE_KEYS.USER_PROFILE, profile);
  },
};
