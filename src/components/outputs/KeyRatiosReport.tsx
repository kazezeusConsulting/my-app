// src/components/outputs/KeyRatiosReport.tsx
import type { Projection } from '@/types/formTypes';

type Props = { data: Projection[] };

export default function KeyRatiosReport({ data }: Props) {
  if (data.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="uppercase text-lg font-semibold mb-4">6. Key Ratios</h2>
      <table className="border-collapse border border-gray-300 w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Particulars</th>
            {data.map((yearData) => (
              <th key={yearData.year} className="border border-gray-300 p-2 text-center">
                {yearData.year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2">Current Ratio</td>
            {data.map((yearData) => (
              <td key={`cr-${yearData.year}`} className="border border-gray-300 p-2 text-right">
                {yearData.currentRatio.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            ))}
          </tr>
          <tr>
            <td className="border border-gray-300 p-2">TOL/TNW</td>
            {data.map((yearData) => (
              <td key={`tol-${yearData.year}`} className="border border-gray-300 p-2 text-right">
                {yearData.tolToTnw.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </section>
  );
}
