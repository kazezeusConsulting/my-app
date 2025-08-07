// src/components/outputs/RepaymentScheduleReport.tsx
import type { FormValues, Projection } from '@/types/formTypes';

type Props = { formData: FormValues; data: Projection[] };

interface ScheduleRow {
  year: number;
  opening: number;
  interest: number;
  principal: number;
  closing: number;
}

export default function RepaymentScheduleReport({ formData, data }: Props) {
  if (!data.length) return null;

  // Build an annual schedule with zero interest
  const rows: ScheduleRow[] = [];
  let opening = formData.termLoanAmount;
  const principalYearly = Math.round(
    formData.termLoanAmount / formData.termLoanTenure
  );

  for (let i = 0; i < formData.termLoanTenure; i++) {
    const year =
      data[i]?.year ??
      new Date(formData.projectStartDate).getFullYear() + i;
    const interest = 0;
    const principal = principalYearly;
    const closing = opening - principal;

    rows.push({ year, opening, interest, principal, closing });
    opening = closing;
  }

  const fmt = (val: number) =>
    '₹' + val.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <section className="mb-6">
      <h2 className="uppercase text-lg font-semibold mb-4">
        14. Repayment Schedule of Term Loan
      </h2>

      <table className="border-collapse border border-gray-300 w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Year</th>
            <th className="border border-gray-300 p-2 text-right">Opening Balance</th>
            <th className="border border-gray-300 p-2 text-right">Interest Pmt</th>
            <th className="border border-gray-300 p-2 text-right">Principal Pmt</th>
            <th className="border border-gray-300 p-2 text-right">Closing Balance</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.year}>
              <td className="border border-gray-300 p-2">{r.year}</td>
              <td className="border border-gray-300 p-2 text-right">{fmt(r.opening)}</td>
              <td className="border border-gray-300 p-2 text-right">
                {r.interest > 0 ? fmt(r.interest) : '-'}
              </td>
              <td className="border border-gray-300 p-2 text-right">{fmt(r.principal)}</td>
              <td className="border border-gray-300 p-2 text-right">{fmt(r.closing)}</td>
            </tr>
          ))}

          <tr className="font-semibold bg-gray-50">
            <td className="border border-gray-300 p-2">Total</td>
            <td className="border border-gray-300 p-2 text-right">
              {fmt(formData.termLoanAmount)}
            </td>
            <td className="border border-gray-300 p-2 text-right">-</td>
            <td className="border border-gray-300 p-2 text-right">
              {fmt(principalYearly * formData.termLoanTenure)}
            </td>
            <td className="border border-gray-300 p-2 text-right">-</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-4 text-sm space-y-1">
        <p>
          <strong>Term Loan:</strong> {fmt(formData.termLoanAmount)}
        </p>
        <p>
          <strong>Interest:</strong>{' '}
          {formData.termLoanInterest > 0
            ? `${formData.termLoanInterest}%`
            : 'Nil'}
        </p>
        <p>
          <strong>Tenure:</strong> {formData.termLoanTenure} years
        </p>
        <p>
          <strong>Door-to-Door:</strong> {formData.termLoanTenure * 12} months
        </p>
        <p>
          <strong>Moratorium:</strong> {formData.termLoanMoratorium} months
        </p>
        <p>
          <strong>Repayment:</strong>{' '}
          {formData.termLoanTenure * 12 - formData.termLoanMoratorium} months
        </p>
      </div>
    </section>
  );
}
