import { BookOpen, GraduationCap, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface HelpSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function HelpSidebar({ activeSection, onSectionChange }: HelpSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['work-with-applications']);

  const toggleSection = (sectionId: string) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter(id => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };

  const quickLinks = [
    { id: 'first-application', label: 'Мое первое обращение' },
    { id: 'faq', label: 'Часто задаваемые вопросы (FAQ)' },
    { id: 'hotlines', label: 'Горячие линии поддержки' },
    { id: 'contacts', label: 'Контакты подразделений' },
    { id: 'ask-team', label: 'Отправить вопрос нашей команде' },
  ];

  const knowledgeBaseSections = [
    {
      id: 'work-with-applications',
      title: 'Работа с обращениями',
      items: [
        'Как создать новое обращение',
        'Как проверить статус обращения',
        'Как переназначить обращение',
        'Как закрыть обращение',
        'Как добавить заметку к обращению',
        'Как эскалировать обращение',
        'Как скачать обращение',
      ],
    },
    {
      id: 'queue-management',
      title: 'Управление очередью',
      items: [
        'Как правильно приоритизировать обращения',
        'Настройка моих фильтров',
        'Быстрые действия на обращениях',
        'Массовые операции с обращениями',
      ],
    },
    {
      id: 'analytics',
      title: 'Аналитика и отчёты',
      items: [
        'Как понять дашборд метрик',
        'Как скачать отчёт',
        'Как интерпретировать графики SLA',
        'Как анализировать производительность команды',
        'Как создать кастомный отчёт',
      ],
    },
    {
      id: 'administration',
      title: 'Администрирование',
      items: [
        'Управление пользователями и ролями',
        'Настройка маршрутов обработки',
        'Создание шаблонов ответов',
        'Управление правилами SLA',
        'Интеграция с email',
        'Настройка уведомлений',
      ],
    },
    {
      id: 'integrations',
      title: 'Интеграции',
      items: [
        'Подключение почтового ящика',
        'API документация',
        'Интеграция с CRM',
        'Подключение платёжных систем',
      ],
    },
    {
      id: 'security',
      title: 'Безопасность и соответствие',
      items: [
        'Как работают права доступа',
        'Двухфакторная аутентификация',
        'Как сбросить пароль',
        'Логирование и аудит действий',
        'Требования регулятора',
      ],
    },
    {
      id: 'regulator',
      title: 'Выполнение требований регулятора',
      items: [
        'Сроки обработки обращений от регулятора',
        'Процесс эскалации при нарушении SLA',
        'Требования к документированию',
        'Аудиторские проверки',
      ],
    },
  ];

  return (
    <aside className="w-[240px] bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        {/* Быстрые ссылки */}
        <div className="mb-6">
          <h3 className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            📌 Быстрые ссылки
          </h3>
          <div className="space-y-1">
            {quickLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onSectionChange(link.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === link.id
                    ? 'bg-[#F0F5FA] text-[#0051BA] border-l-3 border-[#0051BA]'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* База знаний */}
        <div className="mb-6">
          <h3 className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            <BookOpen className="w-4 h-4" />
            База знаний
          </h3>
          <div className="space-y-1">
            {knowledgeBaseSections.map((section) => {
              const isExpanded = expandedSections.includes(section.id);
              return (
                <div key={section.id}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <span>{section.title}</span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {section.items.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => onSectionChange(`article-${section.id}-${idx}`)}
                          className="w-full text-left px-3 py-1.5 rounded text-xs text-gray-600 hover:bg-gray-100 hover:text-[#0051BA] transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Обучение */}
        <div>
          <h3 className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            <GraduationCap className="w-4 h-4" />
            Обучение
          </h3>
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              Видеоуроки
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              Вебинары расписание
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              Case studies
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              Лучшие практики
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
