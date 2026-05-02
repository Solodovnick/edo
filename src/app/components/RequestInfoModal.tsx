import { useState } from 'react';
import { X, MessageSquare, User, Mail, Phone, Clock, AlertCircle, Send } from 'lucide-react';

interface RequestInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: RequestData) => void;
  application: {
    number: string;
    client: string;
    subject: string;
  };
}

interface RequestData {
  requestType: string;
  recipientType: string;
  recipientDetails: string;
  urgency: string;
  requestText: string;
  deadline: string;
  notifyMe: boolean;
  attachments: string[];
}

export function RequestInfoModal({ isOpen, onClose, onConfirm, application }: RequestInfoModalProps) {
  const [requestType, setRequestType] = useState('');
  const [recipientType, setRecipientType] = useState('client');
  const [recipientDetails, setRecipientDetails] = useState('');
  const [urgency, setUrgency] = useState('normal');
  const [requestText, setRequestText] = useState('');
  const [deadline, setDeadline] = useState('');
  const [notifyMe, setNotifyMe] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const requestTypes = [
    { value: 'documents', label: '📄 Запрос документов', description: 'Паспорт, справки, выписки' },
    { value: 'clarification', label: 'ℹ️ Уточнение информации', description: 'Дополнительные детали, пояснения' },
    { value: 'confirmation', label: '✅ Подтверждение действий', description: 'Согласие, одобрение' },
    { value: 'payment_proof', label: '💳 Подтверждение оплаты', description: 'Чеки, платежные документы' },
    { value: 'expert_opinion', label: '🔍 Экспертное мнение', description: 'Заключение специалиста' },
    { value: 'other', label: '📋 Другой запрос', description: 'Произвольный запрос информации' },
  ];

  const handleSubmit = () => {
    // Валидация
    const newErrors: Record<string, string> = {};
    if (!requestType) newErrors.requestType = 'Выберите тип запроса';
    if (!requestText.trim()) newErrors.requestText = 'Введите текст запроса';
    if (!deadline) newErrors.deadline = 'Укажите срок ответа';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data: RequestData = {
      requestType,
      recipientType,
      recipientDetails,
      urgency,
      requestText,
      deadline,
      notifyMe,
      attachments: [],
    };
    
    onConfirm(data);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setRequestType('');
    setRecipientType('client');
    setRecipientDetails('');
    setUrgency('normal');
    setRequestText('');
    setDeadline('');
    setNotifyMe(true);
    setErrors({});
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
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#0051BA]" />
              Запросить информацию
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
              <div className="text-xs text-gray-600 mb-1">Обращение №</div>
              <div className="font-mono font-bold text-gray-800 mb-2">#{application.number}</div>
              <div className="text-sm font-medium text-gray-800 mb-1">{application.client}</div>
              <div className="text-xs text-gray-700">{application.subject}</div>
            </div>

            {/* Тип запроса */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип запроса *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {requestTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      requestType === type.value
                        ? 'border-[#0051BA] bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="requestType"
                      value={type.value}
                      checked={requestType === type.value}
                      onChange={(e) => {
                        setRequestType(e.target.value);
                        setErrors({ ...errors, requestType: '' });
                      }}
                      className="w-4 h-4 mt-1 text-[#0051BA]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800">{type.label}</div>
                      <div className="text-xs text-gray-600">{type.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.requestType && (
                <p className="text-xs text-[#DD0000] mt-1">{errors.requestType}</p>
              )}
            </div>

            {/* Кому адресован запрос */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Кому адресован запрос *
              </label>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  recipientType === 'client'
                    ? 'border-[#0051BA] bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="recipient"
                    value="client"
                    checked={recipientType === 'client'}
                    onChange={(e) => setRecipientType(e.target.value)}
                    className="w-4 h-4 text-[#0051BA]"
                  />
                  <User className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">Клиент</div>
                    <div className="text-xs text-gray-600">{application.client}</div>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  recipientType === 'internal'
                    ? 'border-[#0051BA] bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="recipient"
                    value="internal"
                    checked={recipientType === 'internal'}
                    onChange={(e) => setRecipientType(e.target.value)}
                    className="w-4 h-4 text-[#0051BA]"
                  />
                  <User className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">Внутренний запрос</div>
                    <div className="text-xs text-gray-600">Другим подразделениям банка</div>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  recipientType === 'external'
                    ? 'border-[#0051BA] bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="recipient"
                    value="external"
                    checked={recipientType === 'external'}
                    onChange={(e) => setRecipientType(e.target.value)}
                    className="w-4 h-4 text-[#0051BA]"
                  />
                  <User className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">Внешняя организация</div>
                    <div className="text-xs text-gray-600">Контрагенты, партнеры, регуляторы</div>
                  </div>
                </label>
              </div>

              {recipientType !== 'client' && (
                <input
                  type="text"
                  value={recipientDetails}
                  onChange={(e) => setRecipientDetails(e.target.value)}
                  placeholder={recipientType === 'internal' ? 'Укажите подразделение...' : 'Укажите организацию...'}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
                />
              )}
            </div>

            {/* Срочность */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Срочность запроса
              </label>
              <div className="grid grid-cols-3 gap-3">
                <label className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  urgency === 'urgent'
                    ? 'border-[#DD0000] bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="urgency"
                    value="urgent"
                    checked={urgency === 'urgent'}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="sr-only"
                  />
                  <div className="text-2xl mb-1">🔴</div>
                  <div className="text-xs font-medium text-center">Срочно</div>
                  <div className="text-xs text-gray-600">24 часа</div>
                </label>

                <label className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  urgency === 'normal'
                    ? 'border-[#FFAA00] bg-yellow-50'
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
                  <div className="text-2xl mb-1">🟡</div>
                  <div className="text-xs font-medium text-center">Обычная</div>
                  <div className="text-xs text-gray-600">3 дня</div>
                </label>

                <label className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  urgency === 'low'
                    ? 'border-[#00AA44] bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="urgency"
                    value="low"
                    checked={urgency === 'low'}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="sr-only"
                  />
                  <div className="text-2xl mb-1">🟢</div>
                  <div className="text-xs font-medium text-center">Низкая</div>
                  <div className="text-xs text-gray-600">7 дней</div>
                </label>
              </div>
            </div>

            {/* Текст запроса */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Текст запроса *
              </label>
              <textarea
                value={requestText}
                onChange={(e) => {
                  setRequestText(e.target.value);
                  setErrors({ ...errors, requestText: '' });
                }}
                rows={5}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent ${
                  errors.requestText ? 'border-[#DD0000]' : 'border-gray-300'
                }`}
                placeholder="Опишите подробно, какая информация требуется и для каких целей..."
              />
              {errors.requestText && (
                <p className="text-xs text-[#DD0000] mt-1">{errors.requestText}</p>
              )}
              <div className="text-xs text-gray-500 mt-1">
                {requestText.length} / 1000 символов
              </div>
            </div>

            {/* Срок ответа */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Ожидаемый срок ответа *
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  setErrors({ ...errors, deadline: '' });
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent ${
                  errors.deadline ? 'border-[#DD0000]' : 'border-gray-300'
                }`}
              />
              {errors.deadline && (
                <p className="text-xs text-[#DD0000] mt-1">{errors.deadline}</p>
              )}
            </div>

            {/* Способы связи */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Предпочтительные способы связи
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-[#0051BA] rounded" />
                  <Mail className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Email</span>
                </label>
                <label className="flex items-center gap-3 p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-[#0051BA] rounded" />
                  <Phone className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Телефон</span>
                </label>
                <label className="flex items-center gap-3 p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" className="w-4 h-4 text-[#0051BA] rounded" />
                  <MessageSquare className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Через систему ЭДО</span>
                </label>
              </div>
            </div>

            {/* Уведомить меня */}
            <label className="flex items-center gap-3 p-4 border-2 border-[#0051BA] bg-blue-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={notifyMe}
                onChange={(e) => setNotifyMe(e.target.checked)}
                className="w-5 h-5 text-[#0051BA] rounded"
              />
              <div className="flex-1">
                <div className="text-sm font-bold text-gray-800 mb-1">
                  🔔 Уведомить меня о получении ответа
                </div>
                <div className="text-xs text-gray-600">
                  Вы получите email и push-уведомление, когда информация будет предоставлена
                </div>
              </div>
            </label>

            {/* Что произойдет */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Send className="w-4 h-4 text-[#FFAA00]" />
                Что произойдет после отправки:
              </div>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>📤 Запрос будет отправлен {recipientType === 'client' ? 'клиенту' : recipientType === 'internal' ? 'в подразделение' : 'во внешнюю организацию'}</li>
                <li>📝 Запрос будет зафиксирован в истории обращения</li>
                <li>⏰ Установлен дедлайн для ответа: {deadline ? new Date(deadline).toLocaleString('ru-RU') : 'не указан'}</li>
                <li>🔍 Статус обращения изменится на "Ожидание информации"</li>
                {notifyMe && <li>🔔 Вы получите уведомление при получении ответа</li>}
              </ul>
            </div>
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
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Отправить запрос
          </button>
        </div>
      </div>
    </div>
  );
}
