import { Plus, FileText } from 'lucide-react';

export function AnalyticsFilters() {
  const savedReports = [
    'Дневной отчёт управленцам',
    'Еженедельный отчёт по SLA',
    'Анализ нарушений',
  ];

  return (
    <aside className="w-[280px] bg-white border-l border-gray-200 p-4 overflow-y-auto">
      {/* Срезы и фильтры */}
      <div className="mb-6">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
          Срезы и фильтры
        </h3>
        <div className="space-y-4">
          {/* Фильтр по подразделению */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Подразделение
            </label>
            <select
              multiple
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
              size={4}
            >
              <option value="cards">Карточные услуги</option>
              <option value="credits">Кредиты</option>
              <option value="operations">Операции</option>
              <option value="complaints">Жалобы</option>
            </select>
          </div>

          {/* Фильтр по типу */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Тип</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-[#0051BA] border-gray-300 rounded focus:ring-[#0051BA]"
                />
                <span className="text-sm text-gray-700">Письменные</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-[#0051BA] border-gray-300 rounded focus:ring-[#0051BA]"
                />
                <span className="text-sm text-gray-700">Устные</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-[#0051BA] border-gray-300 rounded focus:ring-[#0051BA]"
                />
                <span className="text-sm text-gray-700">Регуляторные</span>
              </label>
            </div>
          </div>

          {/* Фильтр по статусу */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Статус</label>
            <select
              multiple
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
              size={5}
            >
              <option value="new">Новые</option>
              <option value="in-progress">В работе</option>
              <option value="waiting">Ожидание</option>
              <option value="review">На проверке</option>
              <option value="done">Готово</option>
            </select>
          </div>

          {/* Фильтр по причине */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Причина</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0051BA] focus:border-transparent">
              <option value="all">Все причины</option>
              <option value="payment-delay">Задержка платежа</option>
              <option value="commission">Комиссия</option>
              <option value="technical">Технический сбой</option>
              <option value="service-refusal">Отказ в услуге</option>
              <option value="staff">Невежество сотрудника</option>
            </select>
          </div>
        </div>
      </div>

      {/* Сохранённые отчёты */}
      <div>
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
          Сохранённые отчёты
        </h3>
        <div className="space-y-2 mb-4">
          {savedReports.map((report) => (
            <button
              key={report}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4 text-[#0051BA]" />
              <span className="truncate text-left flex-1">{report}</span>
            </button>
          ))}
        </div>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] transition-colors text-sm">
          <Plus className="w-4 h-4" />
          Создать отчёт
        </button>
      </div>
    </aside>
  );
}
