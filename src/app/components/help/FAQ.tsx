import { ChevronDown, ChevronRight, ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  link?: string;
  category: string;
}

export function FAQ() {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqItems: FAQItem[] = [
    {
      id: '1',
      category: 'general',
      question: 'Что такое ЭДО банка?',
      answer: 'ЭДО (Электронная система обработки обращений) - это комплексная система для управления обращениями клиентов банка. Система позволяет регистрировать, обрабатывать и отслеживать все обращения в едином пространстве.',
    },
    {
      id: '2',
      category: 'applications',
      question: 'Какой срок обработки письменного обращения?',
      answer: 'Согласно регламенту банка, письменные обращения должны быть рассмотрены в течение 30 дней с момента их получения. Обращения от регулятора рассматриваются за 3 дня.',
      link: 'Подробнее в документе "Сроки SLA"',
    },
    {
      id: '3',
      category: 'applications',
      question: 'Как создать обращение?',
      answer: 'Создать обращение можно тремя способами: 1) Через web-интерфейс - перейдите на вкладку "Обращения" и нажмите кнопку "Новое обращение". 2) Через email - отправьте письмо на edobank@bank.ru. 3) Через API - используйте POST /api/v1/complaints/create.',
    },
    {
      id: '4',
      category: 'applications',
      question: 'Что делать, если пропустил срок?',
      answer: 'При нарушении SLA обращение автоматически эскалируется руководителю. Необходимо срочно связаться с клиентом, объяснить причину задержки и предложить компенсацию согласно политике банка.',
    },
    {
      id: '5',
      category: 'analytics',
      question: 'Как скачать отчёт?',
      answer: 'На странице "Аналитика" нажмите кнопку "Скачать отчёт" в правом верхнем углу. Выберите формат (PDF или Excel) и период. Отчёт будет сформирован и автоматически загружен.',
    },
    {
      id: '6',
      category: 'errors',
      question: 'Я не могу войти в систему',
      answer: 'Проверьте правильность email и пароля. Если забыли пароль, используйте функцию "Восстановить пароль". Если проблема сохраняется, обратитесь в техподдержку: tech@edobank.ru',
    },
    {
      id: '7',
      category: 'security',
      question: 'Как изменить пароль?',
      answer: 'Перейдите в Профиль → Настройки безопасности → Изменить пароль. Введите текущий пароль и новый пароль дважды. Пароль должен содержать минимум 8 символов, включая цифры и буквы разного регистра.',
    },
  ];

  const categories = [
    { id: 'all', label: 'Все категории' },
    { id: 'general', label: 'Общие вопросы' },
    { id: 'applications', label: 'Обращения' },
    { id: 'analytics', label: 'Аналитика и отчёты' },
    { id: 'errors', label: 'Проблемы и ошибки' },
    { id: 'security', label: 'Безопасность' },
  ];

  const toggleExpand = (id: string) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter(expandedId => expandedId !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  const filteredFAQ = selectedCategory === 'all'
    ? faqItems
    : faqItems.filter(item => item.category === selectedCategory);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        <span className="hover:text-[#0051BA] cursor-pointer">Справка</span>
        <span className="mx-2">&gt;</span>
        <span className="text-gray-800">Часто задаваемые вопросы (FAQ)</span>
      </div>

      {/* Заголовок */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#0051BA] mb-2">Часто задаваемые вопросы (FAQ)</h2>
      </div>

      {/* Фильтры */}
      <div className="flex gap-4 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Аккордеон */}
      <div className="space-y-3">
        {filteredFAQ.map((item) => {
          const isExpanded = expandedIds.includes(item.id);
          return (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(item.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 text-left flex-1">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                  <span className="font-medium text-gray-800">Q: {item.question}</span>
                </div>
              </button>
              {isExpanded && (
                <div className="px-4 pb-4">
                  <div className="ml-8 pl-3 border-l-2 border-[#0051BA]">
                    <div className="text-sm text-gray-700 mb-3">
                      <strong>A:</strong> {item.answer}
                    </div>
                    {item.link && (
                      <a href="#" className="flex items-center gap-1 text-sm text-[#0051BA] hover:underline mb-3">
                        <ExternalLink className="w-4 h-4" />
                        {item.link}
                      </a>
                    )}
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                        <ThumbsUp className="w-3 h-3" />
                        Полезно
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                        <ThumbsDown className="w-3 h-3" />
                        Не полезно
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
