import SectionHeader from '@/components/common/SectionHeader';
import ReportCard from '@/components/common/ReportCard';
import KPI from '@/components/common/KPI';
import CoverReport from '@/components/outputs/CoverReport';
import CostOfProjectReport from '@/components/outputs/CostOfProjectReport';
import MeansOfFinanceReport from '@/components/outputs/MeansOfFinanceReport';
import CapitalSubsidyReport from '@/components/outputs/CapitalSubsidyReport';
import ProjectedCashFlowReport from '@/components/outputs/ProjectedCashFlowReport';
import KeyRatiosReport from '@/components/outputs/KeyRatiosReport';
import ProjectedBalanceSheetReport from '@/components/outputs/ProjectedBalanceSheetReport';
import ProjectedProfitabilityReport from '@/components/outputs/ProjectedProfitabilityReport';
import ComputationOfProductionReport from '@/components/outputs/ComputationOfProductionReport';
import ComputationOfWorkingCapitalRequirementReport from '@/components/outputs/ComputationOfWorkingCapitalRequirementReport';
import ComputationOfDepreciationReport from '@/components/outputs/ComputationOfDepreciationReport';
import RepaymentScheduleReport from '@/components/outputs/RepaymentScheduleReport';
import DSCRReport from '@/components/outputs/DSCRReport';
import { exportToPdf } from '@/components/PdfExporter';
import type { FormValues, Projection } from '@/types/formTypes';
import { formatCurrency, formatNumber } from '@/utils/format';

interface ReportOutputProps {
  formData: FormValues;
  results: Projection[];
}

export default function ReportOutput({ formData, results }: ReportOutputProps) {
  const first = results[0];
  const kpis = [
    { label: 'Revenue', value: formatCurrency(first.revenue) },
    { label: 'Net Profit', value: formatCurrency(first.netProfit) },
    { label: 'DSCR', value: formatNumber(first.dscr) },
    { label: 'Current Ratio', value: formatNumber(first.currentRatio) },
  ];

  return (
    <div id="report" className="space-y-6">
      <SectionHeader title="Report Preview" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <KPI key={k.label} label={k.label} value={k.value} />
        ))}
      </div>

      <ReportCard title="Cover" description="Basic project details">
        <CoverReport formData={formData} />
      </ReportCard>

      <ReportCard title="Cost of Project" description="Breakdown of project costs">
        <CostOfProjectReport formData={formData} />
      </ReportCard>

      <ReportCard title="Means of Finance" description="Funding structure">
        <MeansOfFinanceReport formData={formData} />
        <CapitalSubsidyReport formData={formData} />
      </ReportCard>

      <ReportCard title="Projected Cash Flow" description="Yearly cash flow projections">
        <ProjectedCashFlowReport formData={formData} data={results} />
      </ReportCard>

      <ReportCard title="Key Ratios" description="Financial ratios summary">
        <KeyRatiosReport data={results} />
      </ReportCard>

      <ReportCard title="Balance Sheet" description="Projected balance sheet">
        <ProjectedBalanceSheetReport formData={formData} data={results} />
      </ReportCard>

      <ReportCard title="Profitability" description="Projected profit and loss">
        <ProjectedProfitabilityReport data={results} />
      </ReportCard>

      <ReportCard title="Production" description="Computation of production">
        <ComputationOfProductionReport formData={formData} data={results} />
      </ReportCard>

      <ReportCard title="Working Capital Requirement" description="Computation of working capital requirement">
        <ComputationOfWorkingCapitalRequirementReport formData={formData} data={results} />
      </ReportCard>

      <ReportCard title="Depreciation" description="Computation of depreciation">
        <ComputationOfDepreciationReport data={results} />
      </ReportCard>

      <ReportCard title="Repayment Schedule" description="Loan repayment schedule">
        <RepaymentScheduleReport formData={formData} data={results} />
      </ReportCard>

      <ReportCard title="DSCR" description="Debt service coverage ratio">
        <DSCRReport formData={formData} data={results} />
      </ReportCard>

      <button
        onClick={exportToPdf}
        className="mt-6 inline-block border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white"
      >
        Download PDF
      </button>
    </div>
  );
}
