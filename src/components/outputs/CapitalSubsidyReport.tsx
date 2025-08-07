// src/components/outputs/CapitalSubsidyReport.tsx
import type { FormValues } from '@/types/formTypes';

type Props = { formData: FormValues };

export default function CapitalSubsidyReport({ formData }: Props) {
  const capitalSubsidyPercent = Number(formData.capitalSubsidyPercent) || 0;
  const totalCost = (formData.costItems || []).reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );
  const subsidyAmount = (totalCost * capitalSubsidyPercent) / 100;

  return (
    <section className="mb-6">
      <h2 className="uppercase text-lg font-semibold mb-4">4. Capital Subsidy</h2>
      <table className="border-collapse border border-gray-300 w-full text-sm">
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2 font-semibold">Subsidy Rate</td>
            <td className="border border-gray-300 p-2 text-right">{formData.capitalSubsidyPercent}%</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-semibold">Subsidy Amount</td>
            <td className="border border-gray-300 p-2 text-right">
              ₹{subsidyAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-semibold">Scheme</td>
            <td className="border border-gray-300 p-2 text-right">{formData.schemeName} Scheme</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
