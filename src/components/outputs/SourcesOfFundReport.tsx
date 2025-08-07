// src/components/outputs/SourcesOfFundReport.tsx
import type { FormValues, Projection } from '@/types/formTypes';

type Props = {
  formData: FormValues;
  data: Projection[];
};

export default function SourcesOfFundReport({ formData, data }: Props) {
  if (!Array.isArray(data) || data.length === 0) return null;

  // ₹ formatter, rounds to integer
  const fmt = (n: number) =>
    '₹' + Math.round(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  // Define rows with getters that enforce numeric values
  const rows: {
    label: string;
    getValue: (p: Projection, idx: number) => number;
  }[] = [
    {
      label: 'Capital',
      getValue: (_p, idx) =>
        idx === 0 ? Number(formData.ownerCapital) || 0 : 0,
    },
    {
      label: 'Reserve & Surplus',
      getValue: (p) => Number(p.reserveAndSurplus) || 0,
    },
    {
      label: 'Depreciation & Exp. W/off',
      getValue: (p) => Number(p.depreciationAndExpOff) || 0,
    },
    {
      label: 'Increase in Cash Credit',
      getValue: (p) => Number(p.cashCreditIncrease) || 0,
    },
    {
      label: 'Increase in Term Loan (New)',
      getValue: (p) => Number(p.termLoanIncrease) || 0,
    },
    {
      label: 'Increase in Subsidy',
      getValue: (p) => Number(p.subsidyIncrease) || 0,
    },
    {
      label: 'Increase in Creditors',
      getValue: (p) => Number(p.creditorsIncrease) || 0,
    },
  ];

  // Matrix of values [row][year]
  const rowValues: number[][] = rows.map(({ getValue }) =>
    data.map((yearData, idx) => getValue(yearData, idx))
  );

  // Totals per row
  const rowTotals = rowValues.map(vals =>
    vals.reduce((sum, v) => sum + v, 0)
  );

  // Totals per column (year)
  const colTotals = data.map((_, colIdx) =>
    rowValues.reduce((sum, vals) => sum + vals[colIdx], 0)
  );

  // Grand total
  const grandTotal = rowTotals.reduce((sum, v) => sum + v, 0);

  return (
    <section className="mb-6">
      <h2 className="uppercase text-lg font-semibold mb-4">
        5. Sources of Fund
      </h2>
      <table className="border-collapse border border-gray-300 w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">
              Particulars
            </th>
            {data.map((d, i) => (
              <th
                key={`year-${i}`}
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
          {rows.map((row, rowIdx) => (
            <tr key={`row-${rowIdx}`}>
              <td className="border border-gray-300 p-2">{row.label}</td>
              {rowValues[rowIdx].map((val, colIdx) => (
                <td
                  key={`cell-${rowIdx}-${colIdx}`}
                  className="border border-gray-300 p-2 text-right"
                >
                  {fmt(val)}
                </td>
              ))}
              <td className="border border-gray-300 p-2 text-right font-semibold">
                {fmt(rowTotals[rowIdx])}
              </td>
            </tr>
          ))}

          {/* TOTAL row */}
          <tr className="font-semibold bg-gray-50">
            <td className="border border-gray-300 p-2">TOTAL</td>
            {colTotals.map((ct, i) => (
              <td
                key={`total-col-${i}`}
                className="border border-gray-300 p-2 text-right"
              >
                {fmt(ct)}
              </td>
            ))}
            <td className="border border-gray-300 p-2 text-right">
              {fmt(grandTotal)}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
