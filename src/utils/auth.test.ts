import { describe, expect, it } from 'vitest';
import { authenticateUser, hashSecret } from './auth';

describe('local pharmacist authentication', () => {
  it('authenticates default pharmacist account with valid PIN', () => {
    const session = authenticateUser('pharmacist', '1234');
    expect(session).not.toBeNull();
    expect(session?.username).toBe('pharmacist');
    expect(session?.role).toBe('Clinical Pharmacist');
  });

  it('authenticates amal.essam account', () => {
    const session = authenticateUser('amal.essam', '172001');
    expect(session).not.toBeNull();
    expect(session?.username).toBe('amal.essam');
    expect(session?.displayName).toBe('د. أمل عصام');
  });

  it('handles case-insensitive and whitespace-padded usernames', () => {
    const session = authenticateUser('  Admin  ', 'admin123');
    expect(session).not.toBeNull();
    expect(session?.role).toBe('Admin');
  });

  it('rejects wrong password or empty credentials', () => {
    expect(authenticateUser('pharmacist', 'wrong')).toBeNull();
    expect(authenticateUser('', '1234')).toBeNull();
    expect(authenticateUser('pharmacist', '')).toBeNull();
  });

  it('produces deterministic hashes', () => {
    expect(hashSecret('1234')).toBe(hashSecret('1234'));
    expect(hashSecret('1234')).not.toBe(hashSecret('1235'));
  });
});
