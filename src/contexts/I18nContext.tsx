import { createContext, useContext, useState, type ReactNode } from 'react';
import { translations, getNestedTranslation, type Locale, type TranslationKeys } from '../locales';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  translations: TranslationKeys;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const stored = localStorage.getItem('locale');
    if (stored === 'en' || stored === 'es' || stored === 'pt') return stored;
    const browserLang = navigator.language.split('-')[0];
    return (browserLang === 'es' || browserLang === 'pt') ? browserLang as Locale : 'en';
  });

  const t = (key: string): string => {
    return getNestedTranslation(translations[locale], key);
  };

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return (
    <I18nContext.Provider value={{ 
      locale, 
      setLocale: handleSetLocale, 
      t,
      translations: translations[locale]
    }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
