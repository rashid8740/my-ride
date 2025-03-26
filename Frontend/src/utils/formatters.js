// src/utils/formatters.js

/**
 * Format a number as currency
 * @param {number} value - The value to format
 * @param {string} currency - The currency code (default: USD)
 * @param {number} minimumFractionDigits - Minimum fraction digits (default: 0)
 * @param {number} maximumFractionDigits - Maximum fraction digits (default: 0)
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(
  value,
  currency = "USD",
  minimumFractionDigits = 0,
  maximumFractionDigits = 0
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Format a number with commas as thousands separators
 * @param {number} number - The number to format
 * @returns {string} - Formatted number string
 */
export function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Format a date to a readable string
 * @param {Date|string} date - The date to format
 * @param {object} options - Formatting options
 * @returns {string} - Formatted date string
 */
export function formatDate(date, options = {}) {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Intl.DateTimeFormat(
    "en-US",
    options ? { ...defaultOptions, ...options } : defaultOptions
  ).format(dateObj);
}

/**
 * Calculate mileage per year
 * @param {number} mileage - Total mileage
 * @param {number} year - Model year
 * @returns {string} - Formatted mileage per year
 */
export function calculateMileagePerYear(mileage, year) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  if (age <= 0) return "N/A";

  const mileagePerYear = Math.round(mileage / age);
  return formatNumber(mileagePerYear) + " mi/year";
}
