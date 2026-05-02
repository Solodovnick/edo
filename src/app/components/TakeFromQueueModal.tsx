import { useState } from 'react';
import { X, Filter, Clock } from 'lucide-react';

interface QueueComplaint {
  id: string;
  icon: string;
  client: string;
  subject: string;
  priority: 'high' | 'medium' | 'low';
  remaining: string;
  type: string;
}

interface TakeFromQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTake: (complaintId: string) => void;
}

export function TakeFromQueueModal({ isOpen, onClose, onTake }: TakeFromQueueModalProps) {
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Mock данные очереди
  const queueComplaints: QueueComplaint[] = [
    {
      id: '12360',
      icon: '🏛️',
      client: 'Центральный Банк РФ',
      subject: 'Запрос отчетности по соблюдению нормативов',
      priority: 'high',
      remaining: '18 часов',
      type: 'Регуляторная',
    },
    {
      id: '12361',
      icon: '📨',
      client: 'ООО "Торговый Дом"',
      subject: 'Претензия на задержку платежа',
      priority: 'high',
      remaining: '1 день',
      type: 'Письменное',
    },
    {
      id: '12362',
      icon: '📞',
      client: 'Алексеева Ольга',
      subject: 'Вопрос по кредитной карте',
      priority: 'medium',
      remaining: '3 дня',
      type: 'Устное',
    },
    {
      id: '12363',
      icon: '📨',
      client: 'Петров Сергей',
      subject: 'Запрос выписки по счету',
      priority: 'low',
      remaining: '15 дней',
      type: 'Письменное',
    },
    {
      id: '12364',
      icon: '📞',
      client: 'Иванова Мария',
      subject: 'Жалоба на работу отделения',
      priority: 'medium',
      remaining: '5 дней',
      type: 'Устное',
    },
  ];

  const filteredComplaints = queueComplaints.filter(c => {
    if (filterPriority !== 'all' && c.priority !== filterPriority) return false;
    if (filterType !== 'all' && c.type !== filterType) return false;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-[#DD0000] border-red-300';
      case 'medium': return 'bg-yellow-100 text-[#FFAA00] border-yellow-300';
      case 'low': return 'bg-green-100 text-[#00AA44] border-green-300';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴 Высокий';
      case 'medium': return '🟡 Средний';
      case 'low': return '🟢 Низкий';
      default: return priority;
    }
  };

  const handleTake = (id: string) => {
    onTake(id);
    onClose();
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
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden m-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-800">Взять обращение из очереди</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Фильтры */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">
                <Filter className="w-3 h-3 inline" /> Приоритет
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
              >
                <option value="all">Все</option>
                <option value="high">🔴 Высокий</option>
                <option value="medium">🟡 Средний</option>
                <option value="low">🟢 Низкий</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">
                <Filter className="w-3 h-3 inline" /> Тип
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
              >
                <option value="all">Все</option>
                <option value="Регуляторная">🏛️ Регуляторная</option>
                <option value="Письменное">📨 Письменное</option>
                <option value="Устное">📞 Устное</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh] p-6">
          {filteredComplaints.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <div className="text-lg font-medium text-gray-600">Нет обращений в очереди</div>
              <div className="text-sm text-gray-500 mt-1">Попробуйте изменить фильтры</div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#0051BA] hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleTake(complaint.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl">{complaint.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-medium text-gray-600">
                            #{complaint.id}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(complaint.priority)}`}>
                            {getPriorityLabel(complaint.priority)}
                          </span>
                        </div>
                        <div className="font-medium text-gray-800 mb-1">
                          {complaint.client}
                        </div>
                        <div className="text-sm text-gray-600 truncate">
                          {complaint.subject}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">
                            Осталось {complaint.remaining}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {complaint.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTake(complaint.id);
                      }}
                      className="px-4 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] transition-colors text-sm font-medium whitespace-nowrap"
                    >
                      Взять
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Показано: <strong>{filteredComplaints.length}</strong> из <strong>{queueComplaints.length}</strong> обращений
            </span>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
