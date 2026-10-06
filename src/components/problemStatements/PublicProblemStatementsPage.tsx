import React, { useState, useMemo, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useApp } from '../../context/AppContext';
import { Project, TechnologyCategory } from '../../types';
import { FirestoreProblemStatement } from '../../lib/firebaseServices';
import { 
  Search, 
  Filter, 
  Lightbulb, 
  Building2, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Lock, 
  X, 
  Share2, 
  Check, 
  Layers, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Info,
  Sparkles,
  Landmark,
  FileText,
  Home
} from 'lucide-react';

interface Props {
  onSelectStatement: (psId: string) => void;
  onOpenLogin: (role?: 'institution' | 'mentor') => void;
  onOpenRegisterInstitution?: () => void;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  'Software': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Hardware': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  'Embedded': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  'Hybrid': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  'AI/ML': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'IoT': { bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-200' },
  'Healthcare': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  'Agriculture': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  'Data Science': { bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200' },
  'Cybersecurity': { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
  'Others': { bg: 'bg-slate-50', text: 'text-slate-800', border: 'border-slate-200' }
};

export const PublicProblemStatementsPage: React.FC<Props> = ({
  onSelectStatement,
  onOpenLogin,
  onOpenRegisterInstitution
}) => {
  const { projects, currentUser, setActivePage } = useApp();

  // Live Firestore overlay for real-time status syncing
  const [firestoreStatements, setFirestoreStatements] = useState<Record<string, FirestoreProblemStatement>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Available' | 'Claimed'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // Listen to live Firestore problem statements for atomic claims and live status
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'problem_statements'), (snapshot) => {
        const mapping: Record<string, FirestoreProblemStatement> = {};
        snapshot.docs.forEach(doc => {
          mapping[doc.id] = doc.data() as FirestoreProblemStatement;
        });
        setFirestoreStatements(mapping);
      }, (err) => {
        console.warn('Firestore live PS sync warning:', err.message);
      });
      return () => unsub();
    } catch {
      // safe fallback if Firestore is temporarily offline
    }
  }, []);

  // Merge projects with live Firestore status
  const mergedStatements = useMemo(() => {
    return projects.map((p) => {
      const live = firestoreStatements[p.id];
      if (live) {
        return {
          ...p,
          status: (live.status === 'Claimed' ? 'In Progress' : 'Available') as Project['status'],
          selectedByInstitutionId: live.claimedByInstitutionId || p.selectedByInstitutionId,
          selectedByInstitutionName: live.claimedByInstitutionName || p.selectedByInstitutionName,
          technologyCategory: (live.category || p.technologyCategory) as TechnologyCategory,
          title: live.title || p.title,
          description: live.description || p.description
        };
      }
      return p;
    });
  }, [projects, firestoreStatements]);

  // Distinct departments
  const departments = useMemo(() => {
    const list = Array.from(new Set(mergedStatements.map(p => p.department))).filter(Boolean);
    return ['All', ...list];
  }, [mergedStatements]);

  // Distinct categories
  const categories = useMemo(() => {
    return [
      'All',
      'Software',
      'Hardware',
      'Embedded',
      'AI/ML',
      'IoT',
      'Healthcare',
      'Agriculture',
      'Data Science',
      'Cybersecurity'
    ];
  }, []);

  // Filtered statements
  const filteredStatements = useMemo(() => {
    return mergedStatements.filter((p) => {
      if (p.isArchived) return false;

      // Search matching (ID, title, description, department, sector, required skills)
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const matchId = p.id.toLowerCase().includes(q);
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchDept = p.department.toLowerCase().includes(q);
        const matchCat = p.technologyCategory.toLowerCase().includes(q);
        const matchSkills = p.requiredSkills?.some(s => s.toLowerCase().includes(q));
        if (!matchId && !matchTitle && !matchDesc && !matchDept && !matchCat && !matchSkills) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All' && p.technologyCategory !== selectedCategory) {
        return false;
      }

      // Department filter
      if (selectedDepartment !== 'All' && p.department !== selectedDepartment) {
        return false;
      }

      // Status filter
      if (selectedStatus === 'Available' && p.status !== 'Available') {
        return false;
      }
      if (selectedStatus === 'Claimed' && p.status === 'Available') {
        return false;
      }

      return true;
    });
  }, [mergedStatements, searchQuery, selectedCategory, selectedDepartment, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredStatements.length / pageSize) || 1;
  const paginatedStatements = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStatements.slice(start, start + pageSize);
  }, [filteredStatements, currentPage]);

  // Stats
  const totalCount = mergedStatements.length;
  const availableCount = mergedStatements.filter(p => p.status === 'Available').length;
  const claimedCount = mergedStatements.filter(p => p.status !== 'Available').length;

  const handleCopyLink = (psId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/problem-statements/${psId}`;
    navigator.clipboard?.writeText(url);
    setCopiedId(psId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDepartment('All');
    setSelectedStatus('All');
    setCurrentPage(1);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-slate-50/60 pb-16">
      
      {/* Quick Navigation Breadcrumbs Bar for Mobile and Desktop Access */}
      <div className="bg-white border-b border-slate-200/90 py-2.5 px-3.5 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                try { window.history.pushState({}, '', '/'); } catch {}
                setActivePage('home');
              }}
              className="inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-blue-900 transition-colors cursor-pointer bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-xl shadow-2xs active:scale-95"
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
              className="inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-blue-900 transition-colors cursor-pointer bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-xl shadow-2xs active:scale-95"
              title="About the Triple Helix Platform"
            >
              <Info className="w-3.5 h-3.5 text-blue-900" />
              <span>About Us</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="inline-flex items-center gap-1.5 font-bold text-blue-950 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Problem Statements</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-slate-500">
            <span>Chengalpattu District Innovation Mission</span>
          </div>
        </div>
      </div>

      {/* 1. Official Government Public Banner Header */}
      <section className="bg-gradient-to-br from-[#0c2340] via-[#0d2a63] to-[#17457a] text-white py-8 sm:py-14 border-b border-blue-900 shadow-md">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-400/15 border border-sky-300/30 text-sky-200 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
                <span>Open Civic Innovation Challenges · Public Access</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                District Problem Statements Repository
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
                All registered problem statements are open and fully accessible for public review. Students, faculty, industry mentors, and citizens can explore technical objectives, scope, and deliverables.
              </p>
            </div>

            {/* Public Access Badge & Institution CTA */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-2xl flex flex-col justify-between gap-3 shrink-0 max-w-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Public Transparency Assured</span>
              </div>
              <p className="text-[11px] text-slate-200 leading-normal">
                Any accredited institution may register a student team to claim an available challenge. Under district governance, an institution can lock only 1 statement.
              </p>
              {!currentUser ? (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onOpenLogin('institution')}
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all text-center cursor-pointer shadow-xs"
                  >
                    Institution Login
                  </button>
                  {onOpenRegisterInstitution && (
                    <button
                      onClick={onOpenRegisterInstitution}
                      className="py-2 px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all text-center cursor-pointer"
                    >
                      Register
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5 pt-1">
                  <div className="text-xs text-sky-200 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active Session: <strong className="text-white">{currentUser.name}</strong></span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Role: <strong className="text-amber-300 uppercase font-mono">{currentUser.role}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 border border-white/10 rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-extrabold text-white block leading-none">
                  {totalCount}
                </span>
                <span className="text-[11px] text-slate-300 font-medium">Total Challenges</span>
              </div>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-extrabold text-emerald-300 block leading-none">
                  {availableCount}
                </span>
                <span className="text-[11px] text-slate-300 font-medium">Available to Claim</span>
              </div>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-extrabold text-indigo-200 block leading-none">
                  {claimedCount}
                </span>
                <span className="text-[11px] text-slate-300 font-medium">Claimed / In Action</span>
              </div>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-extrabold text-amber-300 block leading-none">
                  10
                </span>
                <span className="text-[11px] text-slate-300 font-medium">Technical Sectors</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Main Directory Container */}
      <main className="w-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-6 space-y-6 overflow-x-hidden">
        
        {/* Search & Multifaceted Filter Controls */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          
          {/* Top row: Search Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search problem statements by ID (e.g. PRJ-DST-001), keyword, title, skills..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Department & Status Dropdowns */}
            <div className="w-full sm:w-auto shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <select
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-60 py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-700 focus:ring-2 focus:ring-sky-500 outline-hidden font-medium cursor-pointer"
              >
                <option value="All">All Departments</option>
                {departments.filter(d => d !== 'All').map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              {/* Status Selector */}
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-44 py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-700 focus:ring-2 focus:ring-sky-500 outline-hidden font-medium cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available Only</option>
                <option value="Claimed">Claimed / Locked</option>
              </select>
            </div>
          </div>

          {/* Category Horizontal Filter Tags */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
              <span className="text-xs font-semibold text-slate-500 mr-1 shrink-0 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Domain:</span>
              </span>
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0c2340] text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {(searchQuery || selectedCategory !== 'All' || selectedDepartment !== 'All' || selectedStatus !== 'All') && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              >
                <X className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

        </div>

        {/* Results Count Banner */}
        <div className="flex items-center justify-between text-xs text-slate-600 px-1">
          <div>
            Showing <strong>{filteredStatements.length}</strong> public problem statements
            {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
            {selectedDepartment !== 'All' && <span> under <strong>{selectedDepartment}</strong></span>}
            {selectedStatus !== 'All' && <span> with status <strong>{selectedStatus}</strong></span>}
          </div>

          <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {/* 3. Problem Statements Cards Grid */}
        {filteredStatements.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto shadow-2xs">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Problem Statements Matched</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No civic challenge was found matching your current filter criteria. Try clearing your search term or selecting "All Departments".
            </p>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedStatements.map((statement) => {
              const catStyle = CATEGORY_STYLES[statement.technologyCategory] || CATEGORY_STYLES['Others'];
              const isAvailable = statement.status === 'Available';
              const isCopied = copiedId === statement.id;

              return (
                <div
                  key={statement.id}
                  onClick={() => onSelectStatement(statement.id)}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-sky-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between p-5 sm:p-6 group cursor-pointer relative overflow-hidden"
                >
                  {/* Subtle top indicator bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${isAvailable ? 'bg-emerald-500' : 'bg-slate-400'}`} />

                  {/* Card Content Top */}
                  <div className="space-y-3.5">
                    
                    {/* Header Tags & Live Status */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2.5 py-0.5 rounded-md">
                          {statement.id}
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                          {statement.technologyCategory}
                        </span>
                      </div>

                      {/* Status indicator */}
                      <div>
                        {isAvailable ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Available</span>
                          </span>
                        ) : (currentUser?.institutionId && statement.selectedByInstitutionId === currentUser.institutionId) ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
                            <CheckCircle2 className="w-2.5 h-2.5 text-blue-700" />
                            <span>Your College</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            <Lock className="w-2.5 h-2.5 text-slate-500" />
                            <span>Claimed</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Problem Statement Title */}
                    <h2 className="text-base font-bold text-slate-900 group-hover:text-sky-800 transition-colors line-clamp-2 leading-snug">
                      {statement.title}
                    </h2>

                    {/* Department & Sector Banner */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5 font-medium">
                      <Landmark className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                      <span className="truncate" title={statement.department}>
                        {statement.department}
                      </span>
                    </div>

                    {/* Problem Statement Description */}
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {statement.description}
                    </p>

                    {/* Core Objectives Preview */}
                    {statement.objectives && statement.objectives.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Key Deliverable Focus
                        </span>
                        <div className="text-[11px] text-slate-700 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{statement.objectives[0]}</span>
                        </div>
                      </div>
                    )}

                    {/* Required Skills Chips */}
                    {statement.requiredSkills && statement.requiredSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {statement.requiredSkills.slice(0, 3).map((skill, sIdx) => (
                          <span key={sIdx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                            {skill}
                          </span>
                        ))}
                        {statement.requiredSkills.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            +{statement.requiredSkills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                    
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{statement.duration || '6 Months'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Copy Shareable Link */}
                      <button
                        onClick={(e) => handleCopyLink(statement.id, e)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Copy direct link to this statement"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                      </button>

                      {/* View Action */}
                      <div className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 group-hover:text-sky-900 group-hover:translate-x-0.5 transition-all">
                        <span>View Statement</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* 4. Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentPage === i + 1
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 5. Informational Bottom Notice on Public Access */}
        <section className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-2xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-900">
            <Info className="w-4 h-4 text-sky-700" />
            <span>Public Access & Institutional Claim Protocol</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            How District Innovation Problem Statements Work
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 leading-relaxed pt-1">
            <div className="bg-white/80 p-3.5 rounded-xl border border-sky-100 space-y-1">
              <strong className="text-slate-900 block font-bold">1. Public Availability</strong>
              <p>Every problem statement is published with complete civic context, objectives, deliverables, and engineering domains. No account is required to browse or study them.</p>
            </div>
            <div className="bg-white/80 p-3.5 rounded-xl border border-sky-100 space-y-1">
              <strong className="text-slate-900 block font-bold">2. Single-Statement Lock</strong>
              <p>When an accredited college claims an available statement, it becomes locked exclusively to that institution. Only one statement can be active per institution.</p>
            </div>
            <div className="bg-white/80 p-3.5 rounded-xl border border-sky-100 space-y-1">
              <strong className="text-slate-900 block font-bold">3. Multi-Team Solutions</strong>
              <p>The claiming institution can field up to 300 student teams under the guidance of assigned industry mentors and district officials to develop real-world prototypes.</p>
            </div>
          </div>
        </section>

      </main>

    </div>
  );
};
