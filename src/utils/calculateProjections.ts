// src/utils/calculateProjections.ts

import type { FormValues, Projection } from "@/types/formTypes";

export default function calculateProjections(data: FormValues): Projection[] {
  // 1. Cast all form inputs to numbers
  const getAmount = (type: string) =>
    Number(data.costItems.find((i) => i.type === type)?.amount) || 0;
  const preOpExpenses = getAmount("Pre-operating Expenses");
  const workingCapitalRequirement = getAmount("Working Capital Requirement");
  const startYear = new Date(data.projectStartDate).getFullYear();
  const span = Number(data.projectionSpan) || 0;

  const ownerCapital = Number(data.ownerCapital) || 0;
  const annualGrowthRate = (Number(data.annualGrowthRate) || 0) / 100;
  const priceInflation = (Number(data.priceInflation) || 0) / 100;
  const baseRevenue = (data.products || []).reduce(
    (sum, p) => sum + Number(p.unitPrice || 0) * Number(p.quantity || 0),
    0
  );

  const rawMaterialMonthly = Number(data.rawMaterialMonthly) || 0;
  const wagesLabourMonthly = Number(data.wagesLabourMonthly) || 0;
  const electricityMonthly = Number(data.electricityMonthly) || 0;
  const otherOverheadsMonthly = Number(data.otherOverheadsMonthly) || 0;
  const outwardFreightMonthly = Number(data.outwardFreightMonthly) || 0;
  const inwardFreightMonthly = Number(data.inwardFreightMonthly) || 0;
  const adminMonthly = Number(data.adminExpensesMonthly) || 0;

  const inventoryDays = Number(data.inventoryDays) || 0;
  const debtorDays = Number(data.debtorDays) || 0;
  const creditorDays = Number(data.creditorDays) || 0;

  const machineryEquipment = getAmount("Machinery & Equipment");
  const furnitureFixtures = getAmount("Furniture / Fixtures");
  const otherFixedAssets = getAmount("Other Fixed Assets");
  const getDepRate = (type: string) =>
    (Number(data.costItems.find((i) => i.type === type)?.depreciationRate) || 0) /
    100;
  const fixedAssets = [
    { amount: machineryEquipment, rate: getDepRate("Machinery & Equipment") },
    { amount: furnitureFixtures, rate: getDepRate("Furniture / Fixtures") },
    { amount: otherFixedAssets, rate: getDepRate("Other Fixed Assets") },
  ];
  const totalFixedAssets = fixedAssets.reduce((sum, a) => sum + a.amount, 0);
  const avgDepRate =
    totalFixedAssets > 0
      ? fixedAssets.reduce((sum, a) => sum + a.amount * a.rate, 0) /
        totalFixedAssets
      : 0;

  const termLoanAmount = Number(data.termLoanAmount) || 0;
  const termLoanInterest = (Number(data.termLoanInterest) || 0) / 100;
  const termLoanTenure = Number(data.termLoanTenure) || 0;

  const monthlyDrawings = Number(data.monthlyDrawings) || 0;
  const annualDrawings = monthlyDrawings * 12;

  const wcLoanAmount = Number(data.wcLoanAmount) || 0;
  const capSubToggle = Boolean(data.capitalSubsidyToggle);
  const capSubPct = (Number(data.capitalSubsidyPercent) || 0) / 100;

  const openingBankBalance = Number(data.openingBankBalance) || 0;
  const openingInventory = Number(data.openingInventory) || 0;
  const openingCreditors = Number(data.openingCreditors) || 0;

  // 2. Build term–loan amortization schedule
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

  // 3. Initialize carry-forward variables
  let cumulativeReserve = 0;
  let prevClosingCash = openingBankBalance;
  let prevCreditors = openingCreditors;
  const wdvOpenings = fixedAssets.map((f) => f.amount);
  const cashCreditOutstanding = wcLoanAmount;
  const subsidyOutstanding = capSubToggle
    ? (totalFixedAssets + preOpExpenses + workingCapitalRequirement) * capSubPct
    : 0;

  const results: Projection[] = [];

  // 4. Loop through each projection year
  for (let i = 0; i < span; i++) {
    const year = startYear + i;

    // Revenue growth
    const revenue =
      baseRevenue * Math.pow(1 + annualGrowthRate, i) * Math.pow(1 + priceInflation, i);

    // Annual costs
    const purchase = rawMaterialMonthly * 12;
    const labourAndWages = wagesLabourMonthly * 12;
    const electricityExp = electricityMonthly * 12;
    const otherOverheads = otherOverheadsMonthly * 12;
    const outwardFreight = outwardFreightMonthly * 12;
    const costOfProduction = purchase + labourAndWages + electricityExp + otherOverheads + outwardFreight;
    const inwardFreight = inwardFreightMonthly * 12;
    const adminExpenses = adminMonthly * 12;

    // Inventory & working capital
    const openingStock = i === 0 ? openingInventory : results[i - 1].closingStock || 0;
    const closingStock = (inventoryDays / 365) * revenue;
    const closingDebtors = (debtorDays / 365) * revenue;
    const creditorsOutstanding = (creditorDays / 365) * revenue;
    const stockIncrease = closingStock - openingStock;
    const creditorsIncrease = creditorsOutstanding - prevCreditors;
    prevCreditors = creditorsOutstanding;

    // Depreciation & WDV
    let depreciation = 0;
    for (let j = 0; j < wdvOpenings.length; j++) {
      const dep = wdvOpenings[j] * fixedAssets[j].rate;
      depreciation += dep;
      wdvOpenings[j] -= dep;
    }
    const writtenDownValue = wdvOpenings.reduce((sum, val) => sum + val, 0);

    // Net profit & margins
    const netProfit = revenue - costOfProduction - inwardFreight - adminExpenses - depreciation;
    const profitMargin = revenue ? netProfit / revenue : 0;
    const surplus = netProfit;

    // Capital account (reserve & surplus) should carry forward the
    // previous year's balance. Current year's net profit (surplus) is
    // added to the next year, not the same year. Similarly, drawings
    // reduce next year's opening balance. For the very first year we
    // start from base capital, so reserveAndSurplus begins at 0.
    const reserveAndSurplus = i === 0 ? 0 : results[i - 1].netProfit - annualDrawings;
    cumulativeReserve += reserveAndSurplus;

    // Financing moves
    const subsidyIncrease = i === 0 && capSubToggle ? subsidyOutstanding : 0;
    const termLoanOutstanding = schedule[i].opening;
    const termLoanIncrease = i === 0 ? termLoanAmount : 0;
    // cashCreditOutstanding stays constant after initial draw
    const cashCreditIncrease = i === 0 ? wcLoanAmount : 0;

    // Cash flow
    const equityInjection = i === 0 ? ownerCapital : 0;
    const sourcesTotal =
      equityInjection + reserveAndSurplus + depreciation + cashCreditIncrease + termLoanIncrease + subsidyIncrease + creditorsIncrease;
    const applicationTotal =
      (i === 0 ? totalFixedAssets : 0) + stockIncrease + schedule[i].principal + subsidyIncrease + annualDrawings;
    const closingCashBalance = prevClosingCash + sourcesTotal - applicationTotal;
    prevClosingCash = closingCashBalance;

    // Ratios
    const workingCapital = ((inventoryDays + debtorDays - creditorDays) / 365) * revenue;
    const { principal, interest } = schedule[i];
    const dscr = principal + interest ? netProfit / (principal + interest) : 0;
    const currentRatio = creditorsOutstanding
      ? (closingDebtors + closingStock + closingCashBalance + subsidyOutstanding) / creditorsOutstanding
      : 0;
    const tolToTnw = ownerCapital + cumulativeReserve
      ? (termLoanOutstanding + cashCreditOutstanding) / (ownerCapital + cumulativeReserve)
      : 0;

    // Push projection
    results.push({
      year,
      revenue,
      costOfSales: costOfProduction,
      depreciation,
      netProfit,
      profitMargin,
      workingCapital,
      dscr,
      currentRatio,
      tolToTnw,

      reserveAndSurplus,
      surplus,

      fixedAssetAddition: i === 0 ? totalFixedAssets : 0,
      termLoanOutstanding,
      termLoanIncrease,
      cashCreditOutstanding,
      cashCreditIncrease,
      subsidyOutstanding,
      subsidyIncrease,
      subsidyFd: subsidyIncrease,
      creditorsOutstanding,
      creditorsIncrease,
      stockIncrease,
      closingStock,
      closingDebtors,
      closingCashBalance,
      openingStock,
      writtenDownValue,
      purchase,
      electricityExpenses: electricityExp,
      labourAndWages,
      otherOverheads,
      outwardFreight,
      inwardFreight,
      adminExpenses,
      openingCashBalance: i === 0 ? openingBankBalance : results[i - 1].closingCashBalance,
      drawings: annualDrawings,
      costOfProduction,
      rateOfDepreciation: avgDepRate,
      depreciationAndExpOff: depreciation,
      loanRepayment: schedule[i].principal,
    });
  }

  return results;
}
