// src/components/outputs/Graphs.tsx
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import type { Projection } from '@/types/formTypes';

type GraphsProps = {
  data: Projection[];
};

export default function Graphs({ data }: GraphsProps) {
  if (!data || data.length === 0) return null;

  // Prepare chart data: use calendar year labels
  const chartData = data.map(({ year, revenue, netProfit }) => ({
    year: String(year),
    revenue,
    netProfit,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip
            formatter={(value: number) =>
              `₹${value.toLocaleString('en-IN', {
                maximumFractionDigits: 0,
              })}`
            }
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="netProfit"
            name="Net Profit"
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
