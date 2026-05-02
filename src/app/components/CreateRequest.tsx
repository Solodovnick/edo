import { Plus, FileText, User, Calendar, Tag, AlertCircle, Clock, Zap, Brain, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CreateComplaintModal } from '@/app/components/CreateComplaintModal';
import { AsIsToBeSwitch } from '@/app/components/AsIsToBeSwitch';
import { toast } from 'sonner';

interface CreateRequestProps {
  autoOpenModal?: boolean;
}

export function CreateRequest({ autoOpenModal = false }: CreateRequestProps) {
  const [isModalOpen, setIsModalOpen] = useState(autoOpenModal);
  const [isToBeMode, setIsToBeMode] = useState(false);

  useEffect(() => {
    if (autoOpenModal) {
      setIsModalOpen(true);
    }
  }, [autoOpenModal]);

  const handleCreateComplaint = (data: any) => {
    console.log('Created complaint:', data);
    toast.success('✅ Обращение успешно создано', {
      description: `Номер обращения: ${Math.floor(Math.random() * 90000) + 10000}`,
      duration: 3000,
    });
    setIsModalOpen(false);
  };

  // AS IS состояние - базовый функционал
  const asIsSteps = [
    {
      icon: User,
      title: 'Данные клиента',
      description: 'Ручной ввод ФИО, контактов, типа клиента',
      color: '#0051BA',
    },
    {
      icon: FileText,
      title: 'Тип обращения',
      description: 'Выбор из 3 типов: Письменное, Устное, Регуляторное',
      color: '#0051BA',
    },
    {
      icon: Tag,
      title: 'Категория и тема',
      description: 'Ручная классификация обращения',
      color: '#00AA44',
    },
    {
      icon: AlertCircle,
      title: 'Приоритет',
      description: 'Ручное определение срочности',
      color: '#FFAA00',
    },
    {
      icon: Calendar,
      title: 'Сроки SLA',
      description: 'Ручной расчет дедлайнов по правилам',
      color: '#0051BA',
    },
    {
      icon: Clock,
      title: 'Назначение',
      description: 'Ручной выбор подразделения',
      color: '#00AA44',
    },
  ];

  // TO BE состояние - улучшенный функционал
  const toBeSteps = [
    {
      icon: Brain,
      title: 'AI-автозаполнение',
      description: 'Распознавание клиента по базе, автозаполнение контактов',
      color: '#0051BA',
      badge: 'NEW',
    },
    {
      icon: Zap,
      title: 'Умная классификация',
      description: 'AI определяет тип по тексту обращения, подсказки',
      color: '#0066DD',
      badge: 'AI',
    },
    {
      icon: Tag,
      title: 'Авто-категоризация',
      description: 'ML-алгоритм анализа и автоматической категоризации',
      color: '#00AA44',
      badge: 'ML',
    },
    {
      icon: AlertCircle,
      title: 'Динамический приоритет',
      description: 'Автоматический расчет на основе 12+ факторов',
      color: '#FFAA00',
      badge: 'AUTO',
    },
    {
      icon: Calendar,
      title: 'Smart SLA',
      description: 'Автоматический расчет с учетом праздников и загрузки',
      color: '#0051BA',
      badge: 'SMART',
    },
    {
      icon: Zap,
      title: 'Интелл. роутинг',
      description: 'AI выбирает оптимальное подразделение и сотрудника',
      color: '#00AA44',
      badge: 'AI',
    },
  ];

  const asIsRequestTypes = [
    { type: 'Письменное обращение', sla: '30 дней', icon: '📨', color: '#0051BA', note: 'Стандартный срок' },
    { type: 'Устное обращение', sla: '7 дней', icon: '📞', color: '#00AA44', note: 'Требует оформления' },
    { type: 'Регуляторное обращение', sla: '3 дня', icon: '🏛️', color: '#DD0000', note: 'Критичный приоритет' },
  ];

  const toBeRequestTypes = [
    { type: 'Письменное обращение', sla: '15 рабочих дней', icon: '📨', color: '#0051BA', note: 'Оптимизировано, авторасчет' },
    { type: 'Устное обращение', sla: '15 рабочих дней', icon: '📞', color: '#00AA44', note: 'Автооформление, уведомления' },
    { type: 'Регуляторное обращение', sla: '15 рабочих дней', icon: '🏛️', color: '#DD0000', note: '100% SLA compliance, автоконтроль' },
    { type: 'От Банка России', sla: '15 рабочих дней', icon: '🏛️', color: '#DD0000', note: 'Максимальный приоритет, нельзя продлить' },
  ];

  const asIsFeatures = [
    {
      icon: '📋',
      color: 'blue',
      title: 'Ручная маршрутизация',
      description: 'Менеджер самостоятельно выбирает подразделение из списка доступных',
    },
    {
      icon: '⏰',
      color: 'green',
      title: 'Базовая приоритизация',
      description: 'Три уровня: высокий, средний, низкий. Выбор вручную',
    },
    {
      icon: '📝',
      color: 'yellow',
      title: 'Простая форма',
      description: 'Стандартный набор полей без валидации и подсказок',
    },
    {
      icon: '📎',
      color: 'purple',
      title: 'Вложения файлов',
      description: 'Возможность загрузить документы, фото, сканы',
    },
  ];

  const toBeFeatures = [
    {
      icon: '🤖',
      color: 'blue',
      title: 'AI-маршрутизация',
      description: 'Умный алгоритм автоматически определяет оптимальное подразделение на основе типа обращения, загрузки и компетенций',
    },
    {
      icon: '🎯',
      color: 'green',
      title: 'Умная приоритизация',
      description: 'Динамический расчет приоритета на основе 12+ факторов: тип клиента, история, SLA-риски, сложность',
    },
    {
      icon: '✨',
      color: 'yellow',
      title: 'Интерактивная форма',
      description: 'Умные подсказки, автозаполнение, валидация в реальном времени, шаблоны для типовых обращений',
    },
    {
      icon: '🔍',
      color: 'purple',
      title: 'OCR + AI анализ',
      description: 'Автоматическое распознавание текста (OCR), извлечение данных, анализ тональности и классификация',
    },
  ];

  const steps = isToBeMode ? toBeSteps : asIsSteps;
  const requestTypes = isToBeMode ? toBeRequestTypes : asIsRequestTypes;
  const features = isToBeMode ? toBeFeatures : asIsFeatures;

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      yellow: 'from-yellow-500 to-yellow-600',
      purple: 'from-purple-500 to-purple-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="flex flex-1 overflow-hidden bg-gradient-to-br from-[#F5F5F5] via-white to-[#E8F4FF]">
      <AsIsToBeSwitch isToBeMode={isToBeMode} onToggle={() => setIsToBeMode(!isToBeMode)} />
      
      <main className="flex-1 overflow-y-auto p-12">
        <div
          key={isToBeMode ? 'tobe' : 'asis'}
          className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div
              className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${
                isToBeMode ? 'from-[#0051BA] to-[#0066DD]' : 'from-[#6B7280] to-[#4B5563]'
              } rounded-3xl mb-6 shadow-lg animate-in zoom-in-95 duration-500`}
            >
              {isToBeMode ? (
                <Zap className="w-12 h-12 text-white" />
              ) : (
                <Plus className="w-12 h-12 text-white" />
              )}
            </div>
            
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Создать обращение
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
              {isToBeMode
                ? 'Создание обращения с AI-ассистентом, автозаполнением и интеллектуальной маршрутизацией'
                : 'Быстрое создание нового обращения клиента с ручным заполнением всех полей'}
            </p>

            <div className={`inline-flex items-center gap-2 ${
              isToBeMode ? 'bg-blue-50 border-[#0051BA]' : 'bg-gray-50 border-gray-400'
            } border rounded-lg px-6 py-3`}>
              <span className="text-2xl">{isToBeMode ? '✨' : '🚀'}</span>
              <div className="text-left">
                <div className={`text-sm font-bold ${isToBeMode ? 'text-[#0051BA]' : 'text-gray-700'}`}>
                  {isToBeMode ? 'Версия TO BE - Умная система' : 'Версия AS IS - Базовый функционал'}
                </div>
                <div className="text-xs text-gray-700">
                  {isToBeMode
                    ? 'AI-помощник автоматизирует 80% рутинных операций'
                    : 'Стандартный процесс с ручным вводом данных'}
                </div>
              </div>
            </div>
          </div>

          {/* Process Steps */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              {isToBeMode ? 'Автоматизированный процесс' : 'Процесс создания обращения'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all hover:scale-105 animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white"
                        style={{ backgroundColor: step.color }}
                      >
                        {index + 1}
                      </div>
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center relative"
                        style={{ backgroundColor: `${step.color}15` }}
                      >
                        <IconComponent className="w-6 h-6" style={{ color: step.color }} />
                        {isToBeMode && 'badge' in step && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#0051BA] to-[#0066DD] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {step.badge}
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Request Types */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Типы обращений и сроки SLA
            </h2>
            
            <div className={`grid grid-cols-1 ${isToBeMode ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'} gap-6`}>
              {requestTypes.map((type, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#0051BA] transition-all animate-in fade-in zoom-in-95 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-5xl mb-4">{type.icon}</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {type.type}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium" style={{ color: type.color }}>
                      SLA: {type.sla}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{type.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${getColorClasses(feature.color)} rounded-xl p-6 text-white shadow-lg animate-in fade-in slide-in-from-left-8 duration-500`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm opacity-90">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <CreateComplaintModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateComplaint}
      />
    </div>
  );
}
