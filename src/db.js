import { supabase } from "./supabaseClient";
import { generateUUID, sm2 } from "./utils";

// Helper for local storage access with window.storage compatibility
const storage = {
  async get(key, isObject = false) {
    if (window.storage && typeof window.storage.get === "function") {
      try {
        const res = await window.storage.get(key, false);
        const val = res && res.value;
        if (!val) return isObject ? {} : "";
        return isObject ? JSON.parse(val) : val;
      } catch (e) {
        console.error(`Error loading ${key} from window.storage:`, e);
      }
    }
    // Fallback to localStorage
    const val = localStorage.getItem(key);
    if (!val) return isObject ? {} : "";
    return isObject ? JSON.parse(val) : val;
  },

  async set(key, value) {
    const stringValue = typeof value === "string" ? value : JSON.stringify(value);
    if (window.storage && typeof window.storage.set === "function") {
      try {
        await window.storage.set(key, stringValue, false);
        return;
      } catch (e) {
        console.error(`Error saving ${key} to window.storage:`, e);
      }
    }
    // Fallback to localStorage
    localStorage.setItem(key, stringValue);
  }
};

/* ═══════════════════════════════════════════════════════
   EXISTING FUNCTIONS (unchanged)
   ═══════════════════════════════════════════════════════ */

/* ---------------- TASKS STORAGE ---------------- */

export async function fetchTasks(userId) {
  if (supabase && userId) {
    const { data, error } = await supabase
      .from("daily_tasks")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching tasks from Supabase:", error);
      return {};
    }

    const history = {};
    data.forEach((row) => {
      history[row.date] = {
        dsa: row.dsa,
        apps: row.apps,
        learn: row.learn,
        review: row.review,
        project: row.project,
        recap: row.recap,
        appsCount: row.apps_count,
        notes: row.notes || {}
      };
    });
    return history;
  } else {
    return await storage.get("tracker-data", true);
  }
}

export async function saveTasks(userId, dateStr, dayData, fullHistory) {
  if (supabase && userId) {
    const row = {
      user_id: userId,
      date: dateStr,
      dsa: !!dayData.dsa,
      apps: !!dayData.apps,
      learn: !!dayData.learn,
      review: !!dayData.review,
      project: !!dayData.project,
      recap: !!dayData.recap,
      apps_count: dayData.appsCount || 0,
      notes: dayData.notes || {}
    };

    const { error } = await supabase
      .from("daily_tasks")
      .upsert(row, { onConflict: "user_id,date" });

    if (error) {
      console.error("Error saving tasks to Supabase:", error);
      throw error;
    }
  } else {
    await storage.set("tracker-data", fullHistory);
  }
}

/* ---------------- SKILLS STORAGE ---------------- */

export async function fetchSkills(userId, defaults) {
  if (supabase && userId) {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching skills from Supabase:", error);
      return defaults;
    }

    if (data.length === 0) {
      return defaults;
    }

    const levels = {};
    data.forEach((row) => {
      levels[row.skill_id] = row.level;
    });
    // Merge missing keys with default levels
    return { ...defaults, ...levels };
  } else {
    const local = await storage.get("skill-map-data", true);
    return Object.keys(local).length > 0 ? local : defaults;
  }
}

export async function saveSkill(userId, skillId, level, fullSkills) {
  if (supabase && userId) {
    const { error } = await supabase
      .from("skills")
      .upsert({ user_id: userId, skill_id: skillId, level: level }, { onConflict: "user_id,skill_id" });

    if (error) {
      console.error("Error saving skill to Supabase:", error);
      throw error;
    }
  } else {
    await storage.set("skill-map-data", fullSkills);
  }
}

/* ---------------- LOGS STORAGE ---------------- */

export async function fetchLogs(userId) {
  if (supabase && userId) {
    const { data, error } = await supabase
      .from("daily_logs")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching logs from Supabase:", error);
      return {};
    }

    const logs = {};
    data.forEach((row) => {
      logs[row.date] = row.entry;
    });
    return logs;
  } else {
    return await storage.get("daily-log-data", true);
  }
}

export async function saveLog(userId, dateStr, entryText, fullLogs) {
  if (supabase && userId) {
    const { error } = await supabase
      .from("daily_logs")
      .upsert({ user_id: userId, date: dateStr, entry: entryText }, { onConflict: "user_id,date" });

    if (error) {
      console.error("Error saving log to Supabase:", error);
      throw error;
    }
  } else {
    await storage.set("daily-log-data", fullLogs);
  }
}

