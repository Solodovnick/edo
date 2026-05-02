import { Clock, Eye, ExternalLink, Copy } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  description: string;
  readTime: string;
  views: number;
  icon: string;
}

interface KnowledgeBaseListProps {
  onArticleClick: (articleId: string) => void;
}

export function KnowledgeBaseList({ onArticleClick }: KnowledgeBaseListProps) {
  const articles: Article[] = [
    {
      id: '1',
      icon: '📝',
      title: 'Как создать новое обращение',
      description: 'Пошаговая инструкция для быстрого создания обращения от клиента',
      readTime: '5 минут',
      views: 342,
    },
    {
      id: '2',
      icon: '🔍',
      title: 'Как проверить статус обращения',
      description: 'Узнайте как отслеживать статус обращения в реальном времени',
      readTime: '3 минуты',
      views: 289,
    },
    {
      id: '3',
      icon: '↗️',
      title: 'Как переназначить обращение',
      description: 'Руководство по передаче обращения другому сотруднику или подразделению',
      readTime: '4 минуты',
      views: 215,
    },
    {
      id: '4',
      icon: '✅',
      title: 'Как закрыть обращение',
      description: 'Правильный процесс завершения обработки обращения с резолюцией',
      readTime: '6 минут',
      views: 198,
    },
    {
      id: '5',
      icon: '📌',
      title: 'Как добавить заметку к обращению',
      description: 'Добавление внутренних комментариев и заметок для команды',
      readTime: '2 минуты',
      views: 167,
    },
    {
      id: '6',
      icon: '🚨',
      title: 'Как эскалировать обращение',
      description: 'Процедура эскалации сложных или критичных обращений руководству',
      readTime: '7 минут',
      views: 234,
    },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        <span className="hover:text-[#0051BA] cursor-pointer">Справка</span>
        <span className="mx-2">&gt;</span>
        <span className="hover:text-[#0051BA] cursor-pointer">База знаний</span>
        <span className="mx-2">&gt;</span>
        <span className="text-gray-800">Работа с обращениями</span>
      </div>

      {/* Заголовок */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#0051BA] mb-2">Работа с обращениями</h2>
        <p className="text-gray-600">Пошаговые инструкции по основным операциям</p>
      </div>

      {/* Сортировка и фильтры */}
      <div className="flex items-center gap-4 mb-6">
        <div>
          <label className="text-sm text-gray-600 mr-2">Сортировка:</label>
          <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0051BA] focus:border-transparent">
            <option>По релевантности</option>
            <option>По дате</option>
            <option>По популярности</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-[#0051BA] border-gray-300 rounded" />
            Только видео
          </label>
          <label className="flex items-center gap-1 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-[#0051BA] border-gray-300 rounded" />
            Только статьи
          </label>
        </div>
      </div>

      {/* Список статей */}
      <div className="space-y-4">
        {articles.map((article) => (
          <div
            key={article.id}
            onClick={() => onArticleClick(article.id)}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{article.icon}</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{article.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{article.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime} чтения</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{article.views} просмотров</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-[#0051BA] hover:bg-blue-50 rounded transition-colors" title="Открыть">
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded transition-colors" title="Скопировать ссылку">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
