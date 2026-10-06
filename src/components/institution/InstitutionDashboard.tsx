import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, TechnologyCategory, ProjectStatus } from '../../types';
import { 
  Search, 
  Filter, 
  Building2, 
  ArrowRight, 
  Clock, 
  Layers, 
  CheckCircle, 
  FileText, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface Props {
  onSelectProject: (projectId: string) => void;
  onOpenWorkspace: (projectId: string) => void;
}

export const InstitutionDashboard: React.FC<Props> = ({
  onSelectProject,
  onOpenWorkspace
}) => {
  const { currentUser, projects, institutions } = useApp();

  // Find this institution's profile and active project
  const currentInstitution = institutions.find(i => i.id === currentUser?.institutionId);
  const activeProject = projects.find(p => p.selectedByInstitutionId === currentUser?.institutionId && p.status !== 'Archived');

  // Search & Filters State (SRS Section 9)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'Claimed'>('All');
  const [selectedTechFilters, setSelectedTechFilters] = useState<TechnologyCategory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Extract distinct departments, sectors, durations
  const departments = useMemo(() => {
    const list = Array.from(new Set(projects.map(p => p.department)));
    return ['All', ...list];
  }, [projects]);

  const sectors = useMemo(() => {
    const list = Array.from(new Set(projects.map(p => p.sector)));
    return ['All', ...list];
  }, [projects]);

  const durations = useMemo(() => {
    const list = Array.from(new Set(projects.map(p => p.duration)));
    return ['All', ...list];
  }, [projects]);

  const techCategories: TechnologyCategory[] = ['Software', 'Hardware', 'Embedded', 'Hybrid'];

  const toggleTechFilter = (tech: TechnologyCategory) => {
    setSelectedTechFilters(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
    setCurrentPage(1);
  };

  // Filter logic (SRS Section 9 & 20)
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (p.isArchived) return false;

      // Search by Project ID or Project Title (SRS Section 9)
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const matchId = p.id.toLowerCase().includes(q);
        const matchTitle = p.title.toLowerCase().includes(q);
        if (!matchId && !matchTitle) return false;
      }

      // Department filter
      if (selectedDepartment !== 'All' && p.department !== selectedDepartment) {
        return false;
      }

      // Sector filter
      if (selectedSector !== 'All' && p.sector !== selectedSector) {
        return false;
      }

      // Duration filter
      if (selectedDuration !== 'All' && p.duration !== selectedDuration) {
        return false;
      }

      // Status filter: All, Available, Claimed / Chosen
      if (statusFilter === 'Available' && p.status !== 'Available') {
        return false;
      }
      if (statusFilter === 'Claimed' && p.status === 'Available') {
        return false;
      }

      // Technology Category filter (Software / Hardware / Embedded / Hybrid)
      if (selectedTechFilters.length > 0 && !selectedTechFilters.includes(p.technologyCategory)) {
        return false;
      }

      return true;
    });
  }, [projects, searchQuery, selectedDepartment, selectedSector, selectedDuration, statusFilter, selectedTechFilters]);

  // Pagination (10 projects per page per SRS Section 9)
  const totalPages = Math.ceil(filteredProjects.length / pageSize) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProjects.slice(start, start + pageSize);
  }, [filteredProjects, currentPage]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('All');
    setSelectedSector('All');
    setSelectedDuration('All');
    setStatusFilter('All');
    setSelectedTechFilters([]);
    setCurrentPage(1);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Institution Welcome Bar & Active Workspace Banner */}
      <div className="bg-gradient-to-r from-sky-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sky-300 text-xs font-semibold uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>{currentInstitution?.code || 'INST-PORTAL'}</span>
              <span>·</span>
              <span>NAAC {currentInstitution?.naacGrade || 'A++'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {currentInstitution?.name || currentUser?.name || 'Institution Workspace'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Chengalpattu Innovation District Problem Statements repository. Browse available government challenges and create multi-disciplinary student project teams.
            </p>
          </div>

          {/* Quick jump to active workspace if assigned */}
          {activeProject && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-col justify-between max-w-md shrink-0">
              <div className="flex items-center justify-between text-xs text-sky-200 mb-1">
                <span className="font-semibold uppercase tracking-wider">Your Registered Statement (1/1 Max)</span>
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  Locked to Your Institution
                </span>
              </div>
              <div className="text-sm font-bold text-white line-clamp-1 mb-1">
                {activeProject.title}
              </div>
              <p className="text-[11px] text-sky-100 mb-2">
                Your institution can nominate up to <strong>300 solutions</strong> for this challenge. Other institutions are blocked from registering this statement.
              </p>
              <button
                onClick={() => onSelectProject(activeProject.id)}
                className="w-full py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <span>Submit / View Team Solutions (300 Quota)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Filter & Search Panel (SRS Section 9) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Project ID (e.g. PRJ-DST-001) or Project Title..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:ring-1 focus:ring-sky-500 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {(searchQuery || selectedDepartment !== 'All' || selectedSector !== 'All' || selectedDuration !== 'All' || selectedTechFilters.length > 0) && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-lg transition-colors shrink-0 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        {/* Status Filter Tabs: All, Available, Chosen Statements */}
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-slate-100 pb-3 text-xs">
          <span className="text-slate-500 font-semibold mr-1">Statement Status:</span>
          <button
            onClick={() => {
              setStatusFilter('All');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              statusFilter === 'All'
                ? 'bg-[#0c2340] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Statements ({projects.filter(p => !p.isArchived).length})
          </button>

          <button
            onClick={() => {
              setStatusFilter('Available');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'Available'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Available ({projects.filter(p => !p.isArchived && p.status === 'Available').length})</span>
          </button>

          <button
            onClick={() => {
              setStatusFilter('Claimed');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'Claimed'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Chosen / Locked ({projects.filter(p => !p.isArchived && p.status !== 'Available').length})</span>
          </button>
        </div>

        {/* Dropdown Filters (Department, Sector, Duration) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div>
            <label className="block text-slate-500 font-medium mb-1">Department</label>
            <select
              value={selectedDepartment}
              onChange={e => {
                setSelectedDepartment(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700"
            >
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">Sector</label>
            <select
              value={selectedSector}
              onChange={e => {
                setSelectedSector(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700"
            >
              {sectors.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">Duration</label>
            <select
              value={selectedDuration}
              onChange={e => {
                setSelectedDuration(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700"
            >
              {durations.map(dur => (
                <option key={dur} value={dur}>{dur}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Buttons: Software, Hardware, Embedded, Hybrid */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Technology Category:
          </span>
          {techCategories.map(tech => {
            const active = selectedTechFilters.includes(tech);
            return (
              <button
                key={tech}
                onClick={() => toggleTechFilter(tech)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  active 
                    ? 'bg-sky-600 text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tech}
              </button>
            );
          })}
        </div>

      </div>

      {/* Project Listing Table & Mobile Card View */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              District Problem Statements
            </h2>
            <p className="text-xs text-slate-500">
              Showing {filteredProjects.length} statement{filteredProjects.length === 1 ? '' : 's'} matching criteria
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        {/* Mobile Responsive Card View (< md screens) */}
        <div className="block md:hidden divide-y divide-slate-100">
          {paginatedProjects.length === 0 ? (
            <div className="py-12 text-center text-slate-400 p-4">
              <Layers className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No problem statements found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search terms or filters</p>
            </div>
          ) : (
            paginatedProjects.map(proj => (
              <div 
                key={proj.id}
                onClick={() => onSelectProject(proj.id)}
                className="p-4 space-y-3 hover:bg-sky-50/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                    {proj.id}
                  </span>
                  <div>
                    {proj.status === 'Available' ? (
                      <span className="inline-flex items-center text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Available
                      </span>
                    ) : proj.selectedByInstitutionId === currentUser?.institutionId ? (
                      <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                        ✓ Claimed By You
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        Locked
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {proj.title}
                  </h3>
                  <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                    <span>{proj.department}</span>
                    <span>·</span>
                    <span className="font-mono">{proj.duration}</span>
                    <span>·</span>
                    <span className="font-semibold text-slate-700">{proj.technologyCategory}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">
                    Sector: {proj.sector}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject(proj.id);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-900 py-1"
                  >
                    <span>{proj.selectedByInstitutionId === currentUser?.institutionId ? 'Manage Solutions' : 'View Details'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Detailed Table View (>= md screens) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Project ID</th>
                <th className="py-3 px-4">Project Title</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Layers className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">No problem statements found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search terms or filters</p>
                  </td>
                </tr>
              ) : (
                paginatedProjects.map(proj => (
                  <tr 
                    key={proj.id}
                    onClick={() => onSelectProject(proj.id)}
                    className="hover:bg-sky-50/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                      {proj.id}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900 max-w-sm">
                      <div className="line-clamp-2 group-hover:text-sky-800 font-semibold">
                        {proj.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Category: {proj.technologyCategory}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      {proj.department}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-mono whitespace-nowrap">
                      {proj.duration}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      {proj.sector}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {proj.status === 'Available' ? (
                        <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Available
                        </span>
                      ) : proj.selectedByInstitutionId === currentUser?.institutionId ? (
                        <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                          ✓ Claimed By You (1/1)
                        </span>
                      ) : (
                        <div className="flex flex-col">
                          <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 w-fit">
                            Locked / Chosen
                          </span>
                          <span className="text-[10px] text-slate-500 truncate max-w-[140px] mt-0.5">
                            {proj.selectedByInstitutionName || 'Another College'}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProject(proj.id);
                        }}
                        className={`inline-flex items-center gap-1 text-xs font-semibold group-hover:translate-x-0.5 transition-transform ${
                          proj.selectedByInstitutionId === currentUser?.institutionId
                            ? 'text-blue-700 font-bold'
                            : proj.status === 'Available'
                            ? 'text-emerald-700 hover:text-emerald-900'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>{proj.selectedByInstitutionId === currentUser?.institutionId ? 'Manage Solutions' : 'View Details'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Control (SRS Section 9: < Previous 1 2 3 4 5 Next >) */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500">
            Showing {filteredProjects.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredProjects.length)} of {filteredProjects.length} entries
          </div>

          <div className="flex items-center gap-1 select-none">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent flex items-center gap-1 font-medium transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`w-8 h-8 rounded-md font-medium text-xs transition-colors ${
                  currentPage === pageNumber
                    ? 'bg-sky-600 text-white font-bold'
                    : 'text-slate-700 hover:bg-white border border-transparent hover:border-slate-200'
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent flex items-center gap-1 font-medium transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
