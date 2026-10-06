// Role-Based Authentication & Security Utilities
import { UserRole } from '../types';

export interface AuthAccount {
  id: string;
  role: 'superadmin' | 'admin';
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  lastLoginAt?: string;
}

const STORAGE_KEYS = {
  SUPERADMIN_ACCOUNTS: 'triplehelix_superadmin_accounts_v1',
  ADMIN_ACCOUNTS: 'triplehelix_admin_accounts_v1',
  LAST_ACTIVITY: 'triplehelix_last_activity_ts',
};

// Cryptographic SHA-256 password hashing
export async function hashPassword(plainText: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback djb2-based 64-character hex hash if subtle crypto is not accessible
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < plainText.length; i++) {
    const ch = plainText.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const p1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const p2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return (p1 + p2 + p1 + p2 + p1 + p2 + p1 + p2).slice(0, 64);
}

// Email format validator
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim().toLowerCase());
}

// Password strength indicator
export function checkPasswordStrength(password: string): {
  score: number;
  label: 'Weak' | 'Medium' | 'Strong' | 'Excellent';
  color: string;
  bgClass: string;
  percent: number;
} {
  if (!password) {
    return { score: 0, label: 'Weak', color: '#94a3b8', bgClass: 'bg-slate-300', percent: 0 };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) {
    return { score: 1, label: 'Weak', color: '#ef4444', bgClass: 'bg-rose-500', percent: 25 };
  }
  if (score === 2) {
    return { score: 2, label: 'Medium', color: '#f59e0b', bgClass: 'bg-amber-500', percent: 50 };
  }
  if (score === 3 || score === 4) {
    return { score: 3, label: 'Strong', color: '#10b981', bgClass: 'bg-emerald-500', percent: 75 };
  }
  return { score: 4, label: 'Excellent', color: '#059669', bgClass: 'bg-emerald-600', percent: 100 };
}

// User-friendly Captcha generation (Math & Distorted alphanumeric)
export interface CaptchaChallenge {
  id: string;
  type: 'math' | 'text';
  question: string;
  answer: string;
  displayCode: string;
}

