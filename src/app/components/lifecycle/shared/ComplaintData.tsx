import { Calendar, Tag, AlertCircle, User, FileText, Mail, Phone } from 'lucide-react';

interface ComplaintDataProps {
  appealId: string;
  channel?: 'paper' | 'verbal' | 'regulatory';
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  slaDeadline?: string;
  responsible?: string;
  createdAt?: string;
  updatedAt?: string;
  clientName?: string;
  clientType?: 'individual' | 'organization' | 'regulator';
  clientEmail?: string;
  clientPhone?: string;
}

const channelConfig = {
  paper: { label: 'На бумаге', icon: '📄' },
  verbal: { label: 'Устно', icon: '💬' },
  regulatory: { label: 'Регуляторная', icon: '🏛️' },
};

const priorityConfig = {
  low: { label: 'Низкий', color: 'text-gray-600 bg-gray-100' },
  medium: { label: 'Средний', color: 'text-blue-600 bg-blue-100' },
  high: { label: 'Высокий', color: 'text-orange-600 bg-orange-100' },
  critical: { label: 'Критичный', color: 'text-red-600 bg-red-100' },
};

const clientTypeConfig = {
  individual: { label: 'Физ. лицо', icon: '👤' },
  organization: { label: 'Организация', icon: '🏢' },
  regulator: { label: 'Регулятор', icon: '🏛️' },
};

export function ComplaintData({
  appealId,
  channel,
  category,
  priority,
  slaDeadline,
  responsible,
  createdAt,
  updatedAt,
  clientName,
  clientType,
  clientEmail,
  clientPhone,
}: ComplaintDataProps) {
  const DataRow = ({ 
    icon: Icon, 
    label, 
    value, 
    valueColor 
  }: { 
    icon: React.ComponentType<{ className?: string }>; 
    label: string; 
    value: string; 
    valueColor?: string;
  }) => (
    <div className="flex items-start gap-3 py-2">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-500 mb-0.5">{label}</div>
        <div className={`text-sm font-medium ${valueColor || 'text-gray-900'}`}>{value}</div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-bold text-gray-900">Данные обращения</h3>
      </div>

      <div className="p-4 space-y-1">
        <DataRow icon={FileText} label="Номер обращения" value={appealId} />

        {channel && (
          <DataRow
            icon={Tag}
            label="Канал поступления"
            value={`${channelConfig[channel].icon} ${channelConfig[channel].label}`}
          />
        )}

        {category && <DataRow icon={Tag} label="Категория" value={category} />}

        {priority && (
          <div className="flex items-start gap-3 py-2">
            <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-0.5">Приоритет</div>
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${priorityConfig[priority].color}`}>
                {priorityConfig[priority].label}
              </span>
            </div>
          </div>
        )}

        {slaDeadline && (
          <DataRow icon={Calendar} label="SLA до" value={slaDeadline} valueColor="text-[#FFAA00]" />
        )}

        {responsible && <DataRow icon={User} label="Ответственный" value={responsible} />}

        {createdAt && <DataRow icon={Calendar} label="Создано" value={createdAt} />}

        {updatedAt && <DataRow icon={Calendar} label="Обновлено" value={updatedAt} />}
      </div>

      {(clientName || clientEmail || clientPhone) && (
        <>
          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
            <h4 className="font-bold text-sm text-gray-900">Контакты заявителя</h4>
          </div>
          <div className="p-4 space-y-1">
            {clientName && (
              <DataRow
                icon={User}
                label="Заявитель"
                value={`${clientName}${clientType ? ` (${clientTypeConfig[clientType].label})` : ''}`}
              />
            )}
            {clientEmail && <DataRow icon={Mail} label="Email" value={clientEmail} />}
            {clientPhone && <DataRow icon={Phone} label="Телефон" value={clientPhone} />}
          </div>
        </>
      )}
    </div>
  );
}
