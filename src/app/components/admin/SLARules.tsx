import { Plus, Edit, Clock } from 'lucide-react';

interface SLARule {
  type: string;
  deadline: string;
  status: 'active' | 'archive';
  effectiveDate: string;
}

export function SLARules() {
  const rules: SLARule[] = [
    { type: 'Письменные обращения', deadline: '30 дней', status: 'active', effectiveDate: '01.01.2024' },
    { type: 'От регулятора', deadline: '72 часа', status: 'active', effectiveDate: '01.01.2024' },
    { type: 'Устные обращения', deadline: '7 дней', status: 'active', effectiveDate: '01.01.2024' },
    { type: 'Рекламации', deadline: '15 дней', status: 'active', effectiveDate: '01.01.2024' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Заголовок */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-800">Сроки обработки по типам обращений</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#00AA44] text-white rounded-lg hover:bg-[#008833] transition-colors">
            <Plus className="w-4 h-4" />
            Добавить SLA правило
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Текущие сроки утверждены регулятором</span>
        </div>
      </div>

      {/* Таблица */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                Тип обращения
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                Срок (дни/часы)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                Статус
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                Дата вступления в силу
              </th>
              <th className="w-12 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rules.map((rule, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{rule.type}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-[#0051BA]">
                    <Clock className="w-4 h-4" />
                    {rule.deadline}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                    rule.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {rule.status === 'active' ? 'Активный' : 'Архив'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{rule.effectiveDate}</td>
                <td className="px-4 py-3">
                  <button className="p-1 hover:bg-gray-200 rounded transition-colors" title="Edit">
                    <Edit className="w-4 h-4 text-gray-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
