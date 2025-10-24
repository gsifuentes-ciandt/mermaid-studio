// =====================================================
// AI CONFIGURATION SETTINGS
// =====================================================
// AI provider and credentials configuration

import { type ReactElement, useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useI18n } from '../../contexts/I18nContext';
import { supabase } from '../../services/supabase';
import { encryptData, decryptData } from '../../utils/encryption';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

export function AIConfigSettings(): ReactElement {
  const { t } = useI18n();
  const { user } = useAuthStore();
  const [provider, setProvider] = useState<'flow' | 'openai'>('flow');
  const [flowApiUrl, setFlowApiUrl] = useState('');
  const [flowClientId, setFlowClientId] = useState('');
  const [flowClientSecret, setFlowClientSecret] = useState('');
  const [flowTenant, setFlowTenant] = useState('');
  const [flowAgent, setFlowAgent] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing credentials on mount
  useEffect(() => {
    loadCredentials();
  }, [user]);

  const loadCredentials = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('ai_provider, ai_credentials')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error loading credentials:', error);
        return;
      }

      if (data) {
        // Set provider
        if (data.ai_provider) {
          setProvider(data.ai_provider as 'flow' | 'openai');
        }

        // Decrypt and load credentials
        if (data.ai_credentials && typeof data.ai_credentials === 'string') {
          try {
            const decrypted = await decryptData(data.ai_credentials, user.id);
            
            if (decrypted.flow) {
              setFlowApiUrl(decrypted.flow.apiUrl || '');
              setFlowClientId(decrypted.flow.clientId || '');
              setFlowClientSecret(decrypted.flow.clientSecret || '');
              setFlowTenant(decrypted.flow.tenant || '');
              setFlowAgent(decrypted.flow.agent || '');
            }
            
            if (decrypted.openai) {
              setOpenaiApiKey(decrypted.openai.apiKey || '');
            }
          } catch (decryptError) {
            console.error('Failed to decrypt credentials:', decryptError);
            toast.error(t('settings.loadCredentialsError'));
          }
        }
      }
    } catch (err) {
      console.error('Unexpected error loading credentials:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error(t('settings.mustBeLoggedIn'));
      return;
    }

    setIsSaving(true);
    try {
      // Build credentials object
      const credentials = {
        flow: {
          apiUrl: flowApiUrl,
          clientId: flowClientId,
          clientSecret: flowClientSecret,
          tenant: flowTenant,
          agent: flowAgent,
        },
        openai: {
          apiKey: openaiApiKey,
        },
      };

      // Encrypt credentials
      const encryptedCredentials = await encryptData(credentials, user.id);

      // Save to Supabase
      const { error } = await supabase
        .from('user_preferences')
        .update({
          ai_provider: provider,
          ai_credentials: encryptedCredentials,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error saving configuration:', error);
        toast.error(`${t('settings.configSaveError')}: ${error.message}`);
      } else {
        toast.success(t('settings.configSaveSuccess'));
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error(t('settings.configSaveError'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('settings.aiConfigTitle')}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          {t('settings.aiConfigSubtitle')}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.aiProvider')}
          </label>
          <Select value={provider} onChange={(e) => setProvider(e.target.value as 'flow' | 'openai')}>
            <option value="flow">Flow API</option>
            <option value="openai">OpenAI</option>
          </Select>
        </div>

        {provider === 'flow' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('settings.apiUrl')}
              </label>
              <Input
                value={flowApiUrl}
                onChange={(e) => setFlowApiUrl(e.target.value)}
                placeholder="https://flow.ciandt.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('settings.clientId')}
              </label>
              <Input
                type="password"
                value={flowClientId}
                onChange={(e) => setFlowClientId(e.target.value)}
                placeholder="Your client ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('settings.clientSecret')}
              </label>
              <Input
                type="password"
                value={flowClientSecret}
                onChange={(e) => setFlowClientSecret(e.target.value)}
                placeholder="Your client secret"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('settings.tenant')}
              </label>
              <Input
                value={flowTenant}
                onChange={(e) => setFlowTenant(e.target.value)}
                placeholder="lithiadw"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('settings.agent')}
              </label>
              <Input
                value={flowAgent}
                onChange={(e) => setFlowAgent(e.target.value)}
                placeholder="mermaid-studio"
              />
            </div>
          </>
        )}

        {provider === 'openai' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('settings.apiKey')}
            </label>
            <Input
              type="password"
              value={openaiApiKey}
              onChange={(e) => setOpenaiApiKey(e.target.value)}
              placeholder="sk-..."
            />
          </div>
        )}
      </div>

      <div className="pt-4">
        <Button onClick={handleSave} disabled={isSaving || isLoading}>
          {isSaving ? t('settings.saving') : isLoading ? t('settings.loading') : t('settings.saveConfig')}
        </Button>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {t('settings.credentialsEncrypted')}
        </p>
      </div>
    </div>
  );
}
