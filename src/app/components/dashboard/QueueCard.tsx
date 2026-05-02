interface QueueCardProps {
  newCount: number;
  inProgressCount: number;
  waitingCount: number;
  finalCheckCount: number;
  onTakeFirst?: () => void;
  onShowList?: () => void;
}

export function QueueCard({ newCount, inProgressCount, waitingCount, finalCheckCount, onTakeFirst, onShowList }: QueueCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">📥 ВХОДЯЩАЯ ОЧЕРЕДЬ</h2>

      <div className="space-y-3 mb-6">
        <button className="w-full flex items-center justify-between p-3 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-colors cursor-pointer">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔴</span>
            <span className="text-sm font-medium text-gray-700">НОВЫХ (требуют маршрутизации)</span>
          </div>
          <span className="text-2xl font-bold text-[#DD0000]">{newCount}</span>
        </button>

        <button className="w-full flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer">
          <div className="flex items-center gap-2">
            <span className="text-lg">⏳</span>
            <span className="text-sm font-medium text-gray-700">В РАБОТЕ</span>
          </div>
          <span className="text-2xl font-bold text-[#FFAA00]">{inProgressCount}</span>
        </button>

        <button className="w-full flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
          <div className="flex items-center gap-2">
            <span className="text-lg">⏸️</span>
            <span className="text-sm font-medium text-gray-700">ОЖИДАЮТ ИНФОРМАЦИЮ</span>
          </div>
          <span className="text-2xl font-bold text-[#0051BA]">{waitingCount}</span>
        </button>

        <button className="w-full flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
          <div className="flex items-center gap-2">
            <span className="text-lg">👁️</span>
            <span className="text-sm font-medium text-gray-700">НА ФИНАЛЬНОЙ ПРОВЕРКЕ</span>
          </div>
          <span className="text-2xl font-bold text-purple-600">{finalCheckCount}</span>
        </button>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={onTakeFirst}
          className="flex-1 px-4 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] transition-colors text-sm font-medium"
        >
          Взять первое
        </button>
        <button 
          onClick={onShowList}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          Показать список
        </button>
      </div>
    </div>
  );
}