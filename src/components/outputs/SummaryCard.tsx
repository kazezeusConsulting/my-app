// src/components/outputs/SummaryCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { ProjectionResult } from "@/utils/calculateProjections";

type SummaryCardProps = {
  data: ProjectionResult[];
};

export default function SummaryCard({ data }: SummaryCardProps) {
  if (!data || data.length === 0) return null;
  const last = data[data.length - 1];
  const avgDscr = data.reduce((sum, r) => sum + r.dscr, 0) / data.length;
  const avgMargin =
    (data.reduce((sum, r) => sum + r.profitMargin, 0) / data.length) * 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Average DSCR</CardTitle>
        </CardHeader>
        <CardContent>{avgDscr.toFixed(2)}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Net Profit (Year {last.year})</CardTitle>
        </CardHeader>
        <CardContent>₹ {last.netProfit.toLocaleString()}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Working Capital (Year {last.year})</CardTitle>
        </CardHeader>
        <CardContent>₹ {last.workingCapital.toLocaleString()}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Avg. Profit Margin</CardTitle>
        </CardHeader>
        <CardContent>{avgMargin.toFixed(2)} %</CardContent>
      </Card>
    </div>
  );
}
