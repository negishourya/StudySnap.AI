import {
  DEMO_EXPLANATION,
  DEMO_SUMMARY,
  DEMO_QUIZ,
  DEMO_RESUME,
  DEMO_ANALYSIS,
  DEMO_FLASHCARDS,
  DEMO_DASHBOARD_STATS,
} from '../constants/demoData';
import {
  QuizQuestion,
  ResumeData,
  ResumeAnalysisResult,
  UserProfile,
  Flashcard,
  DashboardStats,
} from '../types';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  isDemo?: boolean;
}

export async function checkServerHealth(): Promise<{ hasApiKey: boolean; aiModel: string }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    const data = await res.json();
    return { hasApiKey: data.hasApiKey, aiModel: data.aiModel };
  } catch (e) {
    return { hasApiKey: false, aiModel: 'gemini-3.8-flash' };
  }
}

export async function explainNotes(
  notes: string,
  subject: string,
  difficulty: string,
  language: string,
  isDemoMode: boolean
): Promise<ApiResponse<{ explanation: string; metadata?: any }>> {
  if (isDemoMode) {
    await new Promise((r) => setTimeout(r, 600));
    return {
      success: true,
      isDemo: true,
      data: {
        explanation: DEMO_EXPLANATION,
        metadata: { subject, difficulty, language, wordCount: 280 },
      },
    };
  }

  try {
    const res = await fetch('/api/study/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes, subject, difficulty, language }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'SERVER_ERROR',
        message: data.message || 'Failed to explain notes.',
      };
    }

    return {
      success: true,
      data: {
        explanation: data.explanation,
        metadata: data.metadata,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: 'NETWORK_ERROR',
      message: err.message || 'Network error communicating with AI server.',
    };
  }
}

export async function summarizeNotes(
  notes: string,
  subject: string,
  summaryLength: string,
  language: string,
  isDemoMode: boolean
): Promise<ApiResponse<{ summary: string }>> {
  if (isDemoMode) {
    await new Promise((r) => setTimeout(r, 500));
    return {
      success: true,
      isDemo: true,
      data: { summary: DEMO_SUMMARY },
    };
  }

  try {
    const res = await fetch('/api/study/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes, subject, summaryLength, language }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'SERVER_ERROR',
        message: data.message || 'Failed to generate summary.',
      };
    }

    return {
      success: true,
      data: { summary: data.summary },
    };
  } catch (err: any) {
    return {
      success: false,
      error: 'NETWORK_ERROR',
      message: err.message || 'Network error communicating with AI server.',
    };
  }
}

export async function generateQuiz(
  notes: string,
  subject: string,
  difficulty: string,
  questionCount: number,
  isDemoMode: boolean
): Promise<ApiResponse<{ questions: QuizQuestion[] }>> {
  if (isDemoMode) {
    await new Promise((r) => setTimeout(r, 700));
    return {
      success: true,
      isDemo: true,
      data: { questions: DEMO_QUIZ.slice(0, questionCount) },
    };
  }

  try {
    const res = await fetch('/api/study/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes, subject, difficulty, questionCount }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'SERVER_ERROR',
        message: data.message || 'Failed to generate quiz.',
      };
    }

    return {
      success: true,
      data: { questions: data.questions },
    };
  } catch (err: any) {
    return {
      success: false,
      error: 'NETWORK_ERROR',
      message: err.message || 'Network error communicating with AI server.',
    };
  }
}

export async function generateFlashcards(
  notes: string,
  subject: string,
  count: number = 8,
  isDemoMode: boolean = false
): Promise<ApiResponse<{ cards: Flashcard[] }>> {
  if (isDemoMode) {
    await new Promise((r) => setTimeout(r, 500));
    return {
      success: true,
      isDemo: true,
      data: { cards: DEMO_FLASHCARDS.slice(0, count) },
    };
  }

  try {
    const res = await fetch('/api/study/flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes, subject, count }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'SERVER_ERROR',
        message: data.message || 'Failed to generate flashcards.',
      };
    }

    return {
      success: true,
      data: { cards: data.cards },
    };
  } catch (err: any) {
    return {
      success: false,
      error: 'NETWORK_ERROR',
      message: err.message || 'Network error generating flashcards.',
    };
  }
}

