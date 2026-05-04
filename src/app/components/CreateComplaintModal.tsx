import { useState } from 'react';
import { X, User, Building, Mail, Phone, Calendar, AlertCircle } from 'lucide-react';
import { type CreateComplaintData } from '@/services/appealApi';

interface CreateComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateComplaintData) => void;
}

interface ComplaintData extends CreateComplaintData {
  status: string;
  slaDays: number;
}

// Утилита для расчета рабочих дней
function addWorkingDays(startDate: Date, days: number): Date {
  const result = new Date(startDate);
  let addedDays = 0;
  
  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    // Пропускаем выходные (суббота = 6, воскресенье = 0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      addedDays++;
    }
  }
  
  return result;
}

// Утилита для расчета календарных дней
function addCalendarDays(startDate: Date, days: number): Date {
  const result = new Date(startDate);
  result.setDate(result.getDate() + days);
  return result;
}

// Правила SLA по категориям обращений
const SLA_RULES = {
  'Стандартное письменное': { days: 15, type: 'working', extensible: true, maxExtension: 10 },
  'От Банка России': { days: 15, type: 'working', extensible: false, priority: 'critical' },
  'Финансовый омбудсмен': { days: 15, type: 'working', extensible: false, expertiseAllowed: true },
  'Специальное (карты/персданные/имущество)': { days: 30, type: 'calendar', extensible: false },
  'Устное': { days: 15, type: 'working', extensible: false, requiresWrittenForm: true },
};

