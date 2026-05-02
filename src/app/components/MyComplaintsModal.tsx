import { useState } from 'react';
import { X, Search, Filter, Clock, User, AlertCircle, CheckCircle } from 'lucide-react';

interface MyComplaintsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectComplaint?: (complaint: any) => void;
}

interface Complaint {
  id: string;
  icon: string;
  client: string;
  subject: string;
  type: string;
  status: 'critical' | 'normal' | 'good';
  statusLabel: string;
  remaining: string;
  assignedDate: string;
  priority: 'high' | 'medium' | 'low';
}

export function MyComplaintsModal({ isOpen, onClose, onSelectComplaint }: MyComplaintsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Mock данные "Мои обращения"
  const myComplaints: Complaint[] = [
    {
      id: '12345',
      icon: '📨',
      client: 'Иванов Иван Иванович',
      subject: 'Задержка платежа по карте',
      type: 'Жалоба',
      status: 'critical',
      statusLabel: 'Критично',
      remaining: 'Осталось 4 часа',
      assignedDate: '17.01.2026 14:30',
      priority: 'high',
    },
    {
      id: '12346',
      icon: '🏛️',
      client: 'ООО "Рога и Копыта"',
      subject: 'Запрос документов по счёту',
      type: 'Регуляторный запрос',
      status: 'critical',
      statusLabel: 'Критично',
      remaining: 'Осталось 18 часов',
      assignedDate: '17.01.2026 10:00',
      priority: 'high',
    },
    {
      id: '12347',
      icon: '📞',
      client: 'Сидорова Анна Петровна',
      subject: 'Вопрос по комиссии за обслуживание карты',
      type: 'Запрос',
      status: 'critical',
      statusLabel: 'Критично',
      remaining: 'Осталось 6 часов',
      assignedDate: '16.01.2026 16:45',
      priority: 'high',
    },
    {
      id: '12348',
      icon: '📨',
      client: 'Петров Петр Петрович',
      subject: 'Отказ в кредите без объяснения причин',
      type: 'Жалоба',
      status: 'normal',
      statusLabel: 'Норма',
      remaining: 'Осталось 2 дня',
      assignedDate: '15.01.2026 09:20',
      priority: 'medium',
    },
    {
      id: '12349',
      icon: '📞',
      client: 'Козлова Мария Ивановна',
      subject: 'Грубость сотрудника при посещении отделения',
      type: 'Жалоба',
      status: 'normal',
      statusLabel: 'Норма',
      remaining: 'Осталось 1 день',
      assignedDate: '16.01.2026 11:15',
      priority: 'medium',
    },
    {
      id: '12350',
      icon: '📨',
      client: 'ИП Смирнов А.В.',
      subject: 'Изменение условий по РКО',
      type: 'Запрос',
      status: 'normal',
      statusLabel: 'Норма',
      remaining: 'Осталось 3 дня',
      assignedDate: '17.01.2026 13:00',
      priority: 'medium',
    },
    {
      id: '12351',
      icon: '📞',
      client: 'Волков Сергей Михайлович',
      subject: 'Технический сбой в мобильном приложении',
      type: 'Жалоба',
      status: 'good',
      statusLabel: 'С запасом',
      remaining: 'Осталось 5 дней',
      assignedDate: '15.01.2026 08:00',
      priority: 'low',
    },
    {
      id: '12352',
      icon: '📨',
      client: 'Михайлова Елена Сергеевна',
      subject: 'Вопрос по ипотечному кредиту',
      type: 'Запрос',
      status: 'good',
      statusLabel: 'С запасом',
      remaining: 'Осталось 6 дней',
      assignedDate: '16.01.2026 15:20',
      priority: 'low',
    },
    {
      id: '12353',
      icon: '📞',
      client: 'Борисов Дмитрий Николаевич',
      subject: 'Открытие вклада и вопросы по процентным ставкам',
      type: 'Запрос',
      status: 'good',
      statusLabel: 'С запасом',
      remaining: 'Осталось 4 дня',
      assignedDate: '17.01.2026 12:30',
      priority: 'low',
    },
    {
      id: '12354',
      icon: '📨',
      client: 'Алексеева Ольга Витальевна',
      subject: 'Долгое ожидание в очереди в отделении банка',
      type: 'Жалоба',
      status: 'normal',
      statusLabel: 'Норма',
      remaining: 'Осталось 2 дня',
      assignedDate: '16.01.2026 10:45',
      priority: 'medium',
    },
  ];

  // Фильтрация
  const filteredComplaints = myComplaints.filter(complaint => {
    const matchesSearch = 
      complaint.id.includes(searchQuery) ||
      complaint.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || complaint.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Группировка по статусу
  const critical = filteredComplaints.filter(c => c.status === 'critical');
  const normal = filteredComplaints.filter(c => c.status === 'normal');
  const good = filteredComplaints.filter(c => c.status === 'good');

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-50 border-red-300 text-[#DD0000]';
      case 'normal':
        return 'bg-yellow-50 border-yellow-300 text-[#FFAA00]';
      case 'good':
        return 'bg-green-50 border-green-300 text-[#00AA44]';
      default:
        return 'bg-gray-50 border-gray-300 text-gray-600';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
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
              📌 Мои обращения
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-gray-800">{myComplaints.length}</div>
              <div className="text-xs text-gray-600">Всего открытых</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center border border-red-200">
              <div className="text-2xl font-bold text-[#DD0000]">{critical.length}</div>
              <div className="text-xs text-gray-600">🔴 Критичных</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-200">
              <div className="text-2xl font-bold text-[#FFAA00]">{normal.length}</div>
              <div className="text-xs text-gray-600">🟡 Нормальных</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
              <div className="text-2xl font-bold text-[#00AA44]">{good.length}</div>
              <div className="text-xs text-gray-600">🟢 С запасом</div>
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
                placeholder="Поиск по номеру, клиенту или теме..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            >
              <option value="all">Все статусы</option>
              <option value="critical">🔴 Критичные</option>
              <option value="normal">🟡 Нормальные</option>
              <option value="good">🟢 С запасом</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            >
              <option value="all">Все приоритеты</option>
              <option value="high">🔴 Высокий</option>
              <option value="medium">🟡 Средний</option>
              <option value="low">🟢 Низкий</option>
            </select>
          </div>

          <div className="text-xs text-gray-500 mt-2">
            Показано: {filteredComplaints.length} из {myComplaints.length} обращений
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-280px)] p-6">
          {filteredComplaints.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <div className="text-lg font-medium text-gray-800 mb-2">Обращений не найдено</div>
              <div className="text-sm text-gray-600">Попробуйте изменить параметры поиска</div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  onClick={() => {
                    onSelectComplaint?.(complaint);
                    onClose();
                  }}
                  className={`p-4 rounded-lg border-2 cursor-pointer hover:shadow-md transition-all ${getStatusStyle(complaint.status)}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Иконка */}
                    <div className="text-3xl">{complaint.icon}</div>

                    {/* Основная информация */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-gray-800">#{complaint.id}</span>
                          <span className="text-lg">{getPriorityIcon(complaint.priority)}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getStatusStyle(complaint.status)}`}>
                            {complaint.statusLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          {complaint.remaining}
                        </div>
                      </div>

                      <div className="text-sm font-medium text-gray-800 mb-1">{complaint.client}</div>
                      <div className="text-sm text-gray-700 mb-2 line-clamp-1">{complaint.subject}</div>

                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Тип: {complaint.type}
                        </div>
                        <div>
                          Назначено: {complaint.assignedDate}
                        </div>
                      </div>
                    </div>

                    {/* Действия */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Открыть обращение', complaint.id);
                        }}
                        className="px-3 py-1 bg-[#0051BA] text-white rounded text-xs font-medium hover:bg-[#003d8f] transition-colors"
                      >
                        Открыть
                      </button>
                      {complaint.status === 'critical' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Эскалировать', complaint.id);
                          }}
                          className="px-3 py-1 bg-[#DD0000] text-white rounded text-xs font-medium hover:bg-red-700 transition-colors"
                        >
                          Эскалировать
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
