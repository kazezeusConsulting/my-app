// src/components/outputs/ComputationOfProductionReport.tsx
import type { FormValues, Projection } from '@/types/formTypes';

type Props = {
  formData: FormValues;
  data: Projection[];
};

type RowFormat = 'number' | 'currency' | 'percent';

// extended keys for formData
type ExtendedKey = 'workingHours' | 'workingDays';
type Key = keyof Projection | ExtendedKey;

export default function ComputationOfProductionReport({ formData, data }: Props) {
  if (!data.length) return null;

  // formatting helper
  const formatValue = (val: number, fmt: RowFormat) => {
    switch (fmt) {
      case 'currency':
        return '₹' + val.toLocaleString('en-IN', { maximumFractionDigits: 0 });
      case 'percent':
        return (
          val
            .toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) + '%'
        );
      default:
        return val.toLocaleString('en-IN', { maximumFractionDigits: 0 });
    }
  };

  // define rows: label, key to pull, format, whether to total
  const rows: {
    label: string;
    key: Key;
    format: RowFormat;
    showTotal: boolean;
  }[] = [
    {
      label: 'Working Hours per Day',
      key: 'workingHours',
      format: 'number',
      showTotal: false,
    },
    {
      label: 'Working Days per Year',
      key: 'workingDays',
      format: 'number',
      showTotal: false,
    },
    {
      label: 'Opening Stock (₹)',
      key: 'openingStock',
      format: 'currency',
      showTotal: false,
    },
    {
      label: 'Less: Closing Stock (₹)',
      key: 'closingStock',
      format: 'currency',
      showTotal: false,
    },
    {
      label: 'Gross Sale (₹)',
      key: 'grossSale',
      format: 'currency',
      showTotal: true,
    },
  ];

  return (
    <section className="mb-6">
      <h2 className="uppercase text-lg font-semibold mb-4">
        9. Computation of Production
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
          {rows.map(({ label, key, format, showTotal }) => {
            // build per-year values for this row
            const values = data.map((d) => {
              if (key === 'workingHours') return formData.workingHours;
              if (key === 'workingDays') return formData.workingDays;
              // otherwise pull from projection
              return (d[key as keyof Projection] ?? 0) as number;
            });

            // compute total if needed
            const total = showTotal
              ? values.reduce((sum, v) => sum + v, 0)
              : 0;

            return (
              <tr key={key}>
                <td className="border border-gray-300 p-2 font-medium">
                  {label}
                </td>
                {values.map((v, idx) => (
                  <td
                    key={`${key}-${idx}`}
                    className="border border-gray-300 p-2 text-right"
                  >
                    {formatValue(v, format)}
                  </td>
                ))}
                <td className="border border-gray-300 p-2 text-right font-semibold">
                  {showTotal ? formatValue(total, format) : '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
