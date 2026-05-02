interface Department {
  name: string;
  open: number;
  load: number;
  avgTime: string;
  sla: number;
  status: string;
  statusIcon: string;
}

interface DepartmentPerformanceTableProps {
  departments: Department[];
}

export function DepartmentPerformanceTable({ departments }: DepartmentPerformanceTableProps) {
  const getLoadBg = (load: number) => {
    if (load > 100) return 'bg-[#FFCDD2]'; // Красный
    if (load >= 90) return 'bg-[#FFE0B2]'; // Оранжевый
    if (load >= 70) return 'bg-[#FFF9C4]'; // Желтый
    return 'bg-[#E8F5E9]'; // Зеленый
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">
          📊 КТО ПЕРЕГРУЖЕН? КТО МОЖЕТ ВЗЯТЬ БОЛЬШЕ?
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                Подразделение
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wide">
                Открытых
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wide">
                Нагрузка %
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wide">
                Среднее время
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wide">
                SLA %
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wide">
                Статус
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {departments.map((dept) => (
              <tr
                key={dept.name}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                  {dept.name}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-lg font-bold text-gray-800">{dept.open}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className={`inline-block px-3 py-1 rounded ${getLoadBg(dept.load)}`}>
                    <span className="text-sm font-bold text-gray-800">{dept.load}% {dept.statusIcon}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-700">
                  {dept.avgTime}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-sm font-bold ${dept.sla >= 95 ? 'text-[#00AA44]' : dept.sla >= 90 ? 'text-[#FFAA00]' : 'text-[#DD0000]'}`}>
                    {dept.sla}%
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium text-gray-700">
                    {dept.statusIcon} {dept.status}
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
