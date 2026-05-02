import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileSearch } from 'lucide-react';

interface TypeData {
  type: string;
  count: number;
  percentage: number;
}

interface ReasonData {
  reason: string;
  count: number;
}

interface DistributionWidgetProps {
  typeData: TypeData[];
  reasonData: ReasonData[];
}

export function DistributionWidget({ typeData, reasonData }: DistributionWidgetProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-[300px] flex">
      {/* Левая половина - Bar Chart */}
      <div className="flex-1 border-r border-gray-200 pr-6">
        <h3 className="text-sm font-bold text-gray-800 mb-4">Распределение по типам</h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={typeData} layout="vertical" margin={{ left: 0, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" stroke="#6B7280" style={{ fontSize: '12px' }} />
            <YAxis 
              type="category" 
              dataKey="type" 
              stroke="#6B7280" 
              style={{ fontSize: '11px' }}
              width={120}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value} (${props.payload.percentage}%)`,
                'Количество',
              ]}
            />
            <Bar dataKey="count" fill="#0051BA" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Правая половина - Table */}
      <div className="flex-1 pl-6">
        <h3 className="text-sm font-bold text-gray-800 mb-4">Топ-5 причин обращений</h3>
        <div className="space-y-2">
          {reasonData.map((item, index) => (
            <div
              key={item.reason}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-6 h-6 bg-[#0051BA] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <span className="text-sm text-gray-800">{item.reason}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-800">{item.count}</span>
                <button className="p-1 text-[#0051BA] hover:bg-blue-50 rounded transition-colors">
                  <FileSearch className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
