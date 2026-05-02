import { useState, useEffect } from 'react';
import {
  Download,
  Search,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  User
} from 'lucide-react';
import { appealStorage } from '../../../services/appealStorage';
import unifiedAppealsData from '../../../data/unifiedAppealsData';
import { ManagerCardDetailed } from './ManagerCardDetailed';
import { toast, Toaster } from 'sonner';
import { NotificationBell } from '../notifications/NotificationBell';

export function ManagerCabinetPage() {
  const [allAppeals, setAllAppeals] = useState([...unifiedAppealsData, ...appealStorage.getAllAppeals()]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppeal, setSelectedAppeal] = useState<any>(null);
  const [view, setView] = useState<'cabinet' | 'card'>('cabinet');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Load appeals from LocalStorage and unifiedAppealsData
  useEffect(() => {
    const loadAppeals = () => {
      try {
        const savedAppeals = appealStorage.getAllAppeals();
        
        // Нормализуем типы заявителей - исправляем некорректные значения
        const normalizedSavedAppeals = savedAppeals.map(appeal => {
          if (appeal.type === 'Регулятор' || appeal.type === 'регулятор' || !(appeal.type === 'Физ лицо' || appeal.type === 'Юр лицо' || appeal.type === 'Физлицо' || appeal.type === 'Юрлицо')) {
            console.warn(`Normalizing appeal ${appeal.id}: changing invalid type "${appeal.type}" to "Юр лицо"`);
            return { ...appeal, type: 'Юр лицо' as any };
          }
          return appeal;
        });
        
        // Создаем Set ПОСЛЕ нормализации
        const savedIds = new Set(normalizedSavedAppeals.map(a => a.id));
        
        // Filter out unified appeals that are already in localStorage
        const uniqueUnifiedAppeals = unifiedAppealsData.filter(a => !savedIds.has(a.id));
        
        // Combine: normalized saved appeals + unique unified appeals
        const combined = [...normalizedSavedAppeals, ...uniqueUnifiedAppeals];
        setAllAppeals(combined);
      } catch (error) {
        toast.error('Ошибка доступа к базе данных', {
          description: 'Обращения недоступны для просмотра. Попробуйте обновить страницу.',
        });
      }
    };
    
    loadAppeals();
    
    // Reload every 5 seconds to catch new appeals
    const interval = setInterval(loadAppeals, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle opening appeal card with logging
  const handleOpenAppeal = (appeal: any) => {
    try {
      // Log view event
      const viewEvent = {
        userId: 'manager_001',
        userName: 'Руководитель Петров А.И.',
        timestamp: new Date().toLocaleString('ru-RU'),
        action: 'просмотр' as const
      };

      // Add view to history
      const updatedAppeal = {
        ...appeal,
        viewHistory: [...(appeal.viewHistory || []), viewEvent]
      };

      // Update in storage if it's a saved appeal
      const savedAppeals = appealStorage.getAllAppeals();
      const existingIndex = savedAppeals.findIndex(a => a.id === appeal.id);
      if (existingIndex !== -1) {
        savedAppeals[existingIndex] = updatedAppeal;
        localStorage.setItem('appeals', JSON.stringify(savedAppeals));
      }

      setSelectedAppeal(updatedAppeal);
      setView('card');

      toast.success(`Обращение №${appeal.id} открыто`, {
        description: `Просмотр зафиксирован в ${viewEvent.timestamp}`,
      });
    } catch (error) {
      toast.error('Ошибка доступа к базе данных', {
        description: 'Обращение недоступно к просмотру',
      });
    }
  };

  const handleBack = () => {
    setView('cabinet');
    setSelectedAppeal(null);
    // Reload appeals to show updated view history
    const loadAppeals = () => {
      const savedAppeals = appealStorage.getAllAppeals();
      
      // Нормализуем типы заявителей
      const normalizedSavedAppeals = savedAppeals.map(appeal => {
        if (appeal.type === 'Регулятор' || appeal.type === 'регулятор' || !(appeal.type === 'Физ лицо' || appeal.type === 'Юр лицо' || appeal.type === 'Физлицо' || appeal.type === 'Юрлицо')) {
          return { ...appeal, type: 'Юр лицо' as any };
        }
        return appeal;
      });
      
      const savedIds = new Set(normalizedSavedAppeals.map(a => a.id));
      const uniqueUnifiedAppeals = unifiedAppealsData.filter(a => !savedIds.has(a.id));
      const combined = [...normalizedSavedAppeals, ...uniqueUnifiedAppeals];
      setAllAppeals(combined);
    };
    loadAppeals();
  };

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // If card view is active, show the detailed card
  if (view === 'card' && selectedAppeal) {
    return <ManagerCardDetailed onBack={handleBack} appealData={selectedAppeal} />;
  }

  // Filter appeals
  const filteredAppeals = allAppeals.filter(appeal =>
    searchQuery === '' ||
    appeal.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appeal.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appeal.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appeal.responsible.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appeal.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort appeals
  const sortedAppeals = [...filteredAppeals].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue: any;
    let bValue: any;

    // Специальная обработка для разных колонок
    if (sortColumn === 'priority') {
      const priorityOrder = { 'Высокий': 3, 'Средний': 2, 'Низкий': 1 };
      aValue = priorityOrder[(a.priority || '') as keyof typeof priorityOrder] || 0;
      bValue = priorityOrder[(b.priority || '') as keyof typeof priorityOrder] || 0;
    } else if (sortColumn === 'history') {
      // Сортировка по количеству записей в истории
      aValue = (a.history?.length || 0) + (a.viewHistory?.length || 0);
      bValue = (b.history?.length || 0) + (b.viewHistory?.length || 0);
    } else if (sortColumn === 'requiresAttention') {
      // Сортировка по флагу "Требует внимания"
      aValue = a.requiresAttention ? 1 : 0;
      bValue = b.requiresAttention ? 1 : 0;
    } else if (sortColumn === 'requiresSignature') {
      // Сортировка по флагу "Требует подписания"
      aValue = a.requiresSignature ? 1 : 0;
      bValue = b.requiresSignature ? 1 : 0;
    } else {
      aValue = a[sortColumn as keyof typeof a];
      bValue = b[sortColumn as keyof typeof b];
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div style={{ background: '#D1C4E9', minHeight: '100vh', paddingBottom: '3rem' }}>
      <Toaster position="top-right" richColors />

      {/* Header */}
      <div className="shadow-md" style={{ backgroundColor: '#673AB7' }}>
        <div className="max-w-full px-6 py-6">
          <div>
            <h1 className="text-2xl font-medium text-white mb-1">Кабинет руководителя</h1>
            <p className="text-sm" style={{ color: '#E1BEE7' }}>Управление пулом обращений клиентов</p>
          </div>
        </div>
      </div>

      <div className="max-w-full px-6 py-6">
        {/* Search and filters */}
        <div className="bg-white rounded-lg shadow-md p-5 mb-6">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по ID, заявителю, ответственному, статусу..."
              className="w-full pl-12 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            />
          </div>
        </div>

        {/* Appeals Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-purple-50 border-b-2 border-purple-200">
                <tr>
                  <th
                    className="px-4 py-3 text-left font-semibold text-gray-800 cursor-pointer hover:bg-purple-100 transition-colors"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      ID
                      {sortColumn === 'id' && (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left font-semibold text-gray-800 cursor-pointer hover:bg-purple-100 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      Статус
                      {sortColumn === 'status' && (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left font-semibold text-gray-800 cursor-pointer hover:bg-purple-100 transition-colors"
                    onClick={() => handleSort('regDate')}
                  >
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      Дата рег.
                      {sortColumn === 'regDate' && (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left font-semibold text-gray-800 cursor-pointer hover:bg-purple-100 transition-colors"
                    onClick={() => handleSort('deadline')}
                  >
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      Дедлайн
                      {sortColumn === 'deadline' && (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left font-semibold text-gray-800 cursor-pointer hover:bg-purple-100 transition-colors"
                    onClick={() => handleSort('priority')}
                  >
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      Приоритет
                      {sortColumn === 'priority' && (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left font-semibold text-gray-800 cursor-pointer hover:bg-purple-100 transition-colors"
                    onClick={() => handleSort('responsible')}
                  >
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      Ответственный
                      {sortColumn === 'responsible' && (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left font-semibold text-gray-800 cursor-pointer hover:bg-purple-100 transition-colors"
                    onClick={() => handleSort('history')}
                  >
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      История
                      {sortColumn === 'history' && (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center font-semibold text-gray-800 cursor-pointer hover:bg-purple-100 transition-colors"
                    onClick={() => handleSort('requiresAttention')}
                  >
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      Требует внимания
                      {sortColumn === 'requiresAttention' && (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center font-semibold text-gray-800 cursor-pointer hover:bg-purple-100 transition-colors"
                    onClick={() => handleSort('requiresSignature')}
                  >
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      Подписание
                      {sortColumn === 'requiresSignature' && (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedAppeals.length > 0 ? (
                  sortedAppeals.map((appeal, idx) => {
                    const isHovered = hoveredRow === appeal.id;
                    const historyCount = (appeal.history?.length || 0) + (appeal.viewHistory?.length || 0);

                    return (
                      <tr
                        key={appeal.id}
                        onClick={() => handleOpenAppeal(appeal)}
                        onMouseEnter={() => setHoveredRow(appeal.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        className={`border-b border-gray-100 cursor-pointer transition-all ${
                          isHovered
                            ? 'bg-pink-100 shadow-md'
                            : idx % 2 === 0
                            ? 'bg-white'
                            : 'bg-gray-50/50'
                        }`}
                        title={isHovered ? 'Открыть обращение' : ''}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-purple-700 font-semibold">№{appeal.id}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {appeal.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{appeal.regDate}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`font-medium ${
                            appeal.deadlineCountdown?.days !== undefined && appeal.deadlineCountdown.days <= 2 ? 'text-red-600' :
                            appeal.deadlineCountdown?.days !== undefined && appeal.deadlineCountdown.days <= 5 ? 'text-orange-600' :
                            'text-gray-700'
                          }`}>
                            {appeal.deadline}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {appeal.priority ? (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              appeal.priority === 'Высокий' ? 'bg-red-100 text-red-700' :
                              appeal.priority === 'Средний' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {appeal.priority}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap max-w-[200px] truncate">
                          {appeal.responsible}
                        </td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap text-center">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {historyCount} зап.
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          {appeal.requiresAttention ? (
                            <AlertCircle className="w-5 h-5 text-red-600 mx-auto" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          {appeal.requiresSignature ? (
                            <CheckCircle className="w-5 h-5 text-orange-600 mx-auto" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                      Обращения не найдены
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        {sortedAppeals.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            Показано {sortedAppeals.length} обращений из {allAppeals.length}
          </div>
        )}
      </div>
    </div>
  );
}