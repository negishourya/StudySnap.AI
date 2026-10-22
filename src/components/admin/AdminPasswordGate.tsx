import React, { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, ArrowRight, ShieldAlert, ArrowLeft } from 'lucide-react';

interface AdminPasswordGateProps {
  onUnlock: () => void;
  onCancel: () => void;
}

export const AdminPasswordGate: React.FC<AdminPasswordGateProps> = ({ onUnlock, onCancel }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') {
      setError(null);
      sessionStorage.setItem('studysnap_admin_authenticated', 'true');
      onUnlock();
    } else {
      setError('Incorrect admin password. (Hint: The configured password is 1234)');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Admin Verification</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter the administrative security PIN to manage platform notes and Supabase data.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2 animate-in shake">
            <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Enter password..."
                className="w-full text-sm pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden font-mono tracking-wider text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Security PIN required</span>
              <span className="font-semibold text-indigo-500">Default: 1234</span>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Unlock Admin Panel</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Workspace</span>
          </button>
        </form>
      </div>
    </div>
  );
};
