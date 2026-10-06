import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { HeroCarousel } from './HeroCarousel';
import { 
  Building2, 
  Briefcase, 
  Landmark,
  ArrowRight, 
  ExternalLink,
  HelpCircle,
  FileText,
  Clock
} from 'lucide-react';
import { DistrictInnovationMetrics } from './DistrictInnovationMetrics';
import FrequentlyAskedQuestions from '@/components/ui/frequently-asked-questions-with-accordion';

interface LandingPageProps {
  onOpenLogin: (role?: UserRole) => void;
  onOpenRegisterInstitution: () => void;
  onOpenRegisterMentor: () => void;
  onSelectProject?: (projectId: string) => void;
  onSelectAllStatements?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegisterInstitution,
  onOpenRegisterMentor,
  onSelectProject,
  onSelectAllStatements
}) => {
  const { 
    projects, 
    institutions, 
    mentors, 
    faqList,
    contactSettings,
    setActivePage, 
    setSelectedProjectId,
    switchRole 
  } = useApp();

  // Statistics calculation
  const totalProjects = projects.length;
  const activeInstitutions = institutions.filter(i => i.status === 'Active').length;
  const registeredMentors = mentors.length;

  // Curated problem statements for the glimpse preview
  const previewProjects = projects.slice(0, 3);

  const handleOpenProjectDetail = (projectId: string) => {
    if (onSelectProject) {
      onSelectProject(projectId);
      return;
    }
    try {
      window.history.pushState({}, '', `/problem-statements/${projectId}`);
    } catch {}
    setSelectedProjectId(projectId);
    setActivePage('problem-statement');
  };

  const handleOpenAllStatements = () => {
    if (onSelectAllStatements) {
      onSelectAllStatements();
      return;
    }
    try {
      window.history.pushState({}, '', '/problem-statements');
    } catch {}
    setActivePage('problem-statements');
  };

  return (
    <div className="w-full flex flex-col min-h-screen overflow-x-hidden">
      
      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-5 sm:py-10 space-y-8 sm:space-y-12 overflow-x-hidden">
        
        {/* 1. Hero Showcase (Managed by Super Admin) */}
        <section className="w-full">
          <HeroCarousel 
            onOpenLogin={onOpenLogin}
            onOpenRegisterInstitution={onOpenRegisterInstitution}
            onOpenRegisterMentor={onOpenRegisterMentor}
          />
        </section>

        {/* 2. District Innovation Metrics (Framer-Motion Viewport Animated) */}
        <DistrictInnovationMetrics
          totalProblemStatements={totalProjects}
          activeInstitutions={activeInstitutions}
          registeredMentors={registeredMentors}
        />

        {/* 3. Tripartite Synthesis Glimpse (Triple Helix Ecosystem Model) */}
        <section className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
          {/* Subtle blueprint grid overlay matching website background */}
          <div 
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(203, 213, 225, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(203, 213, 225, 0.4) 1px, transparent 1px)',
              backgroundSize: '28px 28px'
            }}
          />

          <div className="relative z-10 space-y-6">
            
            {/* Header & Subtitle */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-800 bg-sky-50 border border-sky-200 px-3 py-1 rounded-md inline-block">
                  Tripartite Innovation Model
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10233F] mt-2">
                  A Tri-Partite Model for Societal Impact
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  The Triple Helix framework synchronizes three vital pillars to translate municipal and rural challenges into deployable, certified engineering solutions.
                </p>
              </div>

              <button
                onClick={() => setActivePage('about')}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 hover:text-sky-700 bg-slate-100 hover:bg-slate-200/80 px-4 py-2 rounded-xl transition-all cursor-pointer self-start md:self-auto shrink-0 shadow-2xs"
              >
                <span>Explore Full Framework</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Central Pillar: Three-Entity Glimpse Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Pillar 1: Government (Collectorate) - #1769AA */}
              <div className="bg-[#EAF4FC]/70 border border-[#1769AA]/30 rounded-2xl p-5 sm:p-6 space-y-3 relative shadow-2xs hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#1769AA]/30 flex items-center justify-center text-[#1769AA] shadow-2xs">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-[#1769AA] bg-white/90 px-2.5 py-0.5 rounded-full border border-[#1769AA]/20">
                    Pillar 01
                  </span>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#10233F]">
                    Government / Collectorate
                  </h3>
                  <span className="text-[11px] font-semibold text-[#1769AA] block">
                    Policies & Problem Statements
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Identifies critical district-level challenges, sanctions civic permissions, and establishes municipal pilot testbeds for public welfare.
                </p>
              </div>

              {/* Pillar 2: Academia (Institutions) - Royal Blue */}
              <div className="bg-[#EFF6FF]/80 border border-[#2563EB]/30 rounded-2xl p-5 sm:p-6 space-y-3 relative shadow-2xs hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#2563EB]/30 flex items-center justify-center text-[#2563EB] shadow-2xs">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-[#2563EB] bg-white/90 px-2.5 py-0.5 rounded-full border border-[#2563EB]/20">
                    Pillar 02
                  </span>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#10233F]">
                    Academia / Institutions
                  </h3>
                  <span className="text-[11px] font-semibold text-[#2563EB] block">
                    Student Talent & R&D Labs
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Accredited engineering colleges field dedicated student rosters to develop working embedded, IoT, and software prototypes under faculty supervision.
                </p>
              </div>

              {/* Pillar 3: Industry (Mentors) - #D49A24 */}
              <div className="bg-[#FFF5DD]/70 border border-[#D49A24]/30 rounded-2xl p-5 sm:p-6 space-y-3 relative shadow-2xs hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#D49A24]/30 flex items-center justify-center text-[#D49A24] shadow-2xs">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-[#D49A24] bg-white/90 px-2.5 py-0.5 rounded-full border border-[#D49A24]/20">
                    Pillar 03
                  </span>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#10233F]">
                    Industry / Mentors
                  </h3>
                  <span className="text-[11px] font-semibold text-[#D49A24] block">
                    Mentorship & Quality Standards
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Experienced corporate domain architects guide students through design reviews, hardware verification, and industrial-grade milestone audits.
                </p>
              </div>

            </div>

            {/* Connecting Ribbon with Central Mantra (No Spark) */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 text-white rounded-2xl p-4 sm:p-5">
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono uppercase tracking-widest text-sky-300 block">
                  Ecosystem Synthesis Core
                </span>
                <span className="text-xs sm:text-sm font-bold tracking-wide">
                  “COLLABORATION FOR REAL-WORLD IMPACT”
                </span>
              </div>

              <button
                onClick={handleOpenAllStatements}
                className="inline-flex items-center gap-2 bg-[#1769AA] hover:bg-[#125386] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <span>Browse Problem Statements</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </section>

        {/* 4. Problem Statements Glimpse (Curated Overview) */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/90 pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-800 bg-sky-50 border border-sky-200 px-3 py-0.5 rounded-md inline-block">
                District Challenges
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#10233F] mt-1.5">
                Problem Statements At A Glance
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Vetted civic challenges awaiting selection by verified engineering institutions
              </p>
            </div>

            <button
              onClick={handleOpenAllStatements}
              className="text-xs font-bold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1.5 transition-colors self-start sm:self-center cursor-pointer"
            >
              <span>View All {projects.length}+ Statements</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Glimpse Cards Grid (3 Curated Statements) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {previewProjects.map((p) => (
              <div 
                key={p.id}
                className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top metadata tags */}
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="font-mono text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                      {p.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      p.status === 'Available' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : p.status === 'In Progress'
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {p.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-800 transition-colors line-clamp-2">
                    {p.title}
                  </h3>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  {/* Technology category badge */}
                  <div className="pt-1">
                    <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md inline-block">
                      {p.technologyCategory}
                    </span>
                  </div>
                </div>

                {/* Footer with Department & View Action */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium truncate max-w-[140px]" title={p.department}>
                    {p.department}
                  </span>

                  <button
                    onClick={() => handleOpenProjectDetail(p.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Frequently Asked Questions (Equalized & Balanced Spacing) */}
        <section className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm space-y-5 sm:space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-800 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-md">
                  FAQ & Assistance
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#10233F] mt-1.5">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Common questions regarding institution registration, team formation, and milestone verification.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => setActivePage('faq')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl transition-colors cursor-pointer"
              >
                <span>View All FAQs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActivePage('contact')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#1769AA] hover:bg-[#125386] px-3.5 py-1.5 sm:py-2 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                <span>Contact Us</span>
              </button>
            </div>
          </div>

          {/* Equalized Embedded FAQ Accordion Component */}
          <FrequentlyAskedQuestions
            data={faqList.slice(0, 4)}
            supportEmail={contactSettings.primaryEmail}
            className="py-1"
          />

          {/* Contact Support Strip */}
          <div className="pt-3 border-t border-slate-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600 bg-slate-50/80 rounded-2xl p-3.5 sm:p-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>
                Need custom assistance or administrative onboarding? Our District IT cell responds within 24 hours.
              </span>
            </div>
            <button
              onClick={() => setActivePage('contact')}
              className="text-xs font-bold text-sky-800 hover:text-sky-950 underline underline-offset-4 cursor-pointer shrink-0"
            >
              Open Contact Us Desk &rarr;
            </button>
          </div>

        </section>

      </main>

    </div>
  );
};

export default LandingPage;
