import { Download, Search } from 'lucide-react';

interface LogEntry {
  datetime: string;
  user: string;
  action: string;
  object: string;
  details: string;
  ip: string;
}

export function AuditLog() {
  const logs: LogEntry[] = [
    {
      datetime: '17.01.2026 14:30',
      user: 'Иванов А.И.',
      action: 'Изменено статус',
      object: 'Обращение №12345',
      details: 'Статус изменён с "В работе" на "Готово"',
      ip: '192.168.1.100',
    },
    {
      datetime: '17.01.2026 14:15',
      user: 'Петров С.П.',
      action: 'Создано',
      object: 'Обращение №12356',
      details: 'Новое обращение от клиента Сидоров П.П.',
      ip: '192.168.1.105',
    },
    {
      datetime: '17.01.2026 14:00',
      user: 'Сидорова М.А.',
      action: 'Переназначено',
      object: 'Обращение №12340',
      details: 'Переназначено с Иванова А.И. на Николаева Д.В.',
      ip: '192.168.1.102',
    },
    {
      datetime: '17.01.2026 13:45',
      user: 'Администратор',
      action: 'Скачано',
      object: 'Отчёт по SLA',
      details: 'Экспорт в Excel за период 01.01-17.01.2026',
      ip: '192.168.1.1',
    },
    {
      datetime: '17.01.2026 13:30',
      user: 'Кузнецов Н.Л.',
      action: 'Закрыто',
      object: 'Обращение №12338',
      details: 'Обращение закрыто с резолюцией "Решено"',
      ip: '192.168.1.108',
    },
  ];

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Фильтры слева */}
      <aside className="w-[240px] bg-white border-r border-gray-200 p-4">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
          Фильтры
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Дата от</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Дата до</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Пользователь</label>
            <select
              multiple
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
              size={4}
            >
              <option>Иванов А.И.</option>
              <option>Петров С.П.</option>
              <option>Сидорова М.А.</option>
              <option>Администратор</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Действие</label>
            <select
              multiple
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
              size={5}
            >
              <option>Создано</option>
              <option>Изменено статус</option>
              <option>Переназначено</option>
              <option>Закрыто</option>
              <option>Скачано</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Объект тип</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0051BA] focus:border-transparent">
              <option>Все</option>
              <option>Обращение</option>
              <option>Пользователь</option>
              <option>Правило</option>
              <option>Отчёт</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Основная область */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Логирование и аудит</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Search className="w-4 h-4" />
              Полнотекстовый поиск
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] transition-colors">
              <Download className="w-4 h-4" />
              Экспортировать в CSV
            </button>
          </div>
        </div>

        {/* Таблица логов */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Дата/Время
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Пользователь
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Действие
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Объект
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Детали
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
                  IP адрес
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{log.datetime}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{log.user}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                      log.action === 'Создано' ? 'bg-green-100 text-green-800' :
                      log.action === 'Закрыто' ? 'bg-blue-100 text-blue-800' :
                      log.action === 'Изменено статус' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{log.object}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{log.details}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-mono">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
