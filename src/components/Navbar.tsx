import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Bot,
  Layers,
  TrendingUp,
  FileText,
  FileSearch,
  Menu,
  X,
  Sun,
  Moon,
  Flame,
  Trophy,
  ChevronDown,
  GraduationCap,
  LogIn,
  LogOut,
  User,
  Shield,
} from 'lucide-react';
import { DemoBadge } from './common/DemoBadge';

export type AppView =
  | 'landing'
  | 'transformer'
  | 'flashcards'
  | 'tutor'
  | 'dashboard'
  | 'resume-builder'
  | 'resume-analyzer'
  | 'admin';

interface NavbarProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  userStreak?: number;
  userXp?: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenDeleteDataModal: () => void;
  authUser?: { id: string; email?: string; user_metadata?: { full_name?: string } } | null;
  onOpenAuthModal?: (mode: 'signin' | 'signup') => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  isDemoMode,
  setIsDemoMode,
  userStreak = 3,
  userXp = 350,
  theme,
  onToggleTheme,
  onOpenDeleteDataModal,
  authUser,
  onOpenAuthModal,
  onSignOut,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCareerDropdownOpen, setIsCareerDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'landing', label: 'Overview', view: 'landing' as const },
    { id: 'transformer', label: 'Notes Transformer', view: 'transformer' as const },
    { id: 'flashcards', label: 'Flashcards', view: 'flashcards' as const },
    { id: 'tutor', label: 'AI Tutor', view: 'tutor' as const },
    { id: 'dashboard', label: 'Dashboard', view: 'dashboard' as const },
  ];

  const isCareerActive = activeView === 'resume-builder' || activeView === 'resume-analyzer';

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo with graduation cap icon */}
          <button
            onClick={() => {
              setActiveView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 group cursor-pointer text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 text-white flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-all ring-1 ring-white/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                StudySnap <span className="text-indigo-600 dark:text-indigo-400 font-black">AI 2.0</span>
              </span>
              <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-medium -mt-1 tracking-wider uppercase">
                Student Learning OS
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.view);
                  if (item.view === 'landing') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === item.view
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Career Suite Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCareerDropdownOpen(!isCareerDropdownOpen)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  isCareerActive
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <span>Career Suite</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isCareerDropdownOpen && (
                <div
                  onMouseLeave={() => setIsCareerDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in"
                >
                  <button
                    onClick={() => {
                      setActiveView('resume-builder');
                      setIsCareerDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center gap-2 ${
                      activeView === 'resume-builder'
                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                    <span>AI Resume Builder</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveView('resume-analyzer');
                      setIsCareerDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center gap-2 ${
                      activeView === 'resume-analyzer'
                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <FileSearch className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Resume Analyzer</span>
                  </button>
                </div>
              )}
            </div>

            {/* Admin Panel Navigation Link */}
            <button
              onClick={() => {
                setActiveView('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'admin'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 hover:bg-amber-50/80 dark:hover:bg-amber-950/40'
              }`}
              title="Admin Panel: Add & Remove Notes (Password: 1234)"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Right Action Hub: Mode Toggle, Theme Toggle & Stats */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Dark / Light Mode Switcher */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark/light mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Real vs Demo Mode Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setIsDemoMode(false)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  !isDemoMode
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Real AI
              </button>
              <button
                type="button"
                onClick={() => setIsDemoMode(true)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  isDemoMode
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Demo Mode
              </button>
            </div>

            {/* User XP & Streak quick indicator */}
            <div className="flex items-center gap-1.5 pl-1">
              <span className="flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>{userXp}</span>
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/60 px-2 py-1 rounded-lg border border-orange-200 dark:border-orange-800">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>{userStreak}d</span>
              </span>
            </div>

            {/* Supabase Auth State / Buttons */}
            {authUser ? (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 py-1 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 max-w-[150px]">
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    {(authUser.user_metadata?.full_name || authUser.email || 'U')[0].toUpperCase()}
                  </div>
                  <span
                    className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate"
                    title={authUser.email}
                  >
                    {authUser.user_metadata?.full_name || authUser.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                  title="Sign out of Supabase"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => onOpenAuthModal?.('signin')}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuthModal?.('signup')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Quick launch primary CTA */}
            {activeView === 'landing' ? (
              <button
                onClick={() => setActiveView('transformer')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                Start Studying
              </button>
            ) : (
              <button
                onClick={() => setActiveView('landing')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                Back to Home
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className="text-[11px] font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              {isDemoMode ? 'Demo' : 'Real AI'}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-4">
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.view);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                  activeView === item.view
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => {
                setActiveView('resume-builder');
                setIsMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                activeView === 'resume-builder'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              AI Resume Builder
            </button>

            <button
              onClick={() => {
                setActiveView('resume-analyzer');
                setIsMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                activeView === 'resume-analyzer'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              AI Resume Analyzer
            </button>

            <button
              onClick={() => {
                setActiveView('admin');
                setIsMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                activeView === 'admin'
                  ? 'bg-amber-500 text-white'
                  : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Panel (PIN: 1234)</span>
            </button>
          </div>

          {/* Supabase Auth on Mobile */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            {authUser ? (
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {(authUser.user_metadata?.full_name || authUser.email || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {authUser.user_metadata?.full_name || 'Signed In'}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[170px]">
                      {authUser.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onSignOut?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onOpenAuthModal?.('signin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onOpenAuthModal?.('signup');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-center shadow-xs"
                >
                  Register (Supabase)
                </button>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg">
                🏆 {userXp} XP
              </span>
              <span className="text-xs font-bold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/60 px-2.5 py-1 rounded-lg">
                🔥 {userStreak} Days
              </span>
            </div>
            <button
              onClick={() => {
                onOpenDeleteDataModal();
                setIsMobileMenuOpen(false);
              }}
              className="text-xs text-rose-600 dark:text-rose-400 underline font-medium"
            >
              Privacy / Wipe Data
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
