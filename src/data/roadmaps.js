/**
 * roadmaps.js — Complete learning roadmaps for the SDE Prep OS
 *
 * Each roadmap has sections with checkable items.
 * item.id must be globally unique within a roadmap.
 * These are stored in the `roadmap_items` Supabase table.
 */

export const ROADMAPS = {

  // ─────────────────────────────────────────────
  // DSA Roadmap — 35 items, 7 sections
  // ─────────────────────────────────────────────
  dsa: {
    id: 'dsa',
    label: 'DSA Roadmap',
    description: 'From Big-O to graphs — the complete algorithms & data structures path',
    color: '#38D9C9',
    estimatedDays: 90,
    sections: [
      {
        id: 'foundations',
        label: 'Foundations',
        items: [
          { id: 'big_o',           label: 'Big-O Notation & Complexity Analysis',   description: 'Time & space complexity, best/worst/average case analysis' },
          { id: 'recursion',       label: 'Recursion & Base Cases',                 description: 'Stack frames, tail recursion, call tree visualization' },
          { id: 'math_dsa',        label: 'Math Basics for DSA',                   description: 'Modular arithmetic, prime numbers, log laws, bit basics' },
        ],
      },
      {
        id: 'arrays_strings',
        label: 'Arrays & Strings',
        items: [
          { id: 'array_basics',        label: 'Array Basics & In-place Ops',      description: 'Indexing, traversal, rotation, in-place swaps' },
          { id: 'two_pointer',         label: 'Two Pointer Technique',             description: 'Opposite ends, same direction, fast/slow variants' },
          { id: 'sliding_window',      label: 'Sliding Window',                   description: 'Fixed size, variable size, at most K pattern' },
          { id: 'prefix_sum',          label: 'Prefix Sum & Difference Arrays',   description: 'Range sum queries, 2D prefix sum' },
          { id: 'kadane',              label: "Kadane's Algorithm",               description: 'Maximum subarray, circular array variation' },
          { id: 'string_basics',       label: 'String Manipulation',              description: 'Reversal, palindromes, anagram detection, ASCII tricks' },
          { id: 'hashmap_pattern',     label: 'HashMap Frequency Counter Pattern', description: 'Counting occurrences, character maps, grouping anagrams' },
        ],
      },
      {
        id: 'linear_structures',
        label: 'Linear Data Structures',
        items: [
          { id: 'll_singly',       label: 'Singly Linked List',               description: 'Traversal, insertion, deletion, reversal, merge' },
          { id: 'll_doubly',       label: 'Doubly Linked List',               description: 'Bidirectional ops, LRU Cache implementation' },
          { id: 'stacks',          label: 'Stacks — Operations & Patterns',   description: 'LIFO, balanced brackets, undo, call stack' },
          { id: 'monotonic_stack', label: 'Monotonic Stack',                  description: 'Next greater/smaller element, histogram largest rect' },
          { id: 'queues_deque',    label: 'Queues & Deque',                   description: 'FIFO, circular queue, deque sliding window max' },
        ],
      },
      {
        id: 'trees_heaps',
        label: 'Trees & Heaps',
        items: [
          { id: 'binary_tree',  label: 'Binary Tree Traversals (DFS/BFS)', description: 'Inorder, preorder, postorder, level order' },
          { id: 'bst',          label: 'Binary Search Tree',               description: 'Insert, delete, search, validate BST, floor/ceil' },
          { id: 'heap',         label: 'Heaps / Priority Queues',          description: 'Min-heap, max-heap, heapify, top-K, kth largest' },
          { id: 'trie',         label: 'Trie (Prefix Tree)',               description: 'Insert, search, startsWith, autocomplete, word search' },
        ],
      },
      {
        id: 'graphs',
        label: 'Graphs',
        items: [
          { id: 'graph_repr',       label: 'Graph Representation',           description: 'Adjacency list vs matrix, edge list, weighted graphs' },
          { id: 'dfs',              label: 'Depth-First Search (DFS)',        description: 'Iterative & recursive, cycle detection, island counting' },
          { id: 'bfs',              label: 'Breadth-First Search (BFS)',      description: 'Level traversal, shortest path (unweighted), 0-1 BFS' },
          { id: 'union_find',       label: 'Union-Find / Disjoint Sets',      description: 'Path compression, union by rank, cycle detection' },
          { id: 'topo_sort',        label: 'Topological Sort',               description: "Kahn's BFS algo, DFS-based, course schedule pattern" },
          { id: 'shortest_path',    label: 'Shortest Path Algorithms',       description: "Dijkstra's, Bellman-Ford, SPFA basics" },
        ],
      },
      {
        id: 'search_sort',
        label: 'Searching & Sorting',
        items: [
          { id: 'sorting_algos',   label: 'Sorting Algorithms',           description: 'QuickSort, MergeSort, HeapSort, counting sort analysis' },
          { id: 'binary_search',   label: 'Binary Search (Classic)',      description: 'Standard BS, find first/last occurrence, rotated array' },
          { id: 'bs_on_answer',    label: 'Binary Search on Answer Space', description: 'Predicate-based BS, Koko eating bananas, capacity ship' },
        ],
      },
      {
        id: 'advanced_algos',
        label: 'Advanced Algorithms',
        items: [
          { id: 'dp_1d',           label: '1D Dynamic Programming',       description: 'Fibonacci, climbing stairs, house robber, coin change' },
          { id: 'dp_2d',           label: '2D Dynamic Programming',       description: 'Grid paths, LCS, edit distance, interleaving string' },
          { id: 'knapsack',        label: 'Knapsack Variants',            description: '0/1 knapsack, unbounded, partition equal subset' },
          { id: 'backtracking',    label: 'Backtracking',                 description: 'Subsets, permutations, N-Queens, Sudoku solver' },
          { id: 'greedy',          label: 'Greedy Algorithms',            description: 'Interval scheduling, activity selection, jump game' },
          { id: 'bit_manip',       label: 'Bit Manipulation',             description: 'XOR tricks, bit counting, set/clear bit, power of 2' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Core Java Roadmap — 24 items, 4 sections
  // ─────────────────────────────────────────────
  java: {
    id: 'java',
    label: 'Core Java',
    description: 'OOP to concurrency — everything for Java-based SDE interviews',
    color: '#F2A93B',
    estimatedDays: 30,
    sections: [
      {
        id: 'core_lang',
        label: 'Core Language',
        items: [
          { id: 'java_syntax',        label: 'Syntax & Data Types',        description: 'Primitives, wrappers, type casting, autoboxing, operators' },
          { id: 'java_control',       label: 'Control Flow & Methods',     description: 'Loops, conditionals, methods, varargs, pass-by-value' },
          { id: 'java_arrays_str',    label: 'Arrays & Strings in Java',   description: 'String immutability, StringBuilder, Arrays class, String pool' },
        ],
      },
      {
        id: 'oop_design',
        label: 'OOP & Design',
        items: [
          { id: 'java_classes',       label: 'Classes & Objects',           description: 'Constructors, this, static vs instance, inner classes' },
          { id: 'java_inheritance',   label: 'Inheritance & Polymorphism',  description: 'extends, super, method overriding, instanceof, upcasting' },
          { id: 'java_interfaces',    label: 'Interfaces & Abstract',       description: 'default methods, functional interfaces, abstract classes' },
          { id: 'java_encap',         label: 'Encapsulation & Modifiers',   description: 'private, public, protected, package-private, immutability' },
          { id: 'solid_principles',   label: 'SOLID Principles',            description: 'SRP, OCP, LSP, ISP, DIP with Java examples' },
          { id: 'design_patterns_j',  label: 'Key Design Patterns',         description: 'Singleton, Factory, Builder, Observer, Strategy, Decorator' },
        ],
      },
      {
        id: 'collections_gen',
        label: 'Collections & Generics',
        items: [
          { id: 'list_types',         label: 'List: ArrayList & LinkedList',  description: 'Time complexity of operations, when to use each' },
          { id: 'map_types',          label: 'Map: HashMap, TreeMap, LHM',    description: 'Hashing internals, ordering guarantees, LinkedHashMap' },
          { id: 'set_types',          label: 'Set: HashSet, TreeSet',          description: 'Uniqueness, ordered sets, tree-based ordering' },
          { id: 'queue_pq',           label: 'Queue, Deque, PriorityQueue',   description: 'BFS patterns, min/max heap via PQ, Comparator' },
          { id: 'comparator_comp',    label: 'Comparator & Comparable',       description: 'Custom sorting, lambda comparators, sort stability' },
          { id: 'generics_java',      label: 'Generics & Wildcards',          description: 'Type parameters, bounded wildcards, type erasure' },
          { id: 'collections_util',   label: 'Collections Utility Class',     description: 'sort, shuffle, reverse, binarySearch, unmodifiable' },
        ],
      },
      {
        id: 'modern_java',
        label: 'Modern Java & Advanced',
        items: [
          { id: 'lambdas_fns',        label: 'Lambdas & Functional Interfaces', description: 'Function, Predicate, Consumer, Supplier, BiFunction' },
          { id: 'streams_api',        label: 'Streams API',                    description: 'filter, map, reduce, collect, flatMap, sorted, distinct' },
          { id: 'optional',           label: 'Optional Class',                 description: 'Avoiding NPE, orElse, orElseGet, map, flatMap, ifPresent' },
          { id: 'java_exceptions',    label: 'Exception Handling',             description: 'Checked vs unchecked, try-with-resources, custom exceptions' },
          { id: 'concurrency_basics', label: 'Multithreading Basics',          description: 'Thread, Runnable, synchronized, volatile, wait/notify' },
          { id: 'executor_svc',       label: 'ExecutorService & Thread Pools', description: 'ExecutorService, Future, Callable, CompletableFuture basics' },
          { id: 'jvm_gc',             label: 'JVM, GC & Memory Model',         description: 'Heap/Stack, garbage collection, String pool, memory leaks' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // SQL Roadmap — 21 items, 3 sections
  // ─────────────────────────────────────────────
  sql: {
    id: 'sql',
    label: 'SQL & Databases',
    description: 'From basic SELECT to window functions — complete SQL interview prep',
    color: '#4ADE80',
    estimatedDays: 20,
    sections: [
      {
        id: 'sql_basics',
        label: 'SQL Basics',
        items: [
          { id: 'select_where',     label: 'SELECT, FROM, WHERE',           description: 'Basic retrieval, filtering with conditions' },
          { id: 'order_limit',      label: 'ORDER BY, LIMIT, OFFSET',       description: 'Sorting results, pagination' },
          { id: 'distinct_null',    label: 'DISTINCT & NULL Handling',       description: 'Removing duplicates, IS NULL, COALESCE, NULLIF, IFNULL' },
          { id: 'group_by',         label: 'GROUP BY & HAVING',             description: 'Aggregation, filtering groups, difference from WHERE' },
          { id: 'aggregate_fns',    label: 'Aggregate Functions',           description: 'COUNT, SUM, AVG, MIN, MAX, COUNT(DISTINCT ...)' },
          { id: 'case_when',        label: 'CASE WHEN Expressions',         description: 'Conditional logic, pivot tables, custom categorization' },
          { id: 'string_date_fns',  label: 'String & Date Functions',       description: 'SUBSTR, CONCAT, LENGTH, DATE_FORMAT, DATEDIFF, NOW()' },
        ],
      },
      {
        id: 'sql_intermediate',
        label: 'Intermediate SQL',
        items: [
          { id: 'inner_join',       label: 'INNER JOIN',                    description: 'Matching rows from two or more tables' },
          { id: 'outer_joins',      label: 'LEFT, RIGHT & FULL OUTER JOIN', description: 'Including non-matching rows, NULL padding' },
          { id: 'self_join',        label: 'SELF JOIN & CROSS JOIN',        description: 'Comparing rows within same table, cartesian product' },
          { id: 'subqueries',       label: 'Subqueries & Correlated',       description: 'Nested queries, EXISTS, IN, ANY/ALL, correlated subqueries' },
          { id: 'union_ops',        label: 'UNION & UNION ALL',             description: 'Combining result sets, deduplication differences' },
          { id: 'cte',              label: 'CTEs (WITH clause)',             description: 'Named subqueries for readability, recursive CTEs' },
          { id: 'window_fns',       label: 'Window Functions',              description: 'ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, NTILE, PARTITION BY' },
        ],
      },
      {
        id: 'sql_advanced',
        label: 'Advanced & DB Concepts',
        items: [
          { id: 'indexing',         label: 'Indexes & Query Optimization',  description: 'B-tree index, covering index, EXPLAIN plan, composite index' },
          { id: 'normalization',    label: 'Normalization (1NF–3NF)',        description: 'Functional dependencies, anomalies, denormalization trade-offs' },
          { id: 'transactions',     label: 'Transactions & ACID',           description: 'Atomicity, Consistency, Isolation, Durability, isolation levels' },
          { id: 'views',            label: 'Views & Materialized Views',    description: 'Virtual tables, updateable views, when to materialize' },
          { id: 'stored_proc',      label: 'Stored Procedures & Functions', description: 'Server-side reusable logic, triggers, pros/cons' },
          { id: 'constraints',      label: 'Constraints & Data Integrity',  description: 'PK, FK, UNIQUE, CHECK, DEFAULT, cascade behaviors' },
          { id: 'nosql_intro',      label: 'NoSQL Basics (MongoDB)',         description: 'Document model, BSON, when NoSQL beats SQL, CAP theorem' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // OS Roadmap — 15 items, 3 sections
  // ─────────────────────────────────────────────
  os: {
    id: 'os',
    label: 'Operating Systems',
    description: 'Processes, memory, synchronization — OS fundamentals for SDE interviews',
    color: '#5D8DC1',
    estimatedDays: 15,
    sections: [
      {
        id: 'processes_threads',
        label: 'Processes & Threads',
        items: [
          { id: 'proc_thread_diff',   label: 'Process vs Thread',               description: 'PCB, TCB, memory sharing, creation overhead, context switch' },
          { id: 'proc_states',        label: 'Process States & Lifecycle',       description: 'New, Ready, Running, Waiting, Terminated, Zombie, Orphan' },
          { id: 'cpu_scheduling',     label: 'CPU Scheduling Algorithms',        description: 'FCFS, SJF, SRTF, Round Robin, Priority, MLFQ — with examples' },
          { id: 'ipc',                label: 'Inter-Process Communication',      description: 'Pipes, message queues, shared memory, sockets, signals' },
          { id: 'fork_exec',          label: 'Fork, Exec & Wait',                description: 'Creating processes, process tree, zombie processes' },
        ],
      },
      {
        id: 'memory_mgmt',
        label: 'Memory Management',
        items: [
          { id: 'virtual_memory',     label: 'Virtual Memory & Address Spaces',  description: 'Virtual vs physical, address translation, page faults' },
          { id: 'paging',             label: 'Paging & Page Tables',             description: 'Page size, TLB, multi-level paging, inverted page table' },
          { id: 'segmentation',       label: 'Segmentation & Fragmentation',     description: 'External vs internal fragmentation, compaction' },
          { id: 'page_replacement',   label: 'Page Replacement Algorithms',      description: "FIFO, LRU, Optimal (Belady's), Clock algorithm" },
          { id: 'memory_alloc',       label: 'Memory Allocation Strategies',     description: 'First fit, best fit, worst fit, buddy system' },
        ],
      },
      {
        id: 'sync_deadlock',
        label: 'Synchronization & Deadlocks',
        items: [
          { id: 'race_critical',      label: 'Race Conditions & Critical Section', description: 'Mutual exclusion, progress, bounded waiting requirements' },
          { id: 'mutex_semaphore',    label: 'Mutex & Semaphore',                  description: 'Binary vs counting semaphore, producer-consumer, readers-writers' },
          { id: 'monitors',           label: 'Monitors & Condition Variables',     description: 'wait(), signal(), Mesa vs Hoare semantics' },
          { id: 'deadlock',           label: 'Deadlock: 4 Conditions + Solutions', description: "Hold & wait, no preemption, circular wait — Banker's algorithm" },
          { id: 'file_systems_os',    label: 'File Systems Fundamentals',          description: 'inode, directory structure, FAT, ext4, disk scheduling (SSTF, SCAN)' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Computer Networks Roadmap — 15 items, 3 sections
  // ─────────────────────────────────────────────
  networking: {
    id: 'networking',
    label: 'Computer Networks',
    description: 'HTTP to load balancing — networks and web architecture for interviews',
    color: '#60A5FA',
    estimatedDays: 12,
    sections: [
      {
        id: 'core_protocols',
        label: 'Core Protocols',
        items: [
          { id: 'osi_model',    label: 'OSI Model (7 Layers)',      description: 'Physical, Data Link, Network, Transport, Session, Presentation, Application' },
          { id: 'tcp_ip_model', label: 'TCP/IP Model vs OSI',       description: '4-layer model, mapping to OSI, encapsulation' },
          { id: 'tcp_udp',      label: 'TCP vs UDP',                description: '3-way handshake, reliability, ordering, flow control, use cases' },
          { id: 'http_https',   label: 'HTTP & HTTPS',              description: 'Methods, status codes, headers, stateless, TLS/SSL handshake' },
          { id: 'dns',          label: 'DNS Resolution',            description: 'A/AAAA/CNAME records, recursive vs iterative, TTL, DNS cache' },
          { id: 'ip_routing',   label: 'IP & Routing Basics',       description: 'IPv4, IPv6, subnetting, CIDR, ARP, routing tables' },
        ],
      },
      {
        id: 'web_apis',
        label: 'Web & API Concepts',
        items: [
          { id: 'rest_principles',  label: 'REST Principles',              description: 'Stateless, uniform interface, resource URLs, idempotency' },
          { id: 'http2_3',          label: 'HTTP/2 & HTTP/3',              description: 'Multiplexing, server push, QUIC, HPACK header compression' },
          { id: 'websockets',       label: 'WebSockets & SSE',             description: 'Full-duplex, upgrade handshake, when to use vs HTTP polling' },
          { id: 'cookies_jwt',      label: 'Cookies, Sessions & JWT',      description: 'Stateful vs stateless auth, cookie attributes, JWT structure' },
          { id: 'cors',             label: 'CORS & Same-Origin Policy',    description: 'Preflight requests, Access-Control headers, credentials' },
        ],
      },
      {
        id: 'scaling_arch',
        label: 'Scaling & Architecture',
        items: [
          { id: 'load_balancing',   label: 'Load Balancing',               description: 'Round robin, least conn, IP hash, consistent hashing' },
          { id: 'cdn',              label: 'CDN & Edge Caching',            description: 'Cache invalidation, edge PoPs, origin pull vs push' },
          { id: 'caching_strat',    label: 'Caching Strategies',           description: 'Cache-aside, read-through, write-through, eviction (LRU, LFU)' },
          { id: 'microservices',    label: 'Microservices vs Monolith',     description: 'Trade-offs, service discovery, API gateway, event-driven' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // Spring Boot Roadmap — 19 items, 4 sections
  // ─────────────────────────────────────────────
  spring_boot: {
    id: 'spring_boot',
    label: 'Spring Boot',
    description: 'IoC to JWT security — full production-grade Spring Boot backend path',
    color: '#A78BFA',
    estimatedDays: 25,
    sections: [
      {
        id: 'spring_core',
        label: 'Spring Core',
        items: [
          { id: 'ioc_di',         label: 'IoC Container & Dependency Injection', description: '@Component, @Autowired, @Bean, @Configuration, ApplicationContext' },
          { id: 'bean_scopes',    label: 'Bean Scopes & Lifecycle',              description: 'Singleton, prototype, request, session — @PostConstruct, @PreDestroy' },
          { id: 'properties',     label: 'Configuration & Profiles',             description: '@Value, @ConfigurationProperties, Spring profiles, application.yml' },
          { id: 'aop',            label: 'Aspect-Oriented Programming',          description: '@Aspect, @Before, @After, @Around, JoinPoint, pointcut expressions' },
        ],
      },
      {
        id: 'spring_web',
        label: 'Spring Web (REST)',
        items: [
          { id: 'rest_ctrl',      label: 'REST Controllers',                     description: '@RestController, @RequestMapping, @GetMapping, @PostMapping, @DeleteMapping' },
          { id: 'req_resp',       label: 'Request & Response Handling',          description: '@RequestBody, @PathVariable, @RequestParam, ResponseEntity, HttpStatus' },
          { id: 'validation',     label: 'Bean Validation',                      description: '@Valid, @NotNull, @Size, @Email, MethodArgumentNotValidException handler' },
          { id: 'exc_handling',   label: 'Global Exception Handling',            description: '@ControllerAdvice, @ExceptionHandler, custom error response DTOs' },
          { id: 'filters',        label: 'Filters & Interceptors',               description: 'OncePerRequestFilter, HandlerInterceptor, request/response logging' },
        ],
      },
      {
        id: 'spring_data',
        label: 'Spring Data & Persistence',
        items: [
          { id: 'jpa_basics',     label: 'JPA & Hibernate Basics',               description: '@Entity, @Table, @Column, @Id, @GeneratedValue, entity lifecycle' },
          { id: 'jpa_relations',  label: 'JPA Relationships',                    description: '@OneToMany, @ManyToOne, @ManyToMany, fetch types, cascade, orphanRemoval' },
          { id: 'repositories',   label: 'Spring Data Repositories',             description: 'CrudRepository, JpaRepository, @Query (JPQL + native), derived queries' },
          { id: 'transactional',  label: '@Transactional Deep Dive',             description: 'Isolation levels, propagation types, rollback rules, pitfalls' },
          { id: 'flyway',         label: 'Database Migrations (Flyway)',          description: 'Version-controlled schema, V1__init.sql, repeatable migrations' },
        ],
      },
      {
        id: 'security_ops',
        label: 'Security & DevOps',
        items: [
          { id: 'spring_sec',     label: 'Spring Security Architecture',         description: 'SecurityFilterChain, UserDetailsService, password encoding, CSRF' },
          { id: 'jwt_impl',       label: 'JWT Implementation',                   description: 'Token generation, parsing, refresh tokens, JwtAuthenticationFilter' },
          { id: 'oauth2',         label: 'OAuth2 & Social Login',                description: 'Authorization code flow, Google OAuth2, resource server' },
          { id: 'docker_spring',  label: 'Dockerizing Spring Boot',              description: 'Dockerfile, multi-stage builds, docker-compose with Postgres' },
          { id: 'testing_spring', label: 'Testing (JUnit + Mockito)',            description: '@SpringBootTest, @WebMvcTest, MockMvc, @MockBean, integration tests' },
        ],
      },
    ],
  },

}; // end ROADMAPS

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Flat list of all items in a given roadmap */
export function getRoadmapItems(roadmapId) {
  const roadmap = ROADMAPS[roadmapId];
  if (!roadmap) return [];
  return roadmap.sections.flatMap(s => s.items);
}

/**
 * Compute roadmap progress from user's item status map.
 * @param {string} roadmapId
 * @param {Object} userItems — { [item_id]: { status: 'not_started'|'learning'|'mastered' } }
 */
export function getRoadmapProgress(roadmapId, userItems = {}) {
  const items = getRoadmapItems(roadmapId);
  const mastered = items.filter(i => userItems[i.id]?.status === 'mastered').length;
  const learning = items.filter(i => userItems[i.id]?.status === 'learning').length;
  return {
    total:    items.length,
    mastered,
    learning,
    percent:  items.length > 0 ? Math.round((mastered / items.length) * 100) : 0,
  };
}

export const ROADMAP_IDS = Object.keys(ROADMAPS);
