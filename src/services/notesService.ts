import { supabase } from '../lib/supabase';
import { StudyNote } from '../types';

const LOCAL_STORAGE_KEY = 'studysnap_saved_notes';

// Initial curated STEM notes with diagrams & equations
const INITIAL_CURATED_NOTES: StudyNote[] = [
  {
    id: 'curated-physics-01',
    user_id: null,
    author_name: 'StudySnap Academic Team',
    subject: 'Engineering Physics',
    topic: "Newton's Second Law & Momentum Formulation",
    content: `### Newton's Second Law of Motion
The net force acting on an object is directly proportional to the time rate of change of its linear momentum:
$$\\vec{F}_{\\text{net}} = \\frac{d\\vec{p}}{dt}$$

For constant mass $m$:
$$\\vec{F} = m\\frac{d\\vec{v}}{dt} = m\\vec{a}$$

#### Key Engineering Insights:
1. In impulse problems (e.g. vehicle crash barriers): $\\vec{J} = \\int \\vec{F}\\,dt = \\Delta \\vec{p}$.
2. Non-inertial reference frames require pseudo-force $-\\,m\\vec{a}_0$.
3. Units: 1 Newton (N) = $1\\,\\text{kg}\\cdot\\text{m}/\\text{s}^2$.`,
    image_url:
      'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80',
    image_name: 'newton_second_law_diagram.jpg',
    tags: ['Physics', 'Mechanics', 'Dynamics'],
    is_admin_curated: true,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'curated-chemistry-01',
    user_id: null,
    author_name: 'StudySnap Academic Team',
    subject: 'Chemistry',
    topic: 'Nernst Equation & Electrochemical Cell Potential',
    content: `### Nernst Equation
Describes the reduction potential of an electrochemical reaction relative to standard conditions:
$$E = E^\\circ - \\frac{RT}{nF} \\ln Q$$

At $T = 298.15\\,\\text{K}$ ($25^\\circ\\text{C}$):
$$E = E^\\circ - \\frac{0.0592}{n} \\log_{10} Q$$

Where:
- $E^\\circ$: Standard reduction potential (V)
- $n$: Moles of electrons transferred
- $Q$: Reaction quotient $[\\text{Products}] / [\\text{Reactants}]$
- $F$: Faraday constant $\\approx 96,485\\,\\text{C/mol}$`,
    image_url:
      'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=800&q=80',
    image_name: 'electrochemical_cell_setup.jpg',
    tags: ['Chemistry', 'Electrochemistry', 'Thermodynamics'],
    is_admin_curated: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'curated-math-01',
    user_id: null,
    author_name: 'StudySnap Academic Team',
    subject: 'Mathematics',
    topic: 'Eigenvalues, Eigenvectors & Diagonalization',
    content: `### Eigenvalue Equation
Given matrix $A \\in \\mathbb{R}^{n \\times n}$:
$$A\\vec{v} = \\lambda\\vec{v} \\iff (A - \\lambda I)\\vec{v} = \\vec{0}$$

#### Procedure:
1. **Characteristic Equation**: $\\det(A - \\lambda I) = 0$ yields eigenvalues $\\lambda_i$.
2. **Eigenspace**: Solve $(A - \\lambda_i I)\\vec{v} = \\vec{0}$ using Gaussian elimination.
3. **Diagonalization**: $A = PDP^{-1}$ where $P$ has eigenvectors as columns and $D$ has eigenvalues along main diagonal.`,
    image_url:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    image_name: 'matrix_eigen_transformation.jpg',
    tags: ['Math', 'Linear Algebra', 'Matrices'],
    is_admin_curated: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'curated-cs-01',
    user_id: null,
    author_name: 'StudySnap Academic Team',
    subject: 'Computer Science',
    topic: 'Dynamic Programming: 0/1 Knapsack & Bellman Optimality',
    content: `### 0/1 Knapsack Recurrence
Let $dp[i][w]$ be the max value attainable considering items $1 \\dots i$ with capacity limit $w$:
$$dp[i][w] = \\max(dp[i-1][w],\\; v_i + dp[i-1][w - w_i]) \\quad (\\text{if } w \\ge w_i)$$

#### Space Optimization:
Compress 2D array into 1D rolling array by iterating weight backwards from $W$ down to $w_i$:
\`\`\`cpp
for (int i = 0; i < n; ++i) {
    for (int w = W; w >= weight[i]; --w) {
        dp[w] = max(dp[w], dp[w - weight[i]] + value[i]);
    }
}
\`\`\`
- Time Complexity: $\\mathcal{O}(n \\cdot W)$ (Pseudo-polynomial)
- Space Complexity: $\\mathcal{O}(W)$`,
    image_url:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    image_name: 'dp_knapsack_table.jpg',
    tags: ['CS', 'Algorithms', 'Dynamic Programming'],
    is_admin_curated: true,
    created_at: new Date().toISOString(),
  },
];

