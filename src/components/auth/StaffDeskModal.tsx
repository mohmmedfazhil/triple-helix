import React, { useState } from 'react';
import { Shield, Lock, ArrowRight, X, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { auth, db } from '../../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface StaffDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRole: (role: 'superadmin' | 'collector', route: string) => void;
}

export const StaffDeskModal: React.FC<StaffDeskModalProps> = ({
  isOpen,
  onClose,
  onSuccessRole
}) => {
  const { setCurrentUser, addAuditLog } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [securityKey, setSecurityKey] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsVerifying(true);

    const email = identifier.trim().toLowerCase();
    const pass = securityKey.trim();

    try {
      // 1. First attempt Firebase Auth Custom Claim verification
      let verifiedRole: 'SUPER_ADMIN' | 'COLLECTOR' | null = null;
      let userName = '';

      try {
        const userCred = await signInWithEmailAndPassword(auth, email, pass);
        const tokenResult = await userCred.user.getIdTokenResult();
        const roleClaim = tokenResult.claims.role || 
          (tokenResult.claims.SUPER_ADMIN ? 'SUPER_ADMIN' : 
          (tokenResult.claims.COLLECTOR ? 'COLLECTOR' : null));

        if (roleClaim === 'SUPER_ADMIN' || roleClaim === 'COLLECTOR') {
          verifiedRole = roleClaim;
          userName = userCred.user.displayName || (roleClaim === 'SUPER_ADMIN' ? 'Super Admin' : 'District Collector');
        } else {
          // Check staff_users collection in Firestore
          const staffSnap = await getDoc(doc(db, 'staff_users', userCred.user.uid));
          if (staffSnap.exists()) {
            const data = staffSnap.data();
            if (data.role === 'SUPER_ADMIN' || data.role === 'COLLECTOR') {
              verifiedRole = data.role;
              userName = data.name || userCred.user.email || 'Staff User';
            }
          }
        }
      } catch (authErr) {
        // Fall back to pre-configured government staff credentials
      }

      // Pre-configured government administrative credentials
      if (!verifiedRole) {
        const isSuperAdmin = (
          (email === 'admin.triplehelix@tn.gov.in' || email === 'superadmin@tn.gov.in' || email === 'admin@triplehelix.gov.in') &&
          (pass === 'admin123' || pass === 'superadmin123')
        );

        const isCollector = (
          (email === 'collector.chengalpattu@tn.gov.in' || email === 'collector@tn.gov.in' || email === 'collector.cpt@tn.gov.in') &&
          (pass === 'admin123' || pass === 'collector123')
        );

        if (isSuperAdmin) {
          verifiedRole = 'SUPER_ADMIN';
          userName = 'Super Admin (District Innovation Mission)';
        } else if (isCollector) {
          verifiedRole = 'COLLECTOR';
          userName = 'District Collector (Chengalpattu)';
        }
      }

      if (verifiedRole === 'SUPER_ADMIN') {
        setCurrentUser({
          id: 'staff-sa-001',
          role: 'superadmin',
          name: userName || 'Super Admin (District Innovation Mission)',
          email: email
        });
        addAuditLog('Login', 'Logged Out', 'Active Session', 'Staff Desk Authenticated: Super Admin', 'Super Admin');
        setIsVerifying(false);
        onClose();
        onSuccessRole('superadmin', '/admin/master-control');
      } else if (verifiedRole === 'COLLECTOR') {
        setCurrentUser({
          id: 'staff-coll-001',
          role: 'collector',
          name: userName || 'District Collector (Chengalpattu)',
          email: email
        });
        addAuditLog('Login', 'Logged Out', 'Active Session', 'Staff Desk Authenticated: District Collector', 'District Collector');
        setIsVerifying(false);
        onClose();
        onSuccessRole('collector', '/collector/executive-view');
      } else {
        // Strict specification: Any unauthorized email -> return "Invalid Credentials" with ZERO role hint.
        setIsVerifying(false);
        setErrorMsg('Invalid Credentials');
      }
    } catch (err) {
      setIsVerifying(false);
      setErrorMsg('Invalid Credentials');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="w-full max-w-md bg-[#0a1628] border border-blue-900/60 rounded-2xl shadow-2xl p-4 sm:p-6 text-white relative max-h-[92vh] overflow-y-auto my-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Minimalist discreet header with zero public visibility */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-blue-900/40">
          <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/50 flex items-center justify-center text-blue-400 shadow-inner">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-white">
              Staff Portal Access
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Restricted Terminal · Department Verification
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-200 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Official Identification / Email
            </label>
            <input
              type="text"
              required
              autoFocus
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. name@department.tn.gov.in"
              className="w-full px-3.5 py-2.5 bg-[#0e223d] border border-blue-800/50 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Access Token / Security Key
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={securityKey}
                onChange={(e) => setSecurityKey(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-[#0e223d] border border-blue-800/50 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-950/50 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isVerifying ? (
              <span className="inline-block animate-pulse">Verifying Claim...</span>
            ) : (
              <>
                <span>Authenticate Staff Terminal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Discreet Quick Switch for Authorized Testing */}
        <div className="mt-4 pt-3 border-t border-blue-900/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <span className="text-[11px] text-slate-400 font-mono">Quick Authenticate (Demo):</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setIdentifier('admin.triplehelix@tn.gov.in');
                setSecurityKey('admin123');
                setCurrentUser({
                  id: 'staff-sa-001',
                  role: 'superadmin',
                  name: 'Super Admin (District Innovation Mission)',
                  email: 'admin.triplehelix@tn.gov.in'
                });
                addAuditLog('Login', 'Logged Out', 'Active Session', 'Staff Desk Authenticated: Super Admin', 'Super Admin');
                onClose();
                onSuccessRole('superadmin', '/admin/master-control');
              }}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white border border-blue-500 transition-colors shadow-xs cursor-pointer"
            >
              1-Click Super Admin
            </button>
            <button
              type="button"
              onClick={() => {
                setIdentifier('collector.chengalpattu@tn.gov.in');
                setSecurityKey('admin123');
                setCurrentUser({
                  id: 'staff-coll-001',
                  role: 'collector',
                  name: 'District Collector (Chengalpattu)',
                  email: 'collector.chengalpattu@tn.gov.in'
                });
                addAuditLog('Login', 'Logged Out', 'Active Session', 'Staff Desk Authenticated: District Collector', 'District Collector');
                onClose();
                onSuccessRole('collector', '/collector/executive-view');
              }}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white border border-amber-500 transition-colors shadow-xs cursor-pointer"
            >
              1-Click Collector
            </button>
          </div>
        </div>

        <div className="mt-2 text-center">
          <span className="text-[10px] text-slate-500 font-mono">
            Unlisted endpoint · All verification attempts are audited
          </span>
        </div>
      </div>
    </div>
  );
};

export default StaffDeskModal;
