import { Mail, Phone, Building2, MoreVertical, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface Application {
  id: string;
  number: string;
  icon: 'mail' | 'phone' | 'building';
  client: string;
  type: string;
  subject: string;
  status: 'new' | 'in-progress' | 'waiting' | 'review' | 'done';
  sla: string;
  slaStatus: 'ok' | 'warning' | 'violated';
  assignedTo: string;
  department: string;
  createdAt: string;
  description: string;
}

interface ApplicationsTableProps {
  applications: Application[];
  onApplicationClick: (app: Application) => void;
}

export function ApplicationsTable({ applications, onApplicationClick }: ApplicationsTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('sla');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    const badges = {
      new: { icon: '🔴', label: 'Новое', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
      'in-progress': { icon: '🟡', label: 'В работе', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
      waiting: { icon: '⏸️', label: 'Ожидание', bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
      review: { icon: '👁️', label: 'На проверке', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      done: { icon: '✅', label: 'Готово', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    };
    return badges[status as keyof typeof badges] || badges.new;
  };

  const getTypeIcon = (icon: 'mail' | 'phone' | 'building') => {
    switch (icon) {
      case 'mail':
        return <Mail className="w-4 h-4 text-[#0051BA]" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-[#00AA44]" />;
      case 'building':
        return <Building2 className="w-4 h-4 text-[#DD0000]" />;
    }
  };

  const getSLABackground = (slaStatus: string) => {
    switch (slaStatus) {
      case 'violated':
        return 'bg-[#FFE0E0]';
      case 'warning':
        return 'bg-[#FFF8DC]';
      default:
        return '';
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(applications.map((app) => app.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  return (
    <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col">
      {/* Заголовок и действия */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">Мои обращения</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Сортировка по:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            >
              <option value="sla">SLA</option>
              <option value="date">Дате</option>
              <option value="type">Типу</option>
              <option value="status">Статусу</option>
            </select>
          </div>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors flex items-center gap-1">
            ☰ Режим
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors flex items-center gap-1">
            ⚙ Столбцы
          </button>
        </div>
      </div>

      {/* Таблица */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.length === applications.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-[#0051BA] border-gray-300 rounded focus:ring-[#0051BA]"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                №
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                Клиент
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                Тип
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                Тема
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                Статус
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                SLA
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                Назначено
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                Подразделение
              </th>
              <th className="w-12 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {applications.map((app) => {
              const statusBadge = getStatusBadge(app.status);
              return (
                <tr
                  key={app.id}
                  onClick={() => onApplicationClick(app)}
                  className={`hover:bg-gray-50 cursor-pointer transition-colors ${getSLABackground(app.slaStatus)}`}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(app.id)}
                      onChange={(e) => handleSelectOne(app.id, e.target.checked)}
                      className="w-4 h-4 text-[#0051BA] border-gray-300 rounded focus:ring-[#0051BA]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(app.icon)}
                      <span className="text-sm font-medium text-gray-800">{app.number}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                        {app.client.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="text-sm text-gray-800">{app.client}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{app.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                    {app.subject}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                      <span>{statusBadge.icon}</span>
                      {statusBadge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${
                      app.slaStatus === 'violated' ? 'text-[#DD0000]' :
                      app.slaStatus === 'warning' ? 'text-[#FFAA00]' :
                      'text-[#00AA44]'
                    }`}>
                      {app.sla}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {app.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#0051BA] rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {app.assignedTo.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm text-gray-800">{app.assignedTo}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {app.department ? (
                      <span className="text-sm text-gray-700 font-medium">{app.department}</span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === app.id ? null : app.id)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                      {openMenuId === app.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                            Открыть
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                            Переназначить
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                            Изменить статус
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                            Добавить заметку
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                            Эскалировать
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                            Добавить в закреплённые
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-[#DD0000]">
                            Закрыть
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Показано: {applications.length} из 45 обращений
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
            &lt;
          </button>
          <button className="px-3 py-1 bg-[#0051BA] text-white rounded text-sm">1</button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
            2
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
            3
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
            4
          </button>
          <span className="px-2 text-sm text-gray-500">...</span>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
            &gt;
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Показать по:</span>
          <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0051BA] focus:border-transparent">
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="all">Все</option>
          </select>
        </div>
      </div>
    </div>
  );
}