// =====================================================
// SETTINGS PAGE
// =====================================================
// User preferences and AI configuration

import { type ReactElement, useState } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { ProfileSettings } from '../components/settings/ProfileSettings';
import { AIConfigSettings } from '../components/settings/AIConfigSettings';
import { PreferencesSettings } from '../components/settings/PreferencesSettings';
import { AccountSettings } from '../components/settings/AccountSettings';
import { User, Bot, Settings as SettingsIcon, LogOut } from 'lucide-react';

type Tab = 'profile' | 'ai' | 'preferences' | 'account';

export function SettingsPage(): ReactElement {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const tabs = [
    { id: 'profile' as Tab, label: t('settings.profile'), icon: User },
    { id: 'ai' as Tab, label: t('settings.aiConfig'), icon: Bot },
    { id: 'preferences' as Tab, label: t('settings.preferences'), icon: SettingsIcon },
    { id: 'account' as Tab, label: t('settings.account'), icon: LogOut },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('settings.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        {activeTab === 'profile' && <ProfileSettings />}
        {activeTab === 'ai' && <AIConfigSettings />}
        {activeTab === 'preferences' && <PreferencesSettings />}
        {activeTab === 'account' && <AccountSettings />}
      </div>
    </div>
  );
}
