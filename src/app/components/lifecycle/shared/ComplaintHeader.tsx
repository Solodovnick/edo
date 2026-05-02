import { Clock, User, AlertCircle } from 'lucide-react';

interface ComplaintHeaderProps {
  appealId: string;
  status: 'draft' | 'registered' | 'in_progress' | 'decision_made' | 'delivered' | 'audit' | 'archived' | 'closed';
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  slaDeadline?: string;
  responsible?: string;
  createdAt?: string;
  onTakeWork?: () => void;
  onReleaseWork?: () => void;
  isAssignedToMe?: boolean;
}

const statusConfig = {
  draft: { label: 'Черновик', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  registered: { label: 'Зарегистрировано', color: 'bg-blue-100 text-[#0051BA] border-blue-300' },
  in_progress: { label: 'В работе', color: 'bg-yellow-100 text-[#FFAA00] border-yellow-300' },
  decision_made: { label: 'Решение принято', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  delivered: { label: 'Доведено', color: 'bg-green-100 text-[#00AA44] border-green-300' },
  audit: { label: 'В аудите', color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
  archived: { label: 'Архив', color: 'bg-gray-100 text-gray-600 border-gray-300' },
  closed: { label: 'Закрыто', color: 'bg-gray-200 text-gray-800 border-gray-400' },
};

const priorityConfig = {
  low: { label: 'Низкий', color: 'text-gray-600' },
  medium: { label: 'Средний', color: 'text-blue-600' },
  high: { label: 'Высокий', color: 'text-orange-600' },
  critical: { label: 'Критичный', color: 'text-red-600' },
};

export function ComplaintHeader({
  appealId,
  status,
  category,
  priority,
  slaDeadline,
  responsible,
  createdAt,
  onTakeWork,
  onReleaseWork,
  isAssignedToMe = false,
}: ComplaintHeaderProps) {
  const statusStyle = statusConfig[status];
  const priorityStyle = priority ? priorityConfig[priority] : null;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-[1400px] mx-auto px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Обращение № {appealId}</h1>
            <span className={`px-4 py-1.5 rounded-lg border-2 font-medium text-sm ${statusStyle.color}`}>
              {statusStyle.label}
            </span>
          </div>

          {status === 'in_progress' && (onTakeWork || onReleaseWork) && (
            <div>
              {isAssignedToMe ? (
                <button
                  onClick={onReleaseWork}
                  className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Снять с себя
                </button>
              ) : (
                <button
                  onClick={onTakeWork}
                  className="px-4 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003d8f] transition-colors font-medium"
                >
                  Взять в работу
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-600">
          {category && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Категория:</span>
              <span>{category}</span>
            </div>
          )}

          {priority && priorityStyle && (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">Приоритет:</span>
              <span className={`font-medium ${priorityStyle.color}`}>{priorityStyle.label}</span>
            </div>
          )}

          {slaDeadline && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">SLA до:</span>
              <span className="font-medium text-[#FFAA00]">{slaDeadline}</span>
            </div>
          )}

          {responsible && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-medium">Ответственный:</span>
              <span>{responsible}</span>
            </div>
          )}

          {createdAt && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Создано:</span>
              <span>{createdAt}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
