import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  ShieldCheck, 
  GraduationCap, 
  Briefcase,
  Landmark,
  Building2,
  Cpu,
  ArrowRight,
  ArrowLeftRight,
  Sparkles,
  Layers,
  CheckCircle2,
  Activity
} from 'lucide-react';

type PillarType = 'all' | 'government' | 'academia' | 'industry' | 'center';

export const TripleHelixEcosystemVisual: React.FC = () => {
  const [activePillar, setActivePillar] = useState<PillarType>('all');
  const [hoveredPillar, setHoveredPillar] = useState<PillarType | null>(null);

  const effectivePillar = hoveredPillar || activePillar;

  return (
    <div className="w-full select-none">
      {/* Interactive Controls Bar: Explore Pillar Connectivity */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 bg-white/80 backdrop-blur-xs border border-slate-200/90 rounded-2xl px-4 py-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-600 animate-pulse" />
          <span className="text-xs font-bold text-slate-800 tracking-wide">
            Tripartite Synergy Connectivity
          </span>
          <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
            · Click or hover any pillar to inspect live bilateral exchanges
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setActivePillar('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activePillar === 'all'
                ? 'bg-[#0c2340] text-amber-300 shadow-2xs ring-2 ring-sky-300/40'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
            }`}
          >
            ✦ All Connected
          </button>
          <button
            type="button"
            onClick={() => setActivePillar('government')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activePillar === 'government'
                ? 'bg-[#1769AA] text-white shadow-2xs ring-2 ring-sky-400/50'
                : 'bg-sky-50 hover:bg-sky-100 text-sky-800'
            }`}
          >
            🏛 Government
          </button>
          <button
            type="button"
            onClick={() => setActivePillar('academia')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activePillar === 'academia'
                ? 'bg-[#2E8B57] text-white shadow-2xs ring-2 ring-emerald-400/50'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
            }`}
          >
            🎓 Academia
          </button>
          <button
            type="button"
            onClick={() => setActivePillar('industry')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activePillar === 'industry'
                ? 'bg-[#D49A24] text-white shadow-2xs ring-2 ring-amber-400/50'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900'
            }`}
          >
            💼 Industry
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MOBILE & TABLET RESPONSIVE VIEW (< lg screens)                         */}
      {/* ========================================================================= */}
      <div className="block lg:hidden bg-[#F7FAFC] border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-md relative overflow-hidden">
        
        {/* Subtle Matrix Grid */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(16, 35, 63, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(16, 35, 63, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '28px 28px'
          }}
        />

        {/* The 3 Entities in Clean Connected Responsive Flow */}
        <div className="relative z-10 space-y-3.5">
          
          {/* Pillar 1: Government */}
          <div 
            onClick={() => setActivePillar(activePillar === 'government' ? 'all' : 'government')}
            className={`bg-[#EAF4FC]/95 border rounded-2xl p-4 shadow-xs space-y-2.5 transition-all cursor-pointer ${
              effectivePillar === 'government' || effectivePillar === 'all'
                ? 'border-[#1769AA]/50 ring-2 ring-[#1769AA]/20'
                : 'border-slate-200/80 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-extrabold text-[#1769AA] uppercase bg-white/90 px-2.5 py-0.5 rounded-full border border-[#1769AA]/20">
                PILLAR 01 · GOVERNMENT
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#00C2FF] ring-2 ring-[#1769AA]/20 animate-pulse" />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#1769AA]/30 flex items-center justify-center text-[#1769AA] shrink-0 shadow-2xs">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#10233F]">District Collectorate</h4>
                <p className="text-[11px] text-slate-600">Civic administration & sanctioned municipal testbeds</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] text-[#10233F] font-semibold">
              <div className="bg-white/80 border border-[#1769AA]/20 rounded-lg p-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1769AA] shrink-0" />
                <span>Policies & Support</span>
              </div>
              <div className="bg-white/80 border border-[#1769AA]/20 rounded-lg p-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#1769AA] shrink-0" />
                <span>Problem Statements</span>
              </div>
            </div>
          </div>

          {/* Tripartite Connectivity Link 1: Government <---> Academia */}
          <div className="flex items-center justify-center -my-1 py-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/95 rounded-full border border-sky-300 shadow-2xs text-[10px] font-bold text-sky-900">
              <span className="w-2 h-2 rounded-full bg-[#00C2FF] animate-ping" />
              <span>Government ⇄ Academic Alignment (Mandates & Lab Resources)</span>
            </div>
          </div>

          {/* Pillar 2: Academia */}
          <div 
            onClick={() => setActivePillar(activePillar === 'academia' ? 'all' : 'academia')}
            className={`bg-[#EAF6EF]/95 border rounded-2xl p-4 shadow-xs space-y-2.5 transition-all cursor-pointer ${
              effectivePillar === 'academia' || effectivePillar === 'all'
                ? 'border-[#2E8B57]/50 ring-2 ring-[#2E8B57]/20'
                : 'border-slate-200/80 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-extrabold text-[#2E8B57] uppercase bg-white/90 px-2.5 py-0.5 rounded-full border border-[#2E8B57]/20">
                PILLAR 02 · ACADEMIA
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E676] ring-2 ring-[#2E8B57]/20 animate-pulse" />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#2E8B57]/30 flex items-center justify-center text-[#2E8B57] shrink-0 shadow-2xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#10233F]">Collegiate Engineering</h4>
                <p className="text-[11px] text-slate-600">Student teams & hardware prototyping laboratories</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] text-[#10233F] font-semibold">
              <div className="bg-white/80 border border-[#2E8B57]/20 rounded-lg p-1.5 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#2E8B57] shrink-0" />
                <span>5-Student Rosters</span>
              </div>
              <div className="bg-white/80 border border-[#2E8B57]/20 rounded-lg p-1.5 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#2E8B57] shrink-0" />
                <span>Working Solutions</span>
              </div>
            </div>
          </div>

          {/* Tripartite Connectivity Link 2: Academia <---> Industry */}
          <div className="flex items-center justify-center -my-1 py-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/95 rounded-full border border-amber-300 shadow-2xs text-[10px] font-bold text-amber-950">
              <span className="w-2 h-2 rounded-full bg-[#FFD600] animate-ping" />
              <span>Academic ⇄ Industry Mentorship (Field Code Reviews & Audits)</span>
            </div>
          </div>

          {/* Pillar 3: Industry */}
          <div 
            onClick={() => setActivePillar(activePillar === 'industry' ? 'all' : 'industry')}
            className={`bg-[#FFF5DD]/95 border rounded-2xl p-4 shadow-xs space-y-2.5 transition-all cursor-pointer ${
              effectivePillar === 'industry' || effectivePillar === 'all'
                ? 'border-[#D49A24]/50 ring-2 ring-[#D49A24]/20'
                : 'border-slate-200/80 opacity-75'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-extrabold text-[#D49A24] uppercase bg-white/90 px-2.5 py-0.5 rounded-full border border-[#D49A24]/20">
                PILLAR 03 · INDUSTRY
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD600] ring-2 ring-[#D49A24]/20 animate-pulse" />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#D49A24]/30 flex items-center justify-center text-[#D49A24] shrink-0 shadow-2xs">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#10233F]">Industry Mentors</h4>
                <p className="text-[11px] text-slate-600">Technical guidance & corporate quality standards</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] text-[#10233F] font-semibold">
              <div className="bg-white/80 border border-[#D49A24]/20 rounded-lg p-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D49A24] shrink-0" />
                <span>Architecture Audits</span>
              </div>
              <div className="bg-white/80 border border-[#D49A24]/20 rounded-lg p-1.5 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#D49A24] shrink-0" />
                <span>Field Deployment</span>
              </div>
            </div>
          </div>

          {/* Tripartite Connectivity Link 3: Industry <---> Government Loop */}
          <div className="flex items-center justify-center -my-1 py-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/95 rounded-full border border-emerald-300 shadow-2xs text-[10px] font-bold text-emerald-950">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-ping" />
              <span>Industry ⇄ Government Loop (Direct Problem Ingestion & Validation)</span>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP INTERACTIVE 16:9 VIEW (>= lg screens)                          */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex relative w-full aspect-[16/9] min-h-[560px] max-h-[720px] rounded-3xl overflow-hidden bg-[#F7FAFC] border border-slate-200/90 shadow-lg items-center justify-center p-6 xl:p-8">
        
        {/* Subtle Matrix Grid */}
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

        {/* Soft Ambient Vignettes with Luminous Neon Accents */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-50"
          style={{ background: 'radial-gradient(circle, rgba(0, 195, 255, 0.20) 0%, rgba(23, 105, 170, 0.08) 50%, transparent 75%)' }}
        />
        <div 
          className="absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-50"
          style={{ background: 'radial-gradient(circle, rgba(0, 230, 118, 0.18) 0%, rgba(46, 139, 87, 0.08) 50%, transparent 75%)' }}
        />
        <div 
          className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-50"
          style={{ background: 'radial-gradient(circle, rgba(255, 214, 0, 0.22) 0%, rgba(212, 154, 36, 0.08) 50%, transparent 75%)' }}
        />

        {/* SVG Layer for Flowing Connector Lines & Radiant Triple Helix Geometry */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 1200 675" 
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="govToAcadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00C2FF" />
              <stop offset="50%" stopColor="#1E88E5" />
              <stop offset="100%" stopColor="#00E676" />
            </linearGradient>

            <linearGradient id="govToIndGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00C2FF" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#FFD600" />
            </linearGradient>

            <linearGradient id="acadToIndGrad" x1="0%" y1="100%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E676" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#FFD600" />
            </linearGradient>

            <linearGradient id="govToCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00C2FF" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>

            <linearGradient id="acadToCoreGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00E676" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>

            <linearGradient id="indToCoreGrad" x1="100%" y1="50%" x2="0%" y2="50%">
              <stop offset="0%" stopColor="#FFD600" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>

            <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="strongGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ============================================================= */}
          {/* 1. DIRECT CONNECTING PATHWAYS BETWEEN PILLARS                 */}
          {/* ============================================================= */}

          {/* Pathway 1: Pillar 1 (Government) <---> Pillar 2 (Academia) Direct Vertical Line */}
          <g opacity={effectivePillar === 'all' || effectivePillar === 'government' || effectivePillar === 'academia' ? 1 : 0.25}>
            <path
              d="M 235 275 L 235 395"
              fill="none"
              stroke="url(#govToAcadGrad)"
              strokeWidth={effectivePillar === 'government' || effectivePillar === 'academia' ? '4.5' : '3'}
              strokeDasharray="6 4"
              filter="url(#subtleGlow)"
            />
            {/* Animated Pulses */}
            <circle r="4" fill="#FFFFFF" filter="url(#subtleGlow)">
              <animateMotion dur="2.2s" repeatCount="indefinite" path="M 235 275 L 235 395" />
            </circle>
            <circle r="4" fill="#FFFFFF" filter="url(#subtleGlow)">
              <animateMotion dur="2.2s" repeatCount="indefinite" path="M 235 395 L 235 275" />
            </circle>
          </g>

          {/* Pathway 2: Pillar 1 (Government) <---> Pillar 3 (Industry) Top Arch */}
          <g opacity={effectivePillar === 'all' || effectivePillar === 'government' || effectivePillar === 'industry' ? 1 : 0.25}>
            <path
              d="M 370 145 C 540 35, 740 60, 870 240"
              fill="none"
              stroke="url(#govToIndGrad)"
              strokeWidth={effectivePillar === 'government' || effectivePillar === 'industry' ? '4.5' : '3'}
              strokeDasharray="8 6"
              filter="url(#subtleGlow)"
            />
            {/* Animated Pulses */}
            <circle r="4.5" fill="#FFFFFF" filter="url(#subtleGlow)">
              <animateMotion dur="3.2s" repeatCount="indefinite" path="M 370 145 C 540 35, 740 60, 870 240" />
            </circle>
            <circle r="4.5" fill="#FFFFFF" filter="url(#subtleGlow)">
              <animateMotion dur="3.2s" repeatCount="indefinite" path="M 870 240 C 740 60, 540 35, 370 145" />
            </circle>
          </g>

          {/* Pathway 3: Pillar 2 (Academia) <---> Pillar 3 (Industry) Bottom Arch */}
          <g opacity={effectivePillar === 'all' || effectivePillar === 'academia' || effectivePillar === 'industry' ? 1 : 0.25}>
            <path
              d="M 370 535 C 540 645, 740 620, 870 435"
              fill="none"
              stroke="url(#acadToIndGrad)"
              strokeWidth={effectivePillar === 'academia' || effectivePillar === 'industry' ? '4.5' : '3'}
              strokeDasharray="8 6"
              filter="url(#subtleGlow)"
            />
            {/* Animated Pulses */}
            <circle r="4.5" fill="#FFFFFF" filter="url(#subtleGlow)">
              <animateMotion dur="3.2s" repeatCount="indefinite" path="M 370 535 C 540 645, 740 620, 870 435" />
            </circle>
            <circle r="4.5" fill="#FFFFFF" filter="url(#subtleGlow)">
              <animateMotion dur="3.2s" repeatCount="indefinite" path="M 870 435 C 740 620, 540 645, 370 535" />
            </circle>
          </g>

          {/* ============================================================= */}
          {/* 2. CORE CONVERGENCE PATHWAYS (All Pillars -> Center Hub)      */}
          {/* ============================================================= */}

          {/* Government -> Center Core */}
          <g opacity={effectivePillar === 'all' || effectivePillar === 'government' || effectivePillar === 'center' ? 1 : 0.25}>
            <path
              d="M 370 195 C 460 195, 490 280, 520 315"
              fill="none"
              stroke="url(#govToCoreGrad)"
              strokeWidth="3.5"
              filter="url(#strongGlow)"
            />
            <circle r="4" fill="#00C2FF" filter="url(#subtleGlow)">
              <animateMotion dur="2s" repeatCount="indefinite" path="M 370 195 C 460 195, 490 280, 520 315" />
            </circle>
          </g>

          {/* Academia -> Center Core */}
          <g opacity={effectivePillar === 'all' || effectivePillar === 'academia' || effectivePillar === 'center' ? 1 : 0.25}>
            <path
              d="M 370 480 C 460 480, 490 395, 520 360"
              fill="none"
              stroke="url(#acadToCoreGrad)"
              strokeWidth="3.5"
              filter="url(#strongGlow)"
            />
            <circle r="4" fill="#00E676" filter="url(#subtleGlow)">
              <animateMotion dur="2s" repeatCount="indefinite" path="M 370 480 C 460 480, 490 395, 520 360" />
            </circle>
          </g>

          {/* Industry -> Center Core */}
          <g opacity={effectivePillar === 'all' || effectivePillar === 'industry' || effectivePillar === 'center' ? 1 : 0.25}>
            <path
              d="M 850 337 L 680 337"
              fill="none"
              stroke="url(#indToCoreGrad)"
              strokeWidth="3.5"
              filter="url(#strongGlow)"
            />
            <circle r="4" fill="#FFD600" filter="url(#subtleGlow)">
              <animateMotion dur="1.8s" repeatCount="indefinite" path="M 850 337 L 680 337" />
            </circle>
          </g>

          {/* Connection Anchor Nodes with Radiant Rings */}
          <g>
            <circle cx="370" cy="195" r="6" fill="#00C2FF" />
            <circle cx="370" cy="195" r="10" fill="none" stroke="#00C2FF" strokeWidth="1.5" opacity="0.6">
              <animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite" />
            </circle>

            <circle cx="370" cy="480" r="6" fill="#00E676" />
            <circle cx="370" cy="480" r="10" fill="none" stroke="#00E676" strokeWidth="1.5" opacity="0.6">
              <animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite" />
            </circle>

            <circle cx="850" cy="337" r="6" fill="#FFD600" />
            <circle cx="850" cy="337" r="10" fill="none" stroke="#FFD600" strokeWidth="1.5" opacity="0.6">
              <animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite" />
            </circle>

            <circle cx="235" cy="275" r="5" fill="#00C2FF" />
            <circle cx="235" cy="395" r="5" fill="#00E676" />
          </g>

          {/* Central Radiant Triple Helix Synthesis Core */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            transform="translate(600, 337)"
            style={{ transformOrigin: '600px 337px' }}
          >
            <circle cx="0" cy="0" r="125" fill="none" stroke="#3B82F6" strokeWidth="1" strokeDasharray="4 8" opacity="0.3" />
            <circle cx="0" cy="0" r="105" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.5" />
            <circle cx="0" cy="0" r="85" fill="none" stroke="#00C2FF" strokeWidth="1.5" opacity="0.4" />
          </motion.g>

          <g transform="translate(600, 337)">
            <circle cx="0" cy="0" r="70" fill="#10233F" stroke="#2563EB" strokeWidth="3" opacity="0.95" filter="url(#strongGlow)" />
            <circle cx="0" cy="0" r="62" fill="#0A182F" />
            <circle cx="0" cy="0" r="24" fill="#FFFFFF" opacity="0.9" />
            <circle cx="0" cy="0" r="17" fill="#10233F" />
            <circle cx="0" cy="0" r="8" fill="#F5B82E" />
          </g>
        </svg>

        {/* Central Core Label Overlay */}
        <div 
          onClick={() => setActivePillar(activePillar === 'center' ? 'all' : 'center')}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer pointer-events-auto flex flex-col items-center justify-center text-center w-36 h-36 rounded-full group"
          title="Central Tripartite Synergy Synthesis Core"
        >
          <div className="mt-20 px-2 py-0.5 rounded-full bg-slate-900/90 border border-sky-400/40 text-[9px] font-mono font-bold text-amber-300 tracking-wider shadow-sm group-hover:scale-105 transition-transform">
            SYNTHESIS CORE
          </div>
        </div>

        {/* Interactive Content Layer */}
        <div className="relative w-full h-full max-w-[1140px] max-h-[640px] flex items-center justify-between z-20 pointer-events-auto">

          {/* LEFT COLUMN: Government (Top) & Academia (Bottom) */}
          <div className="w-[34%] h-full flex flex-col justify-between py-2">
            
            {/* ENTITY 1: GOVERNMENT */}
            <motion.div
              onClick={() => setActivePillar(activePillar === 'government' ? 'all' : 'government')}
              onMouseEnter={() => setHoveredPillar('government')}
              onMouseLeave={() => setHoveredPillar(null)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`bg-[#EAF4FC]/95 backdrop-blur-md rounded-2xl p-4 xl:p-5 shadow-sm max-w-[340px] cursor-pointer transition-all ${
                effectivePillar === 'government' || effectivePillar === 'all'
                  ? 'border-2 border-[#1769AA] ring-4 ring-[#1769AA]/20 scale-102'
                  : 'border border-[#1769AA]/30 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold tracking-wider text-[#1769AA] uppercase font-mono">
                  1. GOVERNMENT / COLLECTORATE
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#00C2FF] ring-4 ring-[#1769AA]/20 shadow-[0_0_8px_#00C2FF]" />
              </div>
              <div className="flex items-center gap-3 bg-white/90 border border-[#1769AA]/20 rounded-xl p-2.5 shadow-2xs mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#EAF4FC] flex items-center justify-center text-[#1769AA] shrink-0">
                  <Landmark className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#10233F] truncate">District Collectorate</div>
                  <div className="text-[10px] text-slate-500 font-medium truncate">Civic Governance & Collector Gate</div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] text-[#10233F] font-semibold bg-white/85 px-2 py-1 rounded-md border border-[#1769AA]/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1769AA] shrink-0" />
                  <span>Policies & Institutional Support</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#10233F] font-semibold bg-white/85 px-2 py-1 rounded-md border border-[#1769AA]/20">
                  <FileText className="w-3.5 h-3.5 text-[#1769AA] shrink-0" />
                  <span>Verified Problem Statements</span>
                </div>
              </div>
            </motion.div>

            {/* ENTITY 2: ACADEMIA */}
            <motion.div
              onClick={() => setActivePillar(activePillar === 'academia' ? 'all' : 'academia')}
              onMouseEnter={() => setHoveredPillar('academia')}
              onMouseLeave={() => setHoveredPillar(null)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`bg-[#EAF6EF]/95 backdrop-blur-md rounded-2xl p-4 xl:p-5 shadow-sm max-w-[340px] cursor-pointer transition-all ${
                effectivePillar === 'academia' || effectivePillar === 'all'
                  ? 'border-2 border-[#2E8B57] ring-4 ring-[#2E8B57]/20 scale-102'
                  : 'border border-[#2E8B57]/30 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold tracking-wider text-[#2E8B57] uppercase font-mono">
                  2. ACADEMIA / INSTITUTIONS
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#00E676] ring-4 ring-[#2E8B57]/20 shadow-[0_0_8px_#00E676]" />
              </div>
              <div className="flex items-center gap-3 bg-white/90 border border-[#2E8B57]/20 rounded-xl p-2.5 shadow-2xs mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#EAF6EF] flex items-center justify-center text-[#2E8B57] shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#10233F] truncate">Engineering Colleges</div>
                  <div className="text-[10px] text-slate-500 font-medium truncate">Collegiate Student Rosters & Labs</div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] text-[#10233F] font-semibold bg-white/85 px-2 py-1 rounded-md border border-[#2E8B57]/20">
                  <GraduationCap className="w-3.5 h-3.5 text-[#2E8B57] shrink-0" />
                  <span>Student Engineering Teams</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#10233F] font-semibold bg-white/85 px-2 py-1 rounded-md border border-[#2E8B57]/20">
                  <Cpu className="w-3.5 h-3.5 text-[#2E8B57] shrink-0" />
                  <span>Working Technical Prototypes</span>
                </div>
              </div>
            </motion.div>

          </div>

          {/* CENTER: Interactive Bilateral Exchange Callout */}
          <div className="w-[30%] h-full flex flex-col justify-end items-center pb-2 pointer-events-auto">
            <AnimatePresence mode="wait">
              {effectivePillar === 'government' && (
                <motion.div
                  key="gov-synergy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-white/95 backdrop-blur-md border border-sky-300 rounded-2xl p-3 shadow-md text-center max-w-[280px]"
                >
                  <div className="text-[11px] font-bold text-sky-900 flex items-center justify-center gap-1.5 mb-1">
                    <Landmark className="w-3.5 h-3.5 text-sky-600" />
                    <span>Government Active Synergy</span>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-tight">
                    Channels district civic mandates to colleges while clearing testbed permissions for industry deployment.
                  </p>
                </motion.div>
              )}

              {effectivePillar === 'academia' && (
                <motion.div
                  key="acad-synergy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-white/95 backdrop-blur-md border border-emerald-300 rounded-2xl p-3 shadow-md text-center max-w-[280px]"
                >
                  <div className="text-[11px] font-bold text-emerald-900 flex items-center justify-center gap-1.5 mb-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Academia Active Synergy</span>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-tight">
                    Mobilizes collegiate engineering labs to build working prototypes under industry mentor co-supervision.
                  </p>
                </motion.div>
              )}

              {effectivePillar === 'industry' && (
                <motion.div
                  key="ind-synergy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-white/95 backdrop-blur-md border border-amber-300 rounded-2xl p-3 shadow-md text-center max-w-[280px]"
                >
                  <div className="text-[11px] font-bold text-amber-950 flex items-center justify-center gap-1.5 mb-1">
                    <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                    <span>Industry Active Synergy</span>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-tight">
                    Audits student codebase architecture, injects enterprise standards, and guides field validation.
                  </p>
                </motion.div>
              )}

              {(effectivePillar === 'all' || effectivePillar === 'center') && (
                <motion.div
                  key="all-synergy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-white/95 backdrop-blur-md border border-slate-300 rounded-2xl p-3 shadow-md text-center max-w-[280px]"
                >
                  <div className="text-[11px] font-bold text-slate-900 flex items-center justify-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Tripartite Dynamic Synthesis</span>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-tight">
                    Continuous feedback loop translating civic challenges into field-tested, certified public solutions.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN: Industry (Mentors) */}
          <div className="w-[34%] h-full flex flex-col justify-center py-2">
            <motion.div
              onClick={() => setActivePillar(activePillar === 'industry' ? 'all' : 'industry')}
              onMouseEnter={() => setHoveredPillar('industry')}
              onMouseLeave={() => setHoveredPillar(null)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className={`bg-[#FFF5DD]/95 backdrop-blur-md rounded-2xl p-4 xl:p-5 shadow-sm max-w-[340px] ml-auto cursor-pointer transition-all ${
                effectivePillar === 'industry' || effectivePillar === 'all'
                  ? 'border-2 border-[#D49A24] ring-4 ring-[#D49A24]/20 scale-102'
                  : 'border border-[#D49A24]/30 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold tracking-wider text-[#D49A24] uppercase font-mono">
                  3. INDUSTRY / MENTORS
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFD600] ring-4 ring-[#D49A24]/20 shadow-[0_0_8px_#FFD600]" />
              </div>
              <div className="flex items-center gap-3 bg-white/90 border border-[#D49A24]/20 rounded-xl p-2.5 shadow-2xs mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#FFF5DD] flex items-center justify-center text-[#D49A24] shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#10233F] truncate">Corporate Mentors</div>
                  <div className="text-[10px] text-slate-500 font-medium truncate">Domain Architects & Reviewers</div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] text-[#10233F] font-semibold bg-white/85 px-2 py-1 rounded-md border border-[#D49A24]/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D49A24] shrink-0" />
                  <span>Technical Design Audits</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#10233F] font-semibold bg-white/85 px-2 py-1 rounded-md border border-[#D49A24]/20">
                  <Cpu className="w-3.5 h-3.5 text-[#D49A24] shrink-0" />
                  <span>Field Verification & Validation</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TripleHelixEcosystemVisual;
