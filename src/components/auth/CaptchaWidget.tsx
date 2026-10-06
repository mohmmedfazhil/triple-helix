import React, { useState, useEffect } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import { CaptchaChallenge, generateCaptcha } from '../../lib/authSecurity';

interface CaptchaWidgetProps {
  onValidate: (isValid: boolean) => void;
  value: string;
  onChange: (val: string) => void;
  challengeRef?: React.MutableRefObject<CaptchaChallenge | null>;
  className?: string;
}

export const CaptchaWidget: React.FC<CaptchaWidgetProps> = ({
  onValidate,
  value,
  onChange,
  challengeRef,
  className = ''
}) => {
  const [challenge, setChallenge] = useState<CaptchaChallenge>(() => generateCaptcha('math'));
  const [mode, setMode] = useState<'math' | 'text'>('math');

  const refreshCaptcha = () => {
    const nextMode = mode === 'math' ? 'math' : 'text';
    const nextChallenge = generateCaptcha(nextMode);
    setChallenge(nextChallenge);
    if (challengeRef) challengeRef.current = nextChallenge;
    onChange('');
    onValidate(false);
  };

  useEffect(() => {
    if (challengeRef) challengeRef.current = challenge;
  }, [challenge, challengeRef]);

  // Check validation on value change
  useEffect(() => {
    if (!value.trim()) {
      onValidate(false);
      return;
    }
    const cleanInput = value.trim().toUpperCase();
    const cleanAnswer = challenge.answer.toUpperCase();
    const valid = cleanInput === cleanAnswer;
    onValidate(valid);
  }, [value, challenge, onValidate]);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
          <span>Security Captcha</span>
        </label>
        <button
          type="button"
          onClick={() => {
            const newMode = mode === 'math' ? 'text' : 'math';
            setMode(newMode);
            const next = generateCaptcha(newMode);
            setChallenge(next);
            if (challengeRef) challengeRef.current = next;
            onChange('');
            onValidate(false);
          }}
          className="text-[11px] text-blue-700 hover:text-blue-900 underline font-medium cursor-pointer"
        >
          {mode === 'math' ? 'Switch to text code' : 'Switch to math puzzle'}
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Captcha Box */}
        <div 
          className="h-10 px-3.5 bg-slate-900 text-amber-300 rounded-xl font-mono text-sm font-black flex items-center justify-center tracking-widest select-none shadow-xs border border-slate-700 relative overflow-hidden shrink-0 min-w-[120px]"
          title="Security verification code"
        >
          {/* Subtle noise grid lines */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_50%,transparent_75%,transparent_100%)] bg-[length:12px_12px] pointer-events-none" />
          <span className="relative z-10 italic">
            {challenge.question}
          </span>
        </div>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={refreshCaptcha}
          className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-blue-900 shadow-2xs transition-all cursor-pointer shrink-0"
          title="Generate a new captcha"
          aria-label="Refresh Captcha"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* User Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={mode === 'math' ? 'Enter answer' : 'Enter 5 characters'}
          className="flex-1 h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all uppercase"
          maxLength={mode === 'math' ? 6 : 5}
          autoComplete="off"
        />
      </div>
    </div>
  );
};
export default CaptchaWidget;
