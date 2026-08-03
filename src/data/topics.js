/**
 * topics.js — Canonical topic tree for Career Hub SDE Prep OS
 *
 * All topic IDs here are the single source of truth used across:
 *   - Problem logging (problem.topic = topic.id)
 *   - Roadmap items (roadmap_items table)
 *   - Skills display (computed from problems)
 *   - Company readiness scoring
 */

// ── DSA Patterns ────────────────────────────────────────────────────────────
export const PATTERNS = [
  'Two Pointer',
  'Sliding Window',
  'Fast / Slow Pointer',
  'HashMap / HashSet',
  'Prefix Sum',
  "Kadane's Algorithm",
  'Binary Search',
  'Binary Search on Answer',
  'Divide & Conquer',
  'DFS',
  'BFS',
  'Union Find',
  'Topological Sort',
  'Monotonic Stack',
  'Monotonic Queue',
  'Trie',
  'Segment Tree',
  '1D Dynamic Programming',
  '2D Dynamic Programming',
  'Knapsack',
  'LCS / LIS',
  'Backtracking',
  'Greedy',
  'Bit Manipulation',
  'Math & Number Theory',
  'Two Heaps',
  'Top K Elements',
  'Merge K Lists',
];

// ── Difficulty metadata ──────────────────────────────────────────────────────
export const DIFFICULTY_COLORS = {
  Easy:   '#4ADE80',
  Medium: '#F2A93B',
  Hard:   '#EF4444',
};

export const DIFFICULTY_XP = {
  Easy:   10,
  Medium: 25,
  Hard:   50,
};

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

// ── DSA subtopic definitions (used in topic dashboard + company readiness) ───
export const DSA_SUBTOPICS = [
  {
    id: 'arrays',
    label: 'Arrays',
    targetProblems: 75,
    color: '#38D9C9',
    patterns: ['Two Pointer', 'Sliding Window', 'Prefix Sum', "Kadane's Algorithm", 'HashMap / HashSet', 'Binary Search'],
  },
  {
    id: 'strings',
    label: 'Strings',
    targetProblems: 40,
    color: '#5D8DC1',
    patterns: ['Two Pointer', 'Sliding Window', 'HashMap / HashSet', 'Trie'],
  },
  {
    id: 'linkedlist',
    label: 'Linked List',
    targetProblems: 30,
    color: '#4ADE80',
    patterns: ['Two Pointer', 'Fast / Slow Pointer', 'Divide & Conquer'],
  },
  {
    id: 'stacks_queues',
    label: 'Stacks & Queues',
    targetProblems: 25,
    color: '#F2A93B',
    patterns: ['Monotonic Stack', 'Monotonic Queue', 'BFS'],
  },
  {
    id: 'trees',
    label: 'Trees',
    targetProblems: 45,
    color: '#A78BFA',
    patterns: ['DFS', 'BFS', 'Divide & Conquer'],
  },
  {
    id: 'heap',
    label: 'Heap / Priority Queue',
    targetProblems: 20,
    color: '#F87171',
    patterns: ['Two Heaps', 'Top K Elements', 'Merge K Lists'],
  },
  {
    id: 'graphs',
    label: 'Graphs',
    targetProblems: 35,
    color: '#34D399',
    patterns: ['DFS', 'BFS', 'Union Find', 'Topological Sort'],
  },
  {
    id: 'binary_search',
    label: 'Binary Search',
    targetProblems: 25,
    color: '#60A5FA',
    patterns: ['Binary Search', 'Binary Search on Answer', 'Divide & Conquer'],
  },
  {
    id: 'dp',
    label: 'Dynamic Programming',
    targetProblems: 50,
    color: '#FBBF24',
    patterns: ['1D Dynamic Programming', '2D Dynamic Programming', 'Knapsack', 'LCS / LIS'],
  },
  {
    id: 'backtracking',
    label: 'Backtracking',
    targetProblems: 20,
    color: '#F472B6',
    patterns: ['Backtracking'],
  },
  {
    id: 'greedy',
    label: 'Greedy',
    targetProblems: 20,
    color: '#6EE7B7',
    patterns: ['Greedy'],
  },
  {
    id: 'trie',
    label: 'Trie',
    targetProblems: 10,
    color: '#C4B5FD',
    patterns: ['Trie'],
  },
  {
    id: 'bit_manipulation',
    label: 'Bit Manipulation',
    targetProblems: 15,
    color: '#FCA5A5',
    patterns: ['Bit Manipulation'],
  },
  {
    id: 'sorting',
    label: 'Sorting & Searching',
    targetProblems: 15,
    color: '#93C5FD',
    patterns: ['Divide & Conquer', 'Binary Search'],
  },
];

