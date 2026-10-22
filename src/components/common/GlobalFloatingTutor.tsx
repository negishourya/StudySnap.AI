import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Minimize2,
  Maximize2,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
  BookOpen,
  Share2,
} from 'lucide-react';
import { Mascot3D } from '../3d/Mascot3D';
import { TutorMessage, DifficultyLevel, ResponseLanguage, TutorContextShare } from '../../types';
import { chatWithTutor } from '../../services/api';

interface GlobalFloatingTutorProps {
  isDemoMode: boolean;
  sharedContext?: TutorContextShare | null;
  onClearSharedContext?: () => void;
}

export const GlobalFloatingTutor: React.FC<GlobalFloatingTutorProps> = ({
  isDemoMode,
  sharedContext,
  onClearSharedContext,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeDomain, setActiveDomain] = useState<'All' | 'Physics' | 'Chemistry' | 'Maths' | 'CS' | 'Engineering'>('All');
  const [teachingMode, setTeachingMode] = useState<'socratic' | 'direct'>('socratic');

  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'floating-init',
      role: 'assistant',
      content: "Hi! I'm Snap, your AI study buddy. I can solve and explain questions across **Physics**, **Chemistry**, **Mathematics**, and **Engineering**! What are you working on today?",
      timestamp: 'Just now',
      suggestions: [
        '⚡ Explain Newton\'s Laws & Dynamics',
        '🧪 Gibbs Free Energy & Equilibrium',
        '📐 How to solve First-Order ODEs',
        '💻 Big-O & Binary Search Complexity',
        '⚙️ Kirchhoff\'s Circuit Laws (KVL/KCL)',
      ],
      mascotState: 'idle',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [mascotState, setMascotState] = useState<'idle' | 'thinking' | 'happy' | 'confused'>('idle');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Beginner');
  const [language, setLanguage] = useState<ResponseLanguage>('English');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // If a context snippet is shared from another workspace, auto open the tutor
  useEffect(() => {
    if (sharedContext) {
      setIsOpen(true);
      setInputMessage(`Can you explain this part from my ${sharedContext.source}: "${sharedContext.text.slice(0, 150)}..."?`);
    }
  }, [sharedContext]);

  const handleDomainFilter = (domain: 'All' | 'Physics' | 'Chemistry' | 'Maths' | 'CS' | 'Engineering') => {
    setActiveDomain(domain);
    let domainSuggestions = [
      '⚡ Explain Newton\'s Laws & Dynamics',
      '🧪 Gibbs Free Energy & Equilibrium',
      '📐 How to solve First-Order ODEs',
      '💻 Big-O & Binary Search Complexity',
      '⚙️ Kirchhoff\'s Circuit Laws (KVL/KCL)',
    ];

    if (domain === 'Physics') {
      domainSuggestions = [
        'Explain Newton\'s Second Law (F = ma)',
        'Why do action-reaction pairs not cancel?',
        'Calculate net force on a 2 kg accelerating object',
      ];
    } else if (domain === 'Chemistry') {
      domainSuggestions = [
        'When is a reaction spontaneous (ΔG < 0)?',
        'Explain Le Chatelier\'s Principle with Haber process',
        'How does temperature affect equilibrium constant K?',
      ];
    } else if (domain === 'Maths') {
      domainSuggestions = [
        'How to find Integrating Factor for dy/dx + P(x)y = Q(x)?',
        'Derive product rule d/dx [u*v]',
        'Explain eigenvalues and eigenvectors intuitively',
      ];
    } else if (domain === 'CS') {
      domainSuggestions = [
        'Why does Binary Search take O(log n)?',
        'Compare BFS vs DFS with use cases',
        'Explain Dynamic Programming memoization',
      ];
    } else if (domain === 'Engineering') {
      domainSuggestions = [
        'Explain Kirchhoff\'s Current Law (KCL)',
        'Calculate two 6Ω resistors in parallel',
        'How does an ideal capacitor behave in DC circuits?',
      ];
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-domain-${Date.now()}`,
        role: 'assistant',
        content: `Switched focus to **${domain === 'All' ? 'All STEM Disciplines' : domain}**. Ask me any question or tap a prompt below!`,
        timestamp: 'Just now',
        suggestions: domainSuggestions,
      },
    ]);
  };

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText || inputMessage).trim();
    if (!text || isSending) return;

    setInputMessage('');
    const userMsg: TutorMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: 'Just now',
      contextSnippet: sharedContext?.text,
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
          currentTopic: activeDomain === 'All' ? 'Physics, Chemistry, Maths & Engineering' : activeDomain,
          contextSnippet: sharedContext?.text,
        },
        isDemoMode
      );

      if (res.success && res.data) {
        const replyData = res.data;
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-reply-${Date.now()}`,
            role: 'assistant',
            content: replyData.reply,
            timestamp: 'Just now',
            suggestions: replyData.suggestions,
          },
        ]);
        setMascotState('happy');
        setTimeout(() => setMascotState('idle'), 2500);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-err-${Date.now()}`,
            role: 'assistant',
            content: res.message || 'Sorry, I ran into an error. Please ask again.',
            timestamp: 'Just now',
          },
        ]);
        setMascotState('confused');
      }
    } catch {
      setMascotState('confused');
    } finally {
      setIsSending(false);
      onClearSharedContext?.();
    }
  };

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

      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const clean = text.replace(/[*#`_$[\]]/g, '').slice(0, 300);
    const u = new SpeechSynthesisUtterance(clean);
    u.rate = 1.0;
    u.pitch = 1.05;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  return (
    <>
      {/* Floating launcher trigger button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 sm:px-4 sm:py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 group cursor-pointer border border-indigo-400/30"
          title="Open AI Tutor"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
            ⚡
          </div>
          <span className="hidden sm:inline text-xs font-bold tracking-wide">Ask AI Tutor (All STEM)</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* Expandable chat drawer */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl flex flex-col overflow-hidden transition-all duration-300 ${
            isExpanded
              ? 'inset-4 sm:inset-10 sm:max-w-4xl sm:mx-auto'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[450px] h-[580px] max-h-[88vh]'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                ⚡
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Snap AI STEM Tutor</span>
                  <span className="text-[10px] font-normal text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 rounded-full">
                    Online
                  </span>
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Physics • Chemistry • Maths • Engineering
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                title={isExpanded ? 'Restore window size' : 'Expand window'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  setMessages([messages[0]]);
                  onClearSharedContext?.();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                title="Clear conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Subject Filter Selector */}
          <div className="px-3 py-1.5 bg-slate-100/70 dark:bg-slate-800/50 border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-[11px] gap-1 overflow-x-auto">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">Subject:</span>
            <div className="flex items-center gap-1">
              {(['All', 'Physics', 'Chemistry', 'Maths', 'CS', 'Engineering'] as const).map((dom) => (
                <button
                  key={dom}
                  type="button"
                  onClick={() => handleDomainFilter(dom)}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-all shrink-0 cursor-pointer text-[10px] ${
                    activeDomain === dom
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {dom === 'Physics' ? '⚡ ' : dom === 'Chemistry' ? '🧪 ' : dom === 'Maths' ? '📐 ' : dom === 'CS' ? '💻 ' : dom === 'Engineering' ? '⚙️ ' : ''}
                  {dom}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Context Banner if sharing from active page */}
          {sharedContext && (
            <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 border-b border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-200">
              <div className="flex items-center gap-2 truncate pr-2">
                <Share2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="truncate">
                  Context shared from <strong>{sharedContext.source}</strong>: "{sharedContext.text.slice(0, 40)}..."
                </span>
              </div>
              <button
                onClick={onClearSharedContext}
                className="text-[10px] text-indigo-600 dark:text-indigo-400 underline shrink-0 font-semibold cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                      ⚡
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3 rounded-2xl leading-relaxed ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs border border-slate-200/60 dark:border-slate-700/60'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.content}</div>

                      {!isUser && (
                        <div className="flex items-center justify-end pt-1 mt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                          <button
                            type="button"
                            onClick={() => speakText(m.content)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                            title="Read out loud"
                          >
                            {isSpeaking ? (
                              <VolumeX className="w-3 h-3 text-indigo-600" />
                            ) : (
                              <Volume2 className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Suggestions */}
                    {!isUser && m.suggestions && m.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {m.suggestions.map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(s)}
                            className="text-[10px] px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 font-medium transition-colors text-left cursor-pointer"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex items-center gap-2 text-xs text-slate-400 pl-8">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                <span>Snap is calculating response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Toolbar */}
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1 overflow-x-auto py-0.5">
              <button
                type="button"
                onClick={() => handleSend('Explain this step-by-step with formulas and units.')}
                className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 shrink-0 cursor-pointer"
              >
                💡 Step-by-Step
              </button>
              <button
                type="button"
                onClick={() => handleSend('Can you give a practical real-world engineering example?')}
                className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 shrink-0 cursor-pointer"
              >
                ⚙️ Practical Example
              </button>
              <button
                type="button"
                onClick={() => handleSend('Give me 1 quick practice problem to test my understanding.')}
                className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 shrink-0 cursor-pointer"
              >
                ❓ Practice Problem
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setTeachingMode(teachingMode === 'socratic' ? 'direct' : 'socratic')}
                className="text-[10px] px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded font-medium cursor-pointer"
                title="Toggle Socratic vs Direct explanations"
              >
                {teachingMode === 'socratic' ? 'Socratic' : 'Direct'}
              </button>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as ResponseLanguage)}
                className="text-[10px] py-0.5 px-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Hinglish</option>
              </select>
            </div>
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-1.5"
            >
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isListening
                    ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
                title="Voice input"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask any Physics, Chemistry, Maths, or Engineering question..."
                className="flex-1 text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden dark:text-slate-200"
              />

              <button
                type="submit"
                disabled={isSending || !inputMessage.trim()}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
