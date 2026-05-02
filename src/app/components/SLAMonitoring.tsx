import { AlertCircle } from 'lucide-react';

interface SLAData {
  type: string;
  completed: number;
  total: number;
  timeRemaining: string;
  timeUnit: string;
}

interface SLAMonitoringProps {
  data: SLAData[];
}

export function SLAMonitoring({ data }: SLAMonitoringProps) {
  const getPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-[#00AA44]';
    if (percentage >= 85) return 'bg-[#FFAA00]';
    return 'bg-[#DD0000]';
  };

  const getCardColor = (percentage: number) => {
    if (percentage >= 90) return 'border-[#00AA44] bg-green-50';
    if (percentage >= 85) return 'border-[#FFAA00] bg-yellow-50';
    return 'border-[#DD0000] bg-red-50';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Статус обработки (SLA Мониторинг)
      </h2>
      
      <div className="flex-1 grid grid-cols-3 gap-4 mb-4">
        {data.map((item) => {
          const percentage = getPercentage(item.completed, item.total);
          return (
            <div
              key={item.type}
              className={`border-2 rounded-lg p-4 transition-shadow hover:shadow-md ${getCardColor(percentage)}`}
            >
              <div className="text-sm font-medium text-gray-600 mb-2">{item.type}</div>
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {item.completed}/{item.total}
              </div>
              <div className="text-sm text-gray-600 mb-3">
                {percentage >= 90 && <span className="text-[#00AA44]">⭐</span>} {percentage}%
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full ${getStatusColor(percentage)} transition-all`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500">
                Осталось {item.timeUnit}: <span className="font-bold">{item.timeRemaining}</span>
              </div>
            </div>
          );
        })}
      </div>

      <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm border border-[#DD0000] text-[#DD0000] rounded-lg hover:bg-red-50 transition-colors">
        <AlertCircle className="w-4 h-4" />
        Посмотреть в нарушении
      </button>
    </div>
  );
}