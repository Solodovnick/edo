import { useState, useEffect, useMemo } from 'react';
import { ProcessingCardNew } from './ProcessingCardNew';
import { Toaster } from 'sonner';
import { ProcessingCabinetNew } from './ProcessingCabinetNew';
import { appealStorage } from '../../../services/appealStorage';
import type { UnifiedAppeal } from '../../../data/unifiedAppealsData';
import {
  appealDtoToUnified,
  fetchResponsibleAppealDetail,
  fetchResponsibleListUnified,
  mergeUnifiedById,
  storageAppealToUnified,
} from '../../../services/edoCabinetApi';

const ALLOWED_STATUSES = [
  'В работе',
  'На ответственном, не взято',
  'На ответственном, взято',
  'На БП',
  'На ПК',
  'На HD',
];

export function ProcessingPage() {
  const [view, setView] = useState<'cabinet' | 'card'>('cabinet');
  const [selectedAppealId, setSelectedAppealId] = useState<string | null>(null);
  const [allAppeals, setAllAppeals] = useState<UnifiedAppeal[]>([]);
  const [detailAppeal, setDetailAppeal] = useState<UnifiedAppeal | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      let apiRows: UnifiedAppeal[] = [];
      try {
        apiRows = await fetchResponsibleListUnified();
      } catch {
        apiRows = [];
      }
      if (cancelled) return;

      const saved = appealStorage
        .getAllAppeals()
        .filter((a) => ALLOWED_STATUSES.includes(a.status))
        .map(storageAppealToUnified);

      setAllAppeals(mergeUnifiedById(apiRows, saved));
    };

    void load();
    const interval = window.setInterval(() => void load(), 15_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!selectedAppealId) {
      setDetailAppeal(null);
      return;
    }
    let cancelled = false;
    void fetchResponsibleAppealDetail(selectedAppealId).then((d) => {
      if (cancelled || !d?.header) return;
      setDetailAppeal(appealDtoToUnified(d.header));
    });
    return () => {
      cancelled = true;
    };
  }, [selectedAppealId]);

  const selectedAppeal = useMemo(() => {
    if (!selectedAppealId) return undefined;
    const fromList = allAppeals.find((a) => a.id === selectedAppealId);
    if (!detailAppeal) return fromList;
    return { ...fromList, ...detailAppeal } as UnifiedAppeal;
  }, [allAppeals, detailAppeal, selectedAppealId]);

  const handleOpenAppeal = (appealId: string) => {
    setSelectedAppealId(appealId);
    setView('card');
  };

  const handleBack = () => {
    setView('cabinet');
    setSelectedAppealId(null);
  };

  return (
    <>
      {view === 'card' && selectedAppeal ? (
        <ProcessingCardNew onBack={handleBack} appealData={selectedAppeal} />
      ) : (
        <ProcessingCabinetNew onOpenAppeal={handleOpenAppeal} appeals={allAppeals} />
      )}
      <Toaster position="top-right" />
    </>
  );
}
