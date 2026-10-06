import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  FirestoreSolution, 
  submitMentorEvaluation, 
  EvaluationInput 
} from '../../lib/firebaseServices';
import { 
  Briefcase, 
  Building2, 
  Users, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Send, 
  AlertCircle, 
  X, 
  ExternalLink,
  Layers,
  Award,
  Video,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const MentorDashboard: React.FC = () => {
  const { currentUser } = useApp();
  const [solutions, setSolutions] = useState<FirestoreSolution[]>([]);
  const [selectedSolution, setSelectedSolution] = useState<FirestoreSolution | null>(null);
  const [activeTab, setActiveTab] = useState<'Round 1' | 'Round 2' | 'Round 3' | 'Evaluated'>('Round 1');
  const [selectedCollegeFilter, setSelectedCollegeFilter] = useState('All');
  const [selectedPsFilter, setSelectedPsFilter] = useState('All');
  const [mobileActiveView, setMobileActiveView] = useState<'queue' | 'evaluation'>('queue');

  // Rubric Scores (Max 20 each, Total 100)
  const [rubric, setRubric] = useState({
    innovation: 18,
    feasibility: 17,
    technicalDepth: 18,
    impact: 19,
    presentation: 16
  });
  const [decision, setDecision] = useState<'Selected' | 'Rejected'>('Selected');
  const [feedback, setFeedback] = useState('');

  // Mandatory Confirmation Modal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync live solutions assigned to this mentor's domain or assigned statements
  useEffect(() => {
    const q = collection(db, 'solutions');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => d.data() as FirestoreSolution);
      setSolutions(docs);
      if (docs.length > 0 && !selectedSolution) {
        setSelectedSolution(docs[0]);
      }
    });

    return () => unsubscribe();
  }, []);

  const totalScore = (
    rubric.innovation +
    rubric.feasibility +
    rubric.technicalDepth +
    rubric.impact +
    rubric.presentation
  );

  // Extract colleges & problem statements present in assigned solutions
  const assignedColleges = Array.from(new Set(solutions.map(s => s.institutionName))).filter(Boolean);
  const assignedPsList = Array.from(new Set(solutions.map(s => s.psId))).filter(Boolean);

  const round1Count = solutions.filter(s => s.currentStage === 'Round 1').length;
  const round2Count = solutions.filter(s => s.currentStage === 'Round 2').length;
  const round3Count = solutions.filter(s => s.currentStage === 'Round 3').length;
  const evaluatedCount = solutions.filter(s => s.currentStage === 'Completed' || s.currentStage === 'Rejected').length;

  const filteredSolutions = solutions.filter(s => {
    if (activeTab === 'Evaluated') {
      if (s.currentStage !== 'Completed' && s.currentStage !== 'Rejected') return false;
    } else if (s.currentStage !== activeTab) {
      return false;
    }

    if (selectedCollegeFilter !== 'All' && s.institutionName !== selectedCollegeFilter) {
      return false;
    }

    if (selectedPsFilter !== 'All' && s.psId !== selectedPsFilter) {
      return false;
    }

    return true;
  });

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setErrorMessage('Detailed architectural and engineering feedback is mandatory.');
      return;
    }
    setErrorMessage(null);
    setConfirmModalOpen(true);
  };

  const handleExecuteEvaluation = async () => {
    if (!selectedSolution) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    const mentorName = currentUser?.name || 'Dr. Rajeshwari Krishnan';
    const mentorId = currentUser?.id || 'men-001';

    const input: EvaluationInput = {
      solutionId: selectedSolution.id,
      psId: selectedSolution.psId,
      institutionId: selectedSolution.institutionId,
      mentorId,
      mentorName,
      round: (selectedSolution.currentStage as any) || 'Round 1',
      rubric,
      totalMarks: totalScore,
      decision,
      feedback
    };

    const res = await submitMentorEvaluation(input);
    setIsSubmitting(false);
    setConfirmModalOpen(false);

    if (res.success) {
      setToastMessage(res.message);
      setFeedback('');
      setTimeout(() => setToastMessage(null), 5000);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-[#0a1b38] border border-blue-900/60 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold uppercase tracking-wider">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>Industry Mentor Terminal · 3-Stage Evaluation Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {currentUser?.name || 'Dr. Rajeshwari Krishnan'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Conduct rigorous 100-mark rubric evaluations across Round 1 (PPT/PDF), Round 2 (Prototype), and Round 3 (Final Demo) for assigned collegiate engineering solutions.
            </p>
          </div>

          <div className="bg-[#112952]/90 border border-blue-400/20 px-5 py-3 rounded-2xl text-center shrink-0">
            <span className="text-[11px] text-blue-200 block uppercase font-mono">Assigned Pipeline</span>
            <span className="text-2xl font-bold font-mono text-white">
              {solutions.length} Solutions
            </span>
          </div>
        </div>
      </div>

      {/* Round Progression Analytics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveTab('Round 1')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'Round 1' ? 'bg-blue-50 border-blue-400 shadow-xs' : 'bg-white border-slate-200 hover:border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Round 1: Idea PPT</span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900">{round1Count}</div>
          <span className="text-[10px] text-slate-400 font-medium">Initial Nominations</span>
        </div>

        <div 
          onClick={() => setActiveTab('Round 2')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'Round 2' ? 'bg-amber-50 border-amber-400 shadow-xs' : 'bg-white border-slate-200 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Round 2: Prototype</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900">{round2Count}</div>
          <span className="text-[10px] text-slate-400 font-medium">Working Model Verification</span>
        </div>

        <div 
          onClick={() => setActiveTab('Round 3')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'Round 3' ? 'bg-purple-50 border-purple-400 shadow-xs' : 'bg-white border-slate-200 hover:border-purple-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Round 3: Final Demo</span>
            <span className="w-2 h-2 rounded-full bg-purple-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900">{round3Count}</div>
          <span className="text-[10px] text-slate-400 font-medium">Field Pilot Evaluation</span>
        </div>

        <div 
          onClick={() => setActiveTab('Evaluated')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'Evaluated' ? 'bg-emerald-50 border-emerald-400 shadow-xs' : 'bg-white border-slate-200 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Completed / Evaluated</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900">{evaluatedCount}</div>
          <span className="text-[10px] text-slate-400 font-medium">Archived Decision Log</span>
        </div>
      </div>

      {/* College & Statement Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>Filter Assigned Batches:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs w-full sm:w-auto">
          {assignedColleges.length > 0 && (
            <select
              value={selectedCollegeFilter}
              onChange={(e) => setSelectedCollegeFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Institutions ({assignedColleges.length})</option>
              {assignedColleges.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          )}

          {assignedPsList.length > 0 && (
            <select
              value={selectedPsFilter}
              onChange={(e) => setSelectedPsFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-[11px]"
            >
              <option value="All">All Statements ({assignedPsList.length})</option>
              {assignedPsList.map(ps => (
                <option key={ps} value={ps}>{ps.toUpperCase()}</option>
              ))}
            </select>
          )}

          {(selectedCollegeFilter !== 'All' || selectedPsFilter !== 'All') && (
            <button
              onClick={() => {
                setSelectedCollegeFilter('All');
                setSelectedPsFilter('All');
              }}
              className="text-xs text-blue-600 font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-3 font-medium animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-3 font-medium animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Mobile View Switcher (Only visible on < lg screens) */}
      <div className="flex lg:hidden items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
        <button
          onClick={() => setMobileActiveView('queue')}
          className={`flex-1 py-2.5 rounded-xl transition-all text-center cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5 ${
            mobileActiveView === 'queue'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Solution Queue ({filteredSolutions.length})</span>
        </button>

        <button
          onClick={() => setMobileActiveView('evaluation')}
          className={`flex-1 py-2.5 rounded-xl transition-all text-center cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5 ${
            mobileActiveView === 'evaluation'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>100-Mark Rubric {selectedSolution ? `(#${selectedSolution.submissionIndex})` : ''}</span>
        </button>
      </div>

      {/* Main Grid: Left Solutions List & Right 100-Mark Rubric Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Column (5 cols): 3-Round Tabs & Solutions List */}
        <div className={`lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 space-y-4 shadow-sm ${
          mobileActiveView === 'queue' ? 'block' : 'hidden lg:block'
        }`}>
          
          {/* Stage Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            {(['Round 1', 'Round 2', 'Round 3', 'Evaluated'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer text-[10px] sm:text-[11px] min-h-[38px] ${
                  activeTab === tab 
                    ? 'bg-blue-600 text-white font-bold shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
            {activeTab} Queue ({filteredSolutions.length})
          </div>

          {/* Solutions List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredSolutions.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-300" />
                <p>No solutions currently awaiting {activeTab} review.</p>
              </div>
            ) : (
              filteredSolutions.map((sol) => {
                const isSelected = selectedSolution?.id === sol.id;
                return (
                  <div
                    key={sol.id}
                    onClick={() => {
                      setSelectedSolution(sol);
                      setMobileActiveView('evaluation');
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 shadow-xs ring-1 ring-blue-500'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                        #{sol.submissionIndex} · {sol.psId.toUpperCase()}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sol.currentStage === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : sol.currentStage === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {sol.currentStage}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                      {sol.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {sol.institutionName}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 mt-2 border-t border-slate-100">
                      <span>Leader: {sol.teamMembers?.find(m => m.role === 'LEADER')?.name}</span>
                      <span className="text-blue-600 font-semibold flex items-center gap-0.5">
                        <span>Evaluate</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Column (7 cols): Selected Solution Detail & 100-Mark Rubric */}
        <div className={`lg:col-span-7 space-y-6 ${
          mobileActiveView === 'evaluation' ? 'block' : 'hidden lg:block'
        }`}>
          
          {selectedSolution ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
              
              {/* Solution Overview */}
              <div className="space-y-3 pb-6 border-b border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    {selectedSolution.institutionName}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 font-mono">
                    Solution ID: {selectedSolution.id}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {selectedSolution.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedSolution.abstract}
                </p>

                {/* Team Roster Pill List */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5 font-mono">
                    Nominated Team Roster ({selectedSolution.teamMembers?.length} Members):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedSolution.teamMembers?.map((m, idx) => (
                      <span 
                        key={idx} 
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                          m.role === 'LEADER'
                            ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {m.role === 'LEADER' ? '★ ' : ''}{m.name} ({m.role})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Attachments / Video */}
                {(selectedSolution.documentUrl || selectedSolution.youtubeUrl) && (
                  <div className="flex flex-wrap items-center gap-3 pt-3">
                    {selectedSolution.documentUrl && (
                      <a
                        href={selectedSolution.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Idea Document (PDF)</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    )}
                    {selectedSolution.youtubeUrl && (
                      <a
                        href={selectedSolution.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Watch Demo Video</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* 100-Mark Rubric Evaluation Form */}
              <form onSubmit={handleOpenConfirm} className="space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Evaluation Rubric (100 Marks Max)</span>
                  </h3>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 mr-2">Aggregate Score:</span>
                    <strong className="text-base sm:text-lg font-mono font-extrabold text-blue-700">
                      {totalScore} / 100
                    </strong>
                  </div>
                </div>

                {/* 5 Rubric Criteria (0 to 20 each) */}
                <div className="space-y-4">
                  
                  {/* 1. Innovation */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">1. Innovation & Novelty (Max 20)</span>
                      <span className="font-mono font-bold text-slate-900">{rubric.innovation}/20</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={rubric.innovation}
                      onChange={(e) => setRubric({ ...rubric, innovation: Number(e.target.value) })}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  {/* 2. Feasibility */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">2. Implementation Feasibility (Max 20)</span>
                      <span className="font-mono font-bold text-slate-900">{rubric.feasibility}/20</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={rubric.feasibility}
                      onChange={(e) => setRubric({ ...rubric, feasibility: Number(e.target.value) })}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  {/* 3. Technical Depth */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">3. Technical Depth & Architecture (Max 20)</span>
                      <span className="font-mono font-bold text-slate-900">{rubric.technicalDepth}/20</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={rubric.technicalDepth}
                      onChange={(e) => setRubric({ ...rubric, technicalDepth: Number(e.target.value) })}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  {/* 4. Impact */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">4. District & Societal Impact (Max 20)</span>
                      <span className="font-mono font-bold text-slate-900">{rubric.impact}/20</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={rubric.impact}
                      onChange={(e) => setRubric({ ...rubric, impact: Number(e.target.value) })}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  {/* 5. Presentation */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">5. Presentation & Documentation (Max 20)</span>
                      <span className="font-mono font-bold text-slate-900">{rubric.presentation}/20</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={rubric.presentation}
                      onChange={(e) => setRubric({ ...rubric, presentation: Number(e.target.value) })}
                      className="w-full accent-blue-600"
                    />
                  </div>

                </div>

                {/* Decision: Selected vs Rejected */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Progression Decision for {selectedSolution.currentStage}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDecision('Selected')}
                      className={`py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        decision === 'Selected'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Select / Advance to Next Round</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDecision('Rejected')}
                      className={`py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        decision === 'Rejected'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <X className="w-4 h-4" />
                      <span>Reject Solution</span>
                    </button>
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Engineering Feedback & Guidance for Team <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide specific technical critique, architecture recommendations, calibration insights, or grounds for decision..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-3 border-t border-slate-200 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Evaluation & Notify POC</span>
                  </button>
                </div>

              </form>

            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              Select a solution from the queue to evaluate.
            </div>
          )}

        </div>

      </div>

      {/* Mandatory Confirmation Modal */}
      {confirmModalOpen && selectedSolution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-slate-900">
                Confirm Evaluation Decision
              </h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to mark this solution as <strong>{decision}</strong> with a score of <strong>{totalScore}/100</strong>?
              </p>
              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 text-left space-y-1">
                <div>Solution: <strong>{selectedSolution.title}</strong></div>
                <div>Stage: <strong>{selectedSolution.currentStage}</strong></div>
                <div>Institution: <strong>{selectedSolution.institutionName}</strong></div>
                <div>Decision: <strong className={decision === 'Selected' ? 'text-emerald-700' : 'text-rose-700'}>{decision}</strong></div>
              </div>
              <p className="text-[11px] text-slate-500">
                This will update Firestore state and write a notification to the <code>mail_queue</code> to inform the Institution POC.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Back to Edit
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleExecuteEvaluation}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors"
              >
                {isSubmitting ? 'Recording...' : 'Confirm & Dispatch'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MentorDashboard;
