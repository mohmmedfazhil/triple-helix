import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Users, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Send,
  Lock
} from 'lucide-react';
import { submitTeamSolution, TeamMember } from '../../lib/firebaseServices';

interface SolutionSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  psId: string;
  psTitle: string;
  institutionId: string;
  institutionName: string;
  currentCount: number;
  deadlineIso?: string;
  onSuccess: (newCount: number) => void;
}

const TECH_BUCKETS = [
  'Software',
  'Hardware',
  'Embedded',
  'AI/ML',
  'IoT',
  'Healthcare',
  'Agriculture',
  'Data Science',
  'Cybersecurity',
  'Others'
];

export const SolutionSubmissionModal: React.FC<SolutionSubmissionModalProps> = ({
  isOpen,
  onClose,
  psId,
  psTitle,
  institutionId,
  institutionName,
  currentCount,
  deadlineIso,
  onSuccess
}) => {
  const [title, setTitle] = useState('');
  const [technologyBucket, setTechnologyBucket] = useState('AI/ML');
  const [abstractText, setAbstractText] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Mandatory Team Roster: 1 Leader + at least 2 Members (up to 6 total)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { role: 'LEADER', name: '', email: '', phone: '', gender: 'Male' },
    { role: 'TEAM_MEMBER', name: '', email: '', phone: '', gender: 'Female' },
    { role: 'TEAM_MEMBER', name: '', email: '', phone: '', gender: 'Male' }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Deadline verification
  const isDeadlinePassed = deadlineIso ? Date.now() > new Date(deadlineIso).getTime() : false;
  const isQuotaReached = currentCount >= 300;

  const handleAddMember = () => {
    if (teamMembers.length >= 6) return;
    setTeamMembers(prev => [
      ...prev,
      { role: 'TEAM_MEMBER', name: '', email: '', phone: '', gender: 'Male' }
    ]);
  };

  const handleRemoveMember = (index: number) => {
    if (teamMembers.length <= 3) return; // Keep minimum 3
    if (teamMembers[index].role === 'LEADER') return; // Cannot delete leader
    setTeamMembers(prev => prev.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    setTeamMembers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setErrorMessage('Only PDF documents are allowed (max 10MB).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('PDF file size exceeds maximum 10MB limit.');
      return;
    }

    setErrorMessage(null);
    setPdfFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isDeadlinePassed) {
      setErrorMessage('The global submission deadline has expired. Submissions are permanently closed.');
      return;
    }
    if (isQuotaReached) {
      setErrorMessage('Maximum quota reached: 300/300 solutions have already been submitted.');
      return;
    }

    // Validate members
    for (let i = 0; i < teamMembers.length; i++) {
      const m = teamMembers[i];
      if (!m.name.trim() || !m.email.trim() || !m.phone.trim()) {
        setErrorMessage(`Please complete all fields for team member #${i + 1} (${m.role}).`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const res = await submitTeamSolution({
        psId,
        institutionId,
        institutionName,
        title,
        description,
        abstract: abstractText,
        technologyBucket,
        youtubeUrl: youtubeUrl.trim(),
        documentFile: pdfFile,
        teamMembers
      });

      setIsSubmitting(false);

      if (res.success) {
        onSuccess(currentCount + 1);
        onClose();
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Submission error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header with Live Counter Progress */}
        <div className="bg-[#0c1f3f] text-white px-6 py-5 flex items-center justify-between border-b border-blue-900/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-blue-300">
                Team Nomination Submission · {psId}
              </span>
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Quota: {currentCount}/300
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white line-clamp-1">
              {psTitle}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quota Progress Bar Header */}
        <div className="bg-blue-950/40 border-b border-blue-900/30 px-6 py-3 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium">Institution Solution Capacity:</span>
            <strong className="text-white font-mono text-sm">{currentCount}/300 Submitted</strong>
          </div>
          <div className="w-48 bg-blue-950 border border-blue-800 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                currentCount >= 280 ? 'bg-rose-500' : currentCount >= 200 ? 'bg-amber-400' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(100, (currentCount / 300) * 100)}%` }}
            />
          </div>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Status alerts */}
          {isDeadlinePassed && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
              <Lock className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Global Deadline Expired: New team solutions cannot be submitted after {new Date(deadlineIso || '').toLocaleString()}.</span>
            </div>
          )}

          {isQuotaReached && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>300-Solution Quota Ceiling Reached. This institution has submitted all 300 allowed nominations.</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Solution Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-1 border-b border-slate-200">
              1. Solution & Technology Specification
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Idea Title <span className="text-rose-500">*</span>
                  <span className="text-[10px] text-slate-400 font-normal ml-2">({title.length}/100 max)</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Edge LoRaWAN Dynamic Bin Ultrasonic Level Telemetry Unit"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Technology Bucket <span className="text-rose-500">*</span>
                </label>
                <select
                  value={technologyBucket}
                  onChange={(e) => setTechnologyBucket(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {TECH_BUCKETS.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Abstract / Summary <span className="text-rose-500">*</span>
                <span className="text-[10px] text-slate-400 font-normal ml-2">({abstractText.length}/10,000 max)</span>
              </label>
              <textarea
                required
                rows={3}
                maxLength={10000}
                value={abstractText}
                onChange={(e) => setAbstractText(e.target.value)}
                placeholder="High-level engineering executive summary describing core innovation and expected societal impact..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Technical Description <span className="text-rose-500">*</span>
                <span className="text-[10px] text-slate-400 font-normal ml-2">({description.length}/50,000 max)</span>
              </label>
              <textarea
                required
                rows={6}
                maxLength={50000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Exhaustive methodology, hardware architecture, sensor calibrations, software stack, deployment plan, and failure modes..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  YouTube Demonstration Link <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtu.be/..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Idea Template: <span className="text-slate-400 font-normal">{pdfFile ? pdfFile.name : 'No file chosen'}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const blob = new Blob([
                        `TRIPLE HELIX DISTRICT INNOVATION MISSION - ROUND 1 IDEA TEMPLATE\n\n` +
                        `1. PROBLEM STATEMENT ID: ${psId}\n` +
                        `2. PROPOSED TITLE:\n` +
                        `3. EXECUTIVE ABSTRACT (MAX 10,000 CHARS):\n` +
                        `4. SYSTEM ARCHITECTURE & BLOCK DIAGRAM:\n` +
                        `5. HARDWARE / SOFTWARE SPECIFICATIONS:\n` +
                        `6. EXPECTED CIVIC IMPACT & FIELD DEPLOYMENT PLAN:\n` +
                        `7. TEAM ROSTER & ROLES:\n`
                      ], { type: 'text/plain;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `TripleHelix_Idea_Template_${psId}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
                  >
                    Download Template
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleFileChange}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Upload Idea template in pdf format. Upto 10MB.
                </p>
                {pdfFile && (
                  <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">
                    ✓ Attached: {pdfFile.name} ({(pdfFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* Section 2: Mandatory Team Roster (3 to 6 Members) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  2. Mandatory Team Roster ({teamMembers.length}/6 Members)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Requires 1 Team Leader + at least 2 Members (up to 3 additional optional members).
                </p>
              </div>

              {teamMembers.length < 6 && (
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Team Member</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {teamMembers.map((member, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-xl border transition-all ${
                    member.role === 'LEADER' 
                      ? 'bg-amber-50/60 border-amber-200' 
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      member.role === 'LEADER'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {member.role === 'LEADER' ? '★ Mandatory Team Leader' : `Team Member #${idx + 1}`}
                    </span>

                    {member.role !== 'LEADER' && teamMembers.length > 3 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Full Name *"
                        value={member.name}
                        onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        required
                        placeholder="College Email *"
                        value={member.email}
                        onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="Phone Number *"
                        value={member.phone}
                        onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <select
                        value={member.gender}
                        onChange={(e) => handleMemberChange(idx, 'gender', e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isDeadlinePassed || isQuotaReached}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-900/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Submitting to Round 1...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Solution #{currentCount + 1}/300</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default SolutionSubmissionModal;