// ── Full TOPICS tree ─────────────────────────────────────────────────────────
export const TOPICS = {
  dsa: {
    id: 'dsa',
    label: 'DSA',
    fullLabel: 'Data Structures & Algorithms',
    icon: '⚡',
    color: '#38D9C9',
    subtopics: DSA_SUBTOPICS,
  },
  java: {
    id: 'java',
    label: 'Core Java',
    fullLabel: 'Core Java',
    icon: '☕',
    color: '#F2A93B',
    subtopics: [
      { id: 'java_oop',            label: 'OOP Concepts',                   targetProblems: 0 },
      { id: 'java_collections',    label: 'Collections Framework',          targetProblems: 0 },
      { id: 'java_streams',        label: 'Streams & Lambdas',              targetProblems: 0 },
      { id: 'java_generics',       label: 'Generics & Types',               targetProblems: 0 },
      { id: 'java_exceptions',     label: 'Exception Handling',             targetProblems: 0 },
      { id: 'java_multithreading', label: 'Multithreading & Concurrency',   targetProblems: 0 },
      { id: 'java_jvm',            label: 'JVM & Memory Management',        targetProblems: 0 },
    ],
  },
  sql: {
    id: 'sql',
    label: 'SQL',
    fullLabel: 'SQL & Databases',
    icon: '🗄️',
    color: '#4ADE80',
    subtopics: [
      { id: 'sql_basics',       label: 'SQL Basics',               targetProblems: 15 },
      { id: 'sql_joins',        label: 'Joins',                    targetProblems: 10 },
      { id: 'sql_aggregates',   label: 'Aggregates & GROUP BY',    targetProblems: 10 },
      { id: 'sql_window',       label: 'Window Functions',         targetProblems: 8  },
      { id: 'sql_cte',          label: 'CTEs & Subqueries',        targetProblems: 8  },
      { id: 'sql_indexing',     label: 'Indexing & Performance',   targetProblems: 0  },
      { id: 'sql_transactions', label: 'Transactions & ACID',      targetProblems: 0  },
    ],
  },
  cs_fundamentals: {
    id: 'cs_fundamentals',
    label: 'CS Fundamentals',
    fullLabel: 'Computer Science Fundamentals',
    icon: '🖥️',
    color: '#5D8DC1',
    subtopics: [
      { id: 'os',              label: 'Operating Systems',              targetProblems: 0 },
      { id: 'dbms',            label: 'DBMS Concepts',                 targetProblems: 0 },
      { id: 'networking',      label: 'Computer Networks',             targetProblems: 0 },
      { id: 'design_patterns', label: 'Design Patterns & SOLID',       targetProblems: 0 },
    ],
  },
  backend: {
    id: 'backend',
    label: 'Backend & Tools',
    fullLabel: 'Backend Engineering & Tools',
    icon: '⚙️',
    color: '#A78BFA',
    subtopics: [
      { id: 'spring_boot',  label: 'Spring Boot',            targetProblems: 0 },
      { id: 'rest_api',     label: 'REST APIs',              targetProblems: 0 },
      { id: 'jwt_security', label: 'JWT & Spring Security',  targetProblems: 0 },
      { id: 'docker',       label: 'Docker',                 targetProblems: 0 },
      { id: 'redis',        label: 'Redis & Caching',        targetProblems: 0 },
      { id: 'kafka',        label: 'Kafka & Messaging',      targetProblems: 0 },
      { id: 'git',          label: 'Git & Version Control',  targetProblems: 0 },
    ],
  },
};

// ── Derived lookups ──────────────────────────────────────────────────────────

/** Flat array of every subtopic across all categories */
export const ALL_SUBTOPICS = Object.values(TOPICS).flatMap(cat => cat.subtopics);

/** topic_id → label */
export const TOPIC_LABEL = ALL_SUBTOPICS.reduce(
  (acc, t) => ({ ...acc, [t.id]: t.label }),
  {}
);

/** topic_id → color (falls back to category color) */
export const TOPIC_COLOR = Object.values(TOPICS).flatMap(cat =>
  cat.subtopics.map(st => ({ id: st.id, color: st.color || cat.color }))
).reduce((acc, { id, color }) => ({ ...acc, [id]: color }), {});

/** category_id → category */
export const CATEGORY_BY_ID = Object.values(TOPICS).reduce(
  (acc, cat) => ({ ...acc, [cat.id]: cat }),
  {}
);

/** topic_id → parent category */
export const TOPIC_CATEGORY = Object.values(TOPICS).reduce((acc, cat) => {
  cat.subtopics.forEach(st => { acc[st.id] = cat.id; });
  return acc;
}, {});

/**
 * Compute a level (0–5) for a topic from that topic's solved problems.
 * Uses problem count + confidence average as signals.
 */
export function computeTopicLevel(topicId, problems = []) {
  const topicProblems = problems.filter(p => p.topic === topicId && p.status === 'solved');
  const count = topicProblems.length;
  if (count === 0) return 0;

  const avgConf = topicProblems.reduce((s, p) => s + (p.confidence || 3), 0) / count;

  // Level thresholds
  if (count >= 20 && avgConf >= 4) return 5; // Mastered
  if (count >= 12 && avgConf >= 3.5) return 4; // Interview Ready
  if (count >= 6  && avgConf >= 3)   return 3; // Practitioner
  if (count >= 2  && avgConf >= 2)   return 2; // Learner
  return 1; // Explorer
}

export const LEVEL_META = [
  { level: 0, label: 'Not Started',     color: '#3A4560', bgColor: 'rgba(58, 69, 96, 0.15)' },
  { level: 1, label: 'Explorer',        color: '#8493AA', bgColor: 'rgba(132, 147, 170, 0.15)' },
  { level: 2, label: 'Learner',         color: '#5D8DC1', bgColor: 'rgba(93, 141, 193, 0.15)' },
  { level: 3, label: 'Practitioner',    color: '#38D9C9', bgColor: 'rgba(56, 217, 201, 0.15)' },
  { level: 4, label: 'Interview Ready', color: '#4ADE80', bgColor: 'rgba(74, 222, 128, 0.15)' },
  { level: 5, label: 'Mastered',        color: '#F2A93B', bgColor: 'rgba(242, 169, 59, 0.15)' },
];
