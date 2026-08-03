const WEEKDAY_TASKS = [
  { id: "dsa", label: "DSA problem solved", sub: "Solve it, then explain it out loud" },
  { id: "apps", label: "Applications sent", sub: "Target 3–5, tailored to the role" },
  { id: "learn", label: "New concept learned", sub: "CS basics, Java, or a new tool" },
  { id: "review", label: "Evening review done", sub: "Re-solve this morning's problem cold" },
];

const WEEKEND_TASKS = [
  { id: "project", label: "Project feature shipped", sub: "Extend an existing project, don't start fresh" },
  { id: "recap", label: "Week recap done", sub: "Explain the week's concepts out loud" },
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

export const DEFAULT_SKILLS = {
  arrays: 3,
  strings: 3,
  linkedlist: 1,
  stacksqueues: 0,
  trees: 0,
  graphs: 0,
  syntax: 2,
  oop: 1,
  collections: 1,
  exceptions: 0,
  sqlbasics: 1,
  joins: 0,
  jdbc: 0,
  dbmsconcepts: 0,
  os: 0,
  networking: 0,
  springboot: 0,
  restapi: 0,
  git: 0,
  inventory: 1,
  rag: 1,
  upi: 1
};

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
