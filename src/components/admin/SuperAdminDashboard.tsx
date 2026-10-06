import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, TechnologyCategory, Milestone, Institution, Mentor } from '../../types';
import { CollectorDashboard } from '../collector/CollectorDashboard';
import { HeroSlideshowManager } from './HeroSlideshowManager';
import { FaqContactManager } from './FaqContactManager';
import { CollectorSubAccountManager } from './CollectorSubAccountManager';
import { 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Archive, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  Users, 
  FileText, 
  History, 
  Layers, 
  Clock, 
  Upload, 
  MessageSquare, 
  Send,
  AlertCircle,
  Eye,
  X,
  Sparkles,
  HelpCircle,
  Calendar,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Award,
  Phone,
  Mail,
  MapPin,
  Globe,
  Check,
  Search,
  Filter,
  Landmark,
  Lock,
  Tag
} from 'lucide-react';

interface Props {
  onOpenCertificates: (projectId: string) => void;
}

export const SuperAdminDashboard: React.FC<Props> = ({ onOpenCertificates }) => {
  const { 
    projects, 
    institutions, 
    mentors, 
    auditLogs, 
    heroSlides,
    createProject, 
    editProject, 
    archiveProject, 
    deleteProject, 
    reviewMilestoneAction, 
    assignMentorToProject,
    approveInstitution,
    rejectInstitution,
    approveMentor,
    rejectMentor,
    triggerError 
  } = useApp();

  // Pending Institutional & Mentor Registrations
  const pendingInstitutions = institutions.filter(i => i.status === 'Pending');
  const pendingMentors = mentors.filter(m => m.status === 'Pending');

  // Filter tab states
  const [instFilter, setInstFilter] = useState<'All' | 'Pending' | 'Active' | 'Rejected'>('All');
  const [mentorFilter, setMentorFilter] = useState<'All' | 'Pending' | 'Active' | 'Rejected'>('All');
  const [projectSearch, setProjectSearch] = useState('');

  // Rejection Modals
  const [rejectInstTarget, setRejectInstTarget] = useState<string | null>(null);
  const [rejectInstReason, setRejectInstReason] = useState<string>('');
  const [rejectMentorTarget, setRejectMentorTarget] = useState<string | null>(null);
  const [rejectMentorReason, setRejectMentorReason] = useState<string>('');
  const [actionToast, setActionToast] = useState<string | null>(null);

  // Institution Audit & Approval Confirmation Modal
  const [institutionToReview, setInstitutionToReview] = useState<Institution | null>(null);

  // Super Admin Dedicated Sub-Pages
  const [adminTab, setAdminTab] = useState<'reviews' | 'projects' | 'analytics' | 'institutions' | 'mentors' | 'slides' | 'faq-contact' | 'collector-governance' | 'audit'>('reviews');

  // Project Create/Edit Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState({
    id: '',
    title: '',
    department: 'Municipal Administration & Water Supply',
    sector: 'Urban Infrastructure',
    duration: '6 Months',
    technologyCategory: 'Software' as TechnologyCategory,
    description: '',
    objectivesText: '',
    deliverablesText: '',
    skillsText: '',
    refDocTitle: '',
    attachmentName: ''
  });

  // Confirmation Before Saving Problem Statement
  const [confirmSaveModalOpen, setConfirmSaveModalOpen] = useState(false);
  const [pendingSaveData, setPendingSaveData] = useState<{
    isEdit: boolean;
    id: string;
    title: string;
    department: string;
    sector: string;
    duration: string;
    technologyCategory: TechnologyCategory;
    description: string;
    objectives: string[];
    deliverables: string[];
    skills: string[];
    refDocTitle: string;
    attachmentName: string;
  } | null>(null);

  // Assign Mentor Modal State
  const [assignModalProject, setAssignModalProject] = useState<Project | null>(null);
  const [selectedMentorId, setSelectedMentorId] = useState('');

  // Pending Reviews Count
  const pendingSubmissions = projects.flatMap(p => 
    p.milestones.filter(m => m.status === 'Submitted').map(m => ({ project: p, milestone: m }))
  );

  const handleOpenCreateProject = () => {
    setEditingProjectId(null);
    const newId = `PRJ-DST-${String(projects.length + 1).padStart(3, '0')}`;
    setProjectForm({
      id: newId,
      title: '',
      department: 'Municipal Administration & Water Supply',
      sector: 'Urban Infrastructure',
      duration: '6 Months',
      technologyCategory: 'Software',
      description: '',
      objectivesText: 'Design and deploy a field-tested municipal prototype\nEnsure high reliability and fault tolerance\nEnable open APIs for district administration integration',
      deliverablesText: 'Working hardware/software prototype\nComprehensive system documentation\nField test deployment and validation report',
      skillsText: 'Embedded Systems, IoT, React, Python, Cloud',
      refDocTitle: 'Department Operational Standard 2026.pdf',
      attachmentName: 'Baseline_District_Dataset.csv'
    });
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (p: Project) => {
    setEditingProjectId(p.id);
    setProjectForm({
      id: p.id,
      title: p.title,
      department: p.department,
      sector: p.sector,
      duration: p.duration,
      technologyCategory: p.technologyCategory,
      description: p.description,
      objectivesText: p.objectives.join('\n'),
      deliverablesText: p.expectedDeliverables.join('\n'),
      skillsText: p.requiredSkills.join(', '),
      refDocTitle: p.referenceDocuments[0]?.title || '',
      attachmentName: p.attachments[0]?.name || ''
    });
    setIsProjectModalOpen(true);
  };

  // Step 1: Pre-save validation & open confirmation modal
  const handleInitiateSaveProject = (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectForm.title.trim() || !projectForm.description.trim()) {
      triggerError('Project Selection Errors', 'Project Title and Description are required.');
      return;
    }

    const objectives = projectForm.objectivesText.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    const deliverables = projectForm.deliverablesText.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    const skills = projectForm.skillsText.split(',').map(s => s.trim()).filter(s => s.length > 0);

    setPendingSaveData({
      isEdit: !!editingProjectId,
      id: projectForm.id,
      title: projectForm.title,
      department: projectForm.department,
      sector: projectForm.sector,
      duration: projectForm.duration,
      technologyCategory: projectForm.technologyCategory,
      description: projectForm.description,
      objectives,
      deliverables,
      skills,
      refDocTitle: projectForm.refDocTitle,
      attachmentName: projectForm.attachmentName
    });

    setConfirmSaveModalOpen(true);
  };

  // Step 2: Confirmed Save Execution
  const handleExecuteConfirmedSave = () => {
    if (!pendingSaveData) return;

    if (pendingSaveData.isEdit) {
      editProject(pendingSaveData.id, {
        title: pendingSaveData.title,
        department: pendingSaveData.department,
        sector: pendingSaveData.sector,
        duration: pendingSaveData.duration,
        technologyCategory: pendingSaveData.technologyCategory,
        description: pendingSaveData.description,
        objectives: pendingSaveData.objectives,
        expectedDeliverables: pendingSaveData.deliverables,
        requiredSkills: pendingSaveData.skills
      });
      setActionToast(`Problem Statement ${pendingSaveData.id} updated successfully in public repository!`);
    } else {
      createProject({
        id: pendingSaveData.id,
        title: pendingSaveData.title,
        department: pendingSaveData.department,
        sector: pendingSaveData.sector,
        duration: pendingSaveData.duration,
        technologyCategory: pendingSaveData.technologyCategory,
        description: pendingSaveData.description,
        objectives: pendingSaveData.objectives,
        expectedDeliverables: pendingSaveData.deliverables,
        requiredSkills: pendingSaveData.skills,
        referenceDocuments: [
          { title: pendingSaveData.refDocTitle || 'Departmental Specifications.pdf', type: 'PDF', url: '#', size: '2.5 MB' }
        ],
        attachments: [
          { name: pendingSaveData.attachmentName || 'Field_Survey_Data.csv', size: '1.2 MB', type: 'CSV' }
        ]
      });
      setActionToast(`Problem Statement ${pendingSaveData.id} published live to public repository!`);
    }

    setConfirmSaveModalOpen(false);
    setIsProjectModalOpen(false);
    setPendingSaveData(null);
    setTimeout(() => setActionToast(null), 4500);
  };

  // Execute Confirmed Institution Approval
  const handleExecuteInstitutionApproval = (instId: string) => {
    approveInstitution(instId);
    setInstitutionToReview(null);
    setActionToast(`Official approval granted! Notification and login credentials dispatched to coordinator.`);
    setTimeout(() => setActionToast(null), 4500);
  };

  // Filtered projects
  const filteredProjects = projects.filter(p => {
    if (!projectSearch.trim()) return true;
    const q = projectSearch.toLowerCase();
    return p.id.toLowerCase().includes(q) || p.title.toLowerCase().includes(q) || p.department.toLowerCase().includes(q);
  });

  // Navigation pages list
  const subPages = [
    {
      id: 'reviews' as const,
      label: 'Milestone Oversight',
      badge: pendingSubmissions.length > 0 ? pendingSubmissions.length : undefined,
      badgeColor: 'bg-amber-400 text-slate-950',
      icon: <Clock className="w-4 h-4" />,
      desc: 'Industry Mentor reviews & oversight'
    },
    {
      id: 'projects' as const,
      label: 'Problem Statements',
      badge: projects.length,
      badgeColor: 'bg-blue-100 text-blue-900',
      icon: <Layers className="w-4 h-4" />,
      desc: 'Create, curate & edit challenges'
    },
    {
      id: 'institutions' as const,
      label: 'Academic Institutions',
      badge: pendingInstitutions.length > 0 ? `${pendingInstitutions.length} Pending` : undefined,
      badgeColor: 'bg-amber-400 text-slate-950 animate-pulse',
      icon: <Building2 className="w-4 h-4" />,
      desc: 'Audit profiles, claims & approve'
    },
    {
      id: 'mentors' as const,
      label: 'Industry Mentors',
      badge: pendingMentors.length > 0 ? `${pendingMentors.length} Pending` : undefined,
      badgeColor: 'bg-amber-400 text-slate-950 animate-pulse',
      icon: <Users className="w-4 h-4" />,
      desc: 'Accreditation & project pairing'
    },
    {
      id: 'analytics' as const,
      label: 'Executive Analytics',
      icon: <ShieldCheck className="w-4 h-4" />,
      desc: 'District innovation KPIs & charts'
    },
    {
      id: 'collector-governance' as const,
      label: 'Collector Sub-Accounts',
      icon: <Calendar className="w-4 h-4" />,
      desc: 'Staff logins & category scope'
    },
    {
      id: 'slides' as const,
      label: 'Hero Showcase Slides',
      icon: <Sparkles className="w-4 h-4" />,
      desc: 'Homepage pictures & headlines'
    },
    {
      id: 'faq-contact' as const,
      label: 'FAQ & Office Contact',
      icon: <HelpCircle className="w-4 h-4" />,
      desc: 'Inquiries, address & questions'
    },
    {
      id: 'audit' as const,
      label: 'System Audit Trail',
      badge: auditLogs.length,
      badgeColor: 'bg-slate-200 text-slate-800',
      icon: <History className="w-4 h-4" />,
      desc: 'Immutable logs of all actions'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Official Government Blue Super Admin Master Header */}
      <div className="bg-gradient-to-r from-[#0c2340] via-[#0d2a63] to-[#1769AA] text-white rounded-3xl p-6 sm:p-8 shadow-md border border-blue-900/60 relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-sky-200 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>District Innovation Mission · Super Admin Master Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Super Admin Governance Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Autonomous authority for public problem statement curation, collegiate milestone validation, institutional verification audits, and district-wide security oversight.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleOpenCreateProject}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Problem Statement</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Super Admin Dedicated Sub-Page Navigation Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Select Governance Page</span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Active: <strong>{subPages.find(p => p.id === adminTab)?.label}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {subPages.map((page) => {
            const isActive = adminTab === page.id;
            return (
              <button
                key={page.id}
                onClick={() => setAdminTab(page.id)}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#0c2340] text-white border-[#0c2340] shadow-md ring-2 ring-blue-500/20 scale-[1.02]'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90 shadow-2xs hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/10 text-amber-300' : 'bg-blue-50 text-blue-700'}`}>
                    {page.icon}
                  </div>
                  {page.badge && (
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${page.badgeColor}`}>
                      {page.badge}
                    </span>
                  )}
                </div>
                <div>
                  <div className={`text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-slate-900'}`}>
                    {page.label}
                  </div>
                  <div className={`text-[10px] line-clamp-1 mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                    {page.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Sub-Page Container */}
      <div className="space-y-6">

        {/* ========================================================= */}
        {/* SUB-PAGE 1: MILESTONE REVIEWS (BLUE THEME)                */}
        {/* ========================================================= */}
        {adminTab === 'reviews' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Milestone Evaluation & Industry Mentor Oversight</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Collegiate Milestone Submissions ({pendingSubmissions.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Technical milestones are evaluated and approved directly by assigned Industry Mentors. Super Admin oversees timeline integrity and district compliance.
                </p>
              </div>

              {pendingSubmissions.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 text-blue-900 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                  <span>{pendingSubmissions.length} Milestone{pendingSubmissions.length > 1 ? 's' : ''} in Progress</span>
                </div>
              )}
            </div>

            {pendingSubmissions.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-3 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500" />
                <h3 className="text-base font-bold text-slate-800">All Milestone Reviews Are Up To Date</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  No collegiate team milestone submissions are currently awaiting Industry Mentor review. New submissions from student workspaces will automatically appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingSubmissions.map(({ project, milestone }) => {
                  const assignedMentor = mentors.find(m => m.id === project.assignedMentorId);

                  return (
                    <div key={`${project.id}-${milestone.id}`} className="p-5 rounded-2xl border border-blue-200 bg-blue-50/20 space-y-4 text-xs shadow-2xs hover:shadow-xs transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-md">
                              {project.id}
                            </span>
                            <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[11px]">
                              {project.department}
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-1.5">
                            {project.title}
                          </h3>
                          <p className="text-slate-600 mt-0.5">
                            Claimed Institution: <strong className="text-slate-800">{project.selectedByInstitutionName}</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="bg-blue-600 text-white font-bold px-3 py-1 rounded-xl text-xs shadow-2xs">
                            Milestone {milestone.id}: {milestone.name.split('–')[1] || milestone.name}
                          </span>
                        </div>
                      </div>

                      {/* Submission text & uploaded files */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            {milestone.submissionTitle}
                          </span>
                          <span className="text-slate-500 font-mono text-[11px]">
                            Submitted: {milestone.submissionDate}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed text-xs">
                          {milestone.submissionDescription}
                        </p>

                        {milestone.uploadedFiles && milestone.uploadedFiles.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                            {milestone.uploadedFiles.map((f, i) => (
                              <span key={i} className="bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-mono text-[11px]">
                                <FileText className="w-3.5 h-3.5 text-blue-600" />
                                <span>{f.fileName}</span>
                                <span className="text-slate-400">({f.fileSize})</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Industry Mentor Evaluation Status & Oversight Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-blue-100/60">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-500">Assigned Evaluator:</span>
                          <span className="font-bold text-blue-900 bg-white border border-blue-200 px-2.5 py-1 rounded-lg">
                            {assignedMentor ? `${assignedMentor.fullName} (${assignedMentor.organization})` : 'Industry Expert Mentor (Assigned)'}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold text-[10px]">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Awaiting Mentor Review</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setActionToast(`Automated milestone review reminder dispatched to ${assignedMentor?.fullName || 'Assigned Industry Mentor'}.`);
                            }}
                            className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Remind Industry Mentor</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* SUB-PAGE 2: PROBLEM STATEMENTS MANAGEMENT (BLUE THEME)    */}
        {/* ========================================================= */}
        {adminTab === 'projects' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Public Challenges Curation & Lifecycle</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  District Problem Statements Directory ({projects.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Published statements appear publicly in the open portal for student teams and academic institutions.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleOpenCreateProject}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Statement</span>
                </button>
              </div>
            </div>

            {/* Search filter bar */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search statements by ID, title, or department..."
                value={projectSearch}
                onChange={e => setProjectSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-hidden"
              />
            </div>

            {/* Projects Mobile Card View (< md screens) */}
            <div className="block md:hidden divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {filteredProjects.map((proj) => (
                <div key={proj.id} className="p-4 space-y-3 bg-white">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                      {proj.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      proj.status === 'Available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : proj.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {proj.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {proj.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <span className="text-blue-700 font-semibold">{proj.technologyCategory}</span>
                      <span>·</span>
                      <span>{proj.department}</span>
                      <span>·</span>
                      <span className="font-mono">{proj.duration}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[11px] text-slate-600 truncate max-w-[180px]">
                      {proj.selectedByInstitutionName ? (
                        <span className="font-semibold text-slate-800">{proj.selectedByInstitutionName}</span>
                      ) : (
                        <span className="text-slate-400 italic">Open for Claim</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditProject(proj)}
                        className="p-2 text-slate-600 hover:text-blue-700 bg-slate-100 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center"
                        title="Edit Problem Statement"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Permanently delete problem statement ${proj.id}?`)) {
                            deleteProject(proj.id);
                            setActionToast(`Deleted ${proj.id}`);
                            setTimeout(() => setActionToast(null), 3000);
                          }
                        }}
                        className="p-2 text-rose-600 hover:text-rose-800 bg-rose-50 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center"
                        title="Delete Statement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Projects Desktop Table (>= md screens) */}
            <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Problem ID</th>
                    <th className="py-3 px-4">Title & Domain</th>
                    <th className="py-3 px-4">Department & Sector</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Claimed By</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProjects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                        {proj.id}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900 max-w-xs">
                        <div className="font-bold line-clamp-1">{proj.title}</div>
                        <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-semibold inline-block mt-0.5">
                          {proj.technologyCategory}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="font-medium text-slate-800 line-clamp-1">{proj.department}</div>
                        <div className="text-[10px] text-slate-400">{proj.sector} · {proj.duration}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          proj.status === 'Available'
                            ? 'bg-emerald-100 text-emerald-800'
                            : proj.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {proj.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {proj.selectedByInstitutionName ? (
                          <div className="font-semibold text-slate-900 line-clamp-1">
                            {proj.selectedByInstitutionName}
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">— Open for Claim —</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditProject(proj)}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Problem Statement"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Permanently delete problem statement ${proj.id}?`)) {
                                deleteProject(proj.id);
                                setActionToast(`Deleted ${proj.id}`);
                                setTimeout(() => setActionToast(null), 3000);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Statement"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUB-PAGE 3: INSTITUTIONS DIRECTORY & AUDIT APPROVAL       */}
        {/* ========================================================= */}
        {adminTab === 'institutions' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Accreditation Verification & Claim Audits</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Academic Institutions Governance ({institutions.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review complete institution credentials, chosen statements, and student teams before confirming approval.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
                {(['All', 'Pending', 'Active', 'Rejected'] as const).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setInstFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      instFilter === filter
                        ? 'bg-blue-600 text-white font-bold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {filter} {filter === 'Pending' && pendingInstitutions.length > 0 && `(${pendingInstitutions.length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Pending Alert banner */}
            {pendingInstitutions.length > 0 && (
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 text-amber-900">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <strong className="font-bold">{pendingInstitutions.length} Institution Application{pendingInstitutions.length > 1 ? 's' : ''} Waiting For Verification.</strong>
                    <p className="text-amber-800 text-[11px] mt-0.5">Click "Audit & Approve" to review what they submitted and what challenge they selected before confirming.</p>
                  </div>
                </div>
                <button
                  onClick={() => setInstFilter('Pending')}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-xl shrink-0 cursor-pointer"
                >
                  View Queue
                </button>
              </div>
            )}

            {/* Institutions Mobile Card View (< md screens) */}
            <div className="block md:hidden divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {institutions
                .filter(inst => {
                  if (instFilter === 'All') return true;
                  return inst.status === instFilter;
                })
                .map(inst => {
                  const prj = projects.find(p => p.selectedByInstitutionId === inst.id);
                  return (
                    <div key={inst.id} className="p-4 space-y-3 bg-white">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                          {inst.code}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inst.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inst.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300 animate-pulse'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {inst.status === 'Pending' ? 'Pending Approval' : inst.status}
                        </span>
                      </div>

                      <div>
                        <div className="font-bold text-slate-900 text-sm leading-snug">{inst.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                          <span>{inst.institutionType}</span>
                          <span>·</span>
                          <span className="font-semibold text-blue-700">NAAC: {inst.naacGrade}</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-[11px]">Coordinator:</span>
                          <span className="font-medium text-slate-800">{inst.coordinatorName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-[11px]">Claimed Challenge:</span>
                          {prj ? (
                            <span className="font-mono text-[11px] font-bold text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded">
                              {prj.id}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">None</span>
                          )}
                        </div>
                      </div>

                      <div className="pt-1 flex items-center justify-end gap-2">
                        <button
                          onClick={() => setInstitutionToReview(inst)}
                          className={`inline-flex items-center gap-1 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer min-h-[38px] ${
                            inst.status === 'Pending'
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{inst.status === 'Pending' ? 'Audit & Approve' : 'Audit Details'}</span>
                        </button>

                        {inst.status === 'Pending' && (
                          <button
                            onClick={() => {
                              setRejectInstTarget(inst.id);
                              setRejectInstReason('Institutional documentation and accreditation could not be validated.');
                            }}
                            className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs px-3 py-2 rounded-xl transition-colors cursor-pointer min-h-[38px]"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Institutions Desktop Table (>= md screens) */}
            <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">College Name</th>
                    <th className="py-3 px-4">Type & NAAC</th>
                    <th className="py-3 px-4">Coordinator</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Chosen Problem</th>
                    <th className="py-3 px-4 text-right">Super Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {institutions
                    .filter(inst => {
                      if (instFilter === 'All') return true;
                      return inst.status === instFilter;
                    })
                    .map(inst => {
                      const prj = projects.find(p => p.selectedByInstitutionId === inst.id);
                      return (
                        <tr key={inst.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{inst.code}</td>
                          <td className="py-3.5 px-4 font-medium text-slate-900">
                            <div className="font-bold">{inst.name}</div>
                            <span className="text-[10px] text-slate-500">({inst.shortName})</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            <div>{inst.institutionType}</div>
                            <span className="text-[10px] font-bold text-blue-700">NAAC: {inst.naacGrade}</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            <div className="font-medium text-slate-800">{inst.coordinatorName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{inst.coordinatorEmail}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              inst.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : inst.status === 'Pending'
                                ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300 animate-pulse'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {inst.status === 'Pending' ? 'Pending Approval' : inst.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {prj ? (
                              <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                                {prj.id}
                              </span>
                            ) : (
                              <span className="text-slate-400 font-mono text-[11px]">— None —</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Open Comprehensive Audit & Confirmation Modal */}
                              <button
                                onClick={() => setInstitutionToReview(inst)}
                                className={`inline-flex items-center gap-1 font-bold text-[11px] px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs ${
                                  inst.status === 'Pending'
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                                }`}
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>{inst.status === 'Pending' ? 'Audit & Approve' : 'Audit Details'}</span>
                              </button>

                              {inst.status === 'Pending' && (
                                <button
                                  onClick={() => {
                                    setRejectInstTarget(inst.id);
                                    setRejectInstReason('Institutional documentation and accreditation could not be validated.');
                                  }}
                                  className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-[11px] px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Reject</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUB-PAGE 4: MENTOR DIRECTORY & PAIRING (BLUE THEME)       */}
        {/* ========================================================= */}
        {adminTab === 'mentors' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>Corporate Experts Accreditation</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Industry Mentors Roster ({mentors.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify industry domain credentials and pair accredited mentors to student projects.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
                {(['All', 'Pending', 'Active', 'Rejected'] as const).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setMentorFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      mentorFilter === filter
                        ? 'bg-blue-600 text-white font-bold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {filter} {filter === 'Pending' && pendingMentors.length > 0 && `(${pendingMentors.length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Mentors Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Mentor Name</th>
                    <th className="py-3 px-4">Organization & Role</th>
                    <th className="py-3 px-4">Expertise Domains</th>
                    <th className="py-3 px-4">Exp</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Paired Projects</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mentors
                    .filter(m => {
                      if (mentorFilter === 'All') return true;
                      return m.status === mentorFilter;
                    })
                    .map(m => {
                      const assigned = projects.filter(p => p.assignedMentorId === m.id);
                      return (
                        <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            <div>{m.fullName}</div>
                            <div className="text-[10px] text-slate-400 font-normal font-mono">{m.email}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700">
                            <div className="font-semibold text-slate-900">{m.organization}</div>
                            <div className="text-[11px] text-slate-500">{m.designation}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {m.expertise.map(exp => (
                                <span key={exp} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                                  {exp}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{m.yearsOfExperience} yrs</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              m.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : m.status === 'Pending'
                                ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300 animate-pulse'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {m.status === 'Pending' ? 'Pending' : m.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-700">
                            {assigned.map(p => p.id).join(', ') || '— None —'}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {m.status === 'Pending' ? (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    approveMentor(m.id);
                                    setActionToast(`Accredited mentor ${m.fullName}!`);
                                    setTimeout(() => setActionToast(null), 4000);
                                  }}
                                  className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl shadow-2xs transition-colors cursor-pointer"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Accredit</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setRejectMentorTarget(m.id);
                                    setRejectMentorReason('Industrial verification criteria could not be established.');
                                  }}
                                  className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-[11px] px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Reject</span>
                                </button>
                              </div>
                            ) : m.status === 'Active' ? (
                              <button
                                onClick={() => {
                                  setSelectedMentorId(m.id);
                                  setAssignModalProject(projects[0]);
                                }}
                                className="text-xs text-blue-700 hover:text-blue-900 font-bold underline cursor-pointer"
                              >
                                Pair to Project
                              </button>
                            ) : (
                              <span className="text-[11px] text-rose-600 font-medium">Rejected</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUB-PAGE 5: COLLECTOR EXECUTIVE ANALYTICS VIEW            */}
        {/* ========================================================= */}
        {adminTab === 'analytics' && (
          <CollectorDashboard onOpenCertificates={onOpenCertificates} />
        )}

        {/* ========================================================= */}
        {/* SUB-PAGE 6: COLLECTOR SUB-ACCOUNTS & GOVERNANCE           */}
        {/* ========================================================= */}
        {adminTab === 'collector-governance' && (
          <CollectorSubAccountManager />
        )}

        {/* ========================================================= */}
        {/* SUB-PAGE 7: HERO SHOWCASE SLIDES & PICTURES               */}
        {/* ========================================================= */}
        {adminTab === 'slides' && (
          <HeroSlideshowManager />
        )}

        {/* ========================================================= */}
        {/* SUB-PAGE 8: FAQ & DISTRICT CONTACT SETTINGS               */}
        {/* ========================================================= */}
        {adminTab === 'faq-contact' && (
          <FaqContactManager />
        )}

        {/* ========================================================= */}
        {/* SUB-PAGE 9: SYSTEM AUDIT LOGS TRACE (BLUE THEME)          */}
        {/* ========================================================= */}
        {adminTab === 'audit' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                  <History className="w-3.5 h-3.5" />
                  <span>Immutable System Activity Logs</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Audit Log Trace Records
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tracks logins, problem statement publications, milestone decisions, and certificate issuances.
                </p>
              </div>
              <span className="text-xs text-slate-600 font-mono bg-slate-100 px-3 py-1.5 rounded-xl font-bold">
                Total Events: {auditLogs.length}
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 font-mono text-[11px]">
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">{log.timestamp}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                          log.userAction === 'Milestone Reviews' ? 'bg-sky-100 text-sky-800' :
                          log.userAction === 'Certificate Generation' ? 'bg-emerald-100 text-emerald-800' :
                          log.userAction === 'Project Creation' ? 'bg-blue-100 text-blue-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {log.userAction}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-sans text-slate-800 whitespace-nowrap font-medium">{log.performedBy}</td>
                      <td className="py-3.5 px-4 font-sans text-slate-600 max-w-sm truncate">{log.details}</td>
                      <td className="py-3.5 px-4 text-slate-400">{log.ipAddress || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* MODAL: COMPREHENSIVE INSTITUTION AUDIT & CONFIRM APPROVE  */}
      {/* ========================================================= */}
      {institutionToReview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0c2340] to-[#1769AA] text-white px-6 py-5 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <Building2 className="w-4 h-4" />
                  <span>Academic Institution Verification Audit</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {institutionToReview.name}
                </h3>
              </div>
              <button
                onClick={() => setInstitutionToReview(null)}
                className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-xs text-slate-700">
              
              {/* Institution Identity Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Accreditation & College Registry Profile
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Institution Code:</span>
                    <strong className="font-mono text-slate-900 text-xs">{institutionToReview.code}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">NAAC Accreditation:</span>
                    <strong className="text-emerald-700 font-bold text-xs">{institutionToReview.naacGrade}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">College Type:</span>
                    <strong className="text-slate-900 text-xs">{institutionToReview.institutionType}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Autonomous Status:</span>
                    <strong className="text-slate-900 text-xs">{institutionToReview.autonomous ? 'Autonomous' : 'Affiliated'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Campus City:</span>
                    <strong className="text-slate-900 text-xs">{institutionToReview.city}, {institutionToReview.pincode}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Principal:</span>
                    <strong className="text-slate-900 text-xs">{institutionToReview.principalName}</strong>
                  </div>
                </div>
              </div>

              {/* Coordinator Point of Contact */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Authorized Faculty Coordinator
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Coordinator Name:</span>
                      <strong className="text-slate-900">{institutionToReview.coordinatorName}</strong>
                      <span className="text-[10px] text-slate-500 block">({institutionToReview.coordinatorDesignation})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Official Email & Phone:</span>
                      <strong className="font-mono text-slate-900">{institutionToReview.coordinatorEmail}</strong>
                      <span className="text-[10px] text-slate-500 block font-mono">{institutionToReview.coordinatorPhone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* What the institution has chosen / claimed */}
              <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-700" />
                    <span>Chosen Problem Statement (What They Done)</span>
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                    1/1 Statement Limit
                  </span>
                </div>

                {(() => {
                  const chosenPrj = projects.find(p => p.selectedByInstitutionId === institutionToReview.id);
                  if (chosenPrj) {
                    return (
                      <div className="bg-white p-3.5 rounded-xl border border-blue-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2.5 py-0.5 rounded">
                            {chosenPrj.id}
                          </span>
                          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded font-bold text-[10px]">
                            Locked to this College
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {chosenPrj.title}
                        </h4>
                        <div className="flex items-center gap-3 text-[11px] text-slate-600">
                          <span>Domain: <strong>{chosenPrj.technologyCategory}</strong></span>
                          <span>·</span>
                          <span>Dept: <strong>{chosenPrj.department}</strong></span>
                        </div>
                        <p className="text-slate-600 text-xs line-clamp-2">
                          {chosenPrj.description}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <div className="p-3 bg-white rounded-xl border border-blue-100 text-slate-600 space-y-1">
                      <p className="font-semibold text-slate-800">No problem statement claimed yet.</p>
                      <p className="text-[11px] text-slate-500">
                        Upon Super Admin approval, this institution will be authorized to lock 1 problem statement from the public repository and nominate up to 300 student solution teams.
                      </p>
                    </div>
                  );
                })()}
              </div>

              {/* Verification Confirmation Box */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-1.5">
                <div className="font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Verification Confirmation Notice</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Approving this institution confirms their accreditation credentials, marks them as <strong>Active</strong> in the state registry, dispatches automated credentials to coordinator email <strong>{institutionToReview.coordinatorEmail}</strong>, and unlocks team solution submissions.
                </p>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setInstitutionToReview(null)}
                className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-200/70 transition-colors cursor-pointer"
              >
                Close Audit
              </button>

              <div className="flex items-center gap-2">
                {institutionToReview.status === 'Pending' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const targetId = institutionToReview.id;
                        setInstitutionToReview(null);
                        setRejectInstTarget(targetId);
                        setRejectInstReason('Institutional documentation could not be validated.');
                      }}
                      className="px-4 py-2 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl font-bold transition-colors cursor-pointer"
                    >
                      Reject Application
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExecuteInstitutionApproval(institutionToReview.id)}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Approve Institution</span>
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                    ✓ Verified Active Institution
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT PROBLEM STATEMENT (GOV BLUE UI)      */}
      {/* ========================================================= */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0c2340] to-[#1769AA] text-white px-6 py-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-0.5">
                  <Layers className="w-4 h-4" />
                  <span>Public Innovation Challenge Builder</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {editingProjectId ? `Edit Problem Statement (${editingProjectId})` : 'Create New District Problem Statement'}
                </h3>
              </div>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInitiateSaveProject} className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-xs">
              
              {/* Section 1: ID & Title */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
                  1. Identification & Challenge Title
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Problem ID <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!!editingProjectId}
                      value={projectForm.id}
                      onChange={e => setProjectForm({ ...projectForm, id: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs font-bold disabled:bg-slate-100 focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-slate-700 font-bold mb-1">
                      Challenge Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Automated IoT Water Quality Monitoring System"
                      value={projectForm.title}
                      onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Department, Sector, Category, Duration */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
                  2. Sponsoring Department & Domain Scope
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Department *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Public Health"
                      value={projectForm.department}
                      onChange={e => setProjectForm({ ...projectForm, department: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Sector *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Healthcare"
                      value={projectForm.sector}
                      onChange={e => setProjectForm({ ...projectForm, sector: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Target Duration *</label>
                    <select
                      value={projectForm.duration}
                      onChange={e => setProjectForm({ ...projectForm, duration: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                    >
                      <option value="3 Months">3 Months</option>
                      <option value="4 Months">4 Months</option>
                      <option value="6 Months">6 Months</option>
                      <option value="9 Months">9 Months</option>
                      <option value="1 Year">1 Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Technical Category *</label>
                    <select
                      value={projectForm.technologyCategory}
                      onChange={e => setProjectForm({ ...projectForm, technologyCategory: e.target.value as TechnologyCategory })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                    >
                      <option value="Software">Software</option>
                      <option value="Hardware">Hardware</option>
                      <option value="Embedded">Embedded</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="IoT">IoT</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Detailed Description */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="block text-slate-700 font-bold">
                  District Problem Statement Context & Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide background regarding the municipal / rural challenge, current operational hurdles, and the intended engineering solution..."
                  value={projectForm.description}
                  onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden leading-relaxed"
                />
              </div>

              {/* Section 4: Objectives & Deliverables */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="block text-slate-700 font-bold">
                    Core Objectives (One per line)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Objective 1&#10;Objective 2&#10;Objective 3"
                    value={projectForm.objectivesText}
                    onChange={e => setProjectForm({ ...projectForm, objectivesText: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-hidden leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-700 font-bold">
                    Expected Deliverables (One per line)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Deliverable 1&#10;Deliverable 2&#10;Deliverable 3"
                    value={projectForm.deliverablesText}
                    onChange={e => setProjectForm({ ...projectForm, deliverablesText: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-hidden leading-relaxed"
                  />
                </div>
              </div>

              {/* Section 5: Skills & Reference Files */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Required Technical Skills (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. React, Node.js, Python, LoRaWAN, Embedded C, CAD"
                    value={projectForm.skillsText}
                    onChange={e => setProjectForm({ ...projectForm, skillsText: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Reference Specification Document
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Department_Standard_Operating_Procedure.pdf"
                      value={projectForm.refDocTitle}
                      onChange={e => setProjectForm({ ...projectForm, refDocTitle: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Baseline Survey / Dataset Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chengalpattu_Field_Data_2026.csv"
                      value={projectForm.attachmentName}
                      onChange={e => setProjectForm({ ...projectForm, attachmentName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Form Footer */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Review & Save Statement →</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CONFIRMATION BEFORE SAVING PROBLEM STATEMENT       */}
      {/* ========================================================= */}
      {confirmSaveModalOpen && pendingSaveData && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0c2340] to-[#1769AA] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <h3 className="text-base font-bold text-white">
                  Confirm Problem Statement Publication
                </h3>
              </div>
              <button
                onClick={() => setConfirmSaveModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2.5 py-0.5 rounded">
                    {pendingSaveData.id}
                  </span>
                  <span className="font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px]">
                    {pendingSaveData.technologyCategory}
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-900">
                  {pendingSaveData.title}
                </h4>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-200/80">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Department:</span>
                    <strong>{pendingSaveData.department}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Duration:</span>
                    <strong>{pendingSaveData.duration}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Objectives:</span>
                    <strong>{pendingSaveData.objectives.length} Item(s)</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Deliverables:</span>
                    <strong>{pendingSaveData.deliverables.length} Item(s)</strong>
                  </div>
                </div>

                {pendingSaveData.skills.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80">
                    <span className="text-slate-400 block text-[10px] mb-1">Required Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {pendingSaveData.skills.map((s, idx) => (
                        <span key={idx} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] text-slate-700 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Public Repository Notice */}
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Public Portal Transparency</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-normal">
                  Publishing this challenge makes it immediately visible to students, collegiate faculty, and industry mentors across the public portal at <strong>/problem-statements</strong>.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setConfirmSaveModalOpen(false)}
                className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer"
              >
                ← Back to Edit
              </button>

              <button
                type="button"
                onClick={handleExecuteConfirmedSave}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Publish Statement</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: PAIR MENTOR TO PROJECT                             */}
      {/* ========================================================= */}
      {assignModalProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900">
              Pair Industry Mentor to {assignModalProject.id}
            </h3>
            <p className="text-slate-600">
              Select an industry domain expert to guide collegiate team working on "{assignModalProject.title}".
            </p>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Select Mentor</label>
              <select
                value={selectedMentorId}
                onChange={e => setSelectedMentorId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              >
                <option value="">— Choose a Mentor —</option>
                {mentors.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.organization}) · {m.expertise.join(', ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAssignModalProject(null)}
                className="px-3.5 py-1.5 text-slate-600 cursor-pointer font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedMentorId}
                onClick={() => {
                  assignMentorToProject(assignModalProject.id, selectedMentorId);
                  setAssignModalProject(null);
                  setActionToast(`Mentor successfully paired to ${assignModalProject.id}!`);
                  setTimeout(() => setActionToast(null), 3500);
                }}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-40 cursor-pointer"
              >
                Confirm Pairing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TOAST NOTICE                                              */}
      {/* ========================================================= */}
      {actionToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionToast}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* REJECT INSTITUTION MODAL                                  */}
      {/* ========================================================= */}
      {rejectInstTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Reject Institution Registration</h3>
              <button onClick={() => setRejectInstTarget(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Provide a reason for rejection. This remark will be automatically dispatched to the college coordinator via official notification email.
            </p>
            <textarea
              value={rejectInstReason}
              onChange={e => setRejectInstReason(e.target.value)}
              rows={3}
              className="w-full text-xs border border-slate-300 rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              placeholder="e.g. Affiliation verification documents could not be validated..."
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectInstTarget(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  rejectInstitution(rejectInstTarget, rejectInstReason);
                  setRejectInstTarget(null);
                  setActionToast('Institution application rejected. Notification email dispatched.');
                  setTimeout(() => setActionToast(null), 4000);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-2xs cursor-pointer"
              >
                Confirm Rejection & Send Mail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* REJECT MENTOR MODAL                                       */}
      {/* ========================================================= */}
      {rejectMentorTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Reject Mentor Application</h3>
              <button onClick={() => setRejectMentorTarget(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Provide a reason for rejection. This remark will be automatically dispatched to the applicant via official notification email.
            </p>
            <textarea
              value={rejectMentorReason}
              onChange={e => setRejectMentorReason(e.target.value)}
              rows={3}
              className="w-full text-xs border border-slate-300 rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              placeholder="e.g. Professional domain experience criteria not met..."
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectMentorTarget(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  rejectMentor(rejectMentorTarget, rejectMentorReason);
                  setRejectMentorTarget(null);
                  setActionToast('Mentor application rejected. Notification email dispatched.');
                  setTimeout(() => setActionToast(null), 4000);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-2xs cursor-pointer"
              >
                Confirm Rejection & Send Mail
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
