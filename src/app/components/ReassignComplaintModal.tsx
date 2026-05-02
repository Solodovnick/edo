import { useState } from 'react';
import { X, User, Users, Search, TrendingUp, Clock } from 'lucide-react';

interface ReassignComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: ReassignData) => void;
  complaint?: {
    id: string;
    icon: string;
    client: string;
    subject: string;
    remaining?: string;
    status: string;
  } | null;
}

interface ReassignData {
  assignTo: string;
  reason: string;
  notifyPrevious: boolean;
  priority: string;
  comments: string;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  load: number;
  activeComplaints: number;
  avgResponseTime: string;
  sla: number;
  status: 'available' | 'busy' | 'overloaded';
}

export function ReassignComplaintModal({ isOpen, onClose, onConfirm, complaint }: ReassignComplaintModalProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [reason, setReason] = useState('');
  const [notifyPrevious, setNotifyPrevious] = useState(true);
  const [priority, setPriority] = useState('normal');
  const [comments, setComments] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock данные сотрудников
  const employees: Employee[] = [
    {
      id: '1',
      name: 'Петров Сергей Павлович',
      department: 'Карточные услуги',
      load: 65,
      activeComplaints: 8,
      avgResponseTime: '3.2ч',
      sla: 96,
      status: 'available',
    },
    {
      id: '2',
      name: 'Иванова Анна Ивановна',
      department: 'Кредиты',
      load: 45,
      activeComplaints: 5,
      avgResponseTime: '2.8ч',
      sla: 98,
      status: 'available',
    },
    {
      id: '3',
      name: 'Сидорова Мария Андреевна',
      department: 'Жалобы',
      load: 85,
      activeComplaints: 15,
      avgResponseTime: '5.1ч',
      sla: 92,
      status: 'busy',
    },
    {
      id: '4',
      name: 'Николаев Дмитрий Владимирович',
      department: 'Регуляторная работа',
      load: 30,
      activeComplaints: 3,
      avgResponseTime: '1.5ч',
      sla: 100,
      status: 'available',
    },
    {
      id: '5',
      name: 'Орлова Татьяна Николаевна',
      department: 'Операции',
      load: 95,
      activeComplaints: 18,
      avgResponseTime: '6.8ч',
      sla: 88,
      status: 'overloaded',
    },
  ];

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-[#00AA44] border-green-300';
      case 'busy': return 'bg-yellow-100 text-[#FFAA00] border-yellow-300';
      case 'overloaded': return 'bg-red-100 text-[#DD0000] border-red-300';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return '🟢 Доступен';
      case 'busy': return '🟡 Занят';
      case 'overloaded': return '🔴 Перегружен';
      default: return status;
    }
  };

  const getLoadColor = (load: number) => {
    if (load >= 90) return 'text-[#DD0000]';
    if (load >= 70) return 'text-[#FFAA00]';
    return 'text-[#00AA44]';
  };

  const handleReassign = () => {
    const employee = employees.find(e => e.id === selectedEmployee);
    if (!employee) return;

    const data: ReassignData = {
      assignTo: employee.name,
      reason,
      notifyPrevious,
      priority,
      comments,
    };
    onConfirm(data);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setSelectedEmployee('');
    setReason('');
    setNotifyPrevious(true);
    setPriority('normal');
    setComments('');
    setSearchQuery('');
  };

  if (!isOpen || !complaint) return null;

  const selectedEmp = employees.find(e => e.id === selectedEmployee);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden m-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0051BA]" />
              Переназначить обращение
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-5">
            {/* Информация об обращении */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{complaint.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-xs text-gray-600">Обращение №</div>
                      <div className="font-mono font-bold text-gray-800">#{complaint.id}</div>
                    </div>
                    {complaint.remaining && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 border border-yellow-300 text-[#FFAA00] rounded-full text-xs font-bold">
                        <Clock className="w-3 h-3" />
                        Осталось {complaint.remaining}
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-medium text-gray-800 mb-1">{complaint.client}</div>
                  <div className="text-xs text-gray-700 mb-2">{complaint.subject}</div>
                  <div className="text-xs">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-medium">
                      {complaint.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Причина переназначения */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Причина переназначения *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
              >
                <option value="">Выберите причину</option>
                <option value="workload">Перераспределение нагрузки</option>
                <option value="expertise">Требуется специальная экспертиза</option>
                <option value="vacation">Отпуск/отсутствие сотрудника</option>
                <option value="escalation">Эскалация в другое подразделение</option>
                <option value="conflict">Конфликт интересов</option>
                <option value="performance">Проблемы с производительностью</option>
                <option value="other">Другая причина</option>
              </select>
            </div>

            {/* Приоритет */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Приоритет после переназначения
              </label>
              <div className="grid grid-cols-3 gap-3">
                <label className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  priority === 'high' 
                    ? 'border-[#DD0000] bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="priority"
                    value="high"
                    checked={priority === 'high'}
                    onChange={(e) => setPriority(e.target.value)}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-2xl mb-1">🔴</div>
                    <div className="text-xs font-medium">Высокий</div>
                  </div>
                </label>

                <label className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  priority === 'normal' 
                    ? 'border-[#FFAA00] bg-yellow-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="priority"
                    value="normal"
                    checked={priority === 'normal'}
                    onChange={(e) => setPriority(e.target.value)}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-2xl mb-1">🟡</div>
                    <div className="text-xs font-medium">Средний</div>
                  </div>
                </label>

                <label className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  priority === 'low' 
                    ? 'border-[#00AA44] bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="priority"
                    value="low"
                    checked={priority === 'low'}
                    onChange={(e) => setPriority(e.target.value)}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-2xl mb-1">🟢</div>
                    <div className="text-xs font-medium">Низкий</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Поиск сотрудника */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Выберите сотрудника *
              </label>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по имени или подразделению..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
                />
              </div>

              {/* Список сотрудников */}
              <div className="border border-gray-300 rounded-lg max-h-[300px] overflow-y-auto">
                {filteredEmployees.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Сотрудники не найдены
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredEmployees.map((employee) => (
                      <label
                        key={employee.id}
                        className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedEmployee === employee.id ? 'bg-blue-50 border-l-4 border-[#0051BA]' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="employee"
                          value={employee.id}
                          checked={selectedEmployee === employee.id}
                          onChange={(e) => setSelectedEmployee(e.target.value)}
                          className="w-4 h-4 text-[#0051BA]"
                        />
                        
                        <div className="w-10 h-10 bg-[#0051BA] rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium text-gray-800 truncate">{employee.name}</div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(employee.status)}`}>
                              {getStatusLabel(employee.status)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 mb-2">{employee.department}</div>
                          
                          <div className="grid grid-cols-4 gap-2 text-xs">
                            <div>
                              <div className="text-gray-500">Нагрузка</div>
                              <div className={`font-bold ${getLoadColor(employee.load)}`}>{employee.load}%</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Активных</div>
                              <div className="font-bold text-gray-700">{employee.activeComplaints}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Ср. время</div>
                              <div className="font-bold text-gray-700">{employee.avgResponseTime}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">SLA</div>
                              <div className={`font-bold ${employee.sla >= 95 ? 'text-[#00AA44]' : employee.sla >= 90 ? 'text-[#FFAA00]' : 'text-[#DD0000]'}`}>
                                {employee.sla}%
                              </div>
                            </div>
                          </div>

                          {/* Рекомендация */}
                          {employee.status === 'available' && employee.load < 70 && (
                            <div className="mt-2 text-xs text-[#00AA44] flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Рекомендован - низкая нагрузка, высокий SLA
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Дополнительные комментарии */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Комментарий для нового исполнителя
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
                placeholder="Укажите важные детали для нового исполнителя..."
              />
            </div>

            {/* Уведомить предыдущего исполнителя */}
            <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={notifyPrevious}
                onChange={(e) => setNotifyPrevious(e.target.checked)}
                className="w-4 h-4 text-[#0051BA] rounded"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">Уведомить предыдущего исполнителя</div>
                <div className="text-xs text-gray-600">Отправить email о переназначении обращения</div>
              </div>
            </label>

            {/* Информация о выбранном сотруднике */}
            {selectedEmp && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  ✅ Обращение будет назначено на:
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#00AA44] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{selectedEmp.name}</div>
                    <div className="text-xs text-gray-600">{selectedEmp.department} • Нагрузка: {selectedEmp.load}%</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Отменить
          </button>
          <button
            onClick={handleReassign}
            disabled={!selectedEmployee || !reason}
            className="flex-1 px-4 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Переназначить обращение
          </button>
        </div>
      </div>
    </div>
  );
}
