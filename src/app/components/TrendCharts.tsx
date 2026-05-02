import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useState } from 'react';

export function TrendCharts() {
  const [hiddenLines, setHiddenLines] = useState<string[]>([]);

  // Данные для графика объема
  const volumeData = [
    { day: 'Пн', written: 42, verbal: 35, regulatory: 8 },
    { day: 'Вт', written: 38, verbal: 41, regulatory: 12 },
    { day: 'Ср', written: 45, verbal: 38, regulatory: 10 },
    { day: 'Чт', written: 51, verbal: 44, regulatory: 15 },
    { day: 'Пт', written: 48, verbal: 47, regulatory: 11 },
    { day: 'Сб', written: 22, verbal: 28, regulatory: 5 },
    { day: 'Вс', written: 18, verbal: 21, regulatory: 4 },
  ];

  // Данные для stacked bar chart
  const statusData = [
    { day: 'Пн', new: 15, inProgress: 25, waiting: 10, review: 8, done: 12 },
    { day: 'Вт', new: 18, inProgress: 22, waiting: 12, review: 10, done: 15 },
    { day: 'Ср', new: 12, inProgress: 28, waiting: 8, review: 12, done: 18 },
    { day: 'Чт', new: 20, inProgress: 30, waiting: 15, review: 9, done: 20 },
    { day: 'Пт', new: 16, inProgress: 26, waiting: 14, review: 11, done: 22 },
    { day: 'Сб', new: 8, inProgress: 15, waiting: 6, review: 5, done: 10 },
    { day: 'Вс', new: 5, inProgress: 12, waiting: 4, review: 3, done: 8 },
  ];

  const toggleLine = (dataKey: string) => {
    if (hiddenLines.includes(dataKey)) {
      setHiddenLines(hiddenLines.filter((key) => key !== dataKey));
    } else {
      setHiddenLines([...hiddenLines, dataKey]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* График объема обращений */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Динамика объёма за период</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={volumeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="day" stroke="#6B7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number, name: string) => {
                const total = volumeData.reduce(
                  (sum, item) => sum + item.written + item.verbal + item.regulatory,
                  0
                );
                const percentage = ((value / total) * 100).toFixed(1);
                return [`${value} (${percentage}%)`, name];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', cursor: 'pointer' }}
              onClick={(e) => toggleLine(e.dataKey as string)}
            />
            {!hiddenLines.includes('written') && (
              <Line
                type="monotone"
                dataKey="written"
                name="Письменные"
                stroke="#0051BA"
                strokeWidth={2}
                dot={{ fill: '#0051BA', r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
            {!hiddenLines.includes('verbal') && (
              <Line
                type="monotone"
                dataKey="verbal"
                name="Устные"
                stroke="#00AA44"
                strokeWidth={2}
                dot={{ fill: '#00AA44', r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
            {!hiddenLines.includes('regulatory') && (
              <Line
                type="monotone"
                dataKey="regulatory"
                name="От регулятора"
                stroke="#DD0000"
                strokeWidth={2}
                dot={{ fill: '#DD0000', r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stacked Bar Chart - распределение по статусам */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Обращения по статусам обработки
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="day" stroke="#6B7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="new" name="Новые" stackId="a" fill="#DD0000" />
            <Bar dataKey="inProgress" name="В работе" stackId="a" fill="#FFAA00" />
            <Bar dataKey="waiting" name="Ожидание" stackId="a" fill="#0051BA" />
            <Bar dataKey="review" name="На проверке" stackId="a" fill="#9333EA" />
            <Bar dataKey="done" name="Готово" stackId="a" fill="#00AA44" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
