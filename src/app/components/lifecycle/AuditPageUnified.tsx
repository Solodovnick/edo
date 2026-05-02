import { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  Search,
  ChevronUp,
  ChevronDown,
  User
} from 'lucide-react';
import { appealStorage } from '../../../services/appealStorage';
import { auditAppealsData } from '../../../data/auditMockData';
import { AuditCardDetailed } from './AuditCardDetailed';

// CABINET COMPONENT
function AuditCabinet({
  onOpenAppeal
}: {
  onOpenAppeal: (appealId: string) => void
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('Все');
  const [viewMode, setViewMode] = useState<'my' | 'all'>('my');
  const [allAppeals, setAllAppeals] = useState(auditAppealsData);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Load appeals from localStorage with status "Аудит"
  useEffect(() => {
    const loadAppeals = () => {
      const savedAppeals = appealStorage.getAllAppeals();
      
      // Фильтруем обращения со статусом "Аудит"
      const auditAppeals = savedAppeals
        .filter(appeal => appeal.status === 'Аудит')
        .map(appeal => ({
          ...appeal,
          auditStatus: 'pending' as const,
          deadlineCountdown: { days: 0, hours: 0, minutes: 0 },
          isMine: appeal.responsible === 'Расул Рамазанов' || appeal.responsible === 'Александр Солодовников',
          attachments: [],
          history: [],
          crmComments: [],
        }));
      
      // Combine with mock data
      const savedIds = new Set(auditAppeals.map(a => a.id));
      const uniqueMockAppeals = auditAppealsData.filter(a => !savedIds.has(a.id));
      const combined = [...auditAppeals, ...uniqueMockAppeals];
      
      setAllAppeals(combined);
    };
    
    loadAppeals();
    
    // Reload every 5 seconds
    const interval = setInterval(loadAppeals, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredAppeals = allAppeals.filter(appeal => {
    // View mode filter
    let viewModeMatch = true;
    if (viewMode === 'my') {
      // Показываем только свои обращения
      viewModeMatch = appeal.isMine === true;
    }
    // Если viewMode === 'all', показываем ВСЕ обращения (и мои, и не мои)

    let statusMatch = true;
    if (activeFilter === 'На проверке') {
      statusMatch = appeal.auditStatus === 'pending';
    } else if (activeFilter === 'Одобрено') {
      statusMatch = appeal.auditStatus === 'approved';
    } else if (activeFilter === 'Возвращено') {
      statusMatch = appeal.auditStatus === 'rejected';
    }

    const searchLower = searchQuery.toLowerCase();
    const searchMatch = 
      appeal.id.toLowerCase().includes(searchLower) ||
      appeal.applicantName.toLowerCase().includes(searchLower) ||
      appeal.organizationName.toLowerCase().includes(searchLower) ||
      appeal.category.toLowerCase().includes(searchLower);

    return viewModeMatch && statusMatch && searchMatch;
  });

  const myAppealsCount = allAppeals.filter(a => a.isMine === true).length;
  const allAppealsCount = allAppeals.length; // Все обращения (и мои, и не мои)
  const pendingCount = allAppeals.filter(a => a.auditStatus === 'pending').length;
  const approvedCount = allAppeals.filter(a => a.auditStatus === 'approved').length;
  const rejectedCount = allAppeals.filter(a => a.auditStatus === 'rejected').length;

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Sort appeals
  const sortedAppeals = [...filteredAppeals].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue: any;
    let bValue: any;

    // Специальная обработка для разных колонок
    if (sortColumn === 'auditStatus') {
      const statusOrder = { 'pending': 1, 'approved': 2, 'rejected': 3 };
      aValue = statusOrder[a.auditStatus];
      bValue = statusOrder[b.auditStatus];
    } else {
      aValue = a[sortColumn as keyof typeof a];
      bValue = b[sortColumn as keyof typeof b];
    }

    // Handle N/A values
    if (aValue === 'N/A') aValue = '';
    if (bValue === 'N/A') bValue = '';

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div style={{ background: '#D1C4E9', minHeight: '100vh', paddingBottom: '3rem' }}>
      {/* Header */}
      <div className="shadow-md" style={{ backgroundColor: '#673AB7' }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-white mb-1">Кабинет аудитора</h1>
              <p className="text-sm" style={{ color: '#E1BEE7' }}>Проверка качества обработки обращений</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search Bar - Separate Row */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по номеру, заявителю, организации, категории..."
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                setViewMode('all');
                setActiveFilter('Все');
              }}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded ${
                viewMode === 'all' && activeFilter === 'Все'
                  ? 'text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
              }`}
              style={viewMode === 'all' && activeFilter === 'Все' ? { backgroundColor: '#673AB7' } : {}}
            >
              Все ({allAppealsCount})
            </button>
            <button
              onClick={() => setViewMode('my')}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded ${
                viewMode === 'my'
                  ? 'text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
              }`}
              style={viewMode === 'my' ? { backgroundColor: '#673AB7' } : {}}
            >
              Мои обращения ({myAppealsCount})
            </button>
          </div>
        </div>

        {/* Appeals Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {sortedAppeals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead style={{ backgroundColor: '#F3E5F5' }}>
                  <tr>
                    <th 
                      className="text-left p-3 font-medium text-gray-900 border-b-2 cursor-pointer hover:bg-purple-100 transition-colors" 
                      style={{ borderColor: '#673AB7' }}
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center gap-1">
                        Номер
                        {sortColumn === 'id' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="text-left p-3 font-medium text-gray-900 border-b-2 cursor-pointer hover:bg-purple-100 transition-colors" 
                      style={{ borderColor: '#673AB7' }}
                      onClick={() => handleSort('regDate')}
                    >
                      <div className="flex items-center gap-1">
                        Дата рег.
                        {sortColumn === 'regDate' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="text-left p-3 font-medium text-gray-900 border-b-2 cursor-pointer hover:bg-purple-100 transition-colors" 
                      style={{ borderColor: '#673AB7' }}
                      onClick={() => handleSort('deadline')}
                    >
                      <div className="flex items-center gap-1">
                        Дедлайн
                        {sortColumn === 'deadline' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="text-left p-3 font-medium text-gray-900 border-b-2 cursor-pointer hover:bg-purple-100 transition-colors" 
                      style={{ borderColor: '#673AB7' }}
                      onClick={() => handleSort('category')}
                    >
                      <div className="flex items-center gap-1">
                        Тип обращения
                        {sortColumn === 'category' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="text-left p-3 font-medium text-gray-900 border-b-2 cursor-pointer hover:bg-purple-100 transition-colors" 
                      style={{ borderColor: '#673AB7' }}
                      onClick={() => handleSort('responsible')}
                    >
                      <div className="flex items-center gap-1">
                        Ответственный
                        {sortColumn === 'responsible' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="text-left p-3 font-medium text-gray-900 border-b-2 cursor-pointer hover:bg-purple-100 transition-colors" 
                      style={{ borderColor: '#673AB7' }}
                      onClick={() => handleSort('applicantName')}
                    >
                      <div className="flex items-center gap-1">
                        Заявитель
                        {sortColumn === 'applicantName' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="text-left p-3 font-medium text-gray-900 border-b-2 cursor-pointer hover:bg-purple-100 transition-colors" 
                      style={{ borderColor: '#673AB7' }}
                      onClick={() => handleSort('organizationName')}
                    >
                      <div className="flex items-center gap-1">
                        Организация
                        {sortColumn === 'organizationName' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="text-left p-3 font-medium text-gray-900 border-b-2 cursor-pointer hover:bg-purple-100 transition-colors" 
                      style={{ borderColor: '#673AB7' }}
                      onClick={() => handleSort('auditStatus')}
                    >
                      <div className="flex items-center gap-1">
                        Статус аудита
                        {sortColumn === 'auditStatus' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAppeals.map((appeal) => (
                    <tr
                      key={appeal.id}
                      onClick={() => onOpenAppeal(appeal.id)}
                      className="border-b border-gray-200 hover:bg-purple-50 cursor-pointer transition-colors"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium" style={{ color: '#673AB7' }}>№{appeal.id}</span>
                          {appeal.isMine && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded" style={{ backgroundColor: '#E1BEE7', color: '#673AB7' }}>
                              МОЕ
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-gray-700">
                        {appeal.regDate}
                      </td>
                      <td className="p-3 text-gray-700">
                        {appeal.deadline}
                      </td>
                      <td className="p-3 text-gray-700">
                        {appeal.category}
                      </td>
                      <td className="p-3 text-gray-700">
                        {appeal.responsible}
                      </td>
                      <td className="p-3 text-gray-700">
                        {appeal.applicantName !== 'N/A' ? appeal.applicantName : '-'}
                      </td>
                      <td className="p-3 text-gray-700">
                        {appeal.organizationName !== 'N/A' ? appeal.organizationName : '-'}
                      </td>
                      <td className="p-3">
                        {appeal.auditStatus === 'pending' && (
                          <span className="px-2 py-1 text-xs font-medium rounded inline-block" style={{ backgroundColor: '#D1C4E9', color: '#673AB7' }}>
                            На проверке
                          </span>
                        )}
                        {appeal.auditStatus === 'approved' && (
                          <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700 inline-block">
                            Одобрено
                          </span>
                        )}
                        {appeal.auditStatus === 'rejected' && (
                          <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700 inline-block">
                            Возвращено
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Обращения не найдены</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// MAIN AUDIT PAGE COMPONENT
export function AuditPage() {
  const [view, setView] = useState<'cabinet' | 'card'>('cabinet');
  const [selectedAppealId, setSelectedAppealId] = useState<string | null>(null);
  const [allAppeals, setAllAppeals] = useState(auditAppealsData);

  // Load appeals on mount
  useEffect(() => {
    const savedAppeals = appealStorage.getAllAppeals();
    if (savedAppeals.length > 0) {
      const combined = [...auditAppealsData, ...savedAppeals.map(appeal => ({
        ...appeal,
        auditStatus: appeal.status === 'Одобрено' ? 'approved' as const : 
                     appeal.status === 'Возращено на доработку' ? 'rejected' as const : 'pending' as const,
        phone: appeal.phone || 'Не указан',
        attachments: appeal.attachments || [],
        history: appeal.history || [],
        crmComments: appeal.crmComments || [],
        deadlineCountdown: appeal.deadlineCountdown || { days: 0, hours: 0, minutes: 0 }
      }))];
      setAllAppeals(combined);
    }
  }, []); // Only run on mount

  const handleOpenAppeal = useCallback((appealId: string) => {
    console.log('[AuditPage] handleOpenAppeal called with:', appealId);
    setSelectedAppealId(appealId);
    setView('card');
  }, []);

  const handleBack = () => {
    setView('cabinet');
    setSelectedAppealId(null);
  };

  const selectedAppeal = allAppeals.find(a => a.id === selectedAppealId);

  // Expose handleOpenAppeal globally for notifications
  useEffect(() => {
    (window as any).__auditPageOpenAppeal = handleOpenAppeal;
    console.log('[AuditPage] Registered global appeal handler');
    return () => {
      delete (window as any).__auditPageOpenAppeal;
      console.log('[AuditPage] Unregistered global appeal handler');
    };
  }, [handleOpenAppeal]);

  return (
    <>
      {view === 'card' && selectedAppeal ? (
        <AuditCardDetailed onBack={handleBack} appealData={selectedAppeal} />
      ) : (
        <AuditCabinet onOpenAppeal={handleOpenAppeal} />
      )}
    </>
  );
}