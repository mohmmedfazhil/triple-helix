import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Users, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Lock, 
  Key,
  Filter,
  Trash2
} from 'lucide-react';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { getGlobalConfig, updateGlobalDeadline, StaffUserProfile } from '../../lib/firebaseServices';

export const CollectorSubAccountManager: React.FC = () => {
  const [deadlineInput, setDeadlineInput] = useState('');
  const [currentDeadline, setCurrentDeadline] = useState('');
  const [deadlineSaving, setDeadlineSaving] = useState(false);
  const [deadlineSuccess, setDeadlineSuccess] = useState(false);

  // Sub-accounts list & form
  const [subAccounts, setSubAccounts] = useState<StaffUserProfile[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [allowedCategories, setAllowedCategories] = useState<string[]>([]);
  const [createMsg, setCreateMsg] = useState<string | null>(null);

  const CATEGORIES = [
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

  useEffect(() => {
    getGlobalConfig().then(cfg => {
      setCurrentDeadline(cfg.submissionDeadline);
      // Format to datetime-local input
      try {
        const d = new Date(cfg.submissionDeadline);
        const isoLocal = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        setDeadlineInput(isoLocal);
      } catch {
        setDeadlineInput('');
      }
    });

    fetchSubAccounts();
  }, []);

  const fetchSubAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const snap = await getDocs(collection(db, 'staff_users'));
      const accounts = snap.docs.map(d => d.data() as StaffUserProfile);
      setSubAccounts(accounts.filter(a => a.role === 'COLLECTOR'));
    } catch (err) {
      console.warn('Sub-accounts sync note:', err);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleSaveDeadline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deadlineInput) return;
    setDeadlineSaving(true);
    setDeadlineSuccess(false);

    try {
      const iso = new Date(deadlineInput).toISOString();
      await updateGlobalDeadline(iso);
      setCurrentDeadline(iso);
      setDeadlineSuccess(true);
      setTimeout(() => setDeadlineSuccess(false), 4000);
    } catch (err) {
      console.error('Save deadline error:', err);
    } finally {
      setDeadlineSaving(false);
    }
  };

  const handleToggleCategory = (cat: string) => {
    setAllowedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleCreateSubAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.includes('@')) {
      setCreateMsg('Please enter a valid official staff email.');
      return;
    }

    try {
      const uid = `staff-coll-${Date.now().toString().slice(-6)}`;
      const newAccount: StaffUserProfile = {
        uid,
        email: cleanEmail,
        role: 'COLLECTOR',
        name: name.trim(),
        scopeFilters: {
          allowedCategories: allowedCategories.length > 0 ? allowedCategories : ['All']
        },
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'staff_users', uid), newAccount);
      setSubAccounts(prev => [...prev, newAccount]);
      setIsCreateOpen(false);
      setName('');
      setEmail('');
      setAllowedCategories([]);
      setCreateMsg('Collector sub-account created successfully.');
      setTimeout(() => setCreateMsg(null), 4000);
    } catch (err: any) {
      setCreateMsg(err.message || 'Failed to provision sub-account');
    }
  };

  const handleDeleteAccount = async (uid: string) => {
    if (!confirm('Are you sure you want to revoke access for this Collector sub-account?')) return;
    try {
      await deleteDoc(doc(db, 'staff_users', uid));
      setSubAccounts(prev => prev.filter(a => a.uid !== uid));
    } catch (err) {
      console.error('Delete account error:', err);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Global Submission Deadline Freeze Control */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Global Solution Submission Deadline Freeze</span>
            </h3>
            <p className="text-xs text-slate-500">
              When this deadline expires, all solution nomination actions are automatically blocked across the UI and in Firestore security rules.
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
            Strict Firestore Enforcement
          </span>
        </div>

        {deadlineSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Global deadline timestamp synchronized to Firestore <code>global_config/main</code>.</span>
          </div>
        )}

        <form onSubmit={handleSaveDeadline} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Submission Cut-off Timestamp (Date & Time)
            </label>
            <input
              type="datetime-local"
              required
              value={deadlineInput}
              onChange={(e) => setDeadlineInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            {currentDeadline && (
              <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                Active in Cloud: <strong>{new Date(currentDeadline).toLocaleString()}</strong>
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={deadlineSaving}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{deadlineSaving ? 'Saving...' : 'Update Global Deadline'}</span>
          </button>
        </form>
      </div>

      {/* 2. Collector Sub-Accounts Provisioning with Scope Filters */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Collector Sub-Account Provisioning & Scope Filters</span>
            </h3>
            <p className="text-xs text-slate-500">
              Create restricted Collector subordinate logins with customized category and institutional scope filters.
            </p>
          </div>

          <button
            onClick={() => setIsCreateOpen(!isCreateOpen)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Provision Collector Sub-Login</span>
          </button>
        </div>

        {createMsg && (
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{createMsg}</span>
          </div>
        )}

        {/* Create Modal / Expansion */}
        {isCreateOpen && (
          <form onSubmit={handleCreateSubAccount} className="p-5 bg-blue-50/40 border border-blue-200 rounded-2xl space-y-4">
            <div className="text-xs font-bold text-blue-900 uppercase font-mono">
              New Collector Sub-Account
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Officer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thiru R. Soundarajan, District Revenue Officer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email (Terminal Login ID) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. dro.chengalpattu@tn.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Customized Scope Filters (Select authorized problem statement categories, or leave empty for full district view)
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => {
                  const selected = allowedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleToggleCategory(cat)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                        selected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {selected ? '✓ ' : '+ '}{cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
              >
                Save Collector Sub-Account
              </button>
            </div>
          </form>
        )}

        {/* Active Accounts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-mono text-[11px]">
                <th className="py-3 px-3">Officer Name</th>
                <th className="py-3 px-3">Login Identifier</th>
                <th className="py-3 px-3">Authorized Category Scope</th>
                <th className="py-3 px-3">Role Claim</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Default District Collector */}
              <tr className="bg-slate-50/50">
                <td className="py-3.5 px-3">
                  <div className="font-bold text-slate-900">District Collector (Chengalpattu)</div>
                  <div className="text-[10px] text-slate-400">Head of District Administration</div>
                </td>
                <td className="py-3.5 px-3 font-mono text-slate-700">
                  collector.chengalpattu@tn.gov.in
                </td>
                <td className="py-3.5 px-3">
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                    All Categories (Unrestricted)
                  </span>
                </td>
                <td className="py-3.5 px-3 font-mono text-blue-700 font-bold">
                  COLLECTOR (Primary)
                </td>
                <td className="py-3.5 px-3 text-right text-slate-400 text-[10px]">
                  System Default
                </td>
              </tr>

              {/* Dynamic Sub-Accounts */}
              {subAccounts.map((acc) => (
                <tr key={acc.uid} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-slate-900">
                    {acc.name}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-700">
                    {acc.email}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex flex-wrap gap-1">
                      {acc.scopeFilters?.allowedCategories?.map((c, i) => (
                        <span key={i} className="text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-blue-700 font-bold">
                    {acc.role}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => handleDeleteAccount(acc.uid)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                      title="Revoke access"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

export default CollectorSubAccountManager;
