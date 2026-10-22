import { QuizQuestion, ResumeData, ResumeAnalysisResult, Flashcard, LearningSubject } from '../types';

export interface StemTopicPreset {
  id: string;
  title: string;
  subject: LearningSubject;
  domain: 'Physics' | 'Chemistry' | 'Mathematics' | 'Computer Science' | 'Engineering';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summaryBadge: string;
  rawNotes: string;
  explanation: string;
  summary: string;
  quiz: QuizQuestion[];
  flashcards: Flashcard[];
  tutorLevels: Array<{
    level: number;
    title: string;
    subtitle: string;
    challengeQuestion: string;
    xpReward: number;
  }>;
}

export const STEM_PRESETS: StemTopicPreset[] = [
  // ==========================================
  // 1. PHYSICS: Classical Mechanics & Dynamics
  // ==========================================
  {
    id: 'physics-mechanics',
    title: "Newton's Laws of Motion & Classical Dynamics",
    subject: 'Engineering Physics',
    domain: 'Physics',
    difficulty: 'Beginner',
    summaryBadge: 'Mechanics & Dynamics',
    rawNotes: `Engineering Physics - Module 1: Classical Mechanics & Dynamics

Newton's Laws of Motion:
1. First Law (Law of Inertia): An object remains at rest or in uniform motion in a straight line unless acted upon by a net external force. Formula: If ΣF = 0, then dv/dt = 0.
2. Second Law (Fundamental Law of Dynamics): The rate of change of linear momentum of a body is directly proportional to the applied net force and occurs in the direction of the force. For constant mass m, F = m * a.
   - Force unit: Newton (N) = kg·m/s²
   - Vector form: F_net = m * (d²r / dt²)
3. Third Law (Action-Reaction): Whenever body A exerts a force on body B, body B exerts an equal and opposite force on body A: F_AB = -F_BA.

Example Problem:
A 2 kg object accelerates at 3 m/s² on a frictionless surface.
Net force F = m * a = 2 kg * 3 m/s² = 6 N.`,
    explanation: `### 🌟 Simple Step-by-Step Explanation: Newton's Laws of Motion

**From Your Material:**
Newton's three laws form the foundation of classical mechanics, describing how objects move and interact in our everyday macroscopic world.

#### Step 1: The Principle of Inertia (First Law)
Objects are naturally "lazy" — they will keep doing whatever they are already doing. If an engineering satellite is drifting through the vacuum of space, it will coast forever at constant velocity unless thruster rockets fire or gravitational pull intervenes.
- **Mathematical Form:** If $\\Sigma \\vec{F} = 0$, then $\\frac{d\\vec{v}}{dt} = 0$ (velocity is constant).

#### Step 2: The Core Equation of Mechanics (Second Law)
When an unbalanced force acts upon an object with mass $m$, it accelerates in that exact direction.
$$\\vec{F} = m \\cdot \\vec{a}$$
- **Key Units:** Force in Newtons ($\\text{N}$), Mass in kilograms ($\\text{kg}$), Acceleration in meters per second squared ($\\text{m/s}^2$).
- **Practical Engineering Example:** A car's electric motor pushing a 2 kg drone component at an acceleration of $3\\,\\text{m/s}^2$ must exert exactly:
  $$F = 2\\,\\text{kg} \\times 3\\,\\text{m/s}^2 = 6\\,\\text{N}$$

#### Step 3: Interactive Mutual Action (Third Law)
Forces always occur in matched pairs. You cannot touch something without it touching you back with equal magnitude and opposite direction:
$$\\vec{F}_{AB} = -\\vec{F}_{BA}$$
- **Real-World Case:** Rocket propulsion works because the rocket nozzle expels hot exhaust gas backward, and the gas exerts an equal forward thrust on the vehicle.

---

### 💡 Remember This
1. $\\vec{F} = m\\vec{a}$ only holds strictly when mass is constant; for varying mass (like a burning rocket stage), use $F = \\frac{dp}{dt}$.
2. Action-reaction pairs act on **different bodies**, which is why they do not cancel each other out!

*Note: Always verify critical exam formulations with your course syllabus or standard textbook.*`,
    summary: `## 📋 Revision Sheet: Classical Mechanics & Dynamics (High-Yield)

### 1. Executive Summary
Sir Isaac Newton's three laws govern mechanical equilibrium and dynamics for macroscopic objects at non-relativistic speeds.

### 2. Core Definitions & Principles
- **Inertia:** The inherent resistance of any physical object to any change in its velocity.
- **Linear Momentum ($\\vec{p}$):** $\\vec{p} = m\\vec{v}$ (measured in $\\text{kg}\\cdot\\text{m/s}$).
- **Net Force ($\\Sigma \\vec{F}$):** The vector sum of all individual external forces acting on a free body.

### 3. Essential Formulas & SI Units
| Law | Equation | SI Units | Exam Frequency |
| :--- | :--- | :--- | :--- |
| First Law | $\\Sigma \\vec{F} = 0 \\implies \\vec{a} = 0$ | $\\text{m/s}^2$ | Moderate |
| Second Law | $\\vec{F} = m \\cdot \\vec{a} = \\frac{d\\vec{p}}{dt}$ | $\\text{N} = \\text{kg}\\cdot\\text{m/s}^2$ | Very High |
| Third Law | $\\vec{F}_{12} = -\\vec{F}_{21}$ | $\\text{N}$ | High |

### 4. High-Yield Midterm / Final Exam Concepts
- Free-body diagrams with inclined planes and friction ($f_k = \\mu_k N$).
- Tension problems in pulleys and Atwood machines.
- Verification of vector components: separate into $\\Sigma F_x = m a_x$ and $\\Sigma F_y = m a_y$.

### 5. Quick Self-Test Checklist
- [ ] Can you define the Newton unit in fundamental base SI units?
- [ ] Can you explain why internal molecular forces do not accelerate a moving vehicle?`,
    quiz: [
      {
        question: 'A 2 kg object accelerates at 3 m/s². What is the net force?',
        options: ['2 N', '5 N', '6 N', '9 N'],
        correctIndex: 2,
        explanation: "According to Newton's Second Law, F = m * a. Here, m = 2 kg and a = 3 m/s², so F = 2 kg * 3 m/s² = 6 N.",
        topic: 'Engineering Physics',
        difficulty: 'Beginner',
        calculation: 'F = 2 * 3 = 6 N',
        numericAnswer: 6,
      },
      {
        question: 'Which law of motion is directly known as the Law of Inertia?',
        options: [
          "Newton's First Law",
          "Newton's Second Law",
          "Newton's Third Law",
          'Universal Law of Gravitation',
        ],
        correctIndex: 0,
        explanation: "Newton's First Law states that an object remains at rest or in uniform straight-line motion unless acted upon by a net external force, describing inertia.",
        topic: 'Engineering Physics',
        difficulty: 'Beginner',
      },
      {
        question: 'Why do action and reaction force pairs NOT cancel each other out?',
        options: [
          'They act at different speeds',
          'They act on two different bodies',
          'They have unequal magnitudes in non-inertial frames',
          'Friction always absorbs the reaction force',
        ],
        correctIndex: 1,
        explanation: "Action and reaction forces act on separate bodies (Body A on Body B, and Body B on Body A), so they never cancel out in a single body's free-body diagram.",
        topic: 'Engineering Physics',
        difficulty: 'Intermediate',
      },
      {
        question: 'What are the base SI units of 1 Newton (N)?',
        options: [
          'kg · m / s',
          'kg · m / s²',
          'kg · m² / s²',
          'g · cm / s²',
        ],
        correctIndex: 1,
        explanation: 'Since F = m * a, the unit is mass (kg) multiplied by acceleration (m/s²), which gives kg·m/s².',
        topic: 'Engineering Physics',
        difficulty: 'Beginner',
      },
      {
        question: 'If the net external force on a moving spacecraft in deep space is zero, what happens to its speed?',
        options: [
          'It gradually decelerates to a complete stop',
          'It instantly reverses direction',
          'It continues moving with constant velocity',
          'It begins an orbital spiral',
        ],
        correctIndex: 2,
        explanation: "Under Newton's First Law, when net external force is zero, acceleration is zero, maintaining uniform velocity indefinitely.",
        topic: 'Engineering Physics',
        difficulty: 'Beginner',
      },
    ],
    flashcards: [
      {
        id: 'fc-phys-1',
        front: "What is Newton's First Law of Motion?",
        back: 'An object remains at rest or continues to move with constant velocity in a straight line unless acted upon by a net external force (Principle of Inertia).',
        category: 'Fundamental Principle',
        mastered: true,
      },
      {
        id: 'fc-phys-2',
        front: "State the formula and units for Newton's Second Law.",
        back: 'F_net = m · a (Force = Mass × Acceleration). SI Unit: Newton (N) = kg·m/s².',
        category: 'Formula',
        mastered: false,
      },
      {
        id: 'fc-phys-3',
        front: 'Why do action-reaction force pairs never cancel each other out?',
        back: 'Because action and reaction forces always act on two different, distinct bodies (Body A on Body B, and Body B on Body A).',
        category: 'Exam Trap',
        mastered: false,
      },
      {
        id: 'fc-phys-4',
        front: 'Calculate net force: 2 kg mass accelerating at 3 m/s².',
        back: 'F = m · a = 2 kg × 3 m/s² = 6 Newtons.',
        category: 'Numerical Problem',
        mastered: true,
      },
      {
        id: 'fc-phys-5',
        front: 'When does F = m · a fail and require F = dp/dt?',
        back: 'When mass varies with time (such as rocket fuel burn or relativistic regimes where relativistic momentum applies).',
        category: 'Advanced Theory',
        mastered: false,
      },
      {
        id: 'fc-phys-6',
        front: 'What is Linear Momentum (p) and its SI unit?',
        back: 'p = m · v (Mass × Velocity). SI Unit: kg·m/s (or N·s).',
        category: 'Definition',
        mastered: true,
      },
    ],
    tutorLevels: [
      {
        level: 1,
        title: 'Start Here',
        subtitle: 'Foundations of Force & Inertia',
        challengeQuestion: 'What net external force is needed to maintain a constant speed of 50 m/s in frictionless space?',
        xpReward: 50,
      },
      {
        level: 2,
        title: 'Understand the Concept',
        subtitle: "Newton's Second Law: F = ma",
        challengeQuestion: 'If a 2 kg object accelerates at 3 m/s², what is the net force in Newtons?',
        xpReward: 75,
      },
      {
        level: 3,
        title: 'Learn Through Examples',
        subtitle: 'Free Body Diagrams & Pulleys',
        challengeQuestion: 'In an elevator accelerating upward at 2 m/s², does your apparent weight increase or decrease?',
        xpReward: 100,
      },
      {
        level: 4,
        title: 'Practise Questions',
        subtitle: 'Calculation & Dimension Sprint',
        challengeQuestion: 'What are the SI base units of 1 Newton?',
        xpReward: 125,
      },
      {
        level: 5,
        title: 'Complete a Challenge',
        subtitle: 'Rocket Exhaust & Third Law Pairs',
        challengeQuestion: 'Why do action-reaction pairs not cancel each other out in flight?',
        xpReward: 150,
      },
      {
        level: 6,
        title: 'Revise and Master',
        subtitle: 'Engineering Dynamics Synthesis',
        challengeQuestion: 'Under what physical condition does F = m * a break down, requiring F = dp/dt?',
        xpReward: 200,
      },
    ],
  },

  // ==========================================
  // 2. CHEMISTRY: Thermodynamics & Chemical Equilibrium
  // ==========================================
  {
    id: 'chem-thermo',
    title: 'Chemical Thermodynamics, Gibbs Free Energy & Equilibrium',
    subject: 'Chemistry',
    domain: 'Chemistry',
    difficulty: 'Intermediate',
    summaryBadge: 'Thermodynamics & Equilibrium',
    rawNotes: `College Chemistry - Module 4: Chemical Thermodynamics & Equilibrium

1. Gibbs Free Energy (ΔG):
   - Equation: ΔG = ΔH - TΔS
   - Where:
     * ΔH = Enthalpy change (J or kJ/mol)
     * T = Absolute temperature in Kelvin (K)
     * ΔS = Entropy change (J/(mol·K))
   - Spontaneity Criteria:
     * ΔG < 0: Spontaneous (exergonic)
     * ΔG = 0: System at dynamic equilibrium
     * ΔG > 0: Non-spontaneous (endergonic, requires external energy)

2. Standard Free Energy and Equilibrium Constant (K):
   - ΔG° = -R·T·ln(K_eq)
   - R = Universal Gas Constant = 8.314 J/(mol·K)
   - If K > 1: Products favored at equilibrium (ΔG° is negative).
   - If K < 1: Reactants favored at equilibrium (ΔG° is positive).

3. Le Chatelier's Principle:
   - When a system at dynamic equilibrium is subjected to a disturbance in concentration, pressure, or temperature, the system shifts in the direction that counteracts that change.
   - For exothermic reaction (ΔH < 0): Increasing temperature shifts equilibrium left (toward reactants), decreasing K.
   - For endothermic reaction (ΔH > 0): Increasing temperature shifts equilibrium right (toward products), increasing K.`,
    explanation: `### 🧪 Step-by-Step Explanation: Gibbs Free Energy & Chemical Equilibrium

**From Your Material:**
Chemical thermodynamics predicts whether a chemical reaction will proceed spontaneously and how far it will go before reaching equilibrium.

#### Step 1: The Driving Forces of the Universe (Enthalpy vs. Entropy)
Reactions are driven by two competing thermodynamic tendencies:
1. **Enthalpy ($\\Delta H$):** The drive toward lower potential energy (bonds releasing heat, $\\Delta H < 0$).
2. **Entropy ($\\Delta S$):** The universal drive toward greater disorder and statistical dispersion ($\\Delta S > 0$).

#### Step 2: Unifying Both with Gibbs Free Energy
To determine which drive wins at a given absolute temperature $T$ (in Kelvin), Josiah Willard Gibbs derived:
$$\\Delta G = \\Delta H - T \\Delta S$$
- **Spontaneous:** When $\\Delta G < 0$, the reaction releases free energy to do non-expansion work.
- **Dynamic Equilibrium:** When $\\Delta G = 0$, forward and reverse reaction rates are identical.
- **Non-spontaneous:** When $\\Delta G > 0$, the reverse reaction is spontaneous.

#### Step 3: Connecting Thermodynamics to Equilibrium ($K_{eq}$)
At standard state conditions ($298\\,\\text{K}$, $1\\,\\text{atm}$):
$$\\Delta G^\\circ = -R T \\ln(K_{eq})$$
- When $K_{eq} > 1$, $\\ln(K) > 0$, meaning $\\Delta G^\\circ < 0$ (products predominate).
- When $K_{eq} < 1$, $\\ln(K) < 0$, meaning $\\Delta G^\\circ > 0$ (reactants predominate).

#### Step 4: Real-World Chemical Engineering Application (Haber-Bosch Synthesis)
In ammonia production:
$$\\text{N}_2(g) + 3\\text{H}_2(g) \\rightleftharpoons 2\\text{NH}_3(g) \\quad (\\Delta H = -92.4\\,\\text{kJ/mol})$$
Because the reaction is exothermic and produces fewer moles of gas (4 moles $\\to$ 2 moles), Le Chatelier's principle dictates:
1. High pressure (200 atm) shifts the equilibrium toward product $\\text{NH}_3$.
2. Moderate temperature (450 °C) with an iron catalyst balances thermodynamic yield with kinetic reaction rate!

---

### 💡 Remember This
- Always convert temperature into **Kelvin** ($T = {}^\\circ\\text{C} + 273.15$) and ensure $\\Delta H$ and $\\Delta S$ use compatible units (kJ vs. J).
- Catalysts speed up the arrival at equilibrium, but **never change $\\Delta G$ or $K_{eq}$**!`,
    summary: `## 📋 Revision Sheet: Chemical Thermodynamics & Equilibrium

### 1. Executive Summary
Gibbs Free Energy ($\\Delta G = \\Delta H - T\\Delta S$) bridges the First and Second Laws of Thermodynamics, defining the chemical potential and equilibrium state of reacting systems.

### 2. Spontaneity Sign Table (High Exam Yield!)
| $\\Delta H$ | $\\Delta S$ | $-T\\Delta S$ | $\\Delta G$ | Spontaneity Outcome |
| :--- | :--- | :--- | :--- | :--- |
| **$-$** (Exothermic) | **$+$** (Disorder $\\uparrow$) | **$-$** | **Always $-$** | Spontaneous at all temperatures |
| **$+$** (Endothermic) | **$-$** (Order $\\uparrow$) | **$+$** | **Always $+$** | Non-spontaneous at all temperatures |
| **$-$** (Exothermic) | **$-$** (Order $\\uparrow$) | **$+$** | **$-$ at low $T$** | Spontaneous only at low temperatures |
| **$+$** (Endothermic) | **$+$** (Disorder $\\uparrow$) | **$-$** | **$-$ at high $T$** | Spontaneous only at high temperatures |

### 3. Core Formulas
- $\\Delta G = \\Delta H - T\\Delta S$
- $\\Delta G^\\circ = -RT \\ln(K)$ ($R = 8.314\\,\\text{J}/(\\text{mol}\\cdot\\text{K})$)
- Van 't Hoff Equation: $\\ln\\left(\\frac{K_2}{K_1}\\right) = -\\frac{\\Delta H^\\circ}{R}\\left(\\frac{1}{T_2} - \\frac{1}{T_1}\\right)$

### 4. Self-Testing Checklist
- [ ] At what temperature does a process with $\\Delta H = +30\\,\\text{kJ/mol}$ and $\\Delta S = +100\\,\\text{J/(mol}\\cdot\\text{K)}$ become spontaneous? ($T > 300\\,\\text{K}$).
- [ ] How does adding an inert gas at constant volume affect chemical equilibrium? (No effect!).`,
    quiz: [
      {
        question: 'Under what conditions is a chemical reaction spontaneous at all temperatures?',
        options: [
          'ΔH is negative and ΔS is positive',
          'ΔH is positive and ΔS is negative',
          'Both ΔH and ΔS are positive',
          'Both ΔH and ΔS are negative',
        ],
        correctIndex: 0,
        explanation: 'When ΔH < 0 (exothermic) and ΔS > 0 (entropy increase), ΔG = ΔH - TΔS is guaranteed to be negative for all positive temperatures T in Kelvin.',
        topic: 'Chemistry',
        difficulty: 'Intermediate',
      },
      {
        question: 'What is the value of ΔG when a chemical system reaches dynamic equilibrium at constant T and P?',
        options: ['ΔG < 0', 'ΔG = 0', 'ΔG > 0', 'ΔG = 1'],
        correctIndex: 1,
        explanation: 'At dynamic equilibrium, the rates of forward and reverse reactions are equal, and free energy is minimized, so ΔG = 0.',
        topic: 'Chemistry',
        difficulty: 'Beginner',
      },
      {
        question: 'For an exothermic reaction (ΔH < 0) at equilibrium, what happens when temperature is increased?',
        options: [
          'Equilibrium shifts toward products, K increases',
          'Equilibrium shifts toward reactants, K decreases',
          'Equilibrium remains unchanged',
          'Reaction rate drops to zero',
        ],
        correctIndex: 1,
        explanation: "By Le Chatelier's Principle, adding heat to an exothermic reaction shifts the equilibrium toward the reactants to consume the added thermal energy, decreasing K_eq.",
        topic: 'Chemistry',
        difficulty: 'Intermediate',
      },
      {
        question: 'If K_eq = 1.0 for a reversible reaction at 298 K, what is standard Gibbs free energy change ΔG°?',
        options: ['-8.314 kJ/mol', '0 J/mol', '+2.47 kJ/mol', 'Infinity'],
        correctIndex: 1,
        explanation: 'Since ΔG° = -RT·ln(K_eq) and ln(1) = 0, ΔG° must be exactly 0 J/mol.',
        topic: 'Chemistry',
        difficulty: 'Beginner',
        calculation: 'ΔG° = -R * T * ln(1) = 0',
        numericAnswer: 0,
      },
      {
        question: 'What effect does adding a catalyst have on the equilibrium constant K_eq and ΔG of a reaction?',
        options: [
          'Increases K_eq and decreases ΔG',
          'Decreases K_eq and increases ΔG',
          'No change to either K_eq or ΔG',
          'Doubles both K_eq and ΔG',
        ],
        correctIndex: 2,
        explanation: 'A catalyst lowers the activation energy of both forward and reverse reactions equally; it does not change thermodynamic state functions ΔG or the equilibrium position K_eq.',
        topic: 'Chemistry',
        difficulty: 'Intermediate',
      },
    ],
    flashcards: [
      {
        id: 'fc-chem-1',
        front: 'State the Gibbs Free Energy equation and identify all terms.',
        back: 'ΔG = ΔH - TΔS. ΔG is free energy change, ΔH is enthalpy, T is absolute temperature (Kelvin), and ΔS is entropy change.',
        category: 'Equation',
        mastered: true,
      },
      {
        id: 'fc-chem-2',
        front: 'What does ΔG < 0 signify for a chemical process?',
        back: 'The process is thermodynamically spontaneous (exergonic) in the forward direction under the specified conditions.',
        category: 'Core Principle',
        mastered: false,
      },
      {
        id: 'fc-chem-3',
        front: 'Relate standard free energy ΔG° to the equilibrium constant K.',
        back: 'ΔG° = -R·T·ln(K_eq), where R is 8.314 J/(mol·K) and T is in Kelvin.',
        category: 'Formula',
        mastered: true,
      },
      {
        id: 'fc-chem-4',
        front: "State Le Chatelier's Principle in one concise sentence.",
        back: 'If a dynamic equilibrium is disturbed by changing conditions (concentration, temperature, pressure), the position of equilibrium shifts to counteract the change.',
        category: 'Definition',
        mastered: false,
      },
      {
        id: 'fc-chem-5',
        front: 'How does temperature affect K for an endothermic reaction (ΔH > 0)?',
        back: 'Increasing temperature drives an endothermic reaction forward, causing the equilibrium constant K to increase.',
        category: 'Exam Trap',
        mastered: false,
      },
      {
        id: 'fc-chem-6',
        front: 'Does a catalyst change the equilibrium yield of a reaction? Why or why not?',
        back: 'No. Catalysts only increase the rate at which equilibrium is reached by lowering activation energy; they do not alter ΔG or K_eq.',
        category: 'Concept Check',
        mastered: true,
      },
    ],
    tutorLevels: [
      {
        level: 1,
        title: 'Start Here',
        subtitle: 'Enthalpy, Entropy & Gibbs Free Energy',
        challengeQuestion: 'What does it mean thermodynamically if ΔG is negative for a reaction?',
        xpReward: 50,
      },
      {
        level: 2,
        title: 'Understand the Concept',
        subtitle: 'ΔG = ΔH - TΔS and Spontaneity',
        challengeQuestion: 'If ΔH = +40 kJ/mol and ΔS = +100 J/(mol·K), at what temperature (in Kelvin) does ΔG become zero?',
        xpReward: 75,
      },
      {
        level: 3,
        title: 'Learn Through Examples',
        subtitle: 'Relating ΔG° to Equilibrium Constant K',
        challengeQuestion: 'If K_eq is greater than 1, is ΔG° positive, negative, or zero?',
        xpReward: 100,
      },
      {
        level: 4,
        title: 'Practise Questions',
        subtitle: "Le Chatelier's Shifts & Industrial Yields",
        challengeQuestion: 'Why does increasing pressure favor ammonia synthesis: N2 + 3H2 <=> 2NH3?',
        xpReward: 125,
      },
      {
        level: 5,
        title: 'Complete a Challenge',
        subtitle: "Van 't Hoff Temperature Shifts",
        challengeQuestion: 'For an exothermic reaction, what happens to the equilibrium constant K when heated?',
        xpReward: 150,
      },
      {
        level: 6,
        title: 'Revise and Master',
        subtitle: 'Chemical Potential & Multi-Phase Equilibrium',
        challengeQuestion: 'Why does adding a catalyst accelerate a reaction without altering ΔG or K_eq?',
        xpReward: 200,
      },
    ],
  },

  // ==========================================
  // 3. MATHEMATICS: Calculus & Differential Equations
  // ==========================================
  {
    id: 'math-calculus',
    title: 'Differential Calculus & First-Order Differential Equations',
    subject: 'Mathematics',
    domain: 'Mathematics',
    difficulty: 'Intermediate',
    summaryBadge: 'Calculus & ODEs',
    rawNotes: `Engineering Mathematics - Module 2: Calculus & Ordinary Differential Equations (ODEs)

1. Essential Differentiation Rules:
   - Product Rule: d/dx [u·v] = u'·v + u·v'
   - Quotient Rule: d/dx [u/v] = (u'·v - u·v') / v²
   - Chain Rule: d/dx [f(g(x))] = f'(g(x)) · g'(x)
   - Common derivatives:
     * d/dx [e^(kx)] = k·e^(kx)
     * d/dx [ln(x)] = 1/x
     * d/dx [sin(kx)] = k·cos(kx)
     * d/dx [cos(kx)] = -k·sin(kx)

2. Integration by Parts:
   - Formula: ∫ u dv = u·v - ∫ v du
   - LIATE priority for picking u: Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential.

3. First-Order Linear Differential Equations:
   - Standard Form: dy/dx + P(x)·y = Q(x)
   - Integrating Factor (IF): I(x) = e^(∫ P(x) dx)
   - General Solution: y · I(x) = ∫ [Q(x) · I(x)] dx + C

Example Problem:
Solve dy/dx + 2y = 4.
- P(x) = 2, Q(x) = 4
- I(x) = e^(∫ 2 dx) = e^(2x)
- y · e^(2x) = ∫ 4·e^(2x) dx = 2·e^(2x) + C
- y(x) = 2 + C·e^(-2x)`,
    explanation: `### 📐 Step-by-Step Explanation: Calculus & First-Order Differential Equations

**From Your Material:**
Differential equations model dynamic rates of change across engineering, from cooling engines and radioactive decay to electrical RC circuits and mechanical vibrations.

#### Step 1: Understanding Rate of Change vs. Function
In basic algebra, equations solve for an unknown number (e.g., $x = 5$). In differential equations, we solve for an unknown **function** $y(x)$ whose derivative relates to itself!

#### Step 2: The Chain Rule & Differentiation Foundation
Before solving ODEs, master the Chain Rule:
$$\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$$
- *Example:* For $y = e^{-3x}$, the outer function is $e^u$ and inner is $u = -3x$.
  $$\\frac{dy}{dx} = e^{-3x} \\cdot (-3) = -3e^{-3x}$$

#### Step 3: Solving First-Order Linear ODEs via Integrating Factor
Any equation fitting the standard form:
$$\\frac{dy}{dx} + P(x) y = Q(x)$$
can be solved in three methodical steps:
1. **Compute the Integrating Factor:**
   $$I(x) = e^{\\int P(x) dx}$$
2. **Multiply across the entire equation:**
   Notice that the left side becomes the exact product rule expansion:
   $$\\frac{d}{dx}[y \\cdot I(x)] = Q(x) \\cdot I(x)$$
3. **Integrate both sides with respect to $x$:**
   $$y(x) \\cdot I(x) = \\int Q(x) I(x) dx + C \\implies y(x) = \\frac{1}{I(x)}\\left[\\int Q(x) I(x) dx + C\\right]$$

#### Step 4: Practical Engineering Application (RC Circuit Charging)
In an electrical circuit with resistance $R$ and capacitance $C$ driven by voltage $V_0$:
$$R \\frac{dq}{dt} + \\frac{q}{C} = V_0 \\implies \\frac{dq}{dt} + \\frac{1}{RC} q = \\frac{V_0}{R}$$
Using the integrating factor $I(t) = e^{t/(RC)}$, the solution yields the classic capacitor charging curve:
$$q(t) = C V_0 \\left(1 - e^{-t/(RC)}\\right)$$

---

### 💡 Remember This
- Always ensure the coefficient of $\\frac{dy}{dx}$ is **exactly 1** before extracting $P(x)$ and $Q(x)$.
- Never forget the arbitrary constant $+C$ before dividing by $I(x)$, as it scales with $\\frac{1}{I(x)}$!`,
    summary: `## 📋 Revision Sheet: Calculus & Ordinary Differential Equations

### 1. Executive Summary
Calculus provides the mathematical language for modeling continuous physical change; first-order linear ODEs represent fundamental transient dynamics in circuits, fluid flow, and heat transfer.

### 2. Core Operational Formulas
| Concept | Standard Equation | Key Tip / Rule |
| :--- | :--- | :--- |
| **Product Rule** | $\\frac{d}{dx}[uv] = u'v + uv'$ | Differentiate one factor at a time |
| **Integration by Parts** | $\\int u\\,dv = uv - \\int v\\,du$ | Choose $u$ via **LIATE** mnemonic |
| **Standard ODE Form** | $\\frac{dy}{dx} + P(x)y = Q(x)$ | Must have coefficient $1$ on $y'$ |
| **Integrating Factor** | $I(x) = e^{\\int P(x)dx}$ | Do not add $+C$ in the exponent |
| **General Solution** | $y(x) = \\frac{1}{I(x)}\\left[\\int Q(x)I(x)dx + C\\right]$ | Distribute $I(x)^{-1}$ across $+C$ |

### 3. High-Yield Exam Traps
1. **Missing Initial Condition:** If $y(0) = y_0$ is given, substitute into the general solution to solve for the unique value of $C$.
2. **Negative Signs in $P(x)$:** For $\\frac{dy}{dx} - 3y = 6$, $P(x) = -3$, so $I(x) = e^{-3x}$ (not $e^{3x}$).
3. **Separation of Variables:** Check if $\\frac{dy}{dx} = g(x)h(y)$ can be separated directly into $\\frac{dy}{h(y)} = g(x)dx$ before computing an integrating factor.

### 4. Self-Testing Checklist
- [ ] What is the integrating factor for $\\frac{dy}{dx} + \\frac{2}{x}y = x^3$? ($I(x) = e^{2\\ln|x|} = x^2$).
- [ ] Find $\\lim_{t \\to \\infty} [2 + 5e^{-2t}]$? (Equals $2$).`,
    quiz: [
      {
        question: 'What is the Integrating Factor I(x) for the ODE: dy/dx + (3/x)·y = x²?',
        options: ['x²', 'x³', '3·ln(x)', 'e^(3x)'],
        correctIndex: 1,
        explanation: 'The integrating factor is I(x) = e^(∫ 3/x dx) = e^(3 ln x) = e^(ln x³) = x³.',
        topic: 'Mathematics',
        difficulty: 'Intermediate',
        calculation: 'I(x) = e^(3 * ln(x)) = x^3',
      },
      {
        question: 'What is the derivative of f(x) = x · e^(2x) using the product rule?',
        options: [
          'e^(2x)',
          '2x · e^(2x)',
          'e^(2x) · (1 + 2x)',
          '2 · e^(2x)',
        ],
        correctIndex: 2,
        explanation: "By product rule, d/dx [u·v] = u'v + uv'. Here u=x, v=e^(2x), so u'=1, v'=2e^(2x). f'(x) = 1·e^(2x) + x·(2e^(2x)) = e^(2x)(1 + 2x).",
        topic: 'Mathematics',
        difficulty: 'Beginner',
      },
      {
        question: 'In Integration by Parts (∫ u dv = u·v - ∫ v du), what does LIATE suggest choosing first for u?',
        options: [
          'Exponential functions',
          'Logarithmic functions',
          'Trigonometric functions',
          'Algebraic polynomials',
        ],
        correctIndex: 1,
        explanation: 'LIATE stands for Logarithmic, Inverse trigonometric, Algebraic, Trigonometric, Exponential. Logarithmic functions (L) have top priority for u.',
        topic: 'Mathematics',
        difficulty: 'Beginner',
      },
      {
        question: 'Solve for the steady-state value of y(x) = 5 - 3·e^(-4x) as x approaches infinity:',
        options: ['-3', '0', '2', '5'],
        correctIndex: 3,
        explanation: 'As x -> ∞, e^(-4x) -> 0. Therefore, y(∞) = 5 - 3(0) = 5.',
        topic: 'Mathematics',
        difficulty: 'Beginner',
        calculation: 'lim x->inf [5 - 3 * 0] = 5',
        numericAnswer: 5,
      },
      {
        question: 'Which method should be attempted first to solve: dy/dx = (2x) / (y + 1)?',
        options: [
          'Separation of Variables',
          'Variation of Parameters',
          'Fourier Series Expansion',
          'Euler-Cauchy Transform',
        ],
        correctIndex: 0,
        explanation: 'The equation can be directly rewritten as (y + 1) dy = 2x dx, which separates variables immediately without needing advanced techniques.',
        topic: 'Mathematics',
        difficulty: 'Beginner',
      },
    ],
    flashcards: [
      {
        id: 'fc-math-1',
        front: 'What is the Product Rule formula for d/dx [u · v]?',
        back: "d/dx [u · v] = u'·v + u·v' (Derivative of first × second + first × derivative of second).",
        category: 'Differentiation',
        mastered: true,
      },
      {
        id: 'fc-math-2',
        front: 'State the Integration by Parts formula and LIATE order.',
        back: '∫ u dv = u·v - ∫ v du. LIATE priority for u: Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential.',
        category: 'Integration',
        mastered: false,
      },
      {
        id: 'fc-math-3',
        front: 'What is the Integrating Factor formula for dy/dx + P(x)y = Q(x)?',
        back: 'I(x) = e^(∫ P(x) dx). It transforms the left-hand side into the exact derivative of [y · I(x)].',
        category: 'Differential Equations',
        mastered: true,
      },
      {
        id: 'fc-math-4',
        front: 'What is d/dx [ln(x)] and d/dx [e^(3x)]?',
        back: 'd/dx [ln(x)] = 1/x. d/dx [e^(3x)] = 3·e^(3x) (via Chain Rule).',
        category: 'Standard Derivatives',
        mastered: true,
      },
      {
        id: 'fc-math-5',
        front: 'Calculate the Integrating Factor for dy/dx + (2/x)y = 4.',
        back: 'I(x) = e^(∫ 2/x dx) = e^(2 ln x) = e^(ln x²) = x².',
        category: 'Worked Calculation',
        mastered: false,
      },
      {
        id: 'fc-math-6',
        front: 'What is the steady-state limit of y(t) = A + B·e^(-k·t) as t -> ∞ (k > 0)?',
        back: 'y(t) -> A, because e^(-kt) decays asymptotically to 0 as t increases indefinitely.',
        category: 'Transients & Limits',
        mastered: true,
      },
    ],
    tutorLevels: [
      {
        level: 1,
        title: 'Start Here',
        subtitle: 'Foundations of Derivatives & Chain Rule',
        challengeQuestion: 'What is the derivative of e^(5x) with respect to x?',
        xpReward: 50,
      },
      {
        level: 2,
        title: 'Understand the Concept',
        subtitle: 'First-Order Linear ODEs & Integrating Factor',
        challengeQuestion: 'Find the integrating factor for dy/dx + 3y = 9.',
        xpReward: 75,
      },
      {
        level: 3,
        title: 'Learn Through Examples',
        subtitle: 'Transient Solutions & RC Circuit Analogy',
        challengeQuestion: 'In y(t) = 10 - 10·e^(-2t), what is y(0) and what is y(∞)?',
        xpReward: 100,
      },
      {
        level: 4,
        title: 'Practise Questions',
        subtitle: 'Integration by Parts & LIATE Strategy',
        challengeQuestion: 'To evaluate ∫ x · cos(x) dx, which factor should be chosen as u?',
        xpReward: 125,
      },
      {
        level: 5,
        title: 'Complete a Challenge',
        subtitle: 'Boundary Conditions & Specific Solutions',
        challengeQuestion: 'If dy/dx = 2x and y(0) = 5, find the exact expression for y(x).',
        xpReward: 150,
      },
      {
        level: 6,
        title: 'Revise and Master',
        subtitle: 'Engineering Systems Synthesis',
        challengeQuestion: 'Why does an integrating factor I(x) = e^(∫P dx) always make the left side a perfect product derivative?',
        xpReward: 200,
      },
    ],
  },

  // ==========================================
  // 4. COMPUTER SCIENCE & ENGINEERING: Algorithms & Data Structures
  // ==========================================
  {
    id: 'cs-algorithms',
    title: 'Algorithms, Time Complexity & Graph Traversals',
    subject: 'Computer Science',
    domain: 'Computer Science',
    difficulty: 'Intermediate',
    summaryBadge: 'Data Structures & Algorithms',
    rawNotes: `Computer Science & Engineering - Module 3: Algorithms & Data Structures

1. Asymptotic Notation (Big-O Complexity):
   - O(1): Constant time (Hash map lookup average, array indexing)
   - O(log n): Logarithmic time (Binary Search)
   - O(n): Linear time (Single loop traversal)
   - O(n log n): Linearithmic time (Merge Sort, Heap Sort, Quick Sort average)
   - O(n²): Quadratic time (Nested loops, Bubble/Insertion sort worst case)
   - O(2^n): Exponential time (Recursive Fibonacci without memoization)

2. Binary Search:
   - Precondition: Array must be sorted in ascending order.
   - Recurrence: T(n) = T(n/2) + O(1) -> O(log n) time, O(1) space.

3. Graph Traversals (BFS vs. DFS):
   - Breadth-First Search (BFS):
     * Data structure: Queue (FIFO)
     * Finds shortest unweighted path between two nodes.
     * Time: O(V + E), Space: O(V)
   - Depth-First Search (DFS):
     * Data structure: Stack / Call stack recursion (LIFO)
     * Ideal for topological sorting, cycle detection, connected components.
     * Time: O(V + E), Space: O(V) recursion depth.

4. Dynamic Programming (DP):
   - Overlapping Subproblems + Optimal Substructure.
   - Memoization (Top-down) vs. Tabulation (Bottom-up).`,
    explanation: `### 💻 Step-by-Step Explanation: Asymptotic Complexity & Graph Algorithms

**From Your Material:**
Efficient algorithms are the cornerstone of scalable computer software and AI architectures, ensuring programs execute in milliseconds rather than hours.

#### Step 1: Thinking in Asymptotic Orders of Growth (Big-O)
Big-O measures how algorithm runtime or memory scales as input size $n$ approaches infinity.
- If $n = 10^6$ operations:
  * An $O(\\log_2 n)$ algorithm executes in just $\\approx 20$ operations!
  * An $O(n)$ algorithm requires $1,000,000$ operations.
  * An $O(n^2)$ algorithm requires $1,000,000,000,000$ operations (crashing typical single-threaded CPUs).

#### Step 2: Binary Search in Action
To find a key in an array of $n$ elements, linear search inspects each index $0, 1, 2, \\dots, n-1$.
Binary Search halves the search space at every step:
\`\`\`typescript
function binarySearch(arr: number[], target: number): number {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}
\`\`\`
Because the interval length drops from $n \\to n/2 \\to n/4 \\to \\dots \\to 1$, total iterations $= \\log_2(n)$.

#### Step 3: Graph Traversal — BFS vs. DFS
Graphs represent interconnected entities (social networks, road maps, neural nets).
1. **BFS (Breadth-First):** Explores neighbors level-by-level using a **Queue**. It is mathematically guaranteed to find the shortest hop path in unweighted graphs.
2. **DFS (Depth-First):** Explores as deep as possible down each path using a **Stack** or recursion before backtracking. Used for maze solving and cycle checks.

---

### 💡 Remember This
- Sorting lower bound for comparison sorts (like Merge Sort) is $\\Omega(n \\log n)$.
- Always verify edge cases: empty arrays, single-node graphs, and disconnected components!`,
    summary: `## 📋 Revision Sheet: Algorithms & Data Structures

### 1. Executive Summary
Algorithmic efficiency is analyzed through Big-O asymptotic limits, with logarithmic and linearithmic divide-and-conquer strategies dominating high-throughput software systems.

### 2. Time & Space Complexity Comparison Table
| Algorithm | Best Time | Average Time | Worst Time | Space | Primary Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Binary Search** | $O(1)$ | $O(\\log n)$ | $O(\\log n)$ | $O(1)$ | Fast lookup in sorted arrays |
| **Merge Sort** | $O(n\\log n)$ | $O(n\\log n)$ | $O(n\\log n)$ | $O(n)$ | Stable sorting, linked lists |
| **Quick Sort** | $O(n\\log n)$ | $O(n\\log n)$ | $O(n^2)$ | $O(\\log n)$ | In-place cache-friendly sort |
| **BFS** | $O(V+E)$ | $O(V+E)$ | $O(V+E)$ | $O(V)$ | Shortest path in unweighted graphs |
| **DFS** | $O(V+E)$ | $O(V+E)$ | $O(V+E)$ | $O(V)$ | Topological sort & cycle detection |

### 3. High-Yield Interview & Exam Traps
1. **Integer Overflow in Binary Search:** In languages like C++/Java, \`(low + high) / 2\` can overflow. Use \`low + (high - low) / 2\`.
2. **Hash Table Worst Case:** While average hash lookup is $O(1)$, hash collisions without good distribution degrade to $O(n)$.
3. **Graph Visited Set:** Forgetting a \`visited\` set in cyclic graphs leads to infinite recursive loops in BFS/DFS!`,
    quiz: [
      {
        question: 'What is the worst-case time complexity of Merge Sort on an array of n items?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correctIndex: 1,
        explanation: 'Merge Sort always divides the array into two halves (log n levels) and performs O(n) work per level to merge, resulting in guaranteed O(n log n) time even in the worst case.',
        topic: 'Computer Science',
        difficulty: 'Intermediate',
      },
      {
        question: 'Which data structure is primarily used to implement Breadth-First Search (BFS)?',
        options: ['Stack (LIFO)', 'Queue (FIFO)', 'Priority Heap', 'Binary Search Tree'],
        correctIndex: 1,
        explanation: 'BFS uses a Queue (First-In, First-Out) to process nodes level by level in order of distance from the source.',
        topic: 'Computer Science',
        difficulty: 'Beginner',
      },
      {
        question: 'What is the average time complexity for searching an element in a balanced Hash Table?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctIndex: 0,
        explanation: 'With a uniform hash function and low load factor, hash table lookup, insertion, and deletion occur in O(1) constant average time.',
        topic: 'Computer Science',
        difficulty: 'Beginner',
      },
      {
        question: 'How many comparisons does Binary Search take in the worst case for an array of 1,024 sorted elements?',
        options: ['10', '32', '512', '1,024'],
        correctIndex: 0,
        explanation: 'Since log₂(1,024) = 10, binary search will make at most 10 comparisons before finding the item or determining it is absent.',
        topic: 'Computer Science',
        difficulty: 'Beginner',
        calculation: 'log2(1024) = 10',
        numericAnswer: 10,
      },
      {
        question: 'What essential property must a problem have to be efficiently solved with Dynamic Programming?',
        options: [
          'Linear time complexity and no memory overhead',
          'Optimal substructure and overlapping subproblems',
          'Sorted inputs and monotonic growth',
          'Greedy choice property at every branch',
        ],
        correctIndex: 1,
        explanation: 'Dynamic Programming applies when an optimal solution can be constructed from optimal solutions to subproblems (optimal substructure) and subproblems recur multiple times (overlapping subproblems).',
        topic: 'Computer Science',
        difficulty: 'Intermediate',
      },
    ],
    flashcards: [
      {
        id: 'fc-cs-1',
        front: 'What is the time complexity of Binary Search and what is its prerequisite?',
        back: 'O(log n) time. Prerequisite: The array must be sorted in ascending or descending order.',
        category: 'Searching',
        mastered: true,
      },
      {
        id: 'fc-cs-2',
        front: 'Compare BFS vs DFS data structures and primary uses.',
        back: 'BFS uses a Queue (FIFO) and finds shortest unweighted paths. DFS uses a Stack/recursion (LIFO) and is ideal for topological sort and cycle detection.',
        category: 'Graph Algorithms',
        mastered: false,
      },
      {
        id: 'fc-cs-3',
        front: 'State the worst-case time complexity of Merge Sort, Quick Sort, and Bubble Sort.',
        back: 'Merge Sort: O(n log n). Quick Sort: O(n²) (when pivot is unbalanced). Bubble Sort: O(n²).',
        category: 'Sorting Algorithms',
        mastered: true,
      },
      {
        id: 'fc-cs-4',
        front: 'What are the two key attributes required for Dynamic Programming?',
        back: '1. Optimal Substructure (optimal solution contains optimal sub-solutions). 2. Overlapping Subproblems (sub-computations are reused).',
        category: 'DP Paradigm',
        mastered: false,
      },
      {
        id: 'fc-cs-5',
        front: 'Why is hash table lookup O(1) average but O(n) worst-case?',
        back: 'In the average case, keys hash evenly across buckets. In the worst case, all keys collide into the same bucket, degrading to a linked list search of length n.',
        category: 'Data Structures',
        mastered: true,
      },
      {
        id: 'fc-cs-6',
        front: 'Calculate log₂(65,536) for binary search depth.',
        back: '65,536 = 2^16, so exactly 16 comparisons maximum!',
        category: 'Calculations',
        mastered: true,
      },
    ],
    tutorLevels: [
      {
        level: 1,
        title: 'Start Here',
        subtitle: 'Asymptotic Analysis & Big-O Notation',
        challengeQuestion: 'If an algorithm doubles its operations when input doubles, what is its Big-O complexity?',
        xpReward: 50,
      },
      {
        level: 2,
        title: 'Understand the Concept',
        subtitle: 'Binary Search & Logarithmic Scaling',
        challengeQuestion: 'In a sorted list of 1,024 elements, how many comparisons does binary search take in the worst case?',
        xpReward: 75,
      },
      {
        level: 3,
        title: 'Learn Through Examples',
        subtitle: 'Divide & Conquer: Merge Sort vs Quick Sort',
        challengeQuestion: 'Why is Merge Sort preferred over Quick Sort for linked lists?',
        xpReward: 100,
      },
      {
        level: 4,
        title: 'Practise Questions',
        subtitle: 'BFS vs DFS Traversal Mechanics',
        challengeQuestion: 'Which traversal algorithm (BFS or DFS) is guaranteed to find the shortest path in an unweighted graph?',
        xpReward: 125,
      },
      {
        level: 5,
        title: 'Complete a Challenge',
        subtitle: 'Dynamic Programming & Memoization',
        challengeQuestion: 'How does memoization reduce Fibonacci computation from O(2^n) to O(n)?',
        xpReward: 150,
      },
      {
        level: 6,
        title: 'Revise and Master',
        subtitle: 'Advanced Graph & System Architecture',
        challengeQuestion: 'What data structure prevents infinite loops when traversing a cyclic graph with BFS?',
        xpReward: 200,
      },
    ],
  },

  // ==========================================
  // 5. ENGINEERING: Electrical Circuits & Electronics (Ohm, Kirchhoff, RLC)
  // ==========================================
  {
    id: 'eng-circuits',
    title: "Electrical Circuits, Kirchhoff's Laws & AC Impedance",
    subject: 'Electronics & Communication',
    domain: 'Engineering',
    difficulty: 'Intermediate',
    summaryBadge: 'Circuit Analysis & Electronics',
    rawNotes: `Electrical Engineering - Module 1: DC Circuit Analysis & AC Fundamentals

1. Fundamental Electrical Laws:
   - Ohm's Law: V = I · R
     * Voltage V in Volts (V), Current I in Amperes (A), Resistance R in Ohms (Ω)
     * Power: P = V · I = I² · R = V² / R (Watts)

2. Kirchhoff's Laws:
   - Kirchhoff's Current Law (KCL - Conservation of Charge):
     * The algebraic sum of all currents entering any node equals zero: Σ I_in = Σ I_out
   - Kirchhoff's Voltage Law (KVL - Conservation of Energy):
     * The directed sum of potential differences around any closed circuit loop is zero: Σ V_loop = 0

3. Resistor Combinations:
   - Series: R_eq = R1 + R2 + ... + Rn (Current is identical through each)
   - Parallel: 1/R_eq = 1/R1 + 1/R2 + ... + 1/Rn (Voltage is identical across each)
     * For two parallel resistors: R_eq = (R1 · R2) / (R1 + R2)

4. AC Circuits & Reactive Impedance:
   - Capacitor Impedance: Z_C = 1 / (j·ω·C) -> |Z_C| = 1 / (2π f C)
   - Inductor Impedance: Z_L = j·ω·L -> |Z_L| = 2π f L
   - Resonance Frequency: f_0 = 1 / (2π · √(L·C))`,
    explanation: `### ⚙️ Step-by-Step Explanation: Circuit Analysis & Kirchhoff's Laws

**From Your Material:**
Electrical and electronic systems operate under conservation of charge and energy, formalized by Gustav Kirchhoff and Georg Ohm.

#### Step 1: The Core Ohm's Law Triad
Voltage ($V$) is the electrical pressure pushing charge, Current ($I$) is the rate of charge flow, and Resistance ($R$) is the restriction to that flow:
$$V = I \\cdot R \\quad \\implies \\quad I = \\frac{V}{R} \\quad \\implies \\quad R = \\frac{V}{I}$$
- **Power Dissipation:** Energy converted to heat per second:
  $$P = V \\cdot I = I^2 R = \\frac{V^2}{R}$$

#### Step 2: Conservation Principles (KCL and KVL)
1. **Kirchhoff's Current Law (KCL):** Charge cannot accumulate in an infinitely small node. The total current entering a junction must equal the total current leaving:
   $$\\sum I_{\\text{in}} = \\sum I_{\\text{out}}$$
2. **Kirchhoff's Voltage Law (KVL):** As an electron travels around any closed electrical loop, the energy it gains from sources equals the energy it drops across components:
   $$\\sum V_{\\text{sources}} - \\sum I R = 0$$

#### Step 3: Fast Parallel Resistor Formula
For two resistors $R_1$ and $R_2$ in parallel:
$$R_{\\text{eq}} = \\frac{R_1 \\cdot R_2}{R_1 + R_2}$$
- *Example:* Two $6\\,\\Omega$ resistors in parallel give:
  $$R_{\\text{eq}} = \\frac{6 \\times 6}{6 + 6} = \\frac{36}{12} = 3\\,\\Omega$$
Notice that equivalent resistance in parallel is **always smaller than the smallest branch**!

#### Step 4: Frequency Response in AC Filters
In AC circuits, inductors resist high frequencies ($|Z_L| = \\omega L$), while capacitors pass high frequencies and block DC ($|Z_C| = \\frac{1}{\\omega C}$). At the resonance frequency $\\omega_0 = \\frac{1}{\\sqrt{LC}}$, inductive and capacitive reactances cancel out!

---

### 💡 Remember This
- When applying KVL, pick a consistent loop direction (clockwise or counter-clockwise) and stick to standard sign conventions!
- Open circuits have $I = 0$; short circuits have $V = 0$.`,
    summary: `## 📋 Revision Sheet: Electrical Circuits & Network Theorems

### 1. Executive Summary
Circuit analysis resolves branch voltages and currents using Ohm's Law, KCL at nodes, and KVL along mesh loops, extending to complex impedance $Z$ in AC regimes.

### 2. Formulas & Network Equations
| Circuit Law | Expression | Physical Principle |
| :--- | :--- | :--- |
| **Ohm's Law** | $V = I \\cdot R$ | Linear resistivity |
| **KCL** | $\\sum I_{\\text{node}} = 0$ | Conservation of Electric Charge |
| **KVL** | $\\sum V_{\\text{loop}} = 0$ | Conservation of Energy |
| **Two Parallel Resistors** | $R_{\\text{eq}} = \\frac{R_1 R_2}{R_1 + R_2}$ | Current division |
| **Capacitor Current** | $i(t) = C \\frac{dv}{dt}$ | Displacement current |
| **Inductor Voltage** | $v(t) = L \\frac{di}{dt}$ | Faraday induction |
| **LC Resonance** | $f_0 = \\frac{1}{2\\pi \\sqrt{LC}}$ | Zero net reactance |

### 3. Exam Problem Checklist
- [ ] In a node with $10\\,\\text{A}$ and $4\\,\\text{A}$ entering, what current leaves? ($14\\,\\text{A}$).
- [ ] If a $12\\,\\text{V}$ battery powers a $4\\,\\Omega$ resistor, what is the power dissipated? ($P = V^2 / R = 144 / 4 = 36\\,\\text{W}$).`,
    quiz: [
      {
        question: 'A 12V DC source is connected across two 6Ω resistors in parallel. What is the total current drawn?',
        options: ['1 A', '2 A', '4 A', '8 A'],
        correctIndex: 2,
        explanation: 'Two 6Ω resistors in parallel have R_eq = (6 * 6)/(6 + 6) = 3Ω. By Ohm\'s Law, I = V / R_eq = 12V / 3Ω = 4A.',
        topic: 'Electronics & Communication',
        difficulty: 'Beginner',
        calculation: 'R_eq = 3, I = 12 / 3 = 4 A',
        numericAnswer: 4,
      },
      {
        question: "Kirchhoff's Current Law (KCL) is a direct consequence of which fundamental conservation law?",
        options: [
          'Conservation of Momentum',
          'Conservation of Electric Charge',
          'Conservation of Energy',
          'Conservation of Angular Momentum',
        ],
        correctIndex: 1,
        explanation: 'KCL states that charge cannot be created or destroyed at any circuit node, representing the Conservation of Electric Charge.',
        topic: 'Electronics & Communication',
        difficulty: 'Beginner',
      },
      {
        question: 'What is the power dissipated by a 5Ω resistor carrying a current of 2A?',
        options: ['10 W', '20 W', '25 W', '50 W'],
        correctIndex: 1,
        explanation: 'Power P = I² · R. Here, I = 2A and R = 5Ω, so P = (2)² · 5 = 4 · 5 = 20 Watts.',
        topic: 'Electronics & Communication',
        difficulty: 'Beginner',
        calculation: 'P = 2^2 * 5 = 20 W',
        numericAnswer: 20,
      },
      {
        question: 'How does an ideal capacitor behave in a steady-state DC circuit?',
        options: [
          'As a short circuit (zero resistance)',
          'As an open circuit (infinite resistance)',
          'As a constant 10Ω load',
          'As an oscillating AC voltage source',
        ],
        correctIndex: 1,
        explanation: 'Since i = C · (dv/dt), at steady-state DC voltage is constant (dv/dt = 0), meaning no current flows through the capacitor; it acts as an open circuit.',
        topic: 'Electronics & Communication',
        difficulty: 'Intermediate',
      },
      {
        question: 'What is the formula for the resonant frequency f₀ of an LC tank circuit?',
        options: [
          'f₀ = 2π √(L·C)',
          'f₀ = 1 / (2π √(L·C))',
          'f₀ = √(L / C)',
          'f₀ = 1 / (L · C)',
        ],
        correctIndex: 1,
        explanation: 'Resonance occurs when inductive reactance equals capacitive reactance (ωL = 1/(ωC)), giving ω = 1/√(LC) and f₀ = 1 / (2π√(LC)).',
        topic: 'Electronics & Communication',
        difficulty: 'Intermediate',
      },
    ],
    flashcards: [
      {
        id: 'fc-eng-1',
        front: "State Ohm's Law and its three algebraic variants.",
        back: 'V = I · R (Voltage = Current × Resistance). I = V / R. R = V / I.',
        category: 'Basic Law',
        mastered: true,
      },
      {
        id: 'fc-eng-2',
        front: "What is Kirchhoff's Current Law (KCL) and its physical basis?",
        back: 'The algebraic sum of currents entering a junction is zero (Σ I_in = Σ I_out). Based on Conservation of Electric Charge.',
        category: 'Circuit Laws',
        mastered: false,
      },
      {
        id: 'fc-eng-3',
        front: "What is Kirchhoff's Voltage Law (KVL) and its physical basis?",
        back: 'The sum of potential differences around any closed loop is zero (Σ V = 0). Based on Conservation of Energy.',
        category: 'Circuit Laws',
        mastered: true,
      },
      {
        id: 'fc-eng-4',
        front: 'Calculate equivalent resistance for two 6Ω resistors in parallel.',
        back: 'R_eq = (6 × 6) / (6 + 6) = 36 / 12 = 3 Ohms.',
        category: 'Calculation',
        mastered: true,
      },
      {
        id: 'fc-eng-5',
        front: 'How do ideal capacitors and inductors behave at steady-state DC?',
        back: 'Capacitor: Open circuit (blocks DC, zero current). Inductor: Short circuit (acts like a zero-resistance wire).',
        category: 'DC Behavior',
        mastered: false,
      },
      {
        id: 'fc-eng-6',
        front: 'State the power dissipation formulas across a resistor R.',
        back: 'P = V · I = I² · R = V² / R (measured in Watts).',
        category: 'Power',
        mastered: true,
      },
    ],
    tutorLevels: [
      {
        level: 1,
        title: 'Start Here',
        subtitle: "Ohm's Law & Electrical Power",
        challengeQuestion: 'If a 9V battery is connected to a 3Ω resistor, what is the current in Amperes?',
        xpReward: 50,
      },
      {
        level: 2,
        title: 'Understand the Concept',
        subtitle: 'KCL & Current Node Junctions',
        challengeQuestion: 'At a junction, currents of 5A and 7A enter. If one branch of 4A leaves, what current leaves through the remaining branch?',
        xpReward: 75,
      },
      {
        level: 3,
        title: 'Learn Through Examples',
        subtitle: 'Series vs Parallel Resistor Networks',
        challengeQuestion: 'What is the equivalent resistance of a 10Ω and 40Ω resistor in parallel?',
        xpReward: 100,
      },
      {
        level: 4,
        title: 'Practise Questions',
        subtitle: 'KVL Loop Analysis & Mesh Current',
        challengeQuestion: 'In a single closed loop with a 24V source and three 4Ω resistors in series, what is the current?',
        xpReward: 125,
      },
      {
        level: 5,
        title: 'Complete a Challenge',
        subtitle: 'Capacitor & Inductor Transients',
        challengeQuestion: 'Why does a capacitor act as an open circuit once fully charged by a DC source?',
        xpReward: 150,
      },
      {
        level: 6,
        title: 'Revise and Master',
        subtitle: 'AC Impedance & RLC Resonance',
        challengeQuestion: 'At resonant frequency in an RLC series circuit, what is the net reactive impedance?',
        xpReward: 200,
      },
    ],
  },
];

