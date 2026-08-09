export interface UserProfileRow {
  user_id: string;
  email: string;
  display_name?: string;
  current_day?: number;
  theme_preference?: string;
  streak_count?: number;
  total_xp?: number;
  total_study_minutes?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DsaSubmissionRow {
  id?: string;
  user_id: string;
  problem_id: number;
  leetcode_id?: number;
  status?: string;
  time_spent_minutes?: number;
  personal_notes?: string;
  bookmarked?: boolean;
  updated_at?: string;
}

export interface DailyProgressRow {
  id?: string;
  user_id: string;
  day_number: number;
  theory_completed?: boolean;
  tasks_completed?: Record<string, boolean>;
  reflection?: Record<string, unknown>;
  updated_at?: string;
}

export interface DailyNoteRow {
  id?: string;
  user_id: string;
  day_number: number;
  content?: string;
  updated_at?: string;
}

export interface ProjectMilestoneRow {
  id?: string;
  user_id: string;
  project_id: number;
  day_number: number;
  completed?: boolean;
  updated_at?: string;
}

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfileRow;
        Insert: UserProfileRow;
        Update: Partial<UserProfileRow>;
      };
      dsa_submissions: {
        Row: DsaSubmissionRow;
        Insert: DsaSubmissionRow;
        Update: Partial<DsaSubmissionRow>;
      };
      daily_progress: {
        Row: DailyProgressRow;
        Insert: DailyProgressRow;
        Update: Partial<DailyProgressRow>;
      };
      daily_notes: {
        Row: DailyNoteRow;
        Insert: DailyNoteRow;
        Update: Partial<DailyNoteRow>;
      };
      project_milestones: {
        Row: ProjectMilestoneRow;
        Insert: ProjectMilestoneRow;
        Update: Partial<ProjectMilestoneRow>;
      };
    };
  };
}
