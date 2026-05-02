import { AlertCircle, TrendingUp, Zap, Plus } from 'lucide-react';

interface SidebarStats {
  myOpen: number;
  critical: number;
  normal: number;
  withBuffer: number;
}

interface SidebarProps {
  stats: SidebarStats;
  onTakeFromQueue?: () => void;
  onCreateComplaint?: () => void;
  onShowMyComplaints?: () => void;
  onShowViolations?: () => void;
  onShowAtRisk?: () => void;
}

export function Sidebar({ stats, onTakeFromQueue, onCreateComplaint, onShowMyComplaints, onShowViolations, onShowAtRisk }: SidebarProps) {
  const departments = [
    { name: 'Карточные услуги', load: '75%', status: '🟡' },
    { name: 'Кредиты', load: '92%', status: '🔴' },
    { name: 'Операции', load: '60%', status: '🟢' },
    { name: 'Жалобы', load: '105%', status: '🔴' },
  ];

  return (
    <aside className="w-[240px] bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Мои обращения */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
            📌 МОИ ОБРАЩЕНИЯ
            <span className="text-[#0051BA]">({stats.myOpen} открытых)</span>
          </h3>
          <button
            onClick={onCreateComplaint}
            className="w-full py-3 bg-[#00AA44] text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm mb-2 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Создать обращение
          </button>
          <button
            onClick={onTakeFromQueue}
            className="w-full py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium text-sm mb-3"
          >
            Взять из очереди
          </button>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-200">
              <span className="text-sm text-gray-700">🔴 Критичных</span>
              <span className="text-lg font-bold text-[#DD0000]">{stats.critical}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded border border-yellow-200">
              <span className="text-sm text-gray-700">🟡 Нормальных</span>
              <span className="text-lg font-bold text-[#FFAA00]">{stats.normal}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
              <span className="text-sm text-gray-700">🟢 С запасом</span>
              <span className="text-lg font-bold text-[#00AA44]">{stats.withBuffer}</span>
            </div>
          </div>
        </div>

        {/* Мониторинг подразделений */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
            <TrendingUp className="w-4 h-4" />
            МОНИТОРИНГ ПОДРАЗДЕЛЕНИЙ
          </h3>
          <div className="space-y-1">
            {departments.map((dept) => (
              <div
                key={dept.name}
                className="p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">{dept.name}</span>
                  <span className="text-lg">{dept.status}</span>
                </div>
                <div className="text-xs text-gray-600">Нагрузка: {dept.load}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Быстрые действия */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
            <Zap className="w-4 h-4" />
            БЫСТРЫЕ ДЕЙСТВИЯ
          </h3>
          <div className="space-y-2">
            <button 
              onClick={onShowViolations}
              className="w-full flex items-center gap-2 p-2 bg-red-50 border border-[#DD0000] text-[#DD0000] rounded hover:bg-red-100 transition-colors text-sm font-medium"
            >
              <AlertCircle className="w-4 h-4" />
              Обращения в нарушении
            </button>
            <button 
              onClick={onShowAtRisk}
              className="w-full flex items-center gap-2 p-2 bg-yellow-50 border border-[#FFAA00] text-[#FFAA00] rounded hover:bg-yellow-100 transition-colors text-sm"
            >
              Близко к дедлайну
            </button>
            <button 
              onClick={onShowMyComplaints}
              className="w-full flex items-center gap-2 p-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm"
            >
              Все мои обращения
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}