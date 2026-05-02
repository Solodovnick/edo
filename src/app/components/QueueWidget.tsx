import { Play, List } from 'lucide-react';

interface QueueData {
  new: number;
  inProgress: number;
  waiting: number;
  readyToSend: number;
}

interface QueueWidgetProps {
  data: QueueData;
}

export function QueueWidget({ data }: QueueWidgetProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Входящая очередь</h2>
      
      <div className="flex-1 space-y-3 mb-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#DD0000] rounded-full" />
            <span className="text-sm font-medium text-gray-700">Новых</span>
          </div>
          <span className="text-2xl font-bold text-gray-800">{data.new}</span>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#0051BA] rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700">В работе</span>
          </div>
          <span className="text-2xl font-bold text-gray-800">{data.inProgress}</span>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#FFAA00] rounded-full" />
            <span className="text-sm font-medium text-gray-700">Ожидают ответ</span>
          </div>
          <span className="text-2xl font-bold text-gray-800">{data.waiting}</span>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00AA44] rounded-full" />
            <span className="text-sm font-medium text-gray-700">Готовы к отправке</span>
          </div>
          <span className="text-2xl font-bold text-gray-800">{data.readyToSend}</span>
        </div>
      </div>

      <div className="space-y-2">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] transition-colors text-sm font-medium">
          <Play className="w-4 h-4" />
          Взять в работу
        </button>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
          <List className="w-4 h-4" />
          Показать очередь
        </button>
      </div>
    </div>
  );
}