import { Check, X } from 'lucide-react';

interface AutoRoutingCardProps {
  complaintId: string;
  type: string;
  recommendedDepartment: string;
  currentLoad: number;
  onAccept?: () => void;
  onSelectOther?: () => void;
}

export function AutoRoutingCard({ complaintId, type, recommendedDepartment, currentLoad, onAccept, onSelectOther }: AutoRoutingCardProps) {
  const getLoadStatus = (load: number) => {
    if (load >= 95) return { text: 'КРИТИЧНО', color: 'text-[#DD0000]', bg: 'bg-red-50' };
    if (load >= 90) return { text: 'ВЫСОКАЯ', color: 'text-[#FFAA00]', bg: 'bg-yellow-50' };
    return { text: 'НОРМА', color: 'text-[#00AA44]', bg: 'bg-green-50' };
  };

  const loadStatus = getLoadStatus(currentLoad);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">🤖 РЕКОМЕНДУЕМОЕ ДЕЙСТВИЕ</h2>

      <div className="space-y-3 mb-6">
        <div>
          <div className="text-xs text-gray-500 mb-1">Обращение:</div>
          <div className="text-lg font-bold text-[#0051BA]">#{complaintId}</div>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">Тип:</div>
          <div className="text-sm font-medium text-gray-800">{type}</div>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">Рекомендация:</div>
          <div className="text-base font-bold text-gray-800">{recommendedDepartment}</div>
        </div>

        <div className={`p-3 ${loadStatus.bg} rounded-lg border border-gray-200`}>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Текущая загрузка:</span>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${loadStatus.color}`}>{currentLoad}%</span>
              <span className="text-sm">✓</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            Статус: <span className={`font-medium ${loadStatus.color}`}>{loadStatus.text}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={onAccept}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#00AA44] text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
        >
          <Check className="w-4 h-4" />
          Согласиться
        </button>
        <button 
          onClick={onSelectOther}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          <X className="w-4 h-4" />
          Выбрать другое
        </button>
      </div>
    </div>
  );
}