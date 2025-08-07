// src/components/outputs/ProjectedBalanceSheetReport.tsx
import type { FormValues, Projection } from '@/types/formTypes';

type Props = {
  formData: FormValues;
  data: Projection[];
};

export default function ProjectedBalanceSheetReport({ formData, data }: Props) {
  if (!data.length) return null;

  // Formatter: round to integer and format Indian rupees
  const fmt = (n: number) =>
    '₹' + Math.round(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  // A row is defined by a label and a getter that returns a number
  type Row = {
    label: string;
    getValue: (d: Projection, idx: number) => number;
  };

  // Asset rows: getters cast everything to Number to avoid string concatenation
  const assetRows: Row[] = [
    {
      label: 'Fixed Assets (W.D.V.)',
      getValue: (d) => Number(d.writtenDownValue) || 0,
    },
    {
      label: 'Current Assets: Debtors',
      getValue: (d) => Number(d.debtorsIncrease) || 0,
    },
    {
      label: 'Current Assets: Stock in Hand',
      getValue: (d) => Number(d.stockIncrease) || 0,
    },
    {
      label: 'Current Assets: Cash & Bank',
      getValue: (d) => Number(d.closingCashBalance) || 0,
    },
    {
      label: 'Current Assets: Subsidy (FD)',
      getValue: (d) => Number(d.subsidyFd) || 0,
    },
  ];

  // Liability rows: include formData.ownerCapital, cast to Number as well
  const liabilityRows: Row[] = [
    {
      label: 'Share Capital',
      getValue: () => Number(formData.ownerCapital) || 0,
    },
    {
      label: 'Reserve & Surplus',
      getValue: (d) => Number(d.reserveAndSurplus) || 0,
    },
    {
      label: 'Term Loan',
      getValue: (d) => Number(d.termLoanIncrease) || 0,
    },
    {
      label: 'Cash Credit',
      getValue: (d) => Number(d.cashCreditIncrease) || 0,
    },
    {
      label: 'Sundry Creditors',
      getValue: (d) => Number(d.creditorsIncrease) || 0,
    },
  ];

  // Helper to sum a getter across all years
  const sumRow = (getter: Row['getValue']) =>
    data.reduce((sum, d, i) => sum + getter(d, i), 0);

  // Grand totals
  const totalAssetsGrand = assetRows.reduce(
    (sum, row) => sum + sumRow(row.getValue),
    0
  );
  const totalLiabGrand = liabilityRows.reduce(
    (sum, row) => sum + sumRow(row.getValue),
    0
  );

  return (
    <section className="mb-6">
      <h2 className="uppercase text-lg font-semibold mb-4">
        9. Projected Balance Sheet
      </h2>
      <table className="border-collapse border border-gray-300 w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">
              Particulars
            </th>
            {data.map((d, i) => (
              <th
                key={`hdr-${i}`}
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
          {/* Asset rows */}
          {assetRows.map((row, rowIdx) => {
            const vals = data.map((d, i) => row.getValue(d, i));
            const total = sumRow(row.getValue);
            return (
              <tr key={`asset-${rowIdx}`}>
                <td className="border border-gray-300 p-2 font-medium">
                  {row.label}
                </td>
                {vals.map((v, colIdx) => (
                  <td
                    key={`asset-${rowIdx}-${colIdx}`}
                    className="border border-gray-300 p-2 text-right"
                  >
                    {fmt(v)}
                  </td>
                ))}
                <td className="border border-gray-300 p-2 text-right font-semibold">
                  {fmt(total)}
                </td>
              </tr>
            );
          })}

          {/* Total Assets */}
          <tr className="font-semibold bg-gray-50">
            <td className="border border-gray-300 p-2">Total Assets</td>
            {data.map((d, colIdx) => {
              const sumYear = assetRows.reduce(
                (s, row) => s + row.getValue(d, colIdx),
                0
              );
              return (
                <td
                  key={`assets-total-${colIdx}`}
                  className="border border-gray-300 p-2 text-right"
                >
                  {fmt(sumYear)}
                </td>
              );
            })}
            <td className="border border-gray-300 p-2 text-right">
              {fmt(totalAssetsGrand)}
            </td>
          </tr>

          {/* Spacer */}
          <tr>
            <td colSpan={data.length + 2} className="p-1"></td>
          </tr>

          {/* Liability & Equity rows */}
          {liabilityRows.map((row, rowIdx) => {
            const vals = data.map((d, i) => row.getValue(d, i));
            const total = sumRow(row.getValue);
            return (
              <tr key={`liab-${rowIdx}`}>
                <td className="border border-gray-300 p-2 font-medium">
                  {row.label}
                </td>
                {vals.map((v, colIdx) => (
                  <td
                    key={`liab-${rowIdx}-${colIdx}`}
                    className="border border-gray-300 p-2 text-right"
                  >
                    {fmt(v)}
                  </td>
                ))}
                <td className="border border-gray-300 p-2 text-right font-semibold">
                  {fmt(total)}
                </td>
              </tr>
            );
          })}

          {/* Total Liabilities & Equity */}
          <tr className="font-semibold bg-gray-50">
            <td className="border border-gray-300 p-2">
              Total Liabilities & Equity
            </td>
            {data.map((d, colIdx) => {
              const sumYear = liabilityRows.reduce(
                (s, row) => s + row.getValue(d, colIdx),
                0
              );
              return (
                <td
                  key={`liab-total-${colIdx}`}
                  className="border border-gray-300 p-2 text-right"
                >
                  {fmt(sumYear)}
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
