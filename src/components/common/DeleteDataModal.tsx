import React, { useState } from 'react';
import { Trash2, AlertTriangle, X, Check } from 'lucide-react';
import { deleteUserData } from '../../services/api';

interface DeleteDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

export const DeleteDataModal: React.FC<DeleteDataModalProps> = ({ isOpen, onClose, onDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteUserData();
    localStorage.removeItem('studysnap_saved_notes');
    localStorage.removeItem('studysnap_quiz_history');
    localStorage.removeItem('studysnap_tutor_history');
    localStorage.removeItem('studysnap_resume_draft');
    setIsDeleting(false);
    onDeleted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900">Delete All My Learning Records?</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            This permanently purges your saved notes, quiz attempts, tutor conversation logs, and resume drafts from both this browser and the server session. This action cannot be undone.
          </p>
        </div>

        <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="w-4 h-4 text-rose-600 rounded-sm border-slate-300 focus:ring-rose-500"
          />
          <span className="text-xs font-medium text-slate-700">
            Yes, I understand and wish to permanently wipe all stored session data.
          </span>
        </label>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            disabled={!confirmed || isDeleting}
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isDeleting ? 'Deleting...' : 'Delete My Data'}
          </button>
        </div>
      </div>
    </div>
  );
};
