import { safeStorage } from './storage';
import { STORAGE_KEYS } from '../config/site';

/**
 * First-visit welcome state.
 *
 * Today this is per browser (localStorage). When real authentication ships, the same two functions
 * can also read and write a flag on the user record, so a returning user on a new device is not
 * treated as new. Callers do not need to change.
 */
let seenThisPageLoad = false;

export function hasSeenWelcome(): boolean {
  return seenThisPageLoad || safeStorage.getItem(STORAGE_KEYS.welcomeSeen) !== null;
}

export function markWelcomeSeen(): void {
  seenThisPageLoad = true;
  safeStorage.setItem(STORAGE_KEYS.welcomeSeen, new Date().toISOString());
}

export function hasStoredSession(): boolean {
  return safeStorage.getItem(STORAGE_KEYS.authToken) !== null;
}
