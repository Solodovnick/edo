import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  trend?: {
    value: string;
    direction: 'up' | 'down';
    isPositive: boolean;
  };
  sparklineData?: number[];
  donutData?: { value: number; color: string }[];
  status?: {
    goal: string;
    current: string;
    type: 'success' | 'warning';
  };
  rating?: number;
}

function KPICard({ title, value, subtitle, trend, sparklineData, donutData, status, rating }: KPICardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="text-sm text-gray-600 mb-2">{title}</div>
      <div className="text-3xl font-bold text-gray-800 mb-1">{value}</div>
      <div className="text-xs text-gray-500 mb-3">{subtitle}</div>

      {/* Trend */}
      {trend && (
        <div className={`flex items-center gap-1 text-sm mb-2 ${trend.isPositive ? 'text-[#00AA44]' : 'text-[#DD0000]'}`}>
          {trend.direction === 'up' ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{trend.value} от предыдущего периода</span>
        </div>
      )}

      {/* Status */}
      {status && (
        <div className="space-y-1">
          <div className={`flex items-center gap-2 text-xs ${status.type === 'success' ? 'text-[#00AA44]' : 'text-[#FFAA00]'}`}>
            {status.type === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            <span>Цель: {status.goal} | {status.current}</span>
          </div>
        </div>
      )}

      {/* Rating */}
      {rating && (
        <div className="flex items-center gap-1 text-yellow-400 text-lg mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star}>{star <= Math.round(rating) ? '★' : '☆'}</span>
          ))}
          <span className="text-xs text-gray-500 ml-2">({rating}/5)</span>
        </div>
      )}

      {/* Sparkline */}
      {sparklineData && (
        <div className="h-12 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData.map((value, index) => ({ value }))}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0051BA"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Donut Chart */}
      {donutData && (
        <div className="flex items-center justify-center h-16 mt-2">
          <PieChart width={60} height={60}>
            <Pie
              data={donutData}
              dataKey="value"
              cx={30}
              cy={30}
              innerRadius={18}
              outerRadius={28}
              paddingAngle={0}
            >
              {donutData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </div>
      )}
    </div>
  );
}

export function KPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <KPICard
        title="Объём обращений"
        value="89"
        subtitle="Всего обращений"
        trend={{ value: '↑ 5%', direction: 'up', isPositive: true }}
        sparklineData={[65, 68, 72, 70, 75, 82, 89]}
      />
      <KPICard
        title="Соответствие SLA"
        value="96%"
        subtitle="Письменные обращения в срок"
        status={{ goal: '99%', current: 'Осталось: 3% до целей', type: 'warning' }}
        donutData={[
          { value: 96, color: '#00AA44' },
          { value: 4, color: '#E5E7EB' },
        ]}
      />
      <KPICard
        title="Среднее время обработки (AHT)"
        value="5.8 ч"
        subtitle="Average Handling Time"
        trend={{ value: '↓ 12 мин', direction: 'down', isPositive: true }}
        status={{ goal: '6 ч', current: 'Статус: норма ✓', type: 'success' }}
      />
      <KPICard
        title="Удовлетворённость клиентов (CSAT)"
        value="78%"
        subtitle="Satisfaction Score"
        status={{ goal: '80%', current: 'Нужно улучшить', type: 'warning' }}
        rating={3.9}
      />
    </div>
  );
}
