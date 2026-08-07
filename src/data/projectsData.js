export const projectsData = [
  {
    id: 1,
    title: "TaskFlow",
    subtitle: "Full-Stack Task Manager with AI Natural Language Dates",
    category: "Full-Stack CRUD + Auth + AI",
    techStack: ["React", "Node.js/Express", "PostgreSQL", "JWT", "LLM API"],
    description: "Build and deploy a complete production full-stack task manager. Features natural language smart due date parsing ('next Friday at 3pm') using LLM API call.",
    week: 1,
    days: [1, 2, 3, 4, 5, 6, 7],
    milestones: [
      { day: 1, title: "Project Setup & Backend Skeleton", deliverable: "Backend server running locally with Express & Postgres connection health-check." },
      { day: 2, title: "Database Schema Design", deliverable: "Created tasks table schema (id, title, status, due_date, user_id, timestamps) & migrations." },
      { day: 3, title: "Core CRUD API", deliverable: "All 4 CRUD endpoints (POST, GET, PUT, DELETE /tasks) working and verified in Postman." },
      { day: 4, title: "Authentication System", deliverable: "User signup/login routes with JWT tokens & auth middleware protection." },
      { day: 5, title: "Frontend React Scaffold", deliverable: "React UI layout, routing, login screen, and task list components rendering locally." },
      { day: 6, title: "Full Integration & AI Feature", deliverable: "Wired frontend to backend endpoints + integrated LLM natural language date parser." },
      { day: 7, title: "Deploy & Ship Sprint", deliverable: "Deployed frontend on Vercel & backend on Render/Railway. README with live link complete." }
    ],
    resumeBullets: [
      "Architected and shipped TaskFlow, a full-stack task management platform using React, Node.js/Express, PostgreSQL, and JWT authentication.",
      "Integrated OpenAI/Gemini LLM API to parse natural language due dates into structured ISO timestamps with 98% accuracy."
    ]
  },
  {
    id: 2,
    title: "DevConnect API",
    subtitle: "Scalable Developer Social Network REST Backend",
    category: "Backend & API Engineering",
    techStack: ["Node.js", "Express", "PostgreSQL", "OpenAPI/Swagger", "Jest", "Rate-Limiting"],
    description: "Pure backend engineering depth. Design, document, test, and secure a multi-user API with relational follow/unfollow graph, rate limiting, and OpenAPI docs.",
    week: 2,
    days: [8, 9, 10, 11, 12, 13, 14],
    milestones: [
      { day: 8, title: "API Contract First Design", deliverable: "Drafted full OpenAPI 3.0 specification for users, profiles, posts, and follows." },
      { day: 9, title: "User & Profile Endpoints", deliverable: "Registration, login, and profile update endpoints with input validation schema." },
      { day: 10, title: "Relationships (Follow/Unfollow)", deliverable: "Many-to-many follows table schema + follower/following graph endpoints." },
      { day: 11, title: "Automated Test Suite", deliverable: "Passing Jest test suite covering unit tests and end-to-end integration tests." },
      { day: 12, title: "Security & Rate Limiting", deliverable: "Added express-rate-limit middleware, bcrypt password hashing, and CORS headers." },
      { day: 13, title: "Live Swagger UI & Polish", deliverable: "Interactive Swagger UI documentation accessible directly via `/docs` browser endpoint." },
      { day: 14, title: "Deploy & Production Ship", deliverable: "Deployed API live on Railway/Render with production environment variables and public docs." }
    ],
    resumeBullets: [
      "Engineered DevConnect REST API using Node.js, Express, and PostgreSQL supporting relational user follow graphs and profile management.",
      "Achieved 90%+ test coverage with Jest and implemented automated rate-limiting middleware to protect against DDoS attacks."
    ]
  },
  {
    id: 3,
    title: "StudyMate AI",
    subtitle: "RAG Engine for Document Question-Answering",
    category: "AI / RAG Application",
    techStack: ["React", "FastAPI / Node", "ChromaDB / Pinecone", "Embeddings API", "LLM"],
    description: "Build a Retrieval-Augmented Generation (RAG) platform. Upload PDFs, extract text, split into vector chunks, and ask questions with exact page citations.",
    week: 3,
    days: [15, 16, 17, 18, 19, 20, 21],
    milestones: [
      { day: 15, title: "AI Foundations Refresh", deliverable: "Set up vector DB credentials & LLM API keys." },
      { day: 16, title: "PDF Parsing & Text Chunking", deliverable: "Upload endpoint that parses PDF files into overlapping ~500 token text chunks." },
      { day: 17, title: "Vector DB Embeddings Integration", deliverable: "Embedded text chunks using OpenAI/Gemini API and stored vectors in ChromaDB/Pinecone." },
      { day: 18, title: "LLM Grounded Answer Generation", deliverable: "`/ask` endpoint that retrieves Top-K chunks and prompts LLM for grounded response." },
      { day: 19, title: "Frontend Chat UI", deliverable: "React drag-and-drop file uploader & streaming chat interface." },
      { day: 20, title: "Citations & Testing Sprint", deliverable: "Added exact source chunk page citations to responses and tested with real technical PDFs." },
      { day: 21, title: "Deploy & Ship AI App", deliverable: "Deployed StudyMate AI live on Vercel with cloud vector DB storage and public URL." }
    ],
    resumeBullets: [
      "Built StudyMate AI, a Retrieval-Augmented Generation (RAG) application that processes user-uploaded PDFs into vector embeddings using ChromaDB and OpenAI.",
      "Implemented semantic search and prompt grounding to deliver hallucination-free document answers with precise source page citations."
    ]
  },
  {
    id: 4,
    title: "JobTrackr Capstone",
    subtitle: "End-to-End Application Tracker with AI Match Analysis",
    category: "Capstone: Full-Stack Product + AI",
    techStack: ["React", "Node.js/Express", "PostgreSQL", "JWT", "LLM Structured JSON"],
    description: "The ultimate portfolio capstone. Drag-and-drop Kanban job application board with automated AI resume-to-job description matching score and skill gap analysis.",
    week: 4,
    days: [22, 23, 24, 25, 26, 27, 28, 29, 30],
    milestones: [
      { day: 22, title: "Capstone Schema & Wireframe", deliverable: "Designed job applications database schema (company, role, status, JD text, match score)." },
      { day: 23, title: "Tracker Backend Endpoints", deliverable: "CRUD routes for managing applications and updating status columns." },
      { day: 24, title: "AI Resume-JD Matcher", deliverable: "AI endpoint prompting LLM for structured JSON match score, key match points, and missing skills." },
      { day: 25, title: "Kanban Drag & Drop UI", deliverable: "React Kanban board with status columns (Applied, Interviewing, Offer, Rejected)." },
      { day: 26, title: "Auth & Final Integration", deliverable: "Multi-tenant JWT user isolation ensuring private data per user account." },
      { day: 27, title: "Integration & Live Deployment", deliverable: "Deployed JobTrackr full-stack app live to production." },
      { day: 28, title: "Documentation & Demo Video", deliverable: "Recorded 60s video demo GIF and completed polished README." },
      { day: 29, title: "GitHub Profile & Portfolio Polish", deliverable: "Pinned all 4 project repos on GitHub profile with case-study writeups." },
      { day: 30, title: "Final Capstone Review", deliverable: "Completed mock architectural walkthrough defendable in engineering interviews!" }
    ],
    resumeBullets: [
      "Developed JobTrackr, an end-to-end Kanban job application platform featuring AI-powered resume-to-job description matching.",
      "Utilized LLM structured JSON output parsing to compute match scores and missing key skills for candidates in real time."
    ]
  }
];
