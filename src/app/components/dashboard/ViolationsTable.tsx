import { AlertTriangle } from 'lucide-react';

interface Violation {
  id: string;
  icon: string;
  client: string;
  subject: string;
  violatedBy: string;
}

interface ViolationsTableProps {
  violations: Violation[];
  onTake?: (violation: Violation) => void;
  onEscalate?: (violation: Violation) => void;
}

export function ViolationsTable({ violations, onTake, onEscalate }: ViolationsTableProps) {
  if (violations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-[#00AA44] mb-2">
          Все обращения в норме! Отличная работа!
        </h3>
        <p className="text-sm text-gray-500">Обновлено 2 минуты назад</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="bg-red-50 px-6 py-4 border-b border-red-200">
        <h2 className="text-lg font-bold text-[#DD0000] flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          🔴 ТРЕБУЮТ НЕМЕДЛЕННОГО ВНИМАНИЯ ({violations.length})
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
                Нарушено
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wide">
                ⚡ Срочное
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {violations.map((violation) => (
              <tr
                key={violation.id}
                className="bg-[#FFE0E0] hover:bg-[#FFCCCB] cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{violation.icon}</span>
                    <span className="text-sm font-mono font-medium text-gray-800">
                      #{violation.id}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                  {violation.client}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 max-w-md truncate">
                  {violation.subject}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-[#DD0000]">
                    Нарушено {violation.violatedBy} 🔴
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="px-3 py-1 bg-[#0051BA] text-white rounded text-xs font-medium hover:bg-[#003d8f] transition-colors"
                      onClick={() => onTake?.(violation)}
                    >
                      Взять
                    </button>
                    <button
                      className="px-3 py-1 bg-[#DD0000] text-white rounded text-xs font-medium hover:bg-red-700 transition-colors"
                      onClick={() => onEscalate?.(violation)}
                    >
                      Эскалировать
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