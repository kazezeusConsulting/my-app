// src/components/outputs/ApplicationOfFundReport.tsx
import type { Projection } from '@/types/formTypes';

type Props = {
  data: Projection[];
};

export default function ApplicationOfFundReport({ data }: Props) {
  if (!Array.isArray(data) || data.length === 0) return null;

  // Rows must match your Projection fields exactly
  const rows = [
    { label: 'Increase in Fixed Assets',     key: 'fixedAssetAddition' },
    { label: 'Increase in Stock',            key: 'stockIncrease' },
    { label: 'Increase in Debtors',          key: 'debtorsIncrease' },
    { label: 'Repayment of Term Loan (New)', key: 'loanRepayment' },
    { label: 'Increase in Subsidy (FD)',     key: 'subsidyFd' },
    { label: 'Drawings',                     key: 'drawings' },
  ] as const;

  // Formatter: integer rupee
  const fmt = (n: number) =>
    '₹' + Math.round(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  // Compute row totals (sum across years for each row)
  const rowTotals = rows.map(({ key }) =>
    data.reduce((sum, yr) => sum + (Number(yr[key]) || 0), 0)
  );

  // Compute column totals (sum across rows for each year)
  const colTotals = data.map((yr) =>
    rows.reduce((sum, { key }) => sum + (Number(yr[key]) || 0), 0)
  );

  // Grand total (sum of all row totals)
  const grandTotal = rowTotals.reduce((sum, v) => sum + v, 0);

  return (
    <section className="mb-6">
      <h2 className="uppercase text-lg font-semibold mb-4">
        6. Application of Fund
      </h2>
      <table className="border-collapse border border-gray-300 w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Particulars</th>
            {data.map((yr) => (
              <th
                key={`hdr-${yr.year}`}
                className="border border-gray-300 p-2 text-center"
              >
                {yr.year}
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
              {data.map((yr, colIdx) => {
                const val = Number(yr[row.key]) || 0;
                return (
                  <td
                    key={`cell-${rowIdx}-${colIdx}`}
                    className="border border-gray-300 p-2 text-right"
                  >
                    {fmt(val)}
                  </td>
                );
              })}
              <td className="border border-gray-300 p-2 text-right font-semibold">
                {fmt(rowTotals[rowIdx])}
              </td>
            </tr>
          ))}

          {/* SUMMARY ROW */}
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
            <td className="border border-gray-300 p-2 text-right">{fmt(grandTotal)}</td>
          </tr>

          {/* Opening, Surplus, Closing rows */}
          <tr>
            <td className="border border-gray-300 p-2">Opening Cash & Bank Balance</td>
            {data.map((yr, i) => (
              <td
                key={`open-${i}`}
                className="border border-gray-300 p-2 text-right"
              >
                {fmt(Number(yr.openingCashBalance) || 0)}
              </td>
            ))}
            <td className="border border-gray-300 p-2 text-right">-</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2">Add: Surplus</td>
            {data.map((yr, i) => (
              <td
                key={`surplus-${i}`}
                className="border border-gray-300 p-2 text-right"
              >
                {fmt(Number(yr.surplus) || 0)}
              </td>
            ))}
            <td className="border border-gray-300 p-2 text-right">-</td>
          </tr>
          <tr className="font-semibold">
            <td className="border border-gray-300 p-2">Closing Cash & Bank Balance</td>
            {data.map((yr, i) => (
              <td
                key={`close-${i}`}
                className="border border-gray-300 p-2 text-right"
              >
                {fmt(Number(yr.closingCashBalance) || 0)}
              </td>
            ))}
            <td className="border border-gray-300 p-2 text-right">-</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
