/**
 * Utility functions for KPI display and formatting
 */

/**
 * Format a value with its unit in the proper position and format
 * @param value - The numeric value to format
 * @param unit - The unit string (e.g., 'USD', '%', 'units')
 * @returns Formatted string with value and unit
 */
export function formatValueWithUnit(value: number, unit: string): string {
  const formattedValue = formatNumber(value);
  
  // Currency symbols go before the value
  if (unit === 'USD' || unit === '$') {
    return `$${formattedValue}`;
  }
  if (unit === 'EUR' || unit === '€') {
    return `€${formattedValue}`;
  }
  if (unit === 'GBP' || unit === '£') {
    return `£${formattedValue}`;
  }
  
  // Percentage goes after without space
  if (unit === '%' || unit === 'percent') {
    return `${formattedValue}%`;
  }
  
  // Everything else goes after with a space
  return `${formattedValue} ${unit}`;
}

/**
 * Format a number with proper separators
 * @param value - The number to format
 * @returns Formatted number string
 */
export function formatNumber(value: number): string {
  // Handle decimals intelligently
  if (Number.isInteger(value)) {
    return value.toLocaleString('en-US');
  }
  
  // Show up to 2 decimal places, but remove trailing zeros
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

/**
 * Get progress bar color class based on progress percentage
 * @param percentage - Progress percentage (0-100)
 * @returns Tailwind CSS gradient classes
 */
export function getProgressBarColor(percentage: number): string {
  if (percentage >= 71) {
    return 'from-green-500 to-emerald-600';
  }
  if (percentage >= 31) {
    return 'from-orange-500 to-blue-500';
  }
  return 'from-red-500 to-orange-500';
}

/**
 * Get background color class for progress badge based on progress percentage
 * @param percentage - Progress percentage (0-100)
 * @returns Tailwind CSS gradient classes
 */
export function getProgressBadgeColor(percentage: number): string {
  // Use the same logic as progress bar color
  return getProgressBarColor(percentage);
}
