export const csAiTopics = [
  {
    day: 1,
    title: "Processes vs Threads",
    subtitle: "How Your Code Actually Runs",
    category: "Systems Foundations",
    timeMinutes: 60,
    overview: "A process is an isolated executing program instance with its own private virtual memory space. A thread is an execution unit inside a process that shares memory with sibling threads.",
    operations: [
      { name: "Process Creation", detail: "OS allocates PID, private address space (code, data, heap, stack), and handles file descriptors." },
      { name: "Thread Spawning", detail: "Lighter cost. Shares heap and static memory, gets its own stack and register set." },
      { name: "Context Switching", detail: "Switching processes requires swapping page tables (expensive). Switching threads only swaps registers & stack pointers (cheap)." }
    ],
    realWorldExample: "Chrome opens each tab as a separate Process (if tab A crashes, tab B survives). Inside tab A, multiple Threads handle audio, rendering, and web requests concurrently.",
    takeaway: "Use processes for isolation and security. Use threads for high-performance shared-memory concurrency."
  },
  {
    day: 2,
    title: "Memory Management & Virtual Memory",
    subtitle: "Where Your Variables Actually Live",
    category: "Systems Foundations",
    timeMinutes: 65,
    overview: "Memory is divided into Stack (fast, contiguous, auto-managed scope frames) and Heap (dynamic allocations, manual/GC freed). Virtual Memory gives each process the illusion of continuous private RAM.",
    operations: [
      { name: "Stack Allocation", detail: "Push stack frame on function call (local vars). Auto popped on return." },
      { name: "Heap Allocation", detail: "Dynamic malloc / new. Pointer stored on stack points to heap memory block." },
      { name: "Paging & Swapping", detail: "OS splits virtual address space into 4KB pages mapped to physical RAM frames or disk swap." }
    ],
    realWorldExample: "Out-of-memory errors occur when heap memory is leaked (allocated but never garbage collected), causing OS to page heavily to disk ('thrashing').",
    takeaway: "Stack is fast and short-lived. Heap is dynamic and long-lived. Understand GC to prevent memory leaks."
  },
  {
    day: 3,
    title: "CPU Scheduling & Context Switching",
    subtitle: "How One Core Feels Like Hundreds",
    category: "Systems Foundations",
    timeMinutes: 60,
    overview: "CPU cores run single instructions at lightspeed. The OS Scheduler divides CPU time using strategies like Round-Robin or Priority Scheduling to run multiple threads simultaneously via time-slicing.",
    operations: [
      { name: "Time Slicing", detail: "Each thread gets a tiny quantum (e.g. 5ms) to execute before preemption." },
      { name: "Register Saving", detail: "OS saves current CPU registers to thread control block (TCB)." },
      { name: "State Restoration", detail: "Scheduler loads saved registers of next thread and jumps to program counter." }
    ],
    realWorldExample: "Spawning 10,000 threads on a 4-core machine degrades performance because the CPU spends more time context-switching than doing real work.",
    takeaway: "More threads != faster code. Match worker thread pools to available CPU cores for compute-heavy tasks."
  },
  {
    day: 4,
    title: "Concurrency, Multithreading & Deadlocks",
    subtitle: "When Threads Fight Over Shared Data",
    category: "Systems Foundations",
    timeMinutes: 70,
    overview: "Race conditions happen when two threads modify shared data simultaneously without synchronization. Deadlocks freeze threads when circular dependencies form over resource locks.",
    operations: [
      { name: "Mutex Lock", detail: "Thread acquires lock before entering critical section; other threads block." },
      { name: "Atomic Operations", detail: "Hardware-level atomic instruction (Compare-And-Swap) for lock-free counters." },
      { name: "Deadlock Prevention", detail: "Acquire locks in a strict global order across all threads to break circular wait." }
    ],
    realWorldExample: "Bank transfers: Thread 1 locks Account A then wants B. Thread 2 locks Account B then wants A. Result: both freeze forever.",
    takeaway: "Always acquire multiple locks in identical order. Keep critical sections as short as possible."
  },
  {
    day: 5,
    title: "Networking Basics: TCP/IP & DNS",
    subtitle: "How Data Travels the Internet",
    category: "Systems Foundations",
    timeMinutes: 75,
    overview: "IP addresses route packets across routers. TCP guarantees ordered, reliable packet delivery via 3-way handshakes. DNS translates domain names (google.com) into IP addresses.",
    operations: [
      { name: "DNS Lookup", detail: "Browser -> Local DNS -> Root Server -> TLD Server -> Authoritative DNS -> IP." },
      { name: "TCP 3-Way Handshake", detail: "Client sends SYN -> Server responds SYN-ACK -> Client sends ACK." },
      { name: "Reliable Transmission", detail: "ACKs and sequence numbers resend lost packets automatically." }
    ],
    realWorldExample: "Typing google.com in browser triggers DNS lookup -> TCP Handshake -> TLS Handshake -> HTTP GET Request -> HTML Render.",
    takeaway: "TCP guarantees data integrity. UDP trades reliability for ultra-fast low-latency streaming."
  },
  {
    day: 6,
    title: "HTTP/HTTPS & REST APIs",
    subtitle: "The Standard Language of Web Services",
    category: "Systems Foundations",
    timeMinutes: 65,
    overview: "HTTP is a stateless client-server protocol. HTTPS adds TLS encryption. REST organizes API endpoints around nouns (`/users/123`) using standard HTTP verbs (GET, POST, PUT, DELETE).",
    operations: [
      { name: "GET", detail: "Read resource (idempotent, safe to cache)." },
      { name: "POST", detail: "Create new resource (non-idempotent)." },
      { name: "PUT / PATCH", detail: "Replace / update existing resource." },
      { name: "DELETE", detail: "Remove resource from backend database." }
    ],
    realWorldExample: "Instagram client sends `GET /posts?limit=20` to fetch feed, and `POST /posts/45/likes` to add a heart.",
    takeaway: "Stateless REST APIs make scaling backends horizontally simple with load balancers."
  },
  {
    day: 7,
    title: "WebSockets, UDP & Week 1 Review",
    subtitle: "Real-Time Communication Protocols",
    category: "Systems Foundations",
    timeMinutes: 70,
    overview: "WebSockets upgrade HTTP connection into a full-duplex persistent TCP socket for instant two-way messaging without polling.",
    operations: [
      { name: "WebSocket Handshake", detail: "HTTP request with `Upgrade: websocket` header converts socket." },
      { name: "Bi-directional Framing", detail: "Client and server stream binary/text frames back and forth with low overhead." }
    ],
    realWorldExample: "WhatsApp web chat uses WebSockets for instant message delivery. Multiplayer gaming uses raw UDP for minimum ping.",
    takeaway: "Use HTTP for standard CRUD; WebSockets for real-time live events; UDP for live video/audio streams."
  },
  {
    day: 8,
    title: "DBMS Fundamentals & ACID Properties",
    subtitle: "How Applications Store Data Safely",
    category: "Data & System Design",
    timeMinutes: 70,
    overview: "A Database Management System provides structured persistent storage. ACID guarantees ensure transactional safety even during system crashes.",
    operations: [
      { name: "Atomicity", detail: "All steps in a transaction succeed or all roll back (all-or-nothing)." },
      { name: "Consistency", detail: "Database constraints (foreign keys, types) remain valid before and after." },
      { name: "Isolation", detail: "Concurrent transactions don't interfere with each other's intermediate state." },
      { name: "Durability", detail: "Committed changes survive server crashes (written to WAL log on disk)." }
    ],
    realWorldExample: "Transferring $100: Debit Account A and Credit Account B wrapped in single ACID transaction. If server crashes mid-way, money is restored to A.",
    takeaway: "Use Relational SQL for strong consistency (financial data). Use NoSQL for unstructured high-scale horizontal reads."
  },
  {
    day: 9,
    title: "SQL Deep Dive: Joins, Indexes & Transactions",
    subtitle: "Optimizing Database Queries at Scale",
    category: "Data & System Design",
    timeMinutes: 75,
    overview: "SQL indexes speed up read queries from O(N) full table scans to O(log N) B-Tree lookups. Joins combine relational tables on foreign key keys.",
    operations: [
      { name: "B-Tree Indexing", detail: "Indexes store sorted column values + pointers to disk rows." },
      { name: "INNER JOIN", detail: "Returns rows matching in both left and right tables." },
      { name: "EXPLAIN ANALYZE", detail: "Tool to inspect query execution plan and detect missing indexes." }
    ],
    realWorldExample: "Querying 10M users without an index on `email` takes 5 seconds (full scan). Adding `CREATE INDEX idx_email` drops search time to 2 milliseconds.",
    takeaway: "Index columns used frequently in WHERE, JOIN, and ORDER BY. Avoid over-indexing as it slows down WRITEs."
  },
  {
    day: 10,
    title: "System Design Fundamentals & Scaling",
    subtitle: "How Apps Scale to Millions of Users",
    category: "Data & System Design",
    timeMinutes: 80,
    overview: "Vertical scaling upgrades server hardware (RAM/CPU). Horizontal scaling adds multiple smaller commodity servers behind a load balancer with read replicas.",
    operations: [
      { name: "Read Replicas", detail: "Primary database handles WRITES; async copies handle READ traffic." },
      { name: "Database Sharding", detail: "Partition huge tables across multiple DB nodes by user_id hash." }
    ],
    realWorldExample: "Twitter/X is 99% reads and 1% tweets. Reads hit cached read replicas while tweets write to primary cluster.",
    takeaway: "Identify whether your system is read-heavy or write-heavy before choosing database scaling architecture."
  },
  {
    day: 11,
    title: "Caching & Content Delivery Networks (CDNs)",
    subtitle: "Why Pages Load in Milliseconds",
    category: "Data & System Design",
    timeMinutes: 65,
    overview: "Caching stores hot data in fast in-memory stores like Redis to skip DB lookups. CDNs cache static assets (images, JS) on edge servers close to users worldwide.",
    operations: [
      { name: "Cache-Aside Pattern", detail: "App checks Redis -> if hit return -> if miss query DB and save to Redis with TTL." },
      { name: "Cache Invalidation", detail: "Purge or update cache when database source of truth changes." }
    ],
    realWorldExample: "Netflix thumbnail images are served directly from local ISP CDN servers in your city rather than origin servers in California.",
    takeaway: "Redis caches DB results in RAM. CDNs cache static assets on edge nodes worldwide."
  },
  {
    day: 12,
    title: "Load Balancers & Reverse Proxies",
    subtitle: "Distributing Traffic Without Crashes",
    category: "Data & System Design",
    timeMinutes: 65,
    overview: "Load balancers distribute incoming requests across backend servers (Round Robin, Least Connections). Reverse proxies (Nginx) handle SSL, routing, and security.",
    operations: [
      { name: "SSL Termination", detail: "Proxy decrypts HTTPS traffic before forwarding HTTP to internal app servers." },
      { name: "Health Checks", detail: "Periodically pings `/health` and routes traffic away from failing servers." }
    ],
    realWorldExample: "Nginx accepts millions of incoming requests on port 443, decrypts HTTPS, and balances load across 10 Node.js backend app instances.",
    takeaway: "Reverse proxies shield your internal backend architecture from the public internet."
  },
  {
    day: 13,
    title: "Git, GitHub & Docker Containers",
    subtitle: "Standard Production Engineering Tools",
    category: "Data & System Design",
    timeMinutes: 75,
    overview: "Git tracks version history with branches and PRs. Docker packages code, runtime, and OS dependencies into a lightweight container image that runs identically everywhere.",
    operations: [
      { name: "Containerization", detail: "Dockerfile defines base image, environment variables, copy code, npm install, CMD run." },
      { name: "Image vs Container", detail: "Docker Image is a read-only blueprint class; Container is a running instance." }
    ],
    realWorldExample: "Eliminates 'it works on my machine' bug by running exact same Docker container in dev, staging, and production.",
    takeaway: "Master git feature branching and build minimal multi-stage Dockerfiles for fast deployments."
  },
  {
    day: 14,
    title: "Message Queues & Background Jobs",
    subtitle: "Asynchronous Architecture for Slow Work",
    category: "Data & System Design",
    timeMinutes: 70,
    overview: "Message queues (RabbitMQ, SQS, Redis BullMQ) decouple slow tasks (video processing, email sending) from synchronous web request cycles.",
    operations: [
      { name: "Producer", detail: "Web server publishes task payload `{ userId, email }` to queue and returns immediate 200 OK." },
      { name: "Consumer Worker", detail: "Background process pops task from queue and sends email asynchronously." }
    ],
    realWorldExample: "Uploading a video on YouTube returns immediately while background worker cluster encodes 4K, 1080p, and 720p versions.",
    takeaway: "Never block a web request with slow external API calls or file processing. Offload to queues."
  },
  {
    day: 15,
    title: "Authentication, Authorization & OWASP Security",
    subtitle: "Keeping Web Apps and Users Safe",
    category: "Security, Cloud & AI",
    timeMinutes: 70,
    overview: "Authentication verifies identity (Who are you?). Authorization verifies permissions (What can you access?). OWASP outlines top security risks (SQLi, XSS, CSRF).",
    operations: [
      { name: "JWT Tokens", detail: "Stateless signed JSON Web Token containing user ID and payload." },
      { name: "Password Hashing", detail: "Hash passwords with bcrypt/argon2 salt to prevent plain-text leak." },
      { name: "Parameterized Queries", detail: "Prevents SQL injection by separating code from user input parameters." }
    ],
    realWorldExample: "Logging in returns a signed JWT stored in HttpOnly cookie. Server verifies signature without querying DB on every request.",
    takeaway: "Never store plain-text passwords. Use bcrypt for passwords and parameterized queries for DB safety."
  },
  {
    day: 16,
    title: "Cloud Fundamentals & Serverless Computing",
    subtitle: "AWS, Azure & Event-Driven Functions",
    category: "Security, Cloud & AI",
    timeMinutes: 65,
    overview: "Cloud providers rent virtual compute (EC2), object storage (S3), and managed DBs. Serverless (AWS Lambda) runs code on demand and scales to zero when idle.",
    operations: [
      { name: "Object Storage (S3)", detail: "Stores images/videos as unstructured blob objects with public URLs." },
      { name: "Serverless Execution", detail: "Function spins up in response to trigger (API call, S3 upload) and terminates." }
    ],
    realWorldExample: "Uploading profile image to S3 triggers Lambda function to resize thumbnail automatically.",
    takeaway: "Use serverless for spiky, event-driven workloads. Use traditional instances for steady heavy compute."
  },
  {
    day: 17,
    title: "Containers & Kubernetes (High Level)",
    subtitle: "Orchestrating Containerized Microservices",
    category: "Security, Cloud & AI",
    timeMinutes: 65,
    overview: "Kubernetes (K8s) orchestrates hundreds of Docker containers across cluster nodes, handling auto-healing, rolling updates, and load balancing.",
    operations: [
      { name: "Pod", detail: "Smallest deployable unit containing one or more Docker containers." },
      { name: "Deployment", detail: "Declares desired replica count (e.g. 5 pods) and handles zero-downtime rolling updates." },
      { name: "Service", detail: "Provides a stable IP endpoint and load balancing across active pods." }
    ],
    realWorldExample: "If an app container crashes due to memory spike, Kubernetes automatically kills it and launches a fresh container in 2 seconds.",
    takeaway: "Kubernetes manages scale and fault tolerance automatically across container clusters."
  },
  {
    day: 18,
    title: "AI Fundamentals: ML, DL & Neural Networks",
    subtitle: "How Machines Learn From Data",
    category: "Security, Cloud & AI",
    timeMinutes: 70,
    overview: "Machine Learning learns mathematical patterns directly from input data instead of hardcoded rules. Deep Learning uses multi-layered Neural Networks.",
    operations: [
      { name: "Forward Pass", detail: "Passes input features through weighted nodes to output prediction." },
      { name: "Loss Function", detail: "Measures error difference between model prediction and ground truth." },
      { name: "Backpropagation", detail: "Uses gradient descent calculus to tweak node weights to reduce loss." }
    ],
    realWorldExample: "Spam filter learns from 1M labeled emails to predict whether new incoming message is spam.",
    takeaway: "Neural networks stack math layers to approximate complex non-linear functions."
  },
  {
    day: 19,
    title: "Large Language Models & Transformers",
    subtitle: "The Engine Behind ChatGPT & Claude",
    category: "Security, Cloud & AI",
    timeMinutes: 75,
    overview: "LLMs predict the next most likely token over massive text corpora. The Transformer architecture relies on Self-Attention to process entire text sequences in parallel.",
    operations: [
      { name: "Tokenization", detail: "Splits raw text into sub-word tokens (e.g. 'learning' -> 'learn', 'ing')." },
      { name: "Self-Attention", detail: "Calculates mathematical attention weights between every word pair in context window." }
    ],
    realWorldExample: "Self-attention lets the model know 'it' refers to 'the dog' in 'The dog ran because it was happy'.",
    takeaway: "Transformers replaced sequential RNNs by processing text sequences in parallel using self-attention."
  },
  {
    day: 20,
    title: "Embeddings & Vector Databases",
    subtitle: "How AI Compares Meaning mathematically",
    category: "Security, Cloud & AI",
    timeMinutes: 70,
    overview: "Text embeddings convert raw text into high-dimensional numerical vectors (e.g., 1536 floats) where semantically similar text points sit close in vector space.",
    operations: [
      { name: "Vectorization", detail: "Embedding API converts text snippet into vector array." },
      { name: "Cosine Similarity", detail: "Calculates angle dot-product between two vectors to measure similarity." },
      { name: "Vector Index Search", detail: "Vector DB (ChromaDB, Pinecone) returns nearest neighbor vectors in milliseconds." }
    ],
    realWorldExample: "Searching 'king' in vector DB returns 'queen' and 'monarch' even if exact keyword is absent.",
    takeaway: "Vector databases power semantic search and recommendation systems."
  },
  {
    day: 21,
    title: "RAG (Retrieval-Augmented Generation)",
    subtitle: "Grounding LLMs on Private Knowledge",
    category: "Security, Cloud & AI",
    timeMinutes: 75,
    overview: "RAG prevents LLM hallucinations by retrieving relevant document snippets from a vector database and injecting them directly into the LLM prompt context.",
    operations: [
      { name: "Chunk & Embed", detail: "Parse custom PDF into 500-token chunks and store in vector database." },
      { name: "Retrieval", detail: "Embed user question and fetch Top-K most relevant document chunks." },
      { name: "Grounded Generation", detail: "Prompt LLM: 'Answer using only these context snippets: [Chunks]'." }
    ],
    realWorldExample: "Enterprise AI chatbot answers questions about company HR PDF policies accurately with exact page citations.",
    takeaway: "RAG is cheaper and faster than fine-tuning for keeping LLM answers accurate and updated."
  },
  {
    day: 22,
    title: "Prompt Engineering & Few-Shot Prompting",
    subtitle: "Getting High Quality Output From LLMs",
    category: "Agentic AI & Engineering",
    timeMinutes: 60,
    overview: "Prompt engineering structures instructions, roles, few-shot examples, and output constraints to maximize LLM accuracy and force structured JSON responses.",
    operations: [
      { name: "Role Prompting", detail: "Assign expert persona ('You are a Staff Security Engineer...')." },
      { name: "Few-Shot Examples", detail: "Provide 2-3 input/output pairs in prompt to guide expected format." },
      { name: "Chain-of-Thought", detail: "Instruct 'Think step-by-step before producing final answer'." }
    ],
    realWorldExample: "Adding a JSON schema and few-shot examples guarantees LLM returns clean JSON instead of conversational text.",
    takeaway: "Specific prompts + output constraints beat raw LLM model size."
  },
  {
    day: 23,
    title: "AI Agents & The Agentic Loop",
    subtitle: "Moving From Talking AI to Doing AI",
    category: "Agentic AI & Engineering",
    timeMinutes: 70,
    overview: "An AI Agent autonomously executes actions by looping through: Plan -> Select Tool -> Execute Tool -> Observe Output -> Re-plan until goal is achieved.",
    operations: [
      { name: "Tool Definition", detail: "Expose app functions (e.g. `search_database`, `run_code`) as JSON schemas to LLM." },
      { name: "Agentic Loop", detail: "Model requests tool execution -> App runs code -> App returns result back to LLM." }
    ],
    realWorldExample: "Coding agent like Claude Code reads files, runs unit tests, fixes syntax errors, and re-tests autonomously.",
    takeaway: "Agents combine reasoning with tool execution to solve complex multi-step tasks."
  },
  {
    day: 24,
    title: "MCP (Model Context Protocol) & Tool Calling",
    subtitle: "The USB-C Standard for AI Integrations",
    category: "Agentic AI & Engineering",
    timeMinutes: 65,
    overview: "MCP is an open standard that allows AI models to connect seamlessly to any tool, API, or local database using standardized client-server protocol.",
    operations: [
      { name: "MCP Server", detail: "Exposes resources, prompts, and executable tool schemas over JSON-RPC." },
      { name: "MCP Client", detail: "Connects LLM app to multiple MCP servers (GitHub, Postgres, FileSystem)." }
    ],
    realWorldExample: "Building one GitHub MCP server lets Claude, Cursor, and custom AI tools interact with GitHub repositories standardly.",
    takeaway: "MCP eliminates N-by-M custom integrations between AI apps and external tools."
  },
  {
    day: 25,
    title: "Multi-Agent Systems & AI Safety",
    subtitle: "Specialized Agents Collaborating Together",
    category: "Agentic AI & Engineering",
    timeMinutes: 70,
    overview: "Multi-agent architectures break complex goals into specialized agent roles (Planner, Developer, Reviewer) passing structured handoffs back and forth.",
    operations: [
      { name: "Agent Hand-off", detail: "Planner agent generates task breakdown -> passes to Developer agent." },
      { name: "Safety Guardrails", detail: "Validate outputs with rule filters before taking destructive system actions." }
    ],
    realWorldExample: "Dev team simulation: Agent 1 writes code, Agent 2 runs unit test suite, Agent 3 reviews code safety before commit.",
    takeaway: "Specialized agents with strict scope perform better than a single overloaded prompt."
  },
  {
    day: 26,
    title: "AI APIs, Open-Source LLMs & Deployment",
    subtitle: "Shipping AI Features to Production",
    category: "Agentic AI & Engineering",
    timeMinutes: 65,
    overview: "Deploying AI features involves choosing between proprietary APIs (OpenAI, Gemini, Anthropic) or self-hosting open-source models (Llama 3, DeepSeek).",
    operations: [
      { name: "API Integration", detail: "Stream responses with Server-Sent Events (SSE) for low perceived latency." },
      { name: "Local Inference", detail: "Run Ollama / vLLM on GPU instances for data privacy and zero API costs." }
    ],
    realWorldExample: "Use API for quick prototype; switch to fine-tuned local Llama 3 on vLLM for high-volume internal microservices.",
    takeaway: "APIs offer zero ops setup; self-hosting offers complete data privacy and fixed costs."
  },
  {
    day: 27,
    title: "Modern Developer Tools & Infrastructure",
    subtitle: "What Top Engineering Teams Use Daily",
    category: "Agentic AI & Engineering",
    timeMinutes: 65,
    overview: "Modern tech stacks leverage Supabase/Firebase (instant auth + DB), Vercel (one-click deployments), and Postman/Bruno (API testing).",
    operations: [
      { name: "Zero Config Deploy", detail: "Git push to main automatically triggers preview builds and production deployments." },
      { name: "BaaS Integration", detail: "Supabase provides instant PostgreSQL + Row Level Security (RLS) + Auth." }
    ],
    realWorldExample: "Small engineering team ships full-stack SaaS in 1 week by combining Next.js + Vercel + Supabase.",
    takeaway: "Leverage modern platform-as-a-service tools to focus 100% on product business logic."
  },
  {
    day: 28,
    title: "Design Patterns & Clean Architecture",
    subtitle: "Writing Software That Scales Cleanly",
    category: "Agentic AI & Engineering",
    timeMinutes: 70,
    overview: "Clean Architecture separates code into independent layers: Presentation (UI), Use Cases (Business Logic), and Data (Database/APIs).",
    operations: [
      { name: "Singleton Pattern", detail: "Ensures only one instance of database client connection pool exists." },
      { name: "Factory Pattern", detail: "Centralizes object instantiation logic." },
      { name: "Dependency Inversion", detail: "High-level logic depends on interfaces, not specific DB driver implementations." }
    ],
    realWorldExample: "Swapping database from PostgreSQL to MongoDB requires editing only the Repository layer without touching UI components.",
    takeaway: "Separate business logic from framework and database details."
  },
  {
    day: 29,
    title: "The Software Engineering Mindset",
    subtitle: "How Senior Engineers Debug and Build",
    category: "Mindset & Capstone",
    timeMinutes: 60,
    overview: "Senior engineers don't guess randomly. They form hypotheses, isolate minimal reproducible cases, read docs over StackOverflow, and evaluate trade-offs.",
    operations: [
      { name: "Systematic Debugging", detail: "Reproduce bug -> Isolate variables -> Fix root cause -> Verify with automated test." },
      { name: "Trade-off Matrix", detail: "Evaluate solutions on latency, cost, team maintainability, and scalability." }
    ],
    realWorldExample: "Instead of trying random code edits, senior dev checks server logs -> identifies exact line crash -> writes failing test -> fixes bug cleanly.",
    takeaway: "Every engineering decision is a trade-off. Always state constraints explicitly."
  },
  {
    day: 30,
    title: "Final Capstone: System Design Mock",
    subtitle: "Designing Instagram End-to-End",
    category: "Mindset & Capstone",
    timeMinutes: 90,
    overview: "Bring together 30 days of learning to sketch and explain an end-to-end architecture: Client app -> Load Balancer -> API Servers -> Cache -> Primary/Replica DB -> S3 CDN -> Background Workers.",
    operations: [
      { name: "Requirements", detail: "50M daily active users, post photos, follow users, view home feed." },
      { name: "Data Schema", detail: "Users, Posts, Follows, Likes SQL tables + S3 image store." },
      { name: "Feed Generation", detail: "Push model (fan-out on write to Redis cache for active followers)." }
    ],
    realWorldExample: "Full system design walkthrough incorporating client-server, caching, queues, databases, and scaling principles.",
    takeaway: "You have completed the 30-Day Transformation! You are ready to build, solve, and engineer."
  }
];
