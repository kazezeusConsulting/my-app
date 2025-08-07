// src/components/outputs/CostOfProjectReport.tsx
import type { FormValues } from '@/types/formTypes';

type Props = { formData: FormValues };

export default function CostOfProjectReport({ formData }: Props) {
  const rows = formData.costItems || [];

  const fmt = (n: number) =>
    '₹' + Math.round(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  const totalCost = rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const totalMargin = rows.reduce(
    (sum, r) => sum + (Number(r.amount) * (Number(r.marginPercent) || 0)) / 100,
    0
  );

  return (
    <section className="mb-6">
      <h2 className="uppercase text-lg font-semibold mb-4">Cost of Project</h2>
      <table className="border-collapse border border-gray-300 w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Particulars</th>
            <th className="border border-gray-300 p-2 text-right">Amount (₹)</th>
            <th className="border border-gray-300 p-2 text-right">Margin (₹)</th>
            <th className="border border-gray-300 p-2 text-right">Finance (₹)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const amount = Number(row.amount) || 0;
            const marginAmt = (amount * (Number(row.marginPercent) || 0)) / 100;
            const financeAmt = amount - marginAmt;
            return (
              <tr key={idx}>
                <td className="border border-gray-300 p-2">{row.type}</td>
                <td className="border border-gray-300 p-2 text-right">{fmt(amount)}</td>
                <td className="border border-gray-300 p-2 text-right">{fmt(marginAmt)}</td>
                <td className="border border-gray-300 p-2 text-right">{fmt(financeAmt)}</td>
              </tr>
            );
          })}

          <tr className="font-semibold bg-gray-50">
            <td className="border border-gray-300 p-2">Total</td>
            <td className="border border-gray-300 p-2 text-right">{fmt(totalCost)}</td>
            <td className="border border-gray-300 p-2 text-right">{fmt(totalMargin)}</td>
            <td className="border border-gray-300 p-2 text-right">{fmt(totalCost - totalMargin)}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
