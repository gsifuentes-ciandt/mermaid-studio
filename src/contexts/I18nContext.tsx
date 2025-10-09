import { createContext, useContext, useState, type ReactNode } from 'react';

type Locale = 'en' | 'es' | 'pt';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    'app.title': 'Mermaid Studio Pro',
    'app.subtitle': 'Create, organize, and export rich Mermaid diagrams with modern tooling.',
    'button.addDiagram': 'Add Diagram',
    'button.exportJSON': 'Export JSON',
    'button.importJSON': 'Import JSON',
    'button.downloadAll': 'Download All',
    'button.clearAll': 'Clear All',
    'search.placeholder': 'Search diagrams by title, description, or tags...',
    'filter.type': 'Type:',
    'filter.allTypes': 'All Types',
    'total': 'Total',
    'showing': 'Showing',
    'of': 'of'
  },
  es: {
    'app.title': 'Mermaid Studio Pro',
    'app.subtitle': 'Crea, organiza y exporta diagramas Mermaid ricos con herramientas modernas.',
    'button.addDiagram': 'Agregar Diagrama',
    'button.exportJSON': 'Exportar JSON',
    'button.importJSON': 'Importar JSON',
    'button.downloadAll': 'Descargar Todo',
    'button.clearAll': 'Limpiar Todo',
    'search.placeholder': 'Buscar diagramas por título, descripción o etiquetas...',
    'filter.type': 'Tipo:',
    'filter.allTypes': 'Todos los Tipos',
    'total': 'Total',
    'showing': 'Mostrando',
    'of': 'de'
  },
  pt: {
    'app.title': 'Mermaid Studio Pro',
    'app.subtitle': 'Crie, organize e exporte diagramas Mermaid ricos com ferramentas modernas.',
    'button.addDiagram': 'Adicionar Diagrama',
    'button.exportJSON': 'Exportar JSON',
    'button.importJSON': 'Importar JSON',
    'button.downloadAll': 'Baixar Tudo',
    'button.clearAll': 'Limpar Tudo',
    'search.placeholder': 'Pesquisar diagramas por título, descrição ou tags...',
    'filter.type': 'Tipo:',
    'filter.allTypes': 'Todos os Tipos',
    'total': 'Total',
    'showing': 'Mostrando',
    'of': 'de'
  }
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
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
    return translations[locale]?.[key] || key;
  };

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
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
