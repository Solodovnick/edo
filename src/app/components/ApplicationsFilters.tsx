import { Plus, Search, Pin, Inbox, ListChecks, Star, Calendar } from 'lucide-react';
import { useState } from 'react';

interface ApplicationsFiltersProps {
  onFilterChange: (filters: any) => void;
}

export function ApplicationsFilters({ onFilterChange }: ApplicationsFiltersProps) {
  const [activeTab, setActiveTab] = useState('my-queue');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState({
    new: true,
    inProgress: true,
    waiting: true,
  });
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [slaFilter, setSlaFilter] = useState('all');
  const [typeFilters, setTypeFilters] = useState({
    written: true,
    verbal: true,
    regulatory: true,
  });

  const tabs = [
    { id: 'my-queue', label: 'Мои очередь', icon: Pin },
    { id: 'incoming', label: 'Входящие (Не распределены)', icon: Inbox },
    { id: 'by-status', label: 'По статусам', icon: ListChecks },
    { id: 'favorites', label: 'Избранные', icon: Star },
    { id: 'by-date', label: 'По датам', icon: Calendar },
  ];

  return (
    <aside className="w-[240px] bg-white border-r border-gray-200 overflow-y-auto">
      {/* Быстрые действия */}
      <div className="p-4 border-b border-gray-200">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#00AA44] text-white rounded-lg hover:bg-[#008833] transition-colors text-sm font-medium mb-3">
          <Plus className="w-4 h-4" />
          Новое обращение
        </button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
          />
        </div>
      </div>

      {/* Вкладки фильтров */}
      <div className="p-4 border-b border-gray-200">
        <div className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#0051BA] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="truncate text-left flex-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Фильтры для "Мои очередь" */}
      {activeTab === 'my-queue' && (
        <div className="p-4 space-y-6">
          {/* Статус */}
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Статус
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={statusFilters.new}
                  onChange={(e) =>
                    setStatusFilters({ ...statusFilters, new: e.target.checked })
                  }
                  className="w-4 h-4 text-[#0051BA] border-gray-300 rounded focus:ring-[#0051BA]"
                />
                <span className="text-sm text-gray-700">Новые</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={statusFilters.inProgress}
                  onChange={(e) =>
                    setStatusFilters({ ...statusFilters, inProgress: e.target.checked })
                  }
                  className="w-4 h-4 text-[#0051BA] border-gray-300 rounded focus:ring-[#0051BA]"
                />
                <span className="text-sm text-gray-700">В работе</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={statusFilters.waiting}
                  onChange={(e) =>
                    setStatusFilters({ ...statusFilters, waiting: e.target.checked })
                  }
                  className="w-4 h-4 text-[#0051BA] border-gray-300 rounded focus:ring-[#0051BA]"
                />
                <span className="text-sm text-gray-700">Ожидание</span>
              </label>
            </div>
          </div>

          {/* Срочность */}
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Срочность
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="urgency"
                  value="all"
                  checked={urgencyFilter === 'all'}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                  className="w-4 h-4 text-[#0051BA] border-gray-300 focus:ring-[#0051BA]"
                />
                <span className="text-sm text-gray-700">Все</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="urgency"
                  value="regulatory"
                  checked={urgencyFilter === 'regulatory'}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                  className="w-4 h-4 text-[#0051BA] border-gray-300 focus:ring-[#0051BA]"
                />
                <span className="text-sm text-gray-700">Только регуляторные</span>
              </label>
            </div>
          </div>

          {/* SLA */}
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              SLA
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sla"
                  value="all"
                  checked={slaFilter === 'all'}
                  onChange={(e) => setSlaFilter(e.target.value)}
                  className="w-4 h-4 text-[#0051BA] border-gray-300 focus:ring-[#0051BA]"
                />
                <span className="text-sm text-gray-700">Все</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sla"
                  value="deadline"
                  checked={slaFilter === 'deadline'}
                  onChange={(e) => setSlaFilter(e.target.value)}
                  className="w-4 h-4 text-[#0051BA] border-gray-300 focus:ring-[#0051BA]"
                />
                <span className="text-sm text-gray-700">Близко к дедлайну (&lt;1 дня)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sla"
                  value="violated"
                  checked={slaFilter === 'violated'}
                  onChange={(e) => setSlaFilter(e.target.value)}
                  className="w-4 h-4 text-[#0051BA] border-gray-300 focus:ring-[#0051BA]"
                />
                <span className="text-sm text-gray-700">В нарушении</span>
              </label>
            </div>
          </div>

          {/* Тип */}
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Тип
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={typeFilters.written}
                  onChange={(e) =>
                    setTypeFilters({ ...typeFilters, written: e.target.checked })
                  }
                  className="w-4 h-4 text-[#0051BA] border-gray-300 rounded focus:ring-[#0051BA]"
                />
                <span className="text-sm text-gray-700">Письменные</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={typeFilters.verbal}
                  onChange={(e) =>
                    setTypeFilters({ ...typeFilters, verbal: e.target.checked })
                  }
                  className="w-4 h-4 text-[#0051BA] border-gray-300 rounded focus:ring-[#0051BA]"
                />
                <span className="text-sm text-gray-700">Устные</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={typeFilters.regulatory}
                  onChange={(e) =>
                    setTypeFilters({ ...typeFilters, regulatory: e.target.checked })
                  }
                  className="w-4 h-4 text-[#0051BA] border-gray-300 rounded focus:ring-[#0051BA]"
                />
                <span className="text-sm text-gray-700">От регулятора</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
