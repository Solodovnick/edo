import { ArrowRight, AlertTriangle, Info } from 'lucide-react';

interface Action {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface NextActionProps {
  title?: string;
  description?: string;
  actions: Action[];
  validationErrors?: string[];
  infoMessage?: string;
}

export function NextAction({
  title = 'Следующее действие',
  description,
  actions,
  validationErrors,
  infoMessage,
}: NextActionProps) {
  const getButtonClasses = (variant: Action['variant'], disabled?: boolean) => {
    const base = 'px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2';
    
    if (disabled) {
      return `${base} bg-gray-100 text-gray-400 cursor-not-allowed`;
    }

    switch (variant) {
      case 'primary':
        return `${base} bg-[#0051BA] text-white hover:bg-[#003d8f] shadow-sm hover:shadow-md`;
      case 'secondary':
        return `${base} bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50`;
      case 'tertiary':
        return `${base} text-gray-600 hover:text-gray-900 hover:bg-gray-50`;
      default:
        return `${base} bg-[#0051BA] text-white hover:bg-[#003d8f]`;
    }
  };

  return (
    <div className="bg-white border-t-4 border-[#0051BA] rounded-xl shadow-lg p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
          <ArrowRight className="w-5 h-5 text-[#0051BA]" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </div>
      </div>

      {validationErrors && validationErrors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-900 mb-1">
                Для продолжения необходимо:
              </h4>
              <ul className="space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm text-red-700 flex items-start gap-1">
                    <span>•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {infoMessage && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-[#0051BA] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900">{infoMessage}</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            disabled={action.disabled}
            className={getButtonClasses(action.variant, action.disabled)}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
