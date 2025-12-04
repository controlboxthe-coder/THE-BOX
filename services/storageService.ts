import { AppState, User } from "../types";
import { STORAGE_KEYS } from "../constants";

// In a real scenario with Firebase, this service would wrap Firestore calls.
// Here we implement the "Offline Mirror" logic described in the prompt.

export const saveLocalState = (email: string, state: Partial<AppState>) => {
  if (!email) return;
  const key = `${STORAGE_KEYS.DATA_PREFIX}${email}`;
  
  // Persist only relevant data
  const payload = {
    transactions: state.transactions,
    categories: state.categories,
    recurring: state.recurring,
    licenseKey: state.licenseKey,
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(key, JSON.stringify(payload));
};

export const loadLocalState = (email: string): Partial<AppState> | null => {
  const key = `${STORAGE_KEYS.DATA_PREFIX}${email}`;
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  }
  return null;
};

export const saveUserSession = (user: User) => {
  sessionStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(user));
};

export const loadUserSession = (): User | null => {
  const data = sessionStorage.getItem(STORAGE_KEYS.USER_SESSION);
  return data ? JSON.parse(data) : null;
};

export const clearUserSession = () => {
  sessionStorage.removeItem(STORAGE_KEYS.USER_SESSION);
};