// src/components/outputs/MeansOfFinanceReport.tsx
import type { FormValues } from '@/types/formTypes';

type Props = { formData: FormValues };

export default function MeansOfFinanceReport({ formData }: Props) {
  // Ensure all values are numbers
  const totalInternal = Number(formData.ownerCapital) || 0;
  const totalTermLoan = Number(formData.termLoanAmount) || 0;
  const totalWC = Number(formData.wcLoanAmount) || 0;
  const grandTotal = totalInternal + totalTermLoan + totalWC;

  // Helper for ₹ formatting
  const fmt = (n: number) =>
    '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <section className="mb-6">
      <h2 className="uppercase text-lg font-semibold mb-4">
        3. Means of Finance
      </h2>
      <table className="border-collapse border border-gray-300 w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">
              Particulars
            </th>
            <th className="border border-gray-300 p-2 text-right">
              Amount (₹)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2">
              Capital / Internal Accruals
            </td>
            <td className="border border-gray-300 p-2 text-right">
              {fmt(totalInternal)}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2">Term Loan</td>
            <td className="border border-gray-300 p-2 text-right">
              {fmt(totalTermLoan)}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2">
              Working Capital Loan
            </td>
            <td className="border border-gray-300 p-2 text-right">
              {fmt(totalWC)}
            </td>
          </tr>
          <tr className="font-semibold bg-gray-50">
            <td className="border border-gray-300 p-2">Total</td>
            <td className="border border-gray-300 p-2 text-right">
              {fmt(grandTotal)}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
