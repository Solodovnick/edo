import { ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

interface TypeAnalysis {
  type: string;
  count: number;
  percentage: number;
  avgTime: number;
  fcr: number;
  slaDeviation: string;
  mainReason: string;
}

export function TypeAnalysisTable() {
  const [sortColumn, setSortColumn] = useState<keyof TypeAnalysis>('count');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const types: TypeAnalysis[] = [
    {
      type: 'Жалобы на услугу',
      count: 35,
      percentage: 39,
      avgTime: 6.2,
      fcr: 75,
      slaDeviation: '-1 дн',
      mainReason: 'Задержка платежа',
    },
    {
      type: 'Жалобы на качество',
      count: 25,
      percentage: 28,
      avgTime: 5.1,
      fcr: 80,
      slaDeviation: '-2 дн',
      mainReason: 'Отсутствие информации',
    },
    {
      type: 'Регуляторные запросы',
      count: 12,
      percentage: 13,
      avgTime: 2.3,
      fcr: 100,
      slaDeviation: '0 ч',
      mainReason: 'Запрос на проверку',
    },
    {
      type: 'Технические проблемы',
      count: 10,
      percentage: 11,
      avgTime: 4.5,
      fcr: 68,
      slaDeviation: '+3 ч',
      mainReason: 'Сбой в системе',
    },
    {
      type: 'Прочее',
      count: 7,
      percentage: 8,
      avgTime: 4.8,
      fcr: 70,
      slaDeviation: '+5 ч',
      mainReason: 'Разное',
    },
  ];

  const handleSort = (column: keyof TypeAnalysis) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sortedTypes = [...types].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    const direction = sortDirection === 'asc' ? 1 : -1;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * direction;
    }
    return ((aValue as number) - (bValue as number)) * direction;
  });

  const getSLADeviationColor = (deviation: string) => {
    if (deviation.startsWith('-')) return 'text-[#00AA44]';
    if (deviation === '0 ч') return 'text-gray-600';
    return 'text-[#DD0000]';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Анализ обращений по типам</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th
                className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center gap-2">
                  Тип обращения
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th
                className="text-center py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('count')}
              >
                <div className="flex items-center justify-center gap-2">
                  Количество
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th
                className="text-center py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('percentage')}
              >
                <div className="flex items-center justify-center gap-2">
                  % от всего
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th
                className="text-center py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('avgTime')}
              >
                <div className="flex items-center justify-center gap-2">
                  Среднее время (ч)
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th
                className="text-center py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('fcr')}
              >
                <div className="flex items-center justify-center gap-2">
                  FCR (%)
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="text-center py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wide">
                Отклонение от SLA
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wide">
                Основная причина
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTypes.map((type, index) => (
              <tr
                key={type.type}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="py-3 px-4 text-sm font-medium text-gray-800">{type.type}</td>
                <td className="py-3 px-4 text-center text-sm font-bold text-gray-700">
                  {type.count}
                </td>
                <td className="py-3 px-4 text-center text-sm text-gray-700">
                  {type.percentage}%
                </td>
                <td className="py-3 px-4 text-center text-sm text-gray-700">{type.avgTime}</td>
                <td className="py-3 px-4 text-center text-sm">
                  <span
                    className={`${
                      type.fcr >= 90
                        ? 'text-[#00AA44]'
                        : type.fcr >= 70
                        ? 'text-[#FFAA00]'
                        : 'text-[#DD0000]'
                    } font-medium`}
                  >
                    {type.fcr}%
                  </span>
                </td>
                <td className="py-3 px-4 text-center text-sm font-medium">
                  <span className={getSLADeviationColor(type.slaDeviation)}>
                    {type.slaDeviation}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">{type.mainReason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