export function CreateComplaintModal({ isOpen, onClose, onCreate }: CreateComplaintModalProps) {
  const [formData, setFormData] = useState<ComplaintData>({
    title: '',
    type: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    client: '',
    clientType: 'individual',
    subject: '',
    status: 'Новое',
    description: '',
    assignedTo: '',
    priority: 'medium',
    slaDeadline: '',
    slaDays: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Обязательное поле';
    if (!formData.type) newErrors.type = 'Обязательное поле';
    if (!formData.client.trim()) newErrors.client = 'Обязательное поле';
    if (!formData.subject.trim()) newErrors.subject = 'Обязательное поле';
    if (!formData.description.trim()) newErrors.description = 'Обязательное поле';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Автоматически устанавливаем приоритет для регуляторных обращений
    const finalData = {
      ...formData,
      priority: formData.type === 'Регуляторная' ? 'high' as const : formData.priority,
    };

    onCreate(finalData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      type: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      client: '',
      clientType: 'individual',
      subject: '',
      status: 'Новое',
      description: '',
      assignedTo: '',
      priority: 'medium',
      slaDeadline: '',
      slaDays: 0,
    });
    setErrors({});
    onClose();
  };

  const handleChange = (field: keyof ComplaintData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }

    // Автоматическое назначение подразделения при выборе типа обращения
    if (field === 'type') {
      let suggestedDepartment = '';
      let suggestedClientType: 'individual' | 'organization' | 'regulator' = formData.clientType;
      
      if (value === 'Регуляторная') {
        suggestedDepartment = 'Регуляторная работа';
        suggestedClientType = 'regulator';
      }
      
      if (suggestedDepartment) {
        setFormData({ ...formData, [field]: value, assignedTo: suggestedDepartment, clientType: suggestedClientType });
      } else {
        setFormData({ ...formData, [field]: value, clientType: suggestedClientType });
      }
    }

    // Автоматическое назначение типа обращения при выборе типа клиента "Регулятор"
    if (field === 'clientType' && value === 'regulator') {
      setFormData({ 
        ...formData, 
        [field]: value, 
        type: 'Регуляторная',
        assignedTo: 'Регуляторная работа',
        category: 'От Банка России',
        priority: 'high'
      });
      // Расчет SLA для категории "От Банка России"
      const slaRule = SLA_RULES['От Банка России'];
      const deadlineDate = addWorkingDays(new Date(formData.date), slaRule.days);
      setFormData(prev => ({
        ...prev,
        clientType: value as 'individual' | 'organization' | 'regulator',
        type: 'Регуляторная',
        assignedTo: 'Регуляторная работа',
        category: 'От Банка России',
        priority: 'high',
        slaDeadline: deadlineDate.toISOString().split('T')[0],
        slaDays: slaRule.days,
      }));
      return;
    }

    // Расчет SLA
    if (field === 'category' && value) {
      const slaRule = SLA_RULES[value];
      if (slaRule) {
        const deadlineDate = slaRule.type === 'working'
          ? addWorkingDays(new Date(formData.date), slaRule.days)
          : addCalendarDays(new Date(formData.date), slaRule.days);
        setFormData({
          ...formData,
          [field]: value,
          slaDeadline: deadlineDate.toISOString().split('T')[0],
          slaDays: slaRule.days,
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-800">Создать обращение</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 1. Заголовок */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Заголовок обращения *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent ${
                errors.title ? 'border-[#DD0000]' : 'border-gray-300'
              }`}
              placeholder="Краткое название обращения"
            />
            {errors.title && (
              <p className="text-xs text-[#DD0000] mt-1">{errors.title}</p>
            )}
          </div>

          {/* 2. Тип обращения */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип обращения *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.type === 'Письменное' 
                  ? 'border-[#0051BA] bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="Письменное"
                  checked={formData.type === 'Письменное'}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-4 h-4"
                />
                <div>
                  <div className="text-lg">📨</div>
                  <div className="text-sm font-medium text-gray-800">На бумаге</div>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.type === 'Устное' 
                  ? 'border-[#0051BA] bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="Устное"
                  checked={formData.type === 'Устное'}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-4 h-4"
                />
                <div>
                  <div className="text-lg">📞</div>
                  <div className="text-sm font-medium text-gray-800">Устно</div>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.type === 'Регуляторная' 
                  ? 'border-[#DD0000] bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="Регуляторная"
                  checked={formData.type === 'Регуляторная'}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-4 h-4"
                />
                <div>
                  <div className="text-lg">🏛️</div>
                  <div className="text-sm font-medium text-gray-800">Регуляторная</div>
                </div>
              </label>
            </div>
            {errors.type && (
              <p className="text-xs text-[#DD0000] mt-1">{errors.type}</p>
            )}
          </div>

          {/* 3. Дата */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дата поступления
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            />
          </div>

          {/* 4. Клиент */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Клиент *
            </label>
            <input
              type="text"
              value={formData.client}
              onChange={(e) => handleChange('client', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent ${
                errors.client ? 'border-[#DD0000]' : 'border-gray-300'
              }`}
              placeholder={
                formData.clientType === 'individual' 
                  ? 'Иванов Иван Иванович' 
                  : formData.clientType === 'regulator'
                  ? 'Центральный Банк РФ'
                  : 'ООО "Название компании"'
              }
            />
            {errors.client && (
              <p className="text-xs text-[#DD0000] mt-1">{errors.client}</p>
            )}
          </div>

          {/* 5. Тип клиента */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тип клиента
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.clientType === 'individual' 
                  ? 'border-[#0051BA] bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  type="radio"
                  name="clientType"
                  value="individual"
                  checked={formData.clientType === 'individual'}
                  onChange={(e) => handleChange('clientType', e.target.value)}
                  className="w-4 h-4"
                />
                <div>
                  <div className="text-lg"><User /></div>
                  <div className="text-sm font-medium text-gray-800">Физическое лицо</div>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.clientType === 'organization' 
                  ? 'border-[#0051BA] bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  type="radio"
                  name="clientType"
                  value="organization"
                  checked={formData.clientType === 'organization'}
                  onChange={(e) => handleChange('clientType', e.target.value)}
                  className="w-4 h-4"
                />
                <div>
                  <div className="text-lg"><Building /></div>
                  <div className="text-sm font-medium text-gray-800">Организация</div>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.clientType === 'regulator' 
                  ? 'border-[#DD0000] bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  type="radio"
                  name="clientType"
                  value="regulator"
                  checked={formData.clientType === 'regulator'}
                  onChange={(e) => handleChange('clientType', e.target.value)}
                  className="w-4 h-4"
                />
                <div>
                  <div className="text-lg">🏛️</div>
                  <div className="text-sm font-medium text-gray-800">Регулятор</div>
                </div>
              </label>
            </div>
          </div>

          {/* 6. Тема */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тема обращения *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent ${
                errors.subject ? 'border-[#DD0000]' : 'border-gray-300'
              }`}
              placeholder="Тема/предмет обращения"
            />
            {errors.subject && (
              <p className="text-xs text-[#DD0000] mt-1">{errors.subject}</p>
            )}
          </div>

          {/* 7. Статус */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Статус
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            >
              <option value="Новое">🟢 Новое</option>
              <option value="В работе">⏳ В работе</option>
              <option value="На проверке">📋 На проверке</option>
              <option value="Критичное">🔴 Критичное</option>
            </select>
          </div>

          {/* 8. Описание */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={5}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent ${
                errors.description ? 'border-[#DD0000]' : 'border-gray-300'
              }`}
              placeholder="Подробное описание обращения..."
            />
            {errors.description && (
              <p className="text-xs text-[#DD0000] mt-1">{errors.description}</p>
            )}
          </div>

          {/* Предупреждение для регуляторных */}
          {formData.type === 'Регуляторная' && (
            <div className="bg-red-50 border-2 border-[#DD0000] rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-[#DD0000] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-[#DD0000] mb-1">
                    КРИТИЧНОЕ ОБРАЩЕНИЕ ОТ РЕГУЛЯТОРА
                  </div>
                  <div className="text-xs text-gray-700">
                    Срок ответа: <strong>15 рабочих дней</strong><br />
                    Приоритет: <strong>КРИТИЧНЫЙ (высший)</strong><br />
                    Обязательна отправка копии ответа в Банк России в день направления клиенту<br />
                    Будут отправлены уведомления всем ответственным лицам
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Предупреждение для устных обращений */}
          {formData.type === 'Устное' && (
            <div className="bg-yellow-50 border-2 border-[#FFAA00] rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-[#FFAA00] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-[#FFAA00] mb-1">
                    ТРЕБУЕТСЯ ПИСЬМЕННОЕ ОФОРМЛЕНИЕ
                  </div>
                  <div className="text-xs text-gray-700">
                    Устное обращение должно быть оформлено в письменную форму<br />
                    Регистрация обязательна не позднее следующего рабочего дня<br />
                    После оформления рассматривается как стандартное письменное (15 рабочих дней)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Информация о категориях */}
          {formData.category === 'От Банка России' && (
            <div className="bg-red-50 border-2 border-[#DD0000] rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-[#DD0000] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-[#DD0000] mb-1">
                    ПРИОРИТЕТНОЕ ОБРАЩЕНИЕ ОТ БАНКА РОССИИ
                  </div>
                  <div className="text-xs text-gray-700">
                    • Срок: 15 рабочих дней со дня регистрации<br />
                    • Приоритет: КРИТИЧНЫЙ (требуется 100% SLA compliance)<br />
                    • Копия ответа отправляется в Банк России в день направления клиенту<br />
                    • Продление срока НЕ допускается
                  </div>
                </div>
              </div>
            </div>
          )}

          {formData.category === 'Финансовый омбудсмен' && (
            <div className="bg-blue-50 border-2 border-[#0051BA] rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-[#0051BA] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-[#0051BA] mb-1">
                    ОБРАЩЕНИЕ ЧЕРЕЗ ФИНАНСОВОГО ОМБУДСМЕНА
                  </div>
                  <div className="text-xs text-gray-700">
                    • Срок: 15 рабочих дней на рассмотрение<br />
                    • Приоритет: ВЫСОКИЙ<br />
                    • Возможность запроса экспертизы<br />
                    • Продление срока НЕ допускается
                  </div>
                </div>
              </div>
            </div>
          )}

          {formData.category === 'Специальное (карты/персданные/имущество)' && (
            <div className="bg-purple-50 border-2 border-purple-400 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-purple-800 mb-1">
                    СПЕЦИАЛЬНАЯ КАТЕГОРИЯ ОБРАЩЕНИЯ
                  </div>
                  <div className="text-xs text-gray-700">
                    • Категория: Карточные операции / Персональные данные / Имущественные требования<br />
                    • Срок: 30 календарных дней (включая выходные)<br />
                    • Продление срока НЕ допускается<br />
                    • Требуется особое внимание к оформлению документов
                  </div>
                </div>
              </div>
            </div>
          )}

          {formData.category === 'Стандартное письменное' && (
            <div className="bg-green-50 border-2 border-[#00AA44] rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-6 h-6 text-[#00AA44] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-[#00AA44] mb-1">
                    СТАНДАРТНОЕ ПИСЬМЕННОЕ ОБРАЩЕНИЕ
                  </div>
                  <div className="text-xs text-gray-700">
                    • Срок: 15 рабочих дней со дня регистрации<br />
                    • Возможность продления: ДА, максимум на 10 рабочих дней<br />
                    • Продление требует решения уполномоченного лица<br />
                    • При продлении клиенту направляется уведомление
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. Назначено на (Подразделение) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Назначено на (Подразделение)
            </label>
            <select
              value={formData.assignedTo}
              onChange={(e) => handleChange('assignedTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            >
              <option value="">Не назначено</option>
              <option value="Карточные услуги">💳 Карточные услуги</option>
              <option value="Регуляторная работа">🏛️ Регуляторная работа</option>
              <option value="Кредиты">💰 Кредиты</option>
              <option value="Жалобы">📢 Жалобы</option>
              <option value="Операции">⚙️ Операции</option>
              <option value="IT-поддержка">💻 IT-поддержка</option>
              <option value="Безопасность">🔒 Безопасность</option>
              <option value="Вклады и депозиты">🏦 Вклады и депозиты</option>
            </select>
          </div>

          {/* 10. Приоритет */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Приоритет
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            >
              <option value="high">Высокий</option>
              <option value="medium">Средний</option>
              <option value="low">Низкий</option>
            </select>
          </div>

          {/* 11. Категория */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Категория
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            >
              <option value="">Не выбрано</option>
              <option value="Стандартное письменное">Стандартное письменное</option>
              <option value="От Банка России">От Банка России</option>
              <option value="Финансовый омбудсмен">Финансовый омбудсмен</option>
              <option value="Специальное (карты/персданные/имущество)">Специальное (карты/персданные/имущество)</option>
              <option value="Устное">Устное</option>
            </select>
          </div>

          {/* 12. SLA */}
          {formData.category && (
            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-6 h-6 text-[#0051BA] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-800 mb-1">
                    Автоматически рассчитан SLA
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-600">Категория:</span><br />
                      <strong className="text-gray-800">{formData.category}</strong>
                    </div>
                    <div>
                      <span className="text-gray-600">Срок:</span><br />
                      <strong className="text-gray-800">
                        {formData.slaDays} {SLA_RULES[formData.category]?.type === 'working' ? 'рабочих' : 'календарных'} дней
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-600">Дата регистрации:</span><br />
                      <strong className="text-gray-800">{new Date(formData.date).toLocaleDateString('ru-RU')}</strong>
                    </div>
                    <div>
                      <span className="text-gray-600">Дедлайн:</span><br />
                      <strong className="text-[#DD0000]">{new Date(formData.slaDeadline).toLocaleDateString('ru-RU')}</strong>
                    </div>
                  </div>
                  {SLA_RULES[formData.category]?.extensible && (
                    <div className="mt-2 pt-2 border-t border-gray-300 text-xs text-gray-600">
                      ⚠️ Возможно продление до {SLA_RULES[formData.category].maxExtension} дней при решении уполномоченного лица
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 13. Кнопки */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Отменить
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] transition-colors font-medium"
            >
              Создать обращение
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}