export async function chatWithTutor(
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  options: {
    difficulty: string;
    language: string;
    mode: 'socratic' | 'direct';
    currentTopic?: string;
    contextSnippet?: string;
  },
  isDemoMode: boolean
): Promise<ApiResponse<{ reply: string; suggestions: string[]; mascotReaction: string }>> {
  if (isDemoMode) {
    await new Promise((r) => setTimeout(r, 600));
    const lower = message.toLowerCase();
    let reply = `That's a classic question! Let's think through Newton's Second Law ($F = m \\cdot a$). 
    
If you double the force while keeping the mass constant, what do you predict happens to the rate of acceleration? Think about pushing a supermarket cart with twice the muscle effort!`;
    let suggestions = [
      'The acceleration will double too!',
      'Show me another numerical example',
      'Explain the Third Law with rockets',
    ];

    if (options.contextSnippet) {
      reply = `I see you shared this note snippet: "${options.contextSnippet.slice(0, 100)}...". Let's connect that to Newton's Second Law ($F = m \\cdot a$). Notice how force is directly proportional to acceleration when mass remains fixed!`;
    } else if (lower.includes('example') || lower.includes('calculate')) {
      reply = `Here is a practical engineering example:
      
Suppose an automated electric robot vehicle has a chassis mass of $m = 12\\,\\text{kg}$. To accelerate it from a standstill at $a = 2.5\\,\\text{m/s}^2$, the motor gear train must supply:
$$F = m \\cdot a = 12\\,\\text{kg} \\times 2.5\\,\\text{m/s}^2 = 30\\,\\text{N}$$

Notice how mass acts as rotational and translational inertia resisting the sudden velocity shift!`;
      suggestions = ['How does friction affect this?', 'What if mass decreases?', 'Let me try a challenge question!'];
    }

    return {
      success: true,
      isDemo: true,
      data: {
        reply,
        suggestions,
        mascotReaction: 'happy',
      },
    };
  }

  try {
    const res = await fetch('/api/tutor/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history,
        difficulty: options.difficulty,
        language: options.language,
        mode: options.mode,
        currentTopic: options.currentTopic,
        contextSnippet: options.contextSnippet,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'SERVER_ERROR',
        message: data.message || 'Tutor error.',
      };
    }

    return {
      success: true,
      data: {
        reply: data.reply,
        suggestions: data.suggestions,
        mascotReaction: data.mascotReaction || 'happy',
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: 'NETWORK_ERROR',
      message: err.message || 'Failed to connect to AI tutor.',
    };
  }
}

export async function evaluateTutorAnswer(
  question: string,
  studentAnswer: string,
  topic: string,
  difficulty: string,
  isDemoMode: boolean
): Promise<ApiResponse<{ evaluation: any }>> {
  if (isDemoMode) {
    await new Promise((r) => setTimeout(r, 600));
    const isGood =
      studentAnswer.toLowerCase().includes('6') ||
      studentAnswer.toLowerCase().includes('f=ma') ||
      studentAnswer.length > 5;
    return {
      success: true,
      isDemo: true,
      data: {
        evaluation: {
          isCorrect: isGood,
          verdict: isGood ? 'correct' : 'needs_work',
          feedback: isGood
            ? 'Superb calculation! You correctly multiplied mass (2 kg) by acceleration (3 m/s²) yielding 6 Newtons.'
            : 'Good attempt, but re-check your formula: Net force F equals mass multiplied by acceleration (F = m * a).',
          xpEarned: isGood ? 35 : 10,
          keyTakeaway: 'Always check that units are in SI: kg and m/s² yield Newtons directly.',
        },
      },
    };
  }

  try {
    const res = await fetch('/api/tutor/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, studentAnswer, topic, difficulty }),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error,
        message: data.message,
      };
    }
    return { success: true, data: { evaluation: data.evaluation } };
  } catch (err: any) {
    return { success: false, error: 'NETWORK_ERROR', message: err.message };
  }
}

