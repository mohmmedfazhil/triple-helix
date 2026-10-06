import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { InstitutionType } from '../../types';
import { 
  Building2, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Mail, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLoginPrompt: () => void;
}

export const InstitutionRegisterModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccessLoginPrompt
}) => {
  const { registerInstitution, verifyInstitutionEmail, triggerError } = useApp();

  // Form State matching SRS Section 7
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    addressLine1: '',
    addressLine2: '',
    city: 'Chengalpattu',
    district: 'Chengalpattu',
    state: 'Tamil Nadu',
    pincode: '',
    institutionType: 'Government Aided' as InstitutionType,
    universityAffiliated: true,
    affiliatedUniversityName: 'Anna University, Chennai',
    autonomous: true,
    naacGrade: 'A++',
    principalName: '',
    coordinatorName: '',
    coordinatorDesignation: 'Head, Research & Development Cell',
    coordinatorPhone: '',
    coordinatorEmail: '',
    websiteUrl: '',
    username: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  // CAPTCHA State
  const [captchaNum1, setCaptchaNum1] = useState(7);
  const [captchaNum2, setCaptchaNum2] = useState(4);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaValid, setCaptchaValid] = useState(false);

  // Email Verification Step State (Section 7)
  const [pendingVerificationId, setPendingVerificationId] = useState<string | null>(null);
  const [verificationDone, setVerificationDone] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const regenerateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 9) + 2;
    const n2 = Math.floor(Math.random() * 8) + 1;
    setCaptchaNum1(n1);
    setCaptchaNum2(n2);
    setCaptchaInput('');
    setCaptchaValid(false);
  };

  useEffect(() => {
    if (isOpen) {
      regenerateCaptcha();
      setPendingVerificationId(null);
      setVerificationDone(false);
      setFormErrors([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    // Validation Rules (SRS Section 7 & Section 23)
    if (!formData.name.trim()) errors.push('Institution Name is required');
    if (!formData.shortName.trim()) errors.push('Institution Short Name is required');
    if (!formData.addressLine1.trim()) errors.push('Address Line 1 is required');
    if (!formData.pincode.trim() || formData.pincode.length !== 6) errors.push('Valid 6-digit Pincode is required');
    if (!formData.principalName.trim()) errors.push('Principal Name is required');
    if (!formData.coordinatorName.trim()) errors.push('Coordinator Name is required');
    if (!formData.coordinatorEmail.trim() || !formData.coordinatorEmail.includes('@')) errors.push('Valid Coordinator Email is required');
    if (!formData.coordinatorPhone.trim()) errors.push('Coordinator Phone Number is required');
    if (!formData.username.trim()) errors.push('Account Username is required');
    
    // Password match check
    if (!formData.password || formData.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    if (formData.password !== formData.confirmPassword) {
      errors.push('Password and Confirm Password do not match');
    }

    // CAPTCHA check
    if (parseInt(captchaInput, 10) !== captchaNum1 + captchaNum2) {
      errors.push('CAPTCHA calculation answer is incorrect');
      triggerError('Registration Errors', 'CAPTCHA verification failed. Please try the new math problem.');
      regenerateCaptcha();
    }

    // Terms check
    if (!formData.termsAccepted) {
      errors.push('You must accept the Terms and Conditions to proceed');
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      triggerError('Registration Errors', errors[0]);
      return;
    }

    setFormErrors([]);

    // Call registration
    const res = registerInstitution({
      name: formData.name,
      shortName: formData.shortName,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      district: formData.district,
      state: formData.state,
      pincode: formData.pincode,
      institutionType: formData.institutionType,
      universityAffiliated: formData.universityAffiliated,
      affiliatedUniversityName: formData.universityAffiliated ? formData.affiliatedUniversityName : undefined,
      autonomous: formData.autonomous,
      naacGrade: formData.naacGrade,
      principalName: formData.principalName,
      coordinatorName: formData.coordinatorName,
      coordinatorDesignation: formData.coordinatorDesignation,
      coordinatorPhone: formData.coordinatorPhone,
      coordinatorEmail: formData.coordinatorEmail,
      websiteUrl: formData.websiteUrl,
      username: formData.username
    });

    if (res.success && res.institutionId) {
      // System sends email verification, account remains Inactive until verified per Section 7
      setPendingVerificationId(res.institutionId);
    }
  };

  const handleSimulateEmailVerification = () => {
    if (pendingVerificationId) {
      verifyInstitutionEmail(pendingVerificationId);
      setVerificationDone(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-sky-50/70 border-b border-sky-100 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Institution Registration
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                District Engineering College & Polytechnic Onboarding
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6">
          
          {/* Institution Registration Submitted — Pending Super Admin Approval */}
          {pendingVerificationId && (
            <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-6 text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center mx-auto shadow-2xs">
                <ShieldCheck className="w-8 h-8 text-sky-600" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/90 px-2.5 py-0.5 rounded-full inline-block">
                  Status: Pending Super Admin Approval
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Registration Successfully Submitted!
                </h3>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Under strict District Innovation Mission governance, all new educational institutions must be verified and approved by the Super Admin before login credentials become active.
                </p>
              </div>

              {/* Automated Transactional Email Preview */}
              <div className="p-4 bg-white rounded-xl border border-sky-200 text-xs text-left max-w-md mx-auto space-y-2 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-sky-600" />
                    Automated Outbound Email Dispatched
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    SENT
                  </span>
                </div>
                <div className="text-slate-600 space-y-1">
                  <div><strong>To:</strong> {formData.coordinatorEmail}</div>
                  <div><strong>Institution:</strong> {formData.name}</div>
                  <div><strong>Username:</strong> {formData.username}</div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    Subject: Institution Registration Submitted (Pending Super Admin Approval)
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Understood & Close
                </button>
              </div>
            </div>
          )}

          {/* Normal Form when not pending verification */}
          {!pendingVerificationId && (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Error summary banner */}
              {formErrors.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-800 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Please correct the following errors:</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                    {formErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 1. Basic Information (SRS Section 7) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">
                  1. Basic Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-medium mb-1">
                      Institution Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SRM Institute of Science and Technology"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Institution Short Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CIT"
                      value={formData.shortName}
                      onChange={e => setFormData({ ...formData, shortName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Pincode <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="641014"
                      value={formData.pincode}
                      onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Address Line 1 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Campus Road / Sector"
                      value={formData.addressLine1}
                      onChange={e => setFormData({ ...formData, addressLine1: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Landmark or Post"
                      value={formData.addressLine2}
                      onChange={e => setFormData({ ...formData, addressLine2: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">District</label>
                    <input
                      type="text"
                      disabled
                      value={formData.district}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">State</label>
                    <input
                      type="text"
                      disabled
                      value={formData.state}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Institution Type & University Details (SRS Section 7) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">
                  2. Institution Classification & Accreditation
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Institution Type</label>
                    <select
                      value={formData.institutionType}
                      onChange={e => setFormData({ ...formData, institutionType: e.target.value as InstitutionType })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
                    >
                      <option value="Government">Government</option>
                      <option value="Government Aided">Government Aided</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">NAAC Grade</label>
                    <select
                      value={formData.naacGrade}
                      onChange={e => setFormData({ ...formData, naacGrade: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
                    >
                      <option value="A++">A++ (Highest)</option>
                      <option value="A+">A+</option>
                      <option value="A">A</option>
                      <option value="B++">B++</option>
                      <option value="B+">B+</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4 sm:col-span-2 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.universityAffiliated}
                        onChange={e => setFormData({ ...formData, universityAffiliated: e.target.checked })}
                        className="rounded text-sky-600"
                      />
                      <span className="text-slate-700">University Affiliated</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.autonomous}
                        onChange={e => setFormData({ ...formData, autonomous: e.target.checked })}
                        className="rounded text-sky-600"
                      />
                      <span className="text-slate-700">Autonomous Status</span>
                    </label>
                  </div>

                  {formData.universityAffiliated && (
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-medium mb-1">
                        Affiliated University Name
                      </label>
                      <input
                        type="text"
                        value={formData.affiliatedUniversityName}
                        onChange={e => setFormData({ ...formData, affiliatedUniversityName: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Contact Information (SRS Section 7) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">
                  3. Contact Information & Coordinator
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Principal Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. K. Rajasekaran"
                      value={formData.principalName}
                      onChange={e => setFormData({ ...formData, principalName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Coordinator Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Prof. S. Murali"
                      value={formData.coordinatorName}
                      onChange={e => setFormData({ ...formData, coordinatorName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Coordinator Designation
                    </label>
                    <input
                      type="text"
                      value={formData.coordinatorDesignation}
                      onChange={e => setFormData({ ...formData, coordinatorDesignation: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Coordinator Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 94432 00000"
                      value={formData.coordinatorPhone}
                      onChange={e => setFormData({ ...formData, coordinatorPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Coordinator Official Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="coordinator@college.ac.in"
                      value={formData.coordinatorEmail}
                      onChange={e => setFormData({ ...formData, coordinatorEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Institution Website URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.college.ac.in"
                      value={formData.websiteUrl}
                      onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Account Details & Security (SRS Section 7) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">
                  4. Account Credentials & Security
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-medium mb-1">
                      Username <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. cit_innovation"
                      value={formData.username}
                      onChange={e => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    />
                  </div>
                </div>

                {/* CAPTCHA (Section 7) */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 mt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-sky-600" />
                      Security Check (CAPTCHA)
                    </span>
                    <button
                      type="button"
                      onClick={regenerateCaptcha}
                      className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-[11px]"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Refresh</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 bg-slate-200 text-slate-800 font-mono font-bold text-sm tracking-widest rounded select-none">
                      {captchaNum1} + {captchaNum2} = ?
                    </div>
                    <input
                      type="number"
                      required
                      placeholder="Answer"
                      value={captchaInput}
                      onChange={e => setCaptchaInput(e.target.value)}
                      className="w-28 px-3 py-1.5 border border-slate-300 rounded-md text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Terms and Conditions Checkbox (Section 7) */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.termsAccepted}
                      onChange={e => setFormData({ ...formData, termsAccepted: e.target.checked })}
                      className="mt-0.5 rounded text-sky-600"
                    />
                    <span>
                      I hereby certify that the information provided is accurate and agree to the Triple Helix Portal Terms and Conditions and District Innovation Mission Code of Conduct.
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors"
                >
                  Submit Registration & Send Verification Email
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
