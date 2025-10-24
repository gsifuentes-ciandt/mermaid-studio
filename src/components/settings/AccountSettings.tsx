// =====================================================
// ACCOUNT SETTINGS
// =====================================================
// Account management and sign out

import { type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useI18n } from '../../contexts/I18nContext';
import { Button } from '../ui/Button';
import { LogOut, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function AccountSettings(): ReactElement {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { signOut } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success(t('userMenu.signOutSuccess'));
      navigate('/login');
    } catch (error) {
      toast.error(t('userMenu.signOutError'));
    }
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    toast('Account deletion coming soon', { icon: 'ℹ️' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('settings.accountTitle')}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          {t('settings.accountSubtitle')}
        </p>
      </div>

      {/* Sign Out */}
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          {t('settings.signOut')}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {t('settings.signOutDesc')}
        </p>
        <Button onClick={handleSignOut} variant="secondary">
          <LogOut className="h-4 w-4 mr-2" />
          {t('settings.signOut')}
        </Button>
      </div>

      {/* Delete Account */}
      <div className="p-4 border border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-900/10">
        <h3 className="font-semibold text-red-900 dark:text-red-400 mb-2">
          {t('settings.deleteAccount')}
        </h3>
        <p className="text-sm text-red-700 dark:text-red-300 mb-4">
          {t('settings.deleteAccountWarning')}
        </p>
        <Button onClick={handleDeleteAccount} variant="danger">
          <Trash2 className="h-4 w-4 mr-2" />
          {t('settings.deleteAccount')}
        </Button>
      </div>
    </div>
  );
}
