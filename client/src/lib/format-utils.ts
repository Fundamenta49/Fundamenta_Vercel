/**
 * Utility functions for formatting currencies, percentages, and other values
 */

// Format currency without cents
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format currency with cents (returns number formatted without the $ sign)
export const formatCurrencyPrecise = (amount: number): string => {
  // Format without currency style to avoid the $ symbol completely
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format percentage
export const formatPercent = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);
};