// Backwards compatibility default exports
export const DEMO_RAW_NOTES = STEM_PRESETS[0].rawNotes;
export const DEMO_EXPLANATION = STEM_PRESETS[0].explanation;
export const DEMO_SUMMARY = STEM_PRESETS[0].summary;
export const DEMO_QUIZ = STEM_PRESETS[0].quiz;
export const DEMO_FLASHCARDS = STEM_PRESETS[0].flashcards;

export const DEMO_RESUME: ResumeData = {
  personal: {
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma.tech@gmail.com',
    phone: '+91 98765 43210',
    city: 'Bengaluru, India',
    linkedin: 'linkedin.com/in/aarav-sharma-cs',
    github: 'github.com/aarav-dev',
    portfolio: 'aaravsharma.dev',
  },
  education: {
    college: 'National Institute of Technology, Karnataka',
    degree: 'Bachelor of Technology (B.Tech)',
    branch: 'Computer Science and Engineering',
    graduationYear: '2026',
    gpa: '8.8 / 10.0',
    coursework: 'Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Operating Systems, Computer Networks',
    achievements: 'Dean\'s List for 2 consecutive semesters, Rank 14 in College Coding Olympiad',
  },
  skills: {
    languages: 'TypeScript, Python, C++, Java, SQL',
    frameworks: 'React, Node.js, Express, Tailwind CSS, Next.js',
    tools: 'Git, Docker, Linux, Postman, VS Code, Figma',
    softSkills: 'Technical Writing, Agile Collaboration, Problem Solving, Quick Learning',
    spokenLanguages: 'English (Fluent), Hindi (Native)',
  },
  projects: [
    {
      id: 'proj-1',
      name: 'AlgorithmVisualizer 3D',
      problemSolved: 'Students struggle to understand recursive graph algorithms and pathfinding intuitively.',
      technologies: 'React, Three.js, TypeScript, Tailwind CSS',
      features: 'Interactive 3D graph renderer, step-by-step Dijkstra & A* traversal, customizable node weights and speed controls.',
      userContribution: 'Engineered custom WebGL node rendering pipeline with 60 FPS performance across 1,000+ graph nodes.',
      link: 'github.com/aarav-dev/algo-viz-3d',
    },
    {
      id: 'proj-2',
      name: 'CampusMart - Peer Exchange Platform',
      problemSolved: 'College hostel students lacked a safe, verified marketplace to buy and sell textbooks and lab components.',
      technologies: 'Node.js, Express, PostgreSQL, JWT, React',
      features: 'University email OTP verification, real-time chat with Socket.io, listing categorization, and search index.',
      userContribution: 'Implemented RESTful APIs and PostgreSQL schema with Row Level Security, supporting 450+ campus test users.',
      link: 'github.com/aarav-dev/campus-mart',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Technical Club Lead (Web & Systems)',
      organization: 'Google Developer Student Club (GDSC NITK)',
      duration: 'Aug 2024 - Present',
      type: 'Club',
      contributions: 'Organized 4 campus hands-on workshops on Full-Stack Development and Open Source, mentoring 120+ first-year students.',
    },
    {
      id: 'exp-2',
      role: 'Hackathon Finalist - Smart India Hackathon',
      organization: 'Ministry of Education Innovation Cell',
      duration: 'Dec 2024',
      type: 'Hackathon',
      contributions: 'Built an offline-first emergency resource dispatch prototype in a 36-hour sprint with a team of 6 engineers.',
    },
  ],
};

