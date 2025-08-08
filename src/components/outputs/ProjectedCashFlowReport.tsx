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
      label: 'Capital',
      getValue: (_d, idx) => (idx === 0 ? Number(formData.ownerCapital) : 0),
    },
    { label: 'Reserve & Surplus', getValue: (d) => d.reserveAndSurplus || 0 },
    {
      label: 'Depreciation & Exp. W/off',
      getValue: (d) => d.depreciationAndExpOff || 0,
    },
    {
      label: 'Increase in Cash Credit',
      getValue: (d) => d.cashCreditIncrease || 0,
    },
    {
      label: 'Increase in Term Loan (New)',
      getValue: (d) => d.termLoanIncrease || 0,
    },
    {
      label: 'Increase in Subsidy',
      getValue: (d) => d.subsidyIncrease || 0,
    },
    {
      label: 'Increase in Creditors',
      getValue: (d) => d.creditorsIncrease || 0,
    },
  ];

  // —— APPLICATION OF FUNDS —— 
  type AppRow = {
    label: string;
    getValue: (d: Projection) => number;
  };
  const appRows: AppRow[] = [
    {
      label: 'Increase in Fixed Assets',
      getValue: (d) => d.fixedAssetAddition || 0,
    },
    { label: 'Increase in Stock', getValue: (d) => d.stockIncrease || 0 },
    {
      label: 'Repayment of Term Loan (New)',
      getValue: (d) => d.loanRepayment || 0,
    },
    {
      label: 'Increase in Subsidy (FD)',
      getValue: (d) => d.subsidyFd || 0,
    },
    { label: 'Drawings', getValue: (d) => d.drawings || 0 },
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
        5. Projected Cash Flow Statement
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

      {/* Closing Cash Summary */}
      <h3 className="uppercase text-sm font-semibold mt-4 mb-2">Cash & Bank Balance</h3>
      <table className="w-full border-collapse border border-gray-300 text-sm mt-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Particulars</th>
            {data.map((d, i) => (
              <th key={i} className="border border-gray-300 p-2 text-center">
                {d.year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2">Opening Cash &amp; Bank Balance</td>
            {data.map((d, i) => (
              <td key={i} className="border border-gray-300 p-2 text-right">
                {fmt(d.openingCashBalance || 0)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="border border-gray-300 p-2">Add : Surplus</td>
            {data.map((d, i) => (
              <td key={i} className="border border-gray-300 p-2 text-right">
                {fmt(d.surplus || 0)}
              </td>
            ))}
          </tr>
          <tr className="font-semibold bg-gray-50">
            <td className="border border-gray-300 p-2">Closing Cash &amp; Bank Balance</td>
            {data.map((d, i) => (
              <td key={i} className="border border-gray-300 p-2 text-right">
                {fmt(d.closingCashBalance || 0)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </section>
  );
}
