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
  HelpCircle,
  Compass,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  Layers,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Mascot3D } from '../3d/Mascot3D';
import { DemoBadge } from '../common/DemoBadge';
import { TutorMessage, TutorLessonLevel, DifficultyLevel, ResponseLanguage } from '../../types';
import { chatWithTutor, evaluateTutorAnswer, updateUserProgress } from '../../services/api';

interface AITutorWorkspaceProps {
  isDemoMode: boolean;
  initialTopic?: string;
}

const INITIAL_LEVELS: TutorLessonLevel[] = [
  {
    level: 1,
    title: 'Start Here',
    subtitle: 'Foundations of Force & Inertia',
    unlocked: true,
    completed: true,
    xpReward: 50,
  },
  {
    level: 2,
    title: 'Understand the Concept',
    subtitle: "Newton's Second Law: F = ma",
    unlocked: true,
    completed: false,
    challengeQuestion: 'If a 2 kg object accelerates at 3 m/s², what is the net force in Newtons?',
    xpReward: 75,
  },
  {
    level: 3,
    title: 'Learn Through Examples',
    subtitle: 'Free Body Diagrams & Pulleys',
    unlocked: false,
    completed: false,
    challengeQuestion: 'In an elevator accelerating upward at 2 m/s², does your apparent weight increase or decrease?',
    xpReward: 100,
  },
  {
    level: 4,
    title: 'Practise Questions',
    subtitle: 'Calculation & Dimension Sprint',
    unlocked: false,
    completed: false,
    challengeQuestion: 'What are the SI base units of 1 Newton?',
    xpReward: 125,
  },
  {
    level: 5,
    title: 'Complete a Challenge',
    subtitle: 'Rocket Exhaust & Third Law Pairs',
    unlocked: false,
    completed: false,
    challengeQuestion: 'Why do action-reaction pairs not cancel each other out in flight?',
    xpReward: 150,
  },
  {
    level: 6,
    title: 'Revise and Master',
    subtitle: 'Engineering Dynamics Synthesis',
    unlocked: false,
    completed: false,
    challengeQuestion: 'Under what physical condition does F = m * a break down, requiring F = dp/dt?',
    xpReward: 200,
  },
];

