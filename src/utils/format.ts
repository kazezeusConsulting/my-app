export const formatNumber = (value: number): string =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(value);

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);

export const formatPercent = (value: number): string =>
  `${value.toFixed(2)}%`;
