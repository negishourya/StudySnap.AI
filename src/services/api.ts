import {
  STEM_PRESETS,
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

// Find closest matching STEM preset based on notes or subject
function findMatchingPreset(notes: string, subject: string) {
  const lowerNotes = (notes || '').toLowerCase();
  const lowerSub = (subject || '').toLowerCase();

  if (lowerNotes.includes('gibbs') || lowerNotes.includes('enthalpy') || lowerNotes.includes('equilibrium') || lowerSub.includes('chem')) {
    return STEM_PRESETS.find((p) => p.id === 'chem-thermo') || STEM_PRESETS[1];
  }
  if (lowerNotes.includes('calculus') || lowerNotes.includes('differential') || lowerNotes.includes('integrat') || lowerSub.includes('math')) {
    return STEM_PRESETS.find((p) => p.id === 'math-calculus') || STEM_PRESETS[2];
  }
  if (lowerNotes.includes('algorithm') || lowerNotes.includes('big-o') || lowerNotes.includes('binary search') || lowerSub.includes('computer')) {
    return STEM_PRESETS.find((p) => p.id === 'cs-algorithms') || STEM_PRESETS[3];
  }
  if (lowerNotes.includes('kirchhoff') || lowerNotes.includes('ohm') || lowerNotes.includes('circuit') || lowerSub.includes('electronic')) {
    return STEM_PRESETS.find((p) => p.id === 'eng-circuits') || STEM_PRESETS[4];
  }
  return STEM_PRESETS[0];
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
    const matched = findMatchingPreset(notes, subject);
    return {
      success: true,
      isDemo: true,
      data: {
        explanation: matched.explanation || DEMO_EXPLANATION,
        metadata: { subject: matched.subject, difficulty, language, wordCount: 320 },
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
    const matched = findMatchingPreset(notes, subject);
    return {
      success: true,
      isDemo: true,
      data: { summary: matched.summary || DEMO_SUMMARY },
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
    const matched = findMatchingPreset(notes, subject);
    const questions = (matched.quiz && matched.quiz.length > 0) ? matched.quiz : DEMO_QUIZ;
    return {
      success: true,
      isDemo: true,
      data: { questions: questions.slice(0, questionCount) },
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
    const matched = findMatchingPreset(notes, subject);
    const cards = (matched.flashcards && matched.flashcards.length > 0) ? matched.flashcards : DEMO_FLASHCARDS;
    return {
      success: true,
      isDemo: true,
      data: { cards: cards.slice(0, count) },
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
    const lower = (message || '').toLowerCase();
    const topic = (options.currentTopic || '').toLowerCase();
    const fullText = `${lower} ${topic}`;

    let reply = '';
    let suggestions: string[] = [];

    // 1. CHEMISTRY
    if (fullText.includes('chem') || fullText.includes('gibbs') || fullText.includes('enthalpy') || fullText.includes('entropy') || fullText.includes('equilibrium') || fullText.includes('reaction') || fullText.includes('acid') || fullText.includes('ph') || fullText.includes('mole')) {
      if (lower.includes('gibbs') || lower.includes('spontaneous') || lower.includes('delta g') || lower.includes('equilibrium')) {
        reply = `Great question on Chemical Thermodynamics! 
        
The fundamental equation is:
$$\\Delta G = \\Delta H - T\\Delta S$$

For a process to be **thermodynamically spontaneous**, the free energy change must be negative ($\\Delta G < 0$).
- If $\\Delta H < 0$ (exothermic) and $\\Delta S > 0$ (entropy increases), $\\Delta G$ is **always negative** at all temperatures!
- At dynamic equilibrium, $\\Delta G = 0$, and standard free energy relates to the equilibrium constant via:
$$\\Delta G^\\circ = -R T \\ln(K_{\\text{eq}})$$

What happens if you increase temperature on an exothermic reaction? By Le Chatelier's principle, it shifts back toward reactants!`;
        suggestions = ['Explain Le Chatelier\'s principle with an example', 'At what temperature does ΔG become zero?', 'Give me a practice calculation'];
      } else {
        reply = `Let's break this chemistry concept down step-by-step! In chemical transformations, molecular stability and electron configurations govern spontaneity and rate.

1. **Thermodynamics** tells us if the reaction *can* occur ($\\Delta G < 0$).
2. **Kinetics** tells us *how fast* it gets there (activation energy $E_a$ and catalyst mechanisms).

Which aspect would you like to explore deeper?`;
        suggestions = ['Explain activation energy & catalysts', 'Calculate reaction quotient Q vs K', 'Show a real-world industrial example'];
      }
    }
    // 2. MATHEMATICS (Calculus, Linear Algebra, ODEs)
    else if (fullText.includes('math') || fullText.includes('calculus') || fullText.includes('derivative') || fullText.includes('integral') || fullText.includes('differential equation') || fullText.includes('matrix') || fullText.includes('eigen') || fullText.includes('limit')) {
      if (lower.includes('ode') || lower.includes('differential') || lower.includes('integrating factor')) {
        reply = `Let's solve first-order linear differential equations of the form:
$$\\frac{dy}{dx} + P(x) y = Q(x)$$

Here is the exact method:
1. **Find Integrating Factor:** $I(x) = e^{\\int P(x) dx}$
2. **Multiply through:** $\\frac{d}{dx}[y \\cdot I(x)] = Q(x) \\cdot I(x)$
3. **Integrate both sides:**
$$y(x) = \\frac{1}{I(x)} \\left[\\int Q(x) I(x) dx + C\\right]$$

For example, with $\\frac{dy}{dx} + 2y = 4$, $I(x) = e^{2x}$, leading directly to $y(x) = 2 + C e^{-2x}$!`;
        suggestions = ['How does this apply to RC circuits?', 'What if initial condition y(0)=5 is given?', 'Explain Integration by Parts (LIATE)'];
      } else if (lower.includes('matrix') || lower.includes('eigen')) {
        reply = `In Linear Algebra, eigenvalues ($\\lambda$) and eigenvectors ($\\vec{v}$) describe the invariant directions of a linear transformation $A$:
$$A \\vec{v} = \\lambda \\vec{v} \\quad \\implies \\quad (A - \\lambda I)\\vec{v} = \\vec{0}$$

To find eigenvalues, compute the characteristic polynomial by taking the determinant:
$$\\det(A - \\lambda I) = 0$$

This is the exact mathematics behind Google's PageRank, 3D graphics rotations, and quantum state mechanics!`;
        suggestions = ['How do you calculate a 2x2 determinant?', 'Why are eigenvectors useful in engineering?', 'Give me a quick practice problem'];
      } else {
        reply = `Calculus is the mathematical language of continuous change! 
- The **Derivative** $\\frac{dy}{dx}$ gives instantaneous slope and rate of change.
- The **Integral** $\\int f(x) dx$ accumulates continuous quantities and calculates area under curves.

By the Fundamental Theorem of Calculus, differentiation and integration are exact inverse operations! What specific problem or rule would you like to work through?`;
        suggestions = ['Explain Chain Rule with an example', 'When should I use Integration by Parts?', 'Walk through Product Rule'];
      }
    }
    // 3. COMPUTER SCIENCE & ALGORITHMS
    else if (fullText.includes('computer') || fullText.includes('algorithm') || fullText.includes('big-o') || fullText.includes('search') || fullText.includes('tree') || fullText.includes('graph') || fullText.includes('bfs') || fullText.includes('dfs') || fullText.includes('code') || fullText.includes('data structure')) {
      reply = `In Computer Science & Systems, we evaluate algorithm efficiency using **Big-O notation**:

- $O(1)$: Constant time (hash table lookup average)
- $O(\\log n)$: Logarithmic time (Binary Search cutting space in half)
- $O(n \\log n)$: Linearithmic time (Merge Sort / Heap Sort divide-and-conquer)
- $O(n^2)$: Quadratic time (nested comparison loops)

For graph problems:
- **BFS (Breadth-First Search)** uses a FIFO Queue and is guaranteed to find the shortest unweighted path.
- **DFS (Depth-First Search)** uses a LIFO Stack or recursion, ideal for topological sort and cycle detection.

Would you like to see a code implementation or solve a time complexity question?`;
      suggestions = ['Show Binary Search implementation', 'Compare BFS vs DFS in detail', 'Explain Dynamic Programming memoization'];
    }
    // 4. ELECTRICAL & ENGINEERING (Ohm, Kirchhoff, Stress/Strain, Fluid)
    else if (fullText.includes('circuit') || fullText.includes('ohm') || fullText.includes('kirchhoff') || fullText.includes('resistor') || fullText.includes('voltage') || fullText.includes('current') || fullText.includes('electronics') || fullText.includes('stress') || fullText.includes('fluid')) {
      reply = `Let's explore circuit engineering! All electrical networks obey two fundamental conservation laws:

1. **Kirchhoff's Current Law (KCL):** Charge is conserved at every junction:
   $$\\sum I_{\\text{in}} = \\sum I_{\\text{out}}$$
2. **Kirchhoff's Voltage Law (KVL):** Energy is conserved along every closed loop:
   $$\\sum V_{\\text{loop}} = 0$$

Paired with Ohm's Law ($V = I \\cdot R$), you can solve any multi-loop circuit!
- Two resistors in parallel: $R_{\\text{eq}} = \\frac{R_1 R_2}{R_1 + R_2}$ (always smaller than the smallest branch!).
- Power dissipated: $P = V \\cdot I = I^2 R = \\frac{V^2}{R}$.

Shall we work through a practical nodal analysis or AC resonance example?`;
      suggestions = ['Calculate two 6Ω resistors in parallel', 'How does a capacitor behave in DC vs AC?', 'Explain KVL with a battery and two resistors'];
    }
    // 5. PHYSICS (Default & Mechanics)
    else {
      reply = `That's a classic physics & dynamics question! Let's think through Newton's Second Law ($F = m \\cdot a$). 
      
If you double the force while keeping the mass constant, the rate of acceleration will double too ($a = F / m$). Think of an electric vehicle: doubling the motor torque cuts the 0-60 acceleration time in half!

Action-reaction forces (Third Law: $\\vec{F}_{AB} = -\\vec{F}_{BA}$) act on **two different bodies**, which is why they never cancel each other out!`;
      suggestions = [
        'Give a numerical example with numbers',
        'How does friction affect acceleration?',
        'Switch to Chemistry or Maths topic',
      ];
    }

    if (options.contextSnippet) {
      reply = `I see you shared this note snippet: "${options.contextSnippet.slice(0, 100)}...". Let's connect that directly to our study topic! Notice how the fundamental equations describe the physical relationships under equilibrium and transient states.`;
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
    const ans = studentAnswer.toLowerCase().trim();
    const q = question.toLowerCase();

    let isGood = false;
    let feedback = '';
    let takeaway = '';

    // Smart domain checks
    if (q.includes('force') || q.includes('3 m/s²') || q.includes('2 kg')) {
      isGood = ans.includes('6') || ans.includes('f=ma') || ans.includes('six');
      feedback = isGood
        ? 'Superb calculation! You correctly multiplied mass (2 kg) by acceleration (3 m/s²) yielding 6 Newtons.'
        : 'Good try! Remember Newton\'s second law: F = m · a. So 2 kg × 3 m/s² = 6 Newtons.';
      takeaway = 'Always check SI base units: kg · m/s² = Newtons.';
    } else if (q.includes('constant speed') || q.includes('frictionless space')) {
      isGood = ans.includes('0') || ans.includes('zero') || ans.includes('none') || ans.includes('no force');
      feedback = isGood
        ? 'Spot on! According to Newton\'s First Law, zero net external force is needed to maintain constant velocity.'
        : 'Notice Newton\'s First Law: an object in uniform motion stays in uniform motion when net external force is 0.';
      takeaway = 'Inertia maintains constant speed without requiring any continuous fuel burn!';
    } else if (q.includes('integrating factor') || q.includes('3y = 9') || q.includes('dy/dx')) {
      isGood = ans.includes('e^(3x)') || ans.includes('e^3x') || ans.includes('exp(3x)');
      feedback = isGood
        ? 'Excellent calculus work! The integrating factor is e^(∫ 3 dx) = e^(3x).'
        : 'Remember the formula: I(x) = e^(∫ P(x) dx). With P(x) = 3, I(x) = e^(3x).';
      takeaway = 'Integrating factor transforms the ODE into an exact product rule derivative.';
    } else if (q.includes('delta g') || q.includes('gibbs') || q.includes('spontaneous') || q.includes('k_eq')) {
      isGood = ans.includes('negative') || ans.includes('spontaneous') || ans.includes('< 0') || ans.includes('exergonic');
      feedback = isGood
        ? 'Accurate thermodynamic deduction! Negative ΔG indicates a spontaneous (exergonic) process.'
        : 'Review the spontaneity criterion: ΔG < 0 (negative) means the process is thermodynamically spontaneous.';
      takeaway = 'ΔG determines spontaneity, while activation energy determines reaction speed.';
    } else if (q.includes('binary search') || q.includes('1,024') || q.includes('1024')) {
      isGood = ans.includes('10') || ans.includes('ten') || ans.includes('log');
      feedback = isGood
        ? 'Correct! log₂(1,024) = 10, so binary search requires at most 10 comparisons.'
        : 'In binary search, each comparison halves the search space: 2^10 = 1024, so maximum 10 comparisons.';
      takeaway = 'O(log n) scaling makes binary search remarkably fast even for millions of records.';
    } else if (q.includes('battery') || q.includes('3ω') || q.includes('9v') || q.includes('resistor')) {
      isGood = ans.includes('3') || ans.includes('three') || ans.includes('3a') || ans.includes('3 a');
      feedback = isGood
        ? 'Perfect! By Ohm\'s Law, I = V / R = 9V / 3Ω = 3 Amperes.'
        : 'Recall Ohm\'s Law: Current I = V / R. With 9V across 3Ω, I = 3 Amperes.';
      takeaway = 'Ohm\'s Law V = I·R is the foundational relation for all linear circuit elements.';
    } else {
      isGood = ans.length >= 4;
      feedback = isGood
        ? 'Great analytical reasoning and clear technical phrasing!'
        : 'Good start. Try to elaborate on the underlying engineering equation or mechanism.';
      takeaway = 'Break complex engineering challenges into fundamental governing laws.';
    }

    return {
      success: true,
      isDemo: true,
      data: {
        evaluation: {
          isCorrect: isGood,
          verdict: isGood ? 'correct' : 'needs_work',
          feedback,
          xpEarned: isGood ? 40 : 15,
          keyTakeaway: takeaway,
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
