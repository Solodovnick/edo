import { useState } from 'react';
import { 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Users,
  FileText,
  ThumbsDown,
  CheckCircle,
  XCircle,
  BarChart3,
  Download,
  RefreshCw,
  UserX,
  Activity,
  Building2
} from 'lucide-react';

export function ManagerCabinetPage() {
  const [activeProblemsTab, setActiveProblemsTab] = useState<'pool' | 'transfers'>('pool');

  // KPI Data
  const kpi = {
    slaCompliance: 94,
    slaTarget: 99,
    inProgress: 142,
    overdue: 5,
    negativeToday: 2,
  };

  // Problematic Appeals (Pool > 30 min)
  const poolAppeals = [
    { id: 'REQ-8901', category: 'Кредиты', waitTime: '45 мин', priority: 'high' },
    { id: 'REQ-8889', category: 'Карты', waitTime: '38 мин', priority: 'medium' },
    { id: 'REQ-8876', category: 'Вклады', waitTime: '32 мин', priority: 'medium' },
  ];

  // Transfer Requests
  const transferRequests = [
    {
      id: '123',
      employeeName: 'Иванов А.А.',
      appealId: 'REQ-8901',
      reason: 'Не мой профиль - требуется юридическая экспертиза',
    },
  ];

  // Employees
  const employees = [
    { name: 'Петрова М.С.', status: 'online', activeTasks: 15, slaRisk: 2, load: 75 },
    { name: 'Сидоров И.И.', status: 'online', activeTasks: 12, slaRisk: 0, load: 60 },
    { name: 'Кузнецова А.А.', status: 'vacation', activeTasks: 0, slaRisk: 0, load: 0 },
    { name: 'Смирнов П.П.', status: 'online', activeTasks: 18, slaRisk: 3, load: 90 },
    { name: 'Новикова Е.Е.', status: 'sick', activeTasks: 0, slaRisk: 0, load: 0 },
  ];

  // Negative Feedback
  const negativeFeedback = [
    {
      id: 1,
      client: 'Петров П.П.',
      auditor: 'Сидорова (ГКК)',
      reason: 'Грубый ответ сотрудника',
      responsible: 'Смирнов',
      appealId: 'REQ-8765',
    },
    {
      id: 2,
      client: 'Иванова А.А.',
      auditor: 'Козлова (ГКК)',
      reason: 'Не решена проблема полностью',
      responsible: 'Петрова',
      appealId: 'REQ-8701',
    },
  ];

  // SLA Monitoring by Type
  const slaByType = [
    { type: 'Регулятор (3 дня)', compliance: 98, color: 'green' },
    { type: 'Устные (7 дней)', compliance: 91, color: 'yellow' },
    { type: 'Письменные (15 дней)', compliance: 96, color: 'green' },
  ];

  // Department Efficiency
  const departments = [
    { name: 'Юридический отдел', avgResponseTime: '18 ч', delayed: false },
    { name: 'ИТ-поддержка', avgResponseTime: '4 ч', delayed: false },
    { name: 'Кредитный департамент', avgResponseTime: '28 ч', delayed: true },
  ];

  const handleAssignManually = (appealId: string) => {
    alert(`Назначение обращения ${appealId} вручную`);
  };

  const handleApproveTransfer = (requestId: string) => {
    alert(`Перевод обращения ${requestId} одобрен`);
  };

  const handleRejectTransfer = (requestId: string) => {
    alert(`Перевод обращения ${requestId} отклонён`);
  };

  const handleCreateTask = (feedbackId: number) => {
    alert(`Создание задачи на разбор по отзыву #${feedbackId}`);
  };

  const handleExportReport = () => {
    alert('Выгрузка полного отчёта в Excel...');
  };

  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5]">
      <div className="flex-1 overflow-hidden flex flex-col p-4 gap-3">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-0.5">Ситуационный центр ДУКО</h1>
          <p className="text-xs text-gray-600">Управление нагрузкой и контроль качества</p>
        </div>

        {/* KPI Summary */}
        <div className="grid grid-cols-4 gap-3">
          {/* Card 1: SLA Compliance */}
          <div className={`bg-white rounded-lg border-2 p-4 shadow-sm ${
            kpi.slaCompliance < kpi.slaTarget ? 'border-red-400' : 'border-green-400'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Соблюдение сроков (SLA)</h3>
              {kpi.slaCompliance < kpi.slaTarget ? (
                <TrendingDown className="w-5 h-5 text-red-600" />
              ) : (
                <TrendingUp className="w-5 h-5 text-green-600" />
              )}
            </div>
            <div className={`text-3xl font-bold mb-1 ${
              kpi.slaCompliance < kpi.slaTarget ? 'text-red-600' : 'text-green-600'
            }`}>
              {kpi.slaCompliance}%
            </div>
            <div className="text-xs text-gray-500">Цель: {kpi.slaTarget}%</div>
            {kpi.slaCompliance < kpi.slaTarget && (
              <div className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Отклонение: -{kpi.slaTarget - kpi.slaCompliance}%
              </div>
            )}
          </div>

          {/* Card 2: In Progress */}
          <div className="bg-white rounded-lg border-2 border-blue-400 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">В работе</h3>
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">{kpi.inProgress}</div>
            <div className="text-xs text-gray-500">обращений</div>
          </div>

          {/* Card 3: Overdue */}
          <div className="bg-white rounded-lg border-2 border-amber-400 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Просрочено</h3>
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-3xl font-bold text-amber-600 mb-1">{kpi.overdue}</div>
            <div className="text-xs text-gray-600">Требуют срочного внимания</div>
          </div>

          {/* Card 4: Negative Feedback */}
          <div className="bg-white rounded-lg border-2 border-gray-300 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Негативных отзывов</h3>
              <ThumbsDown className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-3xl font-bold text-gray-700 mb-1">{kpi.negativeToday}</div>
            <div className="text-xs text-gray-500">сегодня</div>
          </div>
        </div>

        {/* Main Content - 2 Columns */}
        <div className="flex-1 grid grid-cols-10 gap-3 overflow-hidden">
          {/* Left Column - Operations (40%) */}
          <div className="col-span-4 space-y-3 overflow-y-auto">
            {/* Problem Zones Widget */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-3 border-b border-gray-200">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-blue-600" />
                  Проблемные зоны
                </h2>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveProblemsTab('pool')}
                  className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeProblemsTab === 'pool'
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Пул &gt; 30 мин ({poolAppeals.length})
                </button>
                <button
                  onClick={() => setActiveProblemsTab('transfers')}
                  className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeProblemsTab === 'transfers'
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Запросы на отказ ({transferRequests.length})
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-3">
                {activeProblemsTab === 'pool' && (
                  <div className="space-y-2">
                    {poolAppeals.map((appeal) => (
                      <div key={appeal.id} className="p-2 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-center justify-between mb-1.5">
                          <div>
                            <div className="font-bold text-gray-900 text-sm">{appeal.id}</div>
                            <div className="text-xs text-gray-600">{appeal.category}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold text-amber-600">
                              {appeal.waitTime}
                            </div>
                            <div className="text-xs text-gray-500">простоя</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAssignManually(appeal.id)}
                          className="w-full px-2 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium transition-colors"
                        >
                          Назначить вручную
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {activeProblemsTab === 'transfers' && (
                  <div className="space-y-2">
                    {transferRequests.map((request) => (
                      <div key={request.id} className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="mb-2">
                          <div className="font-bold text-gray-900 mb-0.5 text-sm">
                            {request.employeeName}
                          </div>
                          <div className="text-xs text-gray-600 mb-0.5">
                            Обращение: {request.appealId}
                          </div>
                          <div className="text-xs text-gray-700 italic">
                            "{request.reason}"
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleApproveTransfer(request.id)}
                            className="flex-1 px-2 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-medium transition-colors"
                          >
                            Одобрить перевод
                          </button>
                          <button
                            onClick={() => handleRejectTransfer(request.id)}
                            className="flex-1 px-2 py-1.5 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-xs font-medium transition-colors"
                          >
                            Отклонить
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Employees & Load Widget */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-3 border-b border-gray-200">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  Сотрудники и Нагрузка
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-1.5 text-left font-medium text-gray-700">ФИО / Статус</th>
                      <th className="px-3 py-1.5 text-center font-medium text-gray-700">Активных</th>
                      <th className="px-3 py-1.5 text-center font-medium text-gray-700">SLA Риск</th>
                      <th className="px-3 py-1.5 text-left font-medium text-gray-700">Загрузка</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              emp.status === 'online' ? 'bg-green-500' :
                              emp.status === 'vacation' ? 'bg-gray-400' :
                              'bg-red-400'
                            }`}></div>
                            <span className="font-medium text-gray-900">{emp.name}</span>
                          </div>
                          <div className="text-xs text-gray-500 ml-3">
                            {emp.status === 'online' ? 'Онлайн' :
                             emp.status === 'vacation' ? 'Отпуск' : 'Больничный'}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className="font-bold text-gray-900">{emp.activeTasks}</span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          {emp.slaRisk > 0 ? (
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                              {emp.slaRisk}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  emp.load >= 80 ? 'bg-red-500' :
                                  emp.load >= 60 ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: `${emp.load}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-600 w-8">
                              {emp.load}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Quality & Analytics (60%) */}
          <div className="col-span-6 space-y-3 overflow-y-auto">
            {/* Negative Feedback Widget */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-3 border-b border-gray-200">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <ThumbsDown className="w-4 h-4 text-red-600" />
                  Лента Негатива (Аудит)
                </h2>
                <p className="text-xs text-gray-600">Последние оценки "Не удовлетворён"</p>
              </div>

              <div className="p-3 space-y-2">
                {negativeFeedback.map((feedback) => (
                  <div key={feedback.id} className="p-2.5 bg-red-50 rounded-lg border border-red-200">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <div className="text-xs text-gray-600">Клиент</div>
                        <div className="font-bold text-gray-900 text-sm">{feedback.client}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Обращение</div>
                        <div className="font-medium text-blue-600 text-sm">{feedback.appealId}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Аудитор</div>
                        <div className="font-medium text-gray-900 text-sm">{feedback.auditor}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Ответственный</div>
                        <div className="font-medium text-gray-900 text-sm">{feedback.responsible}</div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="text-xs text-gray-600 mb-0.5">Причина</div>
                      <div className="text-xs text-red-800 font-medium italic">
                        "{feedback.reason}"
                      </div>
                    </div>
                    <button
                      onClick={() => handleCreateTask(feedback.id)}
                      className="w-full px-2 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-medium transition-colors"
                    >
                      Создать задачу на разбор / Вернуть в работу
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SLA Monitoring by Type Widget */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-3 border-b border-gray-200">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                  Мониторинг сроков по типам
                </h2>
              </div>

              <div className="p-3">
                <div className="space-y-2">
                  {slaByType.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">{item.type}</span>
                        <span className={`text-base font-bold ${
                          item.color === 'green' ? 'text-green-600' :
                          item.color === 'yellow' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {item.compliance}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            item.color === 'green' ? 'bg-green-500' :
                            item.color === 'yellow' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${item.compliance}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Department Efficiency Widget */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-3 border-b border-gray-200">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  Эффективность смежников
                </h2>
              </div>

              <div className="p-3">
                <div className="space-y-2">
                  {departments.map((dept, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-lg border-2 ${
                        dept.delayed
                          ? 'bg-red-50 border-red-300'
                          : 'bg-green-50 border-green-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{dept.name}</div>
                          <div className="text-xs text-gray-600">Среднее время ответа</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xl font-bold ${
                            dept.delayed ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {dept.avgResponseTime}
                          </div>
                          {dept.delayed && (
                            <div className="text-xs text-red-600 font-medium flex items-center gap-1 justify-end">
                              <AlertTriangle className="w-3 h-3" />
                              &gt; 24ч
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <RefreshCw className="w-3.5 h-3.5" />
              Синхронизация с HR: 10 мин назад
            </div>
            <button
              onClick={handleExportReport}
              className="px-4 py-1.5 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] font-medium transition-colors flex items-center gap-1.5 text-sm"
            >
              <Download className="w-4 h-4" />
              Выгрузить полный отчёт (Excel)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}