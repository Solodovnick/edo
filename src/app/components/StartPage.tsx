import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type DrumState = 'idle' | 'spinning' | 'resultTasks' | 'resultFired';
type LeverState = 'default' | 'pulled' | 'disabled';

const SYMBOLS = ['🍒', '⭐️', '💎', '🔔', '🍋', '🍇'];
const SYMBOL_COLORS = {
  '🍒': '#E74C3C',
  '⭐️': '#F1C40F',
  '💎': '#3498DB',
  '🔔': '#2ECC71',
  '🍋': '#E67E22',
  '🍇': '#9B59B6',
};

export function StartPage() {
  const [drumState, setDrumState] = useState<DrumState>('idle');
  const [leverState, setLeverState] = useState<LeverState>('default');
  const [showModal, setShowModal] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const handlePullLever = () => {
    if (drumState !== 'idle' || isSpinning) return;
    
    setIsSpinning(true);
    setLeverState('pulled');
    setDrumState('spinning');

    // Вернуть рычаг через 500ms
    setTimeout(() => {
      setLeverState('default');
    }, 500);

    // Завершить вращение через 6 секунд
    setTimeout(() => {
      setDrumState('resultTasks');
      setIsSpinning(false);
    }, 6000);
  };

  const handleRefuse = () => {
    if (drumState !== 'resultTasks') return;
    
    setIsSpinning(true);
    setDrumState('spinning');

    // Через 6 секунд показать "Вы уволены"
    setTimeout(() => {
      setDrumState('resultFired');
      setIsSpinning(false);
      
      // Через 3 секунды показать модалку
      setTimeout(() => {
        setShowModal(true);
      }, 3000);
    }, 6000);
  };

  const handleConfirm = () => {
    if (drumState !== 'resultTasks') return;
    
    setDrumState('idle');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDrumState('idle');
  };

  // Создаём двойной список символов для эффекта прокрутки
  const doubledSymbols = [...SYMBOLS, ...SYMBOLS];

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(160deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)'
      }}
    >
      {/* Main Content */}
      <div className="flex-1 flex items-start justify-center pt-32 pb-20">
        {/* Main Card */}
        <motion.div
          className="w-[720px] rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #2D2D44 0%, #252538 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.08)'
          }}
        >
          {/* Header */}
          <div 
            className="px-6 py-5"
            style={{
              background: 'rgba(0,0,0,0.25)',
              borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            <h1 
              className="text-2xl font-semibold text-center"
              style={{ 
                color: '#E8E8E8',
                letterSpacing: '0.02em'
              }}
            >
              Распределение задач в ЭДО
            </h1>
          </div>

          {/* Machine */}
          <div className="px-7 pt-8 pb-7">
            <div className="flex items-center justify-center gap-5">
              {/* Drum */}
              <div className="relative">
                {/* Drum Frame */}
                <div
                  className="rounded-2xl p-3.5 relative"
                  style={{
                    background: 'linear-gradient(180deg, #A8B0C0 0%, #8A92A2 30%, #6A7282 70%, #5A6272 100%)',
                    border: '2px solid #7A8292',
                    boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.40), inset 0 -2px 8px rgba(0,0,0,0.20), 0 6px 20px rgba(0,0,0,0.35)',
                    width: '380px'
                  }}
                >
                  {/* Decorative Arrows */}
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-lg" style={{ color: '#4A4A5A', opacity: 0.9 }}>
                    ‹
                  </div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-lg" style={{ color: '#4A4A5A', opacity: 0.9 }}>
                    ›
                  </div>

                  {/* Drum Viewport */}
                  <div
                    className="rounded-xl overflow-hidden relative"
                    style={{
                      background: '#2A2A3A',
                      border: '1px solid #5A5A6A',
                      height: '200px'
                    }}
                  >
                    {/* Symbols List */}
                    <motion.div
                      className="absolute inset-0"
                      animate={
                        drumState === 'spinning'
                          ? {
                              y: [0, -600],
                              transition: {
                                duration: 6,
                                ease: [0.2, 0.8, 0.2, 1],
                                repeat: Infinity
                              }
                            }
                          : { y: 0 }
                      }
                    >
                      {doubledSymbols.map((symbol, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-center"
                          style={{
                            height: '100px',
                            fontSize: '56px',
                            color: SYMBOL_COLORS[symbol as keyof typeof SYMBOL_COLORS]
                          }}
                        >
                          {symbol}
                        </div>
                      ))}
                    </motion.div>

                    {/* Result Overlay */}
                    <AnimatePresence>
                      {(drumState === 'resultTasks' || drumState === 'resultFired') && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-2 rounded-xl flex flex-col items-center justify-center text-center px-4"
                          style={{
                            background: 'linear-gradient(180deg, rgba(40,38,30,0.98) 0%, rgba(30,28,22,0.98) 100%)',
                            border: '3px solid #C9A227',
                            boxShadow: 'inset 0 0 30px rgba(201,162,39,0.15), 0 0 20px rgba(201,162,39,0.20)'
                          }}
                        >
                          {drumState === 'resultTasks' && (
                            <>
                              <div className="text-[22px] font-bold mb-2" style={{ color: '#E8E8E8' }}>
                                Вам назначено 4 задачи
                              </div>
                              <div className="text-sm font-medium mb-3" style={{ color: 'rgba(232,232,232,0.70)' }}>
                                Пожалуйста, подтвердите.
                              </div>
                              <div className="text-[15px] font-semibold" style={{ color: 'rgba(232,232,232,0.78)' }}>
                                4/10
                              </div>
                            </>
                          )}
                          {drumState === 'resultFired' && (
                            <div className="text-[22px] font-bold" style={{ color: '#B22222' }}>
                              Вы уволены
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Lever */}
              <div className="flex flex-col items-center gap-2">
                <motion.button
                  onClick={handlePullLever}
                  disabled={drumState !== 'idle' || isSpinning}
                  className="relative cursor-pointer disabled:cursor-not-allowed"
                  style={{ opacity: drumState !== 'idle' || isSpinning ? 0.7 : 1 }}
                  whileHover={drumState === 'idle' && !isSpinning ? { scale: 1.05 } : {}}
                  animate={
                    leverState === 'pulled'
                      ? { rotate: -25, originX: 0.5, originY: 0 }
                      : { rotate: 0 }
                  }
                  transition={{ duration: 0.3 }}
                >
                  {/* Stem */}
                  <div
                    className="rounded-xl mx-auto"
                    style={{
                      width: '20px',
                      height: '120px',
                      background: 'linear-gradient(90deg, #555 0%, #777 25%, #888 50%, #777 75%, #555 100%)',
                      boxShadow: '2px 0 4px rgba(0,0,0,0.4), -2px 0 4px rgba(0,0,0,0.4)'
                    }}
                  />
                  
                  {/* Handle */}
                  <div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, #FF4444 0%, #CC0000 100%)',
                      border: '2px solid #AA0000',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.3)'
                    }}
                  />
                </motion.button>

                <div 
                  className="text-[11px] font-semibold"
                  style={{
                    color: 'rgba(232,232,232,0.40)',
                    letterSpacing: '0.12em'
                  }}
                >
                  ◄ ПОТЯНУТЬ ►
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-4 mt-7">
              {/* Refuse Button */}
              <motion.button
                onClick={handleRefuse}
                disabled={drumState !== 'resultTasks'}
                className="h-11 px-8 rounded-xl text-[15px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: drumState === 'resultTasks' 
                    ? 'linear-gradient(180deg, #B8B8C0 0%, #9A9AA2 100%)'
                    : '#6A6A72',
                  color: '#3A3A42',
                  boxShadow: drumState === 'resultTasks' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
                }}
                whileHover={drumState === 'resultTasks' ? { scale: 1.05 } : {}}
                whileTap={drumState === 'resultTasks' ? { scale: 0.95 } : {}}
              >
                Отказаться
              </motion.button>

              {/* Confirm Button */}
              <motion.button
                onClick={handleConfirm}
                disabled={drumState !== 'resultTasks'}
                className="h-11 px-8 rounded-xl text-[15px] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(180deg, #3498DB 0%, #2980B9 100%)',
                  boxShadow: '0 4px 14px rgba(52,152,219,0.40)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Подтвердить
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-start pl-[8%]"
            style={{ background: 'rgba(0,0,0,0.50)' }}
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-[380px] p-7 rounded-xl text-center"
              style={{
                background: 'linear-gradient(180deg, #F8F8FA 0%, #E8E8EC 100%)',
                border: '1px solid #C0C0C8',
                boxShadow: '0 16px 40px rgba(0,0,0,0.35)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-lg font-semibold mb-6" style={{ color: '#2A2A32' }}>
                Скачать форму заявления по собственному желанию
              </div>
              
              <motion.button
                onClick={handleCloseModal}
                className="w-full h-11 rounded-xl text-[15px] font-semibold text-white"
                style={{
                  background: 'linear-gradient(180deg, #3498DB 0%, #2980B9 100%)',
                  boxShadow: '0 4px 14px rgba(52,152,219,0.40)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ок
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}