const STORAGE_KEYS = {
  THEME: "careerhub_theme",
  CURRENT_DAY: "careerhub_current_day",
  DAY_PROGRESS: "careerhub_day_progress",
  DSA_STATUS: "careerhub_dsa_status",
  PROJECT_MILESTONES: "careerhub_project_milestones",
  DAILY_NOTES: "careerhub_daily_notes",
  USER_STATS: "careerhub_user_stats",
  USER_PROFILE: "careerhub_user_profile"
};

// Safe JSON parser helper
function getLocalJSON(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
}

function setLocalJSON(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

export const storageService = {
  // Theme
  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || "dark";
  },
  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  // Current Day
  getCurrentDay() {
    const day = parseInt(localStorage.getItem(STORAGE_KEYS.CURRENT_DAY), 10);
    return isNaN(day) || day < 1 || day > 30 ? 1 : day;
  },
  setCurrentDay(day) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_DAY, day.toString());
  },

  // Day Task Progress
  getDayProgress() {
    return getLocalJSON(STORAGE_KEYS.DAY_PROGRESS, {});
  },
  saveDayProgress(dayProgressMap) {
    setLocalJSON(STORAGE_KEYS.DAY_PROGRESS, dayProgressMap);
  },

  // DSA Status
  getDSAStatus() {
    return getLocalJSON(STORAGE_KEYS.DSA_STATUS, {});
  },
  saveDSAStatus(dsaStatusMap) {
    setLocalJSON(STORAGE_KEYS.DSA_STATUS, dsaStatusMap);
  },

  // Project Milestones
  getProjectMilestones() {
    return getLocalJSON(STORAGE_KEYS.PROJECT_MILESTONES, {});
  },
  saveProjectMilestones(milestonesMap) {
    setLocalJSON(STORAGE_KEYS.PROJECT_MILESTONES, milestonesMap);
  },

  // Daily Notes & Reflection
  getDailyNotes() {
    return getLocalJSON(STORAGE_KEYS.DAILY_NOTES, {});
  },
  saveDailyNotes(notesMap) {
    setLocalJSON(STORAGE_KEYS.DAILY_NOTES, notesMap);
  },

  // User Stats (streak, study minutes, etc.)
  getUserStats() {
    return getLocalJSON(STORAGE_KEYS.USER_STATS, {
      streak: 0,
      totalMinutes: 0,
      lastActive: null
    });
  },
  saveUserStats(stats) {
    setLocalJSON(STORAGE_KEYS.USER_STATS, stats);
  },

  // User Profile
  getUserProfile() {
    return getLocalJSON(STORAGE_KEYS.USER_PROFILE, {
      displayName: "Sai"
    });
  },
  saveUserProfile(profile) {
    setLocalJSON(STORAGE_KEYS.USER_PROFILE, profile);
  }
};
