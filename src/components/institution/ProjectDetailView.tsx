import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Building2, 
  Clock, 
  Tag, 
  CheckCircle2, 
  FileText, 
  Download, 
  ExternalLink, 
  Lock, 
  Users, 
  ShieldAlert,
  Layers,
  Sparkles,
  Cpu
} from 'lucide-react';

interface Props {
  projectId: string;
  onBack: () => void;
  onBlockAndCreateTeam: () => void;
  onOpenWorkspace: () => void;
}

export const ProjectDetailView: React.FC<Props> = ({
  projectId,
  onBack,
  onBlockAndCreateTeam,
  onOpenWorkspace
}) => {
  const { projects, currentUser, institutions, triggerError } = useApp();

  const project = projects.find(p => p.id === projectId);
  const currentInstitution = institutions.find(i => i.id === currentUser?.institutionId);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-600">Problem statement not found.</p>
        <button onClick={onBack} className="mt-4 text-xs font-semibold text-sky-700 underline">
          Back to Listings
        </button>
      </div>
    );
  }

  const isAvailable = project.status === 'Available';
  const isSelectedByThisInstitution = project.selectedByInstitutionId === currentUser?.institutionId;
  const isSelectedByOther = !!project.selectedByInstitutionId && !isSelectedByThisInstitution;

  const handleSelectionAttempt = () => {
    if (!currentUser || currentUser.role !== 'institution') {
      triggerError('Project Selection Errors', 'Only authenticated institutions may select a project.');
      return;
    }

    if (isSelectedByOther) {
      triggerError('Project Selection Errors', `This problem statement has already been selected by ${project.selectedByInstitutionName || 'another institution'}.`);
      return;
    }

    if (currentInstitution?.selectedProjectId && currentInstitution.selectedProjectId !== project.id) {
      triggerError('Project Selection Errors', 'Your institution already has an active project workspace. Under the one-institution-per-project rule, please complete your active project first.');
      return;
    }

    onBlockAndCreateTeam();
  };

  const handleDownloadFile = (fileName: string) => {
    // Generate simulated text download
    const element = document.createElement('a');
    const file = new Blob([`Triple Helix Portal - Chengalpattu Innovation District\nAttachment: ${fileName}\nProject: ${project.id} - ${project.title}\nTimestamp: ${new Date().toISOString()}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Problem Statements</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">
            ID: <strong>{project.id}</strong>
          </span>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
            project.status === 'Available'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : project.status === 'In Progress'
              ? 'bg-sky-50 text-sky-700 border border-sky-200'
              : 'bg-slate-100 text-slate-700 border border-slate-300'
          }`}>
            {project.status}
          </span>
        </div>
      </div>

      {/* User Session Banner */}
      <div className={`p-4 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        currentUser 
          ? 'bg-blue-950 text-white border-blue-900 shadow-2xs' 
          : 'bg-amber-50 text-amber-950 border-amber-200'
      }`}>
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${currentUser ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'}`} />
          {currentUser ? (
            <div>
              <span className="font-bold text-white">{currentUser.name}</span>
              <span className="text-blue-200 ml-1.5 uppercase font-mono text-[11px] font-bold">({currentUser.role})</span>
              <span className="text-slate-300 ml-2">· {currentInstitution?.name || 'Verified Account'}</span>
            </div>
          ) : (
            <span>Viewing as Public Guest · Please log in to claim or manage team workspaces.</span>
          )}
        </div>
        {currentUser && (
          <span className="text-[11px] text-emerald-300 font-mono font-bold bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-600/30 w-fit">
            ACTIVE SESSION
          </span>
        )}
      </div>

      {/* Main Details Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="bg-slate-50 border-b border-slate-200 p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-sky-800 bg-sky-100/70 px-2.5 py-1 rounded-md">
              {project.department}
            </span>
            <span className="text-slate-500">·</span>
            <span className="font-medium text-slate-600">
              {project.sector}
            </span>
            <span className="text-slate-500">·</span>
            <span className="font-mono text-slate-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {project.duration}
            </span>
            <span className="text-slate-500">·</span>
            <span className="font-medium text-slate-700 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-sky-600" />
              {project.technologyCategory}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            {project.title}
          </h1>

          {/* Allocation banner */}
          {isSelectedByThisInstitution ? (
            <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 text-xs text-sky-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>This problem statement is locked to your institution.</span>
              </div>
              <button
                onClick={onOpenWorkspace}
                className="font-semibold underline hover:text-sky-700"
              >
                Go to Project Workspace →
              </button>
            </div>
          ) : isSelectedByOther ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Locked: Currently assigned to <strong>{project.selectedByInstitutionName}</strong>. Each problem statement can be selected by only one institution (SRS Section 10).
              </span>
            </div>
          ) : null}
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* 1. Project Description (SRS Section 10) */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Problem Statement Description
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
              {project.description}
            </p>
          </section>

          {/* 2. Objectives (SRS Section 10) */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Objectives & Expected Outcomes
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {project.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Expected Deliverables */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Expected Deliverables
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {project.expectedDeliverables.map((del, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                  <span>{del}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 4. Required Technologies (SRS Section 10) */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Required Skills & Technologies
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.requiredSkills.map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-medium rounded-md border border-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* 5. References & Attachments (SRS Section 10) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            
            {/* References */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                References (PDFs & Documents)
              </h2>
              <div className="space-y-2">
                {project.referenceDocuments.map((ref, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                      <span className="truncate font-medium text-slate-800">{ref.title}</span>
                    </div>
                    <button
                      onClick={() => handleDownloadFile(ref.title)}
                      className="text-sky-700 hover:text-sky-900 font-medium shrink-0 ml-2 flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Attachments */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Attachments (Downloadable Datasets)
              </h2>
              <div className="space-y-2">
                {project.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Download className="w-4 h-4 text-slate-500 shrink-0" />
                      <div className="truncate">
                        <div className="truncate font-medium text-slate-800">{att.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{att.size} · {att.type}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadFile(att.name)}
                      className="text-sky-700 hover:text-sky-900 font-medium shrink-0 ml-2"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Action Zone: Block & Create Team (SRS Section 10) */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              {isAvailable ? (
                <span>Locking this project reserves it exclusively for your collegiate engineering team.</span>
              ) : isSelectedByThisInstitution ? (
                <span className="text-emerald-700 font-medium">Currently assigned to your institution team.</span>
              ) : (
                <span className="text-slate-500">This problem statement has already been selected by another institution.</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {isSelectedByThisInstitution ? (
                <button
                  onClick={onOpenWorkspace}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span>Open Active Workspace</span>
                </button>
              ) : (
                <button
                  onClick={handleSelectionAttempt}
                  disabled={!isAvailable}
                  className={`px-6 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                    isAvailable
                      ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-xs cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Block & Create Team</span>
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
