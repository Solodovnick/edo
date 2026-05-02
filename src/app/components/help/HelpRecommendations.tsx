import { useState } from 'react';
import { Star, TrendingUp, Clock, Lightbulb } from 'lucide-react';
import { SLAModal } from './SLAModal';

export function HelpRecommendations() {
  const [isSLAModalOpen, setIsSLAModalOpen] = useState(false);

  const recommendedArticles = [
    { icon: '📝', title: 'Как обработать жалобу', time: '5 минут', action: null },
    { icon: '⏱️', title: 'Сроки SLA по типам', time: '3 минуты', action: 'sla' },
    { icon: '🔄', title: 'Интеграция с почтой', time: '7 минут', action: null },
  ];

  const handleArticleClick = (action: string | null) => {
    if (action === 'sla') {
      setIsSLAModalOpen(true);
    }
  };

  const learningPath = [
    { completed: true, label: 'Создал первое обращение' },
    { completed: true, label: 'Проверил статус обращения' },
    { completed: false, label: 'Закрыл обращение' },
    { completed: false, label: 'Просмотрел аналитику' },
    { completed: false, label: 'Настроил фильтры' },
  ];

  const completedCount = learningPath.filter(item => item.completed).length;
  const progress = (completedCount / learningPath.length) * 100;

  return (
    <aside className="w-[280px] bg-white border-l border-gray-200 overflow-y-auto p-4">
      {/* Рекомендованные статьи */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Рекомендуем прочитать</h3>
        <div className="space-y-2">
          {recommendedArticles.map((article, index) => (
            <button
              key={index}
              className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left ${
                article.action === 'sla' 
                  ? 'hover:bg-blue-50 border border-transparent hover:border-[#0051BA]' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleArticleClick(article.action)}
            >
              <span className="text-2xl">{article.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800 mb-1 flex items-center gap-2">
                  {article.title}
                  {article.action === 'sla' && (
                    <span className="text-xs px-2 py-0.5 bg-[#0051BA] text-white rounded-full">
                      Интерактивно
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">{article.time} чтения</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Живая поддержка */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Не нашли ответ?</h3>
        <div className="space-y-2">
          <button className="w-full flex items-center gap-2 px-4 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] transition-colors text-sm">
            <Star className="w-4 h-4" />
            Чат с ботом
          </button>
          <button className="w-full flex items-center gap-2 px-4 py-2 border border-[#0051BA] text-[#0051BA] rounded-lg hover:bg-blue-50 transition-colors text-sm">
            <Mail className="w-4 h-4" />
            Связаться с человеком
          </button>
          <button className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            <Mail className="w-4 h-4" />
            Отправить вопрос
          </button>
        </div>
      </div>

      {/* Путь обучения */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Новый пользователь?</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-2 mb-3">
            {learningPath.map((item, index) => (
              <label key={index} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={item.completed}
                  readOnly
                  className="w-4 h-4 text-[#00AA44] border-gray-300 rounded focus:ring-[#00AA44]"
                />
                <span className={item.completed ? 'text-gray-600' : 'text-gray-800'}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Прогресс</span>
              <span>{completedCount}/{learningPath.length} завершено</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00AA44] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#00AA44] text-white rounded-lg hover:bg-[#008833] transition-colors text-sm">
            <Rocket className="w-4 h-4" />
            Начать обучение
          </button>
        </div>
      </div>

      {/* Статус системы */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-3">Статус системы</h3>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-[#00AA44] rounded-full" />
            <span className="text-sm font-medium text-[#00AA44]">Все системы работают</span>
          </div>
          <div className="text-xs text-gray-600 mb-2">
            Последнее обновление: сегодня в 14:30
          </div>
          <div className="text-xs text-gray-600 mb-3">
            Запланированное обслуживание: 15 февраля
          </div>
          <button className="text-xs text-[#0051BA] hover:underline">
            История обслуживания
          </button>
        </div>
      </div>

      {/* Модальное окно SLA */}
      <SLAModal isOpen={isSLAModalOpen} onClose={() => setIsSLAModalOpen(false)} />
    </aside>
  );
}