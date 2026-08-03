import { supabase } from "./supabaseClient";

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
    return Array.isArray(data) ? data : [];
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

/* ---------------- DATA MIGRATION ON LOGIN ---------------- */

export async function migrateLocalDataToSupabase(userId) {
  if (!supabase || !userId) return;

  try {
    // 1. Migrate tasks
    const localTasks = await storage.get("tracker-data", true);
    if (localTasks && Object.keys(localTasks).length > 0) {
      // Check if DB already has entries to avoid overwriting unless empty
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

    // 2. Migrate skills
    const localSkills = await storage.get("skill-map-data", true);
    if (localSkills && Object.keys(localSkills).length > 0) {
      const { count } = await supabase
        .from("skills")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if (count === 0) {
        const rows = Object.entries(localSkills).map(([skillId, level]) => ({
          user_id: userId,
          skill_id: skillId,
          level
        }));
        if (rows.length > 0) {
          await supabase.from("skills").upsert(rows);
        }
      }
    }

    // 3. Migrate logs
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

    // 4. Migrate interviews
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
