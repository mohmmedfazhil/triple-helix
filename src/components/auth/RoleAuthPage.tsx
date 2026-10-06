import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TamilNaduEmblem } from '../logos/TamilNaduEmblem';
import { TripleHelixLogo } from '../logos/TripleHelixLogo';
import { CaptchaWidget } from './CaptchaWidget';
import { CaptchaChallenge } from '../../lib/authSecurity';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound,
  Sparkles,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { 
  authenticateAccount, 
  registerRoleAccount, 
  resetAccountPassword, 
  checkPasswordStrength,
  validateEmail
} from '../../lib/authSecurity';

interface RoleAuthPageProps {
  initialRole: 'superadmin' | 'admin';
  initialTab?: 'signin' | 'register';
  onSuccess: (role: 'superadmin' | 'admin') => void;
  onBackToHome: () => void;
}

export const RoleAuthPage: React.FC<RoleAuthPageProps> = ({
  initialRole,
  initialTab = 'signin',
  onSuccess,
  onBackToHome
}) => {
  const { setCurrentUser, setActivePage, addAuditLog } = useApp();
  const [role, setRole] = useState<'superadmin' | 'admin'>(initialRole);
  const [tab, setTab] = useState<'signin' | 'register'>(initialTab);

  // Sign In Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginCaptcha, setLoginCaptcha] = useState('');
  const [loginCaptchaValid, setLoginCaptchaValid] = useState(false);
  const loginChallengeRef = useRef<CaptchaChallenge | null>(null);

  // Register Form State
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regShowConfirm, setRegShowConfirm] = useState(false);
  const [regCaptcha, setRegCaptcha] = useState('');
  const [regCaptchaValid, setRegCaptchaValid] = useState(false);
  const regChallengeRef = useRef<CaptchaChallenge | null>(null);

  // Forgot Password Modal Flow State
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'newpass' | 'done'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCaptcha, setForgotCaptcha] = useState('');
  const [forgotCaptchaValid, setForgotCaptchaValid] = useState(false);
  const forgotChallengeRef = useRef<CaptchaChallenge | null>(null);
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [userEnteredOtp, setUserEnteredOtp] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotConfirmPass, setForgotConfirmPass] = useState('');
  const [forgotShowPass, setForgotShowPass] = useState(false);

  // Messages & Loading
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Password strength calculations
  const regStrength = checkPasswordStrength(regPassword);
  const forgotStrength = checkPasswordStrength(forgotNewPass);

  // Reset messages when switching tabs or roles
  useEffect(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [tab, role]);

  // Handle Sign In submission
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginIdentifier.trim()) {
      setErrorMessage('Please enter your Username or registered Mail ID.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your account password.');
      return;
    }
    if (!loginCaptchaValid) {
      setErrorMessage('Security captcha validation failed. Please solve the captcha puzzle correctly.');
      setLoginCaptcha(''); // Reset captcha for re-attempt
      return;
    }

    setLoading(true);
    try {
      const res = await authenticateAccount(role, loginIdentifier, loginPassword);
      if (res.success && res.account) {
        setSuccessMessage(`Authentication confirmed. Welcome, ${res.account.username}!`);
        
        // Log in user session
        setCurrentUser({
          role,
          id: res.account.id,
          name: res.account.username,
          email: res.account.email
        });

        addAuditLog(
          'Login',
          'Logged Out',
          'Active Session',
          `Authorized ${role === 'superadmin' ? 'Super Admin' : 'Admin'} Login (${res.account.username})`,
          res.account.username
        );

        setTimeout(() => {
          onSuccess(role);
        }, 500);
      } else {
        setErrorMessage(res.message || 'Authentication failed. Please verify your credentials.');
        setLoginCaptcha(''); // force refresh captcha after failed attempt
      }
    } catch {
      setErrorMessage('A network error occurred while verifying credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Registration submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regUsername.trim() || regUsername.trim().length < 3) {
      setErrorMessage('Username must be at least 3 alphanumeric characters.');
      return;
    }
    if (!validateEmail(regEmail)) {
      setErrorMessage('Please provide a valid official email address (e.g. name@dept.tn.gov.in).');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('The passwords entered do not match. Please verify.');
      return;
    }
    if (!regCaptchaValid) {
      setErrorMessage('Security captcha validation failed. Please solve the captcha challenge.');
      setRegCaptcha('');
      return;
    }

    setLoading(true);
    try {
      const res = await registerRoleAccount(role, regUsername, regEmail, regPassword);
      if (res.success && res.account) {
        setSuccessMessage(`Account for ${res.account.username} successfully registered! Signing you in...`);
        
        setCurrentUser({
          role,
          id: res.account.id,
          name: res.account.username,
          email: res.account.email
        });

        addAuditLog(
          'Login',
          'Unregistered',
          'Active Account',
          `Registered New ${role === 'superadmin' ? 'Super Admin' : 'Admin'} Account (${res.account.username})`,
          res.account.username
        );

        setTimeout(() => {
          onSuccess(role);
        }, 600);
      } else {
        setErrorMessage(res.message || 'Registration failed. Please check your details.');
        setRegCaptcha('');
      }
    } catch {
      setErrorMessage('Failed to register account due to an unexpected error.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password flow
  const handleForgotSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateEmail(forgotEmail)) {
      setErrorMessage('Please enter a valid registered email address.');
      return;
    }
    if (!forgotCaptchaValid) {
      setErrorMessage('Please solve the captcha puzzle correctly.');
      setForgotCaptcha('');
      return;
    }

    // Generate simulated 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOtp(otp);
    setForgotStep('otp');
    setSuccessMessage(`One-Time Verification Code (OTP) dispatched to ${forgotEmail}. For demonstration: your OTP is ${otp}.`);
  };

  const handleForgotVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (userEnteredOtp.trim() !== simulatedOtp.trim()) {
      setErrorMessage('Invalid verification code. Please check and try again.');
      return;
    }
    setForgotStep('newpass');
    setSuccessMessage('Verification confirmed! You may now specify your new password.');
  };

  const handleForgotSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (forgotNewPass.length < 6) {
      setErrorMessage('New password must contain at least 6 characters.');
      return;
    }
    if (forgotNewPass !== forgotConfirmPass) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetAccountPassword(role, forgotEmail, forgotNewPass);
      if (res.success) {
        setForgotStep('done');
        setSuccessMessage(res.message);
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('An unexpected error occurred while updating password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-100/70 flex flex-col justify-between py-6 sm:py-12 px-3 sm:px-6">
      
      {/* Top Bar Header Navigation */}
      <div className="max-w-xl mx-auto w-full mb-6 flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-blue-900" />
          <span>Return to Portal</span>
        </button>

        <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-xl shadow-2xs">
          <button
            type="button"
            onClick={() => setRole('superadmin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              role === 'superadmin' 
                ? 'bg-[#0c2340] text-amber-300 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Super Admin
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              role === 'admin' 
                ? 'bg-[#0c2340] text-sky-300 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admin
          </button>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-xl mx-auto w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Card Header with Tamil Nadu Emblem */}
        <div className="bg-gradient-to-r from-[#0c2340] via-[#0e2c56] to-[#17457a] text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center space-y-2">
            <div className="flex items-center gap-3 bg-white/95 p-2 rounded-2xl shadow-sm border border-white/20">
              <TamilNaduEmblem size={38} className="w-9 h-9" />
              <div className="h-6 w-px bg-slate-300" />
              <TripleHelixLogo height={32} className="h-7 w-auto" />
            </div>

            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold block pt-1">
              Government of Tamil Nadu · District Innovation Mission
            </span>
            
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {role === 'superadmin' ? 'Super Admin Portal' : 'Admin Management Portal'}
            </h1>
            
            <p className="text-xs text-slate-200 max-w-md">
              {role === 'superadmin' 
                ? 'Authorized Executive Access · View-Only Statistical Analysis & Governance Terminal'
                : 'Authorized Administration Access · Full Problem Statements & Approvals Management'}
            </p>
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Register */}
        <div className="flex border-b border-slate-200 bg-slate-50/80">
          <button
            type="button"
            onClick={() => setTab('signin')}
            className={`flex-1 py-3.5 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
              tab === 'signin' 
                ? 'border-blue-900 text-blue-900 bg-white shadow-2xs' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-3.5 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
              tab === 'register' 
                ? 'border-blue-900 text-blue-900 bg-white shadow-2xs' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Register
          </button>
        </div>

        {/* Feedback Alerts */}
        <div className="px-6 sm:px-8 pt-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{successMessage}</div>
            </div>
          )}
        </div>

        {/* Tab 1: SIGN IN FORM */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn} className="p-6 sm:p-8 space-y-4">
            
            {/* Username or Mail ID */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-900" />
                <span>Username or Mail ID</span>
              </label>
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder={role === 'superadmin' ? 'superadmin or superadmin@triplehelix.tn.gov.in' : 'admin or admin@triplehelix.tn.gov.in'}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-900" />
                  <span>Password</span>
                </span>
              </label>
              <div className="relative">
                <input
                  type={loginShowPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your security password"
                  className="w-full h-11 px-3.5 pr-10 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setLoginShowPassword(!loginShowPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                  aria-label={loginShowPassword ? 'Hide password' : 'Show password'}
                >
                  {loginShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Forgot Password Link directly below password */}
              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setForgotModalOpen(true);
                    setForgotStep('email');
                    setForgotEmail(loginIdentifier.includes('@') ? loginIdentifier : '');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Captcha */}
            <CaptchaWidget
              value={loginCaptcha}
              onChange={setLoginCaptcha}
              onValidate={setLoginCaptchaValid}
              challengeRef={loginChallengeRef}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#0c2340] to-[#17457a] hover:from-[#091b33] hover:to-[#123864] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              <span>{loading ? 'Authenticating...' : `Sign In to ${role === 'superadmin' ? 'Super Admin' : 'Admin'} Portal`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Seed account quick reminder tip */}
            <div className="pt-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center font-mono">
              <span>Default Credentials: </span>
              <strong>{role === 'superadmin' ? 'superadmin / SuperAdmin@2026' : 'admin / Admin@2026'}</strong>
            </div>

          </form>
        )}

        {/* Tab 2: REGISTER FORM */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="p-6 sm:p-8 space-y-4">
            
            {/* Username */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-900" />
                <span>Username</span>
              </label>
              <input
                type="text"
                required
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                placeholder="Choose a unique username (min 3 chars)"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
            </div>

            {/* Mail ID */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-900" />
                <span>Official Mail ID</span>
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="official.name@dept.tn.gov.in"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
              {regEmail && !validateEmail(regEmail) && (
                <span className="text-[10px] text-rose-600 font-semibold">Please enter a valid email format.</span>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-900" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type={regShowPassword ? 'text' : 'password'}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full h-11 px-3.5 pr-10 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setRegShowPassword(!regShowPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                  aria-label={regShowPassword ? 'Hide password' : 'Show password'}
                >
                  {regShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {regPassword && (
                <div className="pt-1 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Password Strength:</span>
                    <span className="font-bold" style={{ color: regStrength.color }}>
                      {regStrength.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${regStrength.bgClass}`}
                      style={{ width: `${regStrength.percent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-900" />
                <span>Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  type={regShowConfirm ? 'text' : 'password'}
                  required
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Re-enter password to confirm"
                  className="w-full h-11 px-3.5 pr-10 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setRegShowConfirm(!regShowConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                  aria-label={regShowConfirm ? 'Hide password' : 'Show password'}
                >
                  {regShowConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {regConfirmPassword && regPassword !== regConfirmPassword && (
                <span className="text-[10px] text-rose-600 font-semibold">Passwords do not match.</span>
              )}
            </div>

            {/* Captcha */}
            <CaptchaWidget
              value={regCaptcha}
              onChange={setRegCaptcha}
              onValidate={setRegCaptchaValid}
              challengeRef={regChallengeRef}
            />

            {/* Register Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#0c2340] to-[#17457a] hover:from-[#091b33] hover:to-[#123864] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              <span>{loading ? 'Creating Account...' : `Register ${role === 'superadmin' ? 'Super Admin' : 'Admin'} Account`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        )}

      </div>

      {/* 4. FORGOT PASSWORD MODAL FLOW */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <KeyRound className="w-5 h-5 text-blue-900" />
                <span>Password Recovery ({role === 'superadmin' ? 'Super Admin' : 'Admin'})</span>
              </div>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Step 1: Enter Email & Solve Captcha */}
            {forgotStep === 'email' && (
              <form onSubmit={handleForgotSubmitEmail} className="space-y-4 pt-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter your registered official email address. A one-time verification code (OTP) will be dispatched to verify identity.
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Registered Mail ID</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="official.name@triplehelix.tn.gov.in"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <CaptchaWidget
                  value={forgotCaptcha}
                  onChange={setForgotCaptcha}
                  onValidate={setForgotCaptchaValid}
                  challengeRef={forgotChallengeRef}
                />

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-blue-900 text-white text-xs font-bold hover:bg-blue-800 cursor-pointer shadow-xs"
                  >
                    Send OTP Link
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Enter OTP */}
            {forgotStep === 'otp' && (
              <form onSubmit={handleForgotVerifyOtp} className="space-y-4 pt-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter the 6-digit verification code dispatched to <strong>{forgotEmail}</strong>.
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">6-Digit OTP</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={userEnteredOtp}
                    onChange={(e) => setUserEnteredOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-center font-mono text-lg font-bold tracking-widest focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep('email')}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-blue-900 text-white text-xs font-bold hover:bg-blue-800 cursor-pointer shadow-xs"
                  >
                    Verify Code
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Set New Password */}
            {forgotStep === 'newpass' && (
              <form onSubmit={handleForgotSaveNewPassword} className="space-y-4 pt-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">New Password</label>
                  <div className="relative">
                    <input
                      type={forgotShowPass ? 'text' : 'password'}
                      required
                      value={forgotNewPass}
                      onChange={(e) => setForgotNewPass(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full h-11 px-3.5 pr-10 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => setForgotShowPass(!forgotShowPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1"
                    >
                      {forgotShowPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {forgotNewPass && (
                    <div className="pt-1">
                      <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                        <span>Strength:</span>
                        <span style={{ color: forgotStrength.color }}>{forgotStrength.label}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                        <div className={`h-full ${forgotStrength.bgClass}`} style={{ width: `${forgotStrength.percent}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={forgotConfirmPass}
                    onChange={(e) => setForgotConfirmPass(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer shadow-xs"
                  >
                    {loading ? 'Saving...' : 'Set Password'}
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: Done */}
            {forgotStep === 'done' && (
              <div className="space-y-4 pt-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Password Updated Successfully</h3>
                <p className="text-xs text-slate-600">
                  Your credentials have been securely refreshed. Please sign in with your updated password.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForgotModalOpen(false);
                    setTab('signin');
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-900 text-white text-xs font-bold hover:bg-blue-800 cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Footer Branding Note */}
      <div className="text-center text-xs text-slate-500 pt-6">
        <span>Government of Tamil Nadu · Triple Helix Innovation Ecosystem</span>
      </div>

    </div>
  );
};
export default RoleAuthPage;
