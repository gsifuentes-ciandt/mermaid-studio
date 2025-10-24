// =====================================================
// PROFILE SETTINGS
// =====================================================
// User profile settings component

import { type ReactElement } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useI18n } from '../../contexts/I18nContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function ProfileSettings(): ReactElement {
  const { t } = useI18n();
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('settings.profileTitle')}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          {t('settings.profileSubtitle')}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.fullName')}
          </label>
          <Input value={user?.user_metadata?.full_name || ''} disabled />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.email')}
          </label>
          <Input value={user?.email || ''} disabled />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.avatar')}
          </label>
          {user?.user_metadata?.avatar_url && (
            <img
              src={user.user_metadata.avatar_url}
              alt="Profile"
              className="h-20 w-20 rounded-full"
            />
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {t('settings.profileNote')}
        </p>
      </div>
    </div>
  );
}
