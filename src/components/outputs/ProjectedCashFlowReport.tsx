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

  // —— SOURCES OF FUND —— 
  type SourceRow = {
    label: string;
    getValue: (d: Projection, idx: number) => number;
  };
  const sourceRows: SourceRow[] = [
    {
      label: 'Capital Account',
      // only in Year 1 is capital drawn; subsequent years zero
      getValue: (_d, idx) =>
        idx === 0 ? Number(formData.ownerCapital) || 0 : 0,
    },
    { label: 'Add: Addition',    getValue: (d) => Number(d.addition)       || 0 },
    { label: 'Add: Net Profit',  getValue: (d) => Number(d.netProfit)     || 0 },
    { label: 'Less: Drawings',   getValue: (d) => Number(d.drawings)      || 0 },
    { label: 'Capital Subsidy',  getValue: (d) => Number(d.subsidyIncrease) || 0 },
    { label: 'Term Loan',        getValue: (d) => Number(d.termLoanIncrease)|| 0 },
    { label: 'Cash Credit',      getValue: (d) => Number(d.cashCreditIncrease)|| 0 },
    { label: 'Sundry Creditors', getValue: (d) => Number(d.creditorsIncrease)|| 0 },
  ];

  // —— APPLICATION OF FUND —— 
  type AppRow = {
    label: string;
    getValue: (d: Projection) => number;
  };
  const appRows: AppRow[] = [
    { label: 'Fixed Assets',            getValue: (d) => Number(d.fixedAssetAddition) || 0 },
    { label: 'Less: Depreciation',      getValue: (d) => Number(d.depreciation)        || 0 },
    { label: 'Net Fixed Assets',        getValue: (d) => Number(d.writtenDownValue)  || 0 },
    { label: 'Current Assets: Debtors', getValue: (d) => Number(d.debtorsIncrease)    || 0 },
    { label: 'Current Assets: Stock in Hand', getValue: (d) => Number(d.stockIncrease)  || 0 },
    { label: 'Current Assets: Cash & Bank',   getValue: (d) => Number(d.closingCashBalance) || 0 },
    { label: 'Current Assets: Subsidy (FD)',  getValue: (d) => Number(d.subsidyFd)      || 0 },
  ];

  // Build matrices of values
  const sourceValues   = sourceRows.map(r => data.map((d,i) => r.getValue(d,i)));
  const appValues      = appRows   .map(r => data.map(d => r.getValue(d)));

  // Row totals
  const sourceRowTotals = sourceValues.map(vals => vals.reduce((s,v) => s+v, 0));
  const appRowTotals    =     appValues.map(vals => vals.reduce((s,v) => s+v, 0));

  // Column totals (per year)
  const sourceColTotals = data.map((_, col) => 
    sourceValues.reduce((sum, vals) => sum + vals[col], 0)
  );
  const appColTotals    = data.map((_, col) => 
    appValues   .reduce((sum, vals) => sum + vals[col], 0)
  );

  // Grand totals
  const sourceGrand = sourceRowTotals.reduce((s,v) => s+v, 0);
  const appGrand    =    appRowTotals.reduce((s,v) => s+v, 0);

  return (
    <section className="mb-6">
      <h2 className="uppercase text-lg font-semibold mb-4">
        7. Projected Cash Flow Statement
      </h2>

      {/* Sources of Fund */}
      <h3 className="uppercase text-sm font-semibold mt-4 mb-2">
        Sources of Fund
      </h3>
      <table className="border-collapse border border-gray-300 w-full text-sm mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Particulars</th>
            {data.map(d => (
              <th
                key={`src-hdr-${d.year}`}
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
          {sourceRows.map((row, rIdx) => (
            <tr key={`src-row-${rIdx}`}>
              <td className="border border-gray-300 p-2">{row.label}</td>
              {sourceValues[rIdx].map((amt, cIdx) => (
                <td
                  key={`src-${rIdx}-${cIdx}`}
                  className="border border-gray-300 p-2 text-right"
                >
                  {fmt(amt)}
                </td>
              ))}
              <td className="border border-gray-300 p-2 text-right font-semibold">
                {fmt(sourceRowTotals[rIdx])}
              </td>
            </tr>
          ))}

          {/* Sources TOTAL row */}
          <tr className="font-semibold bg-gray-50">
            <td className="border border-gray-300 p-2">TOTAL</td>
            {sourceColTotals.map((colTot, idx) => (
              <td
                key={`src-total-${idx}`}
                className="border border-gray-300 p-2 text-right"
              >
                {fmt(colTot)}
              </td>
            ))}
            <td className="border border-gray-300 p-2 text-right">
              {fmt(sourceGrand)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Application of Fund */}
      <h3 className="uppercase text-sm font-semibold mt-4 mb-2">
        Application of Fund
      </h3>
      <table className="border-collapse border border-gray-300 w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Particulars</th>
            {data.map(d => (
              <th
                key={`app-hdr-${d.year}`}
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
          {appRows.map((row, rIdx) => (
            <tr key={`app-row-${rIdx}`}>
              <td className="border border-gray-300 p-2">{row.label}</td>
              {appValues[rIdx].map((amt, cIdx) => (
                <td
                  key={`app-${rIdx}-${cIdx}`}
                  className="border border-gray-300 p-2 text-right"
                >
                  {fmt(amt)}
                </td>
              ))}
              <td className="border border-gray-300 p-2 text-right font-semibold">
                {fmt(appRowTotals[rIdx])}
              </td>
            </tr>
          ))}

          {/* Application TOTAL row */}
          <tr className="font-semibold bg-gray-50">
            <td className="border border-gray-300 p-2">TOTAL</td>
            {appColTotals.map((colTot, idx) => (
              <td
                key={`app-total-${idx}`}
                className="border border-gray-300 p-2 text-right"
              >
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
