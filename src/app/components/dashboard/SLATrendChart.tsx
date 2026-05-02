import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface SLATrendData {
  day: string;
  written: number;
  regulatory: number;
  verbal: number;
}

interface SLATrendChartProps {
  data: SLATrendData[];
}

export function SLATrendChart({ data }: SLATrendChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        📈 ТРЕНД СООТВЕТСТВИЯ SLA (последние 7 дней)
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="day" 
            stroke="#666666"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#666666"
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 99, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '12px'
            }}
            formatter={(value: number) => `${value}%`}
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
            iconType="line"
          />
          
          {/* Целевая линия 99% */}
          <ReferenceLine 
            y={99} 
            stroke="#9CCC65" 
            strokeDasharray="5 5"
            label={{ value: 'Цель: 99%', position: 'right', fill: '#9CCC65', fontSize: 11 }}
          />
          
          <Line 
            type="monotone" 
            dataKey="written" 
            stroke="#2196F3" 
            strokeWidth={2}
            name="Письменные"
            dot={{ fill: '#2196F3', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="regulatory" 
            stroke="#F44336" 
            strokeWidth={2}
            name="От регулятора"
            dot={{ fill: '#F44336', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="verbal" 
            stroke="#4CAF50" 
            strokeWidth={2}
            name="Устные"
            dot={{ fill: '#4CAF50', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-3 text-center text-xs text-gray-500">
        Обновлено 30 сек назад
      </div>
    </div>
  );
}
