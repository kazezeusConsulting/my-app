// src/components/outputs/CapitalSubsidyReport.tsx
import type { FormValues } from '@/types/formTypes';

type Props = { formData: FormValues };

export default function CapitalSubsidyReport({ formData }: Props) {
  // Ensure all values are numbers
  const machineryEquipment = parseInt(formData.machineryEquipment as any) || 0;
  const furnitureFixtures = parseInt(formData.furnitureFixtures as any) || 0;
  const otherFixedAssets = parseInt(formData.otherFixedAssets as any) || 0;
  const preOpExpenses = parseInt(formData.preOpExpenses as any) || 0;
  const workingCapitalRequirement = parseInt(formData.workingCapitalRequirement as any) || 0;
  const capitalSubsidyPercent = parseInt(formData.capitalSubsidyPercent as any) || 0;
  const totalCost =
    machineryEquipment +
    furnitureFixtures +
    otherFixedAssets +
    preOpExpenses +
    workingCapitalRequirement;
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
