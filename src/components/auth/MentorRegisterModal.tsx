import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Briefcase, 
  X, 
  CheckCircle2, 
  Upload, 
  AlertCircle,
  FileText
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLoginPrompt: () => void;
}

const EXPERTISE_OPTIONS = [
  'Software',
  'Hardware',
  'Embedded',
  'AI/ML',
  'IoT',
  'Healthcare',
  'Agriculture',
  'Data Science',
  'Cybersecurity',
  'Others'
];

export const MentorRegisterModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccessLoginPrompt
}) => {
  const { registerMentor, triggerError } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    designation: '',
    organization: '',
    email: '',
    mobileNumber: '',
    expertise: [] as string[],
    yearsOfExperience: 5,
    linkedInProfile: '',
    resumeFileName: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleExpertise = (item: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(item)
        ? prev.expertise.filter(e => e !== item)
        : [...prev.expertise, item]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!formData.fullName.trim()) errors.push('Full Name is required');
    if (!formData.designation.trim()) errors.push('Designation is required');
    if (!formData.organization.trim()) errors.push('Organization is required');
    if (!formData.email.trim() || !formData.email.includes('@')) errors.push('Valid Email is required');
    if (!formData.mobileNumber.trim()) errors.push('Mobile Number is required');
    if (formData.expertise.length === 0) errors.push('Select at least one domain expertise');
    if (!formData.username.trim()) errors.push('Username is required');

    if (!formData.password || formData.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    if (formData.password !== formData.confirmPassword) {
      errors.push('Password and Confirm Password do not match');
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      triggerError('Registration Errors', errors[0]);
      return;
    }

    setFormErrors([]);

    const res = registerMentor({
      fullName: formData.fullName,
      designation: formData.designation,
      organization: formData.organization,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      expertise: formData.expertise,
      yearsOfExperience: Number(formData.yearsOfExperience),
      linkedInProfile: formData.linkedInProfile || undefined,
      resumeFileName: formData.resumeFileName || undefined,
      username: formData.username
    });

    if (res.success) {
      setIsSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-emerald-50/70 border-b border-emerald-100 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Mentor / Industry Expert Registration
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Guide student teams solving district governance challenges (SRS Section 18)
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
        <div className="p-4 sm:p-6 max-h-[82vh] overflow-y-auto space-y-5 sm:space-y-6">
          
          {isSuccess ? (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-6 text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-2xs">
                <Briefcase className="w-7 h-7 text-emerald-600" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/90 px-2.5 py-0.5 rounded-full inline-block">
                  Status: Pending Super Admin Accreditation
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Mentor Application Submitted!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you for volunteering, {formData.fullName}. Under strict District Innovation Mission governance, industry mentor applications are accredited by the Super Admin before portal login is enabled.
                </p>
              </div>

              {/* Automated Transactional Email Preview */}
              <div className="p-4 bg-white rounded-xl border border-emerald-200 text-xs text-left max-w-md mx-auto space-y-2 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Automated Outbound Email Dispatched
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    SENT
                  </span>
                </div>
                <div className="text-slate-600 space-y-1">
                  <div><strong>To:</strong> {formData.email}</div>
                  <div><strong>Organization:</strong> {formData.organization} ({formData.designation})</div>
                  <div><strong>Username:</strong> {formData.username}</div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    Subject: Mentor Application Received (Pending Super Admin Accreditation)
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center">
                <button
                  onClick={onClose}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Understood & Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {formErrors.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-800 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Please correct the following:</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                    {formErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 1. Personal Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">
                  1. Personal & Professional Profile
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rajeshwari Krishnan"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Designation <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Principal Systems Architect"
                      value={formData.designation}
                      onChange={e => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-medium mb-1">
                      Organization / Company <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Robert Bosch Engineering / TCS / L&T"
                      value={formData.organization}
                      onChange={e => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Contact Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">
                  2. Contact Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="expert@company.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98401 23456"
                      value={formData.mobileNumber}
                      onChange={e => setFormData({ ...formData, mobileNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Expertise (Multiple Selection Allowed per Section 18) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    3. Domain Expertise <span className="text-rose-500">*</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">Multiple selection allowed</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {EXPERTISE_OPTIONS.map(opt => {
                    const selected = formData.expertise.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleExpertise(opt)}
                        className={`text-xs px-3 py-2 rounded-lg border text-left flex items-center justify-between transition-colors ${
                          selected
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{opt}</span>
                        {selected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>

                {formData.expertise.includes('Others') && (
                  <div className="pt-1">
                    <input
                      type="text"
                      placeholder="Specify your other domain expertise (e.g. Smart Mobility, Drone Avionics, Blockchain)..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
                    />
                  </div>
                )}
              </div>

              {/* 4. Experience & Optional Profile */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">
                  4. Experience & Attachments
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Years of Experience <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={45}
                      required
                      value={formData.yearsOfExperience}
                      onChange={e => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value, 10) || 1 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      LinkedIn Profile (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={formData.linkedInProfile}
                      onChange={e => setFormData({ ...formData, linkedInProfile: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-medium mb-1">
                      Resume Upload (Optional)
                    </label>
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-3 text-center hover:bg-slate-50 transition-colors">
                      <div className="flex flex-col items-center justify-center gap-1 cursor-pointer">
                        <Upload className="w-5 h-5 text-slate-400" />
                        <span className="text-xs text-slate-600 font-medium">
                          {formData.resumeFileName ? formData.resumeFileName : 'Click to select PDF resume'}
                        </span>
                        <span className="text-[10px] text-slate-400">PDF up to 10 MB</span>
                      </div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData({ ...formData, resumeFileName: file.name });
                          }
                        }}
                        className="mt-2 text-xs text-slate-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Account Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">
                  5. Account Credentials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-medium mb-1">
                      Username <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. mentor_rajeshwari"
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
              </div>

              {/* Submit */}
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
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                >
                  Register as Mentor
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
