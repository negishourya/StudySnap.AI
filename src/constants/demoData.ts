import { QuizQuestion, ResumeData, ResumeAnalysisResult } from '../types';

export const DEMO_RAW_NOTES = `Engineering Physics - Module 1: Classical Mechanics & Dynamics

Newton's Laws of Motion:
1. First Law (Law of Inertia): An object remains at rest or in uniform motion in a straight line unless acted upon by a net external force. Formula: If ΣF = 0, then dv/dt = 0.
2. Second Law (Fundamental Law of Dynamics): The rate of change of linear momentum of a body is directly proportional to the applied net force and occurs in the direction of the force. For constant mass m, F = m * a.
   - Force unit: Newton (N) = kg·m/s²
   - Vector form: F_net = m * (d²r / dt²)
3. Third Law (Action-Reaction): Whenever body A exerts a force on body B, body B exerts an equal and opposite force on body A: F_AB = -F_BA.

Example Problem:
A 2 kg object accelerates at 3 m/s² on a frictionless surface.
Net force F = m * a = 2 kg * 3 m/s² = 6 N.`;

export const DEMO_EXPLANATION = `### 🌟 Simple Step-by-Step Explanation: Newton's Laws of Motion

**From Your Material:**
Newton's three laws form the foundation of classical mechanics, describing how objects move and interact in our everyday world.

#### Step 1: The Principle of Inertia (First Law)
Objects are naturally "lazy" — they will keep doing whatever they are already doing. If an engineering satellite is drifting through the vacuum of space, it will coast forever at constant velocity unless thruster rockets fire or gravitational pull intervenes.
- **Mathematical Form:** If $\\Sigma \\vec{F} = 0$, then $\\frac{d\\vec{v}}{dt} = 0$ (velocity is constant).

#### Step 2: The Core Equation of Mechanics (Second Law)
When an unbalanced force acts upon an object with mass $m$, it accelerates in that exact direction.
$$\\vec{F} = m \\cdot \\vec{a}$$
- **Key Units:** Force in Newtons ($\\text{N}$), Mass in kilograms ($\\text{kg}$), Acceleration in meters per second squared ($\\text{m/s}^2$).
- **Practical Engineering Example:** A car's electric motor pushing a 2 kg drone component at an acceleration of $3\\,\\text{m/s}^2$ must exert exactly:
  $$F = 2\\,\\text{kg} \\times 3\\,\\text{m/s}^2 = 6\\,\\text{N}$$

#### Step 3: Interactive Mutual Action (Third Law)
Forces always occur in matched pairs. You cannot touch something without it touching you back with equal magnitude and opposite direction:
$$\\vec{F}_{AB} = -\\vec{F}_{BA}$$
- **Real-World Case:** Rocket propulsion works because the rocket nozzle expels hot exhaust gas backward, and the gas exerts an equal forward thrust on the vehicle.

---

### 💡 Remember This
1. $\\vec{F} = m\\vec{a}$ only holds strictly when mass is constant; for varying mass (like a burning rocket stage), use $F = \\frac{dp}{dt}$.
2. Action-reaction pairs act on **different bodies**, which is why they do not cancel each other out!

*Note: Always verify critical exam formulations with your course syllabus or standard textbook.*`;

