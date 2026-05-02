import { AlertCircle } from 'lucide-react';

interface SLAItem {
  type: string;
  completed: number;
  total: number;
  icon: string;
}

interface SLAStatusCardProps {
  data: SLAItem[];
  onViewViolations?: () => void;
  onViewDetails?: () => void;
}

export function SLAStatusCard({ data, onViewViolations, onViewDetails }: SLAStatusCardProps) {
  const totalCompleted = data.reduce((sum, item) => sum + item.completed, 0);
  const totalCount = data.reduce((sum, item) => sum + item.total, 0);
  const totalPercentage = Math.round((totalCompleted / totalCount) * 100);
  const hasViolations = totalPercentage < 99;

  const getPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  const getStatusIcon = (percentage: number) => {
    return percentage === 100 ? '✅' : '⚠️';
  };

  const getBarColor = (percentage: number) => {
    if (percentage >= 95) return 'bg-[#00AA44]';
    if (percentage >= 90) return 'bg-[#FFAA00]';
    return 'bg-[#DD0000]';
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-6 transition-all ${
        hasViolations ? 'border-2 border-[#DD0000] animate-pulse-subtle' : ''
      }`}
    >
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        {hasViolations ? '🔴' : '✅'} СТАТУС SLA
      </h2>

      <div className="space-y-3 mb-4">
        {data.map((item) => {
          const percentage = getPercentage(item.completed, item.total);
          return (
            <div key={item.type} className="cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{item.type}:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800">
                    {item.completed}/{item.total} ({percentage}%)
                  </span>
                  <span>{getStatusIcon(percentage)}</span>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getBarColor(percentage)} transition-all`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800 mb-1">
            ВСЕГО: {totalCompleted}/{totalCount} ({totalPercentage}%)
          </div>
          <div className="text-sm text-gray-600">
            Цель: <span className="font-bold text-[#00AA44]">99%</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onViewViolations}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#DD0000] text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          <AlertCircle className="w-4 h-4" />
          Просмотреть нарушения
        </button>
        <button
          onClick={onViewDetails}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          Подробно
        </button>
      </div>
    </div>
  );
}