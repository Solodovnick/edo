import { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  Search,
  ChevronUp,
  ChevronDown,
  User
} from 'lucide-react';
import { getCabinetAppeals, getAppealDetail, type CabinetAppeal } from '../../../services/appealApi';
import { AuditCardDetailed } from './AuditCardDetailed';
import { toast } from 'sonner';

const AUDIT_STATUSES = ['Аудит', 'На аудите', 'Пройден аудит'];

// CABINET COMPONENT
function AuditCabinet({
  onOpenAppeal
}: {
  onOpenAppeal: (appealId: string) => void
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('Все');
  const [viewMode, setViewMode] = useState<'my' | 'all'>('my');
  const [allAppeals, setAllAppeals] = useState<CabinetAppeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const loadAppeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCabinetAppeals(AUDIT_STATUSES);
      setAllAppeals(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить обращения');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAppeals(); }, [loadAppeals]);

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

  if (loading) return (
    <div style={{ background: '#D1C4E9', minHeight: '100vh' }} className="flex items-center justify-center">
      <p className="text-purple-800 text-sm">Загрузка обращений…</p>
    </div>
  );
  if (error) return (
    <div style={{ background: '#D1C4E9', minHeight: '100vh' }} className="flex flex-col items-center justify-center gap-3">
      <p className="text-red-700 text-sm">{error}</p>
      <button onClick={loadAppeals} className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm hover:bg-purple-800">Повторить</button>
    </div>
  );

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
  const [selectedAppeal, setSelectedAppeal] = useState<CabinetAppeal | null>(null);
  const [cardLoading, setCardLoading] = useState(false);

  const handleOpenAppeal = useCallback(async (appealId: string) => {
    setCardLoading(true);
    try {
      const detail = await getAppealDetail(appealId);
      setSelectedAppeal(detail);
      setView('card');
    } catch {
      toast.error('Не удалось загрузить карточку обращения');
    } finally {
      setCardLoading(false);
    }
  }, []);

  const handleBack = () => {
    setView('cabinet');
    setSelectedAppeal(null);
  };

  // Expose handleOpenAppeal globally for notifications
  useEffect(() => {
    (window as any).__auditPageOpenAppeal = (id: string) => { void handleOpenAppeal(id); };
    return () => { delete (window as any).__auditPageOpenAppeal; };
  }, [handleOpenAppeal]);

  if (cardLoading) return (
    <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
      Загрузка карточки…
    </div>
  );

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