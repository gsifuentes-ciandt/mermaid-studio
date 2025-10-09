import { useI18n } from '@/contexts/I18nContext';

export function Header(): JSX.Element {
  const { t } = useI18n();

  return (
    <div className="rounded-xl bg-white/90 p-6 shadow-lg backdrop-blur dark:bg-gray-800/90">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {t('app.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {t('app.subtitle')}
        </p>
      </div>
    </div>
  );
}

