export type TabType = 
  | "dashboard" 
  | "workspace" 
  | "roadmap" 
  | "dsa" 
  | "csai" 
  | "projects" 
  | "stats";

export interface UserProfileState {
  displayName: string;
}

export interface DSAProblem {
  id: number;
  leetcodeId: number;
  title: string;
  level: "Easy" | "Medium" | "Hard" | string;
  topic: string;
  url: string;
  day?: number;
  hint?: string;
  pattern?: string;
  companyTags?: string[];
  description?: string;
  approach?: string;
  codeSnippet?: string;
}

export interface DSAProblemStatus {
  status: "Solved" | "Unsolved" | "Revision Required";
  notes?: string;
  bookmarked?: boolean;
  timeSpent?: number;
}

export interface DayProgress {
  theoryRead: boolean;
  tasks: Record<string, boolean>;
  reflection?: Record<string, unknown>;
}

export interface ProjectMilestone {
  day: number;
  title: string;
  deliverable: string;
}

export interface ProjectData {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  techStack: string[];
  description: string;
  week: number;
  days: number[];
  milestones: ProjectMilestone[];
  resumeBullets: string[];
  githubUrl?: string;
  demoUrl?: string;
}

export interface CSAiTopicOperation {
  name: string;
  detail: string;
}

export interface CSAiTopic {
  id?: number;
  day: number;
  title: string;
  subtitle: string;
  category: string;
  timeMinutes: number;
  overview: string;
  operations?: CSAiTopicOperation[];
  realWorldExample?: string;
  takeaway?: string;
  module?: string;
  keyConcepts?: string[];
  interviewQuestions?: string[];
  summaryMarkdown?: string;
}

export interface MilestoneModal {
  type: "dsa" | "streak" | "project" | "csai";
  title: string;
  description: string;
  xp?: number;
}

export interface UserStats {
  streak: number;
  totalMinutes: number;
}

export interface AppContextType {
  theme: "dark" | "light";
  toggleTheme: () => void;
  user: any;
  session: any;
  authLoading: boolean;
  isAuthenticated: boolean;
  isOfflineMode: boolean;
  loginOffline: () => void;
  logout: () => Promise<void>;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  currentDay: number;
  setCurrentDay: (day: number) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  dayProgress: Record<number, DayProgress>;
  toggleDayTask: (dayNum: number, taskId: string) => void;
  toggleTheoryRead: (dayNum: number) => void;
  dsaStatus: Record<number, DSAProblemStatus>;
  updateDSAStatus: (problemId: number, newStatus: string, extra?: Partial<DSAProblemStatus>, syncChecklist?: boolean) => void;
  projectMilestones: Record<number, Record<number, boolean>>;
  toggleProjectMilestone: (projectId: number, dayNum: number, syncChecklist?: boolean) => void;
  dailyNotes: Record<number, string>;
  saveDayNote: (dayNum: number, noteContent: string) => void;
  saveReflection: (dayNum: number, reflectionObj: Record<string, unknown>) => void;
  userStats: UserStats;
  userProfile: UserProfileState;
  updateDisplayName: (name: string) => Promise<void>;
  dsaSolvedCount: number;
  dsaTotalCount: number;
  csCompletedCount: number;
  csTotalCount: number;
  projectMilestonesDone: number;
  projectMilestonesTotal: number;
  overallPercentage: number;
  activeMilestoneModal: MilestoneModal | null;
  setActiveMilestoneModal: (modal: MilestoneModal | null) => void;
}
