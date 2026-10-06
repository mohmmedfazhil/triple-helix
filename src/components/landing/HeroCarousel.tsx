import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  Landmark,
  Briefcase,
  GraduationCap,
  ArrowRight,
  Quote
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HeroSlide, UserRole } from '../../types';

interface HeroCarouselProps {
  onOpenLogin?: (role?: UserRole) => void;
  onOpenRegisterInstitution?: () => void;
  onOpenRegisterMentor?: () => void;
}

const TRIPARTITE_PILLARS = [
  {
    role: 'Government (Collectorate)',
    icon: Landmark,
    accent: 'text-sky-400',
    border: 'border-sky-500/40 bg-sky-950/40',
    description: 'Vetted public administration challenges uploaded directly by district departments for hands-on student solving.'
  },
  {
    role: 'Academia (College Students)',
    icon: GraduationCap,
    accent: 'text-amber-400',
    border: 'border-amber-500/40 bg-amber-950/40',
    description: 'Student engineering teams from Tamil Nadu colleges build working IoT, AI, and embedded prototypes.'
  },
  {
    role: 'Industry (Chief Mentors)',
    icon: Briefcase,
    accent: 'text-emerald-400',
    border: 'border-emerald-500/40 bg-emerald-950/40',
    description: 'Corporate technology leaders provide 1:1 architectural reviews and industry validation.'
  }
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  onOpenLogin,
  onOpenRegisterInstitution,
  onOpenRegisterMentor
}) => {
  const { heroSlides, setActivePage } = useApp();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activePillarIndex, setActivePillarIndex] = useState(0);

  const activeSlides: HeroSlide[] = heroSlides.filter(s => s.active);

  // Auto-cycle the carousel slides
  useEffect(() => {
    if (!isPlaying || activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % activeSlides.length);
    }, 8500);
    return () => clearInterval(timer);
  }, [isPlaying, activeSlides.length]);

  // Auto-cycle the dynamic tripartite pillar spotlight
  useEffect(() => {
    const pillarTimer = setInterval(() => {
      setActivePillarIndex(prev => (prev + 1) % TRIPARTITE_PILLARS.length);
    }, 4200);
    return () => clearInterval(pillarTimer);
  }, []);

  const slide: HeroSlide = activeSlides[currentSlideIndex] || {
    id: 'slide-01',
    badge: 'TAMIL NADU HIGHER EDUCATION & CIVIC INNOVATION',
    headlineMain: 'Engineering Youth Solving',
    headlineHighlight: 'Real-World Tamil Nadu Challenges',
    description: 'Empowering collegiate engineering talent across Tamil Nadu to apply indigenous AI, IoT, robotics, and embedded systems toward modernizing public administration and community infrastructure.',
    primaryCtaText: 'Register Your Institution →',
    primaryCtaAction: 'register-institution',
    secondaryCtaText: 'Explore Problem Statements',
    secondaryCtaAction: 'browse',
    theme: 'sky',
    category: 'District Governance',
    active: true,
    departmentTag: 'Special Programme Implementation Department · Govt of Tamil Nadu',
    imageUrl: '/src/assets/images/crescent_students_lab_1790734118032.jpg',
    imageAlt: 'B.S. Abdur Rahman Crescent Institute engineering students collaborating in an innovation laboratory',
    imageCaption: 'B.S. Abdur Rahman Crescent Institute of Science & Technology · Innovation Labs'
  };

  const nextSlide = () => {
    setCurrentSlideIndex(prev => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex(prev => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleCta = (action: string) => {
    switch (action) {
      case 'browse':
        setActivePage('problem-statements');
        break;
      case 'login':
        onOpenLogin ? onOpenLogin('institution') : setActivePage('login');
        break;
      case 'register-institution':
        onOpenRegisterInstitution ? onOpenRegisterInstitution() : setActivePage('register-institution');
        break;
      case 'register-mentor':
        onOpenRegisterMentor ? onOpenRegisterMentor() : setActivePage('register-mentor');
        break;
      case 'about':
        setActivePage('about');
        break;
      case 'contact':
        setActivePage('contact');
        break;
      default:
        setActivePage('problem-statements');
        break;
    }
  };

  const activePillar = TRIPARTITE_PILLARS[activePillarIndex];
  const PillarIcon = activePillar.icon;

  return (
    <div 
      className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-blue-900/60 bg-[#071733] shadow-2xl transition-all"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Background Deep Royal Navy Blue Gradient & Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#051124] via-[#0b2249] to-[#071733]">
        {/* Engineering Blueprint Grid */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(147, 197, 253, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(147, 197, 253, 0.12) 1px, transparent 1px)`,
            backgroundSize: '36px 36px'
          }}
        />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-blue-600/20" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-indigo-600/20" />
      </div>

      {/* Slide Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-3.5 xs:px-5 sm:px-8 lg:px-10 py-5 sm:py-9 flex flex-col justify-between">
        
        {/* Main Content Layout: Left Headline & CTA + Right Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center my-auto">
          
          {/* Left Column (7 cols): High-Impact Typography & Action Buttons */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-5 text-left">
            
            {/* Category / Institutional Badge */}
            <motion.div
              key={`badge-${slide.id}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-1.5 xs:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-bold tracking-wide border border-amber-400/40 bg-[#0e2142]/80 text-amber-300 shadow-sm backdrop-blur-md"
            >
              <Landmark className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="uppercase text-[9px] xs:text-[10px] sm:text-xs truncate">
                {slide.badge || 'TAMIL NADU CIVIC INNOVATION'}
              </span>
            </motion.div>

            {/* Headline with golden-yellow highlight */}
            <motion.h1
              key={`title-${slide.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="text-xl xs:text-2xl sm:text-4xl xl:text-[42px] font-extrabold text-white tracking-tight leading-[1.2]"
            >
              <span>{slide.headlineMain}{' '}</span>
              <span className="text-[#f5b82e] block sm:inline">
                {slide.headlineHighlight}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              key={`desc-${slide.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-xs sm:text-sm md:text-base text-slate-200/90 leading-relaxed max-w-2xl font-normal"
            >
              {slide.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              key={`cta-${slide.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3.5 pt-1"
            >
              {/* Primary Glowing Orange-Amber Button */}
              <button
                onClick={() => handleCta(slide.primaryCtaAction)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 shadow-lg shadow-orange-950/50 hover:shadow-orange-600/30 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer ring-1 ring-orange-400/40 min-h-[42px]"
              >
                <span>{slide.primaryCtaText || 'Register Your Institution →'}</span>
              </button>

              {/* Secondary Navy Glass Action */}
              <button
                onClick={() => handleCta(slide.secondaryCtaAction || 'about')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold bg-[#112952]/90 hover:bg-[#173870] text-white border border-blue-400/30 hover:border-blue-300/50 transition-all cursor-pointer shadow-xs min-h-[42px]"
              >
                <span>{slide.secondaryCtaText || 'Explore Problem Statements'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-300 shrink-0" />
              </button>
            </motion.div>

          </div>

          {/* Right Column (5 cols): Visual Showcase Card with Clean Unique Images & Inspiring Quote */}
          <div className="lg:col-span-5 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#0b1c38]/95 backdrop-blur-md border border-blue-500/25 rounded-2xl p-3.5 sm:p-5 shadow-2xl space-y-3 sm:space-y-4"
            >
              {/* Showcase Image */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-blue-400/25 bg-slate-900 group">
                <img
                  src={slide.imageUrl || '/src/assets/images/crescent_students_lab_1790734118032.jpg'}
                  alt={slide.imageAlt || 'Civic innovation showcase'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Subtle gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Dynamic Rotating Tripartite Role Spotlight */}
              <div className="bg-[#0e2347] border border-blue-400/20 rounded-xl p-3 sm:p-3.5 text-left space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-blue-200">
                    Collaborative Roles
                  </span>
                  <div className="flex items-center gap-1">
                    {TRIPARTITE_PILLARS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActivePillarIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          i === activePillarIndex ? 'bg-amber-400 w-4' : 'bg-slate-600 hover:bg-slate-400'
                        }`}
                        aria-label={`View pillar ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePillarIndex}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-start gap-2.5 pt-0.5"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${activePillar.border}`}>
                      <PillarIcon className={`w-4 h-4 ${activePillar.accent}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{activePillar.role}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-tight mt-0.5">
                        {activePillar.description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Inspiring Quote Section (Replaces 38 Districts & 3 Milestones) */}
              <div className="relative bg-[#071733]/90 border border-blue-400/20 rounded-xl p-3 sm:p-3.5 text-left flex items-start gap-2.5 sm:gap-3">
                <Quote className="w-5 h-5 text-amber-400/80 shrink-0 mt-0.5 rotate-180" />
                <div className="space-y-1">
                  <p className="text-[11px] sm:text-xs text-slate-200 italic leading-relaxed font-normal">
                    "Where government vision, industry expertise, and student ingenuity converge to solve real-world challenges for Tamil Nadu."
                  </p>
                  <div className="text-[10px] font-semibold text-amber-300/90 font-mono tracking-wide">
                    — Triple Helix Collaborative Vision
                  </div>
                </div>
              </div>

            </motion.div>
          </div>

        </div>

        {/* Carousel Bottom Controls & Slide Navigation Dots */}
        <div className="pt-3 sm:pt-5 mt-3 sm:mt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
          
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
            {activeSlides.map((s, index) => {
              const isSelected = index === currentSlideIndex;
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlideIndex(index)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 min-h-[36px] ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-blue-300'}`} />
                  <span>{s.category || `Slide ${index + 1}`}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              aria-label="Toggle autoplay"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={prevSlide}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Previous theme"
              aria-label="Previous theme"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Next theme"
              aria-label="Next theme"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default HeroCarousel;
