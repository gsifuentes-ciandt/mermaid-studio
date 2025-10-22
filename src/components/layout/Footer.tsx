import { Heart } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';

const FlowIcon = () => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="0"
    viewBox="0 0 80 53"
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    height="1em"
    width="1em"
  >
    <g clipPath="url(#clip0_221_417)">
      <path
        d="M79.9999 0V26.5C79.9999 41.1048 68.1159 52.9519 53.439 53V26.5C53.439 11.8649 41.5065 0 26.7881 0H79.9999Z"
        fill="currentColor"
      />
      <path
        d="M53.2118 53H0V26.5C0 11.8952 11.884 0.0481418 26.561 0V26.5C26.561 41.1351 38.4934 53 53.2118 53Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_221_417">
        <rect width="80" height="53" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const Footer = () => {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Left: Copyright & Creator */}
          <div className="flex flex-col items-center gap-2 text-center md:flex-row md:text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} {t('footer.copyright')}
            </p>
            <span className="hidden text-gray-400 dark:text-gray-600 md:inline">•</span>
            <p className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
              {t('footer.implementedWith')}
              <Heart className="h-3.5 w-3.5 fill-purple-500 text-purple-500" />
              {t('footer.by')}
              <span className="font-medium text-gray-900 dark:text-white">
                Gabriel Sifuentes
              </span>
            </p>
          </div>

          {/* Right: Powered by Flow */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>{t('footer.poweredBy')}</span>
            <a
              href="https://flow.ciandt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              <FlowIcon />
              <span>Flow</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
