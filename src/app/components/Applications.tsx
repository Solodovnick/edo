import { useState, useEffect, useCallback, useRef } from 'react';
import { ApplicationsFilters, type FilterState } from './ApplicationsFilters';
import { ApplicationsTable } from './ApplicationsTable';
import { ApplicationDetail } from './ApplicationDetail';
import { getAppeals, type Application } from '@/services/appealApi';
import { Inbox } from 'lucide-react';

export function Applications() {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({ search: '', category: '', slaStatus: '' });
  const latestFiltersRef = useRef<FilterState>(filters);

  const fetchAppeals = useCallback(async (f: FilterState) => {
    setLoading(true);
    setError(null);
    try {
      const { applications: data } = await getAppeals(
        0,
        100,
        f.search || undefined,
        undefined,
        f.category || undefined,
      );
      // Client-side SLA filter (no backend support needed)
      const filtered = f.slaStatus
        ? data.filter((a) => a.slaStatus === f.slaStatus)
        : data;
      setApplications(filtered);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить обращения');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on filter change
  useEffect(() => {
    latestFiltersRef.current = filters;
    fetchAppeals(filters);
  }, [filters, fetchAppeals]);

  const handleFilterChange = useCallback((f: FilterState) => {
    setFilters(f);
  }, []);

  const handleRetry = useCallback(() => {
    fetchAppeals(latestFiltersRef.current);
  }, [fetchAppeals]);

  return (
    <div className="flex flex-1 overflow-hidden">
      <ApplicationsFilters
        onFilterChange={handleFilterChange}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {loading && (
          <div className="flex flex-1 items-center justify-center text-gray-500 text-sm">
            Загрузка обращений…
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-sm">
            <span className="text-red-600">{error}</span>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] transition-colors"
            >
              Повторить
            </button>
          </div>
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-gray-400">
            <Inbox className="w-12 h-12 opacity-30" />
            <p className="text-sm font-medium">Нет обращений</p>
            {(filters.search || filters.category || filters.slaStatus) && (
              <p className="text-xs">Попробуйте изменить фильтры</p>
            )}
          </div>
        )}

        {!loading && !error && applications.length > 0 && (
          <ApplicationsTable
            applications={applications}
            onApplicationClick={setSelectedApplication}
          />
        )}
      </div>

      {selectedApplication && (
        <ApplicationDetail
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
}