export const DEMO_SUMMARY = `## 📋 Revision Sheet: Classical Mechanics & Dynamics (High-Yield)

### 1. Executive Summary
Sir Isaac Newton's three laws govern mechanical equilibrium and dynamics for macroscopic objects at non-relativistic speeds.

### 2. Core Definitions & Principles
- **Inertia:** The inherent resistance of any physical object to any change in its velocity.
- **Linear Momentum ($\\vec{p}$):** $\\vec{p} = m\\vec{v}$ (measured in $\\text{kg}\\cdot\\text{m/s}$).
- **Net Force ($\\Sigma \\vec{F}$):** The vector sum of all individual external forces acting on a free body.

### 3. Essential Formulas & SI Units
| Law | Equation | SI Units | Exam Frequency |
| :--- | :--- | :--- | :--- |
| First Law | $\\Sigma \\vec{F} = 0 \\implies \\vec{a} = 0$ | $\\text{m/s}^2$ | Moderate |
| Second Law | $\\vec{F} = m \\cdot \\vec{a} = \\frac{d\\vec{p}}{dt}$ | $\\text{N} = \\text{kg}\\cdot\\text{m/s}^2$ | Very High |
| Third Law | $\\vec{F}_{12} = -\\vec{F}_{21}$ | $\\text{N}$ | High |

### 4. High-Yield Midterm / Final Exam Concepts
- Free-body diagrams with inclined planes and friction ($f_k = \\mu_k N$).
- Tension problems in pulleys and Atwood machines.
- Verification of vector components: separate into $\\Sigma F_x = m a_x$ and $\\Sigma F_y = m a_y$.

### 5. Quick Self-Test Checklist
- [ ] Can you define the Newton unit in fundamental base SI units?
- [ ] Can you explain why internal molecular forces do not accelerate a moving vehicle?`;

export const DEMO_QUIZ: QuizQuestion[] = [
  {
    question: 'A 2 kg object accelerates at 3 m/s². What is the net force?',
    options: ['2 N', '5 N', '6 N', '9 N'],
    correctIndex: 2,
    explanation: 'According to Newton\'s Second Law, F = m * a. Here, m = 2 kg and a = 3 m/s², so F = 2 kg * 3 m/s² = 6 N.',
    topic: 'Engineering Physics',
    difficulty: 'Beginner',
    calculation: 'F = 2 * 3 = 6 N',
    numericAnswer: 6,
  },
  {
    question: 'Which law of motion is directly known as the Law of Inertia?',
    options: [
      'Newton\'s First Law',
      'Newton\'s Second Law',
      'Newton\'s Third Law',
      'Universal Law of Gravitation',
    ],
    correctIndex: 0,
    explanation: 'Newton\'s First Law states that an object remains at rest or in uniform straight-line motion unless acted upon by a net external force, describing inertia.',
    topic: 'Engineering Physics',
    difficulty: 'Beginner',
  },
  {
    question: 'Why do action and reaction force pairs NOT cancel each other out?',
    options: [
      'They act at different speeds',
      'They act on two different bodies',
      'They have unequal magnitudes in non-inertial frames',
      'Friction always absorbs the reaction force',
    ],
    correctIndex: 1,
    explanation: 'Action and reaction forces act on separate bodies (Body A on Body B, and Body B on Body A), so they never cancel out in a single body\'s free-body diagram.',
    topic: 'Engineering Physics',
    difficulty: 'Intermediate',
  },
  {
    question: 'What are the base SI units of 1 Newton (N)?',
    options: [
      'kg · m / s',
      'kg · m / s²',
      'kg · m² / s²',
      'g · cm / s²',
    ],
    correctIndex: 1,
    explanation: 'Since F = m * a, the unit is mass (kg) multiplied by acceleration (m/s²), which gives kg·m/s².',
    topic: 'Engineering Physics',
    difficulty: 'Beginner',
  },
  {
    question: 'If the net external force on a moving spacecraft in deep space is zero, what happens to its speed?',
    options: [
      'It gradually decelerates to a complete stop',
      'It instantly reverses direction',
      'It continues moving with constant velocity',
      'It begins an orbital spiral',
    ],
    correctIndex: 2,
    explanation: 'Under Newton\'s First Law, when net external force is zero, acceleration is zero, maintaining uniform velocity indefinitely.',
    topic: 'Engineering Physics',
    difficulty: 'Beginner',
  },
];

