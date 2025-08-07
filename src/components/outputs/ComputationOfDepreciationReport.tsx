// src/components/outputs/ComputationOfDepreciationReport.tsx

import type { Projection } from '@/types/formTypes';

type Props = { data: Projection[] };
// Replace enum with a simple string union
type Format = 'currency' | 'percent';

export default function ComputationOfDepreciationReport({ data }: Props) {
  if (data.length === 0) return null;

  // Formatting helper
  const formatValue = (val: number, fmt: Format) => {
    if (fmt === 'currency') {
      return '₹' + val.toLocaleString('en-IN', { maximumFractionDigits: 0 });
    }
    // Percent format
    return (
      val.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + '%'
    );
  };

  // Rows definition: label, key in Projection, format
  const rows: {
    label: string;
    key: keyof Projection;
    format: Format;
  }[] = [
    {
      label: 'Rate of Depreciation (%)',
      key: 'rateOfDepreciation',
      format: 'percent',
    },
    { label: 'Addition', key: 'addition', format: 'currency' },
    { label: 'Less: Depreciation', key: 'depreciation', format: 'currency' },
    {
      label: 'Written-Down Value',
      key: 'writtenDownValue',
      format: 'currency',
    },
  ];

  return (
    <section className="mb-6">
      <h2 className="uppercase text-lg font-semibold mb-4">
        13. Computation of Depreciation
      </h2>

      <table className="border-collapse border border-gray-300 w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Particulars</th>
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
          {rows.map(({ label, key, format }) => {
            // sum across all years for this row, robustly as numbers
            const total = data.reduce((sum, d) => {
              const val = typeof d[key] === 'number' ? d[key] : Number(d[key] ?? 0);
              return sum + (isNaN(val) ? 0 : val);
            }, 0);
            return (
              <tr key={key as string}>
                <td className="border border-gray-300 p-2 font-medium">
                  {label}
                </td>
                {data.map((d) => (
                  <td
                    key={`${key as string}-${d.year}`}
                    className="border border-gray-300 p-2 text-right"
                  >
                    {formatValue(d[key] ?? 0, format)}
                  </td>
                ))}
                <td className="border border-gray-300 p-2 text-right font-semibold">
                  {formatValue(total, format)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