/* ---------------- INTERVIEWS STORAGE ---------------- */

export async function fetchInterviews(userId) {
  if (supabase && userId) {
    const { data, error } = await supabase
      .from("interviews")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching interviews from Supabase:", error);
      return [];
    }
    return data;
  } else {
    const data = await storage.get("interview-log-data", true);
    const list = Array.isArray(data) ? data : [];
    let dirty = false;
    const cleaned = list.map((item) => {
      if (!item.id || item.id.length < 20 || !item.id.includes("-")) {
        item.id = generateUUID();
        dirty = true;
      }
      return item;
    });
    if (dirty) {
      await storage.set("interview-log-data", cleaned);
    }
    return cleaned;
  }
}

export async function saveInterview(userId, interview, fullInterviews) {
  if (supabase && userId) {
    const { error } = await supabase
      .from("interviews")
      .upsert({
        id: interview.id || undefined,
        user_id: userId,
        company: interview.company,
        stage: interview.stage,
        notes: interview.notes,
        date: interview.date
      });

    if (error) {
      console.error("Error saving interview to Supabase:", error);
      throw error;
    }
  } else {
    await storage.set("interview-log-data", fullInterviews);
  }
}

/* ---------------- PROJECTS STORAGE ---------------- */

export async function fetchProjects(userId) {
  let remoteData = null;
  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        remoteData = data;
      } else if (error) {
        console.error("Error fetching projects from Supabase:", error);
      }
    } catch (err) {
      console.error("Supabase fetchProjects exception:", err);
    }
  }

  const localData = await storage.get("portfolio-projects-data", true);
  const localList = Array.isArray(localData) ? localData : [];

  if (remoteData && remoteData.length > 0) {
    await storage.set("portfolio-projects-data", remoteData);
    return remoteData;
  }

  return localList;
}

export async function saveProject(userId, project, fullProjects) {
  const projectWithId = {
    ...project,
    id: (project.id && project.id.length > 20) ? project.id : generateUUID()
  };

  const updatedProjects = (fullProjects || []).map(p => (p.id === project.id || p.title === project.title) ? projectWithId : p);

  // Always persist to local storage cache immediately
  await storage.set("portfolio-projects-data", updatedProjects);

  if (supabase && userId) {
    try {
      const { error } = await supabase
        .from("projects")
        .upsert({
          id: projectWithId.id,
          user_id: userId,
          title: projectWithId.title,
          tagline: projectWithId.tagline || "",
          phase: projectWithId.phase || "Idea",
          category: projectWithId.category || "",
          tech_stack: projectWithId.tech_stack || projectWithId.techStack || "",
          github_url: projectWithId.github_url || projectWithId.githubUrl || "",
          demo_url: projectWithId.demo_url || projectWithId.demoUrl || "",
          architecture_notes: projectWithId.architecture_notes || projectWithId.architectureNotes || "",
          star_pitch: projectWithId.star_pitch || projectWithId.starPitch || "",
        });

      if (error) {
        console.error("Error saving project directly to Supabase cloud:", error);
      }
    } catch (err) {
      console.error("Supabase saveProject exception:", err);
    }
  }
}

export async function deleteProject(userId, projectId, fullProjects) {
  // Always update local storage immediately
  await storage.set("portfolio-projects-data", fullProjects);

  if (supabase && userId) {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId)
        .eq("user_id", userId);

      if (error) {
        console.error("Error deleting project from Supabase:", error);
      }
    } catch (err) {
      console.error("Supabase deleteProject exception:", err);
    }
  }
}

/* ---------------- PROFILE STORAGE ---------------- */

export async function fetchProfile(userId) {
  if (supabase && userId) {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile from Supabase:", error);
    }
    if (data) return data;
  }
  const data = await storage.get("portfolio-profile-data", true);
  return data && typeof data === "object" ? data : {};
}

