import { useState } from 'react';
import { X, Search, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface SelectDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (department: Department) => void;
  complaintId: string;
  complaintType: string;
  currentRecommendation: string;
}

interface Department {
  id: string;
  name: string;
  load: number;
  activeComplaints: number;
  avgResponseTime: string;
  sla: number;
  expertise: string[];
  status: 'available' | 'busy' | 'overloaded';
  isRecommended: boolean;
  recommendationReason?: string;
}

export function SelectDepartmentModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  complaintId, 
  complaintType,
  currentRecommendation 
}: SelectDepartmentModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  // Mock данные подразделений
  const departments: Department[] = [
    {
      id: '1',
      name: 'Отдел CardServices',
      load: 65,
      activeComplaints: 18,
      avgResponseTime: '3.2ч',
      sla: 96,
      expertise: ['Карты', 'Комиссии', 'Переводы'],
      status: 'available',
      isRecommended: true,
      recommendationReason: 'Оптимальная нагрузка + специализация по карточным продуктам',
    },
    {
      id: '2',
      name: 'Кредитный отдел',
      load: 92,
      activeComplaints: 25,
      avgResponseTime: '6.1ч',
      sla: 89,
      expertise: ['Кредиты', 'Ипотека', 'Рефинансирование'],
      status: 'busy',
      isRecommended: false,
    },
    {
      id: '3',
      name: 'Операционный отдел',
      load: 60,
      activeComplaints: 12,
      avgResponseTime: '3.8ч',
      sla: 98,
      expertise: ['Переводы', 'Платежи', 'Операции'],
      status: 'available',
      isRecommended: false,
    },
    {
      id: '4',
      name: 'Отдел обслуживания жалоб',
      load: 105,
      activeComplaints: 22,
      avgResponseTime: '6.8ч',
      sla: 88,
      expertise: ['Жалобы', 'Конфликты', 'Претензии'],
      status: 'overloaded',
      isRecommended: false,
    },
    {
      id: '5',
      name: 'Регуляторная работа',
      load: 40,
      activeComplaints: 8,
      avgResponseTime: '1.5ч',
      sla: 100,
      expertise: ['Регулятор', 'Аудит', 'Комплаенс'],
      status: 'available',
      isRecommended: false,
    },
    {
      id: '6',
      name: 'Отдел РКО',
      load: 75,
      activeComplaints: 16,
      avgResponseTime: '4.5ч',
      sla: 94,
      expertise: ['РКО', 'Юрлица', 'Счета'],
      status: 'busy',
      isRecommended: false,
    },
    {
      id: '7',
      name: 'Служба безопасности',
      load: 55,
      activeComplaints: 10,
      avgResponseTime: '2.8ч',
      sla: 97,
      expertise: ['Мошенничество', 'Блокировки', 'Безопасность'],
      status: 'available',
      isRecommended: false,
    },
    {
      id: '8',
      name: 'Техподдержка',
      load: 88,
      activeComplaints: 20,
      avgResponseTime: '5.2ч',
      sla: 91,
      expertise: ['Интернет-банк', 'Мобильное приложение', 'Технические сбои'],
      status: 'busy',
      isRecommended: false,
    },
  ];

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()))
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
    if (load >= 100) return 'text-[#DD0000] font-bold';
    if (load >= 90) return 'text-[#DD0000]';
    if (load >= 70) return 'text-[#FFAA00]';
    return 'text-[#00AA44]';
  };

  const handleConfirm = () => {
    const dept = departments.find(d => d.id === selectedDepartment);
    if (dept) {
      onConfirm(dept);
      onClose();
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
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden m-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              🏢 Выбрать подразделение для маршрутизации
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Информация об обращении */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-600 mb-1">Обращение</div>
                <div className="font-mono font-bold text-gray-800">#{complaintId}</div>
                <div className="text-sm text-gray-700 mt-1">{complaintType}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600 mb-1">Текущая рекомендация</div>
                <div className="text-sm font-bold text-[#0051BA]">{currentRecommendation}</div>
              </div>
            </div>
          </div>

          {/* Поиск */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию подразделения или специализации..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            />
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-280px)] p-6">
          {filteredDepartments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <div className="text-lg font-medium text-gray-800 mb-2">Подразделения не найдены</div>
              <div className="text-sm text-gray-600">Попробуйте изменить поисковый запрос</div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDepartments.map((dept) => (
                <label
                  key={dept.id}
                  className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedDepartment === dept.id
                      ? 'border-[#0051BA] bg-blue-50 shadow-md'
                      : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
                  } ${dept.isRecommended ? 'ring-2 ring-green-400 ring-offset-2' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Radio button */}
                    <input
                      type="radio"
                      name="department"
                      value={dept.id}
                      checked={selectedDepartment === dept.id}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="w-5 h-5 mt-1 text-[#0051BA]"
                    />

                    {/* Department info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-gray-800">{dept.name}</h3>
                          {dept.isRecommended && (
                            <span className="px-2 py-0.5 bg-green-100 text-[#00AA44] border border-green-300 rounded-full text-xs font-bold flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              РЕКОМЕНДОВАНО
                            </span>
                          )}
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(dept.status)}`}>
                          {getStatusLabel(dept.status)}
                        </span>
                      </div>

                      {dept.isRecommended && dept.recommendationReason && (
                        <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded text-xs text-gray-700 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-[#00AA44] flex-shrink-0 mt-0.5" />
                          <span>{dept.recommendationReason}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-4 gap-4 mb-3">
                        <div>
                          <div className="text-xs text-gray-600">Нагрузка</div>
                          <div className={`text-lg font-bold ${getLoadColor(dept.load)}`}>
                            {dept.load}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Активных</div>
                          <div className="text-lg font-bold text-gray-800">{dept.activeComplaints}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Ср. время</div>
                          <div className="text-lg font-bold text-gray-800">{dept.avgResponseTime}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">SLA</div>
                          <div className={`text-lg font-bold ${
                            dept.sla >= 95 ? 'text-[#00AA44]' : dept.sla >= 90 ? 'text-[#FFAA00]' : 'text-[#DD0000]'
                          }`}>
                            {dept.sla}%
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-600 mb-1">Специализация:</div>
                        <div className="flex flex-wrap gap-1">
                          {dept.expertise.map((exp) => (
                            <span
                              key={exp}
                              className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs"
                            >
                              {exp}
                            </span>
                          ))}
                        </div>
                      </div>

                      {dept.status === 'overloaded' && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-[#DD0000] flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>
                            <strong>Внимание:</strong> Подразделение перегружено. Назначение может привести к нарушению SLA.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Отменить
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedDepartment}
            className="flex-1 px-4 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Назначить на выбранное подразделение
          </button>
        </div>
      </div>
    </div>
  );
}
