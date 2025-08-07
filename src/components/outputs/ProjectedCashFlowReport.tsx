// src/components/outputs/ProjectedCashFlowReport.tsx

import type { FormValues, Projection } from '@/types/formTypes';

type Props = {
  formData: FormValues;
  data: Projection[];
};

export default function ProjectedCashFlowReport({ formData, data }: Props) {
  if (!data.length) return null;

  // ₹ formatter, rounds to integer
  const fmt = (n: number) =>
    '₹' + Math.round(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  // —— SOURCES OF FUNDS —— 
  type SourceRow = {
    label: string;
    getValue: (d: Projection, idx: number) => number;
  };
  const sourceRows: SourceRow[] = [
    {
      label: 'Capital Account',
      // cumulative equity = ownerCapital (year 0) + sum(netProfit − drawings)
      getValue: (d, idx) =>
        (d.reserveAndSurplus || 0) + (idx === 0 ? Number(formData.ownerCapital) : 0),
    },
    {
      label: 'Add: Addition',
      getValue: (d) => d.fixedAssetAddition || 0,
    },
    {
      label: 'Add: Net Profit',
      getValue: (d) => d.netProfit || 0,
    },
    {
      label: 'Less: Drawings',
      getValue: (d) => d.drawings || 0,
    },
    {
      label: 'Capital Subsidy',
      getValue: (d) => d.subsidyOutstanding || 0,
    },
    {
      label: 'Term Loan',
      getValue: (d) => d.termLoanOutstanding || 0,
    },
    {
      label: 'Cash Credit',
      getValue: (d) => d.cashCreditOutstanding || 0,
    },
    {
      label: 'Sundry Creditors',
      getValue: (d) => d.creditorsOutstanding || 0,
    },
  ];

  // —— APPLICATION OF FUNDS —— 
  type AppRow = {
    label: string;
    getValue: (d: Projection) => number;
  };
  const appRows: AppRow[] = [
    { label: 'Fixed Assets', getValue: (d) => d.fixedAssetAddition || 0 },
    { label: 'Less: Depreciation', getValue: (d) => d.depreciation || 0 },
    { label: 'Net Fixed Assets', getValue: (d) => d.writtenDownValue || 0 },
    { label: 'Current Assets: Debtors', getValue: (d) => d.closingDebtors || 0 },
    { label: 'Current Assets: Stock in Hand', getValue: (d) => d.closingStock || 0 },
    { label: 'Current Assets: Cash & Bank', getValue: (d) => d.closingCashBalance || 0 },
    { label: 'Current Assets: Subsidy (FD)', getValue: (d) => d.subsidyOutstanding || 0 },
  ];

  // build matrix of values
  const sourceValues = sourceRows.map(r => data.map((d, i) => r.getValue(d, i)));
  const appValues    = appRows   .map(r => data.map(d => r.getValue(d)));

  // row totals
  const sourceRowTotals = sourceValues.map(vals => vals.reduce((s, v) => s + v, 0));
  const appRowTotals    =    appValues.map(vals => vals.reduce((s, v) => s + v, 0));

  // column totals (per year)
  const sourceColTotals = data.map((_, col) =>
    sourceValues.reduce((sum, vals) => sum + vals[col], 0)
  );
  const appColTotals = data.map((_, col) =>
    appValues.reduce((sum, vals) => sum + vals[col], 0)
  );

  // grand totals
  const sourceGrand = sourceRowTotals.reduce((s, v) => s + v, 0);
  const appGrand    =    appRowTotals.reduce((s, v) => s + v, 0);

  return (
    <section className="mb-6">
      <h2 className="uppercase text-lg font-semibold mb-4">
        Projected Cash Flow Statement
      </h2>

      {/* Sources of Funds */}
      <h3 className="uppercase text-sm font-semibold mt-4 mb-2">Sources of Funds</h3>
      <table className="w-full border-collapse border border-gray-300 text-sm mb-6">
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
          {sourceRows.map((row, rIdx) => (
            <tr key={rIdx}>
              <td className="border border-gray-300 p-2">{row.label}</td>
              {sourceValues[rIdx].map((amt, cIdx) => (
                <td key={cIdx} className="border border-gray-300 p-2 text-right">
                  {fmt(amt)}
                </td>
              ))}
              <td className="border border-gray-300 p-2 text-right font-semibold">
                {fmt(sourceRowTotals[rIdx])}
              </td>
            </tr>
          ))}

          {/* Sources TOTAL */}
          <tr className="font-semibold bg-gray-50">
            <td className="border border-gray-300 p-2">TOTAL</td>
            {sourceColTotals.map((colTot, idx) => (
              <td key={idx} className="border border-gray-300 p-2 text-right">
                {fmt(colTot)}
              </td>
            ))}
            <td className="border border-gray-300 p-2 text-right">
              {fmt(sourceGrand)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Application of Funds */}
      <h3 className="uppercase text-sm font-semibold mt-4 mb-2">Application of Funds</h3>
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
          {appRows.map((row, rIdx) => (
            <tr key={rIdx}>
              <td className="border border-gray-300 p-2">{row.label}</td>
              {appValues[rIdx].map((amt, cIdx) => (
                <td key={cIdx} className="border border-gray-300 p-2 text-right">
                  {fmt(amt)}
                </td>
              ))}
              <td className="border border-gray-300 p-2 text-right font-semibold">
                {fmt(appRowTotals[rIdx])}
              </td>
            </tr>
          ))}

          {/* Application TOTAL */}
          <tr className="font-semibold bg-gray-50">
            <td className="border border-gray-300 p-2">TOTAL</td>
            {appColTotals.map((colTot, idx) => (
              <td key={idx} className="border border-gray-300 p-2 text-right">
                {fmt(colTot)}
              </td>
            ))}
            <td className="border border-gray-300 p-2 text-right">
              {fmt(appGrand)}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
