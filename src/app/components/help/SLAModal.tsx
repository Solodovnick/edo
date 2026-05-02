import { X, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface SLAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SLAModal({ isOpen, onClose }: SLAModalProps) {
  if (!isOpen) return null;

  const slaCategories = [
    {
      id: 1,
      title: 'Стандартное письменное обращение',
      icon: '📨',
      color: 'green',
      borderColor: '#00AA44',
      bgColor: 'bg-green-50',
      days: 15,
      daysType: 'рабочих',
      extensible: true,
      maxExtension: 10,
      priority: 'Средний',
      details: [
        'Срок: 15 рабочих дней со дня регистрации',
        'Возможность продления: ДА, максимум на 10 рабочих дней',
        'Продление требует решения уполномоченного лица',
        'При продлении клиенту направляется уведомление',
        'Исключаются выходные и праздничные дни',
      ],
    },
    {
      id: 2,
      title: 'Обращение от Банка России',
      icon: '🏛️',
      color: 'red',
      borderColor: '#DD0000',
      bgColor: 'bg-red-50',
      days: 15,
      daysType: 'рабочих',
      extensible: false,
      priority: 'КРИТИЧНЫЙ',
      details: [
        'Срок: 15 рабочих дней со дня регистрации',
        'Приоритет: КРИТИЧНЫЙ (требуется 100% SLA compliance)',
        'Копия ответа отправляется в Банк России в день направления клиенту',
        'Продление срока НЕ допускается',
        'Автоматическая отправка уведомлений всем ответственным лицам',
        'Высший приоритет обработки в системе',
      ],
    },
    {
      id: 3,
      title: 'Обращение через Финансового омбудсмена',
      icon: '⚖️',
      color: 'blue',
      borderColor: '#0051BA',
      bgColor: 'bg-blue-50',
      days: 15,
      daysType: 'рабочих',
      extensible: false,
      priority: 'Высокий',
      details: [
        'Срок: 15 рабочих дней на рассмотрение',
        'Приоритет: ВЫСОКИЙ',
        'Возможность запроса экспертизы',
        'Продление срока НЕ допускается',
        'Особое внимание к качеству ответа',
      ],
    },
    {
      id: 4,
      title: 'Специальное обращение',
      subtitle: '(карты/персданные/имущество)',
      icon: '💳',
      color: 'purple',
      borderColor: '#9333ea',
      bgColor: 'bg-purple-50',
      days: 30,
      daysType: 'календарных',
      extensible: false,
      priority: 'Средний',
      details: [
        'Категория: Карточные операции / Персональные данные / Имущественные требования',
        'Срок: 30 календарных дней (включая выходные и праздники)',
        'Продление срока НЕ допускается',
        'Требуется особое внимание к оформлению документов',
        'Повышенные требования к юридической точности',
      ],
    },
    {
      id: 5,
      title: 'Устное обращение',
      icon: '📞',
      color: 'yellow',
      borderColor: '#FFAA00',
      bgColor: 'bg-yellow-50',
      days: 15,
      daysType: 'рабочих',
      extensible: false,
      priority: 'Средний',
      details: [
        'Устное обращение должно быть оформлено в письменную форму',
        'Регистрация обязательна не позднее следующего рабочего дня',
        'После оформления рассматривается как стандартное письменное',
        'Срок: 15 рабочих дней со дня регистрации',
        'Продление срока НЕ допускается',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto m-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Clock className="w-7 h-7 text-[#0051BA]" />
              Сроки SLA по типам обращений
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Полный справочник по срокам обработки различных категорий обращений
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Важная информация */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-[#0051BA] rounded-lg p-5">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-[#0051BA] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-[#0051BA] mb-2">
                  Ключевые правила системы SLA
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#00AA44] flex-shrink-0 mt-0.5" />
                    <span>Регистрация не позднее следующего рабочего дня</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#00AA44] flex-shrink-0 mt-0.5" />
                    <span>Автоматический расчет с исключением выходных</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#00AA44] flex-shrink-0 mt-0.5" />
                    <span>Трехуровневая приоритизация обращений</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#00AA44] flex-shrink-0 mt-0.5" />
                    <span>Автоматические уведомления о сроках</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#00AA44] flex-shrink-0 mt-0.5" />
                    <span>Защищенное архивирование с логированием</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#00AA44] flex-shrink-0 mt-0.5" />
                    <span>Цель: 99% обработки в срок (100% для регулятора)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Приоритизация */}
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-5">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Трехуровневая приоритизация
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-[#DD0000] rounded-lg">
                <span className="text-lg font-bold text-[#DD0000]">1.</span>
                <div className="flex-1">
                  <strong className="text-[#DD0000]">КРИТИЧНЫЙ</strong> — Обращения от регулятора
                  <div className="text-xs text-gray-600 mt-1">100% SLA compliance обязательно</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-[#0051BA] rounded-lg">
                <span className="text-lg font-bold text-[#0051BA]">2.</span>
                <div className="flex-1">
                  <strong className="text-[#0051BA]">ВЫСОКИЙ</strong> — Обращения финансового омбудсмена
                  <div className="text-xs text-gray-600 mt-1">Особое внимание к качеству ответа</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-[#00AA44] rounded-lg">
                <span className="text-lg font-bold text-[#00AA44]">3.</span>
                <div className="flex-1">
                  <strong className="text-[#00AA44]">СТАНДАРТНЫЙ</strong> — Обращения клиентов
                  <div className="text-xs text-gray-600 mt-1">Стандартная обработка с возможностью продления</div>
                </div>
              </div>
            </div>
          </div>

          {/* Категории SLA */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#0051BA]" />
              Детальная информация по категориям
            </h3>
            <div className="space-y-4">
              {slaCategories.map((category) => (
                <div
                  key={category.id}
                  className={`${category.bgColor} border-2 rounded-lg p-5 transition-all hover:shadow-md`}
                  style={{ borderColor: category.borderColor }}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{category.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-gray-800 mb-1">
                            {category.title}
                          </h4>
                          {category.subtitle && (
                            <div className="text-sm text-gray-600">{category.subtitle}</div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold" style={{ color: category.borderColor }}>
                            {category.days}
                          </div>
                          <div className="text-xs text-gray-600">{category.daysType} дней</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div className="bg-white bg-opacity-70 rounded-lg p-3">
                          <div className="text-xs text-gray-600 mb-1">Приоритет</div>
                          <div className="text-sm font-bold" style={{ color: category.borderColor }}>
                            {category.priority}
                          </div>
                        </div>
                        <div className="bg-white bg-opacity-70 rounded-lg p-3">
                          <div className="text-xs text-gray-600 mb-1">Тип дней</div>
                          <div className="text-sm font-bold text-gray-800">
                            {category.daysType === 'рабочих' ? 'Рабочие дни' : 'Календарные дни'}
                          </div>
                        </div>
                        <div className="bg-white bg-opacity-70 rounded-lg p-3">
                          <div className="text-xs text-gray-600 mb-1">Продление</div>
                          <div className="text-sm font-bold text-gray-800">
                            {category.extensible ? (
                              <span className="text-[#00AA44]">До {category.maxExtension} дней</span>
                            ) : (
                              <span className="text-[#DD0000]">Не допускается</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {category.details.map((detail, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: category.borderColor }} />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Information */}
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-5">
            <h3 className="text-sm font-bold text-gray-800 mb-2">📌 Дополнительная информация</h3>
            <div className="text-xs text-gray-700 space-y-1">
              <p>• Все сроки начинают отсчитываться со дня регистрации обращения в системе ЭДО</p>
              <p>• При расчете рабочих дней исключаются субботы, воскресенья и официальные праздничные дни РФ</p>
              <p>• При расчете календарных дней учитываются все дни, включая выходные и праздники</p>
              <p>• Система автоматически отправляет уведомления при приближении к дедлайну (за 3 дня, за 1 день, в день истечения)</p>
              <p>• Все действия по обращениям логируются с указанием времени, пользователя и причины изменения</p>
              <p>• Отчеты по SLA compliance формируются автоматически и доступны в разделе "Аналитика"</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Документ актуален на: <strong>Январь 2026</strong>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] transition-colors font-medium"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