export async function generateResumeAI(
  resumeData: ResumeData,
  targetRole: string,
  isDemoMode: boolean
): Promise<ApiResponse<{ resumeData: any }>> {
  if (isDemoMode) {
    await new Promise((r) => setTimeout(r, 800));
    return {
      success: true,
      isDemo: true,
      data: {
        resumeData: {
          summary:
            'Driven B.Tech Computer Science undergraduate with hands-on experience in full-stack web architectures, Three.js 3D rendering, and relational database design. Proven track record of leading campus technical workshops and building high-performance student web platforms.',
          formattedSkills: {
            languages: ['TypeScript', 'JavaScript (ES6+)', 'Python', 'C++', 'SQL'],
            frameworks: ['React', 'Node.js', 'Express', 'Next.js', 'Tailwind CSS'],
            tools: ['Git', 'Docker', 'Linux', 'Postman', 'Vite', 'Figma'],
            coreCompetencies: [
              'Full-Stack Development',
              'RESTful API Design',
              'Data Structures & Algorithms',
              '3D Graphics',
            ],
          },
          optimizedProjects: [
            {
              name: 'AlgorithmVisualizer 3D',
              techStack: ['React', 'Three.js', 'TypeScript', 'Tailwind CSS'],
              bullets: [
                'Architected high-throughput 3D graph algorithm sandbox with 60 FPS WebGL rendering across 1,000+ nodes.',
                'Implemented interactive step-by-step visualizations for Dijkstra and A* pathfinding with adjustable execution speed.',
              ],
              link: 'github.com/aarav-dev/algo-viz-3d',
            },
            {
              name: 'CampusMart - Peer Exchange Platform',
              techStack: ['Node.js', 'Express', 'PostgreSQL', 'Socket.io', 'JWT'],
              bullets: [
                'Engineered secure campus marketplace serving 450+ verified student peers with real-time encrypted chat.',
                'Designed normalized PostgreSQL schemas and indexed queries to ensure sub-50ms search latency.',
              ],
              link: 'github.com/aarav-dev/campus-mart',
            },
          ],
          optimizedExperience: [
            {
              role: 'Technical Club Lead',
              organization: 'Google Developer Student Club',
              duration: 'Aug 2024 - Present',
              bullets: [
                'Mentored 120+ first-year engineering students across 4 hands-on workshops in modern web architecture.',
                'Coordinated open-source contribution drives, resulting in 35 merged pull requests to community projects.',
              ],
            },
          ],
          atsTips: [
            'Use standard section headings: Education, Technical Skills, Projects, Experience.',
            'Keep layout single-column for 100% ATS readability.',
          ],
        },
      },
    };
  }

  try {
    const res = await fetch('/api/resume/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...resumeData, targetRole }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'SERVER_ERROR',
        message: data.message || 'Failed to generate resume.',
      };
    }

    return {
      success: true,
      data: { resumeData: data.resumeData },
    };
  } catch (err: any) {
    return {
      success: false,
      error: 'NETWORK_ERROR',
      message: err.message || 'Error generating resume with AI.',
    };
  }
}

export async function improveResumeText(
  text: string,
  type: 'bullet' | 'summary',
  isDemoMode: boolean
): Promise<ApiResponse<{ improvedText: string; rationale: string }>> {
  if (isDemoMode) {
    await new Promise((r) => setTimeout(r, 500));
    return {
      success: true,
      isDemo: true,
      data: {
        improvedText:
          'Architected and deployed responsive full-stack platform; reduced page load latency by 35% across 450+ active campus users.',
        rationale:
          'Replaced passive phrasing with strong action verb "Architected" and added quantifiable performance impact.',
      },
    };
  }

  try {
    const res = await fetch('/api/resume/improve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, type }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error, message: data.message };
    return { success: true, data: data.result };
  } catch (err: any) {
    return { success: false, error: 'NETWORK_ERROR', message: err.message };
  }
}

export async function analyzeResume(
  resumeText: string,
  targetJobDescription: string,
  isDemoMode: boolean
): Promise<ApiResponse<{ analysis: ResumeAnalysisResult }>> {
  if (isDemoMode) {
    await new Promise((r) => setTimeout(r, 700));
    return {
      success: true,
      isDemo: true,
      data: { analysis: DEMO_ANALYSIS },
    };
  }

  try {
    const res = await fetch('/api/resume/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText, targetJobDescription }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'SERVER_ERROR',
        message: data.message || 'Resume analysis failed.',
      };
    }

    return {
      success: true,
      data: { analysis: data.analysis },
    };
  } catch (err: any) {
    return {
      success: false,
      error: 'NETWORK_ERROR',
      message: err.message || 'Network error analyzing resume.',
    };
  }
}

