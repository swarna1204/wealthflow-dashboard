// src/lib/formatters.ts

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatDate = (date: string | Date, format: 'short' | 'long' | 'medium' = 'medium'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  let options: Intl.DateTimeFormatOptions;
  
  switch (format) {
    case 'short':
      options = { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' };
      break;
    case 'long':
      options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
      break;
    case 'medium':
    default:
      options = { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' };
      break;
  }

  return dateObj.toLocaleDateString('en-US', options);
};

export const formatCompactNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};