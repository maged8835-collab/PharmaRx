import type { PharmacistRole, PharmacistSession } from '../types/pharmacy';

const SESSION_KEY = 'pediasurgrx_auth_session_v1';
const ACCOUNTS_KEY = 'pediasurgrx_auth_accounts_v1';

export interface StoredAccount {
  username: string;
  displayName: string;
  role: PharmacistRole;
  passwordHash: string;
}

export function hashSecret(input: string): string {
  // Deterministic FNV-1a 64-bit-style hex hash for lightweight client-side PIN/password checks
  let h1 = 0x811c9dc5;
  let h2 = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 ^= ch;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= ch + i;
    h2 = Math.imul(h2, 0x01000193);
  }
  return (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
}

export const DEFAULT_ACCOUNTS: StoredAccount[] = [
  {
    username: 'amal.essam',
    displayName: 'د. أمل عصام',
    role: 'Clinical Pharmacist',
    passwordHash: hashSecret('172001'),
  },
  {
    username: 'pharmacist',
    displayName: 'د. الصيدلي المناوب',
    role: 'Clinical Pharmacist',
    passwordHash: hashSecret('1234'),
  },
  {
    username: 'admin',
    displayName: 'مدير الصيدلية الإكلينيكية',
    role: 'Admin',
    passwordHash: hashSecret('admin123'),
  },
];

export function loadAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Fallback to default accounts
  }
  return DEFAULT_ACCOUNTS;
}

export function authenticateUser(
  username: string,
  password: string
): PharmacistSession | null {
  const normalizedUser = username.trim().toLowerCase();
  if (!normalizedUser || !password) return null;

  const accounts = loadAccounts();
  const targetHash = hashSecret(password);
  const matched = accounts.find(
    (acc) => acc.username.toLowerCase() === normalizedUser && acc.passwordHash === targetHash
  );

  if (!matched) return null;

  return {
    username: matched.username,
    displayName: matched.displayName,
    role: matched.role,
    loggedInAt: new Date().toISOString(),
  };
}

export function saveSession(session: PharmacistSession, remember: boolean): void {
  const serialized = JSON.stringify(session);
  try {
    if (remember) {
      localStorage.setItem(SESSION_KEY, serialized);
      sessionStorage.removeItem(SESSION_KEY);
    } else {
      sessionStorage.setItem(SESSION_KEY, serialized);
      localStorage.removeItem(SESSION_KEY);
    }
  } catch (err) {
    console.error('Failed saving session:', err);
  }
}

export function loadSession(): PharmacistSession | null {
  try {
    const fromSession = sessionStorage.getItem(SESSION_KEY);
    const fromLocal = localStorage.getItem(SESSION_KEY);
    const raw = fromSession || fromLocal;
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.username === 'string' && typeof parsed.displayName === 'string') {
      return parsed as PharmacistSession;
    }
  } catch {
    // Ignore corrupt storage
  }
  return null;
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore
  }
}