export async function saveProfile(userId, profileData) {
  if (supabase && userId) {
    const { error } = await supabase
      .from("user_profiles")
      .upsert({
        user_id: userId,
        name: profileData.name || "",
        target_role: profileData.target_role || profileData.targetRole || "SDE Candidate",
        github: profileData.github || "",
        linkedin: profileData.linkedin || "",
        leetcode: profileData.leetcode || "",
        portfolio_url: profileData.portfolio_url || profileData.portfolioUrl || "",
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    if (error) {
      console.error("Error saving profile to Supabase:", error);
    }
  }
  await storage.set("portfolio-profile-data", profileData);
}

/* ---------------- TRASH / RECYCLE BIN STORAGE ---------------- */

export async function fetchTrash(userId) {
  if (supabase && userId) {
    const { data, error } = await supabase
      .from("trash_bin")
      .select("*")
      .eq("user_id", userId)
      .order("deleted_at", { ascending: false });

    if (!error && data) return data;
  }
  const data = await storage.get("portfolio-trash-data", true);
  return Array.isArray(data) ? data : [];
}

export async function saveTrash(userId, fullTrash) {
  if (supabase && userId && Array.isArray(fullTrash)) {
    try {
      // Upsert rows
      const rows = fullTrash.map((item) => ({
        id: item.id,
        user_id: userId,
        item_type: item.item_type || item.itemType,
        title: item.title,
        data: item.data,
        deleted_at: item.deleted_at || item.deletedAt || new Date().toISOString(),
      }));

      if (rows.length > 0) {
        await supabase.from("trash_bin").upsert(rows);
      }
    } catch (e) {
      console.error("Sync error saving trash to Supabase:", e);
    }
  }
  await storage.set("portfolio-trash-data", fullTrash);
}

/* ---------------- DATA MIGRATION ON LOGIN ---------------- */

export async function migrateLocalDataToSupabase(userId) {
  if (!supabase || !userId) return;

  try {
    // 1. Migrate tasks
    const localTasks = await storage.get("tracker-data", true);
    if (localTasks && Object.keys(localTasks).length > 0) {
      const { count } = await supabase
        .from("daily_tasks")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if (count === 0) {
        const rows = Object.entries(localTasks).map(([date, data]) => ({
          user_id: userId,
          date,
          dsa: !!data.dsa,
          apps: !!data.apps,
          learn: !!data.learn,
          review: !!data.review,
          project: !!data.project,
          recap: !!data.recap,
          apps_count: data.appsCount || 0,
          notes: data.notes || {}
        }));
        if (rows.length > 0) {
          await supabase.from("daily_tasks").upsert(rows);
        }
      }
    }

    // 2. Migrate logs
    const localLogs = await storage.get("daily-log-data", true);
    if (localLogs && Object.keys(localLogs).length > 0) {
      const { count } = await supabase
        .from("daily_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if (count === 0) {
        const rows = Object.entries(localLogs).map(([date, entry]) => ({
          user_id: userId,
          date,
          entry
        }));
        if (rows.length > 0) {
          await supabase.from("daily_logs").upsert(rows);
        }
      }
    }

    // 3. Migrate interviews
    const localInterviews = await storage.get("interview-log-data", true);
    if (localInterviews && localInterviews.length > 0) {
      const { count } = await supabase
        .from("interviews")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if (count === 0) {
        const rows = localInterviews.map((item) => ({
          user_id: userId,
          company: item.company,
          stage: item.stage,
          notes: item.notes,
          date: item.date
        }));
        if (rows.length > 0) {
          await supabase.from("interviews").insert(rows);
        }
      }
    }
  } catch (err) {
    console.error("Error migrating local data to Supabase:", err);
  }
}


/* ═══════════════════════════════════════════════════════
   NEW v2 FUNCTIONS — Problems, Roadmaps, Revision, XP
   ═══════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────
   PROBLEMS VAULT
   ────────────────────────────────────────────── */

/**
 * Fetch all problems for a user.
 * Returns array sorted by solve_date descending.
 */
export async function fetchProblems(userId) {
  let remoteData = null;
  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from("problems")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        remoteData = data;
      } else if (error) {
        console.error("Error fetching problems from Supabase:", error);
      }
    } catch (err) {
      console.error("Supabase fetchProblems exception:", err);
    }
  }

  const localData = await storage.get("problems-data", true);
  const localList = Array.isArray(localData) ? localData : [];

  if (remoteData && remoteData.length > 0) {
    await storage.set("problems-data", remoteData);
    return remoteData;
  }

  return localList;
}

/**
 * Save (upsert) a single problem.
 * Also auto-schedules the problem for revision if solved.
 */
