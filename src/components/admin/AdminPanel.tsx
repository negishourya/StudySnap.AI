import React, { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  Trash2,
  Database,
  Copy,
  Check,
  Search,
  Filter,
  Image as ImageIcon,
  Upload,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Lock,
  RefreshCw,
  Layers,
  BookOpen,
  Sparkles,
  Move,
  FileCode,
} from 'lucide-react';
import { StudyNote, LearningSubject } from '../../types';
import {
  fetchAllNotes,
  createStudyNote,
  deleteStudyNote,
  testSupabaseNotesTable,
  SUPABASE_NOTES_SQL,
} from '../../services/notesService';
import { DraggableNoteImage } from '../common/DraggableNoteImage';

interface AdminPanelProps {
  onExitAdmin: () => void;
  authUser?: any;
}

const SUBJECT_OPTIONS: LearningSubject[] = [
  'Engineering Physics',
  'Chemistry',
  'Mathematics',
  'Computer Science',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Other',
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ onExitAdmin, authUser }) => {
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFromSupabase, setIsFromSupabase] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<{ exists: boolean; message: string } | null>(
    null
  );
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);

  // Active View Tab in Admin
  const [activeTab, setActiveTab] = useState<'manage' | 'add' | 'sql'>('manage');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  // New Note Form State
  const [newSubject, setNewSubject] = useState<LearningSubject>('Engineering Physics');
  const [newTopic, setNewTopic] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState(authUser?.email || 'StudySnap Admin');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageName, setNewImageName] = useState('note-diagram.png');
  const [isCurated, setIsCurated] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraggingFileIn, setIsDraggingFileIn] = useState(false);

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [sqlCopied, setSqlCopied] = useState(false);

  // Delete modal state
  const [noteToDelete, setNoteToDelete] = useState<StudyNote | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadNotes = async () => {
    setIsLoading(true);
    const result = await fetchAllNotes();
    setNotes(result.notes);
    setIsFromSupabase(result.isFromSupabase);
    setIsLoading(false);
  };

  const checkSupabase = async () => {
    setIsTestingSupabase(true);
    const status = await testSupabaseNotesTable();
    setSupabaseStatus(status);
    setIsTestingSupabase(false);
  };

  useEffect(() => {
    loadNotes();
    checkSupabase();
  }, []);

  // Handle Drag & Drop image file IN to form
  const handleDropImageFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFileIn(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        showToast('error', 'Please drop an image file (PNG, JPG, WebP, SVG).');
        return;
      }
      setNewImageName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setNewImageUrl(reader.result);
          showToast('success', `Attached image: ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setNewImageName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setNewImageUrl(reader.result);
          showToast('success', `Attached image: ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Create Note Submission
  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim() || !newContent.trim()) {
      showToast('error', 'Topic and note content are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createStudyNote({
        subject: newSubject,
        topic: newTopic.trim(),
        content: newContent.trim(),
        author_name: newAuthor.trim() || 'StudySnap Admin',
        user_id: authUser?.id || null,
        image_url: newImageUrl.trim() || null,
        image_name: newImageName.trim() || null,
        tags: [newSubject],
        is_admin_curated: isCurated,
      });

      showToast('success', res.isFromSupabase ? 'Note added & synced to Supabase!' : 'Note saved locally!');
      // Reset form
      setNewTopic('');
      setNewContent('');
      setNewImageUrl('');
      setNewImageName('note-diagram.png');
      setActiveTab('manage');
      loadNotes();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to add note');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Note
  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;
    setIsDeleting(true);
    try {
      await deleteStudyNote(noteToDelete.id);
      showToast('success', `Deleted note: "${noteToDelete.topic}"`);
      setNoteToDelete(null);
      loadNotes();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete note');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_NOTES_SQL);
    setSqlCopied(true);
    showToast('success', 'Copied Supabase SQL query to clipboard!');
    setTimeout(() => setSqlCopied(false), 2000);
  };

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const matchesSubject = selectedSubject === 'All' || note.subject === selectedSubject;
    const matchesQuery =
      searchQuery === '' ||
      note.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.author_name && note.author_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-20 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 border text-xs font-semibold animate-in slide-in-from-top-4 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Banner / Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-amber-400" />
                <span>Super Admin Panel</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-white/80">
                PIN: 1234 Verified
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              StudySnap Notes & Curriculum Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Add and remove study notes across Engineering Physics, Chemistry, Math, and CS. Drag images in
              when creating notes, and drag note images directly out to your desktop or other windows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                sessionStorage.removeItem('studysnap_admin_authenticated');
                onExitAdmin();
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock & Exit Admin</span>
            </button>
          </div>
        </div>

        {/* Live Supabase Connection Bar */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-200">Supabase Database:</span>
            {supabaseStatus?.exists ? (
              <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-md">
                <Check className="w-3 h-3" /> Live (public.notes connected)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400 font-medium bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded-md">
                <AlertCircle className="w-3 h-3" /> Setup Needed (using local fallback)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={checkSupabase}
              disabled={isTestingSupabase}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isTestingSupabase ? 'animate-spin' : ''}`} />
              <span>Test Connection</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sql')}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1 cursor-pointer"
            >
              <FileCode className="w-3 h-3" />
              <span>View SQL Setup Queries</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'manage'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Manage Notes ({notes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'add'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Note</span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'sql'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase SQL Guide</span>
          </button>
        </div>

        <button
          onClick={loadNotes}
          disabled={isLoading}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          title="Refresh notes list"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: MANAGE & REMOVE NOTES */}
      {/* ============================================================== */}
      {activeTab === 'manage' && (
        <div className="space-y-6">
          {/* Search & Subject Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes by topic, keyword, or author..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setSelectedSubject('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  selectedSubject === 'All'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                All Subjects
              </button>
              {SUBJECT_OPTIONS.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                    selectedSubject === sub
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Notes Grid */}
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 mx-auto border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-500">Loading notes from database...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
              <BookOpen className="w-10 h-10 mx-auto text-slate-400" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No notes found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No notes match your current search criteria. Click &quot;Add New Note&quot; above to create one.
              </p>
              <button
                onClick={() => setActiveTab('add')}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
              >
                Add Your First Note
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group relative"
                >
                  <div className="space-y-3">
                    {/* Header Tags & Delete button */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          {note.subject}
                        </span>
                        {note.is_admin_curated && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                            Curated
                          </span>
                        )}
                      </div>

                      {/* Remove Note Trigger Button */}
                      <button
                        onClick={() => setNoteToDelete(note)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                        title="Remove this note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Note Topic Title */}
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {note.topic}
                    </h3>

                    {/* Draggable Note Image (if present) */}
                    {note.image_url && (
                      <div className="space-y-1">
                        <div className="h-44 w-full">
                          <DraggableNoteImage
                            imageUrl={note.image_url}
                            imageName={note.image_name || `${note.topic}.png`}
                            altText={note.topic}
                            className="h-full w-full"
                          />
                        </div>
                      </div>
                    )}

                    {/* Content snippet */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-4 leading-relaxed font-sans whitespace-pre-line">
                      {note.content.replace(/###/g, '').replace(/\$\$/g, '')}
                    </p>
                  </div>

                  {/* Footer metadata & actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-[150px]">By {note.author_name || 'Admin'}</span>
                    <button
                      onClick={() => setNoteToDelete(note)}
                      className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: ADD NEW NOTE (WITH DRAG IN & DRAG OUT IMAGE) */}
      {/* ============================================================== */}
      {activeTab === 'add' && (
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create & Publish Note</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Publish educational study material with text, mathematical formulas, and draggable images.
            </p>
          </div>

          <form onSubmit={handleCreateNote} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Area
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value as LearningSubject)}
                  className="w-full text-xs sm:text-sm px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden font-sans text-slate-900 dark:text-white"
                >
                  {SUBJECT_OPTIONS.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Author / Contributor
                </label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g. Faculty Instructor or Admin"
                  className="w-full text-xs sm:text-sm px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden font-sans text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Topic / Concept Title *
              </label>
              <input
                type="text"
                required
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="e.g. Carnot Cycle & Second Law of Thermodynamics"
                className="w-full text-xs sm:text-sm px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden font-sans text-slate-900 dark:text-white"
              />
            </div>

            {/* Note Content / Markdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Note Content & Formulations *
              </label>
              <textarea
                required
                rows={7}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder={`### Key Equations & Theory\nState principles, derivations, and mathematical equations.\nUse LaTeX like $$F = m \\cdot a$$ or code snippets for algorithms.`}
                className="w-full text-xs sm:text-sm p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden font-mono text-slate-900 dark:text-white resize-y"
              />
            </div>

            {/* Image Attachment (Drag IN & Preview Drag OUT) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Attach Diagram / Chart (Drag & Drop In and Out)</span>
                </label>
                {newImageUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setNewImageUrl('');
                      setNewImageName('note-diagram.png');
                    }}
                    className="text-[11px] text-rose-500 hover:underline cursor-pointer"
                  >
                    Remove image
                  </button>
                )}
              </div>

              {!newImageUrl ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingFileIn(true);
                  }}
                  onDragLeave={() => setIsDraggingFileIn(false)}
                  onDrop={handleDropImageFile}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                    isDraggingFileIn
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 scale-[1.01]'
                      : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/50'
                  }`}
                >
                  <div className="max-w-xs mx-auto space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Drag & Drop an image file here
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Supports PNG, JPG, WebP, SVG diagram files
                    </p>
                    <div className="pt-2">
                      <label className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer shadow-xs inline-block">
                        <span>Browse Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileInputChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="h-56 w-full max-w-md mx-auto">
                    <DraggableNoteImage
                      imageUrl={newImageUrl}
                      imageName={newImageName}
                      altText={newTopic || 'Attached diagram'}
                      className="h-full w-full"
                    />
                  </div>
                  <p className="text-center text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ Image attached: &quot;{newImageName}&quot; (Try dragging it out to your desktop right now!)
                  </p>
                </div>
              )}

              {/* URL fallback input */}
              <div className="pt-1">
                <input
                  type="url"
                  value={newImageUrl.startsWith('data:') ? '' : newImageUrl}
                  onChange={(e) => {
                    setNewImageUrl(e.target.value);
                    setNewImageName('web-image.jpg');
                  }}
                  placeholder="Or paste an image web URL (e.g. https://...)"
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-hidden focus:ring-1 focus:ring-indigo-500 font-sans text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Curated Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isCurated"
                checked={isCurated}
                onChange={(e) => setIsCurated(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded-sm focus:ring-indigo-500"
              />
              <label htmlFor="isCurated" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Mark as Official Curated Note (Featured in student catalog)
              </label>
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('manage')}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Publish Note</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: SUPABASE SQL QUERY RUNNER GUIDE */}
      {/* ============================================================== */}
      {activeTab === 'sql' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Supabase Setup &amp; SQL Queries
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Run these queries in your Supabase SQL Editor to enable full database persistence for notes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {sqlCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{sqlCopied ? 'Copied!' : 'Copy SQL Queries'}</span>
                </button>

                <a
                  href="https://supabase.com/dashboard/project/zlanohjydjhjrfioqqll/sql"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                >
                  <span>Open Supabase SQL Editor</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 3 Step Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 space-y-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  1
                </span>
                <p className="font-bold text-slate-900 dark:text-white">Open SQL Editor</p>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  Go to your Supabase project dashboard and click on <strong>SQL Editor</strong> on the left.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 space-y-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  2
                </span>
                <p className="font-bold text-slate-900 dark:text-white">Paste SQL Script</p>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  Click the <strong>Copy SQL Queries</strong> button above and paste into a new query tab.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 space-y-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  3
                </span>
                <p className="font-bold text-slate-900 dark:text-white">Click &quot;Run&quot;</p>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  Hit <strong>Run</strong> in Supabase. Return here and click <strong>Test Connection</strong>.
                </p>
              </div>
            </div>

            {/* Code Block */}
            <div className="relative rounded-2xl bg-slate-950 text-slate-200 p-4 font-mono text-xs overflow-x-auto border border-slate-800">
              <pre>{SUPABASE_NOTES_SQL}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {noteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Remove Study Note?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Are you sure you want to remove &quot;{noteToDelete.topic}&quot;? This will permanently delete
                it from Supabase and the student curriculum.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1 border border-slate-200/60 dark:border-slate-700/60">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Subject: {noteToDelete.subject}
              </p>
              <p className="text-slate-500">ID: {noteToDelete.id}</p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setNoteToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteNote}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md cursor-pointer flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <span>Deleting...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Remove</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
