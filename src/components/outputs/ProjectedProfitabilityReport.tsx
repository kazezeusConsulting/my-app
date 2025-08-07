// src/components/outputs/ProjectedProfitabilityReport.tsx
import type { Projection } from '@/types/formTypes';

type Props = { data: Projection[] };

export default function ProjectedProfitabilityReport({ data }: Props) {
  if (data.length === 0) return null;

  // Formatting helpers
  const fmtCurr = (n: number) =>
    '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  const fmtPct = (n: number) =>
    n.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + '%';

  // Extract per-year arrays
  const revenue          = data.map((d) => d.revenue);
  const costOfSales      = data.map((d) => d.costOfSales);
  const purchase         = data.map((d) => d.purchase ?? 0);
  const electricity      = data.map((d) => d.electricityExpenses ?? 0);
  const labour           = data.map((d) => d.labourAndWages ?? 0);
  const overheads        = data.map((d) => d.otherOverheads ?? 0);
  const outwardFreight   = data.map((d) => d.outwardFreight ?? 0);
  const openingStock     = data.map((d) => d.openingStock ?? 0);
  const closingStock     = data.map((d) => d.closingStock ?? 0);
  const inwardFreight    = data.map((d) => d.inwardFreight ?? 0);
  const adminExpenses    = data.map((d) => d.adminExpenses ?? 0);
  const depreciation     = data.map((d) => d.depreciation);
  const netProfit        = data.map((d) => d.netProfit);
  const profitRatios     = data.map((d) => d.profitMargin * 100);

  // Computed metrics
  const grossProfit      = revenue.map((r, i) => r - costOfSales[i]);
  const totalExpenses    = data.map((_, i) =>
                          inwardFreight[i] + adminExpenses[i] + depreciation[i]);
  const sum  = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  const avg  = (arr: number[]) => (arr.length ? sum(arr) / arr.length : 0);

  // Row definitions
  const rows: {
    label: string;
    values: number[];
    isPercent?: boolean;
    useAverage?: boolean;
  }[] = [
    { label: 'A) Sales (Gross Receipts)', values: revenue },
    { label: 'B) Cost of Sales',          values: costOfSales },
    { label: '   Purchase',               values: purchase },
    { label: '   Electricity',            values: electricity },
    { label: '   Labour & Wages',         values: labour },
    { label: '   Other Overheads',        values: overheads },
    { label: '   Outward Freight',        values: outwardFreight },
    { label: '   Add: Opening Stock',     values: openingStock },
    { label: '   Less: Closing Stock',    values: closingStock },
    { label: 'C) Gross Profit (A–B)',     values: grossProfit },
    { label: 'D) Inward Freight',         values: inwardFreight },
    { label: 'E) Administrative Expenses',values: adminExpenses },
    { label: 'F) Depreciation',           values: depreciation },
    { label: 'Total (D+E+F)',             values: totalExpenses },
    { label: 'G) Net Profit',             values: netProfit },
    {
      label: 'Profit Ratio (%)',
      values: profitRatios,
      isPercent: true,
      useAverage: true,
    },
  ];

  return (
    <section className="mb-6">
      <h2 className="uppercase text-lg font-semibold mb-4">
        10. Projected Profitability Statement
      </h2>
      <table className="border-collapse border border-gray-300 w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">
              Particulars
            </th>
            {data.map((d) => (
              <th
                key={d.year}
                className="border border-gray-300 p-2 text-center"
              >
                {d.year}
              </th>
            ))}
            <th className="border border-gray-300 p-2 text-center font-semibold">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ label, values, isPercent, useAverage }) => {
            const total = useAverage ? avg(values) : sum(values);
            return (
              <tr key={label}>
                <td className="border border-gray-300 p-2">{label}</td>
                {values.map((v, i) => (
                  <td
                    key={`${label}-${data[i].year}`}
                    className="border border-gray-300 p-2 text-right"
                  >
                    {isPercent ? fmtPct(v) : fmtCurr(v)}
                  </td>
                ))}
                <td className="border border-gray-300 p-2 text-right font-semibold">
                  {isPercent ? fmtPct(total) : fmtCurr(total)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
