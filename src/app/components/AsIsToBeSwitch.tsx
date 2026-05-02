interface AsIsToBeSwitchProps {
  isToBeMode: boolean;
  onToggle: () => void;
}

export function AsIsToBeSwitch({ isToBeMode, onToggle }: AsIsToBeSwitchProps) {
  return (
    <div className="fixed top-24 right-8 z-40 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="relative">
        {/* Glass container */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-2">
          <div className="flex items-center gap-3 px-3 py-2">
            {/* Label */}
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Режим просмотра
            </div>
            
            {/* Switch */}
            <button
              onClick={onToggle}
              className="relative w-32 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner transition-all duration-300 hover:shadow-lg"
              type="button"
            >
              {/* Sliding background */}
              <div
                className="absolute top-1 left-1 right-1 bottom-1 rounded-lg transition-all duration-300"
                style={{
                  background: isToBeMode
                    ? 'linear-gradient(135deg, #0051BA 0%, #0066DD 100%)'
                    : 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
                }}
              />
              
              {/* Sliding indicator */}
              <div
                className="absolute top-1 h-10 w-[60px] bg-white rounded-lg shadow-lg transition-transform duration-300 ease-out"
                style={{
                  transform: isToBeMode ? 'translateX(62px)' : 'translateX(2px)',
                }}
              />
              
              {/* Labels */}
              <div className="relative flex items-center justify-between h-full px-2">
                <span
                  className="text-xs font-bold uppercase tracking-wide z-10 w-[60px] text-center transition-colors duration-200"
                  style={{
                    color: !isToBeMode ? '#1F2937' : '#FFFFFF',
                  }}
                >
                  AS IS
                </span>
                <span
                  className="text-xs font-bold uppercase tracking-wide z-10 w-[60px] text-center transition-colors duration-200"
                  style={{
                    color: isToBeMode ? '#1F2937' : '#FFFFFF',
                  }}
                >
                  TO BE
                </span>
              </div>
            </button>

            {/* Status badge */}
            <div
              className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-300"
              style={{
                backgroundColor: isToBeMode ? '#0051BA' : '#6B7280',
                color: '#FFFFFF',
              }}
            >
              {isToBeMode ? '🚀 Будущее' : '📋 Текущее'}
            </div>
          </div>
        </div>

        {/* Info tooltip */}
        <div className="mt-2 bg-white/90 backdrop-blur-xl rounded-xl shadow-md border border-white/40 p-3 text-xs animate-in fade-in zoom-in-95 duration-300 delay-200">
          <div className="flex items-start gap-2">
            <div className="text-base">{isToBeMode ? '✨' : 'ℹ️'}</div>
            <div>
              <div className="font-bold text-gray-800 mb-1">
                {isToBeMode ? 'Режим TO BE' : 'Режим AS IS'}
              </div>
              <div className="text-gray-600 leading-relaxed">
                {isToBeMode
                  ? 'Показывает улучшенную версию системы с новым функционалом и оптимизациями'
                  : 'Показывает текущую версию системы без изменений'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
