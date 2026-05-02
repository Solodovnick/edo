import { X, User, Clock } from 'lucide-react';

interface TakeComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (assignee: string) => void;
  complaint?: {
    id: string;
    icon: string;
    client: string;
    subject: string;
    violatedBy?: string;
    remaining?: string;
  } | null;
}

export function TakeComplaintModal({ isOpen, onClose, onConfirm, complaint }: TakeComplaintModalProps) {
  const currentUser = "Иванов И.И."; // Текущий пользователь (можно получить из контекста)

  const handleTake = () => {
    onConfirm(currentUser);
    onClose();
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
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md m-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Взять обращение в работу</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Информация об обращении */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{complaint.icon}</span>
              <div>
                <div className="text-sm text-gray-600">Обращение №</div>
                <div className="font-mono font-bold text-gray-800">#{complaint.id}</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-600 mb-1">Клиент:</div>
              <div className="text-sm font-medium text-gray-800">{complaint.client}</div>
            </div>

            <div>
              <div className="text-xs text-gray-600 mb-1">Тема:</div>
              <div className="text-sm text-gray-700">{complaint.subject}</div>
            </div>

            {complaint.violatedBy && (
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded border border-red-200">
                <Clock className="w-4 h-4 text-[#DD0000]" />
                <div className="text-sm font-bold text-[#DD0000]">
                  Нарушено {complaint.violatedBy}
                </div>
              </div>
            )}

            {complaint.remaining && (
              <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                <Clock className="w-4 h-4 text-[#FFAA00]" />
                <div className="text-sm font-bold text-[#FFAA00]">
                  Осталось {complaint.remaining}
                </div>
              </div>
            )}
          </div>

          {/* Кому назначается */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0051BA] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-600">Будет назначено на:</div>
                <div className="font-bold text-gray-800">{currentUser}</div>
                <div className="text-xs text-gray-500">Вы (текущий пользователь)</div>
              </div>
            </div>
          </div>

          {/* Предупреждение для нарушенных */}
          {complaint.violatedBy && (
            <div className="bg-red-50 border-2 border-[#DD0000] rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <div className="text-sm font-bold text-[#DD0000] mb-1">
                    ВНИМАНИЕ! Обращение просрочено
                  </div>
                  <div className="text-xs text-gray-700">
                    • Требуется немедленное реагирование<br />
                    • Уведомления будут отправлены руководителю<br />
                    • Необходимо подготовить отчет о причинах задержки
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Что произойдет */}
          <div className="border-t border-gray-200 pt-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Что произойдет после подтверждения:</div>
            <ul className="space-y-1 text-xs text-gray-600">
              <li>✅ Обращение будет назначено на вас</li>
              <li>✅ Статус изменится на "В работе"</li>
              <li>✅ Вы получите уведомление на email</li>
              <li>✅ Обращение появится в разделе "Мои обращения"</li>
              {complaint.violatedBy && <li className="text-[#DD0000]">⚠️ Руководитель получит уведомление о взятии просроченного обращения</li>}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Отменить
          </button>
          <button
            onClick={handleTake}
            className="flex-1 px-4 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] transition-colors font-medium"
          >
            Взять в работу
          </button>
        </div>
      </div>
    </div>
  );
}
