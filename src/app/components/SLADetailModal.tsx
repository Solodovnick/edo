import { useState } from 'react';
import { X, TrendingUp, TrendingDown, BarChart3, Calendar, Target, AlertCircle } from 'lucide-react';

interface SLADetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Array<{
    type: string;
    completed: number;
    total: number;
    icon: string;
  }>;
}

interface DetailedStats {
  type: string;
  icon: string;
  completed: number;
  total: number;
  percentage: number;
  target: number;
  violations: number;
  atRisk: number;
  onTime: number;
  avgResponseTime: string;
  trend: number; // положительное значение = улучшение, отрицательное = ухудшение
  lastWeekPercentage: number;
  bestDay: string;
  worstDay: string;
  topPerformers: string[];
  needsAttention: string[];
}

export function SLADetailModal({ isOpen, onClose, data }: SLADetailModalProps) {
  const [selectedType, setSelectedType] = useState<string>('all');

  // Расширенная статистика для каждого типа
  const detailedStats: DetailedStats[] = [
    {
      type: 'Письменные',
      icon: '📨',
      completed: 27,
      total: 30,
      percentage: 90,
      target: 99,
      violations: 2,
      atRisk: 3,
      onTime: 25,
      avgResponseTime: '18.5 дней',
      trend: -2, // ухудшение на 2%
      lastWeekPercentage: 92,
      bestDay: 'Вторник',
      worstDay: 'Пятница',
      topPerformers: ['Иванов И.И. (98%)', 'Петрова А.С. (96%)', 'Сидоров В.К. (94%)'],
      needsAttention: ['Карточные услуги (-12%)', 'Кредиты (-8%)'],
    },
    {
      type: 'От регулятора',
      icon: '🏛️',
      completed: 12,
      total: 12,
      percentage: 100,
      target: 100,
      violations: 0,
      atRisk: 0,
      onTime: 12,
      avgResponseTime: '1.8 дня',
      trend: 0, // стабильно
      lastWeekPercentage: 100,
      bestDay: 'Все дни',
      worstDay: '-',
      topPerformers: ['Федоров М.А. (100%)', 'Николаева Е.П. (100%)', 'Козлов Д.И. (100%)'],
      needsAttention: [],
    },
    {
      type: 'Устные',
      icon: '📞',
      completed: 45,
      total: 48,
      percentage: 94,
      target: 99,
      violations: 1,
      atRisk: 2,
      onTime: 45,
      avgResponseTime: '4.2 дня',
      trend: 3, // улучшение на 3%
      lastWeekPercentage: 91,
      bestDay: 'Понедельник',
      worstDay: 'Четверг',
      topPerformers: ['Смирнов К.Л. (99%)', 'Волкова О.А. (97%)', 'Морозов А.П. (96%)'],
      needsAttention: ['Жалобы (-5%)'],
    },
  ];

  // Общая статистика
  const totalCompleted = detailedStats.reduce((sum, item) => sum + item.completed, 0);
  const totalCount = detailedStats.reduce((sum, item) => sum + item.total, 0);
  const totalPercentage = Math.round((totalCompleted / totalCount) * 100);
  const totalViolations = detailedStats.reduce((sum, item) => sum + item.violations, 0);
  const totalAtRisk = detailedStats.reduce((sum, item) => sum + item.atRisk, 0);

  // Данные для отображения
  const displayData = selectedType === 'all' 
    ? detailedStats 
    : detailedStats.filter(s => s.type === selectedType);

  const getPercentageColor = (percentage: number, target: number) => {
    if (percentage >= target) return 'text-[#00AA44]';
    if (percentage >= target - 5) return 'text-[#FFAA00]';
    return 'text-[#DD0000]';
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-[#00AA44]" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-[#DD0000]" />;
    return <span className="text-gray-400">━</span>;
  };

  const getTrendText = (trend: number) => {
    if (trend > 0) return `+${trend}% за неделю`;
    if (trend < 0) return `${trend}% за неделю`;
    return 'Без изменений';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden m-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-[#0051BA]" />
              📊 Детальная статистика SLA
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Общая сводка */}
          <div className="grid grid-cols-5 gap-3 mb-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Всего обращений</div>
              <div className="text-2xl font-bold text-gray-800">{totalCount}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
              <div className="text-xs text-gray-600 mb-1">Выполнено</div>
              <div className="text-2xl font-bold text-[#00AA44]">{totalCompleted}</div>
            </div>
            <div className={`rounded-lg p-3 text-center border ${
              totalPercentage >= 99 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="text-xs text-gray-600 mb-1">Общий SLA</div>
              <div className={`text-2xl font-bold ${getPercentageColor(totalPercentage, 99)}`}>
                {totalPercentage}%
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center border border-red-200">
              <div className="text-xs text-gray-600 mb-1">Нарушений</div>
              <div className="text-2xl font-bold text-[#DD0000]">{totalViolations}</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-200">
              <div className="text-xs text-gray-600 mb-1">В зоне риска</div>
              <div className="text-2xl font-bold text-[#FFAA00]">{totalAtRisk}</div>
            </div>
          </div>

          {/* Фильтр по типам */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === 'all'
                  ? 'bg-[#0051BA] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Все типы
            </button>
            {detailedStats.map((stat) => (
              <button
                key={stat.type}
                onClick={() => setSelectedType(stat.type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedType === stat.type
                    ? 'bg-[#0051BA] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{stat.icon}</span>
                {stat.type}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-280px)] p-6">
          <div className="space-y-6">
            {displayData.map((stat) => (
              <div
                key={stat.type}
                className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Заголовок карточки */}
                <div className={`p-4 ${
                  stat.percentage >= stat.target 
                    ? 'bg-green-50 border-b-2 border-green-200' 
                    : stat.percentage >= stat.target - 5
                    ? 'bg-yellow-50 border-b-2 border-yellow-200'
                    : 'bg-red-50 border-b-2 border-red-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{stat.icon}</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{stat.type}</h3>
                        <div className="text-xs text-gray-600">
                          {stat.completed} из {stat.total} обращений
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-4xl font-bold ${getPercentageColor(stat.percentage, stat.target)}`}>
                        {stat.percentage}%
                      </div>
                      <div className="flex items-center gap-1 justify-end mt-1">
                        {getTrendIcon(stat.trend)}
                        <span className={`text-xs font-medium ${
                          stat.trend > 0 ? 'text-[#00AA44]' : stat.trend < 0 ? 'text-[#DD0000]' : 'text-gray-500'
                        }`}>
                          {getTrendText(stat.trend)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Детальная информация */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Левая колонка */}
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            <Target className="w-4 h-4 inline mr-1" />
                            Целевой показатель
                          </span>
                          <span className="text-lg font-bold text-gray-800">{stat.target}%</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {stat.percentage >= stat.target ? (
                            <span className="text-[#00AA44] font-medium">✅ Цель достигнута</span>
                          ) : (
                            <span className="text-[#DD0000] font-medium">
                              ⚠️ Требуется {stat.target - stat.percentage}% для достижения цели
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 bg-green-50 rounded text-center border border-green-200">
                          <div className="text-lg font-bold text-[#00AA44]">{stat.onTime}</div>
                          <div className="text-xs text-gray-600">Вовремя</div>
                        </div>
                        <div className="p-2 bg-red-50 rounded text-center border border-red-200">
                          <div className="text-lg font-bold text-[#DD0000]">{stat.violations}</div>
                          <div className="text-xs text-gray-600">Нарушения</div>
                        </div>
                        <div className="p-2 bg-yellow-50 rounded text-center border border-yellow-200">
                          <div className="text-lg font-bold text-[#FFAA00]">{stat.atRisk}</div>
                          <div className="text-xs text-gray-600">В риске</div>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-xs text-gray-600 mb-1">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          Среднее время ответа
                        </div>
                        <div className="text-lg font-bold text-gray-800">{stat.avgResponseTime}</div>
                      </div>
                    </div>

                    {/* Правая колонка */}
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-600 mb-2 font-medium">
                          <TrendingUp className="w-3 h-3 inline mr-1" />
                          Динамика за неделю
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-gray-600">Прошлая неделя</div>
                            <div className="text-sm font-bold text-gray-700">{stat.lastWeekPercentage}%</div>
                          </div>
                          <div className="text-2xl">→</div>
                          <div>
                            <div className="text-xs text-gray-600">Текущая неделя</div>
                            <div className={`text-sm font-bold ${getPercentageColor(stat.percentage, stat.target)}`}>
                              {stat.percentage}%
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-green-50 rounded border border-green-200">
                          <div className="text-xs text-gray-600 mb-1">Лучший день</div>
                          <div className="text-sm font-bold text-gray-800">{stat.bestDay}</div>
                        </div>
                        <div className="p-2 bg-red-50 rounded border border-red-200">
                          <div className="text-xs text-gray-600 mb-1">Худший день</div>
                          <div className="text-sm font-bold text-gray-800">{stat.worstDay}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Лучшие исполнители */}
                  {stat.topPerformers.length > 0 && (
                    <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-xs font-medium text-gray-700 mb-2">
                        🏆 Лучшие исполнители:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {stat.topPerformers.map((performer, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-white text-gray-700 rounded text-xs border border-green-300"
                          >
                            {performer}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Требуют внимания */}
                  {stat.needsAttention.length > 0 && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-[#DD0000]" />
                        Требуют внимания:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {stat.needsAttention.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-white text-[#DD0000] rounded text-xs border border-red-300 font-medium"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Общие рекомендации */}
          <div className="mt-6 p-4 bg-blue-50 border-2 border-[#0051BA] rounded-lg">
            <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-[#0051BA]" />
              Рекомендации для достижения 99% SLA:
            </h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Приоритизировать обращения от регулятора (100% SLA обязательно)</li>
              <li>• Усилить контроль в подразделениях "Карточные услуги" и "Кредиты"</li>
              <li>• Рассмотреть перераспределение нагрузки между отделами</li>
              <li>• Внедрить автоматическую эскалацию за 24 часа до дедлайна</li>
              <li>• Провести обучение по лучшим практикам для сотрудников с низкими показателями</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
