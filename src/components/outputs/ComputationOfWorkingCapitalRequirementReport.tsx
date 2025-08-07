// src/components/outputs/ComputationOfWorkingCapitalRequirementReport.tsx

import type { FormValues, Projection } from '@/types/formTypes';

type Props = {
  formData: FormValues;
  data: Projection[];
};

export default function ComputationOfWorkingCapitalRequirementReport({ formData, data }: Props) {
  if (!data.length) return null;

  // Helper to format values as currency
  const formatValue = (val: number) =>
    '₹' + val.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  // Build computed metrics per year, using keys defined in Projection
  interface YearComputed {
    year: number;
    stock: number;
    debtors: number;
    totalAssets: number;
    margin: number;
    wcr: number;
  }

  const computed: YearComputed[] = data.map((d) => {
    const stock = d.stockIncrease ?? 0;
    const debtors = d.debtorsIncrease ?? 0;
    const totalAssets = stock + debtors;
    const wcrMarginItem = formData.costItems.find(
      (item) => item.type === 'Working Capital Requirement'
    );
    const marginPct = wcrMarginItem ? Number(wcrMarginItem.marginPercent) : 0;
    const margin = totalAssets * (marginPct / 100);
    const wcr = d.workingCapital;
    return { year: d.year, stock, debtors, totalAssets, margin, wcr };
  });

  // Define rows with labels and matching keys from YearComputed
  const rows: { label: string; key: keyof YearComputed }[] = [
    { label: 'Value of Stock', key: 'stock' },
    { label: 'Sundry Debtors', key: 'debtors' },
    { label: 'Total Assets', key: 'totalAssets' },
    {
      label: `Less: Margin (${formData.costItems.find((i) => i.type === 'Working Capital Requirement')?.marginPercent || 0}%)`,
      key: 'margin',
    },
    { label: 'Working Capital Requirement', key: 'wcr' },
  ];

  return (
    <section className="mb-6">
      <h2 className="uppercase text-lg font-semibold mb-4">
        12. Computation of Working Capital Requirement
      </h2>
      <table className="border-collapse border border-gray-300 w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Particulars</th>
            {computed.map((c) => (
              <th
                key={c.year}
                className="border border-gray-300 p-2 text-center"
              >
                {c.year}
              </th>
            ))}
            <th className="border border-gray-300 p-2 text-center font-semibold">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const total = computed.reduce((sum, c) => sum + c[row.key], 0);

            return (
              <tr key={row.key}>
                <td className="border border-gray-300 p-2 font-medium">
                  {row.label}
                </td>
                {computed.map((c) => (
                  <td
                    key={`${row.key}-${c.year}`}
                    className="border border-gray-300 p-2 text-right"
                  >
                    {formatValue(c[row.key])}
                  </td>
                ))}
                <td className="border border-gray-300 p-2 text-right font-semibold">
                  {formatValue(total)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
