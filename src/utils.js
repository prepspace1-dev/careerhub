// ── Existing task definitions (unchanged) ────────────────────────────────────
const WEEKDAY_TASKS = [
  { id: "dsa",    label: "DSA problem solved",     sub: "Solve it, then explain it out loud" },
  { id: "apps",   label: "Applications sent",      sub: "Target 3–5, tailored to the role" },
  { id: "learn",  label: "New concept learned",    sub: "CS basics, Java, or a new tool" },
  { id: "review", label: "Evening review done",    sub: "Re-solve this morning's problem cold" },
];

const WEEKEND_TASKS = [
  { id: "project", label: "Project feature shipped",  sub: "Extend an existing project, don't start fresh" },
  { id: "recap",   label: "Week recap done",           sub: "Explain the week's concepts out loud" },
];

export function dateKey(d) {
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000);
  return local.toISOString().slice(0, 10);
}

export function isWeekend(d) {
  const day = d.getDay();
  return day === 0 || day === 6;
}

export function tasksFor(d) {
  return isWeekend(d) ? WEEKEND_TASKS : WEEKDAY_TASKS;
}

export function dayComplete(dateStr, history) {
  if (!history) return false;
  const d = new Date(dateStr + "T00:00:00");
  const data = history[dateStr];
  if (!data) return false;
  return tasksFor(d).every((t) => !!data[t.id]);
}

export function niceDate(str) {
  const d = new Date(str + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

// DEFAULT_SKILLS kept for backward-compat with old skills table (legacy).
// In the new system skill levels are computed from problems — see data/topics.js
export const DEFAULT_SKILLS = {};

export function generateUUID() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ── XP & Level System ─────────────────────────────────────────────────────────

export const XP_LEVELS = [
  { level: 1, title: "Explorer",        minXP: 0,    maxXP: 499,  color: "#8493AA", bgColor: "rgba(132,147,170,0.12)" },
  { level: 2, title: "Learner",         minXP: 500,  maxXP: 1499, color: "#5D8DC1", bgColor: "rgba(93,141,193,0.12)" },
  { level: 3, title: "Practitioner",    minXP: 1500, maxXP: 2999, color: "#38D9C9", bgColor: "rgba(56,217,201,0.12)" },
  { level: 4, title: "Interview Ready", minXP: 3000, maxXP: 5999, color: "#4ADE80", bgColor: "rgba(74,222,128,0.12)" },
  { level: 5, title: "Mastered",        minXP: 6000, maxXP: Infinity, color: "#F2A93B", bgColor: "rgba(242,169,59,0.12)" },
];

export const XP_REWARDS = {
  problem_easy:      10,
  problem_medium:    25,
  problem_hard:      50,
  roadmap_item:      15,
  roadmap_mastered:  30,
  daily_streak:      10,
  revision_done:      5,
  mock_interview:   100,
};

/** Get the level object for a given total XP */
export function getLevelFromXP(totalXP) {
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= XP_LEVELS[i].minXP) return XP_LEVELS[i];
  }
  return XP_LEVELS[0];
}

/** Progress percentage within the current level (0–100) */
export function getLevelProgress(totalXP) {
  const lvl = getLevelFromXP(totalXP);
  if (lvl.maxXP === Infinity) return 100;
  const range = lvl.maxXP - lvl.minXP;
  const earned = totalXP - lvl.minXP;
  return Math.min(100, Math.round((earned / range) * 100));
}

/** XP awarded for a given problem difficulty */
export function problemXP(difficulty) {
  if (difficulty === "Easy")   return XP_REWARDS.problem_easy;
  if (difficulty === "Medium") return XP_REWARDS.problem_medium;
  if (difficulty === "Hard")   return XP_REWARDS.problem_hard;
  return XP_REWARDS.problem_medium;
}

// ── SM-2 Spaced Repetition Algorithm ─────────────────────────────────────────
/**
 * SuperMemo SM-2 algorithm for scheduling the next review.
 *
 * @param {number} confidence  — user-rated quality (1=worst … 5=perfect)
 * @param {number} easeFactor  — current ease factor (default 2.5)
 * @param {number} intervalDays — current interval in days
 * @param {number} repetitions  — how many successful reviews so far
 * @returns {{ easeFactor, intervalDays, repetitions, nextReviewDate }}
 */
export function sm2(confidence, easeFactor, intervalDays, repetitions) {
  // Map 1-5 confidence to SM-2 quality (0-5 scale)
  const q = confidence; // 1=blackout, 3=hard, 5=perfect

  // Update ease factor (minimum 1.3)
  let newEF = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  newEF = Math.max(1.3, newEF);

  let newInterval;
  let newReps;

  if (q < 3) {
    // Failed — reset to start
    newReps     = 0;
    newInterval = 1;
  } else {
    newReps = repetitions + 1;
    if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(intervalDays * newEF);
    }
  }

  // Compute next review date
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + newInterval);
  const nextReviewDate = nextDate.toISOString().slice(0, 10);

  return {
    easeFactor:     newEF,
    intervalDays:   newInterval,
    repetitions:    newReps,
    nextReviewDate,
  };
}

/** Format a date string as "X days ago" or "Today" or "In X days" */
export function relativeDays(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + "T00:00:00");
  const diff = Math.round((d - today) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === -1) return "Yesterday";
  if (diff < 0) return `${Math.abs(diff)} days ago`;
  if (diff === 1) return "Tomorrow";
  return `In ${diff} days`;
}
