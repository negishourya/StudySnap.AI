import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  FileCheck2,
  HelpCircle,
  Upload,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
  FileText,
  Download,
  Share2,
} from 'lucide-react';
import {
  LearningSubject,
  DifficultyLevel,
  ResponseLanguage,
  TransformerOutputMode,
  SummaryLength,
  QuizQuestion,
  TutorContextShare,
} from '../../types';
import { explainNotes, summarizeNotes, generateQuiz } from '../../services/api';
import { DEMO_RAW_NOTES } from '../../constants/demoData';
import { DemoBadge } from '../common/DemoBadge';
import { FileUploadModal } from '../common/FileUploadModal';

interface NotesTransformerWorkspaceProps {
  isDemoMode: boolean;
  onOpenTutorWithTopic?: (topic: string) => void;
  onShareContextWithTutor?: (ctx: TutorContextShare) => void;
}

export const NotesTransformerWorkspace: React.FC<NotesTransformerWorkspaceProps> = ({
  isDemoMode,
  onOpenTutorWithTopic,
  onShareContextWithTutor,
}) => {
  // Input State
  const [notes, setNotes] = useState('');
  const [subject, setSubject] = useState<LearningSubject>('Engineering Physics');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Beginner');
  const [language, setLanguage] = useState<ResponseLanguage>('English');
  const [outputMode, setOutputMode] = useState<TransformerOutputMode>('All-in-One');
  const [summaryLength, setSummaryLength] = useState<SummaryLength>('Standard');
  const [quizLength, setQuizLength] = useState<number>(5);

  // Modal & Processing state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [activeTab, setActiveTab] = useState<'explanation' | 'summary' | 'quiz'>('explanation');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  // Result outputs
  const [explanationOutput, setExplanationOutput] = useState<string | null>(null);
  const [summaryOutput, setSummaryOutput] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [isOutputDemo, setIsOutputDemo] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quiz Interaction State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  const handleLoadSampleNotes = () => {
    setNotes(DEMO_RAW_NOTES);
    setSubject('Engineering Physics');
    setDifficulty('Beginner');
  };

  const handleTransform = async () => {
    if (!notes.trim()) {
      setErrorMessage('Please paste study notes or upload a document first.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    setIsQuizSubmitted(false);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);

    const willDoExplanation = outputMode === 'Explanation' || outputMode === 'All-in-One';
    const willDoSummary = outputMode === 'Summary' || outputMode === 'All-in-One';
    const willDoQuiz = outputMode === 'Practice Quiz' || outputMode === 'All-in-One';

    setIsOutputDemo(isDemoMode);

    try {
      if (outputMode === 'All-in-One') {
        setLoadingStep('Synthesizing explanation, revision summary, and practice quiz in parallel...');
        const [expRes, sumRes, quizRes] = await Promise.allSettled([
          explainNotes(notes, subject, difficulty, language, isDemoMode),
          summarizeNotes(notes, subject, summaryLength, language, isDemoMode),
          generateQuiz(notes, subject, difficulty, quizLength, isDemoMode),
        ]);

        if (expRes.status === 'fulfilled' && expRes.value.success && expRes.value.data) {
          setExplanationOutput(expRes.value.data.explanation);
        } else if (expRes.status === 'fulfilled' && !expRes.value.success) {
          setErrorMessage(expRes.value.message || 'Explanation failed.');
        }

        if (sumRes.status === 'fulfilled' && sumRes.value.success && sumRes.value.data) {
          setSummaryOutput(sumRes.value.data.summary);
        }

        if (quizRes.status === 'fulfilled' && quizRes.value.success && quizRes.value.data) {
          setQuizQuestions(quizRes.value.data.questions);
        }

        setActiveTab('explanation');
      } else if (willDoExplanation) {
        setLoadingStep('Generating step-by-step conceptual explanation...');
        const res = await explainNotes(notes, subject, difficulty, language, isDemoMode);
        if (res.success && res.data) {
          setExplanationOutput(res.data.explanation);
          setActiveTab('explanation');
        } else {
          setErrorMessage(res.message || 'Failed to generate explanation.');
        }
      } else if (willDoSummary) {
        setLoadingStep('Distilling high-yield revision summary and formulas...');
        const res = await summarizeNotes(notes, subject, summaryLength, language, isDemoMode);
        if (res.success && res.data) {
          setSummaryOutput(res.data.summary);
          setActiveTab('summary');
        } else {
          setErrorMessage(res.message || 'Failed to generate revision summary.');
        }
      } else if (willDoQuiz) {
        setLoadingStep('Formulating multiple-choice questions & verified calculations...');
        const res = await generateQuiz(notes, subject, difficulty, quizLength, isDemoMode);
        if (res.success && res.data) {
          setQuizQuestions(res.data.questions);
          setActiveTab('quiz');
        } else {
          setErrorMessage(res.message || 'Failed to generate quiz.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during note transformation.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isQuizSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const calculateScore = () => {
    if (!quizQuestions) return 0;
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) score += 1;
    });
    return score;
  };

  const handleCopyContent = (text: string, tab: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const handleDownloadContent = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              AI Notes Transformer
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Transform raw college lecture notes and slides into structured explanations, high-yield summaries, and self-scoring quizzes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isDemoMode ? (
            <DemoBadge />
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Real AI Mode (Gemini)
            </span>
          )}
          <button
            type="button"
            onClick={handleLoadSampleNotes}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
          >
            Load Newton's Laws Sample
          </button>
        </div>
      </div>

      {/* Main Grid: Left Controls & Notes / Right Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Source Study Material
            </label>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          </div>

          <div className="relative">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={9}
              placeholder="Paste lecture notes, textbook definitions, formula derivations, or code snippets here..."
              className="w-full text-xs sm:text-sm p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden transition-all resize-y font-mono dark:text-slate-200"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 px-1">
              <span>{notes.length.toLocaleString()} characters</span>
              <span>Max 20,000 characters</span>
            </div>
          </div>

          {/* Form Controls */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as LearningSubject)}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden font-medium text-slate-800 dark:text-slate-200"
              >
                <option>Engineering Physics</option>
                <option>Mathematics</option>
                <option>Computer Science</option>
                <option>Chemistry</option>
                <option>Electronics & Communication</option>
                <option>Mechanical Engineering</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden font-medium text-slate-800 dark:text-slate-200"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Response Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as ResponseLanguage)}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden font-medium text-slate-800 dark:text-slate-200"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Hinglish</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Output Mode
              </label>
              <select
                value={outputMode}
                onChange={(e) => setOutputMode(e.target.value as TransformerOutputMode)}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden font-medium text-slate-800 dark:text-slate-200"
              >
                <option>All-in-One</option>
                <option>Explanation</option>
                <option>Summary</option>
                <option>Practice Quiz</option>
              </select>
            </div>
          </div>

          {/* Conditional Controls for Depth / Quiz Length */}
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Summary Depth
              </label>
              <select
                value={summaryLength}
                onChange={(e) => setSummaryLength(e.target.value as SummaryLength)}
                disabled={outputMode === 'Explanation' || outputMode === 'Practice Quiz'}
                className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden disabled:opacity-40 text-slate-800 dark:text-slate-200"
              >
                <option>Quick</option>
                <option>Standard</option>
                <option>Detailed</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Quiz Questions
              </label>
              <select
                value={quizLength}
                onChange={(e) => setQuizLength(Number(e.target.value))}
                disabled={outputMode === 'Explanation' || outputMode === 'Summary'}
                className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden disabled:opacity-40 text-slate-800 dark:text-slate-200"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
              </select>
            </div>
          </div>

          {/* Main Action CTA */}
          <button
            onClick={handleTransform}
            disabled={isLoading || !notes.trim()}
            className="w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-indigo-500/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Transforming with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Transform My Notes</span>
              </>
            )}
          </button>

          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Notice</p>
                <p className="mt-0.5">{errorMessage}</p>
                {!isDemoMode && errorMessage.includes('GEMINI_API_KEY') && (
                  <p className="mt-1 text-[11px] text-rose-700 dark:text-rose-300 underline font-medium">
                    Tip: Switch to Demo Mode in the top navigation bar to test without an API key.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Output Tabs & Interactive Views (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col min-h-[520px]">
          {/* Output Mode Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 px-4 pt-3">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('explanation')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-t border-x ${
                  activeTab === 'explanation'
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Explanation</span>
                {explanationOutput && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
              </button>

              <button
                onClick={() => setActiveTab('summary')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-t border-x ${
                  activeTab === 'summary'
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Summary</span>
                {summaryOutput && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-t border-x ${
                  activeTab === 'quiz'
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Practice Quiz</span>
                {quizQuestions && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
              </button>
            </div>

            {isOutputDemo && <DemoBadge />}
          </div>

          {/* Tab Content Area */}
          <div className="p-6 flex-1 flex flex-col justify-between">
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 animate-pulse">
                  <Sparkles className="w-6 h-6 animate-spin" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Processing Study Content
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">{loadingStep}</p>
              </div>
            ) : (
              <>
                {/* 1. SIMPLE EXPLANATION VIEW */}
                {activeTab === 'explanation' && (
                  <div>
                    {explanationOutput ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Subject: {subject} • {difficulty}
                          </span>
                          <div className="flex items-center gap-2">
                            {onShareContextWithTutor && (
                              <button
                                onClick={() =>
                                  onShareContextWithTutor({
                                    source: 'notes',
                                    title: subject,
                                    text: explanationOutput.slice(0, 500),
                                  })
                                }
                                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                                <span>Share with Snap Tutor</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleDownloadContent(explanationOutput, `${subject}_explanation.md`)}
                              className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700"
                              title="Download Markdown"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleCopyContent(explanationOutput, 'exp')}
                              className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700"
                            >
                              {copiedTab === 'exp' ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                              <span>{copiedTab === 'exp' ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>

                        <div className="prose prose-slate dark:prose-invert prose-sm max-w-none text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 whitespace-pre-wrap font-sans">
                          {explanationOutput}
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
                        <BookOpen className="w-12 h-12 stroke-1 mb-3 text-slate-300 dark:text-slate-700" />
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                          No explanation generated yet
                        </p>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs">
                          Paste your notes on the left and click "Transform My Notes", or load the sample notes.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. REVISION SUMMARY VIEW */}
                {activeTab === 'summary' && (
                  <div>
                    {summaryOutput ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Revision Depth: {summaryLength}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDownloadContent(summaryOutput, `${subject}_summary.md`)}
                              className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700"
                              title="Download Markdown"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleCopyContent(summaryOutput, 'sum')}
                              className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700"
                            >
                              {copiedTab === 'sum' ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                              <span>{copiedTab === 'sum' ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>

                        <div className="prose prose-slate dark:prose-invert prose-sm max-w-none text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                          {summaryOutput}
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
                        <FileCheck2 className="w-12 h-12 stroke-1 mb-3 text-slate-300 dark:text-slate-700" />
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                          No revision summary generated yet
                        </p>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs">
                          Transform your notes to get high-yield exam takeaways, formulas, and definitions.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. INTERACTIVE PRACTICE QUIZ VIEW */}
                {activeTab === 'quiz' && (
                  <div>
                    {quizQuestions && quizQuestions.length > 0 ? (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              Question {currentQuestionIndex + 1} of {quizQuestions.length}
                            </span>
                            {quizQuestions[currentQuestionIndex].topic && (
                              <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-medium">
                                {quizQuestions[currentQuestionIndex].topic}
                              </span>
                            )}
                          </div>

                          {isQuizSubmitted && (
                            <div className="text-xs font-bold px-3 py-1 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-800">
                              Score: {calculateScore()} / {quizQuestions.length} (
                              {Math.round((calculateScore() / quizQuestions.length) * 100)}%)
                            </div>
                          )}
                        </div>

                        {/* Current Question */}
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                          <h4 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-snug">
                            {quizQuestions[currentQuestionIndex].question}
                          </h4>
                          {quizQuestions[currentQuestionIndex].calculation && (
                            <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                              Formula context: {quizQuestions[currentQuestionIndex].calculation}
                            </p>
                          )}
                        </div>

                        {/* Options */}
                        <div className="space-y-2.5">
                          {quizQuestions[currentQuestionIndex].options.map((option, optIdx) => {
                            const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                            const isCorrect = optIdx === quizQuestions[currentQuestionIndex].correctIndex;
                            let optionClass =
                              'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-300';

                            if (isQuizSubmitted) {
                              if (isCorrect) {
                                optionClass =
                                  'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-semibold';
                              } else if (isSelected && !isCorrect) {
                                optionClass =
                                  'border-rose-400 bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 line-through';
                              } else {
                                optionClass = 'border-slate-200 dark:border-slate-800 opacity-60';
                              }
                            } else if (isSelected) {
                              optionClass =
                                'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-200 font-medium ring-1 ring-indigo-500';
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                disabled={isQuizSubmitted}
                                onClick={() => handleSelectOption(optIdx)}
                                className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between transition-all ${optionClass}`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center shrink-0">
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span>{option}</span>
                                </div>
                                {isQuizSubmitted && isCorrect && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Post-submission Explanation */}
                        {isQuizSubmitted && (
                          <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-xs text-indigo-950 dark:text-indigo-200 space-y-1">
                            <strong className="font-semibold block text-indigo-900 dark:text-indigo-300">
                              Why this is correct:
                            </strong>
                            <p className="leading-relaxed">{quizQuestions[currentQuestionIndex].explanation}</p>
                          </div>
                        )}

                        {/* Navigation controls & Submit */}
                        <div className="flex items-center justify-between pt-2">
                          <button
                            type="button"
                            disabled={currentQuestionIndex === 0}
                            onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Previous</span>
                          </button>

                          <div className="flex items-center gap-2">
                            {!isQuizSubmitted ? (
                              <button
                                type="button"
                                onClick={() => setIsQuizSubmitted(true)}
                                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-xs"
                              >
                                Submit Quiz Answers
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedAnswers({});
                                  setIsQuizSubmitted(false);
                                  setCurrentQuestionIndex(0);
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Retry Quiz</span>
                              </button>
                            )}

                            <button
                              type="button"
                              disabled={currentQuestionIndex === quizQuestions.length - 1}
                              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40"
                            >
                              <span>Next</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
                        <HelpCircle className="w-12 h-12 stroke-1 mb-3 text-slate-300 dark:text-slate-700" />
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                          No quiz questions generated yet
                        </p>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs">
                          Transform your notes in Practice Quiz or All-in-One mode to test your understanding.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onTextExtracted={(text) => setNotes(text)}
        title="Upload Study Material"
        description="Extract notes from TXT, text-based PDF, or DOCX documents."
      />
    </div>
  );
};
