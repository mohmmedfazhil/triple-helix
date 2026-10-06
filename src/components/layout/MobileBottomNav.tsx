import React, { useState } from 'react';
import { useApp, ActivePage } from '../../context/AppContext';
import { 
  Home, 
  Lightbulb, 
  Building2, 
  HelpCircle, 
  Menu, 
  X, 
  Briefcase, 
  Info, 
  Mail, 
  Shield, 
  LogOut, 
  Lock,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../../types';

interface Props {
  onOpenLogin: (role?: UserRole) => void;
  onOpenRegisterInstitution: () => void;
  onOpenRegisterMentor: () => void;
  onOpenStaffPortal: () => void;
}

export const MobileBottomNav: React.FC<Props> = ({
  onOpenLogin,
  onOpenRegisterInstitution,
  onOpenRegisterMentor,
  onOpenStaffPortal
}) => {
  const { currentUser, activePage, setActivePage, logoutUser } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigateTo = (page: ActivePage, path?: string) => {
    if (path) {
      try {
        window.history.pushState({}, '', path);
      } catch {}
    }
    setActivePage(page);
    setDrawerOpen(false);
  };

  const getPortalLabel = () => {
    if (!currentUser) return 'Login';
    if (currentUser.role === 'superadmin') return 'Admin';
    if (currentUser.role === 'collector') return 'Collector';
    if (currentUser.role === 'institution') return 'College';
    if (currentUser.role === 'mentor') return 'Mentor';
    if (currentUser.role === 'student') return 'Workspace';
    return 'Portal';
  };

  const handlePortalClick = () => {
    if (!currentUser) {
      onOpenLogin('institution');
      return;
    }
    if (currentUser.role === 'superadmin') {
      navigateTo('admin-master', '/admin/master-control');
    } else if (currentUser.role === 'collector') {
      navigateTo('collector-exec', '/collector/executive-view');
    } else if (currentUser.role === 'student') {
      navigateTo('workspace');
    } else {
      navigateTo('dashboard');
    }
  };

  const isPortalActive = currentUser
    ? activePage === 'dashboard' || activePage === 'admin-master' || activePage === 'collector-exec' || activePage === 'workspace'
    : false;

  return (
    <>
      {/* 1. Mobile Bottom Thumb Navigation Bar (Only on < md screens) */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-safe select-none"
      >
        <div className="grid grid-cols-5 items-center h-15 px-1 max-w-lg mx-auto">
          
          {/* Tab 1: Home */}
          <button
            onClick={() => navigateTo('home', '/')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] py-1 transition-colors cursor-pointer ${
              activePage === 'home' && !currentUser
                ? 'text-[#0c2340] font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`relative transition-transform ${activePage === 'home' && !currentUser ? 'scale-110' : ''}`}>
              <Home className="w-5 h-5" />
              {activePage === 'home' && !currentUser && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#f5b82e]" />
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">Home</span>
          </button>

          {/* Tab 2: Challenges */}
          <button
            onClick={() => navigateTo('problem-statements', '/problem-statements')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] py-1 transition-colors cursor-pointer ${
              activePage === 'problem-statements' || activePage === 'problem-statement'
                ? 'text-sky-700 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`relative transition-transform ${activePage === 'problem-statements' || activePage === 'problem-statement' ? 'scale-110' : ''}`}>
              <Lightbulb className="w-5 h-5 text-amber-500" />
              {(activePage === 'problem-statements' || activePage === 'problem-statement') && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-sky-600" />
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">Challenges</span>
          </button>

          {/* Tab 3: Center Stakeholder Portal CTA */}
          <button
            onClick={handlePortalClick}
            className="flex flex-col items-center justify-center h-full min-h-[44px] py-1 transition-colors cursor-pointer -mt-3"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0c2340] to-[#17457a] text-white flex items-center justify-center shadow-md shadow-blue-950/20 ring-2 ring-white">
              {currentUser ? (
                <span className="text-xs font-bold uppercase">{currentUser.name.charAt(0)}</span>
              ) : (
                <Building2 className="w-5 h-5 text-[#f5b82e]" />
              )}
            </div>
            <span className={`text-[10px] mt-0.5 tracking-tight font-bold ${isPortalActive ? 'text-blue-900' : 'text-slate-700'}`}>
              {getPortalLabel()}
            </span>
          </button>

          {/* Tab 4: FAQ / Help */}
          <button
            onClick={() => navigateTo('faq', '/faq')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] py-1 transition-colors cursor-pointer ${
              activePage === 'faq'
                ? 'text-sky-700 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`relative transition-transform ${activePage === 'faq' ? 'scale-110' : ''}`}>
              <HelpCircle className="w-5 h-5" />
              {activePage === 'faq' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-sky-600" />
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">FAQ</span>
          </button>

          {/* Tab 5: Menu Drawer */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col items-center justify-center h-full min-h-[44px] py-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">Menu</span>
          </button>

        </div>
      </nav>

      {/* 2. Slide-out Mobile Navigation Drawer */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Body (Right sheet) */}
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div className="bg-[#0c2340] text-white p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block font-mono">
                  Triple Helix Portal
                </span>
                <span className="text-sm font-extrabold text-white">
                  District Innovation Mission
                </span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Session Bar in Drawer */}
            {currentUser ? (
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#0c2340] text-white flex items-center justify-center text-sm font-bold shadow-2xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 line-clamp-1">{currentUser.name}</div>
                    <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">{currentUser.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logoutUser();
                    setDrawerOpen(false);
                    navigateTo('home', '/');
                  }}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-3 bg-blue-50/70 border-b border-blue-100 flex flex-col gap-2">
                <span className="text-[11px] font-semibold text-blue-900">Stakeholder Portals</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      onOpenLogin('institution');
                    }}
                    className="py-2 px-2.5 rounded-xl bg-white border border-blue-200 text-xs font-bold text-blue-900 shadow-2xs text-center cursor-pointer"
                  >
                    Institution Login
                  </button>
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      onOpenLogin('mentor');
                    }}
                    className="py-2 px-2.5 rounded-xl bg-white border border-blue-200 text-xs font-bold text-blue-900 shadow-2xs text-center cursor-pointer"
                  >
                    Mentor Login
                  </button>
                </div>
              </div>
            )}

            {/* Nav Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 text-sm font-semibold text-slate-700">
              <button
                onClick={() => navigateTo('home', '/')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Home className="w-4 h-4 text-slate-500" />
                  <span>Home</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => navigateTo('problem-statements', '/problem-statements')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Problem Statements Directory</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => navigateTo('about', '/about')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Info className="w-4 h-4 text-sky-600" />
                  <span>About Framework</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => navigateTo('faq', '/faq')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>Frequently Asked Questions</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => navigateTo('contact', '/contact')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <span>Contact District Office</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Registration Options if unauthenticated */}
              {!currentUser && (
                <div className="pt-3 mt-3 border-t border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono px-2">
                    Accreditation & Registration
                  </div>
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      onOpenRegisterInstitution();
                    }}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-sky-50 text-sky-900 text-xs font-bold hover:bg-sky-100 transition-colors"
                  >
                    <Building2 className="w-4 h-4 text-sky-600" />
                    <span>Register Engineering College</span>
                  </button>
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      onOpenRegisterMentor();
                    }}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-blue-50 text-blue-900 text-xs font-bold hover:bg-blue-100 transition-colors"
                  >
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span>Register as Industry Mentor</span>
                  </button>
                </div>
              )}

              {/* Administrative Quick Actions if Admin or Collector */}
              {(currentUser?.role === 'superadmin' || currentUser?.role === 'collector') && (
                <div className="pt-3 mt-3 border-t border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono px-2">
                    Administrative Terminal
                  </div>
                  {currentUser.role === 'superadmin' ? (
                    <button
                      onClick={() => navigateTo('admin-master', '/admin/master-control')}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-amber-50 text-amber-950 text-xs font-bold border border-amber-200"
                    >
                      <Shield className="w-4 h-4 text-amber-600" />
                      <span>Super Admin Master Control</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => navigateTo('collector-exec', '/collector/executive-view')}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-blue-50 text-blue-950 text-xs font-bold border border-blue-200"
                    >
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span>District Collector Executive</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Footer with Confidential Staff Desk Trigger */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono text-[10px]">Chengalpattu District</span>
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  onOpenStaffPortal();
                }}
                className="text-[11px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
              >
                Staff Access
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
export default MobileBottomNav;
