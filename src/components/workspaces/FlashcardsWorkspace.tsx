import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle2,
  BookOpen,
  Copy,
  Check,
  RotateCcw,
  Plus,
} from 'lucide-react';
import { Flashcard, LearningSubject } from '../../types';
import { STEM_PRESETS, DEMO_FLASHCARDS } from '../../constants/demoData';
import { generateFlashcards } from '../../services/api';
import { DemoBadge } from '../common/DemoBadge';

interface FlashcardsWorkspaceProps {
  isDemoMode: boolean;
  onAskTutorAboutCard?: (cardPrompt: string) => void;
}

export const FlashcardsWorkspace: React.FC<FlashcardsWorkspaceProps> = ({
  isDemoMode,
  onAskTutorAboutCard,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  
  // All combined cards from all STEM presets
  const allStemCards = STEM_PRESETS.flatMap((p) => p.flashcards);

  const [cards, setCards] = useState<Flashcard[]>(allStemCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [customNotes, setCustomNotes] = useState('');
  const [subject, setSubject] = useState<LearningSubject>('Engineering Physics');
  const [cardCount, setCardCount] = useState(8);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  const handleDomainFilter = (domain: string) => {
    setSelectedDomain(domain);
    setIsFlipped(false);
    setCurrentIndex(0);

    if (domain === 'All') {
      setCards(allStemCards);
    } else {
      const matched = STEM_PRESETS.find((p) => p.domain === domain);
      if (matched && matched.flashcards.length > 0) {
        setCards(matched.flashcards);
      } else {
        setCards(allStemCards);
      }
    }
  };

  const currentCard = cards[currentIndex] || cards[0] || DEMO_FLASHCARDS[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setCards((prev) => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
  };

  const handleToggleMastered = (id: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, mastered: !c.mastered } : c))
    );
  };

  const handleGenerateFromNotes = async () => {
    if (!customNotes.trim()) return;
    setIsGenerating(true);
    try {
      const res = await generateFlashcards(customNotes, subject, cardCount, isDemoMode);
      if (res.success && res.data && res.data.cards.length > 0) {
        setCards(res.data.cards);
        setCurrentIndex(0);
        setIsFlipped(false);
        setShowGenerator(false);
        setSelectedDomain('Custom');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyDeck = () => {
    const text = cards
      .map((c, i) => `Card ${i + 1} [${c.category || 'General'}]:\nQ: ${c.front}\nA: ${c.back}\n`)
      .join('\n---\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const masteredCount = cards.filter((c) => c.mastered).length;
  const progressPercent = cards.length > 0 ? Math.round((masteredCount / cards.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 shadow-xs">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Smart Study Flashcards
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Active recall flashcards across Physics, Chemistry, Mathematics, and Engineering.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isDemoMode && <DemoBadge />}
          <button
            onClick={() => setShowGenerator(!showGenerator)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showGenerator ? 'Close Generator' : 'Generate Custom Deck'}</span>
          </button>
          <button
            onClick={handleCopyDeck}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-xs cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Export Deck'}</span>
          </button>
        </div>
      </div>

      {/* Domain Deck Switcher */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Deck Subject:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'All', label: 'All STEM Decks', icon: '🌟' },
            { id: 'Physics', label: 'Physics (Dynamics)', icon: '⚡' },
            { id: 'Chemistry', label: 'Chemistry (Thermodynamics)', icon: '🧪' },
            { id: 'Mathematics', label: 'Maths (Calculus & ODEs)', icon: '📐' },
            { id: 'Computer Science', label: 'CS (Algorithms & Big-O)', icon: '💻' },
            { id: 'Engineering', label: 'Engineering (Circuits)', icon: '⚙️' },
          ].map((tab) => {
            const isSelected = selectedDomain === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleDomainFilter(tab.id)}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all border flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Generator Drawer */}
      {showGenerator && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Generate Flashcards from Custom Notes
          </h3>
          <textarea
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            rows={4}
            placeholder="Paste formulas, definitions, or lecture notes to turn into flashcards..."
            className="w-full text-xs font-mono p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden dark:text-slate-200"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as LearningSubject)}
                className="text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium"
              >
                <option>Engineering Physics</option>
                <option>Mathematics</option>
                <option>Computer Science</option>
                <option>Chemistry</option>
                <option>Electronics & Communication</option>
                <option>Mechanical Engineering</option>
              </select>

              <select
                value={cardCount}
                onChange={(e) => setCardCount(Number(e.target.value))}
                className="text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium"
              >
                <option value={6}>6 Cards</option>
                <option value={8}>8 Cards</option>
                <option value={12}>12 Cards</option>
              </select>
            </div>

            <button
              onClick={handleGenerateFromNotes}
              disabled={isGenerating || !customNotes.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-40"
            >
              {isGenerating ? 'Generating Deck...' : 'Create Flashcards'}
            </button>
          </div>
        </div>
      )}

      {/* Main Flashcard Deck View */}
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress Tracker */}
        <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
          <span>
            Card {currentIndex + 1} of {cards.length}
          </span>
          <div className="flex items-center gap-2">
            <span>{masteredCount} Mastered ({progressPercent}%)</span>
            <div className="w-24 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3D Flip Card */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="perspective-1000 w-full min-h-[320px] sm:min-h-[360px] cursor-pointer select-none"
        >
          <div
            className={`w-full min-h-[320px] sm:min-h-[360px] rounded-3xl p-8 border transition-transform duration-500 preserve-3d relative flex flex-col justify-between shadow-xl ${
              isFlipped ? 'rotate-y-180' : ''
            } ${
              currentCard.mastered
                ? 'bg-gradient-to-br from-white to-emerald-50/40 dark:from-slate-900 dark:to-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            {/* Front of Card */}
            <div className={`space-y-4 ${isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-900">
                  {currentCard.category || 'Concept Prompt'}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Click to flip</span>
                </span>
              </div>

              <div className="pt-6 sm:pt-10 text-center">
                <h3 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed">
                  {currentCard.front}
                </h3>
              </div>
            </div>

            {/* Back of Card (Shown on Flip) */}
            <div
              className={`space-y-4 rotate-y-180 absolute inset-0 p-8 flex flex-col justify-between ${
                !isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900">
                  Answer & Core Takeaway
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Click to flip back</span>
                </span>
              </div>

              <div className="text-center py-4">
                <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {currentCard.back}
                </p>
              </div>

              <div className="flex justify-center pt-2">
                {onAskTutorAboutCard && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAskTutorAboutCard(`Can you explain this flashcard concept in more detail: "${currentCard.front}"?`);
                    }}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                  >
                    Ask Snap the AI Tutor about this
                  </button>
                )}
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleMastered(currentCard.id);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                  currentCard.mastered
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{currentCard.mastered ? 'Mastered ✓' : 'Mark as Mastered'}</span>
              </button>

              <span className="text-[11px] text-slate-400">Card #{currentIndex + 1}</span>
            </div>
          </div>
        </div>

        {/* Deck Navigation Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrev}
            className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-xs"
            title="Previous Card"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleShuffle}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-xs"
          >
            <Shuffle className="w-4 h-4 text-indigo-500" />
            <span>Shuffle Deck</span>
          </button>

          <button
            onClick={() => {
              setCards((prev) => prev.map((c) => ({ ...c, mastered: false })));
              setCurrentIndex(0);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            title="Reset Mastery"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95 transition-all"
            title="Next Card"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
