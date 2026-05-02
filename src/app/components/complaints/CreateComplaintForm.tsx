import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, X, AlertCircle, Check } from 'lucide-react';

interface ComplaintFormData {
  // Блок 1: Информация о клиенте
  clientName: string;
  phone: string;
  email?: string;
  address?: string;
  
  // Блок 2: Информация об обращении
  complaintType: string;
  channel: string;
  receiveDate: string;
  
  // Блок 3: Содержание обращения
  category: string;
  subcategory?: string;
  shortDescription: string;
  fullDescription?: string;
  
  // Блок 4: Приоритизация
  priority: string;
  priorityReason?: string;
  
  // Блок 5: Маршрутизация
  targetDepartment: string;
  targetProduct?: string;
  
  // Блок 6: Дополнительно
  needsClarification: boolean;
  operatorComments?: string;
  tags?: string;
}

interface CreateComplaintFormProps {
  onSubmit: (data: ComplaintFormData) => void;
  onCancel: () => void;
}

export function CreateComplaintForm({ onSubmit, onCancel }: CreateComplaintFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ComplaintFormData>({
    defaultValues: {
      receiveDate: new Date().toISOString().split('T')[0],
      needsClarification: false,
    }
  });
  
  const [files, setFiles] = useState<File[]>([]);
  const complaintType = watch('complaintType');
  const category = watch('category');

  // AI-предложения на основе выбранной категории
  const suggestDepartment = (cat: string) => {
    const mapping: Record<string, string> = {
      'Жалоба на услугу': 'Розничное кредитование',
      'Запрос информации': 'Операционное обслуживание',
      'Претензия': 'Юридический отдел',
      'Жалоба на комиссию': 'Карточные услуги',
    };
    return mapping[cat] || '';
  };

  // Автоматическая установка приоритета для регулятора
  const handleTypeChange = (type: string) => {
    if (type === 'От регулятора') {
      setValue('priority', 'high');
      setValue('priorityReason', 'Обращение от регулятора - критичный приоритет');
    }
  };

  const handleCategoryChange = (cat: string) => {
    const dept = suggestDepartment(cat);
    if (dept) {
      setValue('targetDepartment', dept);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const priority = watch('priority');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Создать обращение</h2>
        <p className="text-sm text-gray-600 mt-1">Заполните все обязательные поля, отмеченные *</p>
      </div>

      {/* БЛОК 1: Информация о клиенте */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          📋 Блок 1: Информация о клиенте
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ФИО / Компания *
            </label>
            <input
              {...register('clientName', { required: 'Обязательное поле' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
              placeholder="Иванов Иван Иванович"
            />
            {errors.clientName && (
              <p className="text-xs text-[#DD0000] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.clientName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Телефон *
            </label>
            <input
              {...register('phone', { 
                required: 'Обязательное поле',
                pattern: {
                  value: /^[\d\s\+\-\(\)]+$/,
                  message: 'Некорректный формат телефона'
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
              placeholder="+7 (900) 123-45-67"
            />
            {errors.phone && (
              <p className="text-xs text-[#DD0000] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Некорректный email'
                }
              })}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
              placeholder="email@example.com"
            />
            {errors.email && (
              <p className="text-xs text-[#DD0000] mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Адрес
            </label>
            <input
              {...register('address')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
              placeholder="ул. Ленина, д. 1, кв. 1"
            />
          </div>
        </div>
      </section>

      {/* БЛОК 2: Информация об обращении */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">
          📨 Блок 2: Информация об обращении
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тип обращения *
            </label>
            <select
              {...register('complaintType', { required: 'Обязательное поле' })}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            >
              <option value="">Выберите тип</option>
              <option value="Письменное">📨 Письменное</option>
              <option value="Устное">📞 Устное</option>
              <option value="От регулятора">🏛️ От регулятора</option>
              <option value="Из ЛК">💻 Из личного кабинета</option>
            </select>
            {errors.complaintType && (
              <p className="text-xs text-[#DD0000] mt-1">{errors.complaintType.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Канал получения
            </label>
            <select
              {...register('channel')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            >
              <option value="">Выберите канал</option>
              <option value="Почта">📬 Почта</option>
              <option value="Телефон">📞 Телефон</option>
              <option value="Email">📧 Email</option>
              <option value="Личный визит">👤 Личный визит</option>
              <option value="Портал">💻 Портал</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дата поступления
            </label>
            <input
              {...register('receiveDate')}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent bg-gray-50"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID клиента
            </label>
            <input
              value="Автоматически из БД"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              readOnly
            />
          </div>
        </div>
      </section>

      {/* БЛОК 3: Содержание обращения */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">
          💬 Блок 3: Содержание обращения
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Категория * <span className="text-[#0051BA] text-xs">(AI предложит)</span>
            </label>
            <select
              {...register('category', { required: 'Обязательное поле' })}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            >
              <option value="">Выберите категорию</option>
              <option value="Жалоба на услугу">Жалоба на услугу</option>
              <option value="Запрос информации">Запрос информации</option>
              <option value="Запрос данных">Запрос персональных данных</option>
              <option value="Претензия">Претензия</option>
              <option value="Предложение">Предложение</option>
              <option value="Жалоба на комиссию">Жалоба на комиссию</option>
              <option value="Прочее">Прочее</option>
            </select>
            {errors.category && (
              <p className="text-xs text-[#DD0000] mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Подкатегория
            </label>
            <input
              {...register('subcategory')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
              placeholder="Уточнение категории"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Краткое описание * (2-3 строки)
          </label>
          <textarea
            {...register('shortDescription', { required: 'Обязательное поле' })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            placeholder="Краткая суть обращения..."
          />
          {errors.shortDescription && (
            <p className="text-xs text-[#DD0000] mt-1">{errors.shortDescription.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Полное описание
          </label>
          <textarea
            {...register('fullDescription')}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            placeholder="Полный текст письма или подробное описание звонка..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Прикрепленные документы
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0051BA] transition-colors">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Нажмите для загрузки или перетащите файлы
              </p>
              <p className="text-xs text-gray-500 mt-1">PDF, DOCX, JPG, PNG до 10MB</p>
            </label>
          </div>
          
          {files.length > 0 && (
            <div className="mt-3 space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-[#DD0000] hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* БЛОК 4: Приоритизация */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">
          ⚡ Блок 4: Приоритизация
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Приоритет *
          </label>
          <div className="space-y-2">
            <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${priority === 'high' ? 'border-[#DD0000] bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}>
              <input
                {...register('priority', { required: 'Выберите приоритет' })}
                type="radio"
                value="high"
                className="w-4 h-4"
              />
              <div>
                <div className="font-medium text-gray-800">🔴 Высокий (3 дня)</div>
                <div className="text-xs text-gray-600">Критичное обращение, требует немедленного внимания</div>
              </div>
            </label>

            <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${priority === 'medium' ? 'border-[#FFAA00] bg-yellow-50' : 'border-gray-300 hover:border-gray-400'}`}>
              <input
                {...register('priority')}
                type="radio"
                value="medium"
                className="w-4 h-4"
              />
              <div>
                <div className="font-medium text-gray-800">🟡 Средний (7 дней)</div>
                <div className="text-xs text-gray-600">Требует внимания в ближайшее время</div>
              </div>
            </label>

            <label className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${priority === 'low' ? 'border-[#00AA44] bg-green-50' : 'border-gray-300 hover:border-gray-400'}`}>
              <input
                {...register('priority')}
                type="radio"
                value="low"
                className="w-4 h-4"
              />
              <div>
                <div className="font-medium text-gray-800">🟢 Обычный (30 дней)</div>
                <div className="text-xs text-gray-600">Стандартная обработка</div>
              </div>
            </label>
          </div>
          {errors.priority && (
            <p className="text-xs text-[#DD0000] mt-1">{errors.priority.message}</p>
          )}
        </div>

        {priority && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Причина приоритета
            </label>
            <input
              {...register('priorityReason')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
              placeholder="Обоснование выбранного приоритета"
            />
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-sm font-medium text-gray-800">Плановая дата ответа:</div>
          <div className="text-lg font-bold text-[#0051BA]">
            {priority === 'high' && new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU')}
            {priority === 'medium' && new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU')}
            {priority === 'low' && new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU')}
            {!priority && 'Выберите приоритет'}
          </div>
        </div>
      </section>

      {/* БЛОК 5: Маршрутизация */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">
          🎯 Блок 5: Маршрутизация
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Целевое подразделение * <span className="text-[#0051BA] text-xs">(AI предложит)</span>
            </label>
            <select
              {...register('targetDepartment', { required: 'Обязательное поле' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            >
              <option value="">Выберите подразделение</option>
              <option value="Розничное кредитование">Розничное кредитование</option>
              <option value="Карточные услуги">Карточные услуги</option>
              <option value="Операционное обслуживание">Операционное обслуживание</option>
              <option value="Юридический отдел">Юридический отдел</option>
              <option value="Безопасность">Безопасность</option>
              <option value="Соответствие нормам">Соответствие нормам / Compliance</option>
              <option value="VIP-клиенты">Обслуживание VIP-клиентов</option>
            </select>
            {errors.targetDepartment && (
              <p className="text-xs text-[#DD0000] mt-1">{errors.targetDepartment.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Целевой продукт
            </label>
            <select
              {...register('targetProduct')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            >
              <option value="">Выберите продукт</option>
              <option value="Кредит потребительский">Кредит потребительский</option>
              <option value="Ипотека">Ипотека</option>
              <option value="Дебетовая карта">Дебетовая карта</option>
              <option value="Кредитная карта">Кредитная карта</option>
              <option value="Вклад">Вклад</option>
              <option value="Счет">Расчетный счет</option>
              <option value="Прочее">Прочее</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">История обращений этого клиента</span>
            <button type="button" className="text-[#0051BA] text-sm hover:underline">
              Посмотреть все
            </button>
          </div>
          <p className="text-sm text-gray-600">Загружается из базы данных...</p>
        </div>
      </section>

      {/* БЛОК 6: Дополнительно */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">
          ➕ Блок 6: Дополнительно
        </h3>
        
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              {...register('needsClarification')}
              type="checkbox"
              className="w-4 h-4 text-[#0051BA] rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              Требуется уточнение информации?
            </span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Комментарии оператора
          </label>
          <textarea
            {...register('operatorComments')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            placeholder="Дополнительные комментарии, которые помогут в обработке..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Теги для аналитики
          </label>
          <input
            {...register('tags')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            placeholder="#кредит #претензия #vip-клиент (через пробел)"
          />
        </div>
      </section>

      {/* Валидация */}
      <section className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="text-sm font-bold text-gray-800 mb-2">✅ Проверка перед отправкой:</h4>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            {watch('clientName') ? <Check className="w-4 h-4 text-[#00AA44]" /> : <div className="w-4 h-4 border-2 border-gray-300 rounded" />}
            <span>Данные клиента заполнены</span>
          </div>
          <div className="flex items-center gap-2">
            {watch('complaintType') && watch('category') ? <Check className="w-4 h-4 text-[#00AA44]" /> : <div className="w-4 h-4 border-2 border-gray-300 rounded" />}
            <span>Тип и категория выбраны</span>
          </div>
          <div className="flex items-center gap-2">
            {watch('priority') ? <Check className="w-4 h-4 text-[#00AA44]" /> : <div className="w-4 h-4 border-2 border-gray-300 rounded" />}
            <span>Приоритет определен</span>
          </div>
          <div className="flex items-center gap-2">
            {watch('targetDepartment') ? <Check className="w-4 h-4 text-[#00AA44]" /> : <div className="w-4 h-4 border-2 border-gray-300 rounded" />}
            <span>Подразделение выбрано</span>
          </div>
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
          className="flex-1 px-6 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] transition-colors font-medium"
        >
          Зарегистрировать обращение
        </button>
      </section>
    </form>
  );
}
