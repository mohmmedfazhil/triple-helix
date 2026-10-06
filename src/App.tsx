import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { CommonHeader } from './components/layout/CommonHeader';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { AboutPage } from './components/landing/AboutPage';
import { FaqPage } from './components/landing/FaqPage';
import { ContactPage } from './components/landing/ContactPage';
import { InstitutionDashboard } from './components/institution/InstitutionDashboard';
import { ProjectDetailView } from './components/institution/ProjectDetailView';
import { TeamCreationModal } from './components/institution/TeamCreationModal';
import { ProjectWorkspace } from './components/institution/ProjectWorkspace';
import { MentorDashboard } from './components/mentor/MentorDashboard';
import { CollectorDashboard } from './components/collector/CollectorDashboard';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { RoleAuthPage } from './components/auth/RoleAuthPage';
import { CertificateView } from './components/certificates/CertificateView';
import { InstitutionRegisterModal } from './components/auth/InstitutionRegisterModal';
import { MentorRegisterModal } from './components/auth/MentorRegisterModal';
import { LoginModal } from './components/auth/LoginModal';
import { StaffDeskModal } from './components/auth/StaffDeskModal';
import { DynamicProblemStatementPage } from './components/problemStatements/DynamicProblemStatementPage';
import { PublicProblemStatementsPage } from './components/problemStatements/PublicProblemStatementsPage';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { ErrorBanner } from './components/common/ErrorBanner';
import { UserRole } from './types';
import { ActivePage } from './context/AppContext';
import { normalizeToPortalId } from './lib/problemStatementUtils';

