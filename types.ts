// Data Models
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  date: string; // ISO string YYYY-MM-DD
}

export interface RecurringItem {
  id: string;
  description: string;
  amount: number;
  day: number;
  type: TransactionType;
  category: string;
  lastProcessed?: string;
}

export interface User {
  name: string;
  email: string;
  phone?: string;
  password?: string; // In a real app, never store plain text.
}

export interface AppState {
  transactions: Transaction[];
  categories: string[];
  recurring: RecurringItem[];
  licenseKey: string; // "BOXPRO" or empty
  user: User | null;
  isAuthenticated: boolean;
}

// Global Window Extension for Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

// AI Service Types
export interface AIParsedAction {
  action: 'add_tx' | 'unknown';
  type?: TransactionType;
  description?: string;
  amount?: number;
  category?: string;
  date?: string;
}