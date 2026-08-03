/**
 * companies.js — Company-specific prep packs for the SDE Prep OS
 *
 * Each pack defines topic requirements for that company,
 * used to compute company-specific readiness scores.
 */

/**
 * Required solved problem count per topic, per company.
 * These are approximate industry benchmarks.
 * topic_ids must match those in src/data/topics.js
 */
export const COMPANY_PACKS = [
  {
    id: 'google',
    name: 'Google SWE',
    shortName: 'Google',
    emoji: '🔵',
    color: '#4285F4',
    difficulty: 'Very Hard',
    description: 'Heavy algorithms, graph problems, and strong system design. Multiple onsite rounds.',
    topicRequirements: {
      arrays:         40,
      strings:        25,
      trees:          30,
      graphs:         25,
      dp:             30,
      binary_search:  15,
      heap:           12,
      backtracking:   10,
      bit_manipulation: 8,
    },
    bonusTopics: ['Segment Tree', 'Trie', 'Union Find'],
    mustDoPatterns: ['DFS', 'BFS', '1D Dynamic Programming', 'Divide & Conquer', 'Topological Sort'],
    tips: [
      'Think out loud constantly — communication matters as much as the solution',
      'Always clarify constraints and discuss edge cases before coding',
      'Discuss time/space trade-offs before and after coding',
      'Write clean, modular code — avoid one-liners that are hard to understand',
    ],
  },
  {
    id: 'amazon',
    name: 'Amazon SDE',
    shortName: 'Amazon',
    emoji: '🟠',
    color: '#FF9900',
    difficulty: 'Hard',
    description: 'Strong focus on arrays, trees, and behavioral rounds (Leadership Principles).',
    topicRequirements: {
      arrays:       35,
      strings:      20,
      trees:        25,
      graphs:       15,
      dp:           20,
      heap:         10,
      linkedlist:   10,
    },
    bonusTopics: ['Monotonic Stack', 'Sliding Window'],
    mustDoPatterns: ['Two Pointer', 'BFS', 'DFS', 'Monotonic Stack', 'Top K Elements'],
    tips: [
      'Prepare 6 STAR stories aligned to Amazon Leadership Principles',
      'Always clarify requirements and confirm your approach before coding',
      'Know: LRU Cache, Clone Graph, Merge K Sorted Lists, Design HashMap',
      'Common: Most frequently asked medium difficulty problems on arrays & trees',
    ],
  },
  {
    id: 'microsoft',
    name: 'Microsoft SDE',
    shortName: 'Microsoft',
    emoji: '🟦',
    color: '#00A4EF',
    difficulty: 'Hard',
    description: 'Balanced problem set — expect OOP, design, and algorithmic rounds.',
    topicRequirements: {
      arrays:       30,
      strings:      20,
      trees:        25,
      graphs:       15,
      dp:           20,
      linkedlist:   10,
    },
    bonusTopics: ['Design Patterns', 'OOP'],
    mustDoPatterns: ['Two Pointer', 'DFS', 'BFS', 'Sliding Window', 'Divide & Conquer'],
    tips: [
      'Show your thought process — they value problem-solving methodology',
      'Clean, readable code matters — avoid clever one-liners',
      'Be ready for follow-up optimizations after initial solution',
      'Prepare LLD questions: Design Elevator, Parking Lot, Chess',
    ],
  },
  {
    id: 'meta',
    name: 'Meta (Facebook) SWE',
    shortName: 'Meta',
    emoji: '🔷',
    color: '#0082FB',
    difficulty: 'Hard',
    description: 'Coding-heavy with strong focus on product sense and system design for seniors.',
    topicRequirements: {
      arrays:         30,
      strings:        25,
      trees:          20,
      graphs:         20,
      dp:             20,
      binary_search:  12,
    },
    bonusTopics: ['Two Pointer', 'Sliding Window'],
    mustDoPatterns: ['Two Pointer', 'DFS', 'BFS', "Kadane's Algorithm", 'Sliding Window'],
    tips: [
      'Two rounds of coding — speed and correctness both matter',
      'Behavioral (Jedi): tell me about a conflict, influence without authority',
      'System design for E5+: feed ranking, notification service, social graph',
    ],
  },
  {
    id: 'tcs',
    name: 'TCS Digital / NQT',
    shortName: 'TCS',
    emoji: '🔷',
    color: '#00589C',
    difficulty: 'Medium',
    description: 'Pattern-based DSA, verbal ability, and basic CS fundamentals. Speed matters.',
    topicRequirements: {
      arrays:         20,
      strings:        15,
      stacks_queues:  10,
      linkedlist:     10,
      sorting:        10,
      sql_basics:     10,
    },
    bonusTopics: ['Basic Math', 'Pattern Recognition'],
    mustDoPatterns: ['HashMap / HashSet', 'Two Pointer', 'Binary Search'],
    tips: [
      'Focus on speed and accuracy — 90 minutes for 30+ questions',
      'Practice 100+ easy/medium problems for pattern recognition',
      'Revise: basic sorting, searching, number theory, and string problems',
      'Verbal & quantitative sections matter as much as coding',
    ],
  },
  {
    id: 'accenture',
    name: 'Accenture JFLL',
    shortName: 'Accenture',
    emoji: '🟣',
    color: '#A100FF',
    difficulty: 'Easy-Medium',
    description: 'Hackathon + pseudo-code + basic DSA. Focus on code readability and HR.',
    topicRequirements: {
      arrays:   15,
      strings:  10,
      sorting:  8,
      sql_basics: 8,
    },
    bonusTopics: ['Basic OOP', 'REST APIs'],
    mustDoPatterns: ['HashMap / HashSet', 'Sorting', 'Two Pointer'],
    tips: [
      'Hackathon round matters — practice building simple apps fast',
      'Prepare solid answers for HR: strengths, project walk-through, teamwork',
      'Know basic Java OOP and simple DB queries',
    ],
  },
  {
    id: 'startup',
    name: 'Product Startup',
    shortName: 'Startup',
    emoji: '🚀',
    color: '#7C3AED',
    difficulty: 'Medium',
    description: 'Practical problem solving, real-world system design, and project depth.',
    topicRequirements: {
      arrays:     25,
      strings:    15,
      trees:      15,
      graphs:     10,
      sql_basics: 15,
      sql_joins:  8,
    },
    bonusTopics: ['Spring Boot', 'REST APIs', 'Docker'],
    mustDoPatterns: ['HashMap / HashSet', 'Two Pointer', 'BFS', 'Sliding Window'],
    tips: [
      'Projects matter as much as DSA — know your stack deeply end-to-end',
      'Be ready for practical tasks: build a CRUD API in 30 minutes',
      'System design for small scale: design a URL shortener, chat service',
      'Culture fit matters — ask smart questions about tech choices',
    ],
  },
];

/**
 * Compute company-specific readiness score (0–100) from user's solved problems.
 * @param {Object} pack — a company pack from COMPANY_PACKS
 * @param {Array}  problems — user's solved problems array
 */
export function computeCompanyReadiness(pack, problems = []) {
  const solvedProblems = problems.filter(p => p.status === 'solved');
  const reqs = pack.topicRequirements;
  const topicIds = Object.keys(reqs);

  if (topicIds.length === 0) return 0;

  let totalWeight = 0;
  let earnedWeight = 0;

  topicIds.forEach(topicId => {
    const needed = reqs[topicId];
    const solved = solvedProblems.filter(p => p.topic === topicId).length;
    const progress = Math.min(1, solved / needed);
    totalWeight  += needed;
    earnedWeight += progress * needed;
  });

  return totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
}
