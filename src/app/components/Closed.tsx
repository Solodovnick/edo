import { CheckCircle, Award, TrendingUp, Users, Clock, Star, Target, Brain, Zap, Trophy } from 'lucide-react';
import { useState } from 'react';
import { AsIsToBeSwitch } from '@/app/components/AsIsToBeSwitch';

export function Closed() {
  const [isToBeMode, setIsToBeMode] = useState(false);

  const asIsMetrics = [
    { label: 'Закрыто за месяц', value: '1,240', color: 'from-green-500 to-green-600', icon: '✅' },
    { label: 'В срок (SLA)', value: '94%', color: 'from-blue-500 to-blue-600', icon: '⏰' },
    { label: 'Средняя оценка', value: '4.2', color: 'from-yellow-500 to-yellow-600', icon: '⭐' },
    { label: 'Без повторных', value: '91%', color: 'from-purple-500 to-purple-600', icon: '🎯' },
  ];

  const toBeMetrics = [
    { label: 'Закрыто за месяц', value: '2,890', color: 'from-green-500 to-green-600', icon: '⚡', trend: '+133%' },
    { label: 'В срок (SLA)', value: '99%', color: 'from-blue-500 to-blue-600', icon: '🎯', trend: '+5%' },
    { label: 'Средняя оценка', value: '4.9', color: 'from-yellow-500 to-yellow-600', icon: '⭐', trend: '+17%' },
    { label: 'Без повторных', value: '98%', color: 'from-purple-500 to-purple-600', icon: '🏆', trend: '+7%' },
  ];

  const asIsFeatures = [
    {
      icon: CheckCircle,
      title: 'Закрытие обращения',
      description: 'Ручная смена статуса на "Закрыто"',
      color: '#00AA44',
    },
    {
      icon: Clock,
      title: 'Проверка сроков',
      description: 'Ручная сверка дедлайнов SLA',
      color: '#0051BA',
    },
    {
      icon: Star,
      title: 'Оценка клиента',
      description: 'Сбор обратной связи (если есть)',
      color: '#FFAA00',
    },
    {
      icon: Award,
      title: 'Фиксация результата',
      description: 'Обновление базовой статистики',
      color: '#0051BA',
    },
  ];

  const toBeFeatures = [
    {
      icon: Zap,
      title: 'Авто-закрытие',
      description: 'Автоматическое закрытие после доведения и подтверждения',
      color: '#00AA44',
      badge: 'AUTO',
    },
    {
      icon: Target,
      title: 'SLA-аналитика',
      description: 'Автоматический расчет метрик, трендов, прогнозов',
      color: '#0051BA',
      badge: 'SMART',
    },
    {
      icon: Trophy,
      title: 'Проактивный фидбэк',
      description: 'Автозапрос оценки через оптимальный канал и время',
      color: '#FFAA00',
      badge: 'AUTO',
    },
    {
      icon: Brain,
      title: 'AI-аналитика',
      description: 'ML-анализ паттернов, выявление проблем, рекомендации',
      color: '#0066DD',
      badge: 'AI',
    },
    {
      icon: Users,
      title: 'Командные инсайты',
      description: 'Персональная и командная аналитика производительности',
      color: '#00AA44',
      badge: 'INSIGHTS',
    },
    {
      icon: TrendingUp,
      title: 'Предиктивная модель',
      description: 'AI предсказывает риски повторных обращений',
      color: '#DD0000',
      badge: 'AI',
    },
  ];

  const asIsStats = [
    {
      title: 'Еженедельная статистика',
      description: 'Базовые отчеты по количеству и срокам',
      icon: '📊',
      metrics: ['Количество закрытых', 'SLA compliance', 'Средний срок'],
    },
    {
      title: 'Оценки клиентов',
      description: 'Средний балл удовлетворенности',
      icon: '⭐',
      metrics: ['Средняя оценка', 'Количество оценок', 'NPS (если собран)'],
    },
    {
      title: 'Базовые метрики',
      description: 'Простые KPI по подразделениям',
      icon: '📈',
      metrics: ['Скорость обработки', 'Нагрузка', 'Количество нарушений'],
    },
  ];

  const toBeStats = [
    {
      title: 'Realtime-дашборд',
      description: 'Живая аналитика по всем метрикам 24/7',
      icon: '📊',
      badge: 'LIVE',
      metrics: ['50+ метрик в реальном времени', 'Трендовый анализ', 'Кросс-функциональные срезы', 'Прогнозная модель'],
    },
    {
      title: 'Сентимент-анализ',
      description: 'AI анализирует тональность всех отзывов',
      icon: '🧠',
      badge: 'AI',
      metrics: ['Тональность по категориям', 'Выявление проблемных зон', 'Автоматические алерты', 'Рекомендации по улучшению'],
    },
    {
      title: 'Предиктивная аналитика',
      description: 'ML-модели прогнозируют результаты',
      icon: '🔮',
      badge: 'ML',
      metrics: ['Прогноз SLA на неделю', 'Риски повторных обращений', 'Оптимальная загрузка', 'Персональные рекомендации'],
    },
  ];

  const asIsBenefits = [
    {
      icon: '✅',
      title: 'Простое закрытие',
      description: 'Базовый процесс смены статуса, обновление базы данных, минимальная документация',
      color: 'green',
    },
    {
      icon: '📋',
      title: 'Стандартная отчетность',
      description: 'Еженедельные и ежемесячные отчеты в Excel, базовые графики, экспорт в PDF',
      color: 'blue',
    },
  ];

  const toBeBenefits = [
    {
      icon: '🤖',
      title: 'Умное закрытие',
      description: 'AI автоматически закрывает обращение после проверки всех условий: доведение решения, получение подтверждения, прохождение контроля качества, сбор обратной связи. Автоматическое обновление всех систем, уведомления заинтересованным сторонам',
      color: 'green',
    },
    {
      icon: '📊',
      title: 'Интеллектуальная аналитика',
      description: 'ML-система анализирует каждое закрытое обращение: паттерны успеха и неудач, корреляции между факторами, тренды по времени, подразделениям, типам. Автоматическое построение 50+ графиков и дашбордов, персональные рекомендации для каждого сотрудника',
      color: 'blue',
    },
    {
      icon: '🔮',
      title: 'Предиктивный контроль',
      description: 'AI предсказывает риски: вероятность повторного обращения (с точностью 87%), прогноз удовлетворенности клиента, риски эскалации в будущем. Система предлагает превентивные действия: дополнительная коммуникация, проверка качества решения, follow-up через месяц',
      color: 'purple',
    },
  ];

  const metrics = isToBeMode ? toBeMetrics : asIsMetrics;
  const features = isToBeMode ? toBeFeatures : asIsFeatures;
  const stats = isToBeMode ? toBeStats : asIsStats;
  const benefits = isToBeMode ? toBeBenefits : asIsBenefits;

  const getColorClasses = (color: string) => {
    const colors = {
      green: 'from-green-500 to-green-600',
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
    };
    return colors[color as keyof typeof colors] || colors.green;
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
                isToBeMode ? 'from-[#00AA44] to-[#00CC55]' : 'from-[#6B7280] to-[#4B5563]'
              } rounded-3xl mb-6 shadow-lg animate-scaleIn`}
            >
              {isToBeMode ? <Trophy className="w-12 h-12 text-white" /> : <CheckCircle className="w-12 h-12 text-white" />}
            </div>
            
            <h1 className="text-5xl font-bold text-gray-800 mb-4">Закрыто</h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
              {isToBeMode
                ? 'Умная система закрытия с AI-аналитикой и предиктивным контролем качества'
                : 'Реестр успешно закрытых обращений с базовой статистикой и оценками'}
            </p>

            <div className={`inline-flex items-center gap-2 ${
              isToBeMode ? 'bg-green-50 border-[#00AA44]' : 'bg-gray-50 border-gray-400'
            } border rounded-lg px-6 py-3`}>
              <span className="text-2xl">{isToBeMode ? '🏆' : '✅'}</span>
              <div className="text-left">
                <div className={`text-sm font-bold ${isToBeMode ? 'text-[#00AA44]' : 'text-gray-700'}`}>
                  {isToBeMode ? 'Версия TO BE - AI-закрытие' : 'Версия AS IS - Базовое закрытие'}
                </div>
                <div className="text-xs text-gray-700">
                  {isToBeMode
                    ? 'Производительность +133%, SLA compliance 99%'
                    : 'Стандартный процесс завершения'}
                </div>
              </div>
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
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              {isToBeMode ? 'AI-функционал закрытия' : 'Процесс закрытия'}
            </h2>
            
            <div className={`grid grid-cols-1 md:grid-cols-2 ${isToBeMode ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}>
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
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#00AA44] to-[#00CC55] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
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

          {/* Stats */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              {isToBeMode ? 'Интеллектуальная аналитика' : 'Статистика и отчетность'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all relative animate-scaleIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="text-4xl">{stat.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{stat.title}</h3>
                      <p className="text-sm text-gray-600">{stat.description}</p>
                    </div>
                    {isToBeMode && 'badge' in stat && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-[#0051BA] to-[#0066DD] text-white text-[9px] font-bold px-2 py-1 rounded">
                        {stat.badge}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {stat.metrics.map((metric, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00AA44]"></div>
                        {metric}
                      </div>
                    ))}
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