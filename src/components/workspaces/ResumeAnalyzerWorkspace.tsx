import React, { useState } from 'react';
import {
  FileSearch,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Target,
  Wand2,
  Check,
  RotateCcw,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { ResumeAnalysisResult } from '../../types';
import { DEMO_ANALYSIS, DEMO_RESUME } from '../../constants/demoData';
import { analyzeResume, improveResumeText } from '../../services/api';
import { DemoBadge } from '../common/DemoBadge';
import { FileUploadModal } from '../common/FileUploadModal';

interface ResumeAnalyzerWorkspaceProps {
  isDemoMode: boolean;
  onOpenBuilderWithData?: () => void;
}

export const ResumeAnalyzerWorkspace: React.FC<ResumeAnalyzerWorkspaceProps> = ({
  isDemoMode,
  onOpenBuilderWithData,
}) => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Section Rewriter State
  const [sectionToImprove, setSectionToImprove] = useState('');
  const [isImprovingSection, setIsImprovingSection] = useState(false);
  const [improvedSectionResult, setImprovedSectionResult] = useState<{
    original: string;
    improved: string;
    rationale: string;
  } | null>(null);

  const handleLoadSampleResume = () => {
    const sample = `${DEMO_RESUME.personal.fullName}
${DEMO_RESUME.personal.email} | ${DEMO_RESUME.personal.phone} | ${DEMO_RESUME.personal.linkedin}

EDUCATION:
${DEMO_RESUME.education.college}
${DEMO_RESUME.education.degree} in ${DEMO_RESUME.education.branch} (Graduating: ${DEMO_RESUME.education.graduationYear})
CGPA: ${DEMO_RESUME.education.gpa}
Relevant Coursework: ${DEMO_RESUME.education.coursework}

SKILLS:
Languages: ${DEMO_RESUME.skills.languages}
Frameworks: ${DEMO_RESUME.skills.frameworks}
Tools: ${DEMO_RESUME.skills.tools}

PROJECTS:
1. ${DEMO_RESUME.projects[0].name} (${DEMO_RESUME.projects[0].technologies})
${DEMO_RESUME.projects[0].userContribution}

2. ${DEMO_RESUME.projects[1].name} (${DEMO_RESUME.projects[1].technologies})
${DEMO_RESUME.projects[1].userContribution}

EXPERIENCE & ACTIVITIES:
- ${DEMO_RESUME.experience[0].role} at ${DEMO_RESUME.experience[0].organization}
${DEMO_RESUME.experience[0].contributions}`;

    setResumeText(sample);
    setJobDescription(
      'Full-Stack Software Engineering Intern: Looking for undergraduate engineers with experience in TypeScript, React, Node.js, REST APIs, unit testing, and Git version control.'
    );
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setErrorMessage('Please paste or upload your resume text first.');
      return;
    }

    setErrorMessage(null);
    setIsAnalyzing(true);

    try {
      const res = await analyzeResume(resumeText, jobDescription, isDemoMode);
      if (res.success && res.data) {
        setAnalysisResult(res.data.analysis);
      } else {
        setErrorMessage(res.message || 'Failed to complete resume audit.');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'An error occurred during resume analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImproveSection = async (textToImprove: string) => {
    if (!textToImprove.trim()) return;
    setIsImprovingSection(true);
    try {
      const res = await improveResumeText(textToImprove, 'bullet', isDemoMode);
      if (res.success && res.data) {
        setImprovedSectionResult({
          original: textToImprove,
          improved: res.data.improvedText,
          rationale: res.data.rationale,
        });
      }
    } finally {
      setIsImprovingSection(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs">
              <FileSearch className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Make Your Resume Internship-Ready
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Audit your resume structure, detect vague bullet points, match skills against job descriptions, and view side-by-side rewrites.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isDemoMode && <DemoBadge />}
          <button
            type="button"
            onClick={handleLoadSampleResume}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
          >
            Load Sample Student Resume
          </button>
        </div>
      </div>

      {/* Main Grid: Left Inputs / Right Audit Report */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Resume & Job Desc Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Resume Text
            </label>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload PDF / DOCX</span>
            </button>
          </div>

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={10}
            placeholder="Paste your current resume text here..."
            className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-hidden transition-all resize-y"
          />

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Target Internship or Job Description (Optional)
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={3}
              placeholder="Paste target role requirements to identify missing skills and relevant keywords..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !resumeText.trim()}
            className="w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-indigo-500/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Auditing Resume with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze My Resume</span>
              </>
            )}
          </button>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Notice: </strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Audit Findings & Improvement Plan (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs min-h-[560px] space-y-6">
          {analysisResult ? (
            <div className="space-y-6 animate-in fade-in">
              {/* Score & Advisory Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex flex-col items-center justify-center shadow-xs">
                    <span className="text-2xl font-black leading-none">
                      {analysisResult.advisoryScore.total}
                    </span>
                    <span className="text-[10px] font-medium text-indigo-200">/ 100</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Advisory Resume Assessment
                    </h3>
                    <p className="text-[11px] text-slate-500 max-w-sm mt-0.5">
                      {analysisResult.advisoryScore.disclaimer}
                    </p>
                  </div>
                </div>

                {/* Score Rubric Breakdown */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <div>
                    Content: <span className="font-bold text-indigo-600">{analysisResult.advisoryScore.breakdown.contentQuality}/30</span>
                  </div>
                  <div>
                    Structure: <span className="font-bold text-indigo-600">{analysisResult.advisoryScore.breakdown.structure}/25</span>
                  </div>
                  <div>
                    Relevance: <span className="font-bold text-indigo-600">{analysisResult.advisoryScore.breakdown.relevance}/25</span>
                  </div>
                  <div>
                    Metrics: <span className="font-bold text-indigo-600">{analysisResult.advisoryScore.breakdown.impactMetrics}/20</span>
                  </div>
                </div>
              </div>

              {/* Overview & Strongest Sections */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Overview & Strong Points
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {analysisResult.overview.summary}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {analysisResult.overview.strongestSections.map((sec, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{sec}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Role Match Breakdown */}
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-xs font-bold text-indigo-900">
                      Target Role Match & Keywords
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                    {analysisResult.roleMatch.readinessLevel} Readiness
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="font-bold text-emerald-800 block mb-1">
                      Demonstrated Skills:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {analysisResult.roleMatch.demonstratedSkills.map((s, idx) => (
                        <span key={idx} className="bg-white border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-md text-[11px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-amber-800 block mb-1">
                      Missing / Recommended Keywords:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {analysisResult.roleMatch.missingKeywords.map((k, idx) => (
                        <span key={idx} className="bg-white border border-amber-200 text-amber-800 px-2 py-0.5 rounded-md text-[11px]">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Concrete Before & After Rewrite Examples */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Before & After Writing Optimizations
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {analysisResult.rewriteExamples.map((ex, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
                          Original phrasing:
                        </span>
                        <p className="text-slate-600 italic mt-0.5">"{ex.original}"</p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                          Optimized (Google XYZ Format):
                        </span>
                        <p className="text-slate-900 font-medium mt-0.5">"{ex.improved}"</p>
                      </div>

                      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                        <strong>Why this works better:</strong> {ex.whyBetter}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Next Steps Checklist */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Priority Action Checklist
                </h4>
                <div className="space-y-1.5">
                  {analysisResult.actionPlan.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Section Rewriter CTA */}
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/60 space-y-3">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-bold text-indigo-900">Improve My Resume (Custom Section)</h4>
                </div>
                <p className="text-xs text-indigo-950">
                  Select or paste any weak bullet point from your resume to send it to the AI rewriter.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sectionToImprove}
                    onChange={(e) => setSectionToImprove(e.target.value)}
                    placeholder="e.g. Worked on the website front end..."
                    className="flex-1 text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleImproveSection(sectionToImprove)}
                    disabled={isImprovingSection || !sectionToImprove.trim()}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold disabled:opacity-40"
                  >
                    {isImprovingSection ? 'Rewriting...' : 'Rewrite'}
                  </button>
                </div>

                {improvedSectionResult && (
                  <div className="p-3 bg-white border border-indigo-200 rounded-lg space-y-1 text-xs">
                    <span className="font-bold text-emerald-700 block">Suggested Replacement:</span>
                    <p className="text-slate-900 font-medium">{improvedSectionResult.improved}</p>
                    <p className="text-[11px] text-slate-500 italic mt-1">
                      {improvedSectionResult.rationale}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <FileSearch className="w-12 h-12 stroke-1 mb-3 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No resume analyzed yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Paste your resume on the left or click "Load Sample Student Resume" to see a full ATS audit.
              </p>
            </div>
          )}
        </div>
      </div>

      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onTextExtracted={(text) => setResumeText(text)}
        title="Upload Resume Document"
        description="Extract text from TXT, text-based PDF, or DOCX resumes."
      />
    </div>
  );
};
