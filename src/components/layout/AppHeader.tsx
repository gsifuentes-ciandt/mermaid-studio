import { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Globe, ChevronDown, Users } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/contexts/I18nContext';
import { enableDemoMode } from '@/services/demo.service';
import { UserMenu } from './UserMenu';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' }
];

export function AppHeader(): JSX.Element {
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale } = useI18n();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languages.find((lang) => lang.code === locale) || languages[0];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/95 shadow-lg backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-900/95">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <img 
            src="/mermaid-studio-logo.png" 
            alt="Mermaid Studio" 
            className="h-8 w-8"
            loading="eager"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            Mermaid Studio
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              title="Change Language"
            >
              <span className="text-base">{currentLang.flag}</span>
              <span className="text-sm font-semibold text-gray-700 dark:text-white">
                {currentLang.code.toUpperCase()}
              </span>
              <ChevronDown size={14} className="text-gray-500 dark:text-gray-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 top-full z-[100] mt-2 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLocale(lang.code as 'en' | 'es' | 'pt');
                      setShowLangMenu(false);
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      locale === lang.code ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? (
              <Moon size={16} className="text-gray-700" />
            ) : (
              <Sun size={16} className="text-yellow-400" />
            )}
          </button>

          {/* User Menu - Rightmost */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
