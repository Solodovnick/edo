import { Clock } from 'lucide-react';

interface AtRiskItem {
  id: string;
  icon: string;
  client: string;
  subject: string;
  remaining: string;
  status: string;
}

interface AtRiskTableProps {
  items: AtRiskItem[];
  onTake?: (item: AtRiskItem) => void;
  onReassign?: (item: AtRiskItem) => void;
  onClose?: (item: AtRiskItem) => void;
}

export function AtRiskTable({ items, onTake, onReassign, onClose }: AtRiskTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-200">
        <h2 className="text-lg font-bold text-[#FFAA00] flex items-center gap-2">
          <Clock className="w-5 h-5" />
          🟡 ТРЕБУЮТ ВНИМАНИЯ В БЛИЖАЙШЕЕ ВРЕМЯ ({items.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                №
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                Клиент
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                Тема
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                Осталось
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                Статус
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wide">
                ⚡ Действие
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr
                key={item.id}
                className="bg-[#FFFACD] hover:bg-[#FFFFE0] cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-mono font-medium text-gray-800">
                      #{item.id}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 font-medium whitespace-nowrap">
                  {item.client}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 max-w-md truncate">
                  {item.subject}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold" style={{ color: '#FF8C00' }}>
                    Осталось {item.remaining}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onReassign?.(item);
                      }}
                      className="px-3 py-1 bg-[#0051BA] text-white rounded text-xs font-medium hover:bg-[#003d8f] transition-colors"
                    >
                      Переназначить
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose?.(item);
                      }}
                      className="px-3 py-1 bg-[#00AA44] text-white rounded text-xs font-medium hover:bg-green-600 transition-colors"
                    >
                      Закрыть
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}