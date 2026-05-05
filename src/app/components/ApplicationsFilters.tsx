import { Plus, Search, Pin, ListChecks, User, Building2, Shield } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export interface FilterState {
  search: string;
  category: string;
  slaStatus: string;
}

interface ApplicationsFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  onNewAppeal?: () => void;
}

const CATEGORY_TABS = [
  { id: '', label: 'Все обращения', icon: ListChecks },
  { id: 'mine', label: 'Мои обращения', icon: Pin },
  { id: 'Физ лицо', label: 'Физ. лицо', icon: User },
  { id: 'Юр лицо', label: 'Юр. лицо', icon: Building2 },
  { id: 'Регулятор', label: 'Регулятор', icon: Shield },
] as const;

const SLA_OPTIONS = [
  { id: '', label: 'Все' },
  { id: 'warning', label: 'Близко к дедлайну' },
  { id: 'violated', label: 'В нарушении' },
];

export function ApplicationsFilters({ onFilterChange, onNewAppeal }: ApplicationsFiltersProps) {
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [slaStatus, setSlaStatus] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Emit immediately on category / sla change; debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onFilterChange({ search: searchQuery, category: category === 'mine' ? '' : category, slaStatus });
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, category, slaStatus]);

  return (
    <aside className="w-[240px] bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
      {/* Быстрые действия */}
      <div className="p-4 border-b border-gray-200">
        {onNewAppeal && (
          <button
            onClick={onNewAppeal}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#00AA44] text-white rounded-lg hover:bg-[#008833] transition-colors text-sm font-medium mb-3"
          >
            <Plus className="w-4 h-4" />
            Новое обращение
          </button>
        )}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Поиск по имени, номеру…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
          />
        </div>
      </div>

      {/* FR-04.3 — вкладки фильтрации */}
      <div className="p-3 border-b border-gray-200">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">
          Тип заявителя
        </p>
        <div className="space-y-0.5">
          {CATEGORY_TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCategory(id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                category === id
                  ? 'bg-[#0051BA] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate text-left flex-1">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SLA фильтр */}
      <div className="p-4">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">SLA</p>
        <div className="space-y-2">
          {SLA_OPTIONS.map(({ id, label }) => (
            <label key={id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sla"
                value={id}
                checked={slaStatus === id}
                onChange={() => setSlaStatus(id)}
                className="w-4 h-4 text-[#0051BA] border-gray-300 focus:ring-[#0051BA]"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
