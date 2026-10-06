import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { FileText, Building2, Users } from 'lucide-react';

interface CounterProps {
  value: number;
  duration?: number;
}

// Framer-motion driven counter animating smoothly when entering viewport
const FramerMotionCounter: React.FC<CounterProps> = ({ value, duration = 1.4 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(0);
      const controls = animate(motionValue, value, {
        duration,
        ease: [0.16, 1, 0.3, 1] // easeOutExpo for natural spring-like deceleration
      });
      return () => controls.stop();
    }
  }, [isInView, value, motionValue, duration]);

  useEffect(() => {
    return rounded.on('change', (latest) => {
      setDisplayValue(latest);
    });
  }, [rounded]);

  return <span ref={ref}>{displayValue}</span>;
};

interface DistrictInnovationMetricsProps {
  totalProblemStatements: number;
  activeInstitutions: number;
  registeredMentors: number;
}

export const DistrictInnovationMetrics: React.FC<DistrictInnovationMetricsProps> = ({
  totalProblemStatements,
  activeInstitutions,
  registeredMentors
}) => {
  return (
    <section className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-lg font-bold text-slate-900">
          District Innovation Live Metrics
        </h2>
        <p className="text-xs text-slate-500">
          Synchronized across all accredited institutions and district departments
        </p>
      </div>

      {/* 3 Animated Live Counters (Total Problem Statements, Active Institutions, Registered Mentors) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        
        {/* 1. Total Problem Statements */}
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          whileHover={{ y: -5, scale: 1.01 }}
          className="bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Total Problem Statements
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-sky-600" />
            </div>
          </div>
          <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight">
            <FramerMotionCounter value={totalProblemStatements} />
          </div>
          <div className="text-xs text-slate-500 mt-3 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            <span>Verified district civic & municipal challenges</span>
          </div>
        </motion.div>

        {/* 2. Active Institutions */}
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
          whileHover={{ y: -5, scale: 1.01 }}
          className="bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Active Institutions
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight">
            <FramerMotionCounter value={activeInstitutions} />
          </div>
          <div className="text-xs text-slate-500 mt-3 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>NAAC accredited collegiate engineering teams</span>
          </div>
        </motion.div>

        {/* 3. Registered Mentors */}
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.5, delay: 0.16, ease: 'easeOut' }}
          whileHover={{ y: -5, scale: 1.01 }}
          className="bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Registered Mentors
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight">
            <FramerMotionCounter value={registeredMentors} />
          </div>
          <div className="text-xs text-slate-500 mt-3 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            <span>Industry domain architects & technical advisors</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default DistrictInnovationMetrics;
