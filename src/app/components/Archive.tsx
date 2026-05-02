import { Archive as ArchiveIcon, Database, HardDrive, Lock, Search, Clock, Zap, Brain, Shield, FileSearch } from 'lucide-react';
import { useState } from 'react';
import { AsIsToBeSwitch } from '@/app/components/AsIsToBeSwitch';

export function Archive() {
  const [isToBeMode, setIsToBeMode] = useState(false);

  const asIsFeatures = [
    {
      icon: Database,
      title: 'Хранение данных',
      description: 'Базовое хранение в реляционной БД',
      color: '#0051BA',
    },
    {
      icon: Search,
      title: 'Простой поиск',
      description: 'Поиск по номеру обращения и дате',
      color: '#00AA44',
    },
    {
      icon: Lock,
      title: 'Базовая защита',
      description: 'Стандартные права доступа',
      color: '#DD0000',
    },
    {
      icon: Clock,
      title: 'Ручная архивация',
      description: 'Перенос в архив вручную раз в квартал',
      color: '#FFAA00',
    },
  ];

  const toBeFeatures = [
    {
      icon: HardDrive,
      title: 'Облачное хранилище',
      description: 'Многоуровневое облачное хранение с репликацией',
      color: '#0051BA',
      badge: 'CLOUD',
    },
    {
      icon: Brain,
      title: 'AI-поиск',
      description: 'Семантический поиск по содержанию, контексту, связям',
      color: '#0066DD',
      badge: 'AI',
    },
    {
      icon: Shield,
      title: 'Киберзащита',
      description: 'Многофакторная аутентификация, шифрование, аудит доступа',
      color: '#DD0000',
      badge: 'SECURE',
    },
    {
      icon: Zap,
      title: 'Авто-архивация',
      description: 'Автоматический перенос через 90 дней после закрытия',
      color: '#00AA44',
      badge: 'AUTO',
    },
    {
      icon: FileSearch,
      title: 'Fulltext-индекс',
      description: 'Полнотекстовое индексирование всех документов',
      color: '#0051BA',
      badge: 'INDEX',
    },
    {
      icon: Database,
      title: 'Умное сжатие',
      description: 'AI-компрессия экономит 70% места без потери качества',
      color: '#00AA44',
      badge: 'AI',
    },
  ];

  const asIsMetrics = [
    { label: 'Объем архива', value: '850 ГБ', color: 'from-blue-500 to-blue-600', icon: '💾' },
    { label: 'Обращений в архиве', value: '42,000', color: 'from-green-500 to-green-600', icon: '📦' },
    { label: 'Время поиска', value: '3-5 мин', color: 'from-yellow-500 to-yellow-600', icon: '⏱️' },
    { label: 'Доступность', value: '95%', color: 'from-purple-500 to-purple-600', icon: '✅' },
  ];

  const toBeMetrics = [
    { label: 'Объем архива', value: '290 ГБ', color: 'from-blue-500 to-blue-600', icon: '☁️', trend: '-66%' },
    { label: 'Обращений в архиве', value: '42,000', color: 'from-green-500 to-green-600', icon: '🗄️', trend: '—' },
    { label: 'Время поиска', value: '0.8 сек', color: 'from-yellow-500 to-yellow-600', icon: '⚡', trend: '-99%' },
    { label: 'Доступность', value: '99.9%', color: 'from-purple-500 to-purple-600', icon: '🛡️', trend: '+4.9%' },
  ];

  const asIsRetention = [
    { period: 'Активные', duration: '1 год', description: 'В основной БД', storage: '🗄️' },
    { period: 'Архивные', duration: '5 лет', description: 'В архивной БД', storage: '📦' },
    { period: 'Регуляторные', duration: '10 лет', description: 'Специальное хранение', storage: '🏛️' },
  ];

  const toBeRetention = [
    { period: 'Hot Storage', duration: '30 дней', description: 'SSD, мгновенный доступ', storage: '🔥' },
    { period: 'Warm Storage', duration: '1 год', description: 'Облако, быстрый доступ', storage: '☁️' },
    { period: 'Cold Storage', duration: '5 лет', description: 'Архивное облако, доступ за 1 мин', storage: '❄️' },
    { period: 'Glacier', duration: '10+ лет', description: 'Долгосрочный архив, доступ за 12 часов', storage: '🧊' },
  ];

  const asIsBenefits = [
    {
      icon: '📁',
      title: 'Базовое хранение',
      description: 'Простое сохранение в базу данных. Занимает много места, медленный поиск, ограниченные возможности фильтрации',
      color: 'gray',
    },
    {
      icon: '🔒',
      title: 'Стандартная безопасность',
      description: 'Базовые права доступа на уровне ролей. Нет детального аудита, сложно отследить действия',
      color: 'gray',
    },
  ];

  const toBeBenefits = [
    {
      icon: '🚀',
      title: 'Умное хранилище',
      description: 'Многоуровневая облачная архитектура: горячие данные на SSD (мгновенный доступ), теплые в облаке (1 сек), холодные в архиве (1 мин), ледник для долгосрочного хранения. AI-компрессия экономит 70% места',
      color: 'blue',
    },
    {
      icon: '🔍',
      title: 'Мгновенный AI-поиск',
      description: 'Семантический поиск понимает смысл запроса, ищет по содержанию, контексту, связям между обращениями. Полнотекстовое индексирование всех документов. Находит за 0.8 секунды среди миллионов записей',
      color: 'green',
    },
    {
      icon: '🛡️',
      title: 'Киберзащита уровня банка',
      description: 'Шифрование AES-256, многофакторная аутентификация, детальный аудит каждого доступа, автоматическое обнаружение аномалий. Соответствие GDPR, 152-ФЗ, требованиям ЦБ РФ',
      color: 'purple',
    },
  ];

  const features = isToBeMode ? toBeFeatures : asIsFeatures;
  const metrics = isToBeMode ? toBeMetrics : asIsMetrics;
  const retention = isToBeMode ? toBeRetention : asIsRetention;
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
              {isToBeMode ? <HardDrive className="w-12 h-12 text-white" /> : <ArchiveIcon className="w-12 h-12 text-white" />}
            </div>
            
            <h1 className="text-5xl font-bold text-gray-800 mb-4">Архивация</h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
              {isToBeMode
                ? 'Умное облачное хранилище с AI-поиском и многоуровневой архитектурой'
                : 'Долгосрочное хранение закрытых обращений и связанных документов'}
            </p>

            <div className={`inline-flex items-center gap-2 ${
              isToBeMode ? 'bg-blue-50 border-[#0051BA]' : 'bg-gray-50 border-gray-400'
            } border rounded-lg px-6 py-3`}>
              <span className="text-2xl">{isToBeMode ? '☁️' : '📦'}</span>
              <div className="text-left">
                <div className={`text-sm font-bold ${isToBeMode ? 'text-[#0051BA]' : 'text-gray-700'}`}>
                  {isToBeMode ? 'Версия TO BE - Облачное хранилище' : 'Версия AS IS - Базовый архив'}
                </div>
                <div className="text-xs text-gray-700">
                  {isToBeMode
                    ? 'Экономия места 66%, поиск быстрее на 99%'
                    : 'Стандартное хранение в БД'}
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              {isToBeMode ? 'Возможности облачного архива' : 'Возможности архива'}
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

          {/* Retention */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {isToBeMode ? 'Многоуровневое хранение' : 'Политика хранения'}
            </h2>
            
            <div className={`grid grid-cols-1 ${isToBeMode ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'} gap-6`}>
              {retention.map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#0051BA] transition-all animate-scaleIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-4xl mb-3">{item.storage}</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{item.period}</h3>
                  <div className="text-sm font-medium text-[#0051BA] mb-2">{item.duration}</div>
                  <p className="text-xs text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className={`grid grid-cols-1 ${isToBeMode ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
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