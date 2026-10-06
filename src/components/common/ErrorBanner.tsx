import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, 
  X, 
  ShieldAlert, 
  HelpCircle, 
  ArrowRight,
  RefreshCw 
} from 'lucide-react';

export const ErrorBanner: React.FC = () => {
  const { activeError, clearError } = useApp();

  if (!activeError) return null;

  const categoryGuidance: Record<string, string> = {
    'Login Errors': 'Check your username, password, or ensure that you have completed email verification.',
    'Registration Errors': 'Ensure all required fields are filled and that username/email are not already in use.',
    'File Upload Errors': 'Check that files conform to PDF, CAD, ZIP, or MP4 formats under 50 MB.',
    'Network Errors': 'The portal will automatically attempt to reconnect to the database.',
    'Password Reset Errors': 'Ensure the email matches an active account, or check your spam folder.',
    'Project Selection Errors': 'Remember that each problem statement can be selected by only one institution.',
    'Deadline Errors': 'Milestone deadlines must follow chronological progression.'
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full p-4 bg-white border border-rose-300 rounded-xl shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-rose-100 text-rose-700 shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>

        <div className="flex-1 space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-rose-900 uppercase tracking-wider text-[11px]">
              {activeError.category} (SRS Section 23)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {activeError.timestamp}
            </span>
          </div>

          <p className="text-slate-800 font-medium leading-relaxed">
            {activeError.message}
          </p>

          <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <strong>Guidance:</strong> {categoryGuidance[activeError.category] || 'Please review your action and try again.'}
          </p>
        </div>

        <button
          onClick={clearError}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
