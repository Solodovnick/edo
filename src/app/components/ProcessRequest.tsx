import { ClipboardCheck, MessageSquare, FileEdit, CheckCircle, Clock, Users, TrendingUp, AlertTriangle, Sparkles, Brain, Zap, Bot } from 'lucide-react';
import { useState } from 'react';
import { AsIsToBeSwitch } from '@/app/components/AsIsToBeSwitch';

export function ProcessRequest() {
  const [isToBeMode, setIsToBeMode] = useState(false);

  // AS IS - Ручная обработка
  const asIsWorkStages = [
    {
      icon: FileEdit,
      title: 'Анализ обращения',
      description: 'Ручное изучение деталей и классификация',
      color: '#0051BA',
    },
    {
      icon: Users,
      title: 'Сбор информации',
      description: 'Ручной запрос данных из других систем',
      color: '#0051BA',
    },
    {
      icon: MessageSquare,
      title: 'Взаимодействие с клиентом',
      description: 'Звонки, email для уточнения деталей',
      color: '#00AA44',
    },
    {
      icon: CheckCircle,
      title: 'Подготовка решения',
      description: 'Ручное формирование ответа и документов',
      color: '#00AA44',
    },
    {
      icon: AlertTriangle,
      title: 'Контроль сроков',
      description: 'Проверка дедлайнов вручную',
      color: '#FFAA00',
    },
    {
      icon: TrendingUp,
      title: 'Эскалация',
      description: 'Ручное повышение приоритета при необходимости',
      color: '#DD0000',
    },
  ];

  // TO BE - Автоматизированная обработка
  const toBeWorkStages = [
    {
      icon: Brain,
      title: 'AI-анализ обращения',
      description: 'Автоматический анализ тональности, классификация и приоритизация',
      color: '#0051BA',
      badge: 'AI',
    },
    {
      icon: Zap,
      title: 'Авто-сбор данных',
      description: 'Интеграция с 15+ системами, автоматическая подгрузка истории',
      color: '#0066DD',
      badge: 'AUTO',
    },
    {
      icon: Bot,
      title: 'Чат-бот ассистент',
      description: 'AI-помощник для первичного общения и уточнения деталей',
      color: '#00AA44',
      badge: 'BOT',
    },
    {
      icon: Sparkles,
      title: 'Smart-решения',
      description: 'AI генерирует проект ответа на основе 1000+ кейсов',
      color: '#00AA44',
      badge: 'AI',
    },
    {
      icon: Clock,
      title: 'Проактивный контроль',
      description: 'Автоуведомления, прогнозирование рисков нарушения SLA',
      color: '#FFAA00',
      badge: 'SMART',
    },
    {
      icon: TrendingUp,
      title: 'Авто-эскалация',
      description: 'Автоматическое повышение приоритета по правилам и ML',
      color: '#DD0000',
      badge: 'AUTO',
    },
  ];

  const asIsStatistics = [
    { label: 'В работе сейчас', value: '42', color: 'from-blue-500 to-blue-600', icon: '📋' },
    { label: 'Обработано сегодня', value: '28', color: 'from-green-500 to-green-600', icon: '✅' },
    { label: 'Среднее время', value: '4.2ч', color: 'from-yellow-500 to-yellow-600', icon: '⏱️' },
    { label: 'Успешное закрытие', value: '94%', color: 'from-purple-500 to-purple-600', icon: '🎯' },
  ];

  const toBeStatistics = [
    { label: 'В работе сейчас', value: '42', color: 'from-blue-500 to-blue-600', icon: '🤖' },
    { label: 'Обработано сегодня', value: '65', color: 'from-green-500 to-green-600', icon: '⚡', trend: '+132%' },
    { label: 'Среднее время', value: '1.8ч', color: 'from-yellow-500 to-yellow-600', icon: '🚀', trend: '-57%' },
    { label: 'Успешное закрытие', value: '99%', color: 'from-purple-500 to-purple-600', icon: '🎯', trend: '+5%' },
  ];

  const asIsTools = [
    {
      title: 'История обращений',
      description: 'Ручной поиск и просмотр предыдущих обращений клиента',
      icon: '📚',
    },
    {
      title: 'Шаблоны ответов',
      description: 'Статическая библиотека готовых ответов на типовые вопросы',
      icon: '📝',
    },
    {
      title: 'Интеграция с CRM',
      description: 'Ручная подгрузка данных клиента из системы',
      icon: '🔗',
    },
    {
      title: 'Чек-листы',
      description: 'Статические пошаговые инструкции для разных типов',
      icon: '✔️',
    },
  ];

  const toBeTools = [
    {
      title: 'AI-история 360°',
      description: 'Умный анализ всей истории клиента с выявлением паттернов и рисков',
      icon: '🧠',
      badge: 'AI',
    },
    {
      title: 'GPT-генератор ответов',
      description: 'AI создает персонализированные ответы на основе контекста и истории',
      icon: '✨',
      badge: 'GPT',
    },
    {
      title: 'Умная интеграция',
      description: 'Автоматическая подгрузка из 15+ систем в режиме реального времени',
      icon: '🔄',
      badge: 'REAL-TIME',
    },
    {
      title: 'Динамические чек-листы',
      description: 'Адаптивные инструкции, которые меняются в зависимости от контекста',
      icon: '🎯',
      badge: 'SMART',
    },
  ];

  const asIsFeatures = [
    {
      icon: Clock,
      title: 'Контроль SLA',
      description: 'Ручные уведомления при приближении дедлайна. Цветовая индикация: зеленый → желтый → красный',
    },
    {
      icon: Users,
      title: 'Командная работа',
      description: 'Возможность консультаций с коллегами, ручная передача обращения специалисту другого подразделения',
    },
    {
      icon: TrendingUp,
      title: 'Базовая аналитика',
      description: 'Простая статистика личной производительности, средние сроки обработки',
    },
  ];

  const toBeFeatures = [
    {
      icon: Sparkles,
      title: 'Проактивный SLA',
      description: 'AI прогнозирует риски нарушения SLA за 48 часов. Автоматические уведомления, предложения по оптимизации, динамическая приоритизация',
    },
    {
      icon: Bot,
      title: 'AI-коллаборация',
      description: 'Умная система автоматически привлекает нужных экспертов, синхронизирует работу команды, предлагает оптимальные решения на основе успешных кейсов',
    },
    {
      icon: Brain,
      title: 'Предиктивная аналитика',
      description: 'ML-модели предсказывают сложность обращения, вероятность эскалации, удовлетворенность клиента. Персональные рекомендации по улучшению работы',
    },
  ];

  const workStages = isToBeMode ? toBeWorkStages : asIsWorkStages;
  const statistics = isToBeMode ? toBeStatistics : asIsStatistics;
  const tools = isToBeMode ? toBeTools : asIsTools;
  const features = isToBeMode ? toBeFeatures : asIsFeatures;

  return (
    <div className="flex flex-1 overflow-hidden bg-gradient-to-br from-[#F5F5F5] via-white to-[#E8F4FF]">
      <AsIsToBeSwitch isToBeMode={isToBeMode} onToggle={() => setIsToBeMode(!isToBeMode)} />
      
      <main className="flex-1 overflow-y-auto p-12">
        <div
          key={isToBeMode ? 'tobe' : 'asis'}
          className="max-w-[1400px] mx-auto animate-fadeIn"
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div
              className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${
                isToBeMode ? 'from-[#0051BA] to-[#0066DD]' : 'from-[#6B7280] to-[#4B5563]'
              } rounded-3xl mb-6 shadow-lg animate-scaleIn`}
            >
              {isToBeMode ? (
                <Bot className="w-12 h-12 text-white" />
              ) : (
                <ClipboardCheck className="w-12 h-12 text-white" />
              )}
            </div>
            
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Обработать обращение
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
              {isToBeMode
                ? 'Умное рабочее место с AI-ассистентом, автоматическим сбором данных и генерацией решений'
                : 'Централизованное рабочее место для ручной обработки обращений с контролем сроков'}
            </p>

            <div className={`inline-flex items-center gap-2 ${
              isToBeMode ? 'bg-blue-50 border-[#0051BA]' : 'bg-gray-50 border-gray-400'
            } border rounded-lg px-6 py-3`}>
              <span className="text-2xl">{isToBeMode ? '🤖' : '⚙️'}</span>
              <div className="text-left">
                <div className={`text-sm font-bold ${isToBeMode ? 'text-[#0051BA]' : 'text-gray-700'}`}>
                  {isToBeMode ? 'Версия TO BE - AI-ассистент' : 'Версия AS IS - Ручная обработка'}
                </div>
                <div className="text-xs text-gray-700">
                  {isToBeMode
                    ? 'Производительность выше на 130%, время обработки меньше на 57%'
                    : 'Стандартный процесс с ручной обработкой всех этапов'}
                </div>
              </div>
            </div>
          </div>

          {/* Work Stages */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              {isToBeMode ? 'Автоматизированные этапы' : 'Этапы обработки обращения'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workStages.map((stage, index) => {
                const IconComponent = stage.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all hover:scale-105 animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white"
                        style={{ backgroundColor: stage.color }}
                      >
                        {index + 1}
                      </div>
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center relative"
                        style={{ backgroundColor: `${stage.color}15` }}
                      >
                        <IconComponent className="w-6 h-6" style={{ color: stage.color }} />
                        {isToBeMode && 'badge' in stage && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#0051BA] to-[#0066DD] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {stage.badge}
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {stage.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {stage.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Statistics */}
          <div className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            {statistics.map((stat, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow-lg relative overflow-hidden animate-scaleIn`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-sm font-medium opacity-90 mb-2">{stat.label}</div>
                <div className="text-4xl font-bold">{stat.value}</div>
                {isToBeMode && 'trend' in stat && (
                  <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold">
                    {stat.trend}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tools */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {isToBeMode ? 'AI-инструменты обработки' : 'Инструменты обработки'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tools.map((tool, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors relative animate-fadeInSide"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-4xl">{tool.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {tool.description}
                    </p>
                  </div>
                  {isToBeMode && 'badge' in tool && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-[#0051BA] to-[#0066DD] text-white text-[9px] font-bold px-2 py-1 rounded">
                      {tool.badge}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${
                    isToBeMode
                      ? index === 0
                        ? 'from-blue-500 to-blue-600'
                        : index === 1
                        ? 'from-purple-500 to-purple-600'
                        : 'from-green-500 to-green-600'
                      : index === 0
                      ? 'from-blue-500 to-blue-600'
                      : index === 1
                      ? 'from-green-500 to-green-600'
                      : 'from-purple-500 to-purple-600'
                  } rounded-xl p-6 text-white shadow-lg animate-fadeInUp`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <IconComponent className="w-10 h-10 mb-3 opacity-90" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm opacity-90">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}