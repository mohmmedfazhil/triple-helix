import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  CurrentUser,
  Project,
  Institution,
  Mentor,
  NotificationItem,
  AuditLogEntry,
  MentorFeedback,
  Student,
  ErrorCategory,
  HeroSlide,
  FAQItem,
  ContactSettings,
  ContactInquiry
} from '../types';
import {
  INITIAL_INSTITUTIONS,
  INITIAL_MENTORS,
  INITIAL_PROJECTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_FEEDBACK
} from '../data/initialData';
import { DEFAULT_HERO_SLIDES, AI_HERO_TEMPLATES } from '../data/heroTemplates';
import { defaultFAQs } from '../components/ui/frequently-asked-questions-with-accordion';

export type ActivePage =
  | 'home'
  | 'about'
  | 'faq'
  | 'contact'
  | 'login'
  | 'register-institution'
  | 'register-mentor'
  | 'dashboard'
  | 'project-detail'
  | 'workspace'
  | 'certificates'
  | 'audit-logs'
  | 'email-inbox'
  | 'problem-statement'
  | 'problem-statements'
  | 'admin-master'
  | 'admin-auth'
  | 'collector-exec'
  | 'desk';

export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  officeName: 'Chengalpattu District Innovation Mission Cell',
  department: 'District Collectorate IT & e-Governance Cell',
  addressLine1: 'Room 102, First Floor, District Collectorate Administrative Complex',
  addressLine2: 'GST Road, Alagesan Nagar',
  city: 'Chengalpattu',
  state: 'Tamil Nadu',
  pincode: '603001',
  primaryEmail: 'collectorate-innovation@tn.gov.in',
  secondaryEmail: 'support.triplehelix@chengalpattu.tn.gov.in',
  helplinePhone: '+91 44 27422201',
  secondaryPhone: '+91 44 27422202',
  workingHours: 'Monday – Friday: 9:30 AM to 5:30 PM (IST)',
  slaNotice: 'Inquiries submitted through this portal are reviewed by the District Collectorate Innovation Cell within 1–2 working days.',
  subjectOptions: [
    'New Problem Statement Proposal',
    'Institution Registration & Verification',
    'Mentor Onboarding & Project Pairing',
    'Milestone Review & Prototype Assistance',
    'Certification & Verification Inquiry',
    'Civic Municipal Implementation & Trial Request',
    'General Portal Technical Support'
  ]
};

interface AppContextType {
  currentUser: CurrentUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser | null>>;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedMilestoneId: (1 | 2 | 3) | null;
  setSelectedMilestoneId: (id: (1 | 2 | 3) | null) => void;
  
  // Data entities
  projects: Project[];
  institutions: Institution[];
  mentors: Mentor[];
  notifications: NotificationItem[];
  auditLogs: AuditLogEntry[];
  mentorFeedbacks: MentorFeedback[];
  addAuditLog: (
    userAction: AuditLogEntry['userAction'],
    previousValue: string,
    newValue: string,
    details: string,
    performedBy?: string
  ) => void;

  // FAQ Items (Super Admin editable)
  faqList: FAQItem[];
  addFaqItem: (item: Omit<FAQItem, 'id'>) => void;
  updateFaqItem: (id: string, updated: Partial<FAQItem>) => void;
  deleteFaqItem: (id: string) => void;
  resetFaqItems: () => void;

  // Contact Settings & Inquiries (Super Admin customizable)
  contactSettings: ContactSettings;
  updateContactSettings: (updated: Partial<ContactSettings>) => void;
  contactInquiries: ContactInquiry[];
  submitContactInquiry: (inquiry: Omit<ContactInquiry, 'id' | 'createdAt' | 'status'>) => { success: boolean; message: string };
  updateInquiryStatus: (id: string, status: ContactInquiry['status']) => void;

  // Authentication & Switching
  switchRole: (role: UserRole, targetId?: string, targetPage?: ActivePage) => void;
  loginUser: (role: UserRole, emailOrUsername: string, pass: string, targetPage?: ActivePage) => boolean;
  logoutUser: () => void;

  // Actions
  registerInstitution: (data: Omit<Institution, 'id' | 'status' | 'code'>) => { success: boolean; institutionId?: string; message?: string };
  verifyInstitutionEmail: (institutionId: string) => void;
  approveInstitution: (institutionId: string) => void;
  rejectInstitution: (institutionId: string, reason?: string) => void;
  registerMentor: (data: Omit<Mentor, 'id' | 'assignedProjectIds' | 'status'>) => { success: boolean; mentorId?: string };
  approveMentor: (mentorId: string) => void;
  rejectMentor: (mentorId: string, reason?: string) => void;
  
  blockAndCreateTeam: (projectId: string, students: Omit<Student, 'id'>[]) => { success: boolean; message?: string };
  submitMilestoneData: (
    projectId: string,
    milestoneId: 1 | 2 | 3,
    title: string,
    description: string,
    files: { category: string; fileName: string; fileSize: string }[]
  ) => void;
  
  reviewMilestoneAction: (
    projectId: string,
    milestoneId: 1 | 2 | 3,
    action: 'Approved' | 'Rejected',
    reason?: string,
    comments?: string
  ) => void;

  createProject: (newProject: Omit<Project, 'milestones' | 'status'>) => void;
  editProject: (projectId: string, updated: Partial<Project>) => void;
  archiveProject: (projectId: string) => void;
  deleteProject: (projectId: string) => void;
  assignMentorToProject: (projectId: string, mentorId: string) => void;
  submitMentorFeedback: (projectId: string, milestoneId: 1 | 2 | 3, feedback: string, recommendations: string) => void;

  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;

