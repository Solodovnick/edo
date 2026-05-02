import { RefreshCw, Settings, FileText, CheckCircle, XCircle } from 'lucide-react';

export function EmailIntegration() {
  const syncHistory = [
    { date: '17.01 10:05', status: 'success', count: 12, error: null },
    { date: '17.01 10:00', status: 'success', count: 8, error: null },
    { date: '17.01 09:55', status: 'error', count: 0, error: 'Connection timeout' },
    { date: '17.01 09:50', status: 'success', count: 15, error: null },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Заголовок */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Email интеграция</h2>
      </div>

      {/* Статус интеграции */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Интеграция почты</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-48">Статус:</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#00AA44] rounded-full" />
              <span className="text-sm font-medium text-[#00AA44]">Подключено и работает</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-48">Email адрес:</span>
            <span className="text-sm font-medium text-gray-800">edobank@example.com</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-48">Дата подключения:</span>
            <span className="text-sm text-gray-700">15.01.2023</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-48">Последняя синхронизация:</span>
            <span className="text-sm text-gray-700">2 минуты назад</span>
          </div>
        </div>
      </div>

      {/* Входящие письма */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Входящие письма (за сегодня)</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-[#0051BA] mb-1">42</div>
            <div className="text-sm text-gray-600">Получено писем</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-[#00AA44] mb-1">40</div>
            <div className="text-sm text-gray-600">Обработано</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-[#FFAA00] mb-1">2</div>
            <div className="text-sm text-gray-600">В очереди</div>
          </div>
        </div>
      </div>

      {/* Настройки */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Настройки</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Автоматически создавать обращения из писем</span>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#00AA44]">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
            </button>
          </label>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Фильтр по теме</label>
            <input
              type="text"
              defaultValue="EDO, Жалоба, Запрос"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            />
          </div>

          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Автоответ клиенту</span>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#00AA44]">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
            </button>
          </label>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Текст автоответа</label>
            <textarea
              defaultValue="Спасибо за обращение. Мы получили ваше письмо и ответим в течение 30 дней."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            />
          </div>

          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Архивировать письма</span>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#00AA44]">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
            </button>
          </label>
        </div>
      </div>

      {/* История синхронизаций */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">История синхронизаций</h3>
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Дата</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">Статус</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">Кол-во писем</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Ошибки</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {syncHistory.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-3 text-sm text-gray-700">{item.date}</td>
                <td className="px-4 py-3 text-center">
                  {item.status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-[#00AA44] mx-auto" />
                  ) : (
                    <XCircle className="w-5 h-5 text-[#DD0000] mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3 text-center text-sm font-bold text-gray-800">{item.count}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.error || 'нет'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Кнопки */}
      <div className="flex gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] transition-colors">
          <RefreshCw className="w-4 h-4" />
          Синхронизировать сейчас
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Settings className="w-4 h-4" />
          Переподключить
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <FileText className="w-4 h-4" />
          Логи
        </button>
      </div>
    </div>
  );
}
