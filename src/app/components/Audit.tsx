import { Search, FileText, Shield, AlertCircle, CheckCircle, TrendingUp, Eye, Brain, Zap, Target } from 'lucide-react';
import { useState } from 'react';
import { AsIsToBeSwitch } from '@/app/components/AsIsToBeSwitch';

export function Audit() {
  const [isToBeMode, setIsToBeMode] = useState(false);

  // AS IS - Ручной аудит
  const asIsFeatures = [
    {
      icon: Search,
      title: 'Выборочная проверка',
      description: 'Ручной отбор 5-10% обращений для проверки',
      color: '#0051BA',
    },
    {
      icon: FileText,
      title: 'Документальный контроль',
      description: 'Проверка наличия и правильности документов',
      color: '#0051BA',
    },
    {
      icon: Shield,
      title: 'Compliance-проверка',
      description: 'Ручная сверка с регламентами и требованиями',
      color: '#00AA44',
    },
    {
      icon: AlertCircle,
      title: 'Выявление нарушений',
      description: 'Обнаружение ошибок и несоответствий',
      color: '#DD0000',
    },
    {
      icon: CheckCircle,
      title: 'Подготовка отчета',
      description: 'Ручное формирование отчета в Excel',
      color: '#00AA44',
    },
    {
      icon: TrendingUp,
      title: 'Рекомендации',
      description: 'Предложения по улучшению процессов',
      color: '#FFAA00',
    },
  ];

  // TO BE - Автоматизированный аудит
  const toBeFeatures = [
    {
      icon: Eye,
      title: 'Тотальный контроль',
      description: 'AI проверяет 100% обращений в режиме реального времени',
      color: '#0051BA',
      badge: 'AI',
    },
    {
      icon: Brain,
      title: 'Умный анализ документов',
      description: 'ML-распознавание и автоматическая проверка всех документов',
      color: '#0066DD',
      badge: 'ML',
    },
    {
      icon: Shield,
      title: 'Авто-compliance',
      description: 'Автоматическая проверка по 50+ правилам и регламентам',
      color: '#00AA44',
      badge: 'AUTO',
    },
    {
      icon: Zap,
      title: 'Мгновенные алерты',
      description: 'Realtime-уведомления о критичных нарушениях',
      color: '#DD0000',
      badge: 'REAL-TIME',
    },
    {
      icon: Target,
      title: 'Авто-отчетность',
      description: 'Автогенерация дашбордов, отчетов, презентаций',
      color: '#00AA44',
      badge: 'AUTO',
    },
    {
      icon: Brain,
      title: 'Предиктивная аналитика',
      description: 'AI предсказывает риски и предлагает превентивные меры',
      color: '#FFAA00',
      badge: 'AI',
    },
  ];

  const asIsMetrics = [
    { label: 'Проверено за месяц', value: '450', color: 'from-blue-500 to-blue-600', icon: '📋' },
    { label: 'Найдено нарушений', value: '28', color: 'from-red-500 to-red-600', icon: '⚠️' },
    { label: 'Среднее время аудита', value: '45 мин', color: 'from-yellow-500 to-yellow-600', icon: '⏱️' },
    { label: 'Охват проверкой', value: '8%', color: 'from-purple-500 to-purple-600', icon: '📊' },
  ];

  const toBeMetrics = [
    { label: 'Проверено за месяц', value: '5,200', color: 'from-blue-500 to-blue-600', icon: '🤖', trend: '+1,055%' },
    { label: 'Найдено нарушений', value: '142', color: 'from-red-500 to-red-600', icon: '🎯', trend: '+407%' },
    { label: 'Среднее время аудита', value: '0.3 сек', color: 'from-yellow-500 to-yellow-600', icon: '⚡', trend: '-99.9%' },
    { label: 'Охват проверкой', value: '100%', color: 'from-purple-500 to-purple-600', icon: '✅', trend: '+1,150%' },
  ];

  const asIsTypes = [
    { name: 'Плановые проверки', description: 'Ежемесячная выборка обращений', icon: '📅', frequency: '1 раз/месяц' },
    { name: 'Проверки по жалобам', description: 'При поступлении повторных обращений', icon: '📢', frequency: 'По факту' },
    { name: 'Проверки регулятора', description: 'По запросу Банка России', icon: '🏛️', frequency: 'По запросу' },
  ];

  const toBeTypes = [
    { name: 'Непрерывный мониторинг', description: 'AI проверяет каждое обращение автоматически', icon: '🔄', frequency: '24/7' },
    { name: 'Риск-ориентированный', description: 'Глубокий анализ обращений с высоким риском', icon: '🎯', frequency: 'Real-time' },
    { name: 'Тематические аудиты', description: 'Автоматический анализ по категориям', icon: '📊', frequency: 'Ежедневно' },
    { name: 'Проактивный контроль', description: 'Предиктивный анализ и предотвращение проблем', icon: '🔮', frequency: 'Real-time' },
  ];

  const asIsBenefits = [
    {
      icon: '👁️',
      title: 'Базовый контроль',
      description: 'Выборочная проверка позволяет найти только очевидные нарушения. Многие проблемы остаются незамеченными из-за низкого охвата',
      color: 'gray',
    },
    {
      icon: '📄',
      title: 'Документальный след',
      description: 'Формальная проверка наличия документов, но без глубокого анализа содержания',
      color: 'gray',
    },
    {
      icon: '📈',
      title: 'Ретроспективный анализ',
      description: 'Анализ выполняется постфактум, когда изменить уже ничего нельзя',
      color: 'gray',
    },
  ];

  const toBeBenefits = [
    {
      icon: '🤖',
      title: 'Тотальный AI-контроль',
      description: 'Искусственный интеллект анализирует 100% обращений в режиме реального времени. Проверка по 50+ параметрам качества, соответствия регламентам, рискам. Мгновенные алерты о критичных проблемах',
      color: 'blue',
    },
    {
      icon: '🎯',
      title: 'Глубокий анализ контента',
      description: 'ML-алгоритмы анализируют не только наличие документов, но и их содержание, тональность, соответствие контексту. Распознавание аномалий, выявление скрытых паттернов',
      color: 'green',
    },
    {
      icon: '🔮',
      title: 'Предиктивная модель',
      description: 'AI предсказывает риски нарушений за 2-3 дня до факта. Система предлагает превентивные меры, автоматически корректирует процессы. Обучение на истории инцидентов',
      color: 'purple',
    },
  ];

  const features = isToBeMode ? toBeFeatures : asIsFeatures;
  const metrics = isToBeMode ? toBeMetrics : asIsMetrics;
  const types = isToBeMode ? toBeTypes : asIsTypes;
  const benefits = isToBeMode ? toBeBenefits : asIsBenefits;

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      gray: 'from-gray-500 to-gray-600',
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
          {/* Hero */}
          <div className="text-center mb-12">
            <div
              className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${
                isToBeMode ? 'from-[#0051BA] to-[#0066DD]' : 'from-[#6B7280] to-[#4B5563]'
              } rounded-3xl mb-6 shadow-lg animate-scaleIn`}
            >
              {isToBeMode ? <Brain className="w-12 h-12 text-white" /> : <Search className="w-12 h-12 text-white" />}
            </div>
            
            <h1 className="text-5xl font-bold text-gray-800 mb-4">Аудит</h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
              {isToBeMode
                ? 'AI-система тотального контроля качества с предиктивной аналитикой'
                : 'Выборочный контроль качества обработки обращений и соответствия регламентам'}
            </p>

            <div className={`inline-flex items-center gap-2 ${
              isToBeMode ? 'bg-blue-50 border-[#0051BA]' : 'bg-gray-50 border-gray-400'
            } border rounded-lg px-6 py-3`}>
              <span className="text-2xl">{isToBeMode ? '🤖' : '🔍'}</span>
              <div className="text-left">
                <div className={`text-sm font-bold ${isToBeMode ? 'text-[#0051BA]' : 'text-gray-700'}`}>
                  {isToBeMode ? 'Версия TO BE - AI-аудит' : 'Версия AS IS - Ручной аудит'}
                </div>
                <div className="text-xs text-gray-700">
                  {isToBeMode
                    ? 'Охват 100%, обнаружение проблем +407%'
                    : 'Выборочная проверка 8% обращений'}
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              {isToBeMode ? 'AI-функционал аудита' : 'Функции аудита'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all hover:scale-105 animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center relative"
                        style={{ backgroundColor: `${feature.color}15` }}
                      >
                        <IconComponent className="w-6 h-6" style={{ color: feature.color }} />
                        {isToBeMode && 'badge' in feature && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#0051BA] to-[#0066DD] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {feature.badge}
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
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

          {/* Types */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {isToBeMode ? 'Режимы AI-аудита' : 'Типы аудита'}
            </h2>
            
            <div className={`grid grid-cols-1 ${isToBeMode ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>
              {types.map((type, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#0051BA] transition-all animate-scaleIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-4xl mb-3">{type.icon}</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{type.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                  <div className="inline-block px-3 py-1 bg-blue-100 text-[#0051BA] text-xs font-bold rounded-full">
                    {type.frequency}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${getColorClasses(benefit.color)} rounded-xl p-6 text-white shadow-lg animate-fadeInUp`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl mb-3">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-sm opacity-90">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}