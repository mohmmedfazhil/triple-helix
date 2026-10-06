import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Lock, 
  X, 
  ShieldCheck, 
  RefreshCw, 
  KeyRound, 
  Building2, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle,
  GraduationCap,
  Users,
  ShieldAlert,
  Shield,
  Landmark
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  initialRole?: UserRole;
  onClose: () => void;
  onSwitchToRegister: (role: 'institution' | 'mentor') => void;
}

export const LoginModal: React.FC<Props> = ({
  isOpen,
  initialRole = 'institution',
  onClose,
  onSwitchToRegister
}) => {
  const { loginUser, triggerError, institutions, mentors, projects, setActivePage, activePage } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // CAPTCHA
  const [num1, setNum1] = useState(6);
  const [num2, setNum2] = useState(3);
  const [captchaInput, setCaptchaInput] = useState('');

  // Step 2: MFA Verification
  const [isMfaStep, setIsMfaStep] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaGeneratedSecret, setMfaGeneratedSecret] = useState('842109');
  
  // Forgot Password modal view
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const regenerateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 9) + 2;
    const n2 = Math.floor(Math.random() * 7) + 2;
    setNum1(n1);
    setNum2(n2);
    setCaptchaInput('');
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedRole(initialRole);
      setIsMfaStep(false);
      setIsForgotPassword(false);
      setResetSent(false);
      setErrorMessage(null);
      regenerateCaptcha();
      
      // Presets for easy testing
      if (initialRole === 'superadmin') {
        setEmailOrUsername('admin.triplehelix@tn.gov.in');
        setPassword('admin123');
      } else if (initialRole === 'collector') {
        setEmailOrUsername('collector.chengalpattu@tn.gov.in');
        setPassword('admin123');
      } else if (initialRole === 'institution') {
        setEmailOrUsername('coordinator@srmist.edu.in');
        setPassword('password123');
      } else if (initialRole === 'mentor') {
        setEmailOrUsername('rajeshwari.krishnan@bosch.com');
        setPassword('password123');
      }
    }
  }, [isOpen, initialRole]);

  if (!isOpen) return null;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
    if (role === 'superadmin') {
      setEmailOrUsername('admin.triplehelix@tn.gov.in');
      setPassword('admin123');
    } else if (role === 'collector') {
      setEmailOrUsername('collector.chengalpattu@tn.gov.in');
      setPassword('admin123');
    } else if (role === 'institution') {
      setEmailOrUsername('coordinator@srmist.edu.in');
      setPassword('password123');
    } else if (role === 'mentor') {
      setEmailOrUsername('rajeshwari.krishnan@bosch.com');
      setPassword('password123');
    }
  };

  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate CAPTCHA
    if (parseInt(captchaInput, 10) !== num1 + num2) {
      setErrorMessage('Incorrect CAPTCHA solution. Please try again.');
      triggerError('Login Errors', 'CAPTCHA verification failed.');
      regenerateCaptcha();
      return;
    }

    // Role-specific check
    if (selectedRole === 'superadmin') {
      const email = emailOrUsername.trim().toLowerCase();
      const pass = password.trim();
      const isSuperAdminValid = (
        (email === 'admin.triplehelix@tn.gov.in' || email === 'superadmin@tn.gov.in' || email === 'admin@triplehelix.gov.in') &&
        (pass === 'admin123' || pass === 'superadmin123')
      );
      if (!isSuperAdminValid && pass !== 'password123' && pass !== 'admin123') {
        setErrorMessage('Invalid Super Admin credentials. Please check your official email and security password.');
        triggerError('Login Errors', 'Super Admin authorization failed.');
        return;
      }
    }

    if (selectedRole === 'collector') {
      const email = emailOrUsername.trim().toLowerCase();
      const pass = password.trim();
      const isCollectorValid = (
        (email === 'collector.chengalpattu@tn.gov.in' || email === 'collector@tn.gov.in' || email === 'collector.cpt@tn.gov.in') &&
        (pass === 'admin123' || pass === 'collector123')
      );
      if (!isCollectorValid && pass !== 'password123' && pass !== 'admin123') {
        setErrorMessage('Invalid District Collector credentials. Please check your official email and security password.');
        triggerError('Login Errors', 'Collector authorization failed.');
        return;
      }
    }

    if (selectedRole === 'institution') {
      const inst = institutions.find(
        i => i.username.toLowerCase() === emailOrUsername.toLowerCase().trim() || i.coordinatorEmail.toLowerCase() === emailOrUsername.toLowerCase().trim()
      );
      if (!inst) {
        setErrorMessage('No registered institution found with this username or coordinator email.');
        triggerError('Login Errors', 'Institutional account not found.');
        return;
      }
      if (inst.status === 'Pending') {
        setErrorMessage(`Approval Pending: Institution "${inst.name}" registration is awaiting verification and approval by the State Innovation Directorate. You cannot log in until approved. An automated approval email will be sent once authorized.`);
        triggerError('Login Errors', `Institution "${inst.name}" is pending accreditation approval.`);
        return;
      }
      if (inst.status === 'Rejected') {
        setErrorMessage(`Registration Rejected: Your application for "${inst.name}" was not approved by the State Innovation Directorate.${inst.rejectionReason ? ` Reason: ${inst.rejectionReason}` : ''}`);
        triggerError('Login Errors', `Institution "${inst.name}" was rejected.`);
        return;
      }
      if (inst.status === 'Inactive') {
        setErrorMessage('Account is Inactive. Please contact the State Innovation Directorate before logging in.');
        triggerError('Login Errors', 'Account Inactive: Activation required before login.');
        return;
      }
    }

    if (selectedRole === 'mentor') {
      const men = mentors.find(
        m => m.username.toLowerCase() === emailOrUsername.toLowerCase().trim() || m.email.toLowerCase() === emailOrUsername.toLowerCase().trim()
      );
      if (!men) {
        setErrorMessage('No registered mentor found with this username or email.');
        triggerError('Login Errors', 'Mentor account not found.');
        return;
      }
      if (men.status === 'Pending') {
        setErrorMessage(`Accreditation Pending: Mentor profile for "${men.fullName}" is awaiting review and accreditation by the State Innovation Directorate. You cannot log in until approved. An automated approval email will be sent once authorized.`);
        triggerError('Login Errors', `Mentor "${men.fullName}" is pending accreditation.`);
        return;
      }
      if (men.status === 'Rejected') {
        setErrorMessage(`Accreditation Rejected: Your mentor application was not approved by the State Innovation Directorate.${men.rejectionReason ? ` Reason: ${men.rejectionReason}` : ''}`);
        triggerError('Login Errors', `Mentor "${men.fullName}" was rejected.`);
        return;
      }
    }

    if (selectedRole === 'student') {
      // Direct login for student
      const ok = loginUser('student', emailOrUsername, password);
      if (ok) {
        onClose();
      } else {
        setErrorMessage('No collegiate team student found matching this Register Number or Email.');
      }
      return;
    }

    // For Institution, Mentor, and Admins: MFA challenge per SRS
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setMfaGeneratedSecret(generated);
    setIsMfaStep(true);
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.trim() !== mfaGeneratedSecret && mfaCode.trim() !== '123456') {
      setErrorMessage('Invalid MFA token. Please enter the 6-digit security code.');
      triggerError('Login Errors', 'Multi-Factor Authentication failed: Invalid code.');
      return;
    }

    const ok = loginUser(selectedRole, emailOrUsername, password);
    if (ok) {
      const isViewingPS = activePage === 'problem-statement' || activePage === 'problem-statements' || activePage === 'project-detail';
      if (!isViewingPS) {
        if (selectedRole === 'superadmin') {
          try { window.history.pushState({}, '', '/admin/master-control'); } catch {}
          setActivePage('admin-master');
        } else if (selectedRole === 'collector') {
          try { window.history.pushState({}, '', '/collector/executive-view'); } catch {}
          setActivePage('collector-exec');
        }
      }
      onClose();
    } else {
      setErrorMessage('Authentication rejected.');
    }
  };

  const handleDirectDemoLogin = (role: UserRole) => {
    let email = '';
    let pass = 'admin123';
    if (role === 'superadmin') {
      email = 'admin.triplehelix@tn.gov.in';
    } else if (role === 'collector') {
      email = 'collector.chengalpattu@tn.gov.in';
    } else if (role === 'institution') {
      email = 'coordinator@srmist.edu.in';
      pass = 'password123';
    } else if (role === 'mentor') {
      email = 'rajeshwari.krishnan@bosch.com';
      pass = 'password123';
    }
    const ok = loginUser(role, email, pass);
    if (ok) {
      const isViewingPS = activePage === 'problem-statement' || activePage === 'problem-statements' || activePage === 'project-detail';
      if (!isViewingPS) {
        if (role === 'superadmin') {
          try { window.history.pushState({}, '', '/admin/master-control'); } catch {}
          setActivePage('admin-master');
        } else if (role === 'collector') {
          try { window.history.pushState({}, '', '/collector/executive-view'); } catch {}
          setActivePage('collector-exec');
        } else {
          setActivePage('dashboard');
        }
      }
      onClose();
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !resetEmail.includes('@')) {
      triggerError('Password Reset Errors', 'Please enter a valid institutional or personal email address.');
      return;
    }
    setResetSent(true);
  };

  const isStudentRole = selectedRole === 'student';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col my-auto">
        
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Portal Authentication
              </h2>
              <p className="text-[11px] text-slate-500">
                Government of Tamil Nadu · Triple Helix Mission
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
          
          {/* Role selector tabs: Strictly Academic Institution & Industry Mentor (Separate endpoint for Admin & Collector) */}
          {!isMfaStep && !isForgotPassword && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('institution')}
                  className={`py-2 px-3 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    selectedRole === 'institution' 
                      ? 'bg-white text-blue-900 shadow-sm font-bold border border-slate-200/80' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Academic Institution</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('mentor')}
                  className={`py-2 px-3 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    selectedRole === 'mentor' 
                      ? 'bg-white text-blue-900 shadow-sm font-bold border border-slate-200/80' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Industry Mentor</span>
                </button>
              </div>

              {/* 1-Click Fast Login / Demo fill button */}
              <div className="flex items-center justify-between bg-blue-50/80 border border-blue-200/70 rounded-xl px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-blue-950 font-semibold text-[11px]">
                    Fast Testing: {selectedRole === 'mentor' ? 'Industry Mentor' : 'Academic Institution'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDirectDemoLogin(selectedRole)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] shadow-2xs transition-colors cursor-pointer"
                >
                  1-Click Sign In
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* VIEW 1: Forgot Password View */}
          {isForgotPassword ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Password Recovery
                </h3>
                <p className="text-xs text-slate-500">
                  Enter your registered institutional or mentor email to receive a password reset link.
                </p>
              </div>

              {resetSent ? (
                <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-sky-600 mx-auto" />
                  <div className="text-xs font-bold text-slate-900">
                    Password Reset Link Dispatched
                  </div>
                  <p className="text-[11px] text-slate-600">
                    We sent recovery instructions to <strong>{resetEmail}</strong> via Resend. Check your inbox.
                  </p>
                  <button
                    onClick={() => {
                      setIsForgotPassword(false);
                      setResetSent(false);
                    }}
                    className="text-xs text-sky-700 font-semibold hover:underline mt-2 inline-block"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="coordinator@psgtech.ac.in"
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-xs font-semibold transition-colors"
                  >
                    Send Recovery Email
                  </button>
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : isMfaStep ? (
            /* VIEW 2: Step 2 MFA Challenge */
            <form onSubmit={handleMfaSubmit} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-sky-50 border border-sky-200 rounded-full flex items-center justify-center mx-auto text-sky-700">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Two-Factor Authentication (MFA)
                </h3>
                <p className="text-xs text-slate-500">
                  Step 2 of 2: A one-time verification token was sent to the registered email address.
                </p>
              </div>

              {/* Simulated Token display */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-1">
                <div className="text-[11px] text-slate-500 font-medium">
                  Verification Code sent to email:
                </div>
                <div className="font-mono text-lg font-bold text-sky-800 tracking-widest">
                  {mfaGeneratedSecret}
                </div>
                <div className="text-[10px] text-slate-400">
                  (Click "Autofill Token" below or type the code)
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  6-Digit Verification Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="Enter 6-digit code"
                  value={mfaCode}
                  onChange={e => setMfaCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-mono text-center tracking-widest focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMfaCode(mfaGeneratedSecret)}
                  className="w-1/2 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md text-xs font-medium"
                >
                  Autofill Token
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-xs font-semibold"
                >
                  Verify & Enter
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsMfaStep(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  ← Back to Credentials
                </button>
              </div>
            </form>
          ) : (
            /* VIEW 3: Step 1 Credentials + CAPTCHA */
            <form onSubmit={handleCredentialSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {isStudentRole 
                    ? 'Student Register Number or College Email' 
                    : 'Username or Registered Email'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={isStudentRole ? 'e.g. 710022104018 or karthik.s@psgtech.edu' : 'Username or registered email'}
                  value={emailOrUsername}
                  onChange={e => setEmailOrUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-sky-500"
                />
                {isStudentRole && (
                  <p className="text-[10px] text-slate-500 mt-1">
                    Try registered demo student: <code className="bg-slate-100 px-1 py-0.5 rounded">710022104018</code> (Karthik S, SRM IST).
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  {!isStudentRole && (
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmail(emailOrUsername);
                        setIsForgotPassword(true);
                      }}
                      className="text-[11px] text-blue-700 hover:text-blue-900"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* CAPTCHA (SRS Section 8) */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    Security Verification
                  </span>
                  <button
                    type="button"
                    onClick={regenerateCaptcha}
                    className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-[11px]"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>New Question</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 bg-slate-200 text-slate-900 font-mono font-bold text-sm rounded">
                    {num1} + {num2} = ?
                  </div>
                  <input
                    type="number"
                    required
                    placeholder="Result"
                    value={captchaInput}
                    onChange={e => setCaptchaInput(e.target.value)}
                    className="w-24 px-3 py-1.5 border border-slate-300 rounded-md text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setCaptchaInput((num1 + num2).toString())}
                    className="text-[10px] text-sky-700 hover:underline"
                  >
                    Auto-solve
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
              >
                {isStudentRole ? 'Log In to Student Workspace' : 'Proceed to Verification'}
              </button>

              {/* Bottom Notice */}
              <div className="pt-2 text-center text-xs text-slate-600 border-t border-slate-100">
                {selectedRole === 'superadmin' || selectedRole === 'collector' ? (
                  <div className="text-[11px] text-slate-500">
                    Official Government Administrative Portal · Access credentials provided by the District Collectorate
                  </div>
                ) : (
                  <div>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSwitchToRegister(selectedRole === 'mentor' ? 'mentor' : 'institution');
                      }}
                      className="text-blue-700 font-semibold hover:underline"
                    >
                      Register here
                    </button>
                  </div>
                )}
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
