import { useState, useEffect } from 'react';
import { SecretaryCard } from './SecretaryCard';
import unifiedAppealsData from '../../../data/unifiedAppealsData';
import { Toaster } from 'sonner';
import { SecretaryCabinet } from './SecretaryCabinet';
import { appealStorage } from '../../../services/appealStorage';

// Допустимый статус для кабинета секретаря - только статус 6 "На ПК"
const ALLOWED_STATUS = 'На ПК';

// MAIN SECRETARY OFFICE PAGE COMPONENT
export function SecretaryOfficePage() {
  const [view, setView] = useState<'cabinet' | 'card'>('cabinet');
  const [selectedAppealId, setSelectedAppealId] = useState<string | null>(null);
  const [allAppeals, setAllAppeals] = useState(() => {
    const savedAppeals = appealStorage.getAllAppeals();
    const savedIds = new Set(savedAppeals.map(a => a.id));
    const uniqueUnifiedAppeals = unifiedAppealsData.filter(a => !savedIds.has(a.id) && a.status === ALLOWED_STATUS);
    return [...savedAppeals.filter(a => a.status === ALLOWED_STATUS), ...uniqueUnifiedAppeals];
  });

  // Load appeals from localStorage on mount
  useEffect(() => {
    const loadAppeals = () => {
      const savedAppeals = appealStorage.getAllAppeals();
      const savedIds = new Set(savedAppeals.map(a => a.id));
      
      // Filter out unified appeals that are already in localStorage AND filter by allowed status
      const uniqueUnifiedAppeals = unifiedAppealsData.filter(a => !savedIds.has(a.id) && a.status === ALLOWED_STATUS);
      
      // Combine: saved appeals (updated versions, filtered by status) + unique unified appeals
      const combined = [...savedAppeals.filter(a => a.status === ALLOWED_STATUS), ...uniqueUnifiedAppeals];
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
        <SecretaryCard onBack={handleBack} appealData={selectedAppeal} />
      ) : (
        <SecretaryCabinet onOpenAppeal={handleOpenAppeal} />
      )}
      <Toaster position="top-right" />
    </>
  );
}