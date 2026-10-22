import React from 'react';
import { Sparkles, Info } from 'lucide-react';

interface DemoBadgeProps {
  variant?: 'inline' | 'banner';
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({ variant = 'inline' }) => {
  if (variant === 'banner') {
    return (
      <div className="bg-amber-500/10 border border-amber-500/30 text-amber-900 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm font-medium">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Demo mode — sample content</strong> (Verified Newton's Laws & F=ma dataset).
          </span>
        </div>
        <span className="text-[11px] text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-200">
          No API Key Required
        </span>
      </div>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-xs">
      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
      <span>Demo mode — sample content</span>
    </span>
  );
};
