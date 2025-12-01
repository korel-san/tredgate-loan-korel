/**
 * Helper utilities for Playwright tests
 */

/**
 * Format a number as currency (USD)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Format a decimal as percentage
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

/**
 * Calculate monthly payment for a loan
 * Uses the standard amortization formula
 */
export function calculateMonthlyPayment(
  amount: number,
  termMonths: number,
  interestRate: number
): number {
  if (interestRate === 0) {
    return amount / termMonths
  }

  const monthlyRate = interestRate / 12
  const payment =
    (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1)

  return payment
}

/**
 * Determine if a loan should be auto-approved based on business rules
 * Approved if amount ≤ $100,000 AND term ≤ 60 months
 */
export function shouldAutoApprove(amount: number, termMonths: number): boolean {
  return amount <= 100000 && termMonths <= 60
}

/**
 * Generate a unique test identifier
 */
export function generateTestId(): string {
  return `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Wait for a specified amount of time
 */
export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
