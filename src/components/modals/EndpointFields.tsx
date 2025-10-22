import { Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useI18n } from '@/contexts/I18nContext';
import type { Payload } from '@/types/diagram.types';

interface EndpointFieldsProps {
  httpMethod: string;
  setHttpMethod: (value: string) => void;
  endpointPath: string;
  setEndpointPath: (value: string) => void;
  requestPayloads: Payload[];
  setRequestPayloads: (payloads: Payload[]) => void;
  responsePayloads: Payload[];
  setResponsePayloads: (payloads: Payload[]) => void;
}


export function EndpointFields({
  httpMethod,
  setHttpMethod,
  endpointPath,
  setEndpointPath,
  requestPayloads,
  setRequestPayloads,
  responsePayloads,
  setResponsePayloads
}: EndpointFieldsProps): JSX.Element {
  const { t } = useI18n();
  
  const httpMethodOptions = [
    { value: '', label: t('endpoint.methodPlaceholder') },
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'PATCH', label: 'PATCH' },
    { value: 'DELETE', label: 'DELETE' }
  ];
  const addRequestPayload = () => {
    setRequestPayloads([...requestPayloads, { status: '', contentType: 'application/json', json: '' }]);
  };

  const removeRequestPayload = (index: number) => {
    setRequestPayloads(requestPayloads.filter((_, i) => i !== index));
  };

  const updateRequestPayload = (index: number, field: keyof Payload, value: string) => {
    const updated = [...requestPayloads];
    updated[index] = { ...updated[index], [field]: value };
    setRequestPayloads(updated);
  };

  const addResponsePayload = () => {
    setResponsePayloads([...responsePayloads, { status: '200', contentType: 'application/json', json: '' }]);
  };

  const removeResponsePayload = (index: number) => {
    setResponsePayloads(responsePayloads.filter((_, i) => i !== index));
  };

  const updateResponsePayload = (index: number, field: keyof Payload, value: string) => {
    const updated = [...responsePayloads];
    updated[index] = { ...updated[index], [field]: value };
    setResponsePayloads(updated);
  };

  return (
    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
      <div className="mb-4 flex items-center gap-2 text-lg font-bold text-primary-600 dark:text-primary-400">
        🔌 {t('endpoint.title')}
      </div>

      {/* HTTP Method */}
      <div className="mb-4">
        <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">{t('endpoint.method')}</label>
        <Select
          value={httpMethod}
          onChange={(e) => setHttpMethod(e.target.value)}
          options={httpMethodOptions}
        />
      </div>

      {/* Endpoint Path */}
      <div className="mb-4">
        <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">{t('endpoint.path')}</label>
        <Input
          type="text"
          value={endpointPath}
          onChange={(e) => setEndpointPath(e.target.value)}
          placeholder={t('endpoint.pathPlaceholder')}
        />
      </div>

      {/* Request Payloads */}
      <div className="mb-4 border-t border-gray-300 pt-4 dark:border-gray-600">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-semibold text-gray-700 dark:text-gray-300">📥 {t('endpoint.request.title')}</span>
          <button
            type="button"
            onClick={addRequestPayload}
            className="flex items-center gap-1 rounded bg-primary-500 px-3 py-1 text-sm text-white hover:bg-primary-600"
          >
            <Plus size={16} /> {t('endpoint.request.add')}
          </button>
        </div>
        {requestPayloads.map((payload, index) => (
          <div key={index} className="mb-3 rounded-lg border border-gray-300 bg-white p-3 dark:border-gray-600 dark:bg-gray-700">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('endpoint.request.number')} #{index + 1}</span>
              <button
                type="button"
                onClick={() => removeRequestPayload(index)}
                className="flex items-center gap-1 rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
              >
                <X size={14} /> {t('endpoint.request.remove')}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-400">{t('endpoint.request.status')}</label>
                <Input
                  type="text"
                  value={payload.status}
                  onChange={(e) => updateRequestPayload(index, 'status', e.target.value)}
                  placeholder={t('endpoint.request.statusPlaceholder')}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-400">{t('endpoint.request.contentType')}</label>
                <Input
                  type="text"
                  value={payload.contentType}
                  onChange={(e) => updateRequestPayload(index, 'contentType', e.target.value)}
                  placeholder={t('endpoint.request.contentTypePlaceholder')}
                />
              </div>
            </div>
            <div className="mt-2">
              <label className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-400">{t('endpoint.request.json')}</label>
              <Textarea
                value={payload.json}
                onChange={(e) => updateRequestPayload(index, 'json', e.target.value)}
                placeholder={t('endpoint.request.jsonPlaceholder')}
                rows={4}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Response Payloads */}
      <div className="border-t border-gray-300 pt-4 dark:border-gray-600">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-semibold text-gray-700 dark:text-gray-300">📤 {t('endpoint.response.title')}</span>
          <button
            type="button"
            onClick={addResponsePayload}
            className="flex items-center gap-1 rounded bg-primary-500 px-3 py-1 text-sm text-white hover:bg-primary-600"
          >
            <Plus size={16} /> {t('endpoint.response.add')}
          </button>
        </div>
        {responsePayloads.map((payload, index) => (
          <div key={index} className="mb-3 rounded-lg border border-gray-300 bg-white p-3 dark:border-gray-600 dark:bg-gray-700">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('endpoint.response.number')} #{index + 1}</span>
              <button
                type="button"
                onClick={() => removeResponsePayload(index)}
                className="flex items-center gap-1 rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
              >
                <X size={14} /> {t('endpoint.request.remove')}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-400">{t('endpoint.response.statusCode')}</label>
                <Input
                  type="text"
                  value={payload.status}
                  onChange={(e) => updateResponsePayload(index, 'status', e.target.value)}
                  placeholder={t('endpoint.response.statusCodePlaceholder')}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-400">{t('endpoint.request.contentType')}</label>
                <Input
                  type="text"
                  value={payload.contentType}
                  onChange={(e) => updateResponsePayload(index, 'contentType', e.target.value)}
                  placeholder={t('endpoint.request.contentTypePlaceholder')}
                />
              </div>
            </div>
            <div className="mt-2">
              <label className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-400">{t('endpoint.request.json')}</label>
              <Textarea
                value={payload.json}
                onChange={(e) => updateResponsePayload(index, 'json', e.target.value)}
                placeholder={t('endpoint.request.jsonPlaceholder')}
                rows={4}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
