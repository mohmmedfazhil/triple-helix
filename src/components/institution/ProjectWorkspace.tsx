import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Milestone, MilestoneStatus } from '../../types';
import { MilestoneTimelineChart } from './MilestoneTimelineChart';
import { 
  Building2, 
  Users, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  FileText, 
  Award, 
  Calendar, 
  ChevronRight, 
  MessageSquare, 
  ShieldCheck, 
  FileCode, 
  Video, 
  Presentation,
  Send,
  ArrowLeft,
  Download,
  AlertTriangle,
  GraduationCap
} from 'lucide-react';

interface Props {
  projectId: string;
  onBackToDashboard: () => void;
  onOpenCertificates: (projectId: string) => void;
}

export const ProjectWorkspace: React.FC<Props> = ({
  projectId,
  onBackToDashboard,
  onOpenCertificates
}) => {
  const { 
    projects, 
    institutions, 
    mentors, 
    mentorFeedbacks, 
    submitMilestoneData, 
    triggerError,
    currentUser 
  } = useApp();

  const project = projects.find(p => p.id === projectId);
  const institution = institutions.find(i => i.id === project?.selectedByInstitutionId);
  const mentor = mentors.find(m => m.id === project?.assignedMentorId);

  // Active tab inside Workspace
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'mentor' | 'milestones'>('milestones');
  const [activeMilestoneId, setActiveMilestoneId] = useState<1 | 2 | 3>(1);

  // Submission Form State (SRS Section 13)
  const [submissionTitle, setSubmissionTitle] = useState('');
  const [submissionDescription, setSubmissionDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ category: string; fileName: string; fileSize: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <p className="text-slate-600">Workspace not found.</p>
        <button onClick={onBackToDashboard} className="mt-4 text-xs font-semibold text-sky-700 underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const currentMilestone = project.milestones.find(m => m.id === activeMilestoneId)!;
  const projectFeedbacks = mentorFeedbacks.filter(f => f.projectId === project.id);

  // Calculate overall progress percentage
  const approvedMilestonesCount = project.milestones.filter(m => m.status === 'Approved').length;
  const progressPercent = Math.round((approvedMilestonesCount / 3) * 100);

  // Check deadline proximity (SRS Section 16: 7/3/1 days reminders)
  const getDeadlineAlert = (milestone: Milestone) => {
    const today = new Date();
    const deadline = new Date(milestone.deadlineDate);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0 && milestone.status !== 'Approved') {
      return { type: 'overdue', label: 'Deadline Passed', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    }
    if (diffDays <= 1 && diffDays >= 0) {
      return { type: 'urgent', label: 'Urgent: 1 Day Remaining!', color: 'text-rose-700 bg-rose-50 border-rose-200 animate-pulse' };
    }
    if (diffDays <= 3 && diffDays > 1) {
      return { type: 'warning', label: '3 Days to Milestone Deadline', color: 'text-amber-800 bg-amber-50 border-amber-200' };
    }
    if (diffDays <= 7 && diffDays > 3) {
      return { type: 'reminder', label: '7-Day Deadline Notice', color: 'text-sky-800 bg-sky-50 border-sky-200' };
    }
    return null;
  };

  const handleSimulateAddFile = (category: string) => {
    const mockFileMap: Record<string, string> = {
      'Requirement Analysis': 'Requirement_Analysis_Specification_Doc.pdf',
      'Literature Survey': 'Literature_Survey_And_StateOfArt.pdf',
      'Problem Understanding': 'Field_Problem_Understanding_Synthesis.pdf',
      'Design': 'System_Architecture_CAD_Schematics.pdf',
      'Architecture': 'Cloud_Firmware_Interface_Architecture.pdf',
      'Prototype': 'Hardware_Bench_Testing_Telemetry.mp4',
      'Progress Report': 'Midterm_Engineering_Progress_Report.pdf',
      'Final Report': 'Triple_Helix_Final_Comprehensive_Report.pdf',
      'Source Code': 'Production_Firmware_and_Client_Code.zip',
      'Presentation': 'District_Collectorate_Final_Presentation.pdf',
      'Demo Video': 'Field_Deployment_Pilot_Demonstration.mp4'
    };

    const fileName = mockFileMap[category] || `${category.replace(/\s+/g, '_')}_Document.pdf`;
    
    // Avoid duplicate category in current staging
    if (uploadedFiles.some(f => f.category === category)) {
      triggerError('File Upload Errors', `Document for category "${category}" has already been uploaded.`);
      return;
    }

    setUploadedFiles(prev => [
      ...prev,
      {
        category,
        fileName,
        fileSize: (Math.random() * 4 + 1.2).toFixed(1) + ' MB'
      }
    ]);
  };

  const handleSubmitMilestone = (e: React.FormEvent) => {
    e.preventDefault();

    if (!submissionTitle.trim()) {
      triggerError('File Upload Errors', 'Please enter a Submission Title.');
      return;
    }
    if (!submissionDescription.trim()) {
      triggerError('File Upload Errors', 'Please provide a Submission Description.');
      return;
    }

    // Must upload at least one required document
    if (uploadedFiles.length === 0) {
      triggerError('File Upload Errors', 'Please upload at least one of the required milestone documents before submitting.');
      return;
    }

    submitMilestoneData(
      project.id,
      activeMilestoneId,
      submissionTitle,
      submissionDescription,
      uploadedFiles
    );

    setIsSubmitting(false);
    setSubmissionTitle('');
    setSubmissionDescription('');
    setUploadedFiles([]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                {project.id}
              </span>
              <span className="text-xs text-slate-500">Workspace</span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                project.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'
              }`}>
                {project.status}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 line-clamp-1">
              {project.title}
            </h1>
          </div>
        </div>

        {/* Milestone Completion Progress & Certificate Trigger */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-500 font-medium">Milestone Progress</div>
            <div className="text-sm font-bold text-slate-900 font-mono">
              {approvedMilestonesCount} of 3 Approved ({progressPercent}%)
            </div>
          </div>

          {project.status === 'Completed' ? (
            <button
              onClick={() => onOpenCertificates(project.id)}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-colors"
            >
              <Award className="w-4 h-4" />
              <span>Download Official Certificates</span>
            </button>
          ) : (
            <div className="w-28 bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-sky-600 h-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          )}
        </div>
      </div>

      {/* Collegiate Student Session Indicator */}
      {currentUser?.role === 'student' && (
        <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-3.5 text-xs text-indigo-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-indigo-900">{currentUser.name}</span>
              <span className="text-indigo-600 ml-1.5 font-medium">
                ({currentUser.isLeader ? 'Designated Team Leader' : 'Core Engineering Member'})
              </span>
              <span className="text-slate-400 mx-2">·</span>
              <span className="font-mono text-slate-600 text-[11px]">Register No: {currentUser.registerNumber}</span>
            </div>
          </div>
          <span className="text-[11px] text-indigo-700 bg-white border border-indigo-200 px-2.5 py-1 rounded-md font-medium w-fit">
            Student Collegiate Workspace
          </span>
        </div>
      )}

      {/* Tabs Menu (SRS Section 12: Project Overview, Team Information, Mentor Information, Milestone Section) */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs sm:text-sm font-semibold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('milestones')}
          className={`py-2 px-4 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'milestones'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Milestones & Submissions (3 Gates)</span>
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`py-2 px-4 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'team'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Team Roster ({project.team?.students.length || 0} Students)</span>
        </button>

        <button
          onClick={() => setActiveTab('mentor')}
          className={`py-2 px-4 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'mentor'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Mentor Guidance ({project.assignedMentorName ? 'Assigned' : 'Pending'})</span>
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-4 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Project Specifications</span>
        </button>
      </div>

      {/* TAB 1: MILESTONES (SRS Sections 12, 13, 14, 15, 16) */}
      {activeTab === 'milestones' && (
        <div className="space-y-6">
          
          {/* Visual Milestone Timeline Component (Recharts) */}
          <MilestoneTimelineChart
            milestones={project.milestones}
            activeMilestoneId={activeMilestoneId}
            onSelectMilestone={(id) => {
              setActiveMilestoneId(id);
              setIsSubmitting(false);
            }}
          />

          {/* Active Milestone Workspace Detail */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            
            {/* Header of Active Milestone */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs text-sky-700 font-semibold mb-1">
                  <span>Milestone Stage #{currentMilestone.id}</span>
                  <span>·</span>
                  <span>Window: {currentMilestone.startDate} to {currentMilestone.deadlineDate}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {currentMilestone.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentMilestone.description}
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  currentMilestone.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  currentMilestone.status === 'Submitted' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                  currentMilestone.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                  currentMilestone.status === 'Deadline Passed' ? 'bg-red-50 text-red-700 border border-red-200' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  Current Status: {currentMilestone.status}
                </span>
              </div>
            </div>

            {/* Mandatory Required Upload Categories (SRS Section 12) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Required Upload Items for Milestone {currentMilestone.id}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {currentMilestone.requiredDocuments.map((docCategory) => {
                  const isUploaded = currentMilestone.uploadedFiles?.some(f => f.category === docCategory) ||
                    uploadedFiles.some(f => f.category === docCategory);

                  return (
                    <div
                      key={docCategory}
                      className={`p-3 rounded-lg border flex items-center justify-between ${
                        isUploaded 
                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900 font-medium'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {isUploaded ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className="truncate">{docCategory}</span>
                      </div>

                      {/* Upload button if still preparing submission or revising */}
                      {!isUploaded && (currentMilestone.status === 'Draft' || currentMilestone.status === 'Rejected') && (
                        <button
                          type="button"
                          onClick={() => handleSimulateAddFile(docCategory)}
                          className="text-[11px] font-semibold text-sky-700 hover:text-sky-900 bg-white border border-slate-200 hover:border-sky-300 px-2 py-1 rounded shrink-0 transition-colors"
                        >
                          Attach
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rejection notice if Rejected (SRS Section 15: Rejection Reason & Review Comments) */}
            {currentMilestone.status === 'Rejected' && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 space-y-2 text-xs text-rose-900 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-sm text-rose-800">
                  <AlertCircle className="w-4 h-4" />
                  <span>Submission Returned for Revision by Super Admin</span>
                </div>
                <p>
                  <strong>Reason for Rejection:</strong> {currentMilestone.rejectionReason || 'Incomplete technical parameters.'}
                </p>
                <p>
                  <strong>Review Comments:</strong> {currentMilestone.reviewComments || 'Please revise the sensor schematic and resubmit.'}
                </p>
                <p className="text-[11px] text-rose-700 pt-1">
                  Per SRS Section 15: "If Rejected: Institution receives a Rejection Reason and Review Comments, and can resubmit."
                </p>
              </div>
            )}

            {/* Approved notice if Approved */}
            {currentMilestone.status === 'Approved' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-2 text-xs text-emerald-900">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Milestone Verified & Approved by Super Admin</span>
                </div>
                {currentMilestone.reviewComments && (
                  <p>
                    <strong>Reviewer Feedback:</strong> {currentMilestone.reviewComments}
                  </p>
                )}
                <div className="text-[11px] text-emerald-700">
                  Reviewed on: {currentMilestone.reviewedAt || 'Recorded'} by {currentMilestone.reviewedBy || 'Super Admin'}
                </div>
              </div>
            )}

            {/* If Already Submitted or Under Review, show submission records */}
            {(currentMilestone.status === 'Submitted' || currentMilestone.status === 'Under Review' || currentMilestone.status === 'Approved') && (
              <div className="border border-slate-200 rounded-xl p-5 space-y-4 bg-slate-50/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Submitted Documentation Details:</span>
                  <span className="text-slate-500 font-mono">Date: {currentMilestone.submissionDate || 'Recently submitted'}</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    {currentMilestone.submissionTitle}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {currentMilestone.submissionDescription}
                  </p>
                </div>

                {/* Uploaded files list */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Attached Files ({currentMilestone.uploadedFiles?.length || 0})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentMilestone.uploadedFiles?.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg text-xs">
                        <div className="truncate mr-2">
                          <span className="font-medium text-slate-800 block truncate">{file.fileName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{file.category} · {file.fileSize}</span>
                        </div>
                        <button
                          onClick={() => {
                            const blob = new Blob([`Triple Helix Submission File: ${file.fileName}`], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = file.fileName;
                            a.click();
                          }}
                          className="text-sky-700 hover:text-sky-900 p-1 font-semibold"
                          title="Download file"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {currentMilestone.status === 'Submitted' && (
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    <span>Awaiting Super Admin review and milestone gate sign-off.</span>
                  </div>
                )}
              </div>
            )}

            {/* Submission Form (When Draft or Rejected) */}
            {(currentMilestone.status === 'Draft' || currentMilestone.status === 'Rejected') && (
              <form onSubmit={handleSubmitMilestone} className="border border-slate-200 rounded-xl p-5 space-y-4 bg-slate-50/30">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    {currentMilestone.status === 'Rejected' ? 'Resubmit Milestone' : 'Prepare Milestone Submission'} (SRS Section 13)
                  </h4>
                  <span className="text-xs text-slate-500">Official Formal Submission</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Submission Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={`e.g. Milestone ${currentMilestone.id} Comprehensive Deliverables`}
                      value={submissionTitle}
                      onChange={e => setSubmissionTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Submission Description <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Summarize the technical accomplishments, methodology, prototype test results, and file contents..."
                      value={submissionDescription}
                      onChange={e => setSubmissionDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  {/* Staged files */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-slate-700 font-medium">
                        Attached Documents & Code ({uploadedFiles.length} files attached)
                      </label>
                    </div>

                    {uploadedFiles.length === 0 ? (
                      <div className="p-4 border-2 border-dashed border-slate-200 rounded-lg text-center text-slate-500 bg-white">
                        <Upload className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                        <p>No documents attached yet.</p>
                        <p className="text-[11px] text-slate-400">
                          Click "Attach" on any of the required document cards above to attach simulated files.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {uploadedFiles.map((f, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-md text-xs">
                            <span className="font-medium text-slate-800">{f.fileName} ({f.category})</span>
                            <button
                              type="button"
                              onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                              className="text-rose-500 hover:text-rose-700 text-[11px]"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Milestone for Super Admin Review</span>
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      )}

      {/* TAB 2: TEAM INFORMATION (SRS Section 11 & 12) */}
      {activeTab === 'team' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Registered Student Team Roster
              </h2>
              <p className="text-xs text-slate-500">
                Enrolled under {project.selectedByInstitutionName || institution?.name || 'Institution'}
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-sky-800 bg-sky-50 px-2.5 py-1 rounded">
              {project.team?.students.length || 0} / 5 Members
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.team?.students.map((student) => (
              <div 
                key={student.id}
                className={`p-4 rounded-xl border space-y-3 ${
                  student.isLeader 
                    ? 'bg-sky-50/50 border-sky-300 ring-1 ring-sky-200' 
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {student.fullName}
                    </span>
                    {student.isLeader && (
                      <span className="bg-sky-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Team Leader
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-slate-500 text-[11px]">
                    {student.registerNumber}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Department</span>
                    <span className="font-medium text-slate-800">{student.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Year</span>
                    <span className="font-medium text-slate-800">{student.year}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Email</span>
                    <span className="font-medium text-slate-800 truncate block">{student.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Mobile</span>
                    <span className="font-medium text-slate-800">{student.mobileNumber}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MENTOR GUIDANCE & FEEDBACK (SRS Section 12 & 19) */}
      {activeTab === 'mentor' && (
        <div className="space-y-6">
          
          {/* Mentor Profile Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Assigned Industry Mentor
            </h2>

            {project.assignedMentorName ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                    {project.assignedMentorName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {project.assignedMentorName}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {mentor?.designation || 'Industry Expert'} · <strong>{mentor?.organization || 'Enterprise Partner'}</strong>
                    </p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      {mentor?.email || 'mentor@partner.com'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 max-w-xs">
                  {mentor?.expertise.map(exp => (
                    <span key={exp} className="text-[10px] bg-white border border-emerald-300 text-emerald-800 px-2 py-0.5 rounded font-medium">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-500">
                <Briefcase className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                <p className="text-sm font-semibold text-slate-700">Mentor Assignment Pending</p>
                <p className="text-xs text-slate-400 mt-1">
                  The District Innovation Mission / Super Admin will pair an industry domain expert to review your technical architecture.
                </p>
              </div>
            )}
          </div>

          {/* Feedback & Recommendations log */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Mentor Review Feedback & Recommendations</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {projectFeedbacks.length} Entry(s)
              </span>
            </div>

            {projectFeedbacks.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No mentor feedback submitted for this project yet.
              </p>
            ) : (
              <div className="space-y-4">
                {projectFeedbacks.map((fb) => (
                  <div key={fb.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="font-semibold text-slate-800">
                        {fb.mentorName} (Milestone {fb.milestoneId})
                      </span>
                      <span className="font-mono text-[11px]">{fb.submittedAt}</span>
                    </div>
                    <div className="text-slate-700">
                      <strong className="text-slate-900 block mb-0.5">Critique & Feedback:</strong>
                      <p className="leading-relaxed">{fb.feedback}</p>
                    </div>
                    <div className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200 mt-2">
                      <strong className="text-emerald-800 block mb-0.5">Recommendations:</strong>
                      <p className="leading-relaxed">{fb.recommendations}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 4: PROJECT SPECIFICATIONS (SRS Section 10 & 12) */}
      {activeTab === 'overview' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs text-xs sm:text-sm">
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Project Overview</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              Objectives
            </h3>
            <ul className="space-y-1.5 text-slate-700 pl-4 list-disc">
              {project.objectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              Expected Deliverables
            </h3>
            <ul className="space-y-1.5 text-slate-700 pl-4 list-disc">
              {project.expectedDeliverables.map((del, i) => (
                <li key={i}>{del}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
};