export const DEMO_RESUME: ResumeData = {
  personal: {
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma.tech@gmail.com',
    phone: '+91 98765 43210',
    city: 'Bengaluru, India',
    linkedin: 'linkedin.com/in/aarav-sharma-cs',
    github: 'github.com/aarav-dev',
    portfolio: 'aaravsharma.dev',
  },
  education: {
    college: 'National Institute of Technology, Karnataka',
    degree: 'Bachelor of Technology (B.Tech)',
    branch: 'Computer Science and Engineering',
    graduationYear: '2026',
    gpa: '8.8 / 10.0',
    coursework: 'Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Operating Systems, Computer Networks',
    achievements: 'Dean\'s List for 2 consecutive semesters, Rank 14 in College Coding Olympiad',
  },
  skills: {
    languages: 'TypeScript, Python, C++, Java, SQL',
    frameworks: 'React, Node.js, Express, Tailwind CSS, Next.js',
    tools: 'Git, Docker, Linux, Postman, VS Code, Figma',
    softSkills: 'Technical Writing, Agile Collaboration, Problem Solving, Quick Learning',
    spokenLanguages: 'English (Fluent), Hindi (Native)',
  },
  projects: [
    {
      id: 'proj-1',
      name: 'AlgorithmVisualizer 3D',
      problemSolved: 'Students struggle to understand recursive graph algorithms and pathfinding intuitively.',
      technologies: 'React, Three.js, TypeScript, Tailwind CSS',
      features: 'Interactive 3D graph renderer, step-by-step Dijkstra & A* traversal, customizable node weights and speed controls.',
      userContribution: 'Engineered custom WebGL node rendering pipeline with 60 FPS performance across 1,000+ graph nodes.',
      link: 'github.com/aarav-dev/algo-viz-3d',
    },
    {
      id: 'proj-2',
      name: 'CampusMart - Peer Exchange Platform',
      problemSolved: 'College hostel students lacked a safe, verified marketplace to buy and sell textbooks and lab components.',
      technologies: 'Node.js, Express, PostgreSQL, JWT, React',
      features: 'University email OTP verification, real-time chat with Socket.io, listing categorization, and search index.',
      userContribution: 'Implemented RESTful APIs and PostgreSQL schema with Row Level Security, supporting 450+ campus test users.',
      link: 'github.com/aarav-dev/campus-mart',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Technical Club Lead (Web & Systems)',
      organization: 'Google Developer Student Club (GDSC NITK)',
      duration: 'Aug 2024 - Present',
      type: 'Club',
      contributions: 'Organized 4 campus hands-on workshops on Full-Stack Development and Open Source, mentoring 120+ first-year students.',
    },
    {
      id: 'exp-2',
      role: 'Hackathon Finalist - Smart India Hackathon',
      organization: 'Ministry of Education Innovation Cell',
      duration: 'Dec 2024',
      type: 'Hackathon',
      contributions: 'Built an offline-first emergency resource dispatch prototype in a 36-hour sprint with a team of 6 engineers.',
    },
  ],
};

export const DEMO_ANALYSIS: ResumeAnalysisResult = {
  advisoryScore: {
    total: 84,
    breakdown: {
      contentQuality: 26,
      structure: 23,
      relevance: 20,
      impactMetrics: 15,
    },
    disclaimer: 'This score is an advisory assessment based on standard engineering hiring rubrics and does not guarantee interviews or job offers.',
  },
  overview: {
    summary: 'Strong foundational profile for an undergraduate CS/IT student with solid technical projects and campus leadership.',
    strongestSections: [
      'Technical Projects (Clear technology stack and practical problem definitions)',
      'Education (Strong university standing and relevant coursework)',
      'Clean Section Hierarchy (ATS-friendly ordering and clear contact information)',
    ],
  },
  structureReview: {
    contactInfo: { status: 'pass', notes: 'Professional email, GitHub, LinkedIn, and portfolio link clearly present.' },
    education: { status: 'pass', notes: 'Degree, branch, expected graduation year, and GPA correctly formatted.' },
    skills: { status: 'pass', notes: 'Clean categorization by languages, frameworks, and developer tools.' },
    projects: { status: 'pass', notes: 'Each project has problem scope, tech stack, and verifiable links.' },
    formatting: { status: 'pass', notes: 'Standard one-page layout with clean typography.' },
  },
  contentIssues: [
    {
      type: 'missing_metrics',
      issue: 'Project 1 could include quantifiable speedup or memory efficiency numbers.',
      suggestion: 'Specify rendering efficiency (e.g., "Achieved sustained 60 FPS rendering on low-end hardware").',
    },
    {
      type: 'vague_bullet',
      issue: 'CampusMart features listing could explicitly highlight database query optimization.',
      suggestion: 'State indexing strategy or load handling (e.g., "Indexed search queries resulting in sub-50ms lookup times").',
    },
  ],
  roleMatch: {
    demonstratedSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Three.js / WebGL', 'Git'],
    missingKeywords: ['CI/CD Pipeline', 'Unit Testing (Jest / Vitest)', 'Cloud Deployment (AWS/GCP/Vercel)'],
    readinessLevel: 'High',
  },
  rewriteExamples: [
    {
      original: 'Organized 4 campus hands-on workshops on Full-Stack Development and Open Source for students.',
      improved: 'Curated and led 4 full-stack technical workshops; trained 120+ freshmen in Git version control and modern React architecture.',
      whyBetter: 'Replaces passive verb "Organized" with action-oriented "Curated and led" and highlights the specific technical curriculum.',
    },
    {
      original: 'Made an offline-first emergency resource dispatch app in a 36-hour sprint.',
      improved: 'Architected offline-first PWA for disaster dispatch under 36-hour constraints, finishing in Top 5 out of 140 regional teams.',
      whyBetter: 'Applies XYZ framework and proves competitive standing without exaggeration.',
    },
  ],
  actionPlan: [
    'Add unit testing (e.g., Jest / Vitest / Playwright) to your AlgorithmVisualizer repository.',
    'Mention containerization details (Docker Compose) in the CampusMart project.',
    'Include a 2-line targeted summary aligned with the software engineering internship spec.',
  ],
};

