import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  BarChart3, 
  TrendingUp, 
  Sparkles,
  RefreshCw,
  Award,
  Layers,
  FileText,
  Lock,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  fetchCollectorRealMetrics, 
  CollectorExecutiveMetrics 
} from '../../lib/firebaseServices';

interface Props {
  onOpenCertificates?: (projectId: string) => void;
}

export const CollectorDashboard: React.FC<Props> = ({ onOpenCertificates }) => {
  const { currentUser } = useApp();
  const [metrics, setMetrics] = useState<CollectorExecutiveMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const loadRealMetrics = async () => {
    setLoading(true);
    try {
      const data = await fetchCollectorRealMetrics();
      setMetrics(data);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn('Collector metrics sync note:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRealMetrics();
    // Auto refresh every 45 seconds for live district monitoring
    const interval = setInterval(loadRealMetrics, 45000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-[#081730] border border-blue-900/60 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>District Collector Executive Terminal · Real-Data Reporting</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Chengalpattu District Executive Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              Strictly real aggregated civic metrics computed directly via Firestore count aggregations (<code>getCountFromServer</code>). Zero synthetic data.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={loadRealMetrics}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Aggregating...' : 'Refresh Live Data'}</span>
            </button>
            {lastRefreshed && (
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                Synced {lastRefreshed}
              </span>
            )}
          </div>
        </div>

        {/* Live Aggregation Badge */}
        <div className="mt-4 pt-3 border-t border-blue-900/40 flex flex-wrap items-center gap-4 text-xs text-blue-200">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Direct Firestore Aggregation Pipeline Active</span>
          </span>
          <span>·</span>
          <span>Access Level: <strong>Collector Executive Clearance</strong></span>
          <span>·</span>
          <span>Scope: <strong>Chengalpattu All Civic Departments</strong></span>
        </div>
      </div>

      {loading && !metrics ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600 font-mono">
            Executing Firestore getCountFromServer queries across problem statements, quota registries, and mentor evaluations...
          </p>
        </div>
      ) : metrics ? (
        <>
          {/* 1. ALLOCATION STATS (Total PS vs Claimed vs Available) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>1. Problem Statement Allocation Metrics</span>
              </h2>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {metrics.allocationPercentage}% Locked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              
              {/* Total PS */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Total Problem Statements</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900">
                  {metrics.totalProblemStatements}
                </div>
                <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Sanctioned district civic challenges</span>
                </div>
              </div>

              {/* Claimed PS */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Claimed & Locked Statements</span>
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-rose-600">
                  {metrics.claimedProblemStatements}
                </div>
                <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>Permanent 1-Institute lock in effect</span>
                </div>
              </div>

              {/* Available PS */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Available For Adoption</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600">
                  {metrics.availableProblemStatements}
                </div>
                <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Open for accredited institution claim</span>
                </div>
              </div>

            </div>
          </section>

          {/* 2. REAL STAGE FUNNEL (Round 1 -> Round 2 -> Round 3 -> Completed) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>2. Real Solution Progression Funnel (Direct Count Aggregations)</span>
              </h2>
              <span className="text-xs font-mono text-slate-500">
                Total Solutions: {metrics.stageFunnel.totalSolutions}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              
              {/* Round 1 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-xs">
                <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded uppercase font-mono block mb-1">
                  Stage 1
                </span>
                <h3 className="text-xs font-semibold text-slate-600">Round 1 (PPT/PDF)</h3>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-700 mt-2">
                  {metrics.stageFunnel.round1}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Initial Screening</span>
              </div>

              {/* Round 2 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-xs">
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded uppercase font-mono block mb-1">
                  Stage 2
                </span>
                <h3 className="text-xs font-semibold text-slate-600">Round 2 (Prototype)</h3>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600 mt-2">
                  {metrics.stageFunnel.round2}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Hardware Testing</span>
              </div>

              {/* Round 3 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-xs">
                <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded uppercase font-mono block mb-1">
                  Stage 3
                </span>
                <h3 className="text-xs font-semibold text-slate-600">Round 3 (Civic Demo)</h3>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-700 mt-2">
                  {metrics.stageFunnel.round3}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Field Deployment</span>
              </div>

              {/* Completed */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-xs">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded uppercase font-mono block mb-1">
                  Grand Finale
                </span>
                <h3 className="text-xs font-semibold text-slate-600">Completed & Certified</h3>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 mt-2">
                  {metrics.stageFunnel.completed}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Pilot Ready</span>
              </div>

              {/* Rejected */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-xs col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded uppercase font-mono block mb-1">
                  Revisions
                </span>
                <h3 className="text-xs font-semibold text-slate-600">Rejected</h3>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-600 mt-2">
                  {metrics.stageFunnel.rejected}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Archived</span>
              </div>

            </div>
          </section>

          {/* 3. INSTITUTION SUBMISSION VELOCITIES (Live Count/300 Progress Table) */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>3. Institution Submission Velocities (Live [Count]/300 Quota)</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Live tracking of all collegiate engineering teams against the 300 maximum nomination limit.
                </p>
              </div>

              <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                {metrics.institutionsVelocities.length} Institutions Registered
              </span>
            </div>

            {/* Mobile Card View (< md screens) */}
            <div className="block md:hidden divide-y divide-slate-100">
              {metrics.institutionsVelocities.map((inst) => (
                <div key={inst.institutionId} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{inst.institutionName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{inst.code}</div>
                    </div>
                    {inst.submissionCount > 0 ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
                        <TrendingUp className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">Idle</span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Claimed Statement
                    </span>
                    {inst.claimedPsId ? (
                      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 space-y-1">
                        <span className="inline-block bg-blue-100 text-blue-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                          {inst.claimedPsId.toUpperCase()}
                        </span>
                        <div className="text-xs text-slate-800 font-medium line-clamp-1">
                          {inst.claimedPsTitle}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-xs">No statement claimed yet</span>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between font-mono font-bold text-slate-800 text-xs">
                      <span>Quota: {inst.submissionCount} / 300</span>
                      <span className="text-blue-700">{inst.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          inst.submissionCount >= 280
                            ? 'bg-rose-500'
                            : inst.submissionCount >= 100
                            ? 'bg-blue-600'
                            : 'bg-sky-500'
                        }`}
                        style={{ width: `${inst.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono text-right">
                    Last Submission: {inst.lastSubmissionAt ? new Date(inst.lastSubmissionAt).toLocaleDateString() : '—'}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= md screens) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase font-mono text-[11px]">
                    <th className="py-3 px-3">Institution & Code</th>
                    <th className="py-3 px-3">Claimed Problem Statement</th>
                    <th className="py-3 px-3 w-56">Submissions Progress</th>
                    <th className="py-3 px-3 text-right">Quota Velocity</th>
                    <th className="py-3 px-3 text-right">Last Submission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {metrics.institutionsVelocities.map((inst) => (
                    <tr key={inst.institutionId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">{inst.institutionName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{inst.code}</div>
                      </td>

                      <td className="py-3.5 px-3">
                        {inst.claimedPsId ? (
                          <div className="space-y-0.5">
                            <span className="inline-block bg-blue-100 text-blue-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                              {inst.claimedPsId.toUpperCase()}
                            </span>
                            <div className="text-slate-700 font-medium line-clamp-1 max-w-xs text-[11px]">
                              {inst.claimedPsTitle}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No statement claimed yet</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between font-mono font-bold text-slate-800 text-[11px]">
                            <span>{inst.submissionCount} / 300</span>
                            <span>{inst.progressPercentage}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                inst.submissionCount >= 280
                                  ? 'bg-rose-500'
                                  : inst.submissionCount >= 100
                                  ? 'bg-blue-600'
                                  : 'bg-sky-500'
                              }`}
                              style={{ width: `${inst.progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-800">
                        {inst.submissionCount > 0 ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                            <TrendingUp className="w-3 h-3" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">Idle</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-right text-slate-500 font-mono text-[11px]">
                        {inst.lastSubmissionAt 
                          ? new Date(inst.lastSubmissionAt).toLocaleDateString()
                          : '—'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 4. INDUSTRY MENTOR REVIEW TRACKING */}
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>4. Industry Mentor Review Tracking</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Total assigned submissions vs. completed evaluations per mentor across all domains.
                </p>
              </div>
            </div>

            {/* Mobile Card View (< md screens) */}
            <div className="block md:hidden divide-y divide-slate-100">
              {metrics.mentorReviews.map((mentor) => (
                <div key={mentor.mentorId} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{mentor.name}</div>
                      <div className="text-[10px] text-slate-400">{mentor.organization}</div>
                    </div>
                    <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                      mentor.completionRate >= 80 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {mentor.completionRate}%
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {mentor.assignedDomains.map((d, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {d}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center pt-1 border-t border-slate-100">
                    <div className="bg-slate-50 rounded-xl p-2">
                      <span className="text-[10px] text-slate-400 block uppercase">Assigned</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {mentor.assignedSubmissionsCount}
                      </span>
                    </div>
                    <div className="bg-blue-50/70 rounded-xl p-2">
                      <span className="text-[10px] text-blue-600 block uppercase">Evaluated</span>
                      <span className="font-mono font-bold text-blue-700 text-sm">
                        {mentor.completedEvaluationsCount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= md screens) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase font-mono text-[11px]">
                    <th className="py-3 px-3">Mentor & Organization</th>
                    <th className="py-3 px-3">Domains</th>
                    <th className="py-3 px-3 text-center">Assigned Solutions</th>
                    <th className="py-3 px-3 text-center">Evaluations Completed</th>
                    <th className="py-3 px-3 text-right">Completion Velocity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {metrics.mentorReviews.map((mentor) => (
                    <tr key={mentor.mentorId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">{mentor.name}</div>
                        <div className="text-[10px] text-slate-400">{mentor.organization}</div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {mentor.assignedDomains.map((d, i) => (
                            <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                              {d}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-900">
                        {mentor.assignedSubmissionsCount}
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono font-bold text-blue-600">
                        {mentor.completedEvaluationsCount}
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                          mentor.completionRate >= 80 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {mentor.completionRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}

    </div>
  );
};

export default CollectorDashboard;
