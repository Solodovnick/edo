import { CheckCircle, Send, FileCheck, ThumbsUp, Mail, MessageCircle, Award, TrendingUp, Sparkles, Zap, Brain, Target } from 'lucide-react';
import { useState } from 'react';
import { AsIsToBeSwitch } from '@/app/components/AsIsToBeSwitch';

export function ResolveRequest() {
  const [isToBeMode, setIsToBeMode] = useState(false);

  // AS IS - Ручное доведение
  const asIsSteps = [
    {
      icon: FileCheck,
      title: 'Проверка решения',
      description: 'Ручной контроль качества и полноты ответа',
      color: '#0051BA',
    },
    {
      icon: Mail,
      title: 'Формирование документа',
      description: 'Ручная генерация официального ответа в Word',
      color: '#0051BA',
    },
    {
      icon: Send,
      title: 'Отправка клиенту',
      description: 'Ручная отправка через выбранный канал',
      color: '#00AA44',
    },
    {
      icon: MessageCircle,
      title: 'Уведомление клиента',
      description: 'Ручная отправка SMS/Email о готовности',
      color: '#00AA44',
    },
    {
      icon: ThumbsUp,
      title: 'Получение обратной связи',
      description: 'Ожидание оценки удовлетворенности',
      color: '#FFAA00',
    },
    {
      icon: Award,
      title: 'Фиксация результата',
      description: 'Ручное обновление статистики и закрытие',
      color: '#00AA44',
    },
  ];

  // TO BE - Автоматизированное доведение
  const toBeSteps = [
    {
      icon: Brain,
      title: 'AI-контроль качества',
      description: 'Автоматическая проверка полноты, соответствия регламенту, тональности',
      color: '#0051BA',
      badge: 'AI',
    },
    {
      icon: Sparkles,
      title: 'Авто-генерация документа',
      description: 'AI создает ответ по шаблону с электронной подписью',
      color: '#0066DD',
      badge: 'AUTO',
    },
    {
      icon: Zap,
      title: 'Мультиканальная отправка',
      description: 'Автоматическая доставка через все доступные каналы',
      color: '#00AA44',
      badge: 'MULTI',
    },
    {
      icon: MessageCircle,
      title: 'Smart-уведомления',
      description: 'Персонализированные уведомления в оптимальное время',
      color: '#00AA44',
      badge: 'SMART',
    },
    {
      icon: Target,
      title: 'Проактивный фидбэк',
      description: 'Автоматический запрос оценки через 2 часа после доставки',
      color: '#FFAA00',
      badge: 'AUTO',
    },
    {
      icon: Award,
      title: 'Авто-аналитика',
      description: 'Автообновление метрик, анализ паттернов, рекомендации',
      color: '#00AA44',
      badge: 'AI',
    },
  ];

  const asIsChannels = [
    { name: 'Email', icon: '📧', description: 'Официальный email клиента', active: true, manual: true },
    { name: 'SMS', icon: '💬', description: 'Мобильный телефон', active: true, manual: true },
    { name: 'Личный кабинет', icon: '🖥️', description: 'Web/Mobile приложение', active: true, manual: true },
    { name: 'Почта России', icon: '📮', description: 'Заказное письмо (2-5 дней)', active: false, manual: true },
  ];

  const toBeChannels = [
    { name: 'Email', icon: '📧', description: 'Мгновенно с трекингом открытия', active: true, auto: true },
    { name: 'SMS', icon: '💬', description: 'Мгновенно с подтверждением доставки', active: true, auto: true },
    { name: 'Личный кабинет', icon: '🖥️', description: 'Push-уведомление + внутреннее сообщение', active: true, auto: true },
    { name: 'Почта России', icon: '📮', description: 'Авто-печать и отправка с трекингом', active: true, auto: true },
    { name: 'Telegram Bot', icon: '✈️', description: 'Мгновенно через чат-бот банка', active: true, auto: true },
    { name: 'Банк России', icon: '🏛️', description: 'Автокопия для регуляторных обращений', active: true, auto: true },
  ];

  const asIsMetrics = [
    { label: 'Доведено сегодня', value: '35', color: 'from-green-500 to-green-600', icon: '✅' },
    { label: 'Средняя оценка', value: '4.2', color: 'from-yellow-500 to-yellow-600', icon: '⭐' },
    { label: 'Довольных клиентов', value: '89%', color: 'from-blue-500 to-blue-600', icon: '😊' },
    { label: 'Без повторных', value: '92%', color: 'from-purple-500 to-purple-600', icon: '🎯' },
  ];

  const toBeMetrics = [
    { label: 'Доведено сегодня', value: '78', color: 'from-green-500 to-green-600', icon: '⚡', trend: '+123%' },
    { label: 'Средняя оценка', value: '4.9', color: 'from-yellow-500 to-yellow-600', icon: '⭐', trend: '+17%' },
    { label: 'Довольных клиентов', value: '98%', color: 'from-blue-500 to-blue-600', icon: '😊', trend: '+9%' },
    { label: 'Без повторных', value: '97%', color: 'from-purple-500 to-purple-600', icon: '🎯', trend: '+5%' },
  ];

  const asIsFeatures = [
    {
      icon: '📝',
      title: 'Ручное оформление',
      description: 'Сотрудник самостоятельно заполняет шаблон ответа, проверяет форматирование, добавляет реквизиты',
      color: 'blue',
    },
    {
      icon: '📤',
      title: 'Разовая отправка',
      description: 'Отправка через один выбранный канал. Для дополнительных каналов нужны отдельные действия',
      color: 'green',
    },
    {
      icon: '⏰',
      title: 'Пассивный фидбэк',
      description: 'Ожидание инициативы клиента. Оценка собирается только если клиент сам откликнулся',
      color: 'yellow',
    },
  ];

  const toBeFeatures = [
    {
      icon: '🤖',
      title: 'AI-генерация ответов',
      description: 'GPT создает персонализированный ответ на основе истории клиента, контекста обращения и успешных кейсов. Автоматическая подстановка всех данных, электронная подпись',
      color: 'blue',
    },
    {
      icon: '🌐',
      title: 'Омниканальная доставка',
      description: 'Одновременная автоотправка через ВСЕ каналы: Email, SMS, личный кабинет, Telegram, печать для почты. Единая система трекинга доставки и прочтения в реальном времени',
      color: 'green',
    },
    {
      icon: '🎯',
      title: 'Проактивный опыт',
      description: 'Smart-система автоматически запрашивает оценку в оптимальное время, анализирует тональность ответов, выявляет риски негатива, предлагает корректирующие действия',
      color: 'yellow',
    },
  ];

  const steps = isToBeMode ? toBeSteps : asIsSteps;
  const channels = isToBeMode ? toBeChannels : asIsChannels;
  const metrics = isToBeMode ? toBeMetrics : asIsMetrics;
  const features = isToBeMode ? toBeFeatures : asIsFeatures;

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      yellow: 'from-yellow-500 to-yellow-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

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
                isToBeMode ? 'from-[#00AA44] to-[#00CC55]' : 'from-[#6B7280] to-[#4B5563]'
              } rounded-3xl mb-6 shadow-lg animate-scaleIn`}
            >
              {isToBeMode ? (
                <Zap className="w-12 h-12 text-white" />
              ) : (
                <CheckCircle className="w-12 h-12 text-white" />
              )}
            </div>
            
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Довести решение
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
              {isToBeMode
                ? 'Автоматизированное доведение с AI-генерацией ответов и омниканальной доставкой'
                : 'Финальный этап: ручное формирование ответа и доведение решения до клиента'}
            </p>

            <div className={`inline-flex items-center gap-2 ${
              isToBeMode ? 'bg-green-50 border-[#00AA44]' : 'bg-gray-50 border-gray-400'
            } border rounded-lg px-6 py-3`}>
              <span className="text-2xl">{isToBeMode ? '🚀' : '📨'}</span>
              <div className="text-left">
                <div className={`text-sm font-bold ${isToBeMode ? 'text-[#00AA44]' : 'text-gray-700'}`}>
                  {isToBeMode ? 'Версия TO BE - Авто-доведение' : 'Версия AS IS - Ручное доведение'}
                </div>
                <div className="text-xs text-gray-700">
                  {isToBeMode
                    ? 'Производительность +123%, удовлетворенность +9%'
                    : 'Стандартный процесс с ручной отправкой'}
                </div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              {isToBeMode ? 'Автоматизированный процесс' : 'Этапы доведения решения'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all hover:scale-105 animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
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
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#00AA44] to-[#00CC55] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
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

          {/* Channels */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {isToBeMode ? 'Омниканальная доставка' : 'Каналы доведения'}
            </h2>
            
            <div className={`grid grid-cols-1 ${isToBeMode ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
              {channels.map((channel, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all animate-scaleIn ${
                    channel.active
                      ? 'bg-green-50 border-green-300 hover:border-green-400'
                      : 'bg-gray-50 border-gray-300 opacity-50'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="text-3xl">{channel.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-gray-800">{channel.name}</h3>
                      {isToBeMode && 'auto' in channel && channel.auto && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-gradient-to-r from-[#00AA44] to-[#00CC55] text-white rounded">
                          AUTO
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{channel.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${metric.color} rounded-xl p-6 text-white shadow-lg relative overflow-hidden animate-scaleIn`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl mb-2">{metric.icon}</div>
                <div className="text-sm font-medium opacity-90 mb-2">{metric.label}</div>
                <div className="text-4xl font-bold">{metric.value}</div>
                {isToBeMode && 'trend' in metric && (
                  <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold">
                    {metric.trend}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${getColorClasses(feature.color)} rounded-xl p-6 text-white shadow-lg animate-fadeInUp`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm opacity-90">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}