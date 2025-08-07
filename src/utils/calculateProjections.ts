// src/utils/calculateProjections.ts
import type { FormValues, Projection } from "@/types/formTypes";

export default function calculateProjections(data: FormValues): Projection[] {
  // 1. Cast all form inputs to numbers (HTML inputs produce strings)
  const preOpExpenses = parseInt(data.preOpExpenses as any) || 0;
  const workingCapitalRequirement = parseInt(data.workingCapitalRequirement as any) || 0;
  const startYear           = new Date(data.projectStartDate).getFullYear();
  const span                = Number(data.projectionSpan) || 0;

  const ownerCapital        = Number(data.ownerCapital) || 0;
  const baseYearSales       = Number(data.baseYearSales) || 0;
  const annualGrowthRate    = (Number(data.annualGrowthRate) || 0) / 100;
  const priceInflation      = (Number(data.priceInflation) || 0) / 100;
  const unitsSoldYear1      = Number(data.unitsSoldYear1) || 0;
  const avgSellingPriceYear1= Number(data.avgSellingPriceYear1) || 0;

  const rawMaterialCostPct  = (Number(data.rawMaterialCostPct) || 0) / 100;
  const wagesLabourPct      = (Number(data.wagesLabourPct) || 0) / 100;
  const electricityPct      = (Number(data.electricityOverheadPct) || 0) / 100;
  const sellingAdminPct     = (Number(data.sellingAdminPct) || 0) / 100;

  const inventoryDays       = Number(data.inventoryDays) || 0;
  const debtorDays          = Number(data.debtorDays) || 0;
  const creditorDays        = Number(data.creditorDays) || 0;

  const machineryEquipment  = Number(data.machineryEquipment) || 0;
  const furnitureFixtures   = Number(data.furnitureFixtures) || 0;
  const otherFixedAssets    = Number(data.otherFixedAssets) || 0;
  const totalFixedAssets    = machineryEquipment + furnitureFixtures + otherFixedAssets;

  const method              = data.method;
  const assetLife           = Number(data.assetLife) || 1;
  const depRatePct          = (Number(data.contingencyPercent) || 0) / 100;

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

  // 3. Loop through each projection year
  for (let i = 0; i < span; i++) {
    const year = startYear + i;

    // Revenue growth
    const revenue = baseYearSales * Math.pow(1 + annualGrowthRate, i);

    // Cost of Sales breakdown
    const purchase       = revenue * rawMaterialCostPct;
    const labourAndWages = revenue * wagesLabourPct;
    const electricityExp = revenue * electricityPct;
    const otherOverheads = revenue * sellingAdminPct;
    const costOfSales    = purchase + labourAndWages + electricityExp + otherOverheads;

    // Opening/Closing stock
    const openingStock = i === 0 ? openingInventory : results[i - 1].closingStock ?? 0;
    const closingStock = (inventoryDays / 365) * revenue;

    // Sales computation
    const avgSalePrice = avgSellingPriceYear1 * Math.pow(1 + priceInflation, i);
    const netSaleUnits = unitsSoldYear1 * Math.pow(1 + annualGrowthRate, i);
    const grossSale    = netSaleUnits * avgSalePrice;

    // Depreciation
    let depreciation = 0;
    let rateOfDepreciation = 0;
    if (method === 'SLM') {
      rateOfDepreciation = 1 / assetLife;
      depreciation = totalFixedAssets * rateOfDepreciation;
    } else {
      rateOfDepreciation = depRatePct;
      const openVal = totalFixedAssets * Math.pow(1 - depRatePct, i);
      depreciation = openVal * depRatePct;
    }
    const writtenDownValue = totalFixedAssets - depreciation * (i + 1);

    // Net Profit & margin
    const netProfit   = revenue - costOfSales - depreciation;
    const profitMargin= revenue ? netProfit / revenue : 0;

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
      netSale: netSaleUnits,
      avgSalePrice,
      grossSale,
      purchase,
      electricityExpenses: electricityExp,
      labourAndWages,
      otherOverheads,
      costOfProduction: costOfSales,
      addition: fixedAssetAddition,
      writtenDownValue,
      rateOfDepreciation,
    });
  }

  return results;
}
