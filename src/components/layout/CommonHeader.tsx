import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { TamilNaduEmblem } from '../logos/TamilNaduEmblem';
import { TripleHelixLogo } from '../logos/TripleHelixLogo';
import { 
  Bell, 
  LogOut, 
  ChevronDown, 
  Building2, 
  Briefcase, 
  ChevronLeft,
  ChevronRight,
  Home,
  Info,
  Lightbulb,
  HelpCircle,
  Mail,
  Shield,
  Landmark,
  Globe,
  Menu,
  X
} from 'lucide-react';
import { UserRole } from '../../types';

interface Props {
  onOpenNotifications?: () => void;
  onOpenLogin?: (role?: UserRole) => void;
  onOpenRegisterInstitution?: () => void;
  onOpenRegisterMentor?: () => void;
  onOpenStaffPortal?: () => void;
}

export const CommonHeader: React.FC<Props> = ({ 
  onOpenNotifications,
  onOpenLogin,
  onOpenRegisterInstitution,
  onOpenRegisterMentor,
  onOpenStaffPortal
}) => {
  const { currentUser, logoutUser, activePage, setActivePage, notifications, switchRole, loginUser } = useApp();
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const navScrollRef = useRef<HTMLDivElement>(null);

  // Invisible Staff Portal Trigger: Triple-click (desktop) or 3-second long-press (mobile)
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<any>(null);
  const longPressTimerRef = useRef<any>(null);

  const handleLogoClick = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      if (onOpenStaffPortal) {
        onOpenStaffPortal();
      }
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      if (clickCountRef.current === 1) {
        setActivePage('home');
      }
      clickCountRef.current = 0;
    }, 450);
  };

  const handleTouchStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      if (onOpenStaffPortal) {
        onOpenStaffPortal();
      }
    }, 3000); // 3-second long-press on mobile
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const scrollNav = (direction: 'left' | 'right') => {
    if (navScrollRef.current) {
      const scrollAmount = 220;
      navScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Nav tiles
  const navTiles = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5 sm:w-6 sm:h-6" />,
      isActive: activePage === 'home' && !currentUser,
      action: () => {
        try { window.history.pushState({}, '', '/'); } catch {}
        setActivePage('home');
      }
    },
    {
      id: 'about',
      label: 'About Us',
      icon: <Info className="w-5 h-5 sm:w-6 sm:h-6" />,
      isActive: activePage === 'about',
      action: () => {
        try { window.history.pushState({}, '', '/about'); } catch {}
        setActivePage('about');
      }
    },
    {
      id: 'problems',
      label: 'Problem Statements',
      icon: <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" />,
      isActive: activePage === 'problem-statements' || activePage === 'problem-statement',
      action: () => {
        try {
          window.history.pushState({}, '', '/problem-statements');
        } catch {}
        setActivePage('problem-statements');
      }
    },
    {
      id: 'institutions',
      label: 'Institutions',
      icon: <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />,
      isActive: currentUser?.role === 'institution',
      action: () => {
        if (currentUser?.role === 'institution') {
          setActivePage('dashboard');
        } else {
          onOpenLogin && onOpenLogin('institution');
        }
      }
    },
    {
      id: 'mentors',
      label: 'Industry Mentors',
      icon: <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />,
      isActive: currentUser?.role === 'mentor',
      action: () => {
        if (currentUser?.role === 'mentor') {
          setActivePage('dashboard');
        } else {
          onOpenLogin && onOpenLogin('mentor');
        }
      }
    },
    {
      id: 'faq',
      label: 'FAQ',
      icon: <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
      isActive: activePage === 'faq',
      action: () => {
        try { window.history.pushState({}, '', '/faq'); } catch {}
        setActivePage('faq');
      }
    },
    {
      id: 'contact',
      label: 'Contact Us',
      icon: <Mail className="w-5 h-5 sm:w-6 sm:h-6" />,
      isActive: activePage === 'contact',
      action: () => {
        try { window.history.pushState({}, '', '/contact'); } catch {}
        setActivePage('contact');
      }
    }
  ];

  return (
    <header className="w-full sticky top-0 z-40 shadow-md select-none bg-white">
      
      {/* 1. TOP WHITE GOVERNMENT PORTAL BRANDING BAR */}
      <div className="w-full bg-white border-b border-slate-200/90 py-2 sm:py-3.5">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-6">
          
          {/* Left: Official Government of Tamil Nadu Emblem + Bilingual Typography */}
          <div 
            onClick={handleLogoClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="flex items-center gap-1.5 sm:gap-3.5 cursor-pointer group transition-transform hover:opacity-95 shrink min-w-0"
            title="Government of Tamil Nadu · Triple Helix Platform"
          >
            {/* Logo 1: Government of Tamil Nadu Official Emblem */}
            <div className="flex items-center shrink-0">
              <TamilNaduEmblem size={44} className="w-9 h-9 xs:w-11 xs:h-11 sm:w-14 sm:h-14 transition-all" />
            </div>

            {/* Tamil Nadu Government Official Bilingual Titles */}
            <div className="flex flex-col justify-center leading-tight min-w-0">
              <span className="text-[#0a2558] font-bold text-[11px] xs:text-xs sm:text-base tracking-wide truncate">
                தமிழ்நாடு அரசு
              </span>
              <span className="text-[#0d2a63] font-extrabold text-[10px] xs:text-[11px] sm:text-sm tracking-tight truncate">
                Govt of Tamil Nadu
              </span>
              <span className="text-slate-600 font-semibold text-[8px] xs:text-[9px] sm:text-[11px] block mt-0.5 truncate">
                Chengalpattu District
              </span>
            </div>

            {/* Vertical Hairline Divider between emblems - hidden on mobile, visible from sm: */}
            <div className="hidden sm:block h-8 sm:h-11 w-px bg-slate-300 mx-1 sm:mx-2.5 shrink-0" aria-hidden="true" />

            {/* Logo 2: Triple Helix Official Logo + Slogan directly below */}
            <div className="hidden sm:flex flex-col justify-center items-start shrink-0">
              <div className="h-[28px] sm:h-[36px] lg:h-[42px] flex items-center shrink-0">
                <TripleHelixLogo height={40} className="h-[28px] sm:h-[36px] lg:h-[42px] w-auto" />
              </div>
              <span className="text-[11px] sm:text-[12px] lg:text-[13px] font-normal tracking-wide text-slate-500 whitespace-nowrap mt-0.5 leading-none">
                Innovation Platform - Connect. Collaborate. Solve.
              </span>
            </div>
          </div>

          {/* Right Section: Session or Public Login */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-3">
                {/* Notification Bell */}
                {onOpenNotifications && (
                  <button
                    onClick={onOpenNotifications}
                    className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                    title="Notifications"
                    aria-label="View notifications"
                  >
                    <Bell className="w-5 h-5 text-sky-600" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                )}

                {/* Logged in User Badge */}
                <div 
                  onClick={() => {
                    if (currentUser.role === 'superadmin') setActivePage('admin-master');
                    else if (currentUser.role === 'collector') setActivePage('collector-exec');
                    else if (currentUser.role === 'student') setActivePage('workspace');
                    else setActivePage('dashboard');
                  }}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors min-h-[40px]"
                >
                  <div className="w-7 h-7 rounded-full bg-[#0d2a63] text-white flex items-center justify-center text-xs font-bold shadow-2xs shrink-0">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-xs font-bold text-slate-800 leading-none">
                      {currentUser.name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider leading-none mt-1">
                      {currentUser.role}
                    </div>
                  </div>
                </div>

                {/* Logout Button with Confirmation Trigger */}
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>

                {/* Mobile Menu Toggle Button */}
                <button
                  onClick={() => setMobileDrawerOpen(true)}
                  className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors md:hidden min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer border border-slate-200"
                  aria-label="Open Navigation Menu"
                >
                  <Menu className="w-5 h-5 text-slate-800" />
                </button>
              </div>
            ) : (
              /* Public Login Button with Stakeholder Selection + Mobile Menu Button */
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="relative">
                  <button
                    onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                    className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#0c2340] hover:bg-[#07172b] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer whitespace-nowrap min-h-[38px]"
                  >
                    <span>Login</span>
                    <ChevronDown className="w-3.5 h-3.5 text-blue-200" />
                  </button>

                {authDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setAuthDropdownOpen(false)} 
                    />
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block font-mono">
                          Select Stakeholder Portal
                        </span>
                      </div>

                      {/* Choice 1: Academic Institution */}
                      <div className="p-1.5 border-b border-slate-100">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900 px-2 py-1">
                          <span className="flex items-center gap-1.5 text-sky-900">
                            <Building2 className="w-4 h-4 text-sky-600" />
                            Academic Institution
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 mt-1">
                          <button
                            onClick={() => {
                              setAuthDropdownOpen(false);
                              onOpenLogin && onOpenLogin('institution');
                            }}
                            className="text-xs text-center py-2 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg font-bold transition-colors cursor-pointer"
                          >
                            Login
                          </button>
                          <button
                            onClick={() => {
                              setAuthDropdownOpen(false);
                              onOpenRegisterInstitution && onOpenRegisterInstitution();
                            }}
                            className="text-xs text-center py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-bold transition-colors cursor-pointer"
                          >
                            Register
                          </button>
                        </div>
                      </div>

                      {/* Choice 2: Industry Mentor */}
                      <div className="p-1.5 border-b border-slate-100">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900 px-2 py-1">
                          <span className="flex items-center gap-1.5 text-blue-900">
                            <Briefcase className="w-4 h-4 text-blue-600" />
                            Industry Mentor
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 mt-1">
                          <button
                            onClick={() => {
                              setAuthDropdownOpen(false);
                              onOpenLogin && onOpenLogin('mentor');
                            }}
                            className="text-xs text-center py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold transition-colors cursor-pointer"
                          >
                            Login
                          </button>
                          <button
                            onClick={() => {
                              setAuthDropdownOpen(false);
                              onOpenRegisterMentor && onOpenRegisterMentor();
                            }}
                            className="text-xs text-center py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-bold transition-colors cursor-pointer"
                          >
                            Register
                          </button>
                        </div>
                      </div>

                      {/* Choice 3: District Administration / Admin Portal */}
                      <div className="p-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900 px-2 py-1">
                          <span className="flex items-center gap-1.5 text-slate-900">
                            <Shield className="w-4 h-4 text-indigo-600" />
                            District Administration
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 mt-1">
                          <button
                            onClick={() => {
                              setAuthDropdownOpen(false);
                              try { window.history.pushState({}, '', '/admin'); } catch {}
                              setActivePage('admin-auth');
                            }}
                            className="text-xs text-center py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-bold transition-colors cursor-pointer"
                          >
                            Sign In
                          </button>
                          <button
                            onClick={() => {
                              setAuthDropdownOpen(false);
                              try { window.history.pushState({}, '', '/admin'); } catch {}
                              setActivePage('admin-auth');
                            }}
                            className="text-xs text-center py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-bold transition-colors cursor-pointer"
                          >
                            Register
                          </button>
                        </div>
                      </div>

                    </div>
                  </>
                )}
              </div>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors md:hidden min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer border border-slate-200"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5 text-slate-800" />
              </button>
            </div>
          )}
          </div>

        </div>
      </div>

      {/* 2. LOWER GOVERNMENT ADMINISTRATIVE OR PUBLIC NAV RIBBON */}
      {(currentUser?.role === 'superadmin' || currentUser?.role === 'collector') ? (
        <div className="w-full bg-[#081730] border-t border-blue-900/60 py-2 sm:py-2.5 px-3 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div className="flex items-center gap-2">
                <span className="text-white text-xs font-extrabold tracking-wide uppercase font-mono">
                  {currentUser.role === 'superadmin' ? 'Super Admin Master Control' : 'District Collector Executive Terminal'}
                </span>
                <span className="text-blue-300 text-[11px] hidden md:inline">
                  · Official Administrative Console · Chengalpattu
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {activePage === 'home' || activePage === 'about' || activePage === 'faq' || activePage === 'contact' || activePage === 'problem-statements' || activePage === 'problem-statement' ? (
                <button
                  onClick={() => {
                    if (currentUser.role === 'superadmin') {
                      try { window.history.pushState({}, '', '/admin/master-control'); } catch {}
                      setActivePage('admin-master');
                    } else {
                      try { window.history.pushState({}, '', '/collector/executive-view'); } catch {}
                      setActivePage('collector-exec');
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-xs cursor-pointer min-h-[36px]"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-900" />
                  <span>Return to Admin Console</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    try { window.history.pushState({}, '', '/'); } catch {}
                    setActivePage('home');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-800/80 hover:bg-blue-700 text-white border border-blue-600/50 text-xs font-semibold transition-all shadow-xs cursor-pointer min-h-[36px]"
                  title="View Public Website as a visitor"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-300" />
                  <span>Navigate to Website</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Nav Ribbon: Smooth Touch Scroller (Visible on all devices and screen sizes) */
        <div className="w-full bg-[#0c1f3f] border-t border-[#183669] py-1.5 sm:py-2.5 px-1.5 sm:px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 sm:gap-2">
            
            {/* Left Arrow Button */}
            <button
              onClick={() => scrollNav('left')}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer border border-white/10"
              title="Scroll left"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Horizontal Scrollable Card Tiles Container */}
            <div 
              ref={navScrollRef}
              className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto scrollbar-none py-1 px-0.5 sm:px-1 scroll-smooth touch-pan-x"
            >
              {navTiles.map((tile) => {
                const active = tile.isActive;

                return (
                  <button
                    key={tile.id}
                    onClick={tile.action}
                    className={`shrink-0 w-18 xs:w-20 sm:w-26 h-14 xs:h-16 sm:h-20 rounded-xl flex flex-col items-center justify-center p-1 sm:p-2 text-center transition-all cursor-pointer select-none ${
                      active
                        ? 'bg-[#f5b82e] text-slate-950 font-extrabold shadow-md ring-2 ring-amber-300 scale-102'
                        : 'bg-white hover:bg-slate-100 text-slate-800 font-bold shadow-xs hover:shadow-sm hover:scale-101'
                    }`}
                  >
                    <div className={`mb-0.5 sm:mb-1 transition-transform ${active ? 'text-slate-950 scale-110' : 'text-slate-700'}`}>
                      {tile.icon}
                    </div>
                    <span className="text-[9px] sm:text-[11px] leading-tight line-clamp-1 sm:line-clamp-2">
                      {tile.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Arrow Button */}
            <button
              onClick={() => scrollNav('right')}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer border border-white/10"
              title="Scroll right"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

          </div>
        </div>
      )}

      {/* 3. Slide-Over Mobile Navigation Drawer (Activated by hamburger icon on < md screens) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <TamilNaduEmblem size={34} className="w-8 h-8 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-[#0a2558]">தமிழ்நாடு அரசு</div>
                  <div className="text-[10px] font-extrabold text-[#0d2a63]">Govt of Tamil Nadu · Chengalpattu District</div>
                  <div className="text-[9px] text-slate-500 font-normal tracking-wide mt-0.5">
                    Innovation Platform - Connect. Collaborate. Solve.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User status card if logged in */}
            {currentUser && (
              <div className="p-4 border-b border-slate-100 bg-sky-50/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0d2a63] text-white flex items-center justify-center text-sm font-bold shadow-xs shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                    {currentUser.role}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 font-mono">
                Platform Navigation
              </div>

              {navTiles.map((tile) => (
                <button
                  key={tile.id}
                  onClick={() => {
                    tile.action();
                    setMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                    tile.isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="shrink-0">{tile.icon}</span>
                  <span>{tile.label}</span>
                </button>
              ))}

              <div className="pt-3 border-t border-slate-100 my-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 font-mono">
                  Portals & Stakeholders
                </div>

                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onOpenLogin && onOpenLogin('institution');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 text-left"
                >
                  <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Academic Institution Portal</span>
                </button>

                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onOpenLogin && onOpenLogin('mentor');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 text-left"
                >
                  <Briefcase className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Industry Mentor Portal</span>
                </button>

                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onOpenRegisterInstitution && onOpenRegisterInstitution();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-sky-700 hover:bg-sky-50 text-left"
                >
                  <span>🎓 Register Your Institution</span>
                </button>

                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onOpenRegisterMentor && onOpenRegisterMentor();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-emerald-700 hover:bg-emerald-50 text-left"
                >
                  <span>💼 Register as Mentor</span>
                </button>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
              {currentUser ? (
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Portal</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onOpenLogin && onOpenLogin('institution');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0c2340] hover:bg-[#07172b] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <span>Stakeholder Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Confirm Sign Out</h3>
                <p className="text-xs text-slate-500">Are you sure you want to end your session?</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
              You will be signed out from <strong>{currentUser?.name || 'Authorized Session'}</strong> and returned to the public homepage.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logoutUser();
                  setActivePage('home');
                  try { window.history.pushState({}, '', '/'); } catch {}
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-xs"
              >
                Confirm Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};

export default CommonHeader;
