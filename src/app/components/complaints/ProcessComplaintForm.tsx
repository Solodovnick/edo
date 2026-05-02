import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Clock, 
  User, 
  FileText, 
  Check, 
  X,
  AlertCircle,
  Upload,
  MessageSquare,
  History
} from 'lucide-react';

interface ProcessComplaintFormData {
  responseText: string;
  template?: string;
  needsOtherDept: boolean;
  needsLegalReview: boolean;
  needsCompensation: boolean;
  additionalActions?: string;
  operatorComments?: string;
}

interface Complaint {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  type: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  daysRemaining: number;
  registrationDate: string;
  shortDescription: string;
  fullDescription: string;
  documents: string[];
  history: Array<{
    date: string;
    action: string;
    user: string;
  }>;
}

interface ProcessComplaintFormProps {
  complaint: Complaint;
  onSubmit: (data: ProcessComplaintFormData) => void;
  onCancel: () => void;
}

export function ProcessComplaintForm({ complaint, onSubmit, onCancel }: ProcessComplaintFormProps) {
  const { register, handleSubmit, watch, setValue } = useForm<ProcessComplaintFormData>({
    defaultValues: {
      needsOtherDept: false,
      needsLegalReview: false,
      needsCompensation: false,
    }
  });

  const [showPreview, setShowPreview] = useState(false);
  const [newDocuments, setNewDocuments] = useState<File[]>([]);
  
  const selectedTemplate = watch('template');
  const responseText = watch('responseText');

  const templates = {
    standard: `Уважаемый(ая) ${complaint.clientName},

Спасибо за обращение № ${complaint.id} от ${new Date(complaint.registrationDate).toLocaleDateString('ru-RU')}.

[Ваш ответ здесь]

С уважением,
[ФИО специалиста]
Банк "Региональный"`,
    
    complaint: `Уважаемый(ая) ${complaint.clientName},

Благодарим за обращение № ${complaint.id}.

Мы тщательно рассмотрели Вашу жалобу и признаём наличие описанной проблемы. Приносим свои извинения.

Для решения проблемы предпринято следующее:
• [Действие 1]
• [Действие 2]

[Результат и компенсация]

С уважением,
[ФИО руководителя]
Банк "Региональный"`,

    info: `Уважаемый(ая) ${complaint.clientName},

Спасибо за Ваш вопрос № ${complaint.id}.

Отвечаем на Ваш вопрос: "${complaint.shortDescription}"

Ответ:
[Подробное объяснение]

С уважением,
[ФИО специалиста]`,
  };

  const handleTemplateChange = (template: string) => {
    if (template && templates[template as keyof typeof templates]) {
      setValue('responseText', templates[template as keyof typeof templates]);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-[#DD0000] border-red-300';
      case 'medium': return 'bg-yellow-100 text-[#FFAA00] border-yellow-300';
      case 'low': return 'bg-green-100 text-[#00AA44] border-green-300';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getDaysColor = (days: number) => {
    if (days < 0) return 'text-[#DD0000] animate-pulse';
    if (days <= 1) return 'text-[#DD0000]';
    if (days <= 5) return 'text-[#FFAA00]';
    return 'text-[#00AA44]';
  };

  // Чек-лист проверки (9 пунктов)
  const checklist = [
    { id: 1, text: 'Реквизиты клиента верны', checked: true },
    { id: 2, text: 'ID обращения указан', checked: true },
    { id: 3, text: 'Решение соответствует проблеме', checked: false },
    { id: 4, text: 'Соблюдены регламенты и нормы', checked: false },
    { id: 5, text: 'Нет юридических рисков', checked: false },
    { id: 6, text: 'Тон и стиль приемлемы', checked: false },
    { id: 7, text: 'Грамотность и пунктуация', checked: false },
    { id: 8, text: 'Все документы приложены', checked: false },
    { id: 9, text: 'Реквизиты счета верны (если деньги)', checked: false },
  ];

  const [checklistState, setChecklistState] = useState(checklist);

  const toggleCheck = (id: number) => {
    setChecklistState(checklistState.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Обработать обращение</h2>
        <p className="text-sm text-gray-600 mt-1">Подготовьте ответ и отправьте на утверждение</p>
      </div>

      {/* БЛОК 1: Информация об обращении (READ-ONLY) */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">
          📋 Блок 1: Информация об обращении
        </h3>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-600">Номер обращения:</span>
              <div className="text-xl font-bold text-[#0051BA]">#{complaint.id}</div>
            </div>
            <div className={`px-4 py-2 rounded-lg border-2 font-bold ${getPriorityColor(complaint.priority)}`}>
              {complaint.priority === 'high' && '🔴 ВЫСОКИЙ'}
              {complaint.priority === 'medium' && '🟡 СРЕДНИЙ'}
              {complaint.priority === 'low' && '🟢 ОБЫЧНЫЙ'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-gray-600">Клиент:</span>
              <div className="font-medium text-gray-800 flex items-center gap-2">
                <User className="w-4 h-4" />
                {complaint.clientName}
              </div>
              <div className="text-sm text-gray-600">{complaint.phone}</div>
              <div className="text-sm text-gray-600">{complaint.email}</div>
            </div>

            <div>
              <span className="text-sm text-gray-600">Тип / Категория:</span>
              <div className="font-medium text-gray-800">{complaint.type}</div>
              <div className="text-sm text-gray-600">{complaint.category}</div>
            </div>

            <div>
              <span className="text-sm text-gray-600">Дата регистрации:</span>
              <div className="font-medium text-gray-800">
                {new Date(complaint.registrationDate).toLocaleDateString('ru-RU')}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center gap-2">
              <Clock className={`w-5 h-5 ${getDaysColor(complaint.daysRemaining)}`} />
              <span className="text-sm text-gray-600">Дней до срока:</span>
              <span className={`text-2xl font-bold ${getDaysColor(complaint.daysRemaining)}`}>
                {complaint.daysRemaining < 0 
                  ? `ПРОСРОЧЕНО на ${Math.abs(complaint.daysRemaining)} дней` 
                  : `${complaint.daysRemaining} дней`}
              </span>
            </div>
          </div>

          <button className="text-[#0051BA] text-sm hover:underline flex items-center gap-1">
            <History className="w-4 h-4" />
            История обращений клиента
          </button>
        </div>
      </section>

      {/* БЛОК 2: Описание проблемы (READ-ONLY) */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">
          💬 Блок 2: Описание проблемы
        </h3>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">Краткое описание:</div>
            <div className="text-gray-800">{complaint.shortDescription}</div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">Полное описание:</div>
            <div className="text-gray-800 whitespace-pre-wrap bg-white p-3 rounded border border-gray-200">
              {complaint.fullDescription}
            </div>
          </div>

          {complaint.documents.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Прикрепленные документы:</div>
              <div className="space-y-1">
                {complaint.documents.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{doc}</span>
                    <button className="ml-auto text-[#0051BA] text-sm hover:underline">
                      Скачать
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* БЛОК 3: Текст ответа (РЕДАКТИРУЕМОЕ) */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">
            ✍️ Блок 3: Текст ответа
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Выбор шаблона
            </label>
            <select
              {...register('template')}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            >
              <option value="">Без шаблона</option>
              <option value="standard">Стандартный ответ</option>
              <option value="complaint">Ответ на жалобу</option>
              <option value="info">Информационный ответ</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Текст ответа *
              </label>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-[#0051BA] text-sm hover:underline"
              >
                {showPreview ? 'Редактировать' : 'Предпросмотр'}
              </button>
            </div>

            {!showPreview ? (
              <textarea
                {...register('responseText', { required: true })}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent font-mono text-sm"
                placeholder="Введите текст ответа клиенту..."
              />
            ) : (
              <div className="bg-white border-2 border-[#0051BA] rounded-lg p-6 whitespace-pre-wrap">
                <div className="text-sm text-gray-500 mb-4">Предпросмотр письма:</div>
                {responseText || 'Текст ответа не введен'}
              </div>
            )}
          </div>

          {/* Чек-лист проверки */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-bold text-gray-800 mb-3">
              ✅ Чек-лист проверки перед отправкой (9 пунктов):
            </h4>
            <div className="space-y-2">
              {checklistState.map((item) => (
                <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleCheck(item.id)}
                    className="w-4 h-4 text-[#0051BA] rounded"
                  />
                  <span className={`text-sm ${item.checked ? 'text-gray-800 line-through' : 'text-gray-700'}`}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-yellow-300">
              <div className="text-sm font-medium text-gray-800">
                Выполнено: {checklistState.filter(i => i.checked).length} из {checklistState.length}
              </div>
            </div>
          </div>
        </section>

        {/* БЛОК 4: Документы и вложения */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">
            📎 Блок 4: Документы и вложения
          </h3>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0051BA] transition-colors">
            <input
              type="file"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  setNewDocuments([...newDocuments, ...Array.from(e.target.files)]);
                }
              }}
              className="hidden"
              id="response-files"
            />
            <label htmlFor="response-files" className="cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Добавить документы для отправки</p>
            </label>
          </div>

          {newDocuments.length > 0 && (
            <div className="space-y-2">
              {newDocuments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setNewDocuments(newDocuments.filter((_, i) => i !== index))}
                    className="text-[#DD0000] hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Реквизиты счета (если перечисления)
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
              placeholder="40817 810 1 0000 1234567"
            />
          </div>
        </section>

        {/* БЛОК 5: Дополнительные действия */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">
            ⚙️ Блок 5: Дополнительные действия
          </h3>

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                {...register('needsOtherDept')}
                type="checkbox"
                className="w-4 h-4 text-[#0051BA] rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Требуется запрос в другое подразделение
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                {...register('needsLegalReview')}
                type="checkbox"
                className="w-4 h-4 text-[#0051BA] rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Требуется анализ юриста
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                {...register('needsCompensation')}
                type="checkbox"
                className="w-4 h-4 text-[#0051BA] rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Требуется расчет компенсации
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание требуемых действий
            </label>
            <textarea
              {...register('additionalActions')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
              placeholder="Опишите дополнительные действия, если требуются..."
            />
          </div>
        </section>

        {/* БЛОК 6: История и комментарии */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <History className="w-5 h-5" />
            Блок 6: История и комментарии
          </h3>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-700 mb-3">История изменений:</div>
            <div className="space-y-2">
              {complaint.history.map((item, index) => (
                <div key={index} className="flex items-start gap-3 pb-2 border-b border-gray-200 last:border-0">
                  <div className="w-2 h-2 bg-[#0051BA] rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-800">{item.action}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(item.date).toLocaleString('ru-RU')} • {item.user}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Комментарии для руководителя
            </label>
            <textarea
              {...register('operatorComments')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
              placeholder="Комментарии для внутреннего использования..."
            />
          </div>
        </section>

        {/* БЛОК 7: Действия */}
        <section className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Отменить
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Сохранить как черновик
          </button>
          <button
            type="submit"
            disabled={checklistState.filter(i => i.checked).length < 9}
            className="flex-1 px-6 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Отправить на утверждение
          </button>
        </section>
      </form>
    </div>
  );
}
