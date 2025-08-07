// src/pages/ReportBuilder.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import type { FormValues, Projection } from '@/types/formTypes';
import calculateProjections from '@/utils/calculateProjections';

import BusinessDetails from '@/components/form-sections/BusinessDetails';
import ProjectTimeline from '@/components/form-sections/ProjectTimeline';
import CostOfProject from '@/components/form-sections/CostOfProject';
import FundingLoans from '@/components/form-sections/FundingLoans';
import SalesRevenue from '@/components/form-sections/SalesRevenue';
import ExpenseAssumptions from '@/components/form-sections/ExpenseAssumptions';
import WorkingCapital from '@/components/form-sections/WorkingCapital';
import Depreciation from '@/components/form-sections/Depreciation';
import LedgerCashflow from '@/components/form-sections/LedgerCashflow';

import CoverReport from '@/components/outputs/CoverReport';
import CostOfProjectReport from '@/components/outputs/CostOfProjectReport';
import MeansOfFinanceReport from '@/components/outputs/MeansOfFinanceReport';
import CapitalSubsidyReport from '@/components/outputs/CapitalSubsidyReport';
import SourcesOfFundReport from '@/components/outputs/SourcesOfFundReport';
import ApplicationOfFundReport from '@/components/outputs/ApplicationOfFundReport';
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

export default function ReportBuilder() {
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [results, setResults] = useState<Projection[]>([]);

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
      machineryEquipment: 0,
      furnitureFixtures: 0,
      otherFixedAssets: 0,
      preOpExpenses: 0,
      workingCapitalRequirement: 0,
      marginPercent: 15,
      contingencyPercent: 5,

      // Funding / Loans
      ownerCapital: 0,
      termLoanAmount: 0,
      termLoanInterest: 0,
      termLoanTenure: 0,
      termLoanMoratorium: 0,
      wcLoanAmount: 0,
      wcLoanInterest: 0,
      wcLoanTenure: 0,
      capitalSubsidyToggle: false,
      capitalSubsidyPercent: 0,
      loanProcessingFeePercent: 0,

      // Sales & Revenue
      baseYearSales: 0,
      annualGrowthRate: 10,
      avgSellingPriceYear1: 0,
      unitsSoldYear1: 0,
      priceInflation: 5,
      // <— HERE: ensure this is always an array of length = projectionSpan
      capacityUtilization: Array(defaultSpan).fill(0),
      workingDays: 300,
      workingHours: 8,

      // Expense Assumptions
      rawMaterialCostPct: 40,
      wagesLabourPct: 10,
      electricityOverheadPct: 5,
      sellingAdminPct: 10,
      fixedMonthlyCosts: 0,

      // Working Capital
      inventoryDays: 30,
      debtorDays: 60,
      creditorDays: 30,
      advanceFromCustomersPercent: 0,

      // Depreciation
      method: 'WDV',
      assetLife: 5,

      // Ledger / Cashflow
      openingBankBalance: 0,
      openingInventory: 0,
      openingDebtors: 0,
      openingCreditors: 0,
      monthlyDrawings: 0,
      taxRate: 30,
      gstRate: 18,
      carryForwardEarnings: false,
    },
  });

  const onSubmit = (data: FormValues) => {
    setFormData(data);
    const raw = calculateProjections(data);
    // Guard against NaN years
    const projections = raw.map((p, i) => ({
      ...p,
      year: Number.isFinite(p.year) ? p.year : i + 1,
    }));
    setResults(projections);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BusinessDetails control={form.control} />
          <ProjectTimeline control={form.control} />
          <CostOfProject control={form.control} />
          <FundingLoans control={form.control} />
          <SalesRevenue control={form.control} />
          <ExpenseAssumptions control={form.control} />
          <WorkingCapital control={form.control} />
          <Depreciation control={form.control} />
          <LedgerCashflow control={form.control} />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Generate Report
          </button>
        </form>
      </Form>

      {formData && results.length > 0 && (
        <div id="report" className="mt-8 bg-white p-6 rounded shadow space-y-6">
          <CoverReport formData={formData} />
          <div className="page-break" />

          <CostOfProjectReport formData={formData} />
          <div className="page-break" />

          <MeansOfFinanceReport formData={formData} />
          <CapitalSubsidyReport formData={formData} />
          <div className="page-break" />

          <SourcesOfFundReport formData={formData} data={results} />
          <div className="page-break" />

          <ApplicationOfFundReport data={results} />
          <div className="page-break" />

          <ProjectedCashFlowReport formData={formData} data={results} />
          <div className="page-break" />

          <KeyRatiosReport data={results} />
          <div className="page-break" />

          <ProjectedBalanceSheetReport formData={formData} data={results} />
          <div className="page-break" />

          <ProjectedProfitabilityReport data={results} />
          <div className="page-break" />

          <ComputationOfProductionReport formData={formData} data={results} />
          <div className="page-break" />

          <ComputationOfWorkingCapitalRequirementReport
            formData={formData}
            data={results}
          />
          <div className="page-break" />

          <ComputationOfDepreciationReport data={results} />
          <div className="page-break" />

          <RepaymentScheduleReport formData={formData} data={results} />
          <div className="page-break" />

          <DSCRReport formData={formData} data={results} />

          <button
            onClick={exportToPdf}
            className="mt-6 inline-block border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white"
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}