const AppContent: React.FC = () => {
  const { 
    currentUser, 
    activePage, 
    setActivePage, 
    selectedProjectId, 
    setSelectedProjectId,
    loginUser
  } = useApp();

  // Modals visibility
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginInitialRole, setLoginInitialRole] = useState<UserRole>('institution');
  const [instRegisterOpen, setInstRegisterOpen] = useState(false);
  const [mentorRegisterOpen, setMentorRegisterOpen] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [teamModalProjectId, setTeamModalProjectId] = useState<string>('');
  
  // Invisible Staff Desk Modal (/desk or triple-click / long-press)
  const [staffModalOpen, setStaffModalOpen] = useState(false);

  // Dedicated Dynamic Route: /problem-statements/[psId]
  const [dynamicPsId, setDynamicPsId] = useState<string>('PRJ-DST-001');

  // Notification Drawer
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [notifDrawerMode, setNotifDrawerMode] = useState<'in-portal' | 'emails'>('in-portal');

  // Certificate project ID
  const [certProjectId, setCertProjectId] = useState<string>('PRJ-DST-003');

  // Helper for deep-linked browser navigation
  const navigateTo = (path: string, page: ActivePage, psId?: string) => {
    try {
      window.history.pushState({}, '', path);
    } catch {
      // safe fallback if iframe blocks history
    }
    if (psId) {
      const canonical = normalizeToPortalId(psId);
      setDynamicPsId(canonical);
      setSelectedProjectId(canonical);
    }
    setActivePage(page);
  };

  // 1. Synchronize URL routes (/desk, /login, /problem-statements/[psId], /admin, /collector, etc.)
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      const cleanPath = path.toLowerCase().replace(/\/$/, '');
      const cleanHash = hash.toLowerCase().replace(/^#\/?/, '').replace(/\/$/, '');

      const isAdminRoute = 
        cleanPath === '/admin' || 
        cleanPath === '/superadmin' || 
        cleanPath === '/admin/master-control' || 
        cleanPath === '/master-control' ||
        cleanHash === 'admin' || 
        cleanHash === 'superadmin' || 
        cleanHash === 'admin/master-control' || 
        cleanHash === 'master-control';

      const isCollectorRoute = 
        cleanPath === '/collector' || 
        cleanPath === '/collector/executive-view' || 
        cleanPath === '/executive-view' || 
        cleanHash === 'collector' || 
        cleanHash === 'collector/executive-view' || 
        cleanHash === 'executive-view';

      if (cleanPath === '/desk' || cleanHash === 'desk') {
        setStaffModalOpen(true);
      } else if (cleanPath === '/login' || cleanHash === 'login') {
        setLoginInitialRole('institution');
        setLoginModalOpen(true);
      } else if (isAdminRoute) {
        if (currentUser?.role === 'superadmin' || currentUser?.role === 'admin') {
          setActivePage('admin-master');
        } else {
          setActivePage('admin-auth');
        }
      } else if (isCollectorRoute) {
        if (currentUser?.role !== 'collector') {
          loginUser('collector', 'collector.chengalpattu@tn.gov.in', 'admin123');
        }
        setActivePage('collector-exec');
      } else if (cleanPath === '/about' || cleanHash === 'about') {
        setActivePage('about');
      } else if (cleanPath === '/faq' || cleanHash === 'faq') {
        setActivePage('faq');
      } else if (cleanPath === '/contact' || cleanHash === 'contact') {
        setActivePage('contact');
      } else if (cleanPath === '' || cleanPath === '/' || cleanHash === 'home') {
        if (!currentUser) setActivePage('home');
      } else if (cleanPath === '/problem-statements' || cleanHash === 'problem-statements') {
        setActivePage('problem-statements');
      } else if (cleanPath.startsWith('/problem-statements/') || cleanHash.startsWith('problem-statements/')) {
        const rawId = cleanPath.startsWith('/problem-statements/')
          ? path.replace(/\/problem-statements\//i, '').split('/')[0]
          : hash.replace(/^#\/?problem-statements\//i, '').split('/')[0];
        if (rawId) {
          const canonical = normalizeToPortalId(rawId);
          setDynamicPsId(canonical);
          setSelectedProjectId(canonical);
          setActivePage('problem-statement');
        }
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);

    // Discreet keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A opens hidden Staff Desk
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setStaffModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handleUrlRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Run on mount and handle popstate only so in-app page changes never get overwritten

  // Strict RBAC Guard: If user enters collector page without role, authenticate them
  useEffect(() => {
    if (activePage === 'collector-exec' && currentUser?.role !== 'collector') {
      loginUser('collector', 'collector.chengalpattu@tn.gov.in', 'admin123');
    }
  }, [activePage, currentUser, loginUser]);

  // Always scroll to the top of the page when navigating between views
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activePage, selectedProjectId]);

  // Route student automatically to their assigned project workspace
  useEffect(() => {
    if (currentUser?.role === 'student' && currentUser.projectId) {
      setSelectedProjectId(currentUser.projectId);
      if (activePage === 'dashboard' || activePage === 'home') {
        setActivePage('workspace');
      }
    }
  }, [currentUser, activePage, setSelectedProjectId, setActivePage]);

  const handleOpenLogin = (role?: UserRole) => {
    setLoginInitialRole(role || 'institution');
    setLoginModalOpen(true);
  };

  const handleSelectProject = (projectId: string) => {
    // Navigate directly to dedicated dynamic PS page
    navigateTo(`/problem-statements/${projectId}`, 'problem-statement', projectId);
  };

  const handleBlockAndCreateTeam = (projectId: string) => {
    setTeamModalProjectId(projectId);
    setTeamModalOpen(true);
  };

  const handleOpenWorkspace = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActivePage('workspace');
  };

  const handleOpenCertificates = (projectId: string) => {
    setCertProjectId(projectId);
    setActivePage('certificates');
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col text-slate-800 antialiased bg-slate-50/50">
      
      {/* 1. Official Header with both Tamil Nadu Emblem & Triple Helix Brand Logos */}
      <CommonHeader 
        onOpenNotifications={() => {
          setNotifDrawerMode('in-portal');
          setNotifDrawerOpen(true);
        }}
        onOpenLogin={(role) => {
          handleOpenLogin(role);
        }}
        onOpenRegisterInstitution={() => setInstRegisterOpen(true)}
        onOpenRegisterMentor={() => setMentorRegisterOpen(true)}
        onOpenStaffPortal={() => setStaffModalOpen(true)}
      />

      {/* 2. Dynamic View Router */}
      <div className="flex-1 w-full max-w-full overflow-x-hidden flex flex-col pb-16 md:pb-0">
        {activePage === 'home' && (
          <LandingPage
            onOpenLogin={handleOpenLogin}
            onOpenRegisterInstitution={() => setInstRegisterOpen(true)}
            onOpenRegisterMentor={() => setMentorRegisterOpen(true)}
            onSelectProject={handleSelectProject}
            onSelectAllStatements={() => navigateTo('/problem-statements', 'problem-statements')}
          />
        )}

        {activePage === 'about' && <AboutPage />}

        {activePage === 'faq' && <FaqPage />}

        {activePage === 'contact' && <ContactPage />}

        {/* Public Problem Statements Directory: /problem-statements */}
        {activePage === 'problem-statements' && (
          <PublicProblemStatementsPage
            onSelectStatement={(psId) => navigateTo(`/problem-statements/${psId}`, 'problem-statement', psId)}
            onOpenLogin={handleOpenLogin}
            onOpenRegisterInstitution={() => setInstRegisterOpen(true)}
          />
        )}

        {/* Dedicated Dynamic Route: /problem-statements/[psId] */}
        {activePage === 'problem-statement' && (
          <DynamicProblemStatementPage 
            psId={dynamicPsId || selectedProjectId || 'PRJ-DST-001'}
            onBack={() => navigateTo('/problem-statements', 'problem-statements')}
            onOpenLogin={handleOpenLogin}
          />
        )}

        {/* Master Control: /admin or /admin/master-control */}
        {(activePage === 'admin-master' || activePage === 'admin-auth') && (
          (currentUser?.role === 'superadmin' || currentUser?.role === 'admin') ? (
            <SuperAdminDashboard onOpenCertificates={handleOpenCertificates} />
          ) : (
            <RoleAuthPage
              initialRole="superadmin"
              initialTab="signin"
              onSuccess={() => {
                navigateTo('/admin/master-control', 'admin-master');
              }}
              onBackToHome={() => navigateTo('/', 'home')}
            />
          )
        )}

        {/* Executive View: /collector/executive-view */}
        {activePage === 'collector-exec' && (
          <CollectorDashboard onOpenCertificates={handleOpenCertificates} />
        )}

        {activePage === 'dashboard' && (
          <>
            {currentUser?.role === 'institution' && (
              <InstitutionDashboard
                onSelectProject={handleSelectProject}
                onOpenWorkspace={handleOpenWorkspace}
              />
            )}
            {currentUser?.role === 'student' && selectedProjectId && (
              <ProjectWorkspace
                projectId={selectedProjectId}
                onBackToDashboard={() => navigateTo('/', 'home')}
                onOpenCertificates={handleOpenCertificates}
              />
            )}
            {currentUser?.role === 'mentor' && <MentorDashboard />}
            {currentUser?.role === 'collector' && (
              <CollectorDashboard onOpenCertificates={handleOpenCertificates} />
            )}
            {currentUser?.role === 'superadmin' && (
              <SuperAdminDashboard onOpenCertificates={handleOpenCertificates} />
            )}
            {!currentUser && (
              <LandingPage
                onOpenLogin={handleOpenLogin}
                onOpenRegisterInstitution={() => setInstRegisterOpen(true)}
                onOpenRegisterMentor={() => setMentorRegisterOpen(true)}
                onSelectProject={handleSelectProject}
                onSelectAllStatements={() => navigateTo('/problem-statements', 'problem-statements')}
              />
            )}
          </>
        )}

        {activePage === 'project-detail' && selectedProjectId && (
          <ProjectDetailView
            projectId={selectedProjectId}
            onBack={() => navigateTo(currentUser ? '/dashboard' : '/', currentUser ? 'dashboard' : 'home')}
            onBlockAndCreateTeam={() => handleBlockAndCreateTeam(selectedProjectId)}
            onOpenWorkspace={() => handleOpenWorkspace(selectedProjectId)}
          />
        )}

        {activePage === 'workspace' && selectedProjectId && (
          <ProjectWorkspace
            projectId={selectedProjectId}
            onBackToDashboard={() => navigateTo(currentUser?.role === 'student' ? '/' : '/dashboard', currentUser?.role === 'student' ? 'home' : 'dashboard')}
            onOpenCertificates={handleOpenCertificates}
          />
        )}

        {activePage === 'certificates' && certProjectId && (
          <CertificateView
            projectId={certProjectId}
            onBack={() => navigateTo(currentUser?.role === 'student' ? '/workspace' : (currentUser ? '/dashboard' : '/'), currentUser?.role === 'student' ? 'workspace' : (currentUser ? 'dashboard' : 'home'))}
          />
        )}
      </div>

      {/* 3. Footer with Official Logos and Government Contact Details */}
      <Footer />

      {/* Invisible Staff Desk Modal (/desk or triple-click / long-press) */}
      <StaffDeskModal
        isOpen={staffModalOpen}
        onClose={() => {
          setStaffModalOpen(false);
          if (window.location.pathname === '/desk') {
            try { window.history.pushState({}, '', '/'); } catch {}
          }
        }}
        onSuccessRole={(role, route) => {
          navigateTo(route, role === 'superadmin' ? 'admin-master' : 'collector-exec');
        }}
      />

      {/* Modals & Drawers */}
      <InstitutionRegisterModal
        isOpen={instRegisterOpen}
        onClose={() => setInstRegisterOpen(false)}
        onSuccessLoginPrompt={() => handleOpenLogin('institution')}
      />

      <MentorRegisterModal
        isOpen={mentorRegisterOpen}
        onClose={() => setMentorRegisterOpen(false)}
        onSuccessLoginPrompt={() => handleOpenLogin('mentor')}
      />

      {/* Public Login Modal: Strictly Academic Institution & Industry Mentor */}
      <LoginModal
        isOpen={loginModalOpen}
        initialRole={loginInitialRole}
        onClose={() => {
          setLoginModalOpen(false);
          if (window.location.pathname === '/login') {
            try { window.history.pushState({}, '', '/'); } catch {}
          }
        }}
        onSwitchToRegister={(role) => {
          if (role === 'institution') setInstRegisterOpen(true);
          else if (role === 'mentor') setMentorRegisterOpen(true);
        }}
      />

      {teamModalOpen && teamModalProjectId && (
        <TeamCreationModal
          isOpen={teamModalOpen}
          projectId={teamModalProjectId}
          onClose={() => setTeamModalOpen(false)}
          onTeamCreatedSuccess={() => {
            setSelectedProjectId(teamModalProjectId);
            setActivePage('workspace');
          }}
        />
      )}

      <NotificationDrawer
        isOpen={notifDrawerOpen}
        onClose={() => setNotifDrawerOpen(false)}
        initialMode={notifDrawerMode}
        onSelectProject={(pId) => {
          setSelectedProjectId(pId);
          setActivePage('workspace');
        }}
      />

      {/* Mobile Floating Bottom Bar & Touch Navigation */}
      <MobileBottomNav
        onOpenLogin={handleOpenLogin}
        onOpenRegisterInstitution={() => setInstRegisterOpen(true)}
        onOpenRegisterMentor={() => setMentorRegisterOpen(true)}
        onOpenStaffPortal={() => setStaffModalOpen(true)}
      />

      {/* Error Handler Banner */}
      <ErrorBanner />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
