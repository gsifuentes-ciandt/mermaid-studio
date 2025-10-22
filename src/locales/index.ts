import { en } from './en';
import { es } from './es';
import { pt } from './pt';

export const translations = {
  en,
  es,
  pt,
} as const;

export type Locale = keyof typeof translations;
export type TranslationKeys = typeof en;

// Helper to get nested translation value
export function getNestedTranslation(obj: any, path: string): string {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return path; // Return key if not found
    }
  }
  
  return typeof result === 'string' ? result : path;
}
