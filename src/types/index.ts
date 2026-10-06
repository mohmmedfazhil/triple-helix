export type UserRole = 'institution' | 'mentor' | 'collector' | 'superadmin' | 'admin' | 'student' | 'public';

export type TechnologyCategory = 
  | 'Software' 
  | 'Hardware' 
  | 'Embedded' 
  | 'Hybrid'
  | 'AI/ML'
  | 'IoT'
  | 'Healthcare'
  | 'Agriculture'
  | 'Data Science'
  | 'Cybersecurity'
  | 'Others';

export type ProjectStatus = 'Available' | 'In Progress' | 'Completed' | 'Archived';

export type MilestoneStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Deadline Passed';

export type InstitutionType = 'Government' | 'Government Aided' | 'Private';

export type ErrorCategory =
  | 'Login Errors'
  | 'Registration Errors'
  | 'File Upload Errors'
  | 'Network Errors'
  | 'Password Reset Errors'
  | 'Project Selection Errors'
  | 'Deadline Errors';

export interface Student {
  id: string;
  fullName: string;
  registerNumber: string;
  department: string;
  year: string;
  email: string;
  mobileNumber: string;
  isLeader: boolean;
}

export interface Team {
  id: string;
  projectId: string;
  institutionId: string;
  students: Student[];
  createdAt: string;
}

export interface MilestoneUploadedFile {
  category: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
}

export interface Milestone {
  id: 1 | 2 | 3;
  name: string;
  description: string;
  requiredDocuments: string[];
  startDate: string;
  deadlineDate: string;
  status: MilestoneStatus;
  submissionTitle?: string;
  submissionDescription?: string;
  submissionDate?: string;
  uploadedFiles?: MilestoneUploadedFile[];
  rejectionReason?: string;
  reviewComments?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface ReferenceDocument {
  title: string;
  type: 'PDF' | 'URL' | 'Document';
  url: string;
  size?: string;
}

export interface ProjectAttachment {
  name: string;
  size: string;
  type: string;
}

export interface Project {
  id: string; // e.g. "PRJ-DST-001"
  title: string;
  department: string;
  sector: string;
  duration: string;
  technologyCategory: TechnologyCategory;
  description: string;
  objectives: string[];
  expectedDeliverables: string[];
  requiredSkills: string[];
  referenceDocuments: ReferenceDocument[];
  attachments: ProjectAttachment[];
  status: ProjectStatus;
  selectedByInstitutionId?: string;
  selectedByInstitutionName?: string;
  assignedMentorId?: string;
  assignedMentorName?: string;
  team?: Team;
  milestones: Milestone[];
  completionDate?: string;
  isArchived?: boolean;
}

export interface Institution {
  id: string;
  name: string;
  shortName: string;
  code: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  institutionType: InstitutionType;
  universityAffiliated: boolean;
  affiliatedUniversityName?: string;
  autonomous: boolean;
  naacGrade: string;
  principalName: string;
  coordinatorName: string;
  coordinatorDesignation: string;
  coordinatorPhone: string;
  coordinatorEmail: string;
  websiteUrl: string;
  username: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Rejected';
  registeredAt?: string;
  rejectionReason?: string;
  approvedAt?: string;
  selectedProjectId?: string;
}

export interface Mentor {
  id: string;
  fullName: string;
  designation: string;
  organization: string;
  email: string;
  mobileNumber: string;
  expertise: string[];
  yearsOfExperience: number;
  linkedInProfile?: string;
  resumeFileName?: string;
  username: string;
  status: 'Active' | 'Pending' | 'Rejected';
  registeredAt?: string;
  rejectionReason?: string;
  approvedAt?: string;
  assignedProjectIds: string[];
}

export interface IndustryPartner {
  id: string;
  companyName: string;
  sector: string;
  contactPerson: string;
  designation: string;
  email: string;
  phone: string;
  website?: string;
  registeredAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  approvedAt?: string;
}

export interface MentorFeedback {
  id: string;
  projectId: string;
  milestoneId: 1 | 2 | 3;
  mentorId: string;
  mentorName: string;
  feedback: string;
  recommendations: string;
  submittedAt: string;
}

export interface NotificationItem {
  id: string;
  type: 'Project Assigned' | 'Milestone Approved' | 'Milestone Rejected' | 'Deadline Approaching' | 'Certificate Generated' | 'Registration Pending' | 'Registration Approved' | 'Registration Rejected' | 'System Alert';
  title: string;
  message: string;
  recipientRole: UserRole;
  recipientId?: string;
  read: boolean;
  createdAt: string;
  emailDispatched: boolean;
  projectId?: string;
}

export interface AuditLogEntry {
  id: string;
  userAction: 'Login' | 'Project Creation' | 'Project Updates' | 'Milestone Reviews' | 'Certificate Generation';
  timestamp: string;
  ipAddress?: string;
  previousValue?: string;
  newValue?: string;
  performedBy: string;
  details: string;
}

export interface CurrentUser {
  role: UserRole;
  id: string;
  name: string;
  email: string;
  institutionId?: string;
  mentorId?: string;
  studentId?: string;
  projectId?: string;
  isLeader?: boolean;
  registerNumber?: string;
}

export interface HeroSlide {
  id: string;
  badge: string;
  headlineMain: string;
  headlineHighlight: string;
  description: string;
  primaryCtaText: string;
  primaryCtaAction: 'about' | 'browse' | 'login' | 'register-institution' | 'register-mentor';
  secondaryCtaText: string;
  secondaryCtaAction: 'about' | 'browse' | 'login' | 'register-institution' | 'register-mentor';
  theme: 'amber' | 'emerald' | 'sky' | 'indigo' | 'purple';
  category: string;
  active: boolean;
  departmentTag: string;
  imageUrl?: string;
  imageAlt?: string;
  imageCaption?: string;
}

export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
  category?: string;
}

export interface ContactSettings {
  officeName: string;
  department: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  primaryEmail: string;
  secondaryEmail?: string;
  helplinePhone: string;
  secondaryPhone?: string;
  workingHours: string;
  slaNotice: string;
  subjectOptions: string[];
}

export interface ContactInquiry {
  id: string;
  fullName: string;
  email: string;
  mobileNumber?: string;
  role: 'Institution' | 'Student' | 'Mentor' | 'Government Official' | 'Public Citizen';
  organization?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'New' | 'In Review' | 'Resolved';
}

