import { useState } from 'react';
import { Search } from 'lucide-react';
import { HelpSidebar } from './help/HelpSidebar';
import { HelpRecommendations } from './help/HelpRecommendations';
import { KnowledgeBaseList } from './help/KnowledgeBaseList';
import { ArticleDetail } from './help/ArticleDetail';
import { FAQ } from './help/FAQ';
import { ContactsSupport } from './help/ContactsSupport';
import { SLAModal } from './help/SLAModal';

export function Help() {
  const [activeSection, setActiveSection] = useState('work-with-applications');
  const [viewMode, setViewMode] = useState<'list' | 'article'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSLAModalOpen, setIsSLAModalOpen] = useState(false);

  const popularSearches = [
    { text: 'Как обработать жалобу', action: null },
    { text: 'Сроки SLA', action: 'sla' },
    { text: 'Интеграция почты', action: null },
    { text: 'Статусы обращений', action: null },
  ];

  const handlePopularSearch = (search: { text: string; action: string | null }) => {
    if (search.action === 'sla') {
      setIsSLAModalOpen(true);
    } else {
      setSearchQuery(search.text);
    }
  };

  const handleArticleClick = (articleId: string) => {
    setViewMode('article');
  };

  const renderContent = () => {
    if (activeSection === 'faq') {
      return <FAQ />;
    } else if (activeSection === 'contacts' || activeSection === 'hotlines') {
      return <ContactsSupport />;
    } else if (viewMode === 'article') {
      return <ArticleDetail />;
    } else {
      return <KnowledgeBaseList onArticleClick={handleArticleClick} />;
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden flex-col">
      {/* Верхняя панель поиска */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Справка и база знаний</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Поиск по темам, инструкциям, FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0051BA] focus:border-transparent"
            />
          </div>
        </div>

        {/* Популярные вопросы */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-600 flex items-center gap-1">
            🔥 Популярные вопросы сегодня:
          </span>
          {popularSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => handlePopularSearch(search)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                search.action === 'sla'
                  ? 'bg-[#0051BA] text-white hover:bg-[#003d8f] font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {search.text}
              {search.action === 'sla' && <span className="ml-1">⚡</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        <HelpSidebar
          activeSection={activeSection}
          onSectionChange={(section) => {
            setActiveSection(section);
            setViewMode('list');
          }}
        />

        {/* Основной контент */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#F0F0F0]">
          {renderContent()}
        </main>

        <HelpRecommendations />
      </div>

      {/* SLA Modal */}
      <SLAModal isOpen={isSLAModalOpen} onClose={() => setIsSLAModalOpen(false)} />
    </div>
  );
}