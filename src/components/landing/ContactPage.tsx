import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ContactInquiry } from '../../types';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Building2,
  AlertCircle
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { setActivePage, contactSettings, submitContactInquiry } = useApp();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    mobileNumber: string;
    role: ContactInquiry['role'];
    organization: string;
    subject: string;
    message: string;
  }>({
    fullName: '',
    email: '',
    mobileNumber: '',
    role: 'Institution',
    organization: '',
    subject: contactSettings.subjectOptions[0] || 'General Portal Technical Support',
    message: ''
  });

  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const res = submitContactInquiry(formData);
    setSuccessMessage(res.message);
    setSubmittedSuccess(true);
    setFormData({
      fullName: '',
      email: '',
      mobileNumber: '',
      role: 'Institution',
      organization: '',
      subject: contactSettings.subjectOptions[0] || 'General Portal Technical Support',
      message: ''
    });
  };

  return (
    <div className="w-full min-h-screen py-8 bg-[#F7FAFC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Bar Back Link */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setActivePage('home')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#10233F] hover:text-[#1769AA] transition-colors bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 px-3.5 py-2 rounded-xl cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </button>

          <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-widest hidden xs:inline-block">
            Government of Tamil Nadu · Civic Desk
          </span>
        </div>

        {/* Contact Banner Header */}
        <div className="space-y-2 border-b border-slate-200 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold tracking-wider uppercase bg-[#EAF4FC] text-[#1769AA] border border-[#1769AA]/30">
            Contact Us
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10233F] tracking-tight">
            Connect with the District Innovation Mission
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Have inquiries about submitting problem statements, collegiate team registration, mentor onboarding, or milestone verification? Reach out to our dedicated nodal desk.
          </p>
        </div>

        {/* Success Modal / Banner */}
        {submittedSuccess && (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-start gap-3.5 shadow-sm animate-in fade-in duration-200">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold">Inquiry Dispatched Successfully</h4>
              <p className="text-xs text-emerald-800 leading-relaxed">
                {successMessage}
              </p>
              <button
                onClick={() => setSubmittedSuccess(false)}
                className="mt-2 text-xs font-semibold text-emerald-700 underline hover:text-emerald-900 cursor-pointer"
              >
                Submit another inquiry
              </button>
            </div>
          </div>
        )}

        {/* Main 2-Column Layout: Contact Coordinates + Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (5 cols): Official Administrative Coordinates */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#1769AA] font-extrabold">
                  Nodal Authority
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#10233F] mt-1">
                  {contactSettings.officeName}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {contactSettings.department}
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-100 text-xs">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EAF4FC] border border-[#1769AA]/20 flex items-center justify-center text-[#1769AA] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">District Office Address</div>
                    <div className="text-slate-600 mt-0.5 leading-relaxed">
                      {contactSettings.addressLine1},<br />
                      {contactSettings.addressLine2},<br />
                      {contactSettings.city}, {contactSettings.state} – {contactSettings.pincode}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EAF4FC] border border-[#1769AA]/20 flex items-center justify-center text-[#1769AA] shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Official Electronic Mail</div>
                    <a href={`mailto:${contactSettings.primaryEmail}`} className="text-sky-700 hover:underline font-mono">
                      {contactSettings.primaryEmail}
                    </a>
                    {contactSettings.secondaryEmail && (
                      <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                        {contactSettings.secondaryEmail}
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EAF6EF] border border-[#2E8B57]/20 flex items-center justify-center text-[#2E8B57] shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Helpline Telephony</div>
                    <div className="text-slate-700 font-mono font-medium">
                      {contactSettings.helplinePhone}
                    </div>
                    {contactSettings.secondaryPhone && (
                      <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                        {contactSettings.secondaryPhone}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FFF5DD] border border-[#D49A24]/20 flex items-center justify-center text-[#D49A24] shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Office Working Hours</div>
                    <div className="text-slate-600 mt-0.5">
                      {contactSettings.workingHours}
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Level Agreement Notice */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-start gap-2.5 text-[11px] text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {contactSettings.slaNotice}
                </p>
              </div>

            </div>

          </div>

          {/* Right Column (7 cols): Interactive Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Transmit Official Communication
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in the particulars below. Super Admin and the District Innovation Cell will triage your transmission.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Dr. K. Radhakrishnan"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1769AA] focus:outline-none bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Electronic Mail <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. principal@college.edu.in"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1769AA] focus:outline-none bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1769AA] focus:outline-none bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Stakeholder Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as ContactInquiry['role'] })}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1769AA] focus:outline-none bg-white"
                    >
                      <option value="Institution">Academic Institution / Faculty</option>
                      <option value="Student">Collegiate Student</option>
                      <option value="Mentor">Industry Mentor / Corporate Partner</option>
                      <option value="Government Official">Government Department Official</option>
                      <option value="Public Citizen">Public Citizen / Observer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    College / Corporate / Department Name
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g. PSG College of Technology / Public Works Department"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1769AA] focus:outline-none bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject / Category
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1769AA] focus:outline-none bg-white"
                  >
                    {contactSettings.subjectOptions.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Transmission Message & Technical Details <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide relevant details, project ID reference if applicable, and specific requirements..."
                    className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1769AA] focus:outline-none bg-slate-50/50 leading-relaxed"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1769AA] hover:bg-[#125386] text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry to District Cell</span>
                  </button>
                </div>

              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ContactPage;
