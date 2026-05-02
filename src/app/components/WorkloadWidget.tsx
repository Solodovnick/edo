import { Send } from 'lucide-react';

interface DepartmentWorkload {
  name: string;
  open: number;
  aht: number;
  fcr: number;
  risk: 'low' | 'medium' | 'high';
}

interface WorkloadWidgetProps {
  data: DepartmentWorkload[];
}

export function WorkloadWidget({ data }: WorkloadWidgetProps) {
  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return 'text-[#00AA44] bg-green-50';
      case 'medium':
        return 'text-[#FFAA00] bg-yellow-50';
      case 'high':
        return 'text-[#DD0000] bg-red-50';
    }
  };

  const getRiskLabel = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return 'Низкий';
      case 'medium':
        return 'Средний';
      case 'high':
        return 'Высокий';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Сегодняшняя нагрузка</h2>
      
      <div className="flex-1 overflow-auto mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 font-medium text-gray-600 text-xs">Подразделение</th>
              <th className="text-center py-2 font-medium text-gray-600 text-xs">Открытых</th>
              <th className="text-center py-2 font-medium text-gray-600 text-xs">AHT (ч)</th>
              <th className="text-center py-2 font-medium text-gray-600 text-xs">FCR %</th>
              <th className="text-center py-2 font-medium text-gray-600 text-xs">Риск</th>
            </tr>
          </thead>
          <tbody>
            {data.map((dept) => (
              <tr key={dept.name} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 text-gray-800">{dept.name}</td>
                <td className="text-center font-bold text-gray-800">{dept.open}</td>
                <td className="text-center text-gray-700">{dept.aht}</td>
                <td className="text-center text-gray-700">{dept.fcr}%</td>
                <td className="text-center">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(dept.risk)}`}>
                    {getRiskLabel(dept.risk)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#0051BA] text-[#0051BA] rounded-lg hover:bg-blue-50 transition-colors text-sm">
        <Send className="w-4 h-4" />
        Отправить инструменту
      </button>
    </div>
  );
}