export const DEMO_ANALYSIS: ResumeAnalysisResult = {
  advisoryScore: {
    total: 84,
    breakdown: {
      contentQuality: 26,
      structure: 23,
      relevance: 20,
      impactMetrics: 15,
    },
    disclaimer: 'This score is an advisory assessment based on standard engineering hiring rubrics and does not guarantee interviews or job offers.',
  },
  overview: {
    summary: 'Strong foundational profile for an undergraduate CS/IT student with solid technical projects and campus leadership.',
    strongestSections: [
      'Technical Projects (Clear technology stack and practical problem definitions)',
      'Education (Strong university standing and relevant coursework)',
      'Clean Section Hierarchy (ATS-friendly ordering and clear contact information)',
    ],
  },
  structureReview: {
    contactInfo: { status: 'pass', notes: 'Professional email, GitHub, LinkedIn, and portfolio link clearly present.' },
    education: { status: 'pass', notes: 'Degree, branch, expected graduation year, and GPA correctly formatted.' },
    skills: { status: 'pass', notes: 'Clean categorization by languages, frameworks, and developer tools.' },
    projects: { status: 'pass', notes: 'Each project has problem scope, tech stack, and verifiable links.' },
    formatting: { status: 'pass', notes: 'Standard one-page layout with clean typography.' },
  },
  contentIssues: [
    {
      type: 'missing_metrics',
      issue: 'Project 1 could include quantifiable speedup or memory efficiency numbers.',
      suggestion: 'Specify rendering efficiency (e.g., "Achieved sustained 60 FPS rendering on low-end hardware").',
    },
    {
      type: 'vague_bullet',
      issue: 'CampusMart features listing could explicitly highlight database query optimization.',
      suggestion: 'State indexing strategy or load handling (e.g., "Indexed search queries resulting in sub-50ms lookup times").',
    },
  ],
  roleMatch: {
    demonstratedSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Three.js / WebGL', 'Git'],
    missingKeywords: ['CI/CD Pipeline', 'Unit Testing (Jest / Vitest)', 'Cloud Deployment (AWS/GCP/Vercel)'],
    readinessLevel: 'High',
  },
  rewriteExamples: [
    {
      original: 'Organized 4 campus hands-on workshops on Full-Stack Development and Open Source for students.',
      improved: 'Curated and led 4 full-stack technical workshops; trained 120+ freshmen in Git version control and modern React architecture.',
      whyBetter: 'Replaces passive verb "Organized" with action-oriented "Curated and led" and highlights the specific technical curriculum.',
    },
    {
      original: 'Made an offline-first emergency resource dispatch app in a 36-hour sprint.',
      improved: 'Architected offline-first PWA for disaster dispatch under 36-hour constraints, finishing in Top 5 out of 140 regional teams.',
      whyBetter: 'Applies XYZ framework and proves competitive standing without exaggeration.',
    },
  ],
  actionPlan: [
    'Add unit testing (e.g., Jest / Vitest / Playwright) to your AlgorithmVisualizer repository.',
    'Mention containerization details (Docker Compose) in the CampusMart project.',
    'Include a 2-line targeted summary aligned with the software engineering internship spec.',
  ],
};

export const DEMO_DASHBOARD_STATS = {
  totalSessions: 28,
  quizzesCompleted: 12,
  quizAccuracy: 94,
  flashcardsReviewed: 76,
  notesCreated: 8,
  recentActivities: [
    { id: 'act-1', type: 'quiz' as const, title: "Completed Thermodynamics & Gibbs Energy Quiz", time: '40 mins ago', score: '100% (5/5)' },
    { id: 'act-2', type: 'quiz' as const, title: "Completed Newton's Laws & Dynamics Quiz", time: '2 hours ago', score: '100% (5/5)' },
    { id: 'act-3', type: 'tutor' as const, title: 'Calculated ODE Integrating Factor with Snap', time: '3 hours ago' },
    { id: 'act-4', type: 'flashcard' as const, title: 'Reviewed 12 Electrical Circuits Flashcards', time: 'Yesterday' },
    { id: 'act-5', type: 'note' as const, title: 'Transformed Algorithms & Graph Traversal Notes', time: '2 days ago' },
  ],
};
