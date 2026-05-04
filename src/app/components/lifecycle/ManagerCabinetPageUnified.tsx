import { useState, useEffect, useCallback } from 'react';
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
import { getCabinetAppeals, getAppealDetail, type CabinetAppeal } from '../../../services/appealApi';
import { ManagerCardDetailed } from './ManagerCardDetailed';
import { toast, Toaster } from 'sonner';
import { NotificationBell } from '../notifications/NotificationBell';

export function ManagerCabinetPage() {
  const [allAppeals, setAllAppeals] = useState<CabinetAppeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppeal, setSelectedAppeal] = useState<CabinetAppeal | null>(null);
  const [cardLoading, setCardLoading] = useState(false);
  const [view, setView] = useState<'cabinet' | 'card'>('cabinet');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const loadAppeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCabinetAppeals(); // все статусы
      setAllAppeals(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить обращения');
      toast.error('Ошибка загрузки обращений');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAppeals(); }, [loadAppeals]);

  const handleOpenAppeal = useCallback(async (appeal: CabinetAppeal) => {
    setCardLoading(true);
    try {
      const detail = await getAppealDetail(appeal.id);
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

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

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

  if (cardLoading) return (
    <div className="flex flex-1 items-center justify-center text-sm text-gray-500">Загрузка карточки…</div>
  );
  if (view === 'card' && selectedAppeal) {
    return <ManagerCardDetailed onBack={handleBack} appealData={selectedAppeal} />;
  }
  if (loading) return (
    <div style={{ background: '#D1C4E9', minHeight: '100vh' }} className="flex items-center justify-center">
      <p className="text-purple-800 text-sm">Загрузка обращений…</p>
    </div>
  );
  if (error) return (
    <div style={{ background: '#D1C4E9', minHeight: '100vh' }} className="flex flex-col items-center justify-center gap-3">
      <p className="text-red-700 text-sm">{error}</p>
      <button onClick={loadAppeals} className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm">Повторить</button>
    </div>
  );

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