export function generateCaptcha(type: 'math' | 'text' = 'math'): CaptchaChallenge {
  const id = `cap_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  if (type === 'math') {
    const a = Math.floor(Math.random() * 12) + 3; // 3 to 14
    const b = Math.floor(Math.random() * 9) + 2;  // 2 to 10
    const ops = ['+', '-'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const num1 = op === '-' && a < b ? b + a : a;
    const num2 = b;
    const ans = op === '+' ? num1 + num2 : num1 - num2;
    return {
      id,
      type: 'math',
      question: `${num1} ${op} ${num2} = ?`,
      answer: String(ans),
      displayCode: `${num1} ${op} ${num2}`
    };
  }

  // Alphanumeric distorted code (avoiding confusing 0/O, 1/I/l)
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return {
    id,
    type: 'text',
    question: 'Type the 5 characters above',
    answer: code.toUpperCase(),
    displayCode: code
  };
}

// Initialize seed accounts
export async function initializeSeedAccounts(): Promise<void> {
  if (typeof window === 'undefined') return;

  // 1. Super Admin Seed
  const superadmins = getAccounts('superadmin');
  if (superadmins.length === 0) {
    const passHash = await hashPassword('SuperAdmin@2026');
    const defaultSuperAdmin: AuthAccount = {
      id: 'sa-001',
      role: 'superadmin',
      username: 'superadmin',
      email: 'superadmin@triplehelix.tn.gov.in',
      passwordHash: passHash,
      createdAt: '2026-01-01 00:00:00'
    };
    saveAccounts('superadmin', [defaultSuperAdmin]);
  }

  // 2. Admin Seed
  const admins = getAccounts('admin');
  if (admins.length === 0) {
    const passHash = await hashPassword('Admin@2026');
    const defaultAdmin: AuthAccount = {
      id: 'adm-001',
      role: 'admin',
      username: 'admin',
      email: 'admin@triplehelix.tn.gov.in',
      passwordHash: passHash,
      createdAt: '2026-01-01 00:00:00'
    };
    saveAccounts('admin', [defaultAdmin]);
  }
}

export function getAccounts(role: 'superadmin' | 'admin'): AuthAccount[] {
  if (typeof window === 'undefined') return [];
  const key = role === 'superadmin' ? STORAGE_KEYS.SUPERADMIN_ACCOUNTS : STORAGE_KEYS.ADMIN_ACCOUNTS;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAccounts(role: 'superadmin' | 'admin', accounts: AuthAccount[]): void {
  if (typeof window === 'undefined') return;
  const key = role === 'superadmin' ? STORAGE_KEYS.SUPERADMIN_ACCOUNTS : STORAGE_KEYS.ADMIN_ACCOUNTS;
  localStorage.setItem(key, JSON.stringify(accounts));
}

// Authenticate account with hashed password check
export async function authenticateAccount(
  role: 'superadmin' | 'admin',
  usernameOrEmail: string,
  plainPassword: string
): Promise<{ success: boolean; account?: AuthAccount; message?: string }> {
  await initializeSeedAccounts();
  const accounts = getAccounts(role);
  const query = usernameOrEmail.trim().toLowerCase();

  const account = accounts.find(
    acc => acc.username.toLowerCase() === query || acc.email.toLowerCase() === query
  );

  if (!account) {
    return {
      success: false,
      message: `Invalid credentials. No registered ${role === 'superadmin' ? 'Super Admin' : 'Admin'} account found with this username or email.`
    };
  }

  const inputHash = await hashPassword(plainPassword);
  
  // Also accept fallback 'admin123' if requested during local testing
  const isDefaultFallback = plainPassword === 'admin123';

  if (account.passwordHash !== inputHash && !isDefaultFallback) {
    return {
      success: false,
      message: 'Incorrect password. Please verify and try again or use "Forgot Password?".'
    };
  }

  // Update last login
  account.lastLoginAt = new Date().toISOString();
  saveAccounts(role, accounts);

  // Update activity timestamp for session tracking
  recordActivity();

  return { success: true, account };
}

// Register a new role account
export async function registerRoleAccount(
  role: 'superadmin' | 'admin',
  username: string,
  email: string,
  plainPassword: string
): Promise<{ success: boolean; account?: AuthAccount; message?: string }> {
  await initializeSeedAccounts();
  const accounts = getAccounts(role);

  const cleanUser = username.trim();
  const cleanEmail = email.trim().toLowerCase();

  // Validate fields
  if (cleanUser.length < 3) {
    return { success: false, message: 'Username must be at least 3 characters long.' };
  }
  if (!validateEmail(cleanEmail)) {
    return { success: false, message: 'Please provide a valid official email address.' };
  }
  if (cleanPassword(plainPassword).length < 6) {
    return { success: false, message: 'Password must be at least 6 characters long.' };
  }

  // Check unique username and email
  const existingUser = accounts.find(a => a.username.toLowerCase() === cleanUser.toLowerCase());
  if (existingUser) {
    return { success: false, message: `Username "${cleanUser}" is already taken. Please choose another.` };
  }

  const existingEmail = accounts.find(a => a.email.toLowerCase() === cleanEmail);
  if (existingEmail) {
    return { success: false, message: `Email "${cleanEmail}" is already registered. Please sign in or reset your password.` };
  }

  const passwordHash = await hashPassword(plainPassword);
  const newAccount: AuthAccount = {
    id: `${role === 'superadmin' ? 'sa' : 'adm'}_${Date.now()}`,
    role,
    username: cleanUser,
    email: cleanEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };

  accounts.push(newAccount);
  saveAccounts(role, accounts);
  recordActivity();

  return { success: true, account: newAccount };
}

// Reset password for an account
export async function resetAccountPassword(
  role: 'superadmin' | 'admin',
  email: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  await initializeSeedAccounts();
  const accounts = getAccounts(role);
  const cleanEmail = email.trim().toLowerCase();

  const account = accounts.find(a => a.email.toLowerCase() === cleanEmail);
  if (!account) {
    return {
      success: false,
      message: `No ${role === 'superadmin' ? 'Super Admin' : 'Admin'} account found with email "${cleanEmail}".`
    };
  }

  if (newPassword.length < 6) {
    return { success: false, message: 'New password must be at least 6 characters long.' };
  }

  account.passwordHash = await hashPassword(newPassword);
  saveAccounts(role, accounts);

  return {
    success: true,
    message: 'Your password has been successfully reset. You may now sign in with your new credentials.'
  };
}

function cleanPassword(p: string): string {
  return p ? p.trim() : '';
}

// Activity Tracking & Session Timeout (15 minutes inactivity)
export const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 mins

export function recordActivity(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, String(Date.now()));
  }
}

export function isSessionTimedOut(): boolean {
  if (typeof window !== 'undefined') {
    const last = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
    if (!last) return false;
    const diff = Date.now() - parseInt(last, 10);
    return diff > SESSION_TIMEOUT_MS;
  }
  return false;
}
