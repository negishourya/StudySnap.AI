import React, { useState, useEffect } from 'react';
import { Navbar, AppView } from './components/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { NotesTransformerWorkspace } from './components/workspaces/NotesTransformerWorkspace';
import { FlashcardsWorkspace } from './components/workspaces/FlashcardsWorkspace';
import { AITutorWorkspace } from './components/workspaces/AITutorWorkspace';
import { DashboardWorkspace } from './components/workspaces/DashboardWorkspace';
import { ResumeBuilderWorkspace } from './components/workspaces/ResumeBuilderWorkspace';
import { ResumeAnalyzerWorkspace } from './components/workspaces/ResumeAnalyzerWorkspace';
import { GlobalFloatingTutor } from './components/common/GlobalFloatingTutor';
import { PrivacyModal } from './components/common/PrivacyModal';
import { DeleteDataModal } from './components/common/DeleteDataModal';
import { AuthModal } from './components/auth/AuthModal';
import { supabase } from './lib/supabase';
import { fetchUserProfile, checkServerHealth } from './services/api';
import { UserProfile, TutorContextShare } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('landing');

  // Supabase Auth State
  const [authUser, setAuthUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  // Real Mode vs Demo Mode state (default to Demo Mode so initial exploration works immediately without API key)
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [, setHasApiKey] = useState(false);
  const [tutorInitialTopic, setTutorInitialTopic] = useState('Classical Dynamics & Newton’s Laws');
  const [sharedTutorContext, setSharedTutorContext] = useState<TutorContextShare | null>(null);

  // Theme support (light / dark)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('studysnap_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('studysnap_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Modals
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isDeleteDataModalOpen, setIsDeleteDataModalOpen] = useState(false);

  // User state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'guest',
    name: 'Student Learner',
    email: 'guest@studysnap.ai',
    level: 2,
    xp: 350,
    streak: 3,
    dailyGoal: 3,
    dailyProgress: 2,
  });

  // Supabase Auth State Listener
  useEffect(() => {
    // 1. Get initial active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthUser(session.user);
        setUserProfile((prev) => ({
          ...prev,
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Student Learner',
          email: session.user.email || 'guest@studysnap.ai',
        }));
      }
    });

    // 2. Listen to ongoing auth events (login, signup, logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthUser(session.user);
        setUserProfile((prev) => ({
          ...prev,
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Student Learner',
          email: session.user.email || 'guest@studysnap.ai',
        }));
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAuthUser(null);
    setUserProfile((prev) => ({
      ...prev,
      id: 'guest',
      name: 'Student Learner',
      email: 'guest@studysnap.ai',
    }));
  };

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  useEffect(() => {
    // Initial health check to see if Gemini API key is configured
    checkServerHealth().then((health) => {
      setHasApiKey(health.hasApiKey);
      if (health.hasApiKey) {
        setIsDemoMode(false); // Auto-enable real AI mode if key is present
      }
    });

    // Fetch user profile
    fetchUserProfile().then((profile) => {
      if (profile) setUserProfile(profile);
    });
  }, []);

  const handleOpenTutorWithTopic = (topic: string) => {
    setTutorInitialTopic(topic);
    setActiveView('tutor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskTutorAboutCard = (prompt: string) => {
    setSharedTutorContext({
      source: 'quiz',
      title: 'Flashcard Concept',
      text: prompt,
    });
  };

  const handleDataDeleted = () => {
    setUserProfile({
      id: 'guest',
      name: 'Student Learner',
      email: 'guest@studysnap.ai',
      level: 1,
      xp: 0,
      streak: 0,
      dailyGoal: 3,
      dailyProgress: 0,
    });
    setActiveView('landing');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-[#1E293B] dark:text-slate-100 font-['Inter',sans-serif] flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Top Global Navigation Bar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
        userStreak={userProfile.streak}
        userXp={userProfile.xp}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenDeleteDataModal={() => setIsDeleteDataModalOpen(true)}
        authUser={authUser}
        onOpenAuthModal={handleOpenAuth}
        onSignOut={handleSignOut}
      />

      {/* Main Workspace View Router */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <LandingPage
            onNavigate={(view) => {
              setActiveView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExploreDemo={() => {
              setIsDemoMode(true);
              setActiveView('transformer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
            onOpenDeleteDataModal={() => setIsDeleteDataModalOpen(true)}
            authUser={authUser}
            onOpenAuthModal={handleOpenAuth}
          />
        )}

        {activeView === 'transformer' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
            <NotesTransformerWorkspace
              isDemoMode={isDemoMode}
              onOpenTutorWithTopic={handleOpenTutorWithTopic}
              onShareContextWithTutor={(ctx) => setSharedTutorContext(ctx)}
            />
          </div>
        )}

        {activeView === 'flashcards' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
            <FlashcardsWorkspace
              isDemoMode={isDemoMode}
              onAskTutorAboutCard={handleAskTutorAboutCard}
            />
          </div>
        )}

        {activeView === 'tutor' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
            <AITutorWorkspace
              isDemoMode={isDemoMode}
              initialTopic={tutorInitialTopic}
            />
          </div>
        )}

        {activeView === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
            <DashboardWorkspace
              isDemoMode={isDemoMode}
              onNavigate={(view) => {
                setActiveView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {activeView === 'resume-builder' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
            <ResumeBuilderWorkspace isDemoMode={isDemoMode} />
          </div>
        )}

        {activeView === 'resume-analyzer' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
            <ResumeAnalyzerWorkspace
              isDemoMode={isDemoMode}
              onOpenBuilderWithData={() => setActiveView('resume-builder')}
            />
          </div>
        )}
      </main>

      {/* Global Floating Mascot AI Tutor (Accessible everywhere) */}
      <GlobalFloatingTutor
        isDemoMode={isDemoMode}
        sharedContext={sharedTutorContext}
        onClearSharedContext={() => setSharedTutorContext(null)}
      />

      {/* Privacy Disclosures Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        onOpenDeleteDataModal={() => setIsDeleteDataModalOpen(true)}
      />

      {/* GDPR Data Purge Confirmation Modal */}
      <DeleteDataModal
        isOpen={isDeleteDataModalOpen}
        onClose={() => setIsDeleteDataModalOpen(false)}
        onDeleted={handleDataDeleted}
      />

      {/* Supabase Authentication Modal (Sign In / Register / Password Reset) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthSuccess={(user) => {
          setAuthUser(user);
        }}
      />
    </div>
  );
}
