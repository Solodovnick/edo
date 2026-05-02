import { useState } from 'react';
import { Filter, Download, Search, ChevronDown } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  stage: 'registration' | 'processing' | 'delivery' | 'audit' | 'archive' | 'closed';
  title: string;
  description?: string;
  actor?: string;
}

interface TimelineProtocolProps {
  events: TimelineEvent[];
  onExport?: () => void;
}

const stageConfig = {
  registration: { label: 'Регистрация', color: 'bg-blue-500' },
  processing: { label: 'Обработка', color: 'bg-yellow-500' },
  delivery: { label: 'Доведение', color: 'bg-purple-500' },
  audit: { label: 'Аудит', color: 'bg-indigo-500' },
  archive: { label: 'Архив', color: 'bg-gray-500' },
  closed: { label: 'Закрыто', color: 'bg-gray-700' },
};

export function TimelineProtocol({ events, onExport }: TimelineProtocolProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredEvents = events.filter(event => {
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStage = selectedStages.length === 0 || selectedStages.includes(event.stage);
    
    return matchesSearch && matchesStage;
  });

  const toggleStage = (stage: string) => {
    setSelectedStages(prev =>
      prev.includes(stage) ? prev.filter(s => s !== stage) : [...prev, stage]
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900">Протокол событий</h3>
          {onExport && (
            <button
              onClick={onExport}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Скачать протокол"
            >
              <Download className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по событиям..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Фильтр по этапам</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {showFilters && (
          <div className="mt-3 space-y-2">
            {Object.entries(stageConfig).map(([stage, config]) => (
              <label key={stage} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedStages.includes(stage)}
                  onChange={() => toggleStage(stage)}
                  className="w-4 h-4 text-[#0051BA] border-gray-300 rounded focus:ring-[#0051BA]"
                />
                <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
                <span className="text-sm text-gray-700">{config.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            {searchQuery || selectedStages.length > 0 ? 'Нет событий по заданным фильтрам' : 'Нет событий'}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event, index) => {
              const stageStyle = stageConfig[event.stage];
              const isLast = index === filteredEvents.length - 1;

              return (
                <div key={event.id} className="relative">
                  {!isLast && (
                    <div className="absolute left-2 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                  )}

                  <div className="flex gap-3">
                    <div className={`w-4 h-4 rounded-full ${stageStyle.color} flex-shrink-0 mt-1 relative z-10`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{event.timestamp}</span>
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                      )}
                      {event.actor && (
                        <p className="text-xs text-gray-500">Автор: {event.actor}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
