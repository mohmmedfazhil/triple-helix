import React from 'react';
import { motion } from 'framer-motion';
import { 
  UploadCloud, 
  CheckCircle2, 
  Check, 
  ArrowRight, 
  ArrowDown,
  Users, 
  Laptop, 
  FileCheck, 
  QrCode,
  Radio
} from 'lucide-react';

export const ProcessLifecycleVisual: React.FC = () => {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-[#F7FAFC] border border-slate-200/90 shadow-lg p-5 sm:p-8 lg:p-10 select-none">
      
      {/* 1. Subtle Engineering Matrix Background Grid */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(16, 35, 63, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 35, 63, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px'
        }}
      />

      {/* 2. Soft Atmospheric Ambient Vignettes */}
      <div 
        className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-45"
        style={{ background: 'radial-gradient(circle, rgba(0, 195, 255, 0.15) 0%, rgba(23, 105, 170, 0.06) 50%, transparent 75%)' }}
      />
      <div 
        className="absolute top-1/2 left-1/3 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-45"
        style={{ background: 'radial-gradient(circle, rgba(0, 230, 118, 0.15) 0%, rgba(46, 139, 87, 0.06) 50%, transparent 75%)' }}
      />
      <div 
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-45"
        style={{ background: 'radial-gradient(circle, rgba(255, 214, 0, 0.18) 0%, rgba(212, 154, 36, 0.06) 50%, transparent 75%)' }}
      />

      {/* 3. Section Header inside visual */}
      <div className="relative z-20 mb-6 sm:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-[11px] font-extrabold tracking-wider uppercase bg-[#EAF4FC] text-[#1769AA] border border-[#1769AA]/25 mb-2 font-mono">
            Process Lifecycle
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#10233F] tracking-tight">
            5-Step End-to-End Innovation Journey
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Continuous, transparent civic engineering protocol from municipal problem identification to verified field deployment.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[11px] font-medium text-slate-600 bg-white/80 border border-slate-200 px-3.5 py-1.5 rounded-full shadow-2xs self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Stage-Gated District Workflow</span>
        </div>
      </div>

      {/* 4. Desktop Flowing Connection Pathway SVG (Visible on Large Screens) */}
      <div className="hidden lg:block absolute inset-x-8 top-[245px] h-12 pointer-events-none z-10">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 40">
          <defs>
            <linearGradient id="journeyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1769AA" />
              <stop offset="25%" stopColor="#00C2FF" />
              <stop offset="50%" stopColor="#2E8B57" />
              <stop offset="75%" stopColor="#D49A24" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          <path
            d="M 50 20 Q 250 8, 450 20 T 850 20 L 960 20"
            fill="none"
            stroke="url(#journeyGradient)"
            strokeWidth="3"
            strokeDasharray="6 6"
            className="opacity-70"
          />

          <circle cx="210" cy="18" r="4" fill="#00C2FF" />
          <circle cx="410" cy="18" r="4" fill="#2E8B57" />
          <circle cx="610" cy="18" r="4" fill="#D49A24" />
          <circle cx="810" cy="18" r="4" fill="#10B981" />
        </svg>
      </div>

      {/* 5. Five Workflow Stage Cards (Stacked on Mobile, Grid on Tablet/Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-4 xl:gap-5 relative z-20">

        {/* ================= STEP 01 ================= */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-white/95 backdrop-blur-md border border-[#1769AA]/30 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative overflow-hidden group h-full"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-[#1769AA] bg-[#EAF4FC] px-2.5 py-0.5 rounded-md border border-[#1769AA]/20">
                  STEP 01
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  GOVERNMENT
                </span>
              </div>

              {/* Visual: District Collectorate Building */}
              <div className="h-28 sm:h-32 rounded-xl bg-gradient-to-b from-[#EAF4FC] to-white border border-[#1769AA]/20 p-2.5 relative flex flex-col items-center justify-center overflow-hidden shadow-2xs">
                <div className="text-[#1769AA] opacity-85 scale-90">
                  <svg viewBox="0 0 50 35" className="w-16 h-12" fill="currentColor">
                    <polygon points="25,3 5,13 45,13" fill="#1769AA" />
                    <rect x="23" y="1" width="4" height="3" rx="0.5" fill="#00C2FF" />
                    <rect x="8" y="14" width="3.5" height="15" rx="0.5" fill="#1769AA" />
                    <rect x="15.5" y="14" width="3.5" height="15" rx="0.5" fill="#1769AA" />
                    <rect x="23" y="14" width="3.5" height="15" rx="0.5" fill="#1769AA" />
                    <rect x="30.5" y="14" width="3.5" height="15" rx="0.5" fill="#1769AA" />
                    <rect x="38" y="14" width="3.5" height="15" rx="0.5" fill="#1769AA" />
                    <rect x="4" y="29" width="42" height="3" rx="1" fill="#1769AA" />
                  </svg>
                </div>
                <div className="absolute bottom-2 right-2 bg-white/95 border border-[#1769AA]/30 rounded-lg px-2 py-1 shadow-sm flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-[#1769AA]" />
                  <span className="text-[9px] font-bold text-[#10233F] font-mono">PS-2026</span>
                  <UploadCloud className="w-3 h-3 text-[#00C2FF]" />
                </div>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#10233F] leading-snug">
                  Government Uploads Challenge
                </h3>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  District Collectorate departments identify civic bottlenecks and publish structured, verifiable engineering briefs.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-[#1769AA] font-semibold">
              <span>Civic Challenge Gate</span>
              <ArrowRight className="w-3 h-3 hidden lg:block" />
              <ArrowDown className="w-3 h-3 lg:hidden" />
            </div>
          </motion.div>
        </div>

        {/* ================= STEP 02 ================= */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="bg-white/95 backdrop-blur-md border border-[#2E8B57]/30 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative overflow-hidden group h-full"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-[#2E8B57] bg-[#EAF6EF] px-2.5 py-0.5 rounded-md border border-[#2E8B57]/20">
                  STEP 02
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  ACADEMIA
                </span>
              </div>

              <div className="h-28 sm:h-32 rounded-xl bg-gradient-to-b from-[#EAF6EF] to-white border border-[#2E8B57]/20 p-2.5 relative flex flex-col items-center justify-center overflow-hidden shadow-2xs">
                <div className="text-[#2E8B57] opacity-85 scale-90">
                  <svg viewBox="0 0 50 35" className="w-16 h-12" fill="currentColor">
                    <rect x="6" y="12" width="14" height="18" rx="0.5" fill="#2E8B57" />
                    <rect x="22" y="6" width="14" height="24" rx="0.5" fill="#2E8B57" />
                    <rect x="38" y="12" width="8" height="18" rx="0.5" fill="#2E8B57" opacity="0.8" />
                    <circle cx="29" cy="11" r="2.5" fill="#FFFFFF" />
                  </svg>
                </div>
                <div className="absolute bottom-2 left-2 bg-white/95 border border-[#2E8B57]/30 rounded-lg px-2 py-1 shadow-sm flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-[#2E8B57]" />
                  <span className="text-[9px] font-bold text-[#10233F]">Team (5 Students)</span>
                </div>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#10233F] leading-snug">
                  Institution Selects Project
                </h3>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  Accredited colleges lock projects and register an official 5-student collegiate engineering roster with faculty mentor.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-[#2E8B57] font-semibold">
              <span>Project Locked & Team Formed</span>
              <ArrowRight className="w-3 h-3 hidden lg:block" />
              <ArrowDown className="w-3 h-3 lg:hidden" />
            </div>
          </motion.div>
        </div>

        {/* ================= STEP 03 ================= */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white/95 backdrop-blur-md border border-[#D49A24]/30 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative overflow-hidden group h-full"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-[#D49A24] bg-[#FFF5DD] px-2.5 py-0.5 rounded-md border border-[#D49A24]/20">
                  STEP 03
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  INDUSTRY
                </span>
              </div>

              <div className="h-28 sm:h-32 rounded-xl bg-gradient-to-b from-[#FFF5DD] to-white border border-[#D49A24]/20 p-2.5 relative flex flex-col items-center justify-center overflow-hidden shadow-2xs">
                <div className="text-[#D49A24] opacity-85 scale-90">
                  <svg viewBox="0 0 50 35" className="w-16 h-12" fill="currentColor">
                    <rect x="14" y="9" width="22" height="14" rx="1" fill="#10233F" />
                    <rect x="16" y="11" width="18" height="10" rx="0.5" fill="#FFF5DD" />
                    <polygon points="10,24 40,24 43,27 7,27" fill="#D49A24" />
                  </svg>
                </div>
                <div className="absolute bottom-2 right-2 bg-white/95 border border-[#D49A24]/30 rounded-lg px-2 py-1 shadow-sm flex items-center gap-1">
                  <Laptop className="w-3 h-3 text-[#D49A24]" />
                  <span className="text-[9px] font-bold text-[#10233F]">Architecture Review</span>
                </div>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#10233F] leading-snug">
                  Mentor Guides Institution
                </h3>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  Corporate engineering domain mentors conduct technical design reviews, hardware critiques, and industrial guidance.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-[#D49A24] font-semibold">
              <span>Corporate Mentorship</span>
              <ArrowRight className="w-3 h-3 hidden lg:block" />
              <ArrowDown className="w-3 h-3 lg:hidden" />
            </div>
          </motion.div>
        </div>

        {/* ================= STEP 04 ================= */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative overflow-hidden group h-full"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                  STEP 04
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  EVALUATION
                </span>
              </div>

              <div className="h-28 sm:h-32 rounded-xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 p-2.5 flex flex-col justify-between shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center justify-between bg-white/90 border border-slate-200/80 px-2 py-0.5 rounded text-[10px]">
                    <span className="font-semibold text-slate-700 truncate">M1 · Docs</span>
                    <Check className="w-3 h-3 text-emerald-600 font-bold" />
                  </div>
                  <div className="flex items-center justify-between bg-white/90 border border-slate-200/80 px-2 py-0.5 rounded text-[10px]">
                    <span className="font-semibold text-slate-700 truncate">M2 · Prototype</span>
                    <Check className="w-3 h-3 text-emerald-600 font-bold" />
                  </div>
                  <div className="flex items-center justify-between bg-white/90 border border-slate-200/80 px-2 py-0.5 rounded text-[10px]">
                    <span className="font-semibold text-slate-700 truncate">M3 · Final Demo</span>
                    <Check className="w-3 h-3 text-emerald-600 font-bold" />
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full w-full" />
                </div>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#10233F] leading-snug">
                  Milestones Completed
                </h3>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  Sequential progression through architecture docs, working physical prototype, and final video demo vetted by Super Admin.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-emerald-700 font-semibold">
              <span>3/3 Milestones Verified</span>
              <ArrowRight className="w-3 h-3 hidden lg:block" />
              <ArrowDown className="w-3 h-3 lg:hidden" />
            </div>
          </motion.div>
        </div>

        {/* ================= STEP 05 ================= */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white/95 backdrop-blur-md border border-[#2E8B57]/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative overflow-hidden group h-full"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-300">
                  STEP 05
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  DEPLOYMENT
                </span>
              </div>

              <div className="h-28 sm:h-32 rounded-xl bg-gradient-to-b from-emerald-50/70 to-white border border-emerald-200/80 p-2.5 relative flex flex-col items-center justify-center overflow-hidden shadow-2xs">
                <div className="w-20 h-18 bg-white border-2 border-[#D49A24] rounded-md shadow-xs p-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
                    <span className="text-[6px] font-mono font-bold text-slate-500">TAMIL NADU</span>
                    <QrCode className="w-2 h-2 text-slate-400" />
                  </div>
                  <div className="text-[7px] font-extrabold text-[#10233F] text-center">CERTIFICATE</div>
                  <div className="text-center">
                    <span className="text-[6px] font-extrabold text-emerald-700 bg-emerald-50 px-1 rounded border border-emerald-200">
                      APPROVED
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-1.5 right-1.5 bg-emerald-700 text-white rounded px-1.5 py-0.5 text-[8px] font-bold flex items-center gap-1 shadow-sm">
                  <Radio className="w-2.5 h-2.5 text-emerald-200 animate-pulse" />
                  <span>Field Ready</span>
                </div>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#10233F] leading-snug">
                  Solution Certified & Deployed
                </h3>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  Cryptographically signed digital certificates generated for colleges and students, followed by municipal field deployment.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-emerald-700 font-semibold">
              <span>District Certified & Deployed</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </motion.div>
        </div>

      </div>

    </div>
  );
};

export default ProcessLifecycleVisual;
