import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, collection, query, where, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  claimProblemStatementAtomic, 
  FirestoreProblemStatement, 
  FirestoreSolution,
  getGlobalConfig
} from '../../lib/firebaseServices';
import { 
  findProblemStatement, 
  normalizeToPortalId, 
  getFirestoreDocId 
} from '../../lib/problemStatementUtils';
import { useApp } from '../../context/AppContext';
import { SolutionSubmissionModal } from '../institution/SolutionSubmissionModal';
import { 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Plus, 
  ExternalLink,
  ChevronLeft,
  ArrowRight,
  GraduationCap,
  Briefcase,
  UserCheck,
  LogIn,
  LogOut,
  Sparkles,
  ChevronDown,
  Layers,
  Landmark,
  Shield,
  Video,
  Home,
  Info
} from 'lucide-react';
import { UserRole } from '../../types';

interface Props {
  psId: string;
  onBack: () => void;
  onOpenLogin: (role?: 'institution' | 'mentor') => void;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  'Software': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Hardware': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  'Embedded': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  'AI/ML': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'IoT': { bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-200' },
  'Healthcare': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  'Agriculture': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  'Data Science': { bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200' },
  'Cybersecurity': { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
  'Hybrid': { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' },
  'Others': { bg: 'bg-slate-50', text: 'text-slate-800', border: 'border-slate-200' }
};

export const DynamicProblemStatementPage: React.FC<Props> = ({
  psId,
  onBack,
  onOpenLogin
}) => {
  const { 
    currentUser, 
    institutions, 
    projects, 
    loginUser, 
    switchRole, 
    logoutUser, 
    setActivePage,
    setSelectedProjectId 
  } = useApp();

  // Normalize portal and database identifiers
  const canonicalPortalId = normalizeToPortalId(psId);
  const canonicalFirestoreId = getFirestoreDocId(psId);

  // Synchronously seed problem statement from registry/projects so page NEVER flashes "Problem Statement Not Found"
  const [statement, setStatement] = useState<FirestoreProblemStatement | null>(() => {
    return findProblemStatement(psId, projects) || findProblemStatement(canonicalPortalId, projects);
  });
  const [loading, setLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimConfirmOpen, setClaimConfirmOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [quickLoginDropdownOpen, setQuickLoginDropdownOpen] = useState(false);

  // Submissions for this statement & quota modal
  const [solutions, setSolutions] = useState<FirestoreSolution[]>([]);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [submissionDeadline, setSubmissionDeadline] = useState<string>('');

  // 1. Sync live Firestore document for this Problem Statement
  useEffect(() => {
    // Keep baseline local statement active
    const localBaseline = findProblemStatement(psId, projects) || findProblemStatement(canonicalPortalId, projects);
    if (localBaseline && !statement) {
      setStatement(localBaseline);
    }

    // Target the primary doc in Firestore
    const targetDocId = psId.startsWith('PRJ-DST-') ? psId : (canonicalFirestoreId || psId);
    const docRef = doc(db, 'problem_statements', targetDocId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setStatement(docSnap.data() as FirestoreProblemStatement);
      } else {
        // If primary doc does not exist, check the alternate alias ID in Firestore
        const altDocId = targetDocId === canonicalFirestoreId ? canonicalPortalId : canonicalFirestoreId;
        getDoc(doc(db, 'problem_statements', altDocId)).then((altSnap) => {
          if (altSnap.exists()) {
            setStatement(altSnap.data() as FirestoreProblemStatement);
          } else {
            // Keep guaranteed fallback from registry
            const fallback = findProblemStatement(psId, projects) || findProblemStatement(canonicalPortalId, projects);
            if (fallback) {
              setStatement(fallback);
              // Ensure doc exists in Firestore in background
              try {
                setDoc(docRef, fallback, { merge: true }).catch(() => {});
              } catch {}
            }
          }
        }).catch(() => {
          const fallback = findProblemStatement(psId, projects) || findProblemStatement(canonicalPortalId, projects);
          if (fallback) setStatement(fallback);
        });
      }
      setLoading(false);
    }, (err) => {
      console.warn('Live PS sync note:', err.message);
      // Ensure we preserve the problem statement so it never renders not found on error
      const fallback = findProblemStatement(psId, projects) || findProblemStatement(canonicalPortalId, projects);
      if (fallback) {
        setStatement(prev => prev || fallback);
      }
      setLoading(false);
    });

    // Fetch Global Deadline
    getGlobalConfig().then(cfg => {
      setSubmissionDeadline(cfg.submissionDeadline);
    }).catch(() => {});

    return () => unsubscribe();
  }, [psId, canonicalPortalId, canonicalFirestoreId, projects]);

  // 2. Sync live solutions submitted for this PS (both portal code and db alias)
  useEffect(() => {
    const candidateIds = Array.from(new Set([psId, canonicalPortalId, canonicalFirestoreId])).filter(Boolean);
    const q = query(collection(db, 'solutions'), where('psId', 'in', candidateIds));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => d.data() as FirestoreSolution);
      setSolutions(docs.sort((a, b) => b.submissionIndex - a.submissionIndex));
    }, (err) => {
      console.warn('Solutions sync note:', err.message);
    });

    return () => unsubscribe();
  }, [psId, canonicalPortalId, canonicalFirestoreId]);

  // Institution matching
  const currentInstitution = institutions.find(
    i => i.id === currentUser?.institutionId || 
         (currentUser?.role === 'institution' && i.coordinatorEmail?.toLowerCase() === currentUser?.email?.toLowerCase())
  ) || (currentUser?.role === 'institution' ? institutions[0] : null);

  const institutionId = currentInstitution?.id || currentUser?.institutionId || (currentUser?.role === 'institution' ? currentUser.id : null);
  const institutionName = currentInstitution?.name || currentUser?.name || 'Accredited Institution';

  // Check if claimed by the user's institution
  const isClaimedByMe = Boolean(
    currentUser &&
    institutionId &&
    statement?.claimedByInstitutionId &&
    (statement.claimedByInstitutionId === institutionId ||
     (statement.claimedByInstitutionName && statement.claimedByInstitutionName.toLowerCase().includes(institutionName.toLowerCase())))
  );

  // Check if student belongs to this project
  const isMyStudentProject = Boolean(
    currentUser?.role === 'student' &&
    (currentUser.projectId === psId || 
     currentUser.projectId === statement?.id ||
     (institutionId && statement?.claimedByInstitutionId === institutionId))
  );

  // Check if mentor is assigned to this project
  const isMyMentorProject = Boolean(
    currentUser?.role === 'mentor' &&
    statement?.assignedMentorId &&
    (statement.assignedMentorId === currentUser.id || statement.assignedMentorId === currentUser.mentorId)
  );

  // Check if this institution has already claimed another problem statement (1/1 Limit)
  const otherClaimedProject = projects.find(
    p => p.selectedByInstitutionId === institutionId && 
         p.id !== psId && 
         p.id !== statement?.id
  );
  const hasAlreadyClaimedAnother = Boolean(
    currentUser?.role === 'institution' && 
    institutionId && 
    otherClaimedProject
  );

  // Quick 1-click test login handler that stays on this Problem Statement page
  const handleQuickDemoLogin = (role: UserRole, email: string, pass: string) => {
    setQuickLoginDropdownOpen(false);
    loginUser(role, email, pass, 'problem-statement');
    setSuccessMessage(`Successfully authenticated as ${role.toUpperCase()}. Active session is now reflected.`);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  // Handle Atomic Claim Execution
  const handleExecuteClaim = async () => {
    if (!institutionId) {
      setErrorMessage('You must be authenticated as an accredited institution to claim.');
      return;
    }

    setClaimConfirmOpen(false);
    setErrorMessage(null);
    setSuccessMessage(null);
    setClaimLoading(true);

    try {
      const targetId = canonicalFirestoreId || psId;
      const res = await claimProblemStatementAtomic(targetId, institutionId, institutionName);
      
      // Also sync canonical portal document if exists separately
      if (canonicalPortalId && canonicalPortalId !== targetId) {
        try {
          await claimProblemStatementAtomic(canonicalPortalId, institutionId, institutionName);
        } catch {}
      }

      setClaimLoading(false);

      if (res.success) {
        setSuccessMessage(res.message);
        setStatement(prev => prev ? {
          ...prev,
          status: 'Claimed',
          claimedByInstitutionId: institutionId,
          claimedByInstitutionName: institutionName,
          claimedAt: new Date().toISOString()
        } : null);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setClaimLoading(false);
      setErrorMessage(err.message || 'Claim transaction failed.');
    }
  };

  const handleOpenWorkspace = () => {
    setSelectedProjectId(canonicalPortalId || statement?.id || psId);
    setActivePage('workspace');
  };

  const catStyle = statement ? (CATEGORY_STYLES[statement.category] || CATEGORY_STYLES['Others']) : CATEGORY_STYLES['Others'];

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600 font-mono">
          Loading Dynamic Problem Statement /{psId}...
        </p>
      </div>
    );
  }

  if (!statement) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Problem Statement Not Found</h2>
        <p className="text-xs text-slate-500">The identifier '{psId}' does not match any registered district civic challenges.</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Problem Statements</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* 1. TOP BREADCRUMB & LOGGED-IN SESSION STATUS BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              try { window.history.pushState({}, '', '/'); } catch {}
              setActivePage('home');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-900 transition-colors cursor-pointer bg-white border border-slate-300 px-3 py-1.5 rounded-xl shadow-2xs hover:bg-slate-50 active:scale-95"
            title="Return to Home"
          >
            <Home className="w-3.5 h-3.5 text-blue-900" />
            <span>Home</span>
          </button>
          <span className="text-slate-300">/</span>
          <button
            onClick={() => {
              try { window.history.pushState({}, '', '/about'); } catch {}
              setActivePage('about');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-900 transition-colors cursor-pointer bg-white border border-slate-300 px-3 py-1.5 rounded-xl shadow-2xs hover:bg-slate-50 active:scale-95"
            title="About Us"
          >
            <Info className="w-3.5 h-3.5 text-blue-900" />
            <span>About Us</span>
          </button>
          <span className="text-slate-300">/</span>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-900 transition-colors cursor-pointer bg-white border border-slate-300 px-3 py-1.5 rounded-xl shadow-2xs hover:bg-slate-50 active:scale-95"
            title="Return to Problem Statements"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-blue-900" />
            <span>Problem Statements</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Active Route:</span>
          <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
            /problem-statements/{psId}
          </span>
        </div>
      </div>

      {/* 2. AUTHENTICATED USER SESSION STATUS BAR (ALWAYS REFLECTS ACTIVE LOGIN) */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
        currentUser 
          ? 'bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white border-blue-800/80 shadow-md' 
          : 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-950 border-amber-200/90 shadow-2xs'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {currentUser ? (
            /* Authenticated User Active State */
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" title="Session Active" />
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black text-white truncate">
                    {currentUser.name}
                  </span>
                  
                  {/* Official Role Badges */}
                  {currentUser.role === 'institution' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-400/20 text-sky-200 border border-sky-400/30">
                      <Building2 className="w-3 h-3 text-sky-300" />
                      <span>Academic Institution</span>
                    </span>
                  )}
                  {currentUser.role === 'student' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                      <GraduationCap className="w-3 h-3 text-emerald-300" />
                      <span>Student Innovator</span>
                    </span>
                  )}
                  {currentUser.role === 'mentor' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-400/20 text-purple-200 border border-purple-400/30">
                      <Briefcase className="w-3 h-3 text-purple-300" />
                      <span>Industry Mentor</span>
                    </span>
                  )}
                  {currentUser.role === 'collector' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30">
                      <Landmark className="w-3 h-3 text-amber-300" />
                      <span>District Collector</span>
                    </span>
                  )}
                  {currentUser.role === 'superadmin' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-400/20 text-rose-200 border border-rose-400/30">
                      <Shield className="w-3 h-3 text-rose-300" />
                      <span>Super Admin</span>
                    </span>
                  )}

                  <span className="text-[10px] text-emerald-300 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    ● AUTHENTICATED
                  </span>
                </div>

                <div className="text-[11px] text-slate-300 flex flex-wrap items-center gap-3">
                  <span>Organization: <strong className="text-white">{institutionName}</strong></span>
                  <span className="text-slate-500">·</span>
                  <span>Email: <strong className="text-white">{currentUser.email}</strong></span>
                  {currentUser.role === 'student' && currentUser.registerNumber && (
                    <>
                      <span className="text-slate-500">·</span>
                      <span>Reg No: <strong className="text-white font-mono">{currentUser.registerNumber}</strong></span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Unauthenticated / Public Visitor State */
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-amber-200/60 text-amber-800 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-amber-700" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-950">
                    Browsing in Public Transparency Mode
                  </span>
                  <span className="text-[10px] font-semibold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md font-mono">
                    Guest Session
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 leading-normal">
                  All civic challenges are open for public viewing. Sign in to your verified account to claim this problem statement, submit solutions, or view team workspace.
                </p>
              </div>
            </div>
          )}

          {/* Quick Action Navigation / Switcher / Sign-In Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {currentUser ? (
              <>
                {currentUser.role === 'institution' && (
                  <button
                    onClick={() => setActivePage('dashboard')}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer border border-white/20"
                  >
                    Institution Dashboard →
                  </button>
                )}
                {currentUser.role === 'student' && (
                  <button
                    onClick={handleOpenWorkspace}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    Student Workspace →
                  </button>
                )}
                {currentUser.role === 'mentor' && (
                  <button
                    onClick={() => setActivePage('dashboard')}
                    className="px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Mentor Desk →
                  </button>
                )}
                {currentUser.role === 'superadmin' && (
                  <button
                    onClick={() => setActivePage('admin-master')}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Admin Master Control →
                  </button>
                )}
                {currentUser.role === 'collector' && (
                  <button
                    onClick={() => setActivePage('collector-exec')}
                    className="px-3 py-1.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Executive View →
                  </button>
                )}

                <button
                  onClick={() => {
                    logoutUser();
                    setSuccessMessage('Logged out. Now viewing in public guest mode.');
                    setTimeout(() => setSuccessMessage(null), 3000);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 border border-rose-500/30"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              /* Public Log In & Fast Demo Authenticator */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenLogin('institution')}
                  className="px-3.5 py-2 rounded-xl bg-[#0c2340] hover:bg-[#07172b] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-300" />
                  <span>Sign In</span>
                </button>

                {/* Quick 1-Click Demo Login to instantly test reflection */}
                <div className="relative">
                  <button
                    onClick={() => setQuickLoginDropdownOpen(!quickLoginDropdownOpen)}
                    className="px-3 py-2 rounded-xl bg-white border border-amber-300 text-amber-950 hover:bg-amber-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Quick Login</span>
                    <ChevronDown className="w-3 h-3 text-amber-700" />
                  </button>

                  {quickLoginDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setQuickLoginDropdownOpen(false)} />
                      <div className="absolute right-0 top-full mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-slate-800 space-y-1 animate-in fade-in zoom-in-95">
                        <div className="px-2.5 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                          1-Click Instant Authenticate
                        </div>
                        
                        <button
                          onClick={() => handleQuickDemoLogin('institution', 'coordinator@srmist.edu.in', 'password123')}
                          className="w-full text-left p-2 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2 text-xs font-medium cursor-pointer"
                        >
                          <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                          <div>
                            <div className="font-bold text-slate-900">SRM IST (Institution)</div>
                            <div className="text-[10px] text-slate-500">Coordinator · Dr. Sundararajan</div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleQuickDemoLogin('institution', 'innovation@ssn.edu.in', 'password123')}
                          className="w-full text-left p-2 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2 text-xs font-medium cursor-pointer"
                        >
                          <Building2 className="w-4 h-4 text-sky-600 shrink-0" />
                          <div>
                            <div className="font-bold text-slate-900">SSN College (Institution)</div>
                            <div className="text-[10px] text-slate-500">Available to claim statements</div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleQuickDemoLogin('student', '21104101', 'password123')}
                          className="w-full text-left p-2 rounded-xl hover:bg-emerald-50 transition-colors flex items-center gap-2 text-xs font-medium cursor-pointer"
                        >
                          <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <div className="font-bold text-slate-900">S. Vigneshwaran (Student)</div>
                            <div className="text-[10px] text-slate-500">Collegiate Team Lead · Reg 21104101</div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleQuickDemoLogin('mentor', 'rajeshwari.krishnan@bosch.com', 'password123')}
                          className="w-full text-left p-2 rounded-xl hover:bg-purple-50 transition-colors flex items-center gap-2 text-xs font-medium cursor-pointer"
                        >
                          <Briefcase className="w-4 h-4 text-purple-600 shrink-0" />
                          <div>
                            <div className="font-bold text-slate-900">Dr. Rajeshwari (Mentor)</div>
                            <div className="text-[10px] text-slate-500">Robert Bosch · Smart City Lead</div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleQuickDemoLogin('superadmin', 'admin.triplehelix@tn.gov.in', 'admin123')}
                          className="w-full text-left p-2 rounded-xl hover:bg-amber-50 transition-colors flex items-center gap-2 text-xs font-medium cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                          <div>
                            <div className="font-bold text-slate-900">Super Administrator</div>
                            <div className="text-[10px] text-slate-500">Master Control & Allocation</div>
                          </div>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Alert Messages */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-3 font-medium animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-3 font-medium animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Statement Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6 relative overflow-hidden">
        
        {/* Top Badges & Live Status Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-2">
            {/* PS ID */}
            <span className="text-xs font-mono font-bold bg-slate-900 text-white px-3 py-1 rounded-lg">
              {statement.psId.toUpperCase()}
            </span>

            {/* Category Badge matching the 10 domains */}
            <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
              {statement.category}
            </span>

            {/* Sector / Department */}
            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-100 text-slate-700">
              {statement.department}
            </span>
          </div>

          {/* LIVE STATUS INDICATOR (Available - Green vs Claimed - Locked) */}
          <div>
            {statement.status === 'Available' ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Available for Institution Claim</span>
              </div>
            ) : isClaimedByMe ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-300 text-blue-900 text-xs font-bold shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Locked to Your Institution ({statement.claimedByInstitutionName || institutionName})</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold shadow-xs">
                <Lock className="w-3.5 h-3.5 text-rose-600" />
                <span>Claimed by {statement.claimedByInstitutionName || 'Accredited College'}</span>
              </div>
            )}
          </div>

        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {statement.title}
        </h1>

        {/* Description */}
        <div className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-4xl space-y-4">
          <p>{statement.description}</p>
        </div>

        {/* Claim / Action Banner */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div>
            {statement.status === 'Claimed' ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>
                    Claimed Institution: {statement.claimedByInstitutionName || 'Accredited Institution'}
                    {isClaimedByMe && <span className="ml-1 text-emerald-600">(Your Institution)</span>}
                  </span>
                </div>
                {statement.claimedAt && (
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Locked at {new Date(statement.claimedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 max-w-md">
                Strict 1-Institute Lock Policy: An institution can lock only 1 problem statement. Upon claim, this statement permanently locks.
              </p>
            )}
          </div>

          {/* Action Buttons responding to Exact User Role & Login State */}
          <div className="flex flex-wrap items-center gap-3">
            {statement.status === 'Available' ? (
              /* Case A: Problem Statement is AVAILABLE */
              currentUser?.role === 'institution' ? (
                hasAlreadyClaimedAnother ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold max-w-sm">
                      ⚠️ 1/1 Limit: {institutionName} already claimed <strong>{otherClaimedProject?.id}</strong>.
                    </div>
                    {otherClaimedProject && (
                      <button
                        onClick={() => {
                          setSelectedProjectId(otherClaimedProject.id);
                          setActivePage('workspace');
                        }}
                        className="px-4 py-2 rounded-xl bg-[#0c2340] hover:bg-[#07172b] text-white text-xs font-bold shadow-xs cursor-pointer whitespace-nowrap"
                      >
                        View Your Project ({otherClaimedProject.id}) →
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setClaimConfirmOpen(true)}
                    disabled={claimLoading}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{claimLoading ? 'Locking Statement...' : `Claim & Lock Statement for ${institutionName} (1/1 Limit)`}</span>
                  </button>
                )
              ) : currentUser?.role === 'student' ? (
                <div className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-2 border border-slate-200">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span>Student View: Your Institution Coordinator can claim this statement.</span>
                </div>
              ) : currentUser?.role === 'mentor' ? (
                <div className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-2 border border-slate-200">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  <span>Mentor View: Open for Collegiate Institution Claim.</span>
                </div>
              ) : (currentUser?.role === 'superadmin' || currentUser?.role === 'collector') ? (
                <button
                  onClick={() => {
                    setClaimConfirmOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Authority: Allocate to Institution</span>
                </button>
              ) : (
                /* Guest / Not logged in */
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenLogin('institution')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c2340] hover:bg-[#07172b] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    <Building2 className="w-4 h-4 text-amber-300" />
                    <span>Login as Institution to Claim</span>
                  </button>
                </div>
              )
            ) : (
              /* Case B: Problem Statement is CLAIMED */
              (isClaimedByMe || isMyStudentProject) ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSubmissionModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Submit Team Solution ({solutions.length}/300)</span>
                  </button>
                  <button
                    onClick={handleOpenWorkspace}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    <span>Open Team Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : isMyMentorProject ? (
                <button
                  onClick={() => setActivePage('dashboard')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Review Submissions on Mentor Desk</span>
                </button>
              ) : (
                <div className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5 border border-slate-200">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Statement Locked to {statement.claimedByInstitutionName || 'Accredited College'}</span>
                </div>
              )
            )}
          </div>

        </div>

      </div>

      {/* Objectives & Deliverables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Objectives */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>Core Objectives</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            {statement.objectives?.map((obj, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Deliverables & Skills */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100">
            <FileText className="w-4 h-4 text-amber-600" />
            <span>Expected Deliverables & Required Skills</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            {statement.expectedDeliverables?.map((del, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <span>{del}</span>
              </li>
            ))}
          </ul>

          <div className="pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase block mb-2 font-mono">
              Recommended Technologies:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {statement.requiredSkills?.map((skill, i) => (
                <span key={i} className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Institution Solutions Roster Section (Shows submissions up to 300 quota) */}
      {(isClaimedByMe || isMyStudentProject || currentUser?.role === 'superadmin' || currentUser?.role === 'collector') && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                  Institution Team Solutions
                </span>
                <span className="bg-blue-100 text-blue-900 text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-full">
                  {solutions.length}/300 Total Nominations
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Each collegiate solution undergoes 3 sequential mentor review rounds (PPT/PDF → Prototype → Final Demo).
              </p>
            </div>

            <button
              onClick={() => setSubmissionModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Submit New Solution</span>
            </button>
          </div>

          {/* Solutions Table / List */}
          {solutions.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-medium text-slate-600">
                No solutions nominated yet for this problem statement.
              </p>
              <button
                onClick={() => setSubmissionModalOpen(true)}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                Submit Solution #1 / 300 →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {solutions.map((sol) => (
                <div 
                  key={sol.id} 
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-blue-950 text-white px-2.5 py-0.5 rounded-md">
                        #{sol.submissionIndex}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {sol.title}
                      </span>
                      <span className="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                        {sol.technologyBucket}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {sol.abstract}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                      <span>Leader: <strong>{sol.teamMembers?.find(m => m.role === 'LEADER')?.name || 'N/A'}</strong></span>
                      <span>Team: <strong>{sol.teamMembers?.length} Members</strong></span>
                      <span>Submitted: <strong>{new Date(sol.submittedAt).toLocaleDateString()}</strong></span>
                      {sol.youtubeUrl && (
                        <a 
                          href={sol.youtubeUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-rose-600 font-semibold hover:underline flex items-center gap-1"
                        >
                          <Video className="w-3 h-3" />
                          <span>Demo Video</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Stage Progress Badge */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      sol.currentStage === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : sol.currentStage === 'Rejected'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {sol.currentStage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* Confirmation Modal before Atomic Claim */}
      {claimConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                Confirm Permanent Statement Allocation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You are about to lock <strong>{statement.title}</strong> to <strong>{institutionName}</strong> via an atomic database transaction.
              </p>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-medium text-left">
                ⚠️ <strong>Strict Allocation Rule:</strong> 1 Institution can select only 1 Problem Statement. Once claimed, this action cannot be undone and no other college will be able to claim this statement.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setClaimConfirmOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleExecuteClaim}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors"
              >
                Confirm & Lock Statement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Solution Submission Modal */}
      {submissionModalOpen && (
        <SolutionSubmissionModal
          isOpen={submissionModalOpen}
          onClose={() => setSubmissionModalOpen(false)}
          psId={statement.psId}
          psTitle={statement.title}
          institutionId={institutionId || 'inst-001'}
          institutionName={institutionName}
          currentCount={solutions.length}
          deadlineIso={submissionDeadline}
          onSuccess={() => {
            // Document listener will automatically refresh solutions
          }}
        />
      )}

    </div>
  );
};

export default DynamicProblemStatementPage;
