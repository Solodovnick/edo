import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Save, X, BookOpen, Search, ChevronRight, HelpCircle } from 'lucide-react';
import { appealStorage, Appeal } from '../../../services/appealStorage';
import { persistRegisteredAppeal } from '../../../services/edoCabinetApi';
import { toast } from 'sonner';
import { knowledgeItems, searchKnowledge } from './CategoryKnowledgeBase';
import { NotificationBell } from '../notifications/NotificationBell';

interface AppealRegistrationCardProps {
  onBack: () => void;
  onSave: (appeal: Appeal) => void;
}

export function AppealRegistrationCard({ onBack, onSave }: AppealRegistrationCardProps) {
  // Auto-generated appeal number
  const [appealNumber, setAppealNumber] = useState('');
  
  const [applicantType, setApplicantType] = useState<'individual' | 'company'>('individual');
  const [appealType, setAppealType] = useState<'устное' | 'письменное' | 'регулятор'>('устное');
  
  // Form fields
  const [applicantName, setApplicantName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [cbs, setCbs] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [content, setContent] = useState('');
  const [responsible, setResponsible] = useState('Расул Рамазанов');
  const [deadline, setDeadline] = useState('');

  // Knowledge base states
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
  const [kbSearchQuery, setKbSearchQuery] = useState('');
  const [kbSelectedCategory, setKbSelectedCategory] = useState('');

  // Initialize appeal number on component mount
  useEffect(() => {
    const generatedId = appealStorage.generateId();
    setAppealNumber(generatedId);
  }, []);

  // Категории и подкатегории по типам заявителей
  const categoriesData = {
    common: {
      'Без категории': [
        'Внешнее мошенничество',
        'Изменение владельца номера телефона',
        'Клиент не заинтересован в услугах банка',
        'Клиент не обслуживается в отделении'
      ],
      'Благодарность': ['Качество обслуживания'],
      'Ошибка Банка': [
        'Недостаточное информирование клиента',
        'Технический сбой в работе банковских систем / оборудования',
        'Ошибка сотрудника: Неисполнение обязательств',
        'Ошибка сотрудника: Некачественная консультация',
        'Ошибка сотрудника: Некорректное общение',
        'Ошибка сотрудника: Некорректное формирование документа',
        'Ошибка сотрудника: Некорректный расчет'
      ],
      'Ошибка Клиента': [
        'Нарушение условий договора',
        'Некорректное толкование информации от Банка',
        'Несоответствие требованиям Банка',
        'Разрешение на взаимодействие с третьими лицами при ПЗ'
      ]
    },
    regulator: {
      'Взаимодействие в рамках 230-ФЗ': [
        'Частота взаимодействия в рамках 230-ФЗ',
        'Отказ Заемщика от взаимодействия в рамках 230-ФЗ',
        'Отказ третьего лица от взаимодействия в рамках 230-ФЗ',
        'Взаимодействие Заемщика через представителя в рамках 230-ФЗ'
      ],
      'Взаимодействие в рамках 152-ФЗ': [
        'Обработка персональных данных в рамках № 152-ФЗ',
        'Отзыв Согласия на обработку персональных данных в рамках № 152-ФЗ'
      ],
      'Другое': [
        'Передача договора по цессии',
        'По вкладным операциям (выдача вклада, расторжение договора вклада и пр.)',
        'По ЧДП',
        'Реструктуризация договора и предоставление кредитных каникул',
        'Передача информации в БКИ'
      ],
      'Взаимодействие по услугам': [
        'Иные услуги Банка',
        'Иные услуги партнеров',
        'Персональный консультант по услуге Персональный консультант и иным услугам (например, АКВД)',
        'Страхование по договору страхования'
      ]
    },
    individual: {
      'Автодозвон': ['Просроченная задолженность', 'Реклама'],
      'Другое': [
        'Бренд',
        'Недовольство акцией "Приведи друга"',
        'Недовольство стоимостью кредита, % ставкой',
        'Некорректные сведения в кредитной истории',
        'Несогласие с отменой льготного периода по карте ИГБ',
        'О запрете передачи прав требования',
        'Обстановка в отделении',
        'Оспариваие операции',
        'Отзыв согласия на обработку персональных данных'
      ],
      'Дистанционные сервисы': [
        'Банкоматы',
        'Интернет-банк',
        'Мобильный банк',
        'Сайт Банка',
        'Терминалы'
      ],
      'Досрочное погашение кредита': ['Неисполнение заявления'],
      'Запрос документов': ['Иное', 'Копия договора', 'Справка/выписка'],
      'Звонки от сотрудников Банка': [
        'Напоминание о платеже',
        'Предложение услуг',
        'Просроченная задолженность'
      ],
      'Изменение условий договора': [
        'Несогласие с изменением % ставки',
        'Отказ от исполнения обязательств',
        'Реструктуризация'
      ],
      'Информирование Банка': [
        'Иное',
        'О банкротстве',
        'О наступлении страхового случая',
        'О смерти клиента'
      ],
      'Микрофинансовая компания Пойдём': [
        'Отказ от исполнения обязательств по договору'
      ],
      'Отказ Банка предоставить услугу': [
        'Вклад',
        'Выдача д/с со счета',
        'ЕБС',
        'Зачисление д/с на счет',
        'Кредит',
        'Кредитные каникулы',
        'Проведение платежа'
      ],
      'Отказ клиента от услуг': [
        'Иные услуги Банка',
        'Иные услуги партнеров',
        'Персональный консультант',
        'Страхование'
      ],
      'Письма от Банка': ['Просроченная задолженность', 'Реклама'],
      'Поведение и квалификация сотрудников Банка': [
        'Кассир',
        'Консультант',
        'Не установлен',
        'Сотрудник бэк-офиса',
        'Сотрудник КАО',
        'Сотрудник ЦТО'
      ],
      'СМС сообщения от Банка': [
        'Напоминание о платеже',
        'Операции по счетам',
        'Просроченная задолженность',
        'Реклама'
      ]
    }
  };

  // Получить список категорий в зависимости от типа заявителя
  const getAvailableCategories = () => {
    const commonCategories = Object.keys(categoriesData.common);
    if (applicantType === 'individual') {
      return [...commonCategories, ...Object.keys(categoriesData.individual)];
    } else if (applicantType === 'company') {
      return [...commonCategories];
    }
    return commonCategories;
  };

  // Получить список подкатегорий для выбранной категории
  const getAvailableSubcategories = () => {
    if (!category) return [];
    
    // Проверяем в общих категориях
    if (categoriesData.common[category as keyof typeof categoriesData.common]) {
      return categoriesData.common[category as keyof typeof categoriesData.common];
    }
    
    // Проверяем в категориях физлица
    if (applicantType === 'individual' && categoriesData.individual[category as keyof typeof categoriesData.individual]) {
      return categoriesData.individual[category as keyof typeof categoriesData.individual];
    }
    
    return [];
  };

  // Сброс категории и подкатегории при смене типа заявителя
  const handleApplicantTypeChange = (type: 'individual' | 'company') => {
    setApplicantType(type);
    setCategory('');
    setSubcategory('');
  };

  // Сброс подкатегории при смене категории
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setSubcategory('');
  };
  
  // Автоматический расчет дедлайна на основе типа обращения
  const calculateDeadline = (type: 'устное' | 'письменное' | 'регулятор') => {
    const today = new Date();
    let daysToAdd = 0;
    
    switch(type) {
      case 'устное':
        daysToAdd = 7;
        break;
      case 'письменное':
        daysToAdd = 15;
        break;
      case 'регулятор':
        daysToAdd = 3;
        break;
    }
    
    const deadlineDate = new Date(today);
    deadlineDate.setDate(today.getDate() + daysToAdd);
    
    const formatted = `${deadlineDate.getDate().toString().padStart(2, '0')}/${(deadlineDate.getMonth() + 1).toString().padStart(2, '0')}/${deadlineDate.getFullYear().toString().slice(-2)}`;
    setDeadline(formatted);
  };
  
  const handleAppealTypeChange = (type: 'устное' | 'письменное' | 'регулятор') => {
    setAppealType(type);
    calculateDeadline(type);
  };

  const handleSave = async () => {
    // Validation
    if (applicantType === 'individual' && !applicantName.trim()) {
      toast.error('Заполните ФИО заявителя');
      return;
    }
    if (applicantType === 'company' && !organizationName.trim()) {
      toast.error('Заполните наименование организации');
      return;
    }
    if (!content.trim()) {
      toast.error('Заполните содержание обращения');
      return;
    }
    if (!deadline) {
      toast.error('Укажите дедлайн');
      return;
    }

    // Generate ID
    const id = appealStorage.generateId();
    
    // Get current date
    const now = new Date();
    const regDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear().toString().slice(-2)}`;

    // Determine type - только Физлицо или Юрлицо
    const type = applicantType === 'company' ? 'Юрлицо' : 'Физлицо';

    const respTrim = (responsible || '').trim()
    const hasAssignee = Boolean(respTrim) && respTrim !== 'Не назначено'
    const cabinetStatus = hasAssignee ? 'На ответственном, взято' : 'Назначено'

    // Create appeal object
    const appeal: Appeal = {
      id,
      regDate,
      category: appealType,
      subcategory,
      status: cabinetStatus,
      deadline,
      responsible: respTrim || 'Не назначено',
      applicantName: applicantType === 'individual' ? applicantName : 'N/A',
      organizationName: applicantType === 'company' ? organizationName : 'N/A',
      address: address || 'N/A',
      cbs: 'N/A',
      type,
      isMine:
        respTrim === 'Расул Рамазанов' || respTrim === 'Александр Солодовников',
      content,
      solution: '',
      response: '',
      phone,
      email,
      appealType,
      createdBy: 'Регистратор',
      updatedAt: new Date().toISOString(),
    };

    const { ok, appeal: stored } = await persistRegisteredAppeal(appeal, (a) =>
      appealStorage.saveAppeal(a)
    );

    if (ok) {
      toast.success(`Обращение №${stored.id} успешно зарегистрировано!`);
      onSave(stored);
      onBack();
    } else {
      toast.error('Ошибка при сохранении обращения');
    }
  };

  const handleCancel = () => {
    if (content.trim() || applicantName.trim() || organizationName.trim()) {
      if (window.confirm('Вы уверены? Несохраненные данные будут потеряны.')) {
        onBack();
      }
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#D1C4E9' }}>
      {/* Header */}
      <div className="shadow-md" style={{ backgroundColor: '#673AB7' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-purple-600 rounded transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-xl font-medium text-white">Создание обращения</h1>
                <p className="text-sm text-purple-200">Заполните данные для регистрации</p>
              </div>
            </div>
            <NotificationBell variant="card" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* Applicant Type */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Тип заявителя <span className="text-red-600">*</span>
          </label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleApplicantTypeChange('individual')}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded ${
                applicantType === 'individual'
                  ? 'text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
              }`}
              style={applicantType === 'individual' ? { backgroundColor: '#673AB7' } : {}}
            >
              Физлицо
            </button>
            <button
              onClick={() => handleApplicantTypeChange('company')}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded ${
                applicantType === 'company'
                  ? 'text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
              }`}
              style={applicantType === 'company' ? { backgroundColor: '#673AB7' } : {}}
            >
              Юрлицо
            </button>
          </div>
        </div>

        {/* Appeal Type */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Тип обращения <span className="text-red-600">*</span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => handleAppealTypeChange('устное')}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded ${
                appealType === 'устное'
                  ? 'text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
              }`}
              style={appealType === 'устное' ? { backgroundColor: '#673AB7' } : {}}
            >
              Устное
            </button>
            <button
              onClick={() => handleAppealTypeChange('письменное')}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded ${
                appealType === 'письменное'
                  ? 'text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
              }`}
              style={appealType === 'письменное' ? { backgroundColor: '#673AB7' } : {}}
            >
              Письменное
            </button>
            <button
              onClick={() => handleAppealTypeChange('регулятор')}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded ${
                appealType === 'регулятор'
                  ? 'text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
              }`}
              style={appealType === 'регулятор' ? { backgroundColor: '#673AB7' } : {}}
            >
              Регулятор
            </button>
          </div>
        </div>

        {/* Applicant Info */}
        <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
          <h3 className="font-medium text-gray-900">Данные заявителя</h3>
          
          {/* Appeal Number - auto-generated */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Номер обращения
            </label>
            <div className="px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded">
              {appealNumber}
            </div>
          </div>
          
          {applicantType === 'individual' && (
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                ФИО <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                placeholder="Иванов Иван Иванович"
              />
            </div>
          )}

          {applicantType === 'company' && (
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Наименование организации <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                placeholder="ООО Рога и копыта"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Телефон</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                placeholder="+7 (999) 123-45-67"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Адрес</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
              placeholder="Город, улица, дом, квартира"
            />
          </div>
        </div>

        {/* Appeal Details */}
        <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Детали обращения</h3>
            <button
              onClick={() => setShowKnowledgeBase(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-purple-700 hover:bg-purple-50 rounded transition-colors"
              style={{ border: '1px solid #673AB7' }}
            >
              <BookOpen className="w-4 h-4" />
              База знаний
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Категория</label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
              >
                <option value="">Выберите категорию</option>
                {getAvailableCategories().map(cat => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Подкатегория</label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
              >
                <option value="">Выберите подкатегорию</option>
                {getAvailableSubcategories().map(subcat => (
                  <option key={subcat}>{subcat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Ответственный <span className="text-red-600">*</span>
              </label>
              <select
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
              >
                <option>Расул Рамазанов</option>
                <option>Александр Солодовников</option>
                <option>Иванова М.П.</option>
                <option>Смирнова О.А.</option>
                <option>Васильев П.Р.</option>
                <option>Николаев С.М.</option>
                <option>Морозова Л.И.</option>
                <option>Павлов Д.В.</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Дедлайн <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  const formatted = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
                  setDeadline(formatted);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Содержание обращения <span className="text-red-600">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
              placeholder="Опишите суть обращения клиента..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-col sm:flex-row">
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 text-white font-medium rounded hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            style={{ backgroundColor: '#673AB7' }}
          >
            <Save className="w-5 h-5" />
            Сохранить обращение
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 px-6 py-3 bg-white text-gray-700 border border-gray-300 font-medium rounded hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Отмена
          </button>
        </div>
      </div>

      {/* Knowledge Base Modal */}
      {showKnowledgeBase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowKnowledgeBase(false)}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ backgroundColor: '#673AB7' }}>
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-white" />
                <h2 className="text-xl font-medium text-white">База знаний по категориям</h2>
              </div>
              <button
                onClick={() => setShowKnowledgeBase(false)}
                className="p-1 hover:bg-purple-600 rounded transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 py-4 border-b bg-gray-50">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={kbSearchQuery}
                  onChange={(e) => setKbSearchQuery(e.target.value)}
                  placeholder="Поиск по ключевым словам (мошенничество, банкомат, просрочка...)"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-2">
                <p className="text-sm text-gray-600 mb-4">
                  {kbSearchQuery.trim() ? 
                    `Найдено: ${searchKnowledge(kbSearchQuery).length} сценариев` : 
                    `Всего: ${knowledgeItems.length} сценариев`
                  }
                </p>
                {(kbSearchQuery.trim() ? searchKnowledge(kbSearchQuery) : knowledgeItems).slice(0, 20).map((item, idx) => (
                  <div 
                    key={idx} 
                    className="border border-gray-200 rounded-lg p-3 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer bg-white"
                    onClick={() => {
                      setCategory(item.category);
                      setSubcategory(item.subcategory);
                      setShowKnowledgeBase(false);
                      toast.success('Категория выбрана!');
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 mb-2">💬 {item.clientSays}</p>
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded font-medium">
                            {item.category}
                          </span>
                          <ChevronRight className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">{item.subcategory}</span>
                          {item.tag && (
                            <span className="ml-auto px-2 py-0.5 bg-red-500 text-white rounded font-medium">
                              {item.tag}
                            </span>
                          )}
                        </div>
                      </div>
                      <button 
                        className="px-3 py-1.5 text-xs text-white rounded hover:opacity-90 flex-shrink-0" 
                        style={{ backgroundColor: '#673AB7' }}
                      >
                        Выбрать
                      </button>
                    </div>
                  </div>
                ))}
                {kbSearchQuery.trim() && searchKnowledge(kbSearchQuery).length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">🔍 Ничего не найдено</p>
                    <p className="text-sm mt-2">Попробуйте другие ключевые слова: "приложение", "нагрубил", "кредит"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 text-xs text-gray-600">
              <p><strong>Совет:</strong> Используйте поиск по ключевым словам для быстрого поиска нужной категории. Нажмите на категорию для просмотра подкатегорий и примеров.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}