import { Plus, Edit, Trash2, Copy, TestTube, MoreVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';

interface Rule {
  id: string;
  order: number;
  condition: string;
  action: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  active: boolean;
  tested: number;
}

export function RoutingRules() {
  const [rules, setRules] = useState<Rule[]>([
    {
      id: '1',
      order: 1,
      condition: 'If (Type = "Жалоба")',
      action: 'Then Route to "Отдел жалоб"',
      priority: 'High',
      active: true,
      tested: 142,
    },
    {
      id: '2',
      order: 2,
      condition: 'If (Type = "Регулятор")',
      action: 'Then Route to "Регуляторный отдел"',
      priority: 'Critical',
      active: true,
      tested: 28,
    },
    {
      id: '3',
      order: 3,
      condition: 'If (Amount > 100k)',
      action: 'Then Route to "VIP отдел"',
      priority: 'High',
      active: true,
      tested: 56,
    },
  ]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleActive = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, active: !rule.active } : rule
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Маршруты и правила маршрутизации</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00AA44] text-white rounded-lg hover:bg-[#008833] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Добавить правило
        </button>
      </div>

      {/* Таблица */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#0051BA] border-gray-300 rounded focus:ring-[#0051BA]"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                <div className="flex items-center gap-2">
                  Порядок
                  <div className="flex flex-col">
                    <ArrowUp className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600" />
                    <ArrowDown className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600" />
                  </div>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                Условие
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                Действие
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                Приоритет
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wide">
                Активное
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wide">
                Тестирования
              </th>
              <th className="w-12 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rules.map((rule) => (
              <tr key={rule.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(rule.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds([...selectedIds, rule.id]);
                      } else {
                        setSelectedIds(selectedIds.filter(id => id !== rule.id));
                      }
                    }}
                    className="w-4 h-4 text-[#0051BA] border-gray-300 rounded focus:ring-[#0051BA]"
                  />
                </td>
                <td className="px-4 py-3 text-sm font-bold text-gray-800">{rule.order}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{rule.condition}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{rule.action}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(rule.priority)}`}>
                    {rule.priority}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleActive(rule.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      rule.active ? 'bg-[#00AA44]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        rule.active ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-600">{rule.tested}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-200 rounded transition-colors" title="Edit">
                      <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded transition-colors" title="Duplicate">
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded transition-colors" title="Test">
                      <TestTube className="w-4 h-4 text-gray-500" />
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
