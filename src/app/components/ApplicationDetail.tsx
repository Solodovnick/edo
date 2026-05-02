import { useState } from 'react';
import { X, MessageSquare, Clock, Users, Mail, Building, Phone } from 'lucide-react';
import { RequestInfoModal } from './RequestInfoModal';
import { AddNoteModal } from './AddNoteModal';
import { CloseComplaintModal } from './CloseComplaintModal';

export function ApplicationDetail({ application, onClose }: any) {
  const [isRequestInfoModalOpen, setIsRequestInfoModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

  const history = [
    { date: '17.01.2026 14:30', action: 'Создано обращение', user: 'Система' },
    { date: '17.01.2026 14:35', action: 'Назначено на Иванова А.И.', user: 'Петров С.П.' },
    { date: '17.01.2026 15:00', action: 'Взято в работу', user: 'Иванов А.И.' },
    { date: '17.01.2026 16:20', action: 'Добавлена заметка', user: 'Иванов А.И.' },
  ];

  const handleRequestInfo = (data: any) => {
    const requestTypeLabels: Record<string, string> = {
      documents: '📄 Запрос документов',
      clarification: 'ℹ️ Уточнение информации',
      confirmation: '✅ Подтверждение действий',
      payment_proof: '💳 Подтверждение оплаты',
      expert_opinion: '🔍 Экспертное мнение',
      other: '📋 Другой запрос',
    };

    toast.info('📤 Запрос информации отправлен!', {
      description: `Обращение #${application.number}\nТип: ${requestTypeLabels[data.requestType]}\nАдресат: ${data.recipientType === 'client' ? application.client : data.recipientDetails}\nСрок: ${new Date(data.deadline).toLocaleString('ru-RU')}`,
      duration: 4000,
    });
  };

  const handleAddNote = (data: any) => {
    const noteTypeLabels: Record<string, string> = {
      general: '📝 Общая заметка',
      call: '📞 Звонок клиенту',
      meeting: '👥 Встреча/совещание',
      analysis: '🔍 Анализ ситуации',
      decision: '⚖️ Принятое решение',
      reminder: '⏰ Напоминание',
    };

    toast.success('✅ Заметка добавлена!', {
      description: `Обращение #${application.number}\nТип: ${noteTypeLabels[data.noteType]}\nТегов: ${data.tags.length}${data.isPinned ? '\n📌 Закреплена' : ''}`,
      duration: 3000,
    });
  };

  const handleCloseComplaint = (data: any) => {
    const resolutionLabels: Record<string, string> = {
      resolved_positive: '✅ Решено положительно',
      resolved_negative: '❌ Решено отрицательно',
      resolved_partial: '🔄 Частичное удовлетворение',
      withdrawn: '📝 Отозвано клиентом',
      duplicate: '🔗 Дубликат',
      redirected: '➡️ Перенаправлено',
      info_provided: 'ℹ️ Консультация'
    };

    toast.success('✅ Обращение закрыто!', {
      description: `Обращение #${application.number}\nРезультат: ${resolutionLabels[data.resolution]}\nУдовлетворенность: ${data.clientSatisfaction}`,
      duration: 4000,
    });
  };

  return (
    <div className="w-[400px] bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Заголовок */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">Обращение #{application.number}</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Основная информация */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Клиент */}
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Users className="w-4 h-4" />
            <span>Клиент</span>
          </div>
          <div className="text-sm font-medium text-gray-800">{application.client}</div>
          <div className="text-xs text-gray-600">client@example.com</div>
        </div>

        {/* Тип */}
        <div>
          <div className="text-xs text-gray-500 mb-1">Тип</div>
          <div className="text-sm text-gray-800">{application.type}</div>
        </div>

        {/* Тема */}
        <div>
          <div className="text-xs text-gray-500 mb-1">Тема</div>
          <div className="text-sm text-gray-800">{application.subject}</div>
        </div>

        {/* Описание */}
        <div>
          <div className="text-xs text-gray-500 mb-1">Описание</div>
          <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            {application.description}
          </div>
        </div>

        {/* Статус */}
        <div>
          <div className="text-xs text-gray-500 mb-1">Статус</div>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0051BA] focus:border-transparent">
            <option value="new">Новое</option>
            <option value="in-progress" selected>В работе</option>
            <option value="waiting">Ожидание</option>
            <option value="review">На проверке</option>
            <option value="done">Готово</option>
          </select>
        </div>

        {/* SLA */}
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Clock className="w-4 h-4" />
            <span>SLA</span>
          </div>
          <div className={`text-sm font-medium ${
            application.sla.includes('Нарушено') ? 'text-[#DD0000]' : 'text-[#00AA44]'
          }`}>
            {application.sla}
          </div>
        </div>

        {/* Назначено */}
        <div>
          <div className="text-xs text-gray-500 mb-2">Назначено</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0051BA] rounded-full flex items-center justify-center text-white text-xs font-bold">
                {application.assignedTo.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="text-sm text-gray-800">{application.assignedTo}</span>
            </div>
            <button className="text-xs text-[#0051BA] hover:underline">
              Переназначить
            </button>
          </div>
        </div>

        {/* Дата создания */}
        <div>
          <div className="text-xs text-gray-500 mb-1">Дата создания</div>
          <div className="text-sm text-gray-800">{application.createdAt}</div>
        </div>

        {/* История */}
        <div>
          <div className="text-xs text-gray-500 mb-2">История действий</div>
          <div className="space-y-3">
            {history.map((item, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-[#0051BA] rounded-full" />
                  {index < history.length - 1 && (
                    <div className="w-px h-full bg-gray-300 mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-3">
                  <div className="text-xs text-gray-600">{item.date}</div>
                  <div className="text-sm text-gray-800">{item.action}</div>
                  <div className="text-xs text-gray-500">{item.user}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] transition-colors text-sm"
          onClick={() => setIsRequestInfoModalOpen(true)}
        >
          <MessageSquare className="w-4 h-4" />
          Запросить информацию
        </button>
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          onClick={() => setIsAddNoteModalOpen(true)}
        >
          <AlertCircle className="w-4 h-4" />
          Добавить заметку
        </button>
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-[#00AA44] text-[#00AA44] rounded-lg hover:bg-green-50 transition-colors text-sm"
          onClick={() => setIsCloseModalOpen(true)}
        >
          <CheckCircle className="w-4 h-4" />
          Закрыть обращение
        </button>
      </div>

      {/* Модальные окн�� */}
      <RequestInfoModal
        isOpen={isRequestInfoModalOpen}
        onClose={() => setIsRequestInfoModalOpen(false)}
        onConfirm={handleRequestInfo}
        application={application}
      />
      
      <AddNoteModal
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
        onConfirm={handleAddNote}
        application={application}
      />
      
      <CloseComplaintModal
        isOpen={isCloseModalOpen}
        onClose={() => setIsCloseModalOpen(false)}
        onConfirm={handleCloseComplaint}
        complaint={{
          id: application.number,
          icon: application.type === 'Регуляторный запрос' ? '🏛️' : application.type === 'Жалоба' ? '📨' : '📞',
          client: application.client,
          subject: application.subject,
          remaining: application.sla,
          status: application.status,
        }}
      />
    </div>
  );
}