import { useState, useEffect } from 'react';
import { ProcessingCardNew } from './ProcessingCardNew';
import unifiedAppealsData from '../../../data/unifiedAppealsData';
import { Toaster } from 'sonner';
import { ProcessingCabinetNew } from './ProcessingCabinetNew';
import { appealStorage } from '../../../services/appealStorage';

// Допустимые статусы для кабинета ответственного (3, 4, 5, 6, 7)
const ALLOWED_STATUSES = [
  'В работе',                        // Зарегистрированные обращения
  'На ответственном, не взято',      // 3
  'На ответственном, взято',         // 4
  'На БП',                           // 5
  'На ПК',                           // 6
  'На HD'                            // 7
];

// MAIN PROCESSING PAGE COMPONENT
export function ProcessingPage() {
  const [view, setView] = useState<'cabinet' | 'card'>('cabinet');
  const [selectedAppealId, setSelectedAppealId] = useState<string | null>(null);
  const [allAppeals, setAllAppeals] = useState(() => {
    const savedAppeals = appealStorage.getAllAppeals();
    const savedIds = new Set(savedAppeals.map(a => a.id));
    const uniqueUnifiedAppeals = unifiedAppealsData.filter(a => !savedIds.has(a.id) && ALLOWED_STATUSES.includes(a.status));
    return [...savedAppeals.filter(a => ALLOWED_STATUSES.includes(a.status)), ...uniqueUnifiedAppeals];
  });

  // Load appeals from localStorage on mount
  useEffect(() => {
    const loadAppeals = () => {
      const savedAppeals = appealStorage.getAllAppeals();
      const savedIds = new Set(savedAppeals.map(a => a.id));
      
      // Filter out unified appeals that are already in localStorage AND filter by allowed statuses
      const uniqueUnifiedAppeals = unifiedAppealsData.filter(a => !savedIds.has(a.id) && ALLOWED_STATUSES.includes(a.status));
      
      // Combine: saved appeals (updated versions, filtered by status) + unique unified appeals
      const combined = [...savedAppeals.filter(a => ALLOWED_STATUSES.includes(a.status)), ...uniqueUnifiedAppeals];
      setAllAppeals(combined);
    };
    
    loadAppeals();
    
    // Reload every 5 seconds
    const interval = setInterval(loadAppeals, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenAppeal = (appealId: string) => {
    setSelectedAppealId(appealId);
    setView('card');
  };

  const handleBack = () => {
    setView('cabinet');
    setSelectedAppealId(null);
  };

  const selectedAppeal = allAppeals.find(a => a.id === selectedAppealId);

  return (
    <>
      {view === 'card' && selectedAppeal ? (
        <ProcessingCardNew onBack={handleBack} appealData={selectedAppeal} />
      ) : (
        <ProcessingCabinetNew onOpenAppeal={handleOpenAppeal} />
      )}
      <Toaster position="top-right" />
    </>
  );
}