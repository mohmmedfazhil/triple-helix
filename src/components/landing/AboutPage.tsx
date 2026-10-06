import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Landmark, 
  Briefcase, 
  ArrowLeft, 
  CheckCircle2,
  Quote,
  ArrowDown,
  Sparkles,
  ShieldCheck,
  Award,
  Layers,
  Users
} from 'lucide-react';
import { TripleHelixEcosystemVisual } from './TripleHelixEcosystemVisual';
import { ProcessLifecycleVisual } from './ProcessLifecycleVisual';
import distCollectorImg from '../../assets/images/dist_collector.jpg';
import revenueOfficerImg from '../../assets/images/revenue_officer.jpg';
import drdaImg from '../../assets/images/drda.jpg';

export const AboutPage: React.FC = () => {
  const { setActivePage } = useApp();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleReturnHome = () => {
    try {
      window.history.pushState({}, '', '/');
    } catch {}
    setActivePage('home');
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/60 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        
        {/* Navigation Bar Back Link & Official Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleReturnHome}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#10233F] hover:text-sky-700 transition-colors bg-white border border-slate-200/90 shadow-2xs hover:bg-slate-50 px-4 py-2 rounded-xl cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portal</span>
          </button>

          <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-widest hidden xs:inline-block">
            Government of Tamil Nadu · District Innovation Ecosystem
          </span>
        </div>

        {/* 1. OFFICIAL TITLE & TAGLINE (From Official Document Page 1) */}
        <div className="text-center space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-blue-50 text-blue-900 border border-blue-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>District Innovation Mission Initiative</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0c2340] tracking-tight">
            TRIPLE HELIX
          </h1>

          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-[#1769AA] uppercase tracking-wider font-mono">
            <span>Institution</span>
            <span className="text-amber-500">•</span>
            <span>Industry</span>
            <span className="text-amber-500">•</span>
            <span>Government</span>
          </div>
        </div>

        {/* 2. ABOUT US SECTION (From Official Document Page 1) */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-sky-50 text-sky-800 border border-sky-200/70">
            About Us
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            Bridging Progress Through Collaborative District Governance
          </h2>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Triple Helix is a web portal that brings together three pillars of progress – Institutions, Industries and Government – on a single collaborative platform. Industries post the real-time problems they face to the District Government through the portal, and these problem statements are taken up and solved by students from institutions, working hand in hand with industry professionals.
          </p>
        </section>

        {/* 3. OUR VISION & KEY PRINCIPLES (From Official Document Page 1) */}
        <section className="bg-gradient-to-br from-[#0c2340] via-[#0d2a63] to-[#17457a] text-white rounded-3xl p-6 sm:p-10 shadow-md space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
              Strategic Vision
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Our Vision
            </h2>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-slate-100 text-sm sm:text-base leading-relaxed">
            The Triple Helix Model was initiated by <strong>Thiru. Dr. M. Veerappan, I.A.S.</strong>, District Collector. The model focuses on connecting institutions, industry and government so that real industry challenges become learning and innovation opportunities for students.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Industries share live, real-world problem statements with the District Government.
              </p>
            </div>

            <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Problem statements are solved by students from institutions.
              </p>
            </div>

            <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Industry professionals work together with students, guiding them to solve the problem in the relevant industry.
              </p>
            </div>

            <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Government facilitates and monitors the collaboration for the growth of the district.
              </p>
            </div>
          </div>
        </section>

        {/* 4. OUR MISSION STATEMENT (From Official Document Page 1) */}
        <section className="bg-amber-50/70 border border-amber-200/90 rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <Quote className="absolute right-6 top-6 w-16 h-16 text-amber-200/40 pointer-events-none" />
          
          <div className="space-y-3 relative z-10 max-w-4xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 font-mono">
              Core Mandate
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-amber-950">
              Our Mission
            </h2>
            <blockquote className="text-base sm:text-xl font-semibold text-slate-900 italic leading-relaxed">
              “To bridge the gap between classroom learning and industry needs by empowering students to solve real-world problems, fostering collaboration among institutions, industries and government for inclusive and sustainable district development.”
            </blockquote>
          </div>
        </section>

        {/* VISUAL ECOSYSTEM & WORKFLOW LIFECYCLE SHOWCASES */}
        <section className="space-y-8">
          <TripleHelixEcosystemVisual />
          <ProcessLifecycleVisual />
        </section>

        {/* IMPLEMENTATION TEAM (Official Page 2 with the 3 Uploaded Photos) */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-900 border border-blue-200">
              <Users className="w-3.5 h-3.5 text-blue-700" />
              <span>Leadership & Governance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Implementation Team
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The Triple Helix initiative is driven by the District Administration under the guidance of the following officials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-2">
            
            {/* Official 1: Thiru. Dr. M. Veerappan, I.A.S. - District Collector */}
            <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-200 rounded-3xl p-6 text-center shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between space-y-4 group">
              <div className="space-y-4 flex flex-col items-center w-full">
                <div className="relative w-36 h-44 sm:w-40 sm:h-48 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 shadow-xs group-hover:border-blue-500 transition-colors">
                  <img 
                    src={distCollectorImg} 
                    alt="Thiru. Dr. M. Veerappan, I.A.S. - District Collector"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-blue-900/90 text-white p-1 rounded-md shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    Thiru. Dr. M. Veerappan, I.A.S.
                  </h3>
                  <div className="text-xs font-extrabold text-blue-800 font-mono uppercase tracking-wider">
                    District Collector
                  </div>
                </div>
              </div>

              <div className="w-full pt-3 border-t border-slate-100">
                <span className="inline-block text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  Visionary & Initiator of the Triple Helix Model
                </span>
              </div>
            </div>

            {/* Official 2: Thiru. M. Ganesh Kumar, B.E. - District Revenue Officer */}
            <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-200 rounded-3xl p-6 text-center shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between space-y-4 group">
              <div className="space-y-4 flex flex-col items-center w-full">
                <div className="relative w-36 h-44 sm:w-40 sm:h-48 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 shadow-xs group-hover:border-blue-500 transition-colors">
                  <img 
                    src={revenueOfficerImg} 
                    alt="Thiru. M. Ganesh Kumar, B.E. - District Revenue Officer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-blue-900/90 text-white p-1 rounded-md shadow-xs">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    Thiru. M. Ganesh Kumar, B.E.
                  </h3>
                  <div className="text-xs font-extrabold text-blue-800 font-mono uppercase tracking-wider">
                    District Revenue Officer
                  </div>
                </div>
              </div>

              <div className="w-full pt-3 border-t border-slate-100">
                <span className="inline-block text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  Implementation Team
                </span>
              </div>
            </div>

            {/* Official 3: Tmt. K. Shruthi - Project Director (DRDA) */}
            <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-200 rounded-3xl p-6 text-center shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between space-y-4 group">
              <div className="space-y-4 flex flex-col items-center w-full">
                <div className="relative w-36 h-44 sm:w-40 sm:h-48 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 shadow-xs group-hover:border-blue-500 transition-colors">
                  <img 
                    src={drdaImg} 
                    alt="Tmt. K. Shruthi - Project Director (DRDA)"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-blue-900/90 text-white p-1 rounded-md shadow-xs">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    Tmt. K. Shruthi
                  </h3>
                  <div className="text-xs font-extrabold text-blue-800 font-mono uppercase tracking-wider">
                    Project Director (DRDA)
                  </div>
                </div>
              </div>

              <div className="w-full pt-3 border-t border-slate-100">
                <span className="inline-block text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  Implementation Team
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* 8. Call to Action */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm font-semibold text-slate-700">
            Ready to participate in district problem solving?
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                try { window.history.pushState({}, '', '/problem-statements'); } catch {}
                setActivePage('problem-statements');
              }}
              className="text-xs font-bold px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Explore Problem Statements
            </button>
            <button
              onClick={handleReturnHome}
              className="text-xs font-bold px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
