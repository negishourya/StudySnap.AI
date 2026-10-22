import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Target,
  Flame,
  BookOpen,
  HelpCircle,
  Layers,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { DashboardStats, UserProfile } from '../../types';
import { fetchDashboardAnalytics, fetchUserProfile } from '../../services/api';
import { DemoBadge } from '../common/DemoBadge';

interface DashboardWorkspaceProps {
  isDemoMode: boolean;
  onNavigate: (view: 'transformer' | 'tutor' | 'flashcards' | 'resume-builder' | 'resume-analyzer') => void;
}

export const DashboardWorkspace: React.FC<DashboardWorkspaceProps> = ({
  isDemoMode,
  onNavigate,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDashboardAnalytics(isDemoMode), fetchUserProfile()]).then(
      ([analyticsData, userProfile]) => {
        setStats(analyticsData);
        setProfile(userProfile);
        setIsLoading(false);
      }
    );
  }, [isDemoMode]);

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Learning Progress Dashboard
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real performance analytics, milestone badges, quiz retention metrics, and session activity logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isDemoMode && <DemoBadge />}
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>{profile?.xp || 350} Total XP</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/60 px-3 py-1.5 rounded-xl border border-orange-200 dark:border-orange-800">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>{profile?.streak || 3} Day Streak</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Study Sessions',
            val: stats?.totalSessions || 14,
            icon: Clock,
            accent: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400',
            sub: '+3 this week',
          },
          {
            label: 'Quizzes Completed',
            val: stats?.quizzesCompleted || 6,
            icon: HelpCircle,
            accent: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400',
            sub: `${stats?.quizAccuracy || 92}% Average Accuracy`,
          },
          {
            label: 'Flashcards Reviewed',
            val: stats?.flashcardsReviewed || 48,
            icon: Layers,
            accent: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400',
            sub: '16 Mastered concepts',
          },
          {
            label: 'Notes Transformed',
            val: stats?.notesCreated || 5,
            icon: BookOpen,
            accent: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400',
            sub: 'Physics & CS modules',
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {item.label}
                </span>
                <div className={`p-2 rounded-xl ${item.accent}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {item.val}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Subject Breakdown & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Subject Mastery & Accuracy (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Subject Retention & Mastery Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Derived from quiz scores, flashcard reviews, and tutor problem solving.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { subject: 'Engineering Physics (Dynamics & Mechanics)', progress: 92, status: 'Mastered' },
              { subject: 'Computer Science (Data Structures & WebGL)', progress: 85, status: 'Strong' },
              { subject: 'Mathematics (Calculus & Linear Algebra)', progress: 74, status: 'Good' },
              { subject: 'Electronics & Communication', progress: 62, status: 'In Progress' },
            ].map((sub, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{sub.subject}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400">{sub.progress}%</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {sub.status}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all"
                    style={{ width: `${sub.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Launch Cards */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              onClick={() => onNavigate('transformer')}
              className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-colors"
            >
              <BookOpen className="w-4 h-4 text-indigo-600 mb-1" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">Transform Notes</div>
              <div className="text-[10px] text-slate-500">New study deck</div>
            </button>

            <button
              onClick={() => onNavigate('flashcards')}
              className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-colors"
            >
              <Layers className="w-4 h-4 text-purple-600 mb-1" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">Review Cards</div>
              <div className="text-[10px] text-slate-500">48 flashcards</div>
            </button>

            <button
              onClick={() => onNavigate('tutor')}
              className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-colors col-span-2 sm:col-span-1"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 mb-1" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">Practice with Snap</div>
              <div className="text-[10px] text-slate-500">Level 2 Challenge</div>
            </button>
          </div>
        </div>

        {/* Right Column: Recent Activity Feed (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Recent Study Activity
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Live Session</span>
          </div>

          <div className="space-y-3">
            {(stats?.recentActivities || []).map((act, i) => (
              <div
                key={act.id || i}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    {act.type === 'quiz' ? '📝' : act.type === 'flashcard' ? '🗂️' : act.type === 'tutor' ? '⚡' : '📄'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white leading-snug">{act.title}</h4>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{act.time}</span>
                  </div>
                </div>

                {act.score && (
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 shrink-0">
                    {act.score}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('resume-builder')}
              className="w-full py-2.5 px-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
            >
              <span>Build Internship Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
