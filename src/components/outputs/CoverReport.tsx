// src/components/outputs/CoverReport.tsx
import type { FormValues } from '@/types/formTypes';

type Props = { formData: FormValues };

export default function CoverReport({ formData }: Props) {
  return (
    <section className="mb-6">
      <h1 className="text-center text-2xl font-bold mb-4 uppercase">Financial Projection Report</h1>
      <table className="border-collapse border border-gray-300 w-full text-sm">
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2 font-semibold">Name of Project</td>
            <td className="border border-gray-300 p-2">{formData.businessName}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-semibold">Constitution</td>
            <td className="border border-gray-300 p-2">{formData.constitutionType}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-semibold">Name of Proprietor</td>
            <td className="border border-gray-300 p-2">{formData.clientName}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-semibold">Category</td>
            <td className="border border-gray-300 p-2">{formData.industryType}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-semibold">Mobile</td>
            <td className="border border-gray-300 p-2">{formData.mobile}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-semibold">Email ID</td>
            <td className="border border-gray-300 p-2">{formData.email}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-semibold">Location of Project</td>
            <td className="border border-gray-300 p-2">{formData.address}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-semibold">Type of Project</td>
            <td className="border border-gray-300 p-2">{formData.schemeName}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-semibold">Employment</td>
            <td className="border border-gray-300 p-2">{formData.employmentGenerated}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-semibold">Term Loan</td>
            <td className="border border-gray-300 p-2">
              ₹{formData.termLoanAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-semibold">Working Capital Loan</td>
            <td className="border border-gray-300 p-2">
              ₹{formData.wcLoanAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