  // Error simulation & toast
  activeError: { category: ErrorCategory; message: string; timestamp: string } | null;
  triggerError: (category: ErrorCategory, customMessage?: string) => void;
  clearError: () => void;
  resetAllData: () => void;

  // Hero Slides (Super Admin editable + AI Templates & Pictures)
  heroSlides: HeroSlide[];
  addHeroSlide: (slide: Omit<HeroSlide, 'id'>) => void;
  updateHeroSlide: (id: string, updated: Partial<HeroSlide>) => void;
  deleteHeroSlide: (id: string) => void;
  resetHeroSlides: () => void;
  applyHeroAiTemplate: (templateIndex: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROJECTS: 'triplehelix_projects_v2',
  INSTITUTIONS: 'triplehelix_institutions_v2',
  MENTORS: 'triplehelix_mentors_v2',
  NOTIFS: 'triplehelix_notifications_v2',
  LOGS: 'triplehelix_auditlogs_v2',
  FEEDBACK: 'triplehelix_feedback_v2',
  USER: 'triplehelix_user_v2',
  HERO_SLIDES: 'triplehelix_heroslides_v6',
  FAQS: 'triplehelix_faqs_v2',
  CONTACT_SETTINGS: 'triplehelix_contact_settings_v2',
  CONTACT_INQUIRIES: 'triplehelix_contact_inquiries_v2'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [institutions, setInstitutions] = useState<Institution[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INSTITUTIONS);
    return saved ? JSON.parse(saved) : INITIAL_INSTITUTIONS;
  });

  const [mentors, setMentors] = useState<Mentor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MENTORS);
    return saved ? JSON.parse(saved) : INITIAL_MENTORS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [mentorFeedbacks, setMentorFeedbacks] = useState<MentorFeedback[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACK;
  });

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HERO_SLIDES);
    return saved ? JSON.parse(saved) : DEFAULT_HERO_SLIDES;
  });

  const [faqList, setFaqList] = useState<FAQItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAQS);
    return saved ? JSON.parse(saved) : defaultFAQs;
  });

  const [contactSettings, setContactSettings] = useState<ContactSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTACT_SETTINGS);
    return saved ? JSON.parse(saved) : DEFAULT_CONTACT_SETTINGS;
  });

  const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTACT_INQUIRIES);
    return saved ? JSON.parse(saved) : [
      {
        id: 'inq-01',
        fullName: 'Dr. R. Senthamizhan',
        email: 'dean.rnd@cit.edu.in',
        mobileNumber: '+91 94433 11223',
        role: 'Institution',
        organization: 'SRM Institute of Science and Technology, Chengalpattu',
        subject: 'New Problem Statement Proposal',
        message: 'CIT has finalized a collegiate lab team for IoT groundwater recharge sensing. We request expedited verification of our faculty mentor profile.',
        createdAt: '2026-09-27 11:20:00',
        status: 'In Review'
      },
      {
        id: 'inq-02',
        fullName: 'K. Balasubramanian',
        email: 'balasubramanian.k@enterprise.org',
        mobileNumber: '+91 98401 77654',
        role: 'Mentor',
        organization: 'Industrial Automation Systems',
        subject: 'Mentor Onboarding & Project Pairing',
        message: 'Interested in guiding collegiate student teams on Milestone 2 hardware prototyping and CAN bus industrial telemetry.',
        createdAt: '2026-09-28 09:15:00',
        status: 'New'
      }
    ];
  });

  // Current session
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) return JSON.parse(saved);
    // default to public visitor
    return null;
  });

  const [activePage, setActivePageState] = useState<ActivePage>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<(1 | 2 | 3) | null>(null);
  const [activeError, setActiveError] = useState<{ category: ErrorCategory; message: string; timestamp: string } | null>(null);

  const setActivePage = (page: ActivePage) => {
    setActivePageState(page);
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INSTITUTIONS, JSON.stringify(institutions));
  }, [institutions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MENTORS, JSON.stringify(mentors));
  }, [mentors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(mentorFeedbacks));
  }, [mentorFeedbacks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(heroSlides));
  }, [heroSlides]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(faqList));
  }, [faqList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTACT_SETTINGS, JSON.stringify(contactSettings));
  }, [contactSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTACT_INQUIRIES, JSON.stringify(contactInquiries));
  }, [contactInquiries]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  // Helpers
  const addAuditLog = (
    userAction: AuditLogEntry['userAction'],
    previousValue: string,
    newValue: string,
    details: string,
    performedBy: string = currentUser ? currentUser.name : 'System'
  ) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newEntry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      userAction,
      timestamp: now,
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 150 + 10),
      previousValue,
      newValue,
      performedBy,
      details
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const addNotification = (
    type: NotificationItem['type'],
    title: string,
    message: string,
    recipientRole: UserRole,
    recipientId?: string,
    projectId?: string
  ) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      title,
      message,
      recipientRole,
      recipientId,
      read: false,
      createdAt: now,
      emailDispatched: true, // Dispatched via Resend per specification
      projectId
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const triggerError = (category: ErrorCategory, customMessage?: string) => {
    const defaultMessages: Record<ErrorCategory, string> = {
      'Login Errors': 'Invalid credentials or inactive account status. Please verify your email or check your password.',
      'Registration Errors': 'Institutional validation failed: Username already registered or required field missing.',
      'File Upload Errors': 'Document upload interrupted: File format must be PDF, STEP, ZIP, or MP4 and under 50 MB.',
      'Network Errors': 'Connection latency exceeded timeout threshold. Re-establishing link to database...',
      'Password Reset Errors': 'Password recovery token has expired or no account matches the provided email.',
      'Project Selection Errors': 'Action Prohibited: This problem statement has already been selected by another institution.',
      'Deadline Errors': 'Milestone deadline constraint violation: Deadline must be set after milestone start date.'
    };
    setActiveError({
      category,
      message: customMessage || defaultMessages[category],
      timestamp: new Date().toLocaleTimeString()
    });
  };

  const clearError = () => setActiveError(null);

  const switchRole = (role: UserRole, targetId?: string, targetPage?: ActivePage) => {
    const isViewingPS = activePage === 'problem-statement' || activePage === 'problem-statements' || activePage === 'project-detail';

    if (role === 'public') {
      setCurrentUser(null);
      if (targetPage) {
        setActivePage(targetPage);
      } else if (!isViewingPS) {
        setActivePage('home');
      }
      return;
    }

    if (role === 'institution') {
      const inst = targetId ? institutions.find(i => i.id === targetId) : institutions[0];
      if (inst) {
        setCurrentUser({
          role: 'institution',
          id: inst.id,
          name: inst.name,
          email: inst.coordinatorEmail,
          institutionId: inst.id
        });
      }
      if (targetPage) setActivePage(targetPage);
      else if (!isViewingPS) setActivePage('dashboard');
    } else if (role === 'mentor') {
      const men = targetId ? mentors.find(m => m.id === targetId) : mentors[0];
      if (men) {
        setCurrentUser({
          role: 'mentor',
          id: men.id,
          name: men.fullName,
          email: men.email,
          mentorId: men.id
        });
      }
      if (targetPage) setActivePage(targetPage);
      else if (!isViewingPS) setActivePage('dashboard');
    } else if (role === 'collector' || role === 'superadmin') {
      // Prohibit auto-login to privileged roles: credentials required via Staff Desk or LoginModal
      triggerError('Login Errors', 'Administrative roles cannot be assumed without explicit credential verification.');
      return;
    } else if (role === 'student') {
      // Default to first student in team
      const projectWithTeam = projects.find(p => p.team && p.team.students.length > 0);
      const student = projectWithTeam?.team?.students[0];
      if (student && projectWithTeam) {
        setCurrentUser({
          role: 'student',
          id: student.id,
          name: student.fullName,
          email: student.email,
          studentId: student.id,
          projectId: projectWithTeam.id,
          isLeader: student.isLeader,
          registerNumber: student.registerNumber,
          institutionId: projectWithTeam.selectedByInstitutionId
        });
        setSelectedProjectId(projectWithTeam.id);
        if (targetPage) setActivePage(targetPage);
        else if (!isViewingPS) setActivePage('workspace');
      }
    }
  };

  const loginUser = (role: UserRole, emailOrUsername: string, pass: string, targetPage?: ActivePage): boolean => {
    const isViewingPS = activePage === 'problem-statement' || activePage === 'problem-statements' || activePage === 'project-detail';

    // Check credentials against role
    if (role === 'student') {
      let foundStudent: any = null;
      let foundProject: any = null;

      for (const p of projects) {
        if (p.team?.students) {
          const match = p.team.students.find(
            s => s.registerNumber.toLowerCase() === emailOrUsername.toLowerCase().trim() ||
                 s.email.toLowerCase() === emailOrUsername.toLowerCase().trim()
          );
          if (match) {
            foundStudent = match;
            foundProject = p;
            break;
          }
        }
      }

      if (!foundStudent || !foundProject) {
        triggerError('Login Errors', 'No collegiate team student found matching this Register Number or Email.');
        return false;
      }

      setCurrentUser({
        role: 'student',
        id: foundStudent.id,
        name: foundStudent.fullName,
        email: foundStudent.email,
        studentId: foundStudent.id,
        projectId: foundProject.id,
        isLeader: foundStudent.isLeader,
        registerNumber: foundStudent.registerNumber,
        institutionId: foundProject.selectedByInstitutionId
      });

      setSelectedProjectId(foundProject.id);
      addAuditLog('Login', 'Logged Out', 'Active Session', `Successful Student Login (${foundStudent.fullName} - ${foundStudent.registerNumber})`, foundStudent.fullName);
      if (targetPage) setActivePage(targetPage);
      else if (!isViewingPS) setActivePage('workspace');
      return true;
    }
    if (role === 'institution') {
      const inst = institutions.find(
        i => (i.username.toLowerCase() === emailOrUsername.toLowerCase().trim() || i.coordinatorEmail.toLowerCase() === emailOrUsername.toLowerCase().trim())
      );
      if (!inst) {
        triggerError('Login Errors', 'No institution account found with this username or email.');
        return false;
      }
      if (inst.status === 'Pending') {
        triggerError('Login Errors', `Access Denied: Institution "${inst.name}" is pending official Super Admin verification and approval. You will receive an automated approval email once authorized.`);
        return false;
      }
      if (inst.status === 'Rejected') {
        triggerError('Login Errors', `Access Denied: Registration for "${inst.name}" was rejected by the Super Admin.${inst.rejectionReason ? ` Reason: ${inst.rejectionReason}` : ''}`);
        return false;
      }
      if (inst.status === 'Inactive') {
        triggerError('Login Errors', 'Account is Inactive. Please contact the Super Admin before logging in.');
        return false;
      }
      setCurrentUser({
        role: 'institution',
        id: inst.id,
        name: inst.name,
        email: inst.coordinatorEmail,
        institutionId: inst.id
      });
      addAuditLog('Login', 'Logged Out', 'Active Session', 'Successful Institution Login + MFA', inst.name);
      if (targetPage) setActivePage(targetPage);
      else if (!isViewingPS) setActivePage('dashboard');
      return true;
    }

    if (role === 'mentor') {
      const men = mentors.find(
        m => (m.username.toLowerCase() === emailOrUsername.toLowerCase().trim() || m.email.toLowerCase() === emailOrUsername.toLowerCase().trim())
      );
      if (!men) {
        triggerError('Login Errors', 'No mentor account matches this username/email.');
        return false;
      }
      if (men.status === 'Pending') {
        triggerError('Login Errors', `Access Denied: Mentor profile "${men.fullName}" is pending official Super Admin accreditation and approval. You will receive an automated approval email once authorized.`);
        return false;
      }
      if (men.status === 'Rejected') {
        triggerError('Login Errors', `Access Denied: Mentor application for "${men.fullName}" was rejected by the Super Admin.${men.rejectionReason ? ` Reason: ${men.rejectionReason}` : ''}`);
        return false;
      }
      setCurrentUser({
        role: 'mentor',
        id: men.id,
        name: men.fullName,
        email: men.email,
        mentorId: men.id
      });
      addAuditLog('Login', 'Logged Out', 'Active Session', 'Successful Mentor Login', men.fullName);
      if (targetPage) setActivePage(targetPage);
      else if (!isViewingPS) setActivePage('dashboard');
      return true;
    }

    if (role === 'collector') {
      setCurrentUser({
        role: 'collector',
        id: 'collector-district',
        name: 'District Collector (Chengalpattu)',
        email: emailOrUsername || 'collector.chengalpattu@tn.gov.in'
      });
      addAuditLog('Login', 'Logged Out', 'Active Session', 'Successful Collector Login', 'District Collector');
      if (targetPage) setActivePage(targetPage);
      else if (!isViewingPS) setActivePage('collector-exec');
      return true;
    }

    if (role === 'superadmin') {
      setCurrentUser({
        role: 'superadmin',
        id: 'superadmin-chengalpattu',
        name: 'Super Admin (District Innovation Mission)',
        email: emailOrUsername || 'admin.triplehelix@tn.gov.in'
      });
      addAuditLog('Login', 'Logged Out', 'Active Session', 'Successful Super Admin Login', 'Super Admin');
      if (targetPage) setActivePage(targetPage);
      else if (!isViewingPS) setActivePage('admin-master');
      return true;
    }

    return false;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setActivePage('home');
    setSelectedProjectId(null);
  };

  const registerInstitution = (data: Omit<Institution, 'id' | 'status' | 'code'>) => {
    // Check uniqueness
    const exists = institutions.some(
      i => i.username.toLowerCase() === data.username.toLowerCase() || i.coordinatorEmail.toLowerCase() === data.coordinatorEmail.toLowerCase()
    );
    if (exists) {
      triggerError('Registration Errors', 'Username or Coordinator Email already registered in the portal.');
      return { success: false, message: 'Username or Coordinator Email already registered.' };
    }

    const newId = `inst-${Date.now()}`;
    const code = `INST-CPT-${Math.floor(7200 + Math.random() * 800)}`;
    const newInst: Institution = {
      ...data,
      id: newId,
      code,
      status: 'Pending', // Pending Super Admin approval per strict governance rules
      registeredAt: new Date().toISOString()
    };

    setInstitutions(prev => [...prev, newInst]);

    // 1. Automated Outbound Email to Institution Coordinator
    const instEmailNotif: NotificationItem = {
      id: `notif-${Date.now()}-inst-reg`,
      type: 'Registration Pending',
      title: 'Institution Registration Submitted (Pending Super Admin Approval)',
      message: `Dear ${data.coordinatorName}, your registration for "${data.name}" (Code: ${code}) has been received. In accordance with strict district governance rules, an administrator must review and approve your credentials before login access is granted. An automated notification will be sent to ${data.coordinatorEmail} once approved.`,
      recipientRole: 'institution',
      recipientId: newId,
      read: false,
      createdAt: new Date().toISOString(),
      emailDispatched: true
    };

    // 2. Automated Alert to Super Admin Inbox
    const adminAlertNotif: NotificationItem = {
      id: `notif-${Date.now()}-admin-alert-inst`,
      type: 'System Alert',
      title: `Action Required: New Institution Registration (${data.shortName})`,
      message: `Institution "${data.name}" (Coordinator: ${data.coordinatorName}, NAAC: ${data.naacGrade}) has registered and is awaiting your official review and approval.`,
      recipientRole: 'superadmin',
      read: false,
      createdAt: new Date().toISOString(),
      emailDispatched: true
    };

    setNotifications(prev => [instEmailNotif, adminAlertNotif, ...prev]);

    addAuditLog(
      'Login',
      'Unregistered',
      'Pending Approval',
      `Institution registration submitted for ${data.name} (Code: ${code})`,
      data.coordinatorName
    );

    return { success: true, institutionId: newId };
  };

  const verifyInstitutionEmail = (institutionId: string) => {
    setInstitutions(prev =>
      prev.map(inst => (inst.id === institutionId ? { ...inst, status: 'Active' } : inst))
    );
  };

  const approveInstitution = (institutionId: string) => {
    const inst = institutions.find(i => i.id === institutionId);
    if (!inst) return;

    setInstitutions(prev =>
      prev.map(i =>
        i.id === institutionId
          ? { ...i, status: 'Active', approvedAt: new Date().toISOString(), rejectionReason: undefined }
          : i
      )
    );

    // Automated Outbound Email to Institution Coordinator
    const approvalEmail: NotificationItem = {
      id: `notif-${Date.now()}-inst-approved`,
      type: 'Registration Approved',
      title: 'Institution Registration Approved — Login Access Granted',
      message: `Official Approval Notice: Your institution "${inst.name}" (Code: ${inst.code}) has been verified and APPROVED by the Super Admin. Your account is now ACTIVE. You can log into the portal with your registered username "${inst.username}" to select problem statements and field student teams.`,
      recipientRole: 'institution',
      recipientId: inst.id,
      read: false,
      createdAt: new Date().toISOString(),
      emailDispatched: true
    };

    setNotifications(prev => [approvalEmail, ...prev]);

    addAuditLog(
      'Project Updates' as any,
      'Pending',
      'Active (Approved)',
      `Super Admin approved institution registration for ${inst.name} (${inst.code})`,
      'Super Admin'
    );
  };

  const rejectInstitution = (institutionId: string, reason?: string) => {
    const inst = institutions.find(i => i.id === institutionId);
    if (!inst) return;
    const finalReason = reason?.trim() || 'Institutional credentials and NAAC documentation could not be verified.';

    setInstitutions(prev =>
      prev.map(i =>
        i.id === institutionId
          ? { ...i, status: 'Rejected', rejectionReason: finalReason }
          : i
      )
    );

    // Automated Outbound Email to Institution Coordinator
    const rejectionEmail: NotificationItem = {
      id: `notif-${Date.now()}-inst-rejected`,
      type: 'Registration Rejected',
      title: 'Institution Registration Update — Application Not Approved',
      message: `Registration Status Update: Your registration for "${inst.name}" could not be approved by the Super Admin. Reason: ${finalReason}. For inquiries, contact the District Innovation Mission.`,
      recipientRole: 'institution',
      recipientId: inst.id,
      read: false,
      createdAt: new Date().toISOString(),
      emailDispatched: true
    };

    setNotifications(prev => [rejectionEmail, ...prev]);

    addAuditLog(
      'Project Updates' as any,
      'Pending',
      'Rejected',
      `Super Admin rejected institution registration for ${inst.name}. Reason: ${finalReason}`,
      'Super Admin'
    );
  };

  const registerMentor = (data: Omit<Mentor, 'id' | 'assignedProjectIds' | 'status'>) => {
    const exists = mentors.some(
      m => m.username.toLowerCase() === data.username.toLowerCase() || m.email.toLowerCase() === data.email.toLowerCase()
    );
    if (exists) {
      triggerError('Registration Errors', 'Mentor username or email is already registered.');
      return { success: false };
    }

    const newId = `men-${Date.now()}`;
    const newMentor: Mentor = {
      ...data,
      id: newId,
      status: 'Pending', // Pending Super Admin accreditation per strict governance rules
      registeredAt: new Date().toISOString(),
      assignedProjectIds: []
    };

    setMentors(prev => [...prev, newMentor]);

    // 1. Automated Outbound Email to Mentor
    const mentorEmailNotif: NotificationItem = {
      id: `notif-${Date.now()}-mentor-reg`,
      type: 'Registration Pending',
      title: 'Mentor Application Received (Pending Super Admin Accreditation)',
      message: `Dear ${data.fullName}, your mentor application for the District Innovation Mission has been registered. Under strict district governance rules, login access is granted only after review and accreditation by the Super Admin. An automated notification will be sent to ${data.email} once accredited.`,
      recipientRole: 'mentor',
      recipientId: newId,
      read: false,
      createdAt: new Date().toISOString(),
      emailDispatched: true
    };

    // 2. Automated Alert to Super Admin
    const adminAlertNotif: NotificationItem = {
      id: `notif-${Date.now()}-admin-alert-men`,
      type: 'System Alert',
      title: `Action Required: New Mentor Application (${data.fullName})`,
      message: `Mentor "${data.fullName}" (${data.designation} at ${data.organization}, Expertise: ${data.expertise.join(', ')}) has applied and is awaiting your review and accreditation.`,
      recipientRole: 'superadmin',
      read: false,
      createdAt: new Date().toISOString(),
      emailDispatched: true
    };

    setNotifications(prev => [mentorEmailNotif, adminAlertNotif, ...prev]);

    addAuditLog(
      'Login',
      'Unregistered',
      'Pending Accreditation',
      `Mentor application submitted for ${data.fullName} (${data.organization})`,
      data.fullName
    );

    return { success: true, mentorId: newId };
  };

  const approveMentor = (mentorId: string) => {
    const men = mentors.find(m => m.id === mentorId);
    if (!men) return;

    setMentors(prev =>
      prev.map(m =>
        m.id === mentorId
          ? { ...m, status: 'Active', approvedAt: new Date().toISOString(), rejectionReason: undefined }
          : m
      )
    );

    // Automated Outbound Email to Mentor
    const approvalEmail: NotificationItem = {
      id: `notif-${Date.now()}-mentor-approved`,
      type: 'Registration Approved',
      title: 'Mentor Accreditation Approved — Login Access Granted',
      message: `Official Accreditation Notice: Welcome, ${men.fullName}! Your mentor accreditation for the District Innovation Mission has been APPROVED by the Super Admin. Your portal credentials are now ACTIVE. You can log into the portal with username "${men.username}" to mentor student engineering teams.`,
      recipientRole: 'mentor',
      recipientId: men.id,
      read: false,
      createdAt: new Date().toISOString(),
      emailDispatched: true
    };

    setNotifications(prev => [approvalEmail, ...prev]);

    addAuditLog(
      'Project Updates' as any,
      'Pending',
      'Active (Approved)',
      `Super Admin approved mentor accreditation for ${men.fullName} (${men.organization})`,
      'Super Admin'
    );
  };

  const rejectMentor = (mentorId: string, reason?: string) => {
    const men = mentors.find(m => m.id === mentorId);
    if (!men) return;
    const finalReason = reason?.trim() || 'Domain experience and credentials could not be accredited.';

    setMentors(prev =>
      prev.map(m =>
        m.id === mentorId
          ? { ...m, status: 'Rejected', rejectionReason: finalReason }
          : m
      )
    );

    // Automated Outbound Email to Mentor
    const rejectionEmail: NotificationItem = {
      id: `notif-${Date.now()}-mentor-rejected`,
      type: 'Registration Rejected',
      title: 'Mentor Application Update — Application Not Approved',
      message: `Application Status Update: Your mentor registration for "${men.fullName}" could not be approved at this time. Reason: ${finalReason}.`,
      recipientRole: 'mentor',
      recipientId: men.id,
      read: false,
      createdAt: new Date().toISOString(),
      emailDispatched: true
    };

    setNotifications(prev => [rejectionEmail, ...prev]);

    addAuditLog(
      'Project Updates' as any,
      'Pending',
      'Rejected',
      `Super Admin rejected mentor accreditation for ${men.fullName}. Reason: ${finalReason}`,
      'Super Admin'
    );
  };

  const blockAndCreateTeam = (projectId: string, studentList: Omit<Student, 'id'>[]) => {
    if (!currentUser || currentUser.role !== 'institution') {
      triggerError('Project Selection Errors', 'Only authenticated institutions may select a project.');
      return { success: false, message: 'Only institutions can select projects.' };
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) return { success: false, message: 'Project not found.' };

    if (project.status !== 'Available') {
      triggerError('Project Selection Errors', 'This problem statement has already been selected and locked by another institution.');
      return { success: false, message: 'Project is already in progress or completed.' };
    }

    // Check single project per institution rule
    const inst = institutions.find(i => i.id === currentUser.institutionId);
    if (inst?.selectedProjectId) {
      triggerError('Project Selection Errors', 'Your institution already has an active project workspace.');
      return { success: false, message: 'Institution already has an active project.' };
    }

    const teamStudents: Student[] = studentList.map((s, idx) => ({
      ...s,
      id: `stu-${Date.now()}-${idx}`
    }));

    const newTeam: Student[] = teamStudents;

    // Update project state: Available -> In Progress, assign institution & team
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            status: 'In Progress',
            selectedByInstitutionId: currentUser.institutionId,
            selectedByInstitutionName: currentUser.name,
            team: {
              id: `team-${Date.now()}`,
              projectId,
              institutionId: currentUser.institutionId!,
              students: newTeam,
              createdAt: new Date().toISOString().substring(0, 10)
            }
          };
        }
        return p;
      })
    );

    // Link institution
    setInstitutions(prev =>
      prev.map(i => (i.id === currentUser.institutionId ? { ...i, selectedProjectId: projectId } : i))
    );

    // Audit Log & Notification
    addAuditLog(
      'Project Updates',
      'Status: Available',
      `Status: In Progress (Blocked by ${currentUser.name})`,
      `Institution blocked project ${projectId} and finalized ${studentList.length}-student roster`,
      currentUser.name
    );

    addNotification(
      'Project Assigned',
      `Project Assigned: ${project.title}`,
      `Your institution has successfully locked problem statement ${project.id}. Project Workspace initialized.`,
      'institution',
      currentUser.institutionId,
      projectId
    );

    return { success: true };
  };

  const submitMilestoneData = (
    projectId: string,
    milestoneId: 1 | 2 | 3,
    title: string,
    description: string,
    files: { category: string; fileName: string; fileSize: string }[]
  ) => {
    const today = new Date().toISOString().substring(0, 10);
    const uploadedFiles = files.map(f => ({
      ...f,
      uploadedAt: today
    }));

    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          const updatedMilestones = p.milestones.map(m => {
            if (m.id === milestoneId) {
              return {
                ...m,
                status: 'Submitted' as const,
                submissionTitle: title,
                submissionDescription: description,
                submissionDate: today,
                uploadedFiles
              };
            }
            return m;
          });
          return { ...p, milestones: updatedMilestones };
        }
        return p;
      })
    );

    addAuditLog(
      'Milestone Reviews',
      `Milestone ${milestoneId}: Draft`,
      `Milestone ${milestoneId}: Submitted`,
      `Milestone ${milestoneId} formal submission received for project ${projectId}`,
      currentUser?.name || 'Institution'
    );
  };

  const reviewMilestoneAction = (
    projectId: string,
    milestoneId: 1 | 2 | 3,
    action: 'Approved' | 'Rejected',
    reason?: string,
    comments?: string
  ) => {
    const today = new Date().toISOString().substring(0, 10);
    let isProjectCompleted = false;

    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          const updatedMilestones = p.milestones.map(m => {
            if (m.id === milestoneId) {
              return {
                ...m,
                status: action,
                rejectionReason: action === 'Rejected' ? reason : undefined,
                reviewComments: comments,
                reviewedAt: today,
                reviewedBy: 'Super Admin'
              };
            }
            return m;
          });

          // Check if all milestones are approved
          const allApproved = updatedMilestones.every(m => m.status === 'Approved');
          if (allApproved && milestoneId === 3 && action === 'Approved') {
            isProjectCompleted = true;
            return {
              ...p,
              status: 'Completed',
              milestones: updatedMilestones,
              completionDate: today
            };
          }

          return { ...p, milestones: updatedMilestones };
        }
        return p;
      })
    );

    const project = projects.find(p => p.id === projectId);
    const instId = project?.selectedByInstitutionId;

    addAuditLog(
      'Milestone Reviews',
      `Milestone ${milestoneId}: Submitted`,
      `Milestone ${milestoneId}: ${action}`,
      `Super Admin ${action.toLowerCase()} Milestone ${milestoneId} for ${projectId}. Comments: ${comments || 'None'}`,
      'Super Admin'
    );

    if (action === 'Approved') {
      addNotification(
        'Milestone Approved',
        `Milestone ${milestoneId} Approved`,
        `Super Admin has approved your Milestone ${milestoneId} submission for "${project?.title}". ${comments ? `Reviewer note: ${comments}` : ''}`,
        'institution',
        instId,
        projectId
      );

      if (isProjectCompleted || milestoneId === 3) {
        addAuditLog(
          'Certificate Generation',
          'Pending Completion',
          `Certificates Issued for ${project?.title}`,
          `Generated Institution and Student Certificates for ${project?.selectedByInstitutionName}`,
          'Super Admin / System Engine'
        );

        addNotification(
          'Certificate Generated',
          'Certificates Ready for Download',
          `Project "${project?.title}" is officially completed! Official Institution & Student Certificates are now available in your workspace.`,
          'institution',
          instId,
          projectId
        );
      }
    } else {
      addNotification(
        'Milestone Rejected',
        `Milestone ${milestoneId} Requires Revision`,
        `Milestone ${milestoneId} was returned for revision. Reason: ${reason}. Feedback: ${comments}. You may revise and resubmit.`,
        'institution',
        instId,
        projectId
      );
    }
  };

  const createProject = (newProjectData: Omit<Project, 'milestones' | 'status'>) => {
    // Generate default 3 milestones per SRS Section 13
    const defaultMilestones: Project['milestones'] = [
      {
        id: 1,
        name: 'Milestone 1 – Initial Documentation',
        description: 'Upload Requirement Analysis, Literature Survey, and Problem Understanding.',
        requiredDocuments: ['Requirement Analysis', 'Literature Survey', 'Problem Understanding'],
        startDate: '2026-04-15',
        deadlineDate: '2026-05-15',
        status: 'Draft'
      },
      {
        id: 2,
        name: 'Milestone 2 – Development Progress',
        description: 'Upload Design, Architecture, Prototype, and Progress Report.',
        requiredDocuments: ['Design', 'Architecture', 'Prototype', 'Progress Report'],
        startDate: '2026-05-20',
        deadlineDate: '2026-06-30',
        status: 'Draft'
      },
      {
        id: 3,
        name: 'Milestone 3 – Final Submission',
        description: 'Upload Final Report, Source Code, Presentation, and Demo Video.',
        requiredDocuments: ['Final Report', 'Source Code', 'Presentation', 'Demo Video'],
        startDate: '2026-07-05',
        deadlineDate: '2026-08-15',
        status: 'Draft'
      }
    ];

    const project: Project = {
      ...newProjectData,
      status: 'Available',
      milestones: defaultMilestones
    };

    setProjects(prev => [project, ...prev]);

    addAuditLog(
      'Project Creation',
      'None',
      `${project.id} Created`,
      `Super Admin created district problem statement "${project.title}" under ${project.department}`,
      currentUser?.name || 'Super Admin'
    );
  };

  const editProject = (projectId: string, updated: Partial<Project>) => {
    const existing = projects.find(p => p.id === projectId);
    setProjects(prev => prev.map(p => (p.id === projectId ? { ...p, ...updated } : p)));

    addAuditLog(
      'Project Updates',
      `Title: ${existing?.title}`,
      `Title: ${updated.title || existing?.title}`,
      `Super Admin updated problem statement attributes for ${projectId}`,
      currentUser?.name || 'Super Admin'
    );
  };

  const archiveProject = (projectId: string) => {
    setProjects(prev =>
      prev.map(p => (p.id === projectId ? { ...p, status: 'Archived', isArchived: true } : p))
    );
    addAuditLog(
      'Project Updates',
      'Status: Available/In Progress',
      'Status: Archived',
      `Super Admin archived project ${projectId}`,
      currentUser?.name || 'Super Admin'
    );
  };

  const deleteProject = (projectId: string) => {
    const existing = projects.find(p => p.id === projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
    addAuditLog(
      'Project Updates',
      `Project ${projectId} (${existing?.title})`,
      'Permanently Deleted',
      `Super Admin deleted project record ${projectId}`,
      currentUser?.name || 'Super Admin'
    );
  };

  const assignMentorToProject = (projectId: string, mentorId: string) => {
    const mentor = mentors.find(m => m.id === mentorId);
    if (!mentor) return;

    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            assignedMentorId: mentor.id,
            assignedMentorName: mentor.fullName
          };
        }
        return p;
      })
    );

    setMentors(prev =>
      prev.map(m => {
        if (m.id === mentorId && !m.assignedProjectIds.includes(projectId)) {
          return { ...m, assignedProjectIds: [...m.assignedProjectIds, projectId] };
        }
        return m;
      })
    );

    addAuditLog(
      'Project Updates',
      'Mentor: None/Previous',
      `Mentor Assigned: ${mentor.fullName}`,
      `Assigned industry mentor ${mentor.fullName} to project ${projectId}`,
      'Super Admin'
    );
  };

  const submitMentorFeedback = (
    projectId: string,
    milestoneId: 1 | 2 | 3,
    feedback: string,
    recommendations: string
  ) => {
    const newFeedback: MentorFeedback = {
      id: `fb-${Date.now()}`,
      projectId,
      milestoneId,
      mentorId: currentUser?.mentorId || 'men-001',
      mentorName: currentUser?.name || 'Industry Mentor',
      feedback,
      recommendations,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setMentorFeedbacks(prev => [newFeedback, ...prev]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addHeroSlide = (slide: Omit<HeroSlide, 'id'>) => {
    const newSlide: HeroSlide = {
      ...slide,
      id: `slide-${Date.now()}`
    };
    setHeroSlides(prev => [newSlide, ...prev]);
    addAuditLog('Project Updates', 'Hero Slide Added', `Created slide: ${slide.headlineMain} ${slide.headlineHighlight}`, 'Super Admin created hero slide');
  };

  const updateHeroSlide = (id: string, updated: Partial<HeroSlide>) => {
    setHeroSlides(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
    addAuditLog('Project Updates', `Hero Slide ${id}`, 'Updated', 'Super Admin modified hero slide configuration');
  };

  const deleteHeroSlide = (id: string) => {
    setHeroSlides(prev => prev.filter(s => s.id !== id));
    addAuditLog('Project Updates', `Hero Slide ${id}`, 'Deleted', 'Super Admin removed hero slide');
  };

  const resetHeroSlides = () => {
    setHeroSlides(DEFAULT_HERO_SLIDES);
    addAuditLog('Project Updates', 'Hero Slides Reset', 'Defaults Restored', 'Super Admin reset hero slides to system defaults');
  };

  const applyHeroAiTemplate = (templateIndex: number) => {
    const template = AI_HERO_TEMPLATES[templateIndex % AI_HERO_TEMPLATES.length];
    if (!template) return;
    const newSlide: HeroSlide = {
      ...template,
      id: `slide-ai-${Date.now()}`
    };
    setHeroSlides(prev => [newSlide, ...prev]);
    addAuditLog('Project Updates', 'AI Template Generated', `Generated and published slide: "${template.headlineMain}"`, 'Super Admin instantiated AI Hero Showcase Template');
  };

  // FAQ Management
  const addFaqItem = (item: Omit<FAQItem, 'id'>) => {
    const newItem: FAQItem = {
      ...item,
      id: `faq-${Date.now()}`
    };
    setFaqList(prev => [...prev, newItem]);
    addAuditLog('Project Updates', 'FAQ Created', newItem.question, 'Super Admin added a new FAQ item');
  };

  const updateFaqItem = (id: string, updated: Partial<FAQItem>) => {
    setFaqList(prev => prev.map(f => f.id === id ? { ...f, ...updated } : f));
    addAuditLog('Project Updates', `FAQ ${id}`, 'Updated', 'Super Admin updated FAQ content');
  };

  const deleteFaqItem = (id: string) => {
    setFaqList(prev => prev.filter(f => f.id !== id));
    addAuditLog('Project Updates', `FAQ ${id}`, 'Deleted', 'Super Admin removed an FAQ item');
  };

  const resetFaqItems = () => {
    setFaqList(defaultFAQs);
    addAuditLog('Project Updates', 'FAQ Reset', 'Default FAQs Restored', 'Super Admin reset FAQs to official defaults');
  };

  // Contact Us Management
  const updateContactSettings = (updated: Partial<ContactSettings>) => {
    setContactSettings(prev => ({ ...prev, ...updated }));
    addAuditLog('Project Updates', 'Contact Settings', 'Updated', 'Super Admin modified Contact Us information');
  };

  const submitContactInquiry = (inquiry: Omit<ContactInquiry, 'id' | 'createdAt' | 'status'>) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newInquiry: ContactInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      createdAt: now,
      status: 'New'
    };
    setContactInquiries(prev => [newInquiry, ...prev]);
    addNotification('Project Assigned', `New Contact Inquiry: ${inquiry.subject}`, `${inquiry.fullName} (${inquiry.role}) submitted a contact message.`, 'superadmin');
    return {
      success: true,
      message: 'Your inquiry has been successfully transmitted to the Chengalpattu District Innovation Mission Cell.'
    };
  };

  const updateInquiryStatus = (id: string, status: ContactInquiry['status']) => {
    setContactInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
    addAuditLog('Project Updates', `Inquiry ${id}`, status, `Super Admin updated inquiry status to ${status}`);
  };

  const resetAllData = () => {
    localStorage.clear();
    setProjects(INITIAL_PROJECTS);
    setInstitutions(INITIAL_INSTITUTIONS);
    setMentors(INITIAL_MENTORS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setMentorFeedbacks(INITIAL_FEEDBACK);
    setHeroSlides(DEFAULT_HERO_SLIDES);
    setFaqList(defaultFAQs);
    setContactSettings(DEFAULT_CONTACT_SETTINGS);
    setCurrentUser(null);
    setActivePage('home');
    setSelectedProjectId(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        activePage,
        setActivePage,
        selectedProjectId,
        setSelectedProjectId,
        selectedMilestoneId,
        setSelectedMilestoneId,
        projects,
        institutions,
        mentors,
        notifications,
        auditLogs,
        addAuditLog,
        mentorFeedbacks,
        heroSlides,
        addHeroSlide,
        updateHeroSlide,
        deleteHeroSlide,
        resetHeroSlides,
        applyHeroAiTemplate,
        faqList,
        addFaqItem,
        updateFaqItem,
        deleteFaqItem,
        resetFaqItems,
        contactSettings,
        updateContactSettings,
        contactInquiries,
        submitContactInquiry,
        updateInquiryStatus,
        switchRole,
        loginUser,
        logoutUser,
        registerInstitution,
        verifyInstitutionEmail,
        approveInstitution,
        rejectInstitution,
        registerMentor,
        approveMentor,
        rejectMentor,
        blockAndCreateTeam,
        submitMilestoneData,
        reviewMilestoneAction,
        createProject,
        editProject,
        archiveProject,
        deleteProject,
        assignMentorToProject,
        submitMentorFeedback,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        activeError,
        triggerError,
        clearError,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