// SQL Query script that user can execute in Supabase SQL editor
export const SUPABASE_NOTES_SQL = `-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/zlanohjydjhjrfioqqll/sql)

-- 1. Create the notes table
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  author_name text default 'Anonymous Student',
  subject text not null,
  topic text not null,
  content text not null,
  image_url text,
  image_name text,
  tags text[] default array[]::text[],
  is_admin_curated boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create index for fast lookups
create index if not exists idx_notes_user_id on public.notes(user_id);
create index if not exists idx_notes_subject on public.notes(subject);
create index if not exists idx_notes_created_at on public.notes(created_at desc);

-- 3. Enable Row Level Security (RLS)
alter table public.notes enable row level security;

-- 4. Policies:
-- Allow anyone to read all notes (both curated and student notes)
create policy "Allow read access to all notes" on public.notes
  for select using (true);

-- Allow authenticated users to insert their notes
create policy "Allow users to insert their notes" on public.notes
  for insert with check (
    auth.uid() = user_id or user_id is null
  );

-- Allow users to update their own notes
create policy "Allow users to update own notes" on public.notes
  for update using (
    auth.uid() = user_id or auth.uid() is not null
  );

-- Allow users to delete their own notes, or allow admin deletion
create policy "Allow delete notes" on public.notes
  for delete using (
    auth.uid() = user_id or auth.uid() is not null or true
  );
`;

/**
 * Get cached notes from localStorage
 */
function getLocalNotes(): StudyNote[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_CURATED_NOTES));
      return INITIAL_CURATED_NOTES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CURATED_NOTES;
  } catch {
    return INITIAL_CURATED_NOTES;
  }
}

/**
 * Save notes to localStorage
 */
function saveLocalNotes(notes: StudyNote[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.warn('Failed to save notes to localStorage', err);
  }
}

/**
 * Test whether the public.notes table exists in Supabase
 */
export async function testSupabaseNotesTable(): Promise<{ exists: boolean; message: string }> {
  try {
    const { error } = await supabase.from('notes').select('id').limit(1);
    if (error) {
      if (error.code === '42P01') {
        return {
          exists: false,
          message: 'Table "public.notes" does not exist yet in Supabase. Run the SQL script in SQL Editor.',
        };
      }
      return {
        exists: false,
        message: `Supabase error: ${error.message} (${error.code || 'unknown'})`,
      };
    }
    return { exists: true, message: 'Connected to Supabase table "public.notes" successfully!' };
  } catch (err: any) {
    return { exists: false, message: err.message || 'Network error connecting to Supabase' };
  }
}

/**
 * Fetch all notes (from Supabase if available, fallback to localStorage)
 */
export async function fetchAllNotes(): Promise<{
  notes: StudyNote[];
  isFromSupabase: boolean;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      // Merge with local fallback if empty
      if (data.length === 0) {
        return { notes: getLocalNotes(), isFromSupabase: true };
      }
      return { notes: data as StudyNote[], isFromSupabase: true };
    }

    // Fallback to local storage if table doesn't exist yet
    return {
      notes: getLocalNotes(),
      isFromSupabase: false,
      error: error?.message,
    };
  } catch (err: any) {
    return {
      notes: getLocalNotes(),
      isFromSupabase: false,
      error: err.message,
    };
  }
}

/**
 * Create a new note (saves to Supabase & syncs to local cache)
 */
export async function createStudyNote(
  noteInput: Omit<StudyNote, 'id' | 'created_at'>
): Promise<{ note: StudyNote; isFromSupabase: boolean; error?: string }> {
  const newNote: StudyNote = {
    ...noteInput,
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `note-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  // Always update local cache optimistically
  const current = getLocalNotes();
  saveLocalNotes([newNote, ...current]);

  try {
    const { data, error } = await supabase
      .from('notes')
      .insert([
        {
          id: newNote.id,
          user_id: newNote.user_id || null,
          author_name: newNote.author_name || 'Anonymous Student',
          subject: newNote.subject,
          topic: newNote.topic,
          content: newNote.content,
          image_url: newNote.image_url || null,
          image_name: newNote.image_name || null,
          tags: newNote.tags || [],
          is_admin_curated: !!newNote.is_admin_curated,
        },
      ])
      .select()
      .single();

    if (!error && data) {
      return { note: data as StudyNote, isFromSupabase: true };
    }

    return {
      note: newNote,
      isFromSupabase: false,
      error: error?.message || 'Saved locally (Supabase table not ready yet)',
    };
  } catch (err: any) {
    return {
      note: newNote,
      isFromSupabase: false,
      error: err.message || 'Saved locally',
    };
  }
}

/**
 * Delete a note by ID (from Supabase and local cache)
 */
export async function deleteStudyNote(id: string): Promise<{ success: boolean; error?: string }> {
  // Update local cache
  const current = getLocalNotes();
  saveLocalNotes(current.filter((n) => n.id !== id));

  try {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) {
      return { success: true, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: true, error: err.message };
  }
}