export const DEMO_FLASHCARDS = [
  {
    id: 'fc-1',
    front: "What is Newton's First Law of Motion?",
    back: 'An object remains at rest or continues to move with constant velocity in a straight line unless acted upon by a net external force (Principle of Inertia).',
    category: 'Fundamental Principle',
    mastered: true,
  },
  {
    id: 'fc-2',
    front: 'State the formula and units for Newton\'s Second Law.',
    back: 'F_net = m · a (Force = Mass × Acceleration). SI Unit: Newton (N) = kg·m/s².',
    category: 'Formula',
    mastered: false,
  },
  {
    id: 'fc-3',
    front: 'Why do action-reaction force pairs never cancel each other out?',
    back: 'Because action and reaction forces always act on two different, distinct bodies (Body A on Body B, and Body B on Body A).',
    category: 'Exam Trap',
    mastered: false,
  },
  {
    id: 'fc-4',
    front: 'Calculate net force: 2 kg mass accelerating at 3 m/s².',
    back: 'F = m · a = 2 kg × 3 m/s² = 6 Newtons.',
    category: 'Numerical Problem',
    mastered: true,
  },
  {
    id: 'fc-5',
    front: 'When does F = m · a fail and require F = dp/dt?',
    back: 'When mass is variable with time (such as rocket fuel burn or relativistic velocities where mass changes).',
    category: 'Advanced Theory',
    mastered: false,
  },
  {
    id: 'fc-6',
    front: 'What is Linear Momentum (p) and its SI unit?',
    back: 'p = m · v (Mass × Velocity). SI Unit: kg·m/s (or N·s).',
    category: 'Definition',
    mastered: true,
  },
];

export const DEMO_DASHBOARD_STATS = {
  totalSessions: 14,
  quizzesCompleted: 6,
  quizAccuracy: 92,
  flashcardsReviewed: 48,
  notesCreated: 5,
  recentActivities: [
    { id: 'act-1', type: 'quiz' as const, title: "Completed Newton's Laws Quiz", time: '1 hour ago', score: '100% (5/5)' },
    { id: 'act-2', type: 'note' as const, title: 'Transformed Classical Dynamics Notes', time: '3 hours ago' },
    { id: 'act-3', type: 'flashcard' as const, title: 'Reviewed 6 Physics Flashcards', time: 'Yesterday' },
    { id: 'act-4', type: 'tutor' as const, title: 'Socratic Session on Third Law Pairs', time: 'Yesterday' },
    { id: 'act-5', type: 'resume' as const, title: 'Drafted Technical Resume (B.Tech CSE)', time: '2 days ago' },
  ],
};

