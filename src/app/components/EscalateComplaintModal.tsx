import { useState } from 'react';
import { X, AlertTriangle, Users, MessageSquare, Send } from 'lucide-react';

interface EscalateComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: EscalationData) => void;
  complaint?: {
    id: string;
    icon: string;
    client: string;
    subject: string;
    violatedBy?: string;
  } | null;
}

interface EscalationData {
  level: string;
  reason: string;
  urgency: string;
  notifyList: string[];
  additionalComments: string;
}

export function EscalateComplaintModal({ isOpen, onClose, onConfirm, complaint }: EscalateComplaintModalProps) {
  const [escalationLevel, setEscalationLevel] = useState('manager');
  const [reason, setReason] = useState('');
  const [urgency, setUrgency] = useState('high');
  const [additionalComments, setAdditionalComments] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([
    'manager',
    'compliance',
  ]);

  const notificationOptions = [
    { id: 'manager', label: 'Руководитель подразделения', required: true },
    { id: 'compliance', label: 'Отдел Compliance', required: false },
    { id: 'ceo', label: 'CEO', required: false },
    { id: 'legal', label: 'Юридический отдел', required: false },
  ];

  const handleEscalate = () => {
    const data: EscalationData = {
      level: escalationLevel,
      reason,
      urgency,
      notifyList: selectedNotifications,
      additionalComments,
    };
    onConfirm(data);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setEscalationLevel('manager');
    setReason('');
    setUrgency('high');
    setAdditionalComments('');
    setSelectedNotifications(['manager', 'compliance']);
  };

  const toggleNotification = (id: string) => {
    const option = notificationOptions.find(opt => opt.id === id);
    if (option?.required) return; // Нельзя убрать обязательные

    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter(n => n !== id));
    } else {
      setSelectedNotifications([...selectedNotifications, id]);
    }
  };

  if (!isOpen || !complaint) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#DD0000]" />
            Эскалировать обращение
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Информация об обращении */}
          <div className="bg-red-50 rounded-lg p-4 border-2 border-[#DD0000]">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">{complaint.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-xs text-gray-600">Обращение №</div>
                    <div className="font-mono font-bold text-gray-800">#{complaint.id}</div>
                  </div>
                  {complaint.violatedBy && (
                    <div className="px-3 py-1 bg-[#DD0000] text-white rounded-full text-xs font-bold">
                      Нарушено {complaint.violatedBy}
                    </div>
                  )}
                </div>
                <div className="text-sm font-medium text-gray-800 mb-1">{complaint.client}</div>
                <div className="text-xs text-gray-700">{complaint.subject}</div>
              </div>
            </div>
          </div>

          {/* Уровень эскалации */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Уровень эскалации *
            </label>
            <div className="space-y-2">
              <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                escalationLevel === 'manager' 
                  ? 'border-[#FFAA00] bg-yellow-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  type="radio"
                  name="level"
                  value="manager"
                  checked={escalationLevel === 'manager'}
                  onChange={(e) => setEscalationLevel(e.target.value)}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">🟡 Руководитель подразделения</div>
                  <div className="text-xs text-gray-600">Стандартная эскалация для контроля и помощи</div>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                escalationLevel === 'director' 
                  ? 'border-[#DD0000] bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  type="radio"
                  name="level"
                  value="director"
                  checked={escalationLevel === 'director'}
                  onChange={(e) => setEscalationLevel(e.target.value)}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">🔴 Директор + топ-менеджмент</div>
                  <div className="text-xs text-gray-600">Критичная эскалация при серьезных рисках</div>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                escalationLevel === 'regulatory' 
                  ? 'border-purple-600 bg-purple-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  type="radio"
                  name="level"
                  value="regulatory"
                  checked={escalationLevel === 'regulatory'}
                  onChange={(e) => setEscalationLevel(e.target.value)}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">🏛️ Регуляторный уровень</div>
                  <div className="text-xs text-gray-600">Максимальная эскалация с отчетностью в ЦБ</div>
                </div>
              </label>
            </div>
          </div>

          {/* Причина эскалации */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Причина эскалации *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            >
              <option value="">Выберите причину</option>
              <option value="sla_violation">Нарушение SLA</option>
              <option value="complexity">Высокая сложность, требуется помощь</option>
              <option value="regulatory_risk">Регуляторный риск</option>
              <option value="legal_risk">Юридический риск</option>
              <option value="reputation_risk">Репутационный риск</option>
              <option value="client_vip">VIP-клиент требует внимания</option>
              <option value="resource_shortage">Недостаток ресурсов</option>
              <option value="other">Другая причина</option>
            </select>
          </div>

          {/* Срочность */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Срочность *
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                urgency === 'critical' 
                  ? 'border-[#DD0000] bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  type="radio"
                  name="urgency"
                  value="critical"
                  checked={urgency === 'critical'}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="text-2xl mb-1">🔴</div>
                  <div className="text-xs font-medium">Критично</div>
                </div>
              </label>

              <label className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                urgency === 'high' 
                  ? 'border-[#FFAA00] bg-yellow-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  type="radio"
                  name="urgency"
                  value="high"
                  checked={urgency === 'high'}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="text-2xl mb-1">🟡</div>
                  <div className="text-xs font-medium">Высокая</div>
                </div>
              </label>

              <label className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                urgency === 'normal' 
                  ? 'border-[#00AA44] bg-green-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  type="radio"
                  name="urgency"
                  value="normal"
                  checked={urgency === 'normal'}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="text-2xl mb-1">🟢</div>
                  <div className="text-xs font-medium">Обычная</div>
                </div>
              </label>
            </div>
          </div>

          {/* Кому отправить уведомления */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Кому отправить уведомления
            </label>
            <div className="space-y-2">
              {notificationOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedNotifications.includes(option.id)
                      ? 'border-[#0051BA] bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  } ${option.required ? 'opacity-75' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(option.id)}
                    onChange={() => toggleNotification(option.id)}
                    disabled={option.required}
                    className="w-4 h-4 text-[#0051BA] rounded"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">{option.label}</div>
                    {option.required && (
                      <div className="text-xs text-gray-500">Обязательно</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Дополнительные комментарии */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Дополнительные комментарии
            </label>
            <textarea
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
              placeholder="Опишите ситуацию и что уже было предпринято..."
            />
          </div>

          {/* Что произойдет */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Send className="w-4 h-4" />
              Что произойдет после эскалации:
            </div>
            <ul className="space-y-1 text-xs text-gray-600">
              <li>📧 Email-уведомления будут отправлены выбранным получателям</li>
              <li>📱 SMS-уведомления для критичных эскалаций</li>
              <li>📊 Обращение будет помечено как "Эскалировано"</li>
              <li>⏰ Установлен приоритетный мониторинг</li>
              <li>📝 Создан отчет об эскалации в системе</li>
              {escalationLevel === 'regulatory' && (
                <li className="text-[#DD0000] font-medium">⚠️ Подготовка отчета для регулятора</li>
              )}
            </ul>
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
            onClick={handleEscalate}
            disabled={!reason}
            className="flex-1 px-4 py-2 bg-[#DD0000] text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Эскалировать обращение
          </button>
        </div>
      </div>
    </div>
  );
}
