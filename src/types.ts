export type LearningSubject =
  | 'Engineering Physics'
  | 'Mathematics'
  | 'Computer Science'
  | 'Chemistry'
  | 'Electronics & Communication'
  | 'Mechanical Engineering'
  | 'Other';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type ResponseLanguage = 'English' | 'Hindi' | 'Hinglish';

export type TransformerOutputMode =
  | 'Explanation'
  | 'Summary'
  | 'Practice Quiz'
  | 'Flashcards'
  | 'All-in-One';

export type SummaryLength = 'Quick' | 'Standard' | 'Detailed';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic?: string;
  difficulty?: string;
  calculation?: string | null;
  numericAnswer?: number | null;
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  userAnswers: Record<number, number>;
  completedAt: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category?: string;
  mastered?: boolean;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  subject: string;
  cards: Flashcard[];
  createdAt: string;
}

export interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
  mascotState?: 'idle' | 'thinking' | 'happy' | 'celebrating' | 'confused';
  contextSnippet?: string;
}

export interface TutorLessonLevel {
  level: number;
  title: string;
  subtitle: string;
  unlocked: boolean;
  completed: boolean;
  challengeQuestion?: string;
  xpReward: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  streak: number;
  dailyGoal: number;
  dailyProgress: number;
}

export interface DashboardStats {
  totalSessions: number;
  quizzesCompleted: number;
  quizAccuracy: number;
  flashcardsReviewed: number;
  notesCreated: number;
  recentActivities: Array<{
    id: string;
    type: 'note' | 'quiz' | 'tutor' | 'resume' | 'flashcard';
    title: string;
    time: string;
    score?: string;
  }>;
}

export interface TutorContextShare {
  source: 'notes' | 'document' | 'quiz' | 'resume' | 'analysis';
  title: string;
  text: string;
}

export interface DocumentUploadSession {
  sessionId: string;
  filename: string;
  size: number;
  totalChunks: number;
  chunksReceived: number;
  status: 'uploading' | 'processing' | 'ready' | 'failed';
  extractedText?: string;
  error?: string;
}

export interface ResumeData {
  personal: {
    fullName: string;
    email: string;
    phone?: string;
    city?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  education: {
    college: string;
    degree: string;
    branch: string;
    graduationYear: string;
    gpa?: string;
    coursework: string;
    achievements?: string;
  };
  skills: {
    languages: string;
    frameworks: string;
    tools: string;
    softSkills: string;
    spokenLanguages: string;
  };
  projects: Array<{
    id: string;
    name: string;
    problemSolved: string;
    technologies: string;
    features: string;
    userContribution: string;
    link?: string;
  }>;
  experience: Array<{
    id: string;
    role: string;
    organization: string;
    duration: string;
    type: 'Internship' | 'Hackathon' | 'Club' | 'Open Source' | 'Certification';
    contributions: string;
  }>;
}

export interface ResumeAnalysisResult {
  advisoryScore: {
    total: number;
    breakdown: {
      contentQuality: number;
      structure: number;
      relevance: number;
      impactMetrics: number;
    };
    disclaimer: string;
  };
  overview: {
    summary: string;
    strongestSections: string[];
  };
  structureReview: {
    contactInfo: { status: 'pass' | 'warning'; notes: string };
    education: { status: 'pass' | 'warning'; notes: string };
    skills: { status: 'pass' | 'warning'; notes: string };
    projects: { status: 'pass' | 'warning'; notes: string };
    formatting: { status: 'pass' | 'warning'; notes: string };
  };
  contentIssues: Array<{
    type: string;
    issue: string;
    suggestion: string;
  }>;
  roleMatch: {
    demonstratedSkills: string[];
    missingKeywords: string[];
    readinessLevel: string;
  };
  rewriteExamples: Array<{
    original: string;
    improved: string;
    whyBetter: string;
  }>;
  actionPlan: string[];
}

export interface StudyNote {
  id: string;
  user_id?: string | null;
  author_name?: string;
  subject: LearningSubject | string;
  topic: string;
  content: string;
  image_url?: string | null;
  image_name?: string | null;
  tags?: string[];
  is_admin_curated?: boolean;
  created_at: string;
  updated_at?: string;
}

