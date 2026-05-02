import { ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

interface Department {
  name: string;
  volume: number;
  aht: number;
  fcr: number;
  sla: number;
  status: 'success' | 'warning' | 'critical';
}

export function PerformanceTable() {
  const [sortColumn, setSortColumn] = useState<keyof Department>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const departments: Department[] = [
    { name: 'Карточные услуги', volume: 28, aht: 4.2, fcr: 87, sla: 96, status: 'success' },
    { name: 'Кредиты', volume: 35, aht: 6.8, fcr: 78, sla: 88, status: 'warning' },
    { name: 'Операции', volume: 42, aht: 3.5, fcr: 92, sla: 98, status: 'success' },
    { name: 'Жалобы', volume: 18, aht: 8.2, fcr: 65, sla: 82, status: 'critical' },
  ];

  const handleSort = (column: keyof Department) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedDepartments = [...departments].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    const direction = sortDirection === 'asc' ? 1 : -1;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * direction;
    }
    return ((aValue as number) - (bValue as number)) * direction;
  });

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50';
      case 'warning':
        return 'bg-yellow-50';
      case 'critical':
        return 'bg-red-50';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '🟢';
      case 'warning':
        return '🟡';
      case 'critical':
        return '🔴';
      default:
        return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Норма';
      case 'warning':
        return 'Предупреждение';
      case 'critical':
        return 'Критично';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Производительность подразделений</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th
                className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  Подразделение
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th
                className="text-center py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('volume')}
              >
                <div className="flex items-center justify-center gap-2">
                  Объём
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th
                className="text-center py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('aht')}
              >
                <div className="flex items-center justify-center gap-2">
                  AHT (ч)
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
              <th
                className="text-center py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('sla')}
              >
                <div className="flex items-center justify-center gap-2">
                  SLA соответствие (%)
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="text-center py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wide">
                Статус
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedDepartments.map((dept) => (
              <tr
                key={dept.name}
                className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${getStatusBg(dept.status)}`}
              >
                <td className="py-3 px-4 text-sm font-medium text-gray-800">{dept.name}</td>
                <td className="py-3 px-4 text-center text-sm text-gray-700 font-bold">
                  {dept.volume}
                </td>
                <td className="py-3 px-4 text-center text-sm text-gray-700">{dept.aht}</td>
                <td className="py-3 px-4 text-center text-sm text-gray-700">{dept.fcr}%</td>
                <td className="py-3 px-4 text-center text-sm font-medium">
                  <span
                    className={`${
                      dept.sla >= 95
                        ? 'text-[#00AA44]'
                        : dept.sla >= 85
                        ? 'text-[#FFAA00]'
                        : 'text-[#DD0000]'
                    }`}
                  >
                    {dept.sla}%
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center gap-2 text-sm">
                    <span>{getStatusIcon(dept.status)}</span>
                    <span className="text-gray-700">{getStatusText(dept.status)}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
