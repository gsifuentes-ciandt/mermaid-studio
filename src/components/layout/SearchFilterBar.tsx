import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useDiagramStore } from '@/store/diagramStore';
import { useI18n } from '@/contexts/I18nContext';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useEffect, useState } from 'react';
import type { DiagramType } from '@/types/diagram.types';

const diagramTypeOptions: Array<{ value: DiagramType | 'all'; label: string }> = [
  { value: 'all', label: 'All Types' },
  { value: 'workflow', label: 'Workflow' },
  { value: 'endpoint', label: 'Endpoint/API' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'sequence', label: 'Sequence' },
  { value: 'state', label: 'State Machine' },
  { value: 'other', label: 'Other' }
];

export function SearchFilterBar(): JSX.Element {
  const { t } = useI18n();
  const filters = useDiagramStore((state) => state.filters);
  const setFilters = useDiagramStore((state) => state.setFilters);
  const metadata = useDiagramStore((state) => state.metadata);

  const [searchInput, setSearchInput] = useState(filters.searchTerm);
  const debouncedSearch = useDebouncedValue(searchInput, 300);

  useEffect(() => {
    setFilters({ searchTerm: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  const handleTypeChange = (value: string) => {
    setFilters({ typeFilter: value as DiagramType | 'all' });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl bg-white/90 p-4 shadow-lg backdrop-blur dark:bg-gray-800/90">
      <div className="flex-1 min-w-[250px]">
        <Input
          type="text"
          placeholder={t('search.placeholder')}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          icon={<Search size={18} />}
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('filter.type')}</span>
        <Select
          value={filters.typeFilter}
          onChange={(e) => handleTypeChange(e.target.value)}
          options={diagramTypeOptions}
        />
      </div>

      {filters.searchTerm || filters.typeFilter !== 'all' ? (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {t('showing')} <strong className="text-gray-900 dark:text-white">{metadata.filtered}</strong> {t('of')}{' '}
          <strong className="text-gray-900 dark:text-white">{metadata.total}</strong>
        </span>
      ) : null}
    </div>
  );
}
