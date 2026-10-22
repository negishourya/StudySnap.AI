import React from 'react';
import { ShieldCheck, X, Trash2, CheckCircle2 } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDeleteDataModal: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  onOpenDeleteDataModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Privacy & Data Policy</h3>
              <p className="text-[11px] text-slate-500">Transparent disclosures of what is stored and why</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
          <div>
            <h4 className="font-bold text-slate-900 mb-1">1. What We Store</h4>
            <p>
              When using StudySnap AI in guest mode, your learning streak, XP, completed tutor levels, and resume drafts are kept in your browser's local storage. On the server side, an in-memory session maintains active context during your browser session.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1">2. Document Processing</h4>
            <p>
              When you upload TXT, PDF, or DOCX documents, the text is extracted locally in your browser and checked for size (under 10 MB and 20,000 characters). Full raw document files are <strong>never permanently archived or stored</strong> on our backend disks.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1">3. AI Interaction</h4>
            <p>
              Prompts sent to Google Gemini models are handled exclusively via secure server-side proxy routes. Your notes and resumes are processed solely to produce your study outputs and are not used to retrain public models.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1">4. Right to Deletion</h4>
            <p>
              You have complete control over your session records. You can permanently wipe all saved local notes, quiz attempts, and tutor logs at any time using the button below.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenDeleteDataModal();
            }}
            className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold underline"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Wipe All My Learning Records</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
