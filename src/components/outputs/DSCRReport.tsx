// src/components/outputs/DSCRReport.tsx
import type { FormValues, Projection } from '@/types/formTypes';

type Props = {
  formData: FormValues;
  data: Projection[];
};

export default function DSCRReport({ formData, data }: Props) {
  if (!data.length) return null;

  // Build term-loan schedule to get installment & interest per year
  interface ScheduleRow {
    year: number;
    principal: number;
    interest: number;
  }
  const schedule: ScheduleRow[] = [];
  let opening = formData.termLoanAmount;
  const tenure = formData.termLoanTenure;
  const annualPrincipal = Math.round(formData.termLoanAmount / tenure);

  for (let i = 0; i < tenure; i++) {
    const year =
      data[i]?.year ??
      new Date(formData.projectStartDate).getFullYear() + i;
    const interestExpense = Math.round(
      opening * (formData.termLoanInterest / 100)
    );
    schedule.push({
      year,
      principal: annualPrincipal,
      interest: interestExpense,
    });
    opening -= annualPrincipal;
  }

  // Compute per-year metrics
  const cashAccruals = data.map((d) => d.netProfit + d.depreciation);
  const interestPmts = schedule.map((r) => r.interest);
  const principalPmts = schedule.map((r) => r.principal);
  const totalSources = cashAccruals.map((ca, i) => ca + interestPmts[i]);
  const totalRepayments = principalPmts.map(
    (p, i) => p + interestPmts[i]
  );
  const dscrValues = data.map((d, i) => {
    const debtService = principalPmts[i] + interestPmts[i];
    return debtService > 0 ? (d.netProfit + d.depreciation) / debtService : 0;
  });

  const avgDscr =
    dscrValues.reduce((sum, v) => sum + v, 0) / dscrValues.length;

  // Formatting helpers
  const fmtAmt = (n: number) =>
    '₹' +
    n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  const fmtRatio = (r: number) =>
    r > 0
      ? r.toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : '-';

  // Totals
  const totalCashAccruals = cashAccruals.reduce((a, b) => a + b, 0);
  const totalInterestPmts = interestPmts.reduce((a, b) => a + b, 0);
  const totalSourcesAll = totalSources.reduce((a, b) => a + b, 0);
  const totalPrincipalPmts = principalPmts.reduce((a, b) => a + b, 0);
  const totalRepaymentsAll = totalRepayments.reduce((a, b) => a + b, 0);

  return (
    <section className="mb-6">
      <h2 className="uppercase text-lg font-semibold mb-4">
        15. Calculation of D.S.C.R.
      </h2>

      <table className="border-collapse border border-gray-300 w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">
              Particulars
            </th>
            {data.map((d) => (
              <th
                key={d.year}
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
          {/* Cash Accruals */}
          <tr>
            <td className="border border-gray-300 p-2">Cash Accruals</td>
            {cashAccruals.map((amt, i) => (
              <td
                key={`ca-${data[i].year}`}
                className="border border-gray-300 p-2 text-right"
              >
                {fmtAmt(amt)}
              </td>
            ))}
            <td className="border border-gray-300 p-2 text-right font-semibold">
              {fmtAmt(totalCashAccruals)}
            </td>
          </tr>

          {/* Interest Payments */}
          <tr>
            <td className="border border-gray-300 p-2">Interest Pmt</td>
            {interestPmts.map((amt, i) => (
              <td
                key={`int-${schedule[i].year}`}
                className="border border-gray-300 p-2 text-right"
              >
                {amt > 0 ? fmtAmt(amt) : '-'}
              </td>
            ))}
            <td className="border border-gray-300 p-2 text-right font-semibold">
              {fmtAmt(totalInterestPmts)}
            </td>
          </tr>

          {/* Total Sources */}
          <tr className="font-semibold">
            <td className="border border-gray-300 p-2">Total (Sources)</td>
            {totalSources.map((amt, i) => (
              <td
                key={`src-${data[i].year}`}
                className="border border-gray-300 p-2 text-right"
              >
                {fmtAmt(amt)}
              </td>
            ))}
            <td className="border border-gray-300 p-2 text-right font-semibold">
              {fmtAmt(totalSourcesAll)}
            </td>
          </tr>

          {/* Principal Payments */}
          <tr>
            <td className="border border-gray-300 p-2">
              Repayment Instalment
            </td>
            {principalPmts.map((amt, i) => (
              <td
                key={`inst-${schedule[i].year}`}
                className="border border-gray-300 p-2 text-right"
              >
                {fmtAmt(amt)}
              </td>
            ))}
            <td className="border border-gray-300 p-2 text-right font-semibold">
              {fmtAmt(totalPrincipalPmts)}
            </td>
          </tr>

          {/* Total Repayments */}
          <tr className="font-semibold">
            <td className="border border-gray-300 p-2">
              Total (Repayment)
            </td>
            {totalRepayments.map((amt, i) => (
              <td
                key={`rep-${schedule[i]?.year ?? i}`}
                className="border border-gray-300 p-2 text-right"
              >
                {fmtAmt(amt)}
              </td>
            ))}
            <td className="border border-gray-300 p-2 text-right font-semibold">
              {fmtAmt(totalRepaymentsAll)}
            </td>
          </tr>

          {/* D.S.C.R. */}
          <tr>
            <td className="border border-gray-300 p-2">D.S.C.R.</td>
            {dscrValues.map((v, i) => (
              <td
                key={`dscr-${data[i].year}`}
                className="border border-gray-300 p-2 text-right"
              >
                {fmtRatio(v)}
              </td>
            ))}
            <td className="border border-gray-300 p-2 text-right font-semibold">
              {fmtRatio(avgDscr)}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