export async function saveProblem(userId, problem, allProblems) {
  const problemWithId = { ...problem, id: problem.id || generateUUID() };

  // Always update local storage first so data is never lost on refresh
  const existing = Array.isArray(allProblems) ? allProblems : [];
  const idx = existing.findIndex((p) => p.id === problemWithId.id);
  const updated =
    idx >= 0
      ? existing.map((p, i) => (i === idx ? problemWithId : p))
      : [problemWithId, ...existing];
  await storage.set("problems-data", updated);

  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from("problems")
        .upsert({
          id: problemWithId.id,
          user_id: userId,
          title: problemWithId.title,
          url: problemWithId.url || "",
          platform: problemWithId.platform || "LeetCode",
          topic: problemWithId.topic,
          difficulty: problemWithId.difficulty || "Medium",
          patterns: problemWithId.patterns || [],
          company_tags: problemWithId.company_tags || [],
          status: problemWithId.status || "solved",
          solve_date: problemWithId.solve_date,
          solve_time_mins: problemWithId.solve_time_mins || 0,
          hints_used: !!problemWithId.hints_used,
          editorial_used: !!problemWithId.editorial_used,
          confidence: problemWithId.confidence || 3,
          notes: problemWithId.notes || "",
        })
        .select()
        .maybeSingle();

      if (!error && data) {
        if (problemWithId.status === "solved") {
          await scheduleRevision(userId, data.id, problemWithId.confidence || 3);
        }
        return data;
      }
    } catch (err) {
      console.error("Supabase saveProblem exception:", err);
    }
  }

  return problemWithId;
}

/**
 * Delete a problem by ID.
 */
export async function deleteProblem(userId, problemId, allProblems) {
  if (supabase && userId) {
    const { error } = await supabase
      .from("problems")
      .delete()
      .eq("id", problemId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting problem from Supabase:", error);
      throw error;
    }
  } else {
    const updated = allProblems.filter(p => p.id !== problemId);
    await storage.set("problems-data", updated);
  }
}

/**
 * Update a specific field on a problem (e.g., confidence, status, notes).
 */
export async function updateProblem(userId, problemId, updates, allProblems) {
  if (supabase && userId) {
    const { error } = await supabase
      .from("problems")
      .update(updates)
      .eq("id", problemId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating problem in Supabase:", error);
      throw error;
    }
  } else {
    const updated = allProblems.map(p =>
      p.id === problemId ? { ...p, ...updates } : p
    );
    await storage.set("problems-data", updated);
  }
}

/* ──────────────────────────────────────────────
   ROADMAP ITEMS
   ────────────────────────────────────────────── */

/**
 * Fetch all roadmap item statuses for a user.
 * Returns: { [roadmapId]: { [itemId]: { status, notes } } }
 */
export async function fetchRoadmapItems(userId) {
  if (supabase && userId) {
    const { data, error } = await supabase
      .from("roadmap_items")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching roadmap items from Supabase:", error);
      return {};
    }

    // Shape: { roadmapId: { itemId: { status, notes } } }
    const shaped = {};
    data.forEach(row => {
      if (!shaped[row.roadmap_id]) shaped[row.roadmap_id] = {};
      shaped[row.roadmap_id][row.item_id] = {
        status: row.status,
        notes:  row.notes || "",
      };
    });
    return shaped;
  } else {
    const data = await storage.get("roadmap-data", true);
    return (typeof data === "object" && data !== null) ? data : {};
  }
}

/**
 * Save a single roadmap item status.
 */
export async function saveRoadmapItem(userId, roadmapId, itemId, status, notes = "", allRoadmapItems = {}) {
  if (supabase && userId) {
    const { error } = await supabase
      .from("roadmap_items")
      .upsert(
        { user_id: userId, roadmap_id: roadmapId, item_id: itemId, status, notes,
          updated_at: new Date().toISOString() },
        { onConflict: "user_id,roadmap_id,item_id" }
      );

    if (error) {
      console.error("Error saving roadmap item to Supabase:", error);
      throw error;
    }
  } else {
    const updated = {
      ...allRoadmapItems,
      [roadmapId]: {
        ...(allRoadmapItems[roadmapId] || {}),
        [itemId]: { status, notes },
      },
    };
    await storage.set("roadmap-data", updated);
  }
}

/* ──────────────────────────────────────────────
   REVISION QUEUE (SM-2)
   ────────────────────────────────────────────── */

