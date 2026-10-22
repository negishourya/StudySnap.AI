import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  Plus,
  Trash2,
  Wand2,
  Eye,
  Edit3,
  Layers,
  GraduationCap,
  Code,
  Briefcase,
  User,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { ResumeData } from '../../types';
import { DEMO_RESUME } from '../../constants/demoData';
import { generateResumeAI, improveResumeText } from '../../services/api';
import { DemoBadge } from '../common/DemoBadge';

interface ResumeBuilderWorkspaceProps {
  isDemoMode: boolean;
}

export const ResumeBuilderWorkspace: React.FC<ResumeBuilderWorkspaceProps> = ({ isDemoMode }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [resumeData, setResumeData] = useState<ResumeData>(DEMO_RESUME);
  const [targetRole, setTargetRole] = useState('Software Engineering / Tech Intern');
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'technical' | 'minimal'>('modern');

  // AI Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGeneratedData, setAiGeneratedData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isRewriting, setIsRewriting] = useState<string | null>(null);
  const [bulletRewriteResult, setBulletRewriteResult] = useState<{ id: string; improved: string } | null>(null);

  // Field change helpers
  const handlePersonalChange = (field: keyof ResumeData['personal'], value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  const handleEducationChange = (field: keyof ResumeData['education'], value: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: { ...prev.education, [field]: value },
    }));
  };

  const handleSkillsChange = (field: keyof ResumeData['skills'], value: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: { ...prev.skills, [field]: value },
    }));
  };

  // Projects helpers
  const handleAddProject = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      name: 'New Technical Project',
      problemSolved: '',
      technologies: 'React, Node.js, TypeScript',
      features: '',
      userContribution: '',
      link: 'github.com/my-username/project',
    };
    setResumeData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProj],
    }));
  };

  const handleRemoveProject = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const handleProjectChange = (id: string, field: string, val: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, [field]: val } : p)),
    }));
  };

  // Experience helpers
  const handleAddExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      role: 'Project Contributor / Club Member',
      organization: 'College Technical Society',
      duration: '2024 - Present',
      type: 'Club' as const,
      contributions: '',
    };
    setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }));
  };

  const handleRemoveExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
    }));
  };

  const handleExperienceChange = (id: string, field: string, val: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === id ? { ...e, [field]: val } : e)),
    }));
  };

  // Generate with AI
  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const res = await generateResumeAI(resumeData, targetRole, isDemoMode);
      if (res.success && res.data) {
        setAiGeneratedData(res.data.resumeData);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Rewrite single bullet
  const handleRewriteBullet = async (id: string, originalText: string) => {
    if (!originalText.trim()) return;
    setIsRewriting(id);
    try {
      const res = await improveResumeText(originalText, 'bullet', isDemoMode);
      if (res.success && res.data) {
        setBulletRewriteResult({ id, improved: res.data.improvedText });
      }
    } finally {
      setIsRewriting(null);
    }
  };

  const applyRewrittenBullet = (projectId: string, newText: string) => {
    handleProjectChange(projectId, 'userContribution', newText);
    setBulletRewriteResult(null);
  };

  // Real PDF Download with jsPDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const margin = 15;
    let y = 18;

    // Header: Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.text(resumeData.personal.fullName || 'Student Name', margin, y);
    y += 6;

    // Contact line
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139); // Slate-500
    const contactParts = [
      resumeData.personal.email,
      resumeData.personal.phone,
      resumeData.personal.city,
      resumeData.personal.linkedin,
      resumeData.personal.github,
    ].filter(Boolean);
    doc.text(contactParts.join('  |  '), margin, y);
    y += 7;

    // Divider
    doc.setDrawColor(203, 213, 225);
    doc.line(margin, y, 210 - margin, y);
    y += 6;

    // Summary
    const summaryText =
      aiGeneratedData?.summary ||
      `Undergraduate engineering student with strong technical foundation in ${resumeData.skills.languages || 'programming'}, aiming to apply problem-solving skills in ${targetRole}.`;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(79, 70, 229); // Indigo
    doc.text('PROFESSIONAL SUMMARY', margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    const splitSummary = doc.splitTextToSize(summaryText, 210 - margin * 2);
    doc.text(splitSummary, margin, y);
    y += splitSummary.length * 4.5 + 4;

    // Education
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(79, 70, 229);
    doc.text('EDUCATION', margin, y);
    y += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${resumeData.education.college} — ${resumeData.education.degree}`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`Grad: ${resumeData.education.graduationYear || '2026'}`, 210 - margin - 22, y);
    y += 4.5;

    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Branch: ${resumeData.education.branch} | GPA: ${resumeData.education.gpa || 'N/A'}`, margin, y);
    y += 4;
    if (resumeData.education.coursework) {
      doc.text(`Relevant Coursework: ${resumeData.education.coursework}`, margin, y);
      y += 6;
    } else {
      y += 3;
    }

    // Technical Skills
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(79, 70, 229);
    doc.text('TECHNICAL SKILLS', margin, y);
    y += 5;

    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    if (resumeData.skills.languages) {
      doc.setFont('helvetica', 'bold');
      doc.text('Languages: ', margin, y);
      doc.setFont('helvetica', 'normal');
      doc.text(resumeData.skills.languages, margin + 22, y);
      y += 4.5;
    }
    if (resumeData.skills.frameworks) {
      doc.setFont('helvetica', 'bold');
      doc.text('Frameworks: ', margin, y);
      doc.setFont('helvetica', 'normal');
      doc.text(resumeData.skills.frameworks, margin + 22, y);
      y += 4.5;
    }
    if (resumeData.skills.tools) {
      doc.setFont('helvetica', 'bold');
      doc.text('Developer Tools: ', margin, y);
      doc.setFont('helvetica', 'normal');
      doc.text(resumeData.skills.tools, margin + 26, y);
      y += 6;
    }

    // Projects
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(79, 70, 229);
    doc.text('KEY TECHNICAL PROJECTS', margin, y);
    y += 5;

    resumeData.projects.forEach((proj) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(proj.name, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      if (proj.link) doc.text(proj.link, 210 - margin - 50, y);
      y += 4.5;

      doc.setTextColor(71, 85, 105);
      doc.text(`Tech: ${proj.technologies}`, margin, y);
      y += 4;

      const bullet = proj.userContribution || proj.features || proj.problemSolved;
      if (bullet) {
        const splitBullet = doc.splitTextToSize(`• ${bullet}`, 210 - margin * 2);
        doc.text(splitBullet, margin, y);
        y += splitBullet.length * 4 + 2;
      }
    });

    // Experience / Extracurriculars
    if (resumeData.experience.length > 0) {
      y += 2;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(79, 70, 229);
      doc.text('EXPERIENCE & ACHIEVEMENTS', margin, y);
      y += 5;

      resumeData.experience.forEach((exp) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        doc.text(`${exp.role} — ${exp.organization}`, margin, y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text(exp.duration, 210 - margin - 35, y);
        y += 4.5;

        if (exp.contributions) {
          doc.setTextColor(71, 85, 105);
          const splitCont = doc.splitTextToSize(`• ${exp.contributions}`, 210 - margin * 2);
          doc.text(splitCont, margin, y);
          y += splitCont.length * 4 + 2;
        }
      });
    }

    doc.save(`${(resumeData.personal.fullName || 'student').toLowerCase().replace(/\s+/g, '_')}_resume.pdf`);
  };

  const handleCopyResumeText = () => {
    const raw = `${resumeData.personal.fullName}
${resumeData.personal.email} | ${resumeData.personal.phone || ''} | ${resumeData.personal.linkedin || ''}

SUMMARY:
${aiGeneratedData?.summary || 'Undergraduate student seeking engineering opportunities.'}

EDUCATION:
${resumeData.education.college} - ${resumeData.education.degree} (${resumeData.education.branch})
Graduation: ${resumeData.education.graduationYear} | GPA: ${resumeData.education.gpa || 'N/A'}
Coursework: ${resumeData.education.coursework}

SKILLS:
Languages: ${resumeData.skills.languages}
Frameworks: ${resumeData.skills.frameworks}
Tools: ${resumeData.skills.tools}

PROJECTS:
${resumeData.projects.map((p) => `${p.name} (${p.technologies})\n- ${p.userContribution || p.features}`).join('\n\n')}

EXPERIENCE:
${resumeData.experience.map((e) => `${e.role} at ${e.organization} (${e.duration})\n- ${e.contributions}`).join('\n\n')}`;

    navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Build Your First Professional Resume
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Engineered specifically for engineering students applying for internships, hackathons, and entry-level positions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isDemoMode && <DemoBadge />}
          <button
            onClick={handleCopyResumeText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Resume'}</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* 5-Step Progress Bar */}
      <div className="grid grid-cols-5 gap-2">
        {[
          { num: 1, label: 'Personal', icon: User },
          { num: 2, label: 'Education', icon: GraduationCap },
          { num: 3, label: 'Skills', icon: Code },
          { num: 4, label: 'Projects', icon: Layers },
          { num: 5, label: 'Experience', icon: Briefcase },
        ].map((s) => {
          const Icon = s.icon;
          const isDone = currentStep > s.num;
          const isCurr = currentStep === s.num;
          return (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                isCurr
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-1 ring-indigo-500 font-bold'
                  : isDone
                  ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  : 'border-slate-100 bg-slate-50/50 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-1">
                <Icon className="w-3.5 h-3.5" />
                <span className="text-xs">{s.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Left Wizard Form & Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Wizard Steps (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          {/* STEP 1: PERSONAL DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-3 animate-in fade-in">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Step 1: Contact & Profiles
              </h3>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={resumeData.personal.fullName}
                  onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Professional Email *</label>
                  <input
                    type="email"
                    value={resumeData.personal.email}
                    onChange={(e) => handlePersonalChange('email', e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone (Optional)</label>
                  <input
                    type="text"
                    value={resumeData.personal.phone || ''}
                    onChange={(e) => handlePersonalChange('phone', e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">City & State (Optional)</label>
                <input
                  type="text"
                  value={resumeData.personal.city || ''}
                  onChange={(e) => handlePersonalChange('city', e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={resumeData.personal.linkedin || ''}
                    onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={resumeData.personal.github || ''}
                    onChange={(e) => handlePersonalChange('github', e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: EDUCATION */}
          {currentStep === 2 && (
            <div className="space-y-3 animate-in fade-in">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Step 2: University & Academics
              </h3>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">College / University *</label>
                <input
                  type="text"
                  value={resumeData.education.college}
                  onChange={(e) => handleEducationChange('college', e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Degree</label>
                  <input
                    type="text"
                    value={resumeData.education.degree}
                    onChange={(e) => handleEducationChange('degree', e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Branch / Major</label>
                  <input
                    type="text"
                    value={resumeData.education.branch}
                    onChange={(e) => handleEducationChange('branch', e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Graduation Year</label>
                  <input
                    type="text"
                    value={resumeData.education.graduationYear}
                    onChange={(e) => handleEducationChange('graduationYear', e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">CGPA / Percentage</label>
                  <input
                    type="text"
                    value={resumeData.education.gpa || ''}
                    onChange={(e) => handleEducationChange('gpa', e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Relevant Coursework</label>
                <textarea
                  rows={2}
                  value={resumeData.education.coursework}
                  onChange={(e) => handleEducationChange('coursework', e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  placeholder="Data Structures, DBMS, Operating Systems..."
                />
              </div>
            </div>
          )}

          {/* STEP 3: SKILLS */}
          {currentStep === 3 && (
            <div className="space-y-3 animate-in fade-in">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Step 3: Technical Skills & Tools
              </h3>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Programming Languages
                </label>
                <input
                  type="text"
                  value={resumeData.skills.languages}
                  onChange={(e) => handleSkillsChange('languages', e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  placeholder="C++, Python, TypeScript, Java..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Frameworks & Libraries
                </label>
                <input
                  type="text"
                  value={resumeData.skills.frameworks}
                  onChange={(e) => handleSkillsChange('frameworks', e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  placeholder="React, Node.js, Express, Tailwind CSS..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Developer Tools & Databases
                </label>
                <input
                  type="text"
                  value={resumeData.skills.tools}
                  onChange={(e) => handleSkillsChange('tools', e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  placeholder="Git, Docker, PostgreSQL, Linux, VS Code..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Soft Skills & Spoken Languages
                </label>
                <input
                  type="text"
                  value={resumeData.skills.softSkills}
                  onChange={(e) => handleSkillsChange('softSkills', e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  placeholder="Agile Collaboration, Technical Writing..."
                />
              </div>
            </div>
          )}

          {/* STEP 4: PROJECTS */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Step 4: Technical Projects</h3>
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 font-semibold hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              {resumeData.projects.map((proj, pIdx) => (
                <div key={proj.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Project #{pIdx + 1}</span>
                    {resumeData.projects.length > 1 && (
                      <button
                        onClick={() => handleRemoveProject(proj.id)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={proj.name}
                    onChange={(e) => handleProjectChange(proj.id, 'name', e.target.value)}
                    placeholder="Project Name"
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-semibold"
                  />

                  <input
                    type="text"
                    value={proj.technologies}
                    onChange={(e) => handleProjectChange(proj.id, 'technologies', e.target.value)}
                    placeholder="Technologies Used (e.g. React, TypeScript, Three.js)"
                    className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg"
                  />

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-semibold text-slate-500">
                        Key Accomplishment (Bullet Point)
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRewriteBullet(proj.id, proj.userContribution)}
                        disabled={isRewriting === proj.id}
                        className="text-[10px] text-indigo-600 hover:underline inline-flex items-center gap-1 font-semibold"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>{isRewriting === proj.id ? 'Optimizing...' : 'Rewrite Bullet with AI'}</span>
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={proj.userContribution}
                      onChange={(e) => handleProjectChange(proj.id, 'userContribution', e.target.value)}
                      placeholder="e.g. Engineered custom WebGL rendering pipeline achieving 60 FPS across 1,000+ graph nodes..."
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg"
                    />

                    {bulletRewriteResult && bulletRewriteResult.id === proj.id && (
                      <div className="mt-2 p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg text-xs space-y-1.5">
                        <span className="font-bold text-indigo-900 block">AI Suggestion (XYZ Formula):</span>
                        <p className="text-slate-800">{bulletRewriteResult.improved}</p>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setBulletRewriteResult(null)}
                            className="text-[11px] text-slate-500 hover:text-slate-700"
                          >
                            Dismiss
                          </button>
                          <button
                            type="button"
                            onClick={() => applyRewrittenBullet(proj.id, bulletRewriteResult.improved)}
                            className="text-[11px] font-semibold bg-indigo-600 text-white px-2 py-1 rounded-md"
                          >
                            Apply Suggestion
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 5: EXPERIENCE & ACHIEVEMENTS */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Step 5: Hackathons, Clubs & Experience
                </h3>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 font-semibold hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Freshers with no full-time job experience can feature college clubs, hackathon projects, certifications, or open-source commits.
              </p>

              {resumeData.experience.map((exp) => (
                <div key={exp.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => handleExperienceChange(exp.id, 'role', e.target.value)}
                      placeholder="Role (e.g. Hackathon Finalist, Club Lead)"
                      className="text-xs p-1.5 bg-white border border-slate-200 rounded-lg font-semibold w-2/3"
                    />
                    <button
                      onClick={() => handleRemoveExperience(exp.id)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={exp.organization}
                      onChange={(e) => handleExperienceChange(exp.id, 'organization', e.target.value)}
                      placeholder="Organization / Event"
                      className="text-xs p-1.5 bg-white border border-slate-200 rounded-lg"
                    />
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => handleExperienceChange(exp.id, 'duration', e.target.value)}
                      placeholder="Duration (e.g. Dec 2024)"
                      className="text-xs p-1.5 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={exp.contributions}
                    onChange={(e) => handleExperienceChange(exp.id, 'contributions', e.target.value)}
                    placeholder="Key impact, awards won, or deliverables completed..."
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Stepper Navigation & AI Synthesis CTA */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-100"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Synthesizing...' : 'Improve Writing with AI'}</span>
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Live ATS Resume Preview (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-md p-7 min-h-[680px] font-sans text-slate-800 space-y-4">
          {/* Resume Header */}
          <div className="text-center border-b border-slate-200 pb-4 space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {resumeData.personal.fullName || 'Your Name'}
            </h1>
            <div className="text-xs text-slate-600 flex flex-wrap items-center justify-center gap-2">
              <span>{resumeData.personal.email}</span>
              {resumeData.personal.phone && <span>• {resumeData.personal.phone}</span>}
              {resumeData.personal.city && <span>• {resumeData.personal.city}</span>}
              {resumeData.personal.linkedin && <span>• {resumeData.personal.linkedin}</span>}
              {resumeData.personal.github && <span>• {resumeData.personal.github}</span>}
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b border-indigo-100 pb-0.5">
              Professional Summary
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              {aiGeneratedData?.summary ||
                `Focused undergraduate student in ${resumeData.education.branch || 'Engineering'}, possessing practical proficiency in ${resumeData.skills.languages || 'modern software development'}. Eager to contribute disciplined analytical problem solving to internship initiatives.`}
            </p>
          </div>

          {/* Education */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b border-indigo-100 pb-0.5">
              Education
            </h4>
            <div className="flex items-start justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900">{resumeData.education.college}</span>
                <span className="text-slate-600 block">
                  {resumeData.education.degree} in {resumeData.education.branch}
                </span>
              </div>
              <div className="text-right text-slate-500 font-mono text-[11px]">
                <span>Grad: {resumeData.education.graduationYear || '2026'}</span>
                {resumeData.education.gpa && <span className="block font-semibold">GPA: {resumeData.education.gpa}</span>}
              </div>
            </div>
            {resumeData.education.coursework && (
              <p className="text-[11px] text-slate-600">
                <strong>Coursework:</strong> {resumeData.education.coursework}
              </p>
            )}
          </div>

          {/* Skills */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b border-indigo-100 pb-0.5">
              Technical Skills
            </h4>
            <div className="text-xs space-y-1 text-slate-700">
              {resumeData.skills.languages && (
                <div>
                  <strong className="text-slate-900">Languages:</strong> {resumeData.skills.languages}
                </div>
              )}
              {resumeData.skills.frameworks && (
                <div>
                  <strong className="text-slate-900">Frameworks:</strong> {resumeData.skills.frameworks}
                </div>
              )}
              {resumeData.skills.tools && (
                <div>
                  <strong className="text-slate-900">Tools & Platforms:</strong> {resumeData.skills.tools}
                </div>
              )}
            </div>
          </div>

          {/* Projects */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b border-indigo-100 pb-0.5">
              Featured Projects
            </h4>
            {resumeData.projects.map((proj) => (
              <div key={proj.id} className="text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{proj.name}</span>
                  {proj.link && (
                    <span className="text-[11px] text-indigo-600 font-mono flex items-center gap-1">
                      {proj.link}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 italic">Tech: {proj.technologies}</div>
                <p className="text-slate-700 pl-3 border-l-2 border-indigo-200">
                  {proj.userContribution || proj.features || proj.problemSolved}
                </p>
              </div>
            ))}
          </div>

          {/* Experience */}
          {resumeData.experience.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b border-indigo-100 pb-0.5">
                Experience & Leadership
              </h4>
              {resumeData.experience.map((exp) => (
                <div key={exp.id} className="text-xs space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      {exp.role} — {exp.organization}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">{exp.duration}</span>
                  </div>
                  {exp.contributions && (
                    <p className="text-slate-700 pl-3 border-l-2 border-indigo-200">
                      {exp.contributions}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