export const AITutorWorkspace: React.FC<AITutorWorkspaceProps> = ({
  isDemoMode,
  initialTopic = 'Classical Dynamics & Newton’s Laws',
}) => {
  // Chat State
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'msg-0',
      role: 'assistant',
      content: `Hey there! I'm Snap, your personal AI study companion. We're exploring **${initialTopic}** today.
      
Are you ready to test your intuition, or would you like to start with an intuitive real-world analogy?`,
      timestamp: 'Just now',
      suggestions: [
        'Give me an intuitive analogy first!',
        'Ask me a quick practice question',
        'Explain F = ma in simple terms',
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
    const saved = localStorage.getItem('studysnap_levels');
    return saved ? JSON.parse(saved) : INITIAL_LEVELS;
  });
  const [activeLevelNumber, setActiveLevelNumber] = useState<number>(2);
  const [totalXp, setTotalXp] = useState<number>(() => {
    return parseInt(localStorage.getItem('studysnap_user_xp') || '350', 10);
  });
  const [streakDays, setStreakDays] = useState<number>(3);
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

  // Save levels to localStorage
  useEffect(() => {
    localStorage.setItem('studysnap_levels', JSON.stringify(levels));
    localStorage.setItem('studysnap_user_xp', totalXp.toString());
  }, [levels, totalXp]);

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
          currentTopic: initialTopic,
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
    } catch (e: any) {
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
    const q = activeLevel?.challengeQuestion || 'Explain Newton\'s Second Law';

    try {
      const res = await evaluateTutorAnswer(q, challengeAnswer, initialTopic, difficulty, isDemoMode);
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
    <div className="space-y-8">
      {/* Tutor Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">StudySnap AI Tutor</h2>
              <span className="text-[11px] font-semibold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                Interactive Companion
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Friendly Socratic guidance, step-by-step problem breakdown, and Duolingo-style milestones.
            </p>
          </div>
        </div>

        {/* Gamified HUD: XP, Streak, Goal */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold shadow-xs">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>{totalXp} XP</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-900 border border-orange-200 rounded-xl text-xs font-bold shadow-xs">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>{streakDays} Day Streak</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-bold shadow-xs">
            <Target className="w-4 h-4 text-indigo-500" />
            <span>{dailyProgress}/{dailyGoal} Daily Goal</span>
          </div>

          {isDemoMode && <DemoBadge />}
        </div>
      </div>

      {/* Main Grid: Left Mascot & Learning Path / Right Chat Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 3D Mascot & Duolingo Learning Journey (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Animated 3D Mascot Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-center flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-semibold text-slate-600">Snap (Online)</span>
            </div>

            <div className="mt-2">
              <Mascot3D state={mascotState} size="medium" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mt-2">Meet Snap</h3>
            <p className="text-xs text-slate-500 max-w-xs mt-0.5">
              {mascotState === 'thinking'
                ? 'Thinking and structuring the concept...'
                : mascotState === 'celebrating'
                ? 'Brilliant work! Lesson completed!'
                : mascotState === 'confused'
                ? 'Let’s look at that again from a different angle!'
                : 'Your interactive engineering mentor. Ask anything!'}
            </p>

            {/* Quick Prompt Starters */}
            <div className="grid grid-cols-2 gap-2 w-full mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleSendMessage('Can you give me an everyday real-world engineering example?')}
                className="p-2 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl border border-slate-200 transition-colors"
              >
                💡 Give An Example
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('Can you explain this again even simpler?')}
                className="p-2 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl border border-slate-200 transition-colors"
              >
                🔄 Explain Again
              </button>
            </div>
          </div>

          {/* Duolingo-style Learning Path */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Learning Journey
                </h4>
              </div>
              <span className="text-xs font-semibold text-indigo-600">
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
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500'
                        : lvl.completed
                        ? 'border-emerald-300 bg-emerald-50/40 text-emerald-950'
                        : lvl.unlocked
                        ? 'border-slate-200 hover:border-slate-300 bg-white'
                        : 'border-slate-100 bg-slate-50/70 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center text-xs shrink-0 ${
                          lvl.completed
                            ? 'bg-emerald-500 text-white'
                            : isActive
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {lvl.completed ? <Check className="w-4 h-4" /> : lvl.level}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 leading-tight">{lvl.title}</div>
                        <div className="text-[11px] text-slate-500">{lvl.subtitle}</div>
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
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
          {/* Tutor Controls Header */}
          <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Tutor Mode:</span>
              <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setTeachingMode('socratic')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    teachingMode === 'socratic'
                      ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Socratic (Hints First)
                </button>
                <button
                  type="button"
                  onClick={() => setTeachingMode('direct')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    teachingMode === 'direct'
                      ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
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
                className="text-xs py-1 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as ResponseLanguage)}
                className="text-xs py-1 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Hinglish</option>
              </select>
            </div>
          </div>

          {/* Level Challenge Modal or Banner if active */}
          {isPracticingChallenge && (
            <div className="p-4 bg-indigo-50/90 border-b border-indigo-100 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-900">
                    Level {activeLevelNumber} Challenge Question
                  </span>
                </div>
                <button
                  onClick={() => setIsPracticingChallenge(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Dismiss
                </button>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                {levels.find((l) => l.level === activeLevelNumber)?.challengeQuestion ||
                  'Calculate the net force on a 2 kg mass accelerating at 3 m/s².'}
              </p>

              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={challengeAnswer}
                  onChange={(e) => setChallengeAnswer(e.target.value)}
                  placeholder="Type your calculation or reasoning here..."
                  className="flex-1 text-xs sm:text-sm px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  onKeyDown={(e) => e.key === 'Enter' && handleEvaluateChallenge()}
                />
                <button
                  type="button"
                  onClick={handleEvaluateChallenge}
                  disabled={isSending || !challengeAnswer.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-40"
                >
                  Submit Challenge
                </button>
              </div>

              {challengeFeedback && (
                <div
                  className={`mt-2 p-2.5 rounded-xl text-xs flex items-start gap-2 ${
                    challengeFeedback.isCorrect
                      ? 'bg-emerald-100/70 text-emerald-900 border border-emerald-200'
                      : 'bg-amber-100/70 text-amber-900 border border-amber-200'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
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
                          : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/60'
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                      {!isUser && (
                        <div className="flex items-center justify-end gap-1.5 pt-1 mt-1 border-t border-slate-200/50">
                          <button
                            type="button"
                            onClick={() => speakText(msg.content)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
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
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 font-medium transition-colors text-left"
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
                <span>Snap is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-slate-200 bg-white">
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
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                title="Voice input"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Snap a question, request a hint, or paste a formula..."
                className="flex-1 text-xs sm:text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-hidden font-sans"
              />

              <button
                type="submit"
                disabled={isSending || !inputMessage.trim()}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
