# StudySnap AI ⚡

> **"Turn Your Notes Into Your Next A+. Understand More. Memorize Less. Learn Smarter."**

StudySnap AI is an interactive, full-stack, AI-powered student learning platform designed specifically for first-year and undergraduate engineering students (B.Tech CSE, AIML, ECE, Mechanical, and core STEM disciplines).

---

## 🌟 Key Capabilities & Workspaces

### 1. 📝 AI Notes Transformer
- **Multimodal Inputs:** Paste notes directly or upload `.txt`, text-based `.pdf`, and `.docx` documents (up to 10 MB and 20,000 characters).
- **Extracted Text Editor:** Review and fine-tune extracted lecture slides and formula derivations before AI submission.
- **Configurable Synthesis:** Subject taxonomy, difficulty levels (Beginner, Intermediate, Advanced), response languages (English, Hindi, Hinglish), and depth settings (Quick, Standard, Detailed).
- **Parallel Outputs:**
  - **Simple Explanation:** Step-by-step breakdown, practical engineering examples, "Remember This" takeaway cards, and clear demarcation between student-supplied material and foundational context.
  - **Revision Summary:** Structured definitions, equations, SI units, and high-yield midterm/final exam checkpoints.
  - **Interactive Practice Quiz:** 4 distinct options per question, server-side numeric calculation verification, hidden answers until submission, instant score percentage, and detailed explanations.

### 2. 🤖 Duolingo-Inspired AI Tutor ("Snap")
- **Interactive 3D Mascot:** Procedural 8-part Three.js mascot with reactive visor, real-time cursor tracking, floating hover physics, and emotional states (*idle*, *thinking*, *happy*, *celebrating*, *confused*).
- **Socratic & Direct Teaching Modes:** Select between guiding conceptual hints or direct step-by-step solutions.
- **Voice Input & Output:** Integrated Web Speech recognition and speech synthesis.
- **6-Level Duolingo-Inspired Learning Path:**
  1. *Level 1: Start Here* (Foundational Principles)
  2. *Level 2: Understand the Concept* ($F = m \cdot a$ Dynamics)
  3. *Level 3: Learn Through Examples* (Free-Body Diagrams & Real-World Friction)
  4. *Level 4: Practise Questions* (Calculation Sprint)
  5. *Level 5: Complete a Challenge* (Engineering Scenarios & Third Law Pairs)
  6. *Level 6: Revise and Master* (Engineering Dynamics Synthesis)
- **Gamified Student Milestones:** Verified XP progression, daily learning goals, streaks, and confetti celebrations.

### 3. 📄 AI Resume Builder
- **5-Step Career Wizard:** Personal details, Education & coursework, Categorized technical skills, Technical projects, and Hackathons/Clubs/Experience.
- **Google XYZ Formula:** Rephrase student project bullets into high-impact accomplishments (*"Accomplished [X] as measured by [Y], by doing [Z]"*).
- **Single-Click AI Bullet Rewriting:** Interactive bullet optimizer.
- **Real Client-Side PDF Generation:** Instant vector PDF export powered by `jsPDF` without fake mock downloads.

### 4. 🔍 AI Resume Analyzer
- **Internship-Ready Audit:** Paste or upload existing resumes and optional job descriptions.
- **Advisory 100-Point Rubric:** Content Quality (30 pts), Structure & Formatting (25 pts), Role Relevance (25 pts), and Quantifiable Metrics (20 pts).
- **Skill Gap Detection:** Highlights demonstrated competencies vs. missing keywords.
- **Side-by-Side Optimizations:** Real before-and-after phrasing comparisons and actionable improvement checklists.

### 5. 🌐 3D Scrolling Landing Page
- **Three.js Parallax Canvas:** Floating mathematical octahedrons, algorithmic torus knots, and physics orbitals.
- **Accessible & Responsive:** Collapsible mobile navigation, high-contrast typography, and strict compliance with `prefers-reduced-motion`.

---

## 🏗️ Architecture & Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React icons, Three.js, jsPDF, canvas-confetti.
- **Full-Stack Runtime:** Express backend server running with Vite middleware in development (`server.ts`).
- **AI Engine:** Official `@google/genai` TypeScript SDK with model `gemini-3.8-flash` (or custom model specified via `AI_MODEL`).
- **Telemetry:** User-Agent header `'aistudio-build'` per AI Studio specification.
- **Security & Privacy:** Server-side rate limiting (20 req/min per IP), input character thresholds, and explicit **"Wipe My Data"** GDPR-style deletion.

---

## 🚀 Setup & Local Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file based on `.env.example`:
```env
# Gemini API Key (Injected automatically in AI Studio Secrets)
GEMINI_API_KEY="your-gemini-api-key"

# AI Model Identifier (Default: gemini-3.8-flash)
AI_MODEL="gemini-3.8-flash"

# Port (Default: 3000)
PORT=3000
```

### 3. Run Development Server
```bash
npm run dev
```
The application will be live at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🧪 Real Mode vs Demo Mode

- **Real AI Mode:** Communicates with backend endpoints (`/api/study/explain`, `/api/study/summarize`, `/api/study/quiz`, `/api/tutor/chat`, `/api/resume/generate`, etc.) using `@google/genai`. Displays clear error messages if the API key is not present or rate limits are reached.
- **Demo Mode:** Zero credentials needed. Pre-configured with verified Newton's Laws and Classical Mechanics datasets ($F = m \cdot a$, $2\,\text{kg} \times 3\,\text{m/s}^2 = 6\,\text{N}$), sample resume drafts, and sample ATS audits clearly marked with the **"Demo mode — sample content"** badge.

---

## 🔒 Security & Privacy

1. All API keys remain strictly server-side in `server.ts`; no credentials or secrets are bundled into client code.
2. Extracted text from uploaded documents is processed transiently and treated strictly as data, never as system instructions.
3. Users can purge all saved local storage and server records at any time via the **"Wipe My Data"** control.