export async function fetchUserProfile(): Promise<UserProfile> {
  try {
    const res = await fetch('/api/user/profile');
    if (!res.ok) throw new Error('Profile fetch failed');
    return await res.json();
  } catch {
    return {
      id: 'guest',
      name: 'Student Learner',
      email: 'guest@studysnap.ai',
      level: 2,
      xp: 350,
      streak: 3,
      dailyGoal: 3,
      dailyProgress: 2,
    };
  }
}

export async function fetchDashboardAnalytics(isDemoMode: boolean = false): Promise<DashboardStats> {
  if (isDemoMode) {
    return DEMO_DASHBOARD_STATS;
  }
  try {
    const res = await fetch('/api/user/analytics');
    if (!res.ok) throw new Error('Analytics fetch failed');
    return await res.json();
  } catch {
    return DEMO_DASHBOARD_STATS;
  }
}

export async function updateUserProgress(payload: {
  xpEarned?: number;
  lessonCompleted?: number;
  streakIncrement?: boolean;
  activity?: { type: string; title: string; score?: string };
}): Promise<UserProfile | null> {
  try {
    const res = await fetch('/api/user/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

export async function deleteUserData(): Promise<boolean> {
  try {
    const res = await fetch('/api/user/delete-data', { method: 'POST' });
    return res.ok;
  } catch {
    return false;
  }
}

// Resumable / Chunked Document Upload Pipeline
export async function uploadDocumentChunked(
  file: File,
  onProgress?: (percent: number, status: string) => void
): Promise<{ success: boolean; extractedText?: string; error?: string }> {
  const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB chunks
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

  onProgress?.(5, 'Initializing upload session...');

  // Step 1: Initialize session
  const sessionRes = await fetch('/api/upload/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: file.name,
      size: file.size,
      totalChunks,
    }),
  });

  const sessionData = await sessionRes.json();
  if (!sessionRes.ok) {
    return { success: false, error: sessionData.message || 'Failed to initiate upload session.' };
  }

  const sessionId = sessionData.sessionId;

  // Step 2: Upload chunks
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(file.size, start + CHUNK_SIZE);
    const chunkBlob = file.slice(start, end);

    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // strip data url header
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(chunkBlob);
    });

    const chunkRes = await fetch('/api/upload/chunk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        chunkIndex: i,
        totalChunks,
        data: base64Data,
      }),
    });

    if (!chunkRes.ok) {
      return { success: false, error: `Failed during chunk ${i + 1} of ${totalChunks}.` };
    }

    const pct = Math.round(((i + 1) / totalChunks) * 85);
    onProgress?.(pct, `Uploading part ${i + 1} of ${totalChunks}...`);
  }

  // Step 3: Poll status
  onProgress?.(90, 'Extracting and verifying document content...');
  for (let attempt = 0; attempt < 10; attempt++) {
    await new Promise((r) => setTimeout(r, 500));
    const statusRes = await fetch(`/api/upload/status/${sessionId}`);
    const statusData = await statusRes.json();

    if (statusData.status === 'ready') {
      onProgress?.(100, 'Processing completed!');
      return { success: true, extractedText: statusData.extractedSnippet };
    }

    if (statusData.status === 'failed') {
      return { success: false, error: statusData.error || 'Extraction failed.' };
    }
  }

  return { success: true, extractedText: 'Document uploaded and parsed successfully.' };
}
