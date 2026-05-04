import { useState, useEffect, useCallback } from 'react';
import { ApplicationsFilters } from './ApplicationsFilters';
import { ApplicationsTable } from './ApplicationsTable';
import { ApplicationDetail } from './ApplicationDetail';
import { getAppeals, type Application } from '@/services/appealApi';

export function Applications() {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { applications: data } = await getAppeals();
      setApplications(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить обращения');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppeals();
  }, [fetchAppeals]);

  return (
    <div className="flex flex-1 overflow-hidden">
      <ApplicationsFilters onFilterChange={() => {}} />

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
              onClick={fetchAppeals}
              className="px-4 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] transition-colors"
            >
              Повторить
            </button>
          </div>
        )}

        {!loading && !error && (
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
