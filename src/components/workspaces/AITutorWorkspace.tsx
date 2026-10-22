import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Trophy,
  Flame,
  Target,
  CheckCircle,
  Compass,
  RotateCcw,
  BookOpen,
  Award,
  Layers,
  Check,
  Atom,
  Binary,
  Cpu,
  Sigma,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Mascot3D } from '../3d/Mascot3D';
import { DemoBadge } from '../common/DemoBadge';
import { TutorMessage, TutorLessonLevel, DifficultyLevel, ResponseLanguage } from '../../types';
import { chatWithTutor, evaluateTutorAnswer, updateUserProgress } from '../../services/api';
import { STEM_PRESETS, StemTopicPreset } from '../../constants/demoData';

interface AITutorWorkspaceProps {
  isDemoMode: boolean;
  initialTopic?: string;
}

export const AITutorWorkspace: React.FC<AITutorWorkspaceProps> = ({
  isDemoMode,
  initialTopic = "Newton's Laws of Motion & Classical Dynamics",
}) => {
  // Find matching initial preset
  const initialPreset =
    STEM_PRESETS.find((p) => p.title.toLowerCase().includes(initialTopic.toLowerCase())) ||
    STEM_PRESETS[0];

  const [activePreset, setActivePreset] = useState<StemTopicPreset>(initialPreset);

  // Chat State
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'msg-0',
      role: 'assistant',
      content: `Hey there! I'm Snap, your personal AI study companion. We're exploring **${initialPreset.title}** today.
      
Are you ready to test your intuition, or would you like to start with an intuitive real-world analogy?`,
      timestamp: 'Just now',
      suggestions: [
        'Give me an intuitive analogy first!',
        'Ask me a quick practice question',
        'Break this down step-by-step',
      ],
      mascotState: 'idle',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [mascotState, setMascotState] = useState<'idle' | 'thinking' | 'happy' | 'celebrating' | 'confused'>('idle');
  const [isSending, setIsSending] = useState(false);

  // Settings
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Beginner');
  const [language, setLanguage] = useState<ResponseLanguage>('English');
  const [teachingMode, setTeachingMode] = useState<'socratic' | 'direct'>('socratic');

  // Gamified Learning Journey State
  const [levels, setLevels] = useState<TutorLessonLevel[]>(() => {
    return activePreset.tutorLevels.map((lvl) => ({
      level: lvl.level,
      title: lvl.title,
      subtitle: lvl.subtitle,
      unlocked: lvl.level <= 2,
      completed: lvl.level === 1,
      challengeQuestion: lvl.challengeQuestion,
      xpReward: lvl.xpReward,
    }));
  });

  const [activeLevelNumber, setActiveLevelNumber] = useState<number>(2);
  const [totalXp, setTotalXp] = useState<number>(() => {
    return parseInt(localStorage.getItem('studysnap_user_xp') || '450', 10);
  });
  const [streakDays] = useState<number>(4);
  const [dailyGoal] = useState<number>(3);
  const [dailyProgress, setDailyProgress] = useState<number>(2);

  // Interactive challenge mode for current level
  const [isPracticingChallenge, setIsPracticingChallenge] = useState(false);
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [challengeFeedback, setChallengeFeedback] = useState<any>(null);

  // Speech Recognition & TTS
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  // When active preset changes, update levels & conversation
  const handleSwitchTopic = (preset: StemTopicPreset) => {
    setActivePreset(preset);
    const newLevels: TutorLessonLevel[] = preset.tutorLevels.map((lvl) => ({
      level: lvl.level,
      title: lvl.title,
      subtitle: lvl.subtitle,
      unlocked: lvl.level <= 2,
      completed: lvl.level === 1,
      challengeQuestion: lvl.challengeQuestion,
      xpReward: lvl.xpReward,
    }));
    setLevels(newLevels);
    setActiveLevelNumber(2);
    setIsPracticingChallenge(false);
    setChallengeFeedback(null);
    setChallengeAnswer('');

    // Add greeting for the new topic
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-topic-${Date.now()}`,
        role: 'assistant',
        content: `Switched topic to **${preset.title}** (${preset.domain})! 🚀
        
What would you like to master first? We can walk through the governing formulas, analyze a practical engineering scenario, or solve a quick practice question.`,
        timestamp: 'Just now',
        suggestions: [
          `Explain ${preset.domain} fundamentals`,
          'Give me an everyday real-world example',
          'Ask me a level challenge question',
        ],
      },
    ]);
  };

  // Web Speech Recognition
  const toggleSpeechRecognition = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'Hindi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  // Text to Speech
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    // Clean markdown before speaking
    const cleanText = text.replace(/[*#`_$[\]]/g, '').slice(0, 350);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isSending) return;

    setInputMessage('');
    const userMsg: TutorMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);
    setMascotState('thinking');

    const historyForAi = messages.slice(-5).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await chatWithTutor(
        text,
        historyForAi,
        {
          difficulty,
          language,
          mode: teachingMode,
          currentTopic: activePreset.title,
        },
        isDemoMode
      );

      if (res.success && res.data) {
        const replyMsg: TutorMessage = {
          id: `msg-tutor-${Date.now()}`,
          role: 'assistant',
          content: res.data.reply,
          timestamp: 'Just now',
          suggestions: res.data.suggestions,
        };
        setMessages((prev) => [...prev, replyMsg]);
        setMascotState('happy');
        setTimeout(() => setMascotState('idle'), 3000);
      } else {
        const errorMsg: TutorMessage = {
          id: `msg-err-${Date.now()}`,
          role: 'assistant',
          content: res.message || 'Sorry, I had trouble formulating a response. Please try asking again!',
          timestamp: 'Just now',
        };
        setMessages((prev) => [...prev, errorMsg]);
        setMascotState('confused');
      }
    } catch {
      setMascotState('confused');
    } finally {
      setIsSending(false);
    }
  };

  // Level challenge submission
  const handleEvaluateChallenge = async () => {
    if (!challengeAnswer.trim() || isSending) return;
    setIsSending(true);
    setMascotState('thinking');

    const activeLevel = levels.find((l) => l.level === activeLevelNumber);
    const q = activeLevel?.challengeQuestion || activePreset.tutorLevels[1]?.challengeQuestion || 'Explain core concept';

    try {
      const res = await evaluateTutorAnswer(q, challengeAnswer, activePreset.title, difficulty, isDemoMode);
      if (res.success && res.data) {
        const ev = res.data.evaluation;
        setChallengeFeedback(ev);

        if (ev.isCorrect || ev.verdict === 'correct') {
          setMascotState('celebrating');
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
          const xp = ev.xpEarned || activeLevel?.xpReward || 50;
          setTotalXp((prev) => prev + xp);
          setDailyProgress((prev) => Math.min(dailyGoal, prev + 1));

          // Unlock next level
          setLevels((prev) =>
            prev.map((l) => {
              if (l.level === activeLevelNumber) return { ...l, completed: true };
              if (l.level === activeLevelNumber + 1) return { ...l, unlocked: true };
              return l;
            })
          );

          updateUserProgress({ xpEarned: xp, lessonCompleted: activeLevelNumber });
        } else {
          setMascotState('confused');
        }
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tutor Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                StudySnap AI Tutor
              </h2>
              <span className="text-[11px] font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                All-Domain STEM Mentor
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Comprehensive guidance across Physics, Chemistry, Maths, and Engineering disciplines.
            </p>
          </div>
        </div>

        {/* Gamified HUD: XP, Streak, Goal */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 rounded-xl text-xs font-bold shadow-xs">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>{totalXp} XP</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-950/60 text-orange-900 dark:text-orange-200 border border-orange-200 dark:border-orange-800 rounded-xl text-xs font-bold shadow-xs">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>{streakDays} Day Streak</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold shadow-xs">
            <Target className="w-4 h-4 text-indigo-500" />
            <span>{dailyProgress}/{dailyGoal} Daily Goal</span>
          </div>

          {isDemoMode && <DemoBadge />}
        </div>
      </div>

      {/* Multi-Subject STEM Track Switcher */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
          <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Select Study Track:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {STEM_PRESETS.map((preset) => {
            const isSelected = activePreset.id === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSwitchTopic(preset)}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all border flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span>
                  {preset.domain === 'Physics' ? '⚡' : preset.domain === 'Chemistry' ? '🧪' : preset.domain === 'Mathematics' ? '📐' : preset.domain === 'Computer Science' ? '💻' : '⚙️'}
                </span>
                <span>{preset.domain}: {preset.summaryBadge}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Mascot & Learning Path / Right Chat Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 3D Mascot & Duolingo Learning Journey (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Animated 3D Mascot Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs text-center flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Snap (Online)</span>
            </div>

            <div className="mt-2">
              <Mascot3D state={mascotState} size="medium" />
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">Meet Snap</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-0.5">
              {mascotState === 'thinking'
                ? 'Synthesizing scientific principles...'
                : mascotState === 'celebrating'
                ? 'Brilliant work! Lesson completed!'
                : mascotState === 'confused'
                ? 'Let’s re-examine that from a different angle!'
                : `Your interactive ${activePreset.domain} mentor. Ask any question!`}
            </p>

            {/* Quick Domain Prompt Starters */}
            <div className="grid grid-cols-2 gap-2 w-full mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleSendMessage(`Can you give an everyday practical engineering example of ${activePreset.summaryBadge}?`)}
                className="p-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors text-left"
              >
                💡 Practical Example
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(`Derive the core mathematical formula for ${activePreset.summaryBadge} step-by-step.`)}
                className="p-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors text-left"
              >
                📐 Step Derivation
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(`What are the common exam traps and pitfalls students make in ${activePreset.summaryBadge}?`)}
                className="p-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors text-left"
              >
                ⚠️ Common Pitfalls
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(`Explain ${activePreset.summaryBadge} in simple terms like I'm a beginner.`)}
                className="p-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors text-left"
              >
                👶 Explain Simply
              </button>
            </div>
          </div>

          {/* Duolingo-style Learning Path */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {activePreset.domain} Path
                </h4>
              </div>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                Level {activeLevelNumber} / 6
              </span>
            </div>

            <div className="space-y-2.5">
              {levels.map((lvl) => {
                const isActive = lvl.level === activeLevelNumber;
                return (
                  <div
                    key={lvl.level}
                    onClick={() => {
                      if (lvl.unlocked) {
                        setActiveLevelNumber(lvl.level);
                        setIsPracticingChallenge(true);
                      }
                    }}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                      isActive
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 shadow-xs ring-1 ring-indigo-500'
                        : lvl.completed
                        ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200'
                        : lvl.unlocked
                        ? 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800'
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center text-xs shrink-0 ${
                          lvl.completed
                            ? 'bg-emerald-500 text-white'
                            : isActive
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {lvl.completed ? <Check className="w-4 h-4" /> : lvl.level}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white leading-tight">{lvl.title}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{lvl.subtitle}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">
                      +{lvl.xpReward} XP
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Tutor Conversation & Challenge (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-[670px] overflow-hidden">
          {/* Tutor Controls Header */}
          <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Tutor Mode:</span>
              <div className="flex bg-slate-200/80 dark:bg-slate-700 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setTeachingMode('socratic')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    teachingMode === 'socratic'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  Socratic (Hints First)
                </button>
                <button
                  type="button"
                  onClick={() => setTeachingMode('direct')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    teachingMode === 'direct'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  Direct (Explanations)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="text-xs py-1 px-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as ResponseLanguage)}
                className="text-xs py-1 px-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Hinglish</option>
              </select>
            </div>
          </div>

          {/* Level Challenge Modal or Banner if active */}
          {isPracticingChallenge && (
            <div className="p-4 bg-indigo-50/90 dark:bg-indigo-950/60 border-b border-indigo-100 dark:border-indigo-900 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                    Level {activeLevelNumber} Challenge ({activePreset.domain})
                  </span>
                </div>
                <button
                  onClick={() => setIsPracticingChallenge(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                {levels.find((l) => l.level === activeLevelNumber)?.challengeQuestion ||
                  activePreset.tutorLevels[1]?.challengeQuestion}
              </p>

              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={challengeAnswer}
                  onChange={(e) => setChallengeAnswer(e.target.value)}
                  placeholder="Type your scientific calculation or reasoning here..."
                  className="flex-1 text-xs sm:text-sm px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden dark:text-white"
                  onKeyDown={(e) => e.key === 'Enter' && handleEvaluateChallenge()}
                />
                <button
                  type="button"
                  onClick={handleEvaluateChallenge}
                  disabled={isSending || !challengeAnswer.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-40 cursor-pointer"
                >
                  Submit Challenge
                </button>
              </div>

              {challengeFeedback && (
                <div
                  className={`mt-2 p-2.5 rounded-xl text-xs flex items-start gap-2 ${
                    challengeFeedback.isCorrect
                      ? 'bg-emerald-100/70 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-100/70 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">
                      {challengeFeedback.isCorrect ? 'Correct! ' : 'Keep Going! '}
                    </span>
                    <span>{challengeFeedback.feedback}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chat Messages Log */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs text-xs font-bold">
                      ⚡
                    </div>
                  )}

                  <div className={`max-w-[82%] space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs border border-slate-200/60 dark:border-slate-700/60'
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                      {!isUser && (
                        <div className="flex items-center justify-end gap-1.5 pt-1 mt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                          <button
                            type="button"
                            onClick={() => speakText(msg.content)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                            title="Read aloud"
                          >
                            {isSpeaking ? (
                              <VolumeX className="w-3.5 h-3.5 text-indigo-600" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Follow-up suggestions */}
                    {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestions.map((suggestion, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => handleSendMessage(suggestion)}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800 font-medium transition-colors text-left cursor-pointer"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex items-center gap-2 text-xs text-slate-400 pl-11">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                <span>Snap is calculating and structuring the response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isListening
                    ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
                title="Voice input"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Ask Snap about ${activePreset.domain}, formulas, calculations, or mechanisms...`}
                className="flex-1 text-xs sm:text-sm px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-hidden font-sans dark:text-white"
              />

              <button
                type="submit"
                disabled={isSending || !inputMessage.trim()}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
