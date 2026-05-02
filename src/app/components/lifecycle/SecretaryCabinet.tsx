import { useState, useEffect } from 'react';
import {
  Search,
  User,
  FileText,
  AlertTriangle,
  ArrowUpDown
} from 'lucide-react';
import { appealStorage } from '../../../services/appealStorage';
import unifiedAppealsData from '../../../data/unifiedAppealsData';
import { toast } from 'sonner';
import { NotificationBell } from '../notifications/NotificationBell';

// Допустимый статус для кабинета секретаря - только статус 6 "На ПК"
const ALLOWED_STATUS = 'На ПК';

interface SecretaryCabinetProps {
  onOpenAppeal: (appealId: string) => void;
}

type SortField = 'id' | 'regDate' | 'category' | 'status' | 'deadline' | 'responsible' | 'applicantName' | 'type';
type SortDirection = 'asc' | 'desc';

export function SecretaryCabinet({ onOpenAppeal }: SecretaryCabinetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('Мои заявки');
  const [allAppeals, setAllAppeals] = useState(unifiedAppealsData);
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Load appeals from localStorage on mount
  useEffect(() => {
    const loadAppeals = () => {
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
    };
    
    loadAppeals();

    // Reload every 5 seconds
    const interval = setInterval(loadAppeals, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter appeals based on active filter and search
  const filteredAppeals = allAppeals.filter(appeal => {
    // Фильтр только для статуса "На ПК"
    if (appeal.status !== ALLOWED_STATUS) {
      return false;
    }

    let ownershipMatch = true;
    if (activeFilter === 'Мои заявки') {
      ownershipMatch = appeal.responsible === 'Расул Рамазанов' || appeal.responsible === 'Александр Солодовников';
    }

    const searchLower = searchQuery.toLowerCase();
    const searchMatch =
      appeal.id.toLowerCase().includes(searchLower) ||
      appeal.applicantName.toLowerCase().includes(searchLower) ||
      appeal.organizationName.toLowerCase().includes(searchLower) ||
      appeal.category.toLowerCase().includes(searchLower) ||
      appeal.status.toLowerCase().includes(searchLower);

    return ownershipMatch && searchMatch;
  });

  // Функция сортировки
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Переключаем направление сортировки
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Новое поле - сортируем по возрастанию
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Сортировка отфильтрованных обращений
  const sortedAppeals = [...filteredAppeals].sort((a, b) => {
    let aValue: string | number = '';
    let bValue: string | number = '';

    switch (sortField) {
      case 'id':
        aValue = a.id;
        bValue = b.id;
        break;
      case 'regDate':
        aValue = a.regDate;
        bValue = b.regDate;
        break;
      case 'category':
        aValue = a.category;
        bValue = b.category;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'deadline':
        aValue = a.deadline;
        bValue = b.deadline;
        break;
      case 'responsible':
        aValue = a.responsible;
        bValue = b.responsible;
        break;
      case 'applicantName':
        aValue = a.applicantName !== 'N/A' ? a.applicantName : a.organizationName;
        bValue = b.applicantName !== 'N/A' ? b.applicantName : b.organizationName;
        break;
      case 'type':
        aValue = a.type;
        bValue = b.type;
        break;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const myAppealsCount = allAppeals.filter(
    a => a.status === ALLOWED_STATUS && 
        (a.responsible === 'Расул Рамазанов' || a.responsible === 'Александр Солодовников')
  ).length;
  const allAppealsCount = allAppeals.filter(
    a => a.status === ALLOWED_STATUS
  ).length;

  return (
    <div style={{ background: '#D1C4E9', minHeight: '100vh', paddingBottom: '3rem' }}>
      {/* Header */}
      <div className="shadow-md" style={{ backgroundColor: '#673AB7' }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div>
            <h1 className="text-2xl font-medium text-white mb-1">Кабинет секретаря</h1>
            <p className="text-sm" style={{ color: '#E1BEE7' }}>Управление заявками</p>
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
                  onClick={() => setActiveFilter('Мои заявки')}
                  className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                    activeFilter === 'Мои заявки'
                      ? 'text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
                  }`}
                  style={activeFilter === 'Мои заявки' ? { backgroundColor: '#673AB7' } : {}}
                >
                  Мои заявки ({myAppealsCount})
                </button>
                <button
                  onClick={() => setActiveFilter('Все заявки')}
                  className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                    activeFilter === 'Все заявки'
                      ? 'text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
                  }`}
                  style={activeFilter === 'Все заявки' ? { backgroundColor: '#673AB7' } : {}}
                >
                  Все заявки ({allAppealsCount})
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
                      onClick={() => handleSort('id')}
                      className="px-4 py-3 text-left font-semibold text-gray-800 whitespace-nowrap cursor-pointer hover:bg-purple-100 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Номер
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('regDate')}
                      className="px-4 py-3 text-left font-semibold text-gray-800 whitespace-nowrap cursor-pointer hover:bg-purple-100 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Дата рег.
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('category')}
                      className="px-4 py-3 text-left font-semibold text-gray-800 whitespace-nowrap cursor-pointer hover:bg-purple-100 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Тип обращения
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('status')}
                      className="px-4 py-3 text-left font-semibold text-gray-800 whitespace-nowrap cursor-pointer hover:bg-purple-100 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Статус
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('deadline')}
                      className="px-4 py-3 text-left font-semibold text-gray-800 whitespace-nowrap cursor-pointer hover:bg-purple-100 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Дедлайн
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('responsible')}
                      className="px-4 py-3 text-left font-semibold text-gray-800 whitespace-nowrap cursor-pointer hover:bg-purple-100 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Ответственный
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('applicantName')}
                      className="px-4 py-3 text-left font-semibold text-gray-800 whitespace-nowrap cursor-pointer hover:bg-purple-100 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Заявитель
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('type')}
                      className="px-4 py-3 text-left font-semibold text-gray-800 whitespace-nowrap cursor-pointer hover:bg-purple-100 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        Тип заявителя
                        <ArrowUpDown className="w-3.5 h-3.5" />
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