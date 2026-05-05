import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  User,
  FileText,
  AlertTriangle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { getCabinetAppeals, type CabinetAppeal } from '../../../services/appealApi';
import { NotificationBell } from '../notifications/NotificationBell';

// Статусы кабинета ответственного (бэкенд-имена)
const ALLOWED_STATUSES = [
  'Назначено',
  'На ответственном, взято',
  'Запрос в БП',
  'Готово к подписи',
];

interface ProcessingCabinetProps {
  onOpenAppeal: (appealId: string) => void;
}

export function ProcessingCabinetNew({ onOpenAppeal }: ProcessingCabinetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('Мои обращения');
  const [typeFilter, setTypeFilter] = useState<string>('Все обращения');
  const [allAppeals, setAllAppeals] = useState<CabinetAppeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const loadAppeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCabinetAppeals(ALLOWED_STATUSES);
      setAllAppeals(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить обращения');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppeals();
  }, [loadAppeals]);

  // Filter appeals based on active filter and search
  const filteredAppeals = allAppeals.filter(appeal => {
    let ownershipMatch = true;
    if (activeFilter === 'Мои обращения') {
      ownershipMatch = appeal.responsible === 'Расул Рамазанов' || appeal.responsible === 'Александр Солодовников';
    }

    // Type filter - только Физ лицо и Юр лицо
    let typeMatch = true;
    if (typeFilter === 'Физлицо') {
      typeMatch = appeal.type === 'Физлицо' || appeal.type === 'Физ лицо';
    } else if (typeFilter === 'Юрлицо') {
      typeMatch = appeal.type === 'Юрлицо' || appeal.type === 'Юр лицо';
    }

    const searchLower = searchQuery.toLowerCase();
    const searchMatch =
      appeal.id.toLowerCase().includes(searchLower) ||
      appeal.applicantName.toLowerCase().includes(searchLower) ||
      appeal.organizationName.toLowerCase().includes(searchLower) ||
      appeal.category.toLowerCase().includes(searchLower) ||
      appeal.status.toLowerCase().includes(searchLower);

    return ownershipMatch && typeMatch && searchMatch && ALLOWED_STATUSES.includes(appeal.status);
  });

  // Sort appeals
  const sortedAppeals = filteredAppeals.sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn as keyof typeof a];
    const bValue = b[sortColumn as keyof typeof b];
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    return 0;
  });

  const myAppealsCount = allAppeals.filter(
    a => a.responsible === 'Расул Рамазанов' || a.responsible === 'Александр Солодовников'
  ).length;
  const allAppealsCount = allAppeals.length;

  // Handle sort column click
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to asc
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Render sort icon
  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-4 h-4 text-purple-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-purple-600" />
    );
  };

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
          <div>
            <h1 className="text-2xl font-medium text-white mb-1">Кабинет ответственного</h1>
            <p className="text-sm" style={{ color: '#E1BEE7' }}>Управление обращениями клиентов</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-5 mb-6 space-y-4">
          {/* Search */}
          <div className="relative w-full">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск обращений по номеру, заявителю, категории..."
              className="w-full pl-12 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ownership Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Фильтр по владельцу</label>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setActiveFilter('Мои обращения')}
                  className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                    activeFilter === 'Мои обращения'
                      ? 'text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
                  }`}
                  style={activeFilter === 'Мои обращения' ? { backgroundColor: '#673AB7' } : {}}
                >
                  Мои обращения ({myAppealsCount})
                </button>
                <button
                  onClick={() => setActiveFilter('Все обращения')}
                  className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                    activeFilter === 'Все обращения'
                      ? 'text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
                  }`}
                  style={activeFilter === 'Все обращения' ? { backgroundColor: '#673AB7' } : {}}
                >
                  Все обращения ({allAppealsCount})
                </button>
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Фильтр по типу заявителя</label>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setTypeFilter('Все обращения')}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                    typeFilter === 'Все обращения'
                      ? 'text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
                  }`}
                  style={typeFilter === 'Все обращения' ? { backgroundColor: '#673AB7' } : {}}
                >
                  Все
                </button>
                <button
                  onClick={() => setTypeFilter('Физлицо')}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                    typeFilter === 'Физлицо'
                      ? 'text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
                  }`}
                  style={typeFilter === 'Физлицо' ? { backgroundColor: '#673AB7' } : {}}
                >
                  Физ лицо
                </button>
                <button
                  onClick={() => setTypeFilter('Юрлицо')}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                    typeFilter === 'Юрлицо'
                      ? 'text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
                  }`}
                  style={typeFilter === 'Юрлицо' ? { backgroundColor: '#673AB7' } : {}}
                >
                  Юр лицо
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Appeals List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {sortedAppeals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-purple-50 border-b-2 border-purple-200">
                  <tr>
                    <th 
                      className="px-4 py-3 text-left font-semibold text-gray-800 whitespace-nowrap cursor-pointer hover:bg-purple-100 transition-colors"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Номер</span>
                        {renderSortIcon('id')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left font-semibold text-gray-800 whitespace-nowrap cursor-pointer hover:bg-purple-100 transition-colors"
                      onClick={() => handleSort('regDate')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Дата рег.</span>
                        {renderSortIcon('regDate')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left font-semibold text-gray-800 whitespace-nowrap cursor-pointer hover:bg-purple-100 transition-colors"
                      onClick={() => handleSort('category')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Тип обращения</span>
                        {renderSortIcon('category')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left font-semibold text-gray-800 whitespace-nowrap cursor-pointer hover:bg-purple-100 transition-colors"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Статус</span>
                        {renderSortIcon('status')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left font-semibold text-gray-800 whitespace-nowrap cursor-pointer hover:bg-purple-100 transition-colors"
                      onClick={() => handleSort('deadline')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Дедлайн</span>
                        {renderSortIcon('deadline')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left font-semibold text-gray-800 whitespace-nowrap cursor-pointer hover:bg-purple-100 transition-colors"
                      onClick={() => handleSort('responsible')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Ответственный</span>
                        {renderSortIcon('responsible')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left font-semibold text-gray-800 whitespace-nowrap cursor-pointer hover:bg-purple-100 transition-colors"
                      onClick={() => handleSort('applicantName')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Заявитель</span>
                        {renderSortIcon('applicantName')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left font-semibold text-gray-800 whitespace-nowrap cursor-pointer hover:bg-purple-100 transition-colors"
                      onClick={() => handleSort('type')}
                    >
                      <div className="flex items-center gap-2">
                        <span>Тип заявителя</span>
                        {renderSortIcon('type')}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAppeals.map((appeal, idx) => {
                    const isMyAppeal = appeal.responsible === 'Расул Рамазанов' || appeal.responsible === 'Александр Солодовников';
                    const applicantDisplay = appeal.applicantName !== 'N/A' ? appeal.applicantName : appeal.organizationName;
                    
                    return (
                      <tr
                        key={appeal.id}
                        onClick={() => onOpenAppeal(appeal.id)}
                        className={`border-b border-gray-100 hover:bg-purple-50 cursor-pointer transition-all ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-purple-700 font-semibold">№{appeal.id}</span>
                            {isMyAppeal && (
                              <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                                МОЁ
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{appeal.regDate}</td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs ${
                            appeal.category === 'Письменное' ? 'bg-blue-100 text-blue-700' :
                            appeal.category === 'Устное' ? 'bg-green-100 text-green-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {appeal.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {appeal.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-red-600 font-medium whitespace-nowrap">{appeal.deadline}</td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap max-w-[150px] truncate">
                          {appeal.responsible}
                        </td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap max-w-[200px] truncate" title={applicantDisplay}>
                          {applicantDisplay}
                        </td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                          {(() => {
                            // Нормализуем отображение типа заявителя
                            const normalizedType = 
                              appeal.type === 'Физлицо' || appeal.type === 'Физ лицо' ? 'Физ лицо' :
                              appeal.type === 'Юрлицо' || appeal.type === 'Юр лицо' ? 'Юр лицо' :
                              appeal.type;
                            
                            return (
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                normalizedType === 'Физ лицо' ? 'bg-green-100 text-green-700' :
                                normalizedType === 'Юр лицо' ? 'bg-orange-100 text-orange-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {normalizedType}
                              </span>
                            );
                          })()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">Обращения не найдены</p>
              <p className="text-gray-500 text-sm">Попробуйте изменить фильтры или поисковый запрос</p>
            </div>
          )}
        </div>

        {/* Summary Info */}
        {sortedAppeals.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            Показано {sortedAppeals.length} обращений из {allAppealsCount}
          </div>
        )}
      </div>
    </div>
  );
}