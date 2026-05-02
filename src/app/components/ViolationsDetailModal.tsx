import { useState } from 'react';
import { X, Search, AlertTriangle, Clock, User, TrendingUp, Filter } from 'lucide-react';

interface ViolationsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTakeAction?: (violation: any, action: string) => void;
}

interface Violation {
  id: string;
  icon: string;
  client: string;
  subject: string;
  type: string;
  priority: 'critical' | 'high' | 'medium';
  violatedBy: string;
  violatedHours: number;
  assignedTo: string;
  department: string;
  createdDate: string;
  slaDeadline: string;
  escalationLevel: number;
  reason: string;
}

export function ViolationsDetailModal({ isOpen, onClose, onTakeAction }: ViolationsDetailModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Mock данные нарушений SLA
  const violations: Violation[] = [
    {
      id: '12340',
      icon: '🏛️',
      client: 'ООО "Рога & Копыта"',
      subject: 'Проверка по инициативе регулятора (запрос на документы о движении средств по счету)',
      type: 'Регуляторный',
      priority: 'critical',
      violatedBy: '8 часов',
      violatedHours: 8,
      assignedTo: 'Иванов И.И.',
      department: 'Регуляторная работа',
      createdDate: '14.01.2026 10:00',
      slaDeadline: '17.01.2026 10:00',
      escalationLevel: 3,
      reason: 'Не получены документы от бэк-офиса',
    },
    {
      id: '12338',
      icon: '📨',
      client: 'Иванов Петр Сергеевич',
      subject: 'Жалоба на необоснованное списание комиссии за обслуживание карты',
      type: 'Письменный',
      priority: 'high',
      violatedBy: '1 день',
      violatedHours: 24,
      assignedTo: 'Петрова А.С.',
      department: 'Карточные услуги',
      createdDate: '18.12.2025 14:00',
      slaDeadline: '17.01.2026 14:00',
      escalationLevel: 2,
      reason: 'Требуется согласование с юридическим отделом',
    },
    {
      id: '12335',
      icon: '📨',
      client: 'Сидорова Анна Петровна',
      subject: 'Претензия к качеству обслуживания в отделении банка',
      type: 'Письменный',
      priority: 'high',
      violatedBy: '2 дня',
      violatedHours: 48,
      assignedTo: 'Смирнов В.П.',
      department: 'Жалобы',
      createdDate: '16.12.2025 09:00',
      slaDeadline: '15.01.2026 09:00',
      escalationLevel: 2,
      reason: 'Проводится внутреннее расследование',
    },
    {
      id: '12330',
      icon: '📞',
      client: 'Козлов Дмитрий Иванович',
      subject: 'Устная жалоба на блокировку карты без уведомления',
      type: 'Устный',
      priority: 'medium',
      violatedBy: '4 часа',
      violatedHours: 4,
      assignedTo: 'Николаев К.Л.',
      department: 'Карточные услуги',
      createdDate: '17.01.2026 08:00',
      slaDeadline: '18.01.2026 08:00',
      escalationLevel: 1,
      reason: 'Ожидание ответа от службы безопасности',
    },
    {
      id: '12325',
      icon: '🏛️',
      client: 'АО "Первая корпорация"',
      subject: 'Запрос на предоставление информации о комиссиях по распоряжению ЦБ',
      type: 'Регуляторный',
      priority: 'critical',
      violatedBy: '12 часов',
      violatedHours: 12,
      assignedTo: 'Федоров М.А.',
      department: 'Регуляторная работа',
      createdDate: '14.01.2026 18:00',
      slaDeadline: '17.01.2026 18:00',
      escalationLevel: 3,
      reason: 'Сбор данных из нескольких подразделений',
    },
  ];

  // Фильтрация
  const filteredViolations = violations.filter(violation => {
    const matchesSearch = 
      violation.id.includes(searchQuery) ||
      violation.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      violation.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      violation.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || violation.type === filterType;
    const matchesPriority = filterPriority === 'all' || violation.priority === filterPriority;

    return matchesSearch && matchesType && matchesPriority;
  });

  // Группировка по приоритету
  const critical = filteredViolations.filter(v => v.priority === 'critical');
  const high = filteredViolations.filter(v => v.priority === 'high');
  const medium = filteredViolations.filter(v => v.priority === 'medium');

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-50 border-red-300 text-[#DD0000]';
      case 'high':
        return 'bg-orange-50 border-orange-300 text-orange-600';
      case 'medium':
        return 'bg-yellow-50 border-yellow-300 text-[#FFAA00]';
      default:
        return 'bg-gray-50 border-gray-300 text-gray-600';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical': return '🔴 КРИТИЧНО';
      case 'high': return '🟠 ВЫСОКИЙ';
      case 'medium': return '🟡 СРЕДНИЙ';
      default: return priority;
    }
  };

  const getEscalationColor = (level: number) => {
    if (level >= 3) return 'text-[#DD0000] font-bold';
    if (level === 2) return 'text-orange-600 font-bold';
    return 'text-[#FFAA00]';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden m-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-[#DD0000]" />
              🔴 Обращения с нарушением SLA
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Критичная статистика */}
          <div className="bg-red-50 border-2 border-[#DD0000] rounded-lg p-4 mb-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#DD0000]">{violations.length}</div>
                <div className="text-xs text-gray-700">Всего нарушений</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#DD0000]">{critical.length}</div>
                <div className="text-xs text-gray-700">🔴 Критичные</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{high.length}</div>
                <div className="text-xs text-gray-700">🟠 Высокие</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FFAA00]">{medium.length}</div>
                <div className="text-xs text-gray-700">🟡 Средние</div>
              </div>
            </div>
          </div>

          {/* Поиск и фильтры */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по номеру, клиенту, теме или подразделению..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            >
              <option value="all">Все типы</option>
              <option value="Регуляторный">🏛️ Регуляторный</option>
              <option value="Письменный">📨 Письменный</option>
              <option value="Устный">📞 Устный</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            >
              <option value="all">Все приоритеты</option>
              <option value="critical">🔴 Критичные</option>
              <option value="high">🟠 Высокие</option>
              <option value="medium">🟡 Средние</option>
            </select>
          </div>

          <div className="text-xs text-gray-500 mt-2">
            Показано: {filteredViolations.length} из {violations.length} нарушений
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-320px)] p-6">
          {filteredViolations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <div className="text-lg font-medium text-gray-800 mb-2">Нарушений не найдено</div>
              <div className="text-sm text-gray-600">Попробуйте изменить параметры поиска</div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredViolations.map((violation) => (
                <div
                  key={violation.id}
                  className={`p-4 rounded-lg border-2 hover:shadow-lg transition-all ${getPriorityStyle(violation.priority)}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Иконка */}
                    <div className="text-4xl">{violation.icon}</div>

                    {/* Основная информация */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-gray-800">#{violation.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getPriorityStyle(violation.priority)}`}>
                            {getPriorityLabel(violation.priority)}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 border border-red-300 ${getEscalationColor(violation.escalationLevel)}`}>
                            ⚠️ Эскалация: уровень {violation.escalationLevel}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm font-bold text-gray-800 mb-1">{violation.client}</div>
                      <div className="text-sm text-gray-700 mb-3">{violation.subject}</div>

                      {/* Детали нарушения */}
                      <div className="grid grid-cols-2 gap-3 mb-3 p-3 bg-white bg-opacity-50 rounded border border-gray-200">
                        <div>
                          <div className="text-xs text-gray-600 mb-1">⏰ Нарушено на:</div>
                          <div className="text-base font-bold text-[#DD0000]">{violation.violatedBy}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-1">📅 Дедлайн был:</div>
                          <div className="text-sm font-medium text-gray-800">{violation.slaDeadline}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-1">👤 Назначено:</div>
                          <div className="text-sm font-medium text-gray-800">{violation.assignedTo}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-1">🏢 Подразделение:</div>
                          <div className="text-sm font-medium text-gray-800">{violation.department}</div>
                        </div>
                      </div>

                      {/* Причина нарушения */}
                      <div className="p-2 bg-yellow-50 border border-yellow-300 rounded text-xs">
                        <div className="text-gray-600 mb-1">💡 Причина нарушения:</div>
                        <div className="text-gray-800 font-medium">{violation.reason}</div>
                      </div>
                    </div>

                    {/* Действия */}
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      <button
                        onClick={() => {
                          onTakeAction?.(violation, 'escalate');
                          console.log('Эскалировать', violation.id);
                        }}
                        className="px-3 py-2 bg-[#DD0000] text-white rounded text-xs font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <AlertTriangle className="w-3 h-3" />
                        Эскалировать
                      </button>
                      <button
                        onClick={() => {
                          onTakeAction?.(violation, 'take');
                          console.log('Взять в работу', violation.id);
                        }}
                        className="px-3 py-2 bg-[#0051BA] text-white rounded text-xs font-medium hover:bg-[#003d8f] transition-colors"
                      >
                        Взять в работу
                      </button>
                      <button
                        onClick={() => {
                          onTakeAction?.(violation, 'reassign');
                          console.log('Переназначить', violation.id);
                        }}
                        className="px-3 py-2 border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50 transition-colors"
                      >
                        Переназначить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
          <div className="flex-1 flex items-center gap-2 text-sm text-gray-700">
            <AlertTriangle className="w-4 h-4 text-[#DD0000]" />
            <span className="font-medium">Все нарушения требуют немедленного внимания!</span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
