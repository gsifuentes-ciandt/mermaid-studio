// =====================================================
// PREFERENCES SETTINGS
// =====================================================
// Theme and language preferences

import { type ReactElement, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useI18n } from '../../contexts/I18nContext';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../services/supabase';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

export function PreferencesSettings(): ReactElement {
  const { theme, setTheme } = useTheme();
  const { t, locale, setLocale, languages } = useI18n();
  const { user } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user) {
      toast.error(t('settings.mustBeLoggedIn'));
      return;
    }

    setIsSaving(true);
    try {
      // Update user_preferences in Supabase
      const { error } = await supabase
        .from('user_preferences')
        .update({
          theme,
          language: locale,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error saving preferences:', error);
        toast.error(`${t('settings.prefSaveError')}: ${error.message}`);
      } else {
        toast.success(t('settings.prefSaveSuccess'));
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error(t('settings.prefSaveError'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('settings.preferencesTitle')}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          {t('settings.preferencesSubtitle')}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.theme')}
          </label>
          <Select value={theme} onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}>
            <option value="light">{t('settings.light')}</option>
            <option value="dark">{t('settings.dark')}</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.language')}
          </label>
          <Select value={locale} onChange={(e) => setLocale(e.target.value as 'en' | 'es' | 'pt')}>
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? t('settings.saving') : t('settings.savePreferences')}
        </Button>
      </div>
    </div>
  );
}