/**
 * Fetch all revision queue entries for a user.
 * Returns array with problem data joined.
 */
export async function fetchRevisionQueue(userId) {
  if (supabase && userId) {
    const { data, error } = await supabase
      .from("revision_queue")
      .select(`
        *,
        problems (id, title, url, topic, difficulty, confidence, notes, solve_date)
      `)
      .eq("user_id", userId)
      .order("next_review_date", { ascending: true });

    if (error) {
      console.error("Error fetching revision queue from Supabase:", error);
      return [];
    }
    return data;
  } else {
    const data = await storage.get("revision-queue-data", true);
    return Array.isArray(data) ? data : [];
  }
}

/**
 * Schedule initial revision for a newly solved problem.
 * Uses default SM-2 starting values (interval=1, EF=2.5, reps=0).
 */
async function scheduleRevision(userId, problemId, _confidence) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextReviewDate = tomorrow.toISOString().slice(0, 10);

  if (supabase && userId) {
    await supabase
      .from("revision_queue")
      .upsert(
        {
          user_id:          userId,
          problem_id:       problemId,
          next_review_date: nextReviewDate,
          ease_factor:      2.5,
          interval_days:    1,
          repetitions:      0,
        },
        { onConflict: "user_id,problem_id" }
      );
  }
}

/**
 * After a user reviews a problem, update its SM-2 schedule.
 * @param {number} confidence — 1 (blackout) to 5 (perfect)
 */
export async function completeRevision(userId, revisionId, problemId, confidence, currentEntry, allQueue) {
  const { easeFactor, intervalDays, repetitions, nextReviewDate } = sm2(
    confidence,
    currentEntry.ease_factor    || 2.5,
    currentEntry.interval_days  || 1,
    currentEntry.repetitions    || 0
  );

  if (supabase && userId) {
    const { error } = await supabase
      .from("revision_queue")
      .update({
        next_review_date: nextReviewDate,
        ease_factor:      easeFactor,
        interval_days:    intervalDays,
        repetitions,
      })
      .eq("id", revisionId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating revision queue:", error);
      throw error;
    }
  } else {
    const updated = allQueue.map(item =>
      item.id === revisionId
        ? { ...item, next_review_date: nextReviewDate, ease_factor: easeFactor, interval_days: intervalDays, repetitions }
        : item
    );
    await storage.set("revision-queue-data", updated);
  }

  return { nextReviewDate, intervalDays };
}

/* ──────────────────────────────────────────────
   XP EVENTS
   ────────────────────────────────────────────── */

/**
 * Fetch all XP events for a user. Returns array sorted newest first.
 */
export async function fetchXPEvents(userId) {
  if (supabase && userId) {
    const { data, error } = await supabase
      .from("xp_events")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching XP events from Supabase:", error);
      return [];
    }
    return data;
  } else {
    const data = await storage.get("xp-events-data", true);
    return Array.isArray(data) ? data : [];
  }
}

/**
 * Log a single XP-earning event.
 * @param {string} eventType — e.g. 'problem_medium', 'roadmap_item', 'daily_streak'
 * @param {number} xp        — XP to award
 * @param {Object} metadata  — extra context (title, topic, etc.)
 */
export async function addXPEvent(userId, eventType, xp, metadata = {}, allEvents = []) {
  const event = {
    id:         generateUUID(),
    user_id:    userId,
    event_type: eventType,
    xp,
    metadata,
    created_at: new Date().toISOString(),
  };

  if (supabase && userId) {
    const { error } = await supabase
      .from("xp_events")
      .insert({
        user_id:    userId,
        event_type: eventType,
        xp,
        metadata,
      });

    if (error) {
      console.error("Error saving XP event to Supabase:", error);
      throw error;
    }
  } else {
    const updated = [event, ...allEvents];
    await storage.set("xp-events-data", updated);
  }

  return event;
}

/**
 * Compute total XP from an array of XP events.
 */
export function getTotalXP(xpEvents = []) {
  return xpEvents.reduce((sum, e) => sum + (e.xp || 0), 0);
}

/**
 * Compute XP earned today.
 */
export function getTodayXP(xpEvents = []) {
  const today = new Date().toISOString().slice(0, 10);
  return xpEvents
    .filter(e => e.created_at && e.created_at.slice(0, 10) === today)
    .reduce((sum, e) => sum + (e.xp || 0), 0);
}
