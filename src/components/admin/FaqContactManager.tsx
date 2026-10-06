import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FAQItem, ContactSettings, ContactInquiry } from '../../types';
import { 
  HelpCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  RotateCcw, 
  Save, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  X,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

export const FaqContactManager: React.FC = () => {
  const { 
    faqList, 
    addFaqItem, 
    updateFaqItem, 
    deleteFaqItem, 
    resetFaqItems,
    contactSettings,
    updateContactSettings,
    contactInquiries,
    updateInquiryStatus
  } = useApp();

  const [activeTab, setActiveTab] = useState<'faqs' | 'contact-settings' | 'inquiries'>('faqs');

  // FAQ Modal state
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqForm, setFaqForm] = useState<{ question: string; answer: string; category: string }>({
    question: '',
    answer: '',
    category: 'General'
  });

  // Contact settings state
  const [contactForm, setContactForm] = useState<ContactSettings>(contactSettings);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);
  const [newSubjectInput, setNewSubjectInput] = useState('');

  const handleOpenAddFaq = () => {
    setEditingFaqId(null);
    setFaqForm({ question: '', answer: '', category: 'General' });
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaq = (item: FAQItem) => {
    setEditingFaqId(item.id || null);
    setFaqForm({ question: item.question, answer: item.answer, category: item.category || 'General' });
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim()) return;

    if (editingFaqId) {
      updateFaqItem(editingFaqId, faqForm);
    } else {
      addFaqItem(faqForm);
    }
    setIsFaqModalOpen(false);
  };

  const handleSaveContactSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactSettings(contactForm);
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  const handleAddSubjectOption = () => {
    if (!newSubjectInput.trim()) return;
    if (contactForm.subjectOptions.includes(newSubjectInput.trim())) return;
    setContactForm(prev => ({
      ...prev,
      subjectOptions: [...prev.subjectOptions, newSubjectInput.trim()]
    }));
    setNewSubjectInput('');
  };

  const handleRemoveSubjectOption = (index: number) => {
    setContactForm(prev => ({
      ...prev,
      subjectOptions: prev.subjectOptions.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Switcher Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-sky-600" />
            <span>FAQ & Contact Us Customization Console</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Super Admin can customize public FAQs, update district office contact coordinates, and review incoming transmissions.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-center">
          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'faqs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            FAQ Management ({faqList.length})
          </button>
          <button
            onClick={() => setActiveTab('contact-settings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'contact-settings' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Contact Settings
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'inquiries' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Inquiries</span>
            {contactInquiries.filter(i => i.status === 'New').length > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">
                {contactInquiries.filter(i => i.status === 'New').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: FAQ MANAGEMENT */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Active Frequently Asked Questions
              </h3>
              <p className="text-xs text-slate-500">
                These questions render directly in the /faq accordion for institutions and mentors.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenAddFaq}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add FAQ Item</span>
              </button>

              <button
                onClick={resetFaqItems}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium cursor-pointer"
                title="Reset to default official FAQs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {faqList.map((faq, idx) => (
              <div 
                key={faq.id || idx}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                      {faq.category || 'General'}
                    </span>
                    <span className="text-xs font-mono text-slate-400">#{idx + 1}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {faq.question}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleOpenEditFaq(faq)}
                    className="p-2 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit FAQ"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => faq.id && deleteFaqItem(faq.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CONTACT SETTINGS CUSTOMIZER */}
      {activeTab === 'contact-settings' && (
        <form onSubmit={handleSaveContactSettings} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Official District Contact Information
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update the official address, telephone numbers, electronic mail, and form dropdowns displayed on the Contact page.
              </p>
            </div>

            {settingsSavedToast && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Settings Saved!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Office / Mission Name
              </label>
              <input
                type="text"
                required
                value={contactForm.officeName}
                onChange={(e) => setContactForm({ ...contactForm, officeName: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Department / Cell
              </label>
              <input
                type="text"
                required
                value={contactForm.department}
                onChange={(e) => setContactForm({ ...contactForm, department: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Address Line 1
              </label>
              <input
                type="text"
                required
                value={contactForm.addressLine1}
                onChange={(e) => setContactForm({ ...contactForm, addressLine1: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Address Line 2
              </label>
              <input
                type="text"
                required
                value={contactForm.addressLine2}
                onChange={(e) => setContactForm({ ...contactForm, addressLine2: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                City
              </label>
              <input
                type="text"
                required
                value={contactForm.city}
                onChange={(e) => setContactForm({ ...contactForm, city: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                State
              </label>
              <input
                type="text"
                required
                value={contactForm.state}
                onChange={(e) => setContactForm({ ...contactForm, state: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pincode
              </label>
              <input
                type="text"
                required
                value={contactForm.pincode}
                onChange={(e) => setContactForm({ ...contactForm, pincode: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Primary Electronic Mail
              </label>
              <input
                type="email"
                required
                value={contactForm.primaryEmail}
                onChange={(e) => setContactForm({ ...contactForm, primaryEmail: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Secondary Electronic Mail
              </label>
              <input
                type="email"
                value={contactForm.secondaryEmail || ''}
                onChange={(e) => setContactForm({ ...contactForm, secondaryEmail: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Helpline Telephony
              </label>
              <input
                type="text"
                required
                value={contactForm.helplinePhone}
                onChange={(e) => setContactForm({ ...contactForm, helplinePhone: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Office Working Hours
              </label>
              <input
                type="text"
                required
                value={contactForm.workingHours}
                onChange={(e) => setContactForm({ ...contactForm, workingHours: e.target.value })}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              SLA / Service Commitment Notice
            </label>
            <input
              type="text"
              required
              value={contactForm.slaNotice}
              onChange={(e) => setContactForm({ ...contactForm, slaNotice: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          {/* Subject Options Customizer */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700">
              Form Inquiry Subject Options (Rendered in Contact Form Dropdown)
            </label>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubjectInput}
                onChange={(e) => setNewSubjectInput(e.target.value)}
                placeholder="Add a new subject category..."
                className="flex-1 text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSubjectOption}
                className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 cursor-pointer"
              >
                Add Option
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {contactForm.subjectOptions.map((opt, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                  <span>{opt}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubjectOption(i)}
                    className="text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1769AA] hover:bg-[#125386] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Contact Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: CONTACT INQUIRIES VIEWER */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Transmitted Contact Inquiries ({contactInquiries.length})
              </h3>
              <p className="text-xs text-slate-500">
                Inquiries submitted by institutions, students, mentors, and citizens via the Contact Us form.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {contactInquiries.map((inq) => (
              <div 
                key={inq.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{inq.fullName}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                        {inq.role}
                      </span>
                      {inq.organization && (
                        <span className="text-xs text-slate-500">({inq.organization})</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-3">
                      <span>Email: <a href={`mailto:${inq.email}`} className="text-sky-700 underline font-mono">{inq.email}</a></span>
                      {inq.mobileNumber && <span>Phone: <span className="font-mono">{inq.mobileNumber}</span></span>}
                      <span>Date: <span className="font-mono text-slate-400">{inq.createdAt}</span></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-500 font-semibold">Status:</span>
                    <select
                      value={inq.status}
                      onChange={(e) => updateInquiryStatus(inq.id, e.target.value as ContactInquiry['status'])}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer ${
                        inq.status === 'New' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        inq.status === 'In Review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="In Review">In Review</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Subject:</span>
                    <span className="text-slate-900">{inq.subject}</span>
                  </div>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl leading-relaxed whitespace-pre-wrap">
                    {inq.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Creating / Editing FAQ Item */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingFaqId ? 'Edit FAQ Item' : 'Create New FAQ Item'}
              </h3>
              <button onClick={() => setIsFaqModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={faqForm.category}
                  onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="General">General / Platform</option>
                  <option value="Institutions">Institutions & Teams</option>
                  <option value="Mentors">Industry Mentors</option>
                  <option value="Projects">Problem Statements & Milestones</option>
                  <option value="Certificates">Certificates & Verification</option>
                  <option value="Deployment">Municipal Deployment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Question <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  placeholder="e.g. How are student engineering teams selected?"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Answer <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  placeholder="Provide an accurate, clear explanation..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#1769AA] hover:bg-[#125386] text-white rounded-xl shadow-xs cursor-pointer"
                >
                  {editingFaqId ? 'Save Changes' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FaqContactManager;
