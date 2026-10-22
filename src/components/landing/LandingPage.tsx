import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Bot,
  FileText,
  FileSearch,
  ArrowRight,
  CheckCircle2,
  Trophy,
  Flame,
  Layers,
  Award,
  Zap,
  Code,
  Check,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  HelpCircle,
  FileCheck,
  Shuffle,
  TrendingUp,
  BrainCircuit,
  GraduationCap,
} from 'lucide-react';
import { Mascot3D } from '../3d/Mascot3D';
import { HeroScene3D } from '../3d/HeroScene3D';
import { BookScrollScene3D } from '../3d/BookScrollScene3D';
import { DemoBadge } from '../common/DemoBadge';
import { DEMO_QUIZ, DEMO_FLASHCARDS } from '../../constants/demoData';
import { AppView } from '../Navbar';

interface LandingPageProps {
  onNavigate: (view: AppView) => void;
  onExploreDemo: () => void;
  onOpenPrivacyModal: () => void;
  onOpenDeleteDataModal: () => void;
  authUser?: any;
  onOpenAuthModal?: (mode: 'signin' | 'signup') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onExploreDemo,
  onOpenPrivacyModal,
  onOpenDeleteDataModal,
  authUser,
  onOpenAuthModal,
}) => {
  // Showcase Tab in Section 3 & 5
  const [showcaseTab, setShowcaseTab] = useState<'explanation' | 'summary' | 'quiz' | 'flashcard'>('explanation');
  const [showcaseQuizOption, setShowcaseQuizOption] = useState<number | null>(null);
  const [showcaseQuizSubmitted, setShowcaseQuizSubmitted] = useState(false);
  const [showcaseCardFlipped, setShowcaseCardFlipped] = useState(false);

  // FAQ open item
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does StudySnap AI 2.0 differ from generic chatbots?',
      a: 'StudySnap AI is tailored strictly for technical and engineering subjects (B.Tech CSE, AIML, ECE, Mech, Math, Physics). It preserves mathematical formulas, validates calculations server-side (like F=ma), structures notes into high-yield exam sheets, and formats project bullets using the Google XYZ formula.',
    },
    {
      q: 'Do I need an API key to explore the platform?',
      a: 'No! StudySnap AI includes a zero-credential Demo Mode equipped with verified datasets across Physics (Classical Dynamics), Chemistry (Gibbs Free Energy & Equilibrium), Mathematics (Calculus & ODEs), Computer Science (Algorithms & Big-O), and Engineering (Circuit Analysis), plus sample resumes and ATS audits.',
    },
    {
      q: 'Can I upload lecture slides and PDF textbooks?',
      a: 'Yes. StudySnap supports text-based PDF, DOCX, and TXT documents. Documents are processed locally and securely in chunks without permanently archiving your personal files on server disks.',
    },
    {
      q: 'Does the Resume Builder fabricate achievements?',
      a: 'Never. StudySnap adheres to strict anti-hallucination rules: it will never invent grades, work history, or certifications. Instead, it strengthens your actual accomplishments using action-driven verbs and ATS-friendly phrasing.',
    },
    {
      q: 'Can I permanently wipe all my stored study logs and notes?',
      a: 'Absolutely. A single click on "Wipe My Data" purges your saved local notes, quiz attempts, tutor logs, and server session records instantly.',
    },
  ];

  return (
    <div className="relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* ============================================================== */}
      {/* 1. HERO SECTION WITH 3D CANVAS & ANIMATED MASCOT */}
      {/* ============================================================== */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-8 pb-20 px-4 sm:px-6 lg:px-8">
        <HeroScene3D />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Typography & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>Understand More. Memorize Less. Learn Smarter.</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Turn Your Notes Into Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-300">
                Next A+.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Understand difficult topics, revise faster, practise with AI, and build your career — all in one unified engineering learning environment.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => onNavigate('transformer')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start Studying Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {!authUser ? (
                <button
                  type="button"
                  onClick={() => onOpenAuthModal?.('signup')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>Create Free Account</span>
                </button>
              ) : (
                <button
                  onClick={onExploreDemo}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Explore STEM Demos</span>
                </button>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Broad STEM Coverage:</span>
              <span className="bg-white/80 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">⚡ Physics</span>
              <span className="bg-white/80 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">🧪 Chemistry</span>
              <span className="bg-white/80 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">📐 Mathematics</span>
              <span className="bg-white/80 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">💻 CS & Algorithms</span>
              <span className="bg-white/80 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">⚙️ Engineering</span>
            </div>
          </div>

          {/* Right Column: 3D Mascot & Live Dashboard Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center relative">
            <div className="relative z-20 -mb-8">
              <Mascot3D size="large" state="idle" />
            </div>

            <div className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative z-10 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">StudySnap Session</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 rounded-full">
                  F = m · a
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Engineering Physics: Classical Mechanics</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Concept Mastered</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full w-4/5" />
                </div>
              </div>

              {/* Sample Mini Quiz Item */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs space-y-2">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Q: A 2 kg object accelerates at 3 m/s². What is the net force?
                </p>
                <div className="grid grid-cols-2 gap-1.5 font-medium">
                  <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-center">
                    A. 2 N
                  </div>
                  <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-center">
                    B. 5 N
                  </div>
                  <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-center font-bold">
                    ✓ C. 6 N
                  </div>
                  <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-center">
                    D. 9 N
                  </div>
                </div>
              </div>

              {/* Mascot Bubble */}
              <div className="flex items-center gap-3 p-3 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 rounded-xl text-xs text-indigo-950 dark:text-indigo-200">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
                  ⚡
                </div>
                <p className="leading-tight">
                  <strong>Snap:</strong> "Notice how doubling mass doubles required force! Ready for the elevator problem?"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. AI TUTOR SHOWCASE (DUOLINGO 6-LEVEL PATH) */}
      {/* ============================================================== */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 text-center flex flex-col items-center">
            <Mascot3D size="large" state="happy" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">Duolingo-Inspired AI Tutor: Snap</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-sm">
              Socratic learning hints, speech recognition, voice answers, and genuine XP progression through 6 engineering mastery checkpoints.
            </p>
            <button
              onClick={() => onNavigate('tutor')}
              className="mt-6 px-6 py-3 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-bold shadow-md hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Meet Your AI Tutor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Gamified Learning Path
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Learn → Understand → Practise → Review → Master
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Structured progressive curriculum for engineering concepts with zero fake XP inflation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { lvl: 1, title: 'Level 1: Start Here', desc: 'Foundations of Force & Inertia', status: 'Completed' },
                { lvl: 2, title: 'Level 2: Understand the Concept', desc: "Newton's Second Law: F = ma", status: 'Active' },
                { lvl: 3, title: 'Level 3: Learn Through Examples', desc: 'Free Body Diagrams & Pulleys', status: 'Unlocked' },
                { lvl: 4, title: 'Level 4: Practise Questions', desc: 'Calculation & Dimension Sprint', status: 'Next' },
                { lvl: 5, title: 'Level 5: Complete a Challenge', desc: 'Rocket Exhaust & Third Law', status: 'Locked' },
                { lvl: 6, title: 'Level 6: Revise and Master', desc: 'Engineering Dynamics Synthesis', status: 'Locked' },
              ].map((step) => (
                <div
                  key={step.lvl}
                  className={`p-4 rounded-2xl border text-xs space-y-1 transition-all ${
                    step.status === 'Completed'
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-300'
                      : step.status === 'Active'
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 font-semibold ring-1 ring-indigo-400'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{step.title}</span>
                    <span className="text-[10px] uppercase font-mono font-bold">{step.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2.5 3D BOOK SCROLL-BASED ANIMATION SECTION */}
      {/* ============================================================== */}
      <section className="py-20 bg-white dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wide uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Spatial 3D Learning Experience</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Turn Your Raw Notes Into a Living 3D Textbook
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Scroll down to watch the leatherbound engineering manual open and flip through high-yield syllabus modules. Hover or drag with your mouse to inspect formulas from any 3D angle.
            </p>
          </div>

          {/* Interactive 3D Book Component */}
          <div className="max-w-5xl mx-auto">
            <BookScrollScene3D
              onOpenNotesWorkspace={() => onNavigate('transformer')}
            />
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. NOTES TRANSFORMER SHOWCASE */}
      {/* ============================================================== */}
      <section className="py-20 bg-[#F8FAFC] dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Interactive Workspace Showcase
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                AI Notes Transformer
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <DemoBadge />
              <button
                onClick={() => onNavigate('transformer')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Open Full Transformer</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Raw Input Material</span>
                <span className="text-[11px] text-slate-400 font-mono">Module 1: Dynamics</span>
              </div>
              <div className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed max-h-72 overflow-y-auto">
                <p>Newton's Laws of Motion:</p>
                <p>1. Law of Inertia: If ΣF = 0, dv/dt = 0.</p>
                <p>2. F_net = m * a (mass m constant).</p>
                <p>   - Unit: Newton (N) = kg·m/s².</p>
                <p>3. Action-Reaction: F_AB = -F_BA.</p>
                <p className="mt-2 text-indigo-700 dark:text-indigo-400 font-bold">
                  Problem: A 2 kg object accelerates at 3 m/s². What is net force?
                </p>
                <p>F = 2 kg * 3 m/s² = 6 N.</p>
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4 flex flex-col justify-between">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                <button
                  onClick={() => setShowcaseTab('explanation')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    showcaseTab === 'explanation'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Explanation
                </button>
                <button
                  onClick={() => setShowcaseTab('summary')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    showcaseTab === 'summary'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Summary
                </button>
                <button
                  onClick={() => setShowcaseTab('quiz')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    showcaseTab === 'quiz'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Quiz
                </button>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                {showcaseTab === 'explanation' && (
                  <div className="space-y-2 animate-in fade-in">
                    <p className="font-bold text-slate-900 dark:text-white">
                      Step 1: The Core Equation of Mechanics (Second Law)
                    </p>
                    <p>
                      When an unbalanced force acts on an object with mass $m$, it accelerates in that exact direction ($F = m \cdot a$).
                    </p>
                    <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 rounded-xl">
                      <strong>Remember This:</strong> Action-reaction force pairs act on <em>different bodies</em>, which is why they do not cancel out!
                    </div>
                  </div>
                )}

                {showcaseTab === 'summary' && (
                  <div className="space-y-2 animate-in fade-in">
                    <p className="font-bold text-slate-900 dark:text-white">High-Yield Exam Takeaways:</p>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                      <li>Force unit: 1 N = 1 kg·m/s²</li>
                      <li>Inertia: Inherent resistance to velocity modification</li>
                      <li>Frequent college exam trap: Forgetting gravity component on inclined planes (mg · sin θ)</li>
                    </ul>
                  </div>
                )}

                {showcaseTab === 'quiz' && (
                  <div className="space-y-3 animate-in fade-in">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Q: A 2 kg object accelerates at 3 m/s². What is the net force?
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {DEMO_QUIZ[0].options.map((opt, oIdx) => {
                        const isChosen = showcaseQuizOption === oIdx;
                        const isCorrect = oIdx === DEMO_QUIZ[0].correctIndex;
                        let cls = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-300';
                        if (showcaseQuizSubmitted) {
                          if (isCorrect) cls = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 font-bold';
                          else if (isChosen) cls = 'border-rose-400 bg-rose-50 dark:bg-rose-950 text-rose-800 line-through';
                        } else if (isChosen) {
                          cls = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 font-semibold';
                        }
                        return (
                          <button
                            key={oIdx}
                            onClick={() => !showcaseQuizSubmitted && setShowcaseQuizOption(oIdx)}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all ${cls}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {!showcaseQuizSubmitted ? (
                      <button
                        onClick={() => setShowcaseQuizSubmitted(true)}
                        disabled={showcaseQuizOption === null}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold disabled:opacity-40"
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <div className="text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        {DEMO_QUIZ[0].explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Sample verified content</span>
                <button
                  onClick={() => onNavigate('transformer')}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
                >
                  Transform My Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. SMART FLASHCARDS SHOWCASE */}
      {/* ============================================================== */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Active Recall Engine
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Smart Study Flashcards
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Synthesize 3D flip-cards from complex derivations, definitions, and equations. Track your mastery percentage, shuffle decks before exams, and review high-yield concepts on mobile or desktop.
            </p>
            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Auto-categorizes formulas, definitions, and exam traps</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>3D interactive flip with mastery retention bars</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Exportable as Markdown study sheets</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('flashcards')}
              className="mt-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-bold shadow-md hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Practice With Flashcards</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Flashcard Preview */}
          <div className="lg:col-span-6 flex justify-center">
            <div
              onClick={() => setShowcaseCardFlipped(!showcaseCardFlipped)}
              className="perspective-1000 w-full max-w-md min-h-[260px] cursor-pointer"
            >
              <div
                className={`w-full min-h-[260px] rounded-3xl p-6 border transition-transform duration-500 preserve-3d relative flex flex-col justify-between shadow-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 ${
                  showcaseCardFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {!showcaseCardFlipped ? (
                  <div className="space-y-4">
                    <span className="text-[11px] font-bold uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-full">
                      Fundamental Principle
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white pt-4 text-center">
                      {DEMO_FLASHCARDS[0].front}
                    </h3>
                    <p className="text-[11px] text-slate-400 text-center">Click to flip card</p>
                  </div>
                ) : (
                  <div className="space-y-4 rotate-y-180">
                    <span className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                      Answer & Takeaway
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 text-center pt-3">
                      {DEMO_FLASHCARDS[0].back}
                    </p>
                    <p className="text-[11px] text-slate-400 text-center">Click to flip back</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. INTERACTIVE QUIZ GENERATOR SHOWCASE */}
      {/* ============================================================== */}
      <section className="py-20 bg-[#F8FAFC] dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Validated Assessment
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white max-w-2xl mx-auto">
            Interactive Practice Quizzes With Strict Schema Validation
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Quizzes are verified server-side with exactly 4 distinct options, mathematical check routines, hidden answers, and step-by-step post-submission explanations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto pt-4 text-left">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold flex items-center justify-center text-xs">
                01
              </span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Server-Side Math Checks</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Calculations are checked server-side before serving questions to avoid incorrect formula evaluation.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold flex items-center justify-center text-xs">
                02
              </span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Hidden Answers</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Answers remain hidden until complete quiz submission to preserve genuine self-testing integrity.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <span className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 font-bold flex items-center justify-center text-xs">
                03
              </span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Retry & Answer Review</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Instant score calculation, percentage, question-by-question review, and one-click quiz retries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6 & 7. RESUME BUILDER & ANALYZER SHOWCASE */}
      {/* ============================================================== */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Career Workspace
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Resume Tools Crafted for Student Engineers
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Build your first professional resume with Google XYZ formulas, or audit your existing draft against top internship requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-7 border border-slate-200 dark:border-slate-700 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Resume Builder</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  5-step guided wizard for students with or without prior work experience. Formats projects, coursework, and technical skills with instant PDF download.
                </p>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    AI Bullet Rewriting Example (Google XYZ Formula)
                  </span>
                  <div className="text-slate-500 line-through text-[11px]">
                    "Made an algorithm visualizer website for college project."
                  </div>
                  <div className="text-indigo-700 dark:text-indigo-300 font-semibold text-[11px]">
                    "Architected high-throughput 3D algorithm visualizer using WebGL, sustaining 60 FPS across 1,000+ graph nodes."
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('resume-builder')}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2"
              >
                <span>Build My Resume</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-7 border border-slate-200 dark:border-slate-700 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <FileSearch className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Resume Analyzer</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Advisory 100-point rubric breakdown examining content quality, structure, job description relevance, and quantifiable impact.
                </p>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Advisory Assessment</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-black">84 / 100</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                    <div>✓ Contact & Links: Pass</div>
                    <div>✓ Education & CGPA: Pass</div>
                    <div>✓ Tech Stack Details: Pass</div>
                    <div>⚠️ Missing metrics in Project 2</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('resume-analyzer')}
                className="w-full py-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 border border-slate-700"
              >
                <span>Analyze My Resume</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. LEARNING PROGRESS DASHBOARD SHOWCASE */}
      {/* ============================================================== */}
      <section className="py-20 bg-[#F8FAFC] dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Student OS Analytics
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Learning Progress Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Track your weekly study sessions, quiz accuracy trends, flashcard reviews, and subject-wise retention. No invented milestones — every point reflects real activity.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Average Accuracy</span>
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">92%</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Study Sessions</span>
                <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">14 Active</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('dashboard')}
              className="mt-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-bold shadow-md hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>View Full Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Subject Mastery Breakdown
            </h4>
            <div className="space-y-3">
              {[
                { name: 'Classical Mechanics & Dynamics', pct: 92, status: 'Mastered' },
                { name: 'Data Structures & Algorithms', pct: 85, status: 'Strong' },
                { name: 'Calculus & Engineering Math', pct: 74, status: 'Good' },
              ].map((s, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-800 dark:text-slate-200">{s.name}</span>
                    <span className="text-slate-500">{s.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. THREE-STEP WORKFLOW */}
      {/* ============================================================== */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Three-Step Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Upload Notes → Learn With AI → Track Progress
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-7 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black text-base flex items-center justify-center">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Upload Notes</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Paste raw lecture bullet points or upload PDF, TXT, or DOCX slides. Review and edit extracted text before AI submission.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-7 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black text-base flex items-center justify-center">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Learn With AI</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Receive beginner-friendly step-by-step explanations, high-yield summary sheets, 3D smart flashcards, and verified multiple-choice quizzes.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-7 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black text-base flex items-center justify-center">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Track Progress</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Earn verified XP rewards across 6 Duolingo-inspired levels with Snap the AI mascot, and generate ATS-ready internship resumes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 10. FEATURE COMPARISON / BENEFITS SECTION */}
      {/* ============================================================== */}
      <section className="py-20 bg-[#F8FAFC] dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Why StudySnap AI 2.0?
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Built Specifically for STEM Students
            </h2>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="grid grid-cols-3 p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
              <div>Feature</div>
              <div className="text-center text-indigo-600 dark:text-indigo-400">StudySnap AI 2.0</div>
              <div className="text-center text-slate-400">Generic AI Chatbot</div>
            </div>

            {[
              { f: 'Math & Physics Equation Verification', snap: true, gen: false },
              { f: 'Persistent 3D Mascot with Socratic Hints', snap: true, gen: false },
              { f: 'Interactive 3D Flashcards Deck Generator', snap: true, gen: false },
              { f: 'Strict 4-Option Quizzes with Server Grading', snap: true, gen: false },
              { f: 'ATS Resume Builder with Real Vector PDF', snap: true, gen: false },
              { f: 'One-Click GDPR Data Wipe', snap: true, gen: false },
            ].map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-3 p-4 border-b border-slate-100 dark:border-slate-800/80 text-xs items-center"
              >
                <div className="font-medium text-slate-800 dark:text-slate-200">{row.f}</div>
                <div className="text-center font-bold text-emerald-600 dark:text-emerald-400">✓ Included</div>
                <div className="text-center text-slate-400">✗ Text Prompt Only</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 11. FAQ & GETTING STARTED SECTION */}
      {/* ============================================================== */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-700/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 12. PROFESSIONAL FOOTER */}
      {/* ============================================================== */}
      <footer className="bg-slate-950 text-slate-400 py-14 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-black shadow-md ring-1 ring-white/20">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">StudySnap AI 2.0</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
              <button
                onClick={() => onNavigate('transformer')}
                className="hover:text-white transition-colors"
              >
                Notes Transformer
              </button>
              <button
                onClick={() => onNavigate('flashcards')}
                className="hover:text-white transition-colors"
              >
                Smart Flashcards
              </button>
              <button
                onClick={() => onNavigate('tutor')}
                className="hover:text-white transition-colors"
              >
                AI Tutor
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="hover:text-white transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => onNavigate('resume-builder')}
                className="hover:text-white transition-colors"
              >
                Resume Builder
              </button>
              <button
                onClick={() => onNavigate('resume-analyzer')}
                className="hover:text-white transition-colors"
              >
                Resume Analyzer
              </button>
              <button
                onClick={onOpenPrivacyModal}
                className="hover:text-white transition-colors underline"
              >
                Privacy & Disclosures
              </button>
              <button
                onClick={onOpenDeleteDataModal}
                className="hover:text-rose-400 text-rose-500 transition-colors font-medium"
              >
                Wipe My Data
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} StudySnap AI 2.0. Academic engineering learning platform.</p>
            <p>Always verify critical formulations with standard course textbooks and faculty instructors.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
