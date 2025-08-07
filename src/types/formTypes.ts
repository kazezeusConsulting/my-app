// src/types/formTypes.ts

// src/types/formTypes.ts

export interface BusinessDetails {
  businessName: string;
  constitutionType: string;
  ownerName: string;
  mobile: string;             // MOBILE on cover
  email: string;              
  projectType: string;        // TYPE OF PROJECT on cover
  address: string;
  industryType: string;        // CATEGORY on cover
  schemeName: string;
  employmentGenerated: number; // EMPLOYMENT on cover
  description: string;
}

export interface ProjectTimeline {
  projectStartDate: string;
  projectionSpan: number;
  emiFrequency: 'Monthly' | 'Quarterly';
}

export interface CostOfProject {
  costItems: CostItem[];
}

export interface CostItem {
  type: string;
  marginPercent: number;
  amount: number;
}

export interface FundingLoans {
  ownerCapital: number;
  termLoanAmount: number;
  termLoanInterest: number;
  termLoanTenure: number;
  termLoanMoratorium: number;
  wcLoanAmount: number;        // WORKING CAPITAL LOAN on cover
  wcLoanInterest: number;
  wcLoanTenure: number;
  capitalSubsidyToggle: boolean;
  capitalSubsidyPercent: number;
  loanProcessingFeePercent: number;
}

export interface SalesRevenue {
  baseYearSales: number;
  annualGrowthRate: number;
  avgSellingPriceYear1: number;
  unitsSoldYear1: number;
  priceInflation: number;
  capacityUtilization: number[];
  workingDays: number;
  workingHours: number;
}

export interface ExpenseAssumptions {
  rawMaterialCostPct: number;
  wagesLabourPct: number;
  electricityOverheadPct: number;
  sellingAdminPct: number;
  fixedMonthlyCosts: number;
}

export interface WorkingCapital {
  inventoryDays: number;
  debtorDays: number;
  creditorDays: number;
  advanceFromCustomersPercent?: number;
}

export interface Depreciation {
  method: 'WDV' | 'SLM';
  assetLife: number;
}

export interface LedgerCashflow {
  openingBankBalance: number;
  openingInventory?: number;
  openingDebtors?: number;
  openingCreditors?: number;
  monthlyDrawings: number;
  taxRate: number;
  gstRate: number;
  carryForwardEarnings: boolean;
}

// —— NEW: the shape returned by calculateProjections() —— 
export interface Projection {
  year: number;
  revenue: number;
  costOfSales: number;
  depreciation: number;
  netProfit: number;
  profitMargin: number;         // e.g. netProfit / revenue
  workingCapital: number;
  dscr: number;
  currentRatio: number;
  tolToTnw: number;
  // plus any additional fields your custom reports use, e.g.:
  reserveAndSurplus?: number;
  depreciationAndExpOff?: number;
  cashCreditIncrease?: number;
  termLoanIncrease?: number;
  subsidyIncrease?: number;
  creditorsIncrease?: number;
  fixedAssetAddition?: number;
  stockIncrease?: number;
  debtorsIncrease?: number;
  loanRepayment?: number;
  subsidyFd?: number;
  drawings?: number;
  openingCashBalance?: number;
  surplus?: number;
  closingCashBalance?: number;
  openingStock?: number;
  closingStock?: number;
  netSale?: number;
  avgSalePrice?: number;
  grossSale?: number;
  purchase?: number;
  electricityExpenses?: number;
  labourAndWages?: number;
  otherOverheads?: number;
  costOfProduction?: number;
  addition?: number;
  writtenDownValue?: number;
  rateOfDepreciation?: number;
  sellingExpenses?: number;
  adminExpenses?: number;

}

export interface FormValues
  extends BusinessDetails,
    ProjectTimeline,
    CostOfProject,
    FundingLoans,
    SalesRevenue,
    ExpenseAssumptions,
    WorkingCapital,
    Depreciation,
    LedgerCashflow {}
