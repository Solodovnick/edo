import { useState } from 'react';
import { ProcessingCardNew } from './ProcessingCardNew';
import { Toaster, toast } from 'sonner';
import { ProcessingCabinetNew } from './ProcessingCabinetNew';
import { getAppealDetail, type CabinetAppeal } from '../../../services/appealApi';

export function ProcessingPage() {
  const [view, setView] = useState<'cabinet' | 'card'>('cabinet');
  const [selectedAppeal, setSelectedAppeal] = useState<CabinetAppeal | null>(null);
  const [cardLoading, setCardLoading] = useState(false);

  const handleOpenAppeal = async (appealId: string) => {
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
  };

  const handleBack = () => {
    setView('cabinet');
    setSelectedAppeal(null);
  };

  if (cardLoading) return (
    <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
      Загрузка карточки…
    </div>
  );

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