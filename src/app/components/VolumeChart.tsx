import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

interface VolumeData {
  day: string;
  written: number;
  regulatory: number;
  verbal: number;
}

interface VolumeChartProps {
  data: VolumeData[];
}

export function VolumeChart({ data }: VolumeChartProps) {
  const [period, setPeriod] = useState<'7days' | '30days' | 'quarter'>('7days');

  const periods = [
    { value: '7days' as const, label: '7 дней' },
    { value: '30days' as const, label: '30 дней' },
    { value: 'quarter' as const, label: 'Квартал' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">График объёма обращений</h2>
        <div className="flex gap-2">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                period === p.value
                  ? 'bg-[#0051BA] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="day" 
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="written"
              name="Письменные"
              stroke="#0051BA"
              strokeWidth={2}
              dot={{ fill: '#0051BA', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="regulatory"
              name="Регуляторные"
              stroke="#DD0000"
              strokeWidth={2}
              dot={{ fill: '#DD0000', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="verbal"
              name="Устные"
              stroke="#00AA44"
              strokeWidth={2}
              dot={{ fill: '#00AA44', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
