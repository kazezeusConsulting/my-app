// src/components/outputs/CostOfProjectReport.tsx
import type { FormValues } from '@/types/formTypes';

type Props = { formData: FormValues };

export default function CostOfProjectReport({ formData }: Props) {
  // cast inputs to numbers
  const machineryEquipment       = Number(formData.machineryEquipment) || 0;
  const furnitureFixtures        = Number(formData.furnitureFixtures) || 0;
  const otherFixedAssets         = Number(formData.otherFixedAssets) || 0;
  const preOpExpenses            = Number(formData.preOpExpenses) || 0;
  const workingCapitalRequirement= Number(formData.workingCapitalRequirement) || 0;
  const marginPct                = Number(formData.marginPercent) || 0;
  const financePct               = 100 - marginPct;

  const rows = [
    { label: 'Machinery & Equipment', amount: machineryEquipment },
    { label: 'Furniture & Fixtures',   amount: furnitureFixtures },
    { label: 'Other Fixed Assets',     amount: otherFixedAssets },
    { label: 'Pre-Operative Expenses', amount: preOpExpenses },
    { label: 'Working Capital Requirement', amount: workingCapitalRequirement },
  ];

  const totalCost = rows.reduce((sum, r) => sum + r.amount, 0);

  // money formatter
  const fmt = (n: number) =>
    '₹' + Math.round(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <section className="mb-6">
      <h2 className="uppercase text-lg font-semibold mb-4">Cost of Project</h2>

      {/* show percentages on top */}
      <div className="flex justify-end space-x-8 mb-2 text-sm">
        <div><strong>Margin:</strong> {marginPct}%</div>
        <div><strong>Finance:</strong> {financePct}%</div>
      </div>

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
          {rows.map(({ label, amount }, idx) => {
            const marginAmt  = (amount * marginPct)  / 100;
            const financeAmt = (amount * financePct) / 100;
            return (
              <tr key={idx}>
                <td className="border border-gray-300 p-2">{label}</td>
                <td className="border border-gray-300 p-2 text-right">
                  {fmt(amount)}
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {fmt(marginAmt)}
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {fmt(financeAmt)}
                </td>
              </tr>
            );
          })}

          <tr className="font-semibold bg-gray-50">
            <td className="border border-gray-300 p-2">Total</td>
            <td className="border border-gray-300 p-2 text-right">{fmt(totalCost)}</td>
            <td className="border border-gray-300 p-2 text-right">
              {fmt((totalCost * marginPct) / 100)}
            </td>
            <td className="border border-gray-300 p-2 text-right">
              {fmt((totalCost * financePct) / 100)}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
