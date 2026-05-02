import { useState } from 'react';
import { Calendar, ChevronDown, Download, Settings } from 'lucide-react';
import { KPICards } from './KPICards';
import { TrendCharts } from './TrendCharts';
import { PerformanceTable } from './PerformanceTable';
import { TypeAnalysisTable } from './TypeAnalysisTable';
import { AnalyticsFilters } from './AnalyticsFilters';

export function Analytics() {
  const [period, setPeriod] = useState('7days');
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const periods = [
    { value: '7days', label: 'Последние 7 дней' },
    { value: '30days', label: 'Последние 30 дней' },
    { value: 'quarter', label: 'Квартал' },
    { value: 'year', label: 'Год' },
    { value: 'custom', label: 'Пользовательский' },
  ];

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Верхняя панель */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Аналитика</h2>
            <div className="flex items-center gap-4">
              {/* Выбор периода */}
              <div className="relative">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0051BA] focus:border-transparent bg-white cursor-pointer"
                >
                  {periods.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              {/* Сравнить с предыдущим периодом */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={compareEnabled}
                  onChange={(e) => setCompareEnabled(e.target.checked)}
                  className="w-4 h-4 text-[#0051BA] border-gray-300 rounded focus:ring-[#0051BA]"
                />
                <span className="text-sm text-gray-700">Сравнить с предыдущим периодом</span>
              </label>

              {/* Скачать отчёт */}
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Download className="w-4 h-4" />
                Скачать отчёт
              </button>

              {/* Настроить */}
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Settings className="w-4 h-4" />
                Настроить
              </button>

              {/* Toggle filters */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] transition-colors text-sm"
              >
                {showFilters ? 'Скрыть' : 'Показать'} фильтры
              </button>
            </div>
          </div>
        </div>

        {/* Контент с padding */}
        <div className="p-6">
          {/* KPI Cards */}
          <KPICards />

          {/* Trend Charts */}
          <TrendCharts />

          {/* Performance Table */}
          <PerformanceTable />

          {/* Type Analysis Table */}
          <TypeAnalysisTable />
        </div>
      </main>

      {/* Sidebar Filters */}
      {showFilters && <AnalyticsFilters />}
    </div>
  );
}