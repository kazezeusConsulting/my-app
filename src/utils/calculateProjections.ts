// src/utils/calculateProjections.ts
import type { FormValues, Projection } from "@/types/formTypes";

export default function calculateProjections(data: FormValues): Projection[] {
  // 1. Cast all form inputs to numbers (HTML inputs produce strings)
  const getAmount = (type: string) =>
    Number(data.costItems.find((i) => i.type === type)?.amount) || 0;
  const preOpExpenses = getAmount('Pre-operating Expenses');
  const workingCapitalRequirement = getAmount('Working Capital Requirement');
  const startYear           = new Date(data.projectStartDate).getFullYear();
  const span                = Number(data.projectionSpan) || 0;

  const ownerCapital        = Number(data.ownerCapital) || 0;
  const annualGrowthRate    = (Number(data.annualGrowthRate) || 0) / 100;
  const priceInflation      = (Number(data.priceInflation) || 0) / 100;
  const baseRevenue         = (data.products || []).reduce(
    (sum, p) => sum + Number(p.unitPrice || 0) * Number(p.quantity || 0),
    0
  );

  const rawMaterialMonthly   = Number(data.rawMaterialMonthly) || 0;
  const wagesLabourMonthly   = Number(data.wagesLabourMonthly) || 0;
  const electricityMonthly   = Number(data.electricityMonthly) || 0;
  const otherOverheadsMonthly= Number(data.otherOverheadsMonthly) || 0;
  const outwardFreightMonthly = Number(data.outwardFreightMonthly) || 0;
  const inwardFreightMonthly  = Number(data.inwardFreightMonthly) || 0;
  const adminMonthly         = Number(data.adminExpensesMonthly) || 0;

  const inventoryDays       = Number(data.inventoryDays) || 0;
  const debtorDays          = Number(data.debtorDays) || 0;
  const creditorDays        = Number(data.creditorDays) || 0;

  const machineryEquipment  = getAmount('Machinery & Equipment');
  const furnitureFixtures   = getAmount('Furniture / Fixtures');
  const otherFixedAssets    = getAmount('Other Fixed Assets');
  const totalFixedAssets    = machineryEquipment + furnitureFixtures + otherFixedAssets;

  const method              = data.method;
  const depRate             = (Number(data.depreciationRate) || 0) / 100;

  const termLoanAmount      = Number(data.termLoanAmount) || 0;
  const termLoanInterest    = (Number(data.termLoanInterest) || 0) / 100;
  const termLoanTenure      = Number(data.termLoanTenure) || 0;

  const monthlyDrawings     = Number(data.monthlyDrawings) || 0;
  const annualDrawings      = monthlyDrawings * 12;

  const wcLoanAmount        = Number(data.wcLoanAmount) || 0;
  const capSubToggle        = Boolean(data.capitalSubsidyToggle);
  const capSubPct           = (Number(data.capitalSubsidyPercent) || 0) / 100;

  const openingBankBalance  = Number(data.openingBankBalance) || 0;
  const openingInventory    = Number(data.openingInventory) || 0;

  const results: Projection[] = [];

  // 2. Build term‐loan amortization schedule
  const schedule: { opening: number; interest: number; principal: number; closing: number }[] = [];
  let loanOpening = termLoanAmount;
  const principalPerYear = termLoanTenure > 0 ? termLoanAmount / termLoanTenure : 0;

  for (let i = 0; i < span; i++) {
    const active = i < termLoanTenure;
    const interest = active ? loanOpening * termLoanInterest : 0;
    const principal = active ? principalPerYear : 0;
    const closing = loanOpening - principal;
    schedule.push({ opening: loanOpening, interest, principal, closing });
    loanOpening = closing;
  }

  let prevReserve = 0;
  let prevClosingCash = openingBankBalance;
  let wdvOpening = totalFixedAssets;

  // 3. Loop through each projection year
  for (let i = 0; i < span; i++) {
    const year = startYear + i;

    // Revenue growth based on products
    const revenue =
      baseRevenue *
      Math.pow(1 + annualGrowthRate, i) *
      Math.pow(1 + priceInflation, i);

    // Cost of Sales breakdown (annualized from monthly values)
    const purchase       = rawMaterialMonthly * 12;
    const labourAndWages = wagesLabourMonthly * 12;
    const electricityExp = electricityMonthly * 12;
    const otherOverheads = otherOverheadsMonthly * 12;
    const outwardFreight = outwardFreightMonthly * 12;
    const costOfSales    =
      purchase + labourAndWages + electricityExp + otherOverheads + outwardFreight;

    const inwardFreight  = inwardFreightMonthly * 12;
    const adminExpenses  = adminMonthly * 12;

    // Opening/Closing stock
    const openingStock = i === 0 ? openingInventory : results[i - 1].closingStock ?? 0;
    const closingStock = (inventoryDays / 365) * revenue;

    // Sales computation (simplified)
    const grossSale    = revenue;

    // Depreciation
    let depreciation = 0;
    const rateOfDepreciation = depRate;
    let writtenDownValue = 0;
    if (method === 'SLM') {
      depreciation = totalFixedAssets * rateOfDepreciation;
      writtenDownValue = totalFixedAssets - depreciation * (i + 1);
    } else {
      depreciation = wdvOpening * rateOfDepreciation;
      writtenDownValue = wdvOpening - depreciation;
      wdvOpening = writtenDownValue;
    }

    // Net Profit & margin
    const netProfit   =
      revenue - costOfSales - inwardFreight - adminExpenses - depreciation;
    const profitMargin = revenue ? netProfit / revenue : 0;

    // Working Capital
    const workingCapital = ((inventoryDays + debtorDays - creditorDays) / 365) * revenue;

    // DSCR
    const { principal, interest } = schedule[i];
    const annualEmi = principal + interest;
    const dscr      = annualEmi ? netProfit / annualEmi : 0;

    // Reserve & Surplus
    const surplus         = netProfit;
    const reserveAndSurplus = i === 0 ? surplus : prevReserve + surplus - annualDrawings;
    prevReserve = reserveAndSurplus;

    // Sources / Applications (year-0 only)
    const fixedAssetAddition = i === 0 ? totalFixedAssets : 0;
    const termLoanIncrease   = i === 0 ? termLoanAmount : 0;
    const cashCreditIncrease = i === 0 ? wcLoanAmount : 0;
    const subsidyIncrease    = capSubToggle && i === 0
      ? (totalFixedAssets + preOpExpenses + workingCapitalRequirement) * capSubPct
      : 0;
    const creditorsIncrease  = (creditorDays / 365) * revenue;
    const subsidyFd          = subsidyIncrease;
    const loanRepayment      = principal;
    const drawings           = annualDrawings;

    // Cash Flow
    const openingCashBalance = prevClosingCash;
    const sourcesTotal =
      ownerCapital +
      netProfit +
      subsidyIncrease +
      termLoanIncrease +
      cashCreditIncrease +
      creditorsIncrease;
    const applicationTotal =
      fixedAssetAddition +
      (openingStock - closingStock) +
      depreciation +
      loanRepayment +
      subsidyFd +
      drawings;
    const closingCashBalance = openingCashBalance + sourcesTotal - applicationTotal;
    prevClosingCash = closingCashBalance;

    // Ratios: Current & TOL/TNW
    const debtorsIncrease      = (debtorDays / 365) * revenue;
    const stockIncrease        = closingStock - openingStock;
    const currentAssets        = debtorsIncrease + stockIncrease + closingCashBalance + subsidyFd;
    const currentLiabilities   = creditorsIncrease;
    const currentRatio         = currentLiabilities ? currentAssets / currentLiabilities : 0;

    const termLoanBalance = schedule[i].opening;
    const tol             = termLoanBalance + cashCreditIncrease;
    const netWorth        = ownerCapital + reserveAndSurplus;
    const tolToTnw        = netWorth ? tol / netWorth : 0;

    // Push full Projection
    results.push({
      year,
      revenue,
      costOfSales,
      depreciation,
      netProfit,
      profitMargin,
      workingCapital,
      dscr,
      currentRatio,
      tolToTnw,

      // Optional fields for reports
      reserveAndSurplus,
      depreciationAndExpOff: depreciation,
      cashCreditIncrease,
      termLoanIncrease,
      subsidyIncrease,
      creditorsIncrease,
      fixedAssetAddition,
      stockIncrease,
      debtorsIncrease,
      loanRepayment,
      subsidyFd,
      drawings,
      openingCashBalance,
      surplus,
      closingCashBalance,
      openingStock,
      closingStock,
      grossSale,
      purchase,
      electricityExpenses: electricityExp,
      labourAndWages,
      otherOverheads,
      outwardFreight,
      inwardFreight,
      adminExpenses,
      costOfProduction: costOfSales,
      addition: fixedAssetAddition,
      writtenDownValue,
      rateOfDepreciation,
    });
  }

  return results;
}
