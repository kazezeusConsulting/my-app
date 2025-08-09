// src/pages/ReportBuilder.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Form } from '@/components/ui/form';
import type { FormValues, Projection } from '@/types/formTypes';
import calculateProjections from '@/utils/calculateProjections';
import { formatCurrency, formatNumber } from '@/utils/format';

import BusinessDetails from '@/components/form-sections/BusinessDetails';
import ProjectTimeline from '@/components/form-sections/ProjectTimeline';
import CostOfProject from '@/components/form-sections/CostOfProject';
import FundingLoans from '@/components/form-sections/FundingLoans';
import SalesRevenue from '@/components/form-sections/SalesRevenue';
import ExpenseAssumptions from '@/components/form-sections/ExpenseAssumptions';
import WorkingCapital from '@/components/form-sections/WorkingCapital';
import LedgerCashflow from '@/components/form-sections/LedgerCashflow';

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

import ReportCard from '@/components/common/ReportCard';
import KPI from '@/components/common/KPI';
import SectionHeader from '@/components/common/SectionHeader';

import { exportToPdf } from '@/components/PdfExporter';
import { useToast } from '@/components/feedback/Toaster';

export default function ReportBuilder() {
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [results, setResults] = useState<Projection[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const { getToken } = useAuth();
  const { user } = useUser();
  const { notify } = useToast();

  const defaultSpan = 5;
  const form = useForm<FormValues>({
    defaultValues: {
      // Business Details
      businessName: '',
      constitutionType: '',
      ownerName: '',
      mobile: '',
      email: '',
      address: '',
      projectType: '',
      industryType: '',
      schemeName: '',
      employmentGenerated: 0,
      description: '',

      // Project Timeline
      projectStartDate: new Date().toISOString().slice(0, 10),
      projectionSpan: defaultSpan,
      emiFrequency: 'Monthly',

      // Cost of Project
      costItems: [
        { type: 'Machinery & Equipment', marginPercent: 0, amount: 0, depreciationRate: 0 },
        { type: 'Furniture / Fixtures', marginPercent: 0, amount: 0, depreciationRate: 0 },
        { type: 'Other Fixed Assets', marginPercent: 0, amount: 0, depreciationRate: 0 },
        { type: 'Pre-operating Expenses', marginPercent: 0, amount: 0, depreciationRate: 0 },
        { type: 'Working Capital Requirement', marginPercent: 15, amount: 0, depreciationRate: 0 },
      ],

      // Funding / Loans
      ownerCapital: 0,
      termLoanAmount: 0,
      termLoanInterest: 0,
      termLoanTenure: 0,
      termLoanMoratorium: 0,
      wcLoanAmount: 0,
      wcLoanInterest: 0,
      capitalSubsidyToggle: false,
      capitalSubsidyPercent: 0,
      capitalSubsidyAmount: 0,
      loanProcessingFeePercent: 0,

      // Sales & Revenue
      products: [{ name: '', unitPrice: 0, quantity: 0, unit: '' }],
      annualGrowthRate: 10,
      priceInflation: 5,
      workingDays: 300,
      workingHours: 8,

      // Expense Assumptions
      rawMaterialMonthly: 0,
      wagesLabourMonthly: 0,
      electricityMonthly: 0,
      otherOverheadsMonthly: 0,
      outwardFreightMonthly: 0,
      inwardFreightMonthly: 0,
      adminExpensesMonthly: 0,

      // Working Capital
      inventoryDays: 30,
      debtorDays: 60,
      creditorDays: 30,
      advanceFromCustomersPercent: 0,

      // Ledger / Cashflow
      openingBankBalance: 0,
      openingInventory: 0,
      openingDebtors: 0,
      openingCreditors: 0,
      monthlyDrawings: 0,
      taxPercentage: 18,
      carryForwardEarnings: false,
    },
  });

  const sections = [
    <BusinessDetails control={form.control} />, // 0
    <ProjectTimeline control={form.control} />, // 1
    <CostOfProject control={form.control} />, // 2
    <FundingLoans control={form.control} />, // 3
    <SalesRevenue control={form.control} />, // 4
    <ExpenseAssumptions control={form.control} />, // 5
    <WorkingCapital control={form.control} />, // 6
    <LedgerCashflow control={form.control} />, // 7
  ];

  const handleNext = () => setCurrentStep((s) => Math.min(s + 1, sections.length - 1));
  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 0));
  const handleNewReport = () => {
    form.reset();
    setFormData(null);
    setResults([]);
    setCurrentStep(0);
    setShowReport(false);
  };

  const onSubmit = async (data: FormValues) => {
    setFormData(data);
    const raw = calculateProjections(data);
    const projections = raw.map((p, i) => ({
      ...p,
      year: Number.isFinite(p.year) ? p.year : i + 1,
    }));
    setResults(projections);
    setShowReport(true);
    notify('Projections generated');

    try {
      const token = await getToken();
      await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          clientName: data.ownerName,
          projectName: data.businessName,
          data,
          userEmail: user?.primaryEmailAddress?.emailAddress,
        }),
      });
    } catch (err) {
      console.error('Failed to save report', err);
    }
  };

  if (showReport && formData && results.length > 0) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setShowReport(false)}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Go Back
          </button>
          <button
            onClick={handleNewReport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            New Report
          </button>
        </div>
        <div id="report" className="space-y-6">
          <SectionHeader title="Report Preview" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(() => {
              const first = results[0];
              const kpis = [
                { label: 'Revenue', value: formatCurrency(first.revenue) },
                { label: 'Net Profit', value: formatCurrency(first.netProfit) },
                { label: 'DSCR', value: formatNumber(first.dscr) },
                { label: 'Current Ratio', value: formatNumber(first.currentRatio) },
              ];
              return kpis.map((k) => (
                <KPI key={k.label} label={k.label} value={k.value} />
              ));
            })()}
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
            <ComputationOfWorkingCapitalRequirementReport
              formData={formData}
              data={results}
            />
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
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {sections[currentStep]}

          <div className="flex justify-between mt-4">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Back
              </button>
            )}

            {currentStep < sections.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Generate Report
              </button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
