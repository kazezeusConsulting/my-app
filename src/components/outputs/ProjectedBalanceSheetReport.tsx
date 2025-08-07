// src/components/outputs/ProjectedBalanceSheetReport.tsx

import type { FormValues, Projection } from "@/types/formTypes";

type Props = {
  formData: FormValues;
  data: Projection[];
};

export default function ProjectedBalanceSheetReport({ formData, data }: Props) {
  if (!data.length) return null;

  // Formatter: integer ₹ in Indian style
  const fmt = (n: number) =>
    "₹" + Math.round(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

  // Rows defined to pull year-end balances
  const assetRows = [
    { label: "Fixed Assets (W.D.V.)", getValue: (d: Projection) => d.writtenDownValue || 0 },
    { label: "Current Assets: Debtors", getValue: (d: Projection) => d.closingDebtors || 0 },
    { label: "Current Assets: Stock in Hand", getValue: (d: Projection) => d.closingStock || 0 },
    { label: "Current Assets: Cash & Bank", getValue: (d: Projection) => d.closingCashBalance || 0 },
  ] as const;

  const liabilityRows = [
    { label: "Share Capital", getValue: () => Number(formData.ownerCapital) || 0 },
    { label: "Reserve & Surplus", getValue: (d: Projection) => d.reserveAndSurplus || 0 },
    { label: "Capital Subsidy", getValue: (d: Projection) => d.subsidyOutstanding || 0 },
    { label: "Term Loan (Outstanding)", getValue: (d: Projection) => d.termLoanOutstanding || 0 },
    { label: "Cash Credit (OD Balance)", getValue: (d: Projection) => d.cashCreditOutstanding || 0 },
    { label: "Sundry Creditors", getValue: (d: Projection) => d.creditorsOutstanding || 0 },
  ] as const;

  // Helper: sum a row across all years
  const sumRow = (getter: (d: Projection) => number) =>
    data.reduce((sum, d) => sum + getter(d), 0);

  // Compute grand totals
  const totalAssetsGrand = assetRows.reduce((sum, row) => sum + sumRow(row.getValue), 0);
  const totalLiabGrand   = liabilityRows.reduce((sum, row) => sum + sumRow(row.getValue), 0);

  return (
    <section className="mb-6">
      <h2 className="uppercase text-lg font-semibold mb-4">
        Projected Balance Sheet
      </h2>
      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Particulars</th>
            {data.map((d, i) => (
              <th key={i} className="border border-gray-300 p-2 text-center">
                {d.year}
              </th>
            ))}
            <th className="border border-gray-300 p-2 text-center font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          {/* Asset rows */}
          {assetRows.map((row, ri) => {
            const vals = data.map((d) => row.getValue(d));
            return (
              <tr key={ri}>
                <td className="border border-gray-300 p-2 font-medium">{row.label}</td>
                {vals.map((v, ci) => (
                  <td key={ci} className="border border-gray-300 p-2 text-right">
                    {fmt(v)}
                  </td>
                ))}
                <td className="border border-gray-300 p-2 text-right font-semibold">
                  {fmt(sumRow(row.getValue))}
                </td>
              </tr>
            );
          })}

          {/* Total Assets */}
          <tr className="font-semibold bg-gray-50">
            <td className="border border-gray-300 p-2">Total Assets</td>
            {data.map((d, ci) => {
              const yearSum = assetRows.reduce((s, row) => s + row.getValue(d), 0);
              return (
                <td key={ci} className="border border-gray-300 p-2 text-right">
                  {fmt(yearSum)}
                </td>
              );
            })}
            <td className="border border-gray-300 p-2 text-right">
              {fmt(totalAssetsGrand)}
            </td>
          </tr>

          {/* Spacer */}
          <tr><td colSpan={data.length + 2} className="p-1"></td></tr>

          {/* Liabilities & Equity */}
          {liabilityRows.map((row, ri) => {
            const vals = data.map((d) => row.getValue(d));
            return (
              <tr key={ri}>
                <td className="border border-gray-300 p-2 font-medium">{row.label}</td>
                {vals.map((v, ci) => (
                  <td key={ci} className="border border-gray-300 p-2 text-right">
                    {fmt(v)}
                  </td>
                ))}
                <td className="border border-gray-300 p-2 text-right font-semibold">
                  {fmt(sumRow(row.getValue))}
                </td>
              </tr>
            );
          })}

          {/* Total Liabilities & Equity */}
          <tr className="font-semibold bg-gray-50">
            <td className="border border-gray-300 p-2">Total Liabilities & Equity</td>
            {data.map((d, ci) => {
              const yearSum = liabilityRows.reduce((s, row) => s + row.getValue(d), 0);
              return (
                <td key={ci} className="border border-gray-300 p-2 text-right">
                  {fmt(yearSum)}
                </td>
              );
            })}
            <td className="border border-gray-300 p-2 text-right">
              {fmt(totalLiabGrand)}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
