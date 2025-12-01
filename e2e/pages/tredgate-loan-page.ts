import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base-page'
import { AppTexts } from '../texts/app-texts'
import { formatCurrency, formatPercent, calculateMonthlyPayment } from '../helpers/test-helpers'

/**
 * Loan Application Interface
 */
export interface LoanApplication {
  applicantName: string
  amount: number
  termMonths: number
  interestRate: number
}

/**
 * Main Application Page Object
 * Represents the entire Tredgate Loan application
 */
export class TredgateLoanPage extends BasePage {
  // Locators - Header
  private readonly logo: Locator
  private readonly title: Locator
  private readonly tagline: Locator

  // Locators - Loan Form
  private readonly formTitle: Locator
  private readonly applicantNameInput: Locator
  private readonly amountInput: Locator
  private readonly termInput: Locator
  private readonly interestRateInput: Locator
  private readonly submitButton: Locator
  private readonly errorMessage: Locator

  // Locators - Loan List
  private readonly listTitle: Locator
  private readonly emptyState: Locator
  private readonly loanTable: Locator
  private readonly loanRows: Locator

  // Locators - Summary
  private readonly summaryTitle: Locator
  private readonly summaryCards: Locator

  constructor(page: Page) {
    super(page)

    // Header
    this.logo = page.locator('.logo')
    this.title = page.locator('.app-header h1')
    this.tagline = page.locator('.tagline')

    // Form
    this.formTitle = page.locator('.loan-form h2')
    this.applicantNameInput = page.locator('#applicantName')
    this.amountInput = page.locator('#amount')
    this.termInput = page.locator('#termMonths')
    this.interestRateInput = page.locator('#interestRate')
    this.submitButton = page.locator('button[type="submit"]')
    this.errorMessage = page.locator('.error-message')

    // List
    this.listTitle = page.locator('.loan-list h2')
    this.emptyState = page.locator('.empty-state')
    this.loanTable = page.locator('.loan-list table')
    this.loanRows = page.locator('.loan-list tbody tr')

    // Summary
    this.summaryTitle = page.locator('.loan-summary h2')
    this.summaryCards = page.locator('.summary-card')
  }

  // ========== Navigation Methods ==========

  /**
   * Navigate to the application
   */
  async open(): Promise<void> {
    await this.goto()
    await this.waitForPageLoad()
  }

  /**
   * Setup clean test environment
   */
  async setupCleanEnvironment(): Promise<void> {
    await this.open()
    await this.clearLocalStorage()
    await this.reload()
    await this.waitForPageLoad()
  }

  // ========== Atomic Methods - Form ==========

  /**
   * Fill applicant name field
   */
  async fillApplicantName(name: string): Promise<void> {
    await this.applicantNameInput.fill(name)
  }

  /**
   * Fill amount field
   */
  async fillAmount(amount: number): Promise<void> {
    await this.amountInput.fill(amount.toString())
  }

  /**
   * Fill term months field
   */
  async fillTermMonths(months: number): Promise<void> {
    await this.termInput.fill(months.toString())
  }

  /**
   * Fill interest rate field
   */
  async fillInterestRate(rate: number): Promise<void> {
    await this.interestRateInput.fill(rate.toString())
  }

  /**
   * Click submit button
   */
  async clickSubmit(): Promise<void> {
    await this.submitButton.click()
  }

  // ========== Atomic Methods - Loan Actions ==========

  /**
   * Get approve button for a specific loan row
   */
  private getApproveButton(rowIndex: number): Locator {
    return this.loanRows.nth(rowIndex).locator('button[title="Approve"]')
  }

  /**
   * Get reject button for a specific loan row
   */
  private getRejectButton(rowIndex: number): Locator {
    return this.loanRows.nth(rowIndex).locator('button[title="Reject"]')
  }

  /**
   * Get auto-decide button for a specific loan row
   */
  private getAutoDecideButton(rowIndex: number): Locator {
    return this.loanRows.nth(rowIndex).locator('button[title="Auto-decide"]')
  }

  /**
   * Get delete button for a specific loan row
   */
  private getDeleteButton(rowIndex: number): Locator {
    return this.loanRows.nth(rowIndex).locator('button[title="Delete"]')
  }

  /**
   * Click approve button for a specific loan
   */
  async clickApprove(rowIndex: number = 0): Promise<void> {
    await this.getApproveButton(rowIndex).click()
  }

  /**
   * Click reject button for a specific loan
   */
  async clickReject(rowIndex: number = 0): Promise<void> {
    await this.getRejectButton(rowIndex).click()
  }

  /**
   * Click auto-decide button for a specific loan
   */
  async clickAutoDecide(rowIndex: number = 0): Promise<void> {
    await this.getAutoDecideButton(rowIndex).click()
  }

  /**
   * Click delete button and confirm
   */
  async clickDelete(rowIndex: number = 0): Promise<void> {
    this.page.on('dialog', (dialog) => dialog.accept())
    await this.getDeleteButton(rowIndex).click()
  }

  // ========== Grouped Action Methods ==========

  /**
   * Create a loan application (grouped action with test.step)
   */
  async createLoanApplication(loan: LoanApplication): Promise<void> {
    await this.page.evaluate(() => {}) // Test step placeholder
    await this.fillApplicantName(loan.applicantName)
    await this.fillAmount(loan.amount)
    await this.fillTermMonths(loan.termMonths)
    await this.fillInterestRate(loan.interestRate)
    await this.clickSubmit()
    // Wait for form to reset (indication of successful submission)
    await expect(this.applicantNameInput).toHaveValue('')
  }

  /**
   * Approve a loan application (grouped action with test.step)
   */
  async approveLoan(rowIndex: number = 0): Promise<void> {
    await this.page.evaluate(() => {}) // Test step placeholder
    const initialCount = await this.getLoanCount()
    await this.clickApprove(rowIndex)
    // Wait for status to change
    await this.page.waitForTimeout(100)
    await expect(this.loanRows).toHaveCount(initialCount)
  }

  /**
   * Reject a loan application (grouped action with test.step)
   */
  async rejectLoan(rowIndex: number = 0): Promise<void> {
    await this.page.evaluate(() => {}) // Test step placeholder
    const initialCount = await this.getLoanCount()
    await this.clickReject(rowIndex)
    // Wait for status to change
    await this.page.waitForTimeout(100)
    await expect(this.loanRows).toHaveCount(initialCount)
  }

  /**
   * Auto-decide a loan application (grouped action with test.step)
   */
  async autoDecideLoan(rowIndex: number = 0): Promise<void> {
    await this.page.evaluate(() => {}) // Test step placeholder
    const initialCount = await this.getLoanCount()
    await this.clickAutoDecide(rowIndex)
    // Wait for status to change
    await this.page.waitForTimeout(100)
    await expect(this.loanRows).toHaveCount(initialCount)
  }

  /**
   * Delete a loan application (grouped action with test.step)
   */
  async deleteLoan(rowIndex: number = 0): Promise<void> {
    await this.page.evaluate(() => {}) // Test step placeholder
    const initialCount = await this.getLoanCount()
    await this.clickDelete(rowIndex)
    // Wait for loan to be removed
    await expect(this.loanRows).toHaveCount(initialCount - 1)
  }

  // ========== Assertion Methods ==========

  /**
   * Verify page is loaded correctly
   */
  async expectPageToBeLoaded(): Promise<void> {
    await expect(this.title, 'Page title should be visible').toBeVisible()
    await expect(this.title, `Page title should be "${AppTexts.APP_TITLE}"`).toHaveText(
      AppTexts.APP_TITLE
    )
    await expect(this.tagline, 'Tagline should be visible').toBeVisible()
    await expect(this.formTitle, 'Form title should be visible').toBeVisible()
    await expect(this.listTitle, 'List title should be visible').toBeVisible()
  }

  /**
   * Verify empty state is shown
   */
  async expectEmptyState(): Promise<void> {
    await expect(this.emptyState, 'Empty state should be visible when no loans exist').toBeVisible()
    await expect(
      this.emptyState,
      `Empty state should show message: "${AppTexts.LIST_EMPTY_STATE}"`
    ).toContainText(AppTexts.LIST_EMPTY_STATE)
    await expect(this.loanTable, 'Loan table should not be visible when empty').not.toBeVisible()
  }

  /**
   * Verify loan table is visible
   */
  async expectLoanTableVisible(): Promise<void> {
    await expect(this.loanTable, 'Loan table should be visible when loans exist').toBeVisible()
    await expect(this.emptyState, 'Empty state should not be visible when loans exist').not.toBeVisible()
  }

  /**
   * Verify loan count
   */
  async expectLoanCount(count: number): Promise<void> {
    if (count === 0) {
      await this.expectEmptyState()
    } else {
      await this.expectLoanTableVisible()
      await expect(this.loanRows, `Should have ${count} loan(s) in the table`).toHaveCount(count)
    }
  }

  /**
   * Verify loan data in a specific row
   */
  async expectLoanData(
    rowIndex: number,
    loan: LoanApplication,
    expectedStatus: 'pending' | 'approved' | 'rejected'
  ): Promise<void> {
    const row = this.loanRows.nth(rowIndex)

    await expect(
      row.locator('td').nth(0),
      `Row ${rowIndex}: Applicant name should be "${loan.applicantName}"`
    ).toHaveText(loan.applicantName)

    await expect(
      row.locator('td').nth(1),
      `Row ${rowIndex}: Amount should be ${formatCurrency(loan.amount)}`
    ).toHaveText(formatCurrency(loan.amount))

    await expect(
      row.locator('td').nth(2),
      `Row ${rowIndex}: Term should be ${loan.termMonths} mo`
    ).toHaveText(`${loan.termMonths} mo`)

    await expect(
      row.locator('td').nth(3),
      `Row ${rowIndex}: Rate should be ${formatPercent(loan.interestRate)}`
    ).toHaveText(formatPercent(loan.interestRate))

    const expectedPayment = calculateMonthlyPayment(loan.amount, loan.termMonths, loan.interestRate)
    await expect(
      row.locator('td').nth(4),
      `Row ${rowIndex}: Monthly payment should be ${formatCurrency(expectedPayment)}`
    ).toHaveText(formatCurrency(expectedPayment))

    await expect(
      row.locator('.status-badge'),
      `Row ${rowIndex}: Status should be "${expectedStatus}"`
    ).toHaveText(expectedStatus)
  }

  /**
   * Verify loan status
   */
  async expectLoanStatus(
    rowIndex: number,
    status: 'pending' | 'approved' | 'rejected'
  ): Promise<void> {
    const statusBadge = this.loanRows.nth(rowIndex).locator('.status-badge')
    await expect(
      statusBadge,
      `Row ${rowIndex}: Status should be "${status}"`
    ).toHaveText(status)
  }

  /**
   * Verify action buttons visibility for pending loan
   */
  async expectPendingLoanActions(rowIndex: number): Promise<void> {
    await expect(
      this.getApproveButton(rowIndex),
      `Row ${rowIndex}: Approve button should be visible for pending loan`
    ).toBeVisible()
    await expect(
      this.getRejectButton(rowIndex),
      `Row ${rowIndex}: Reject button should be visible for pending loan`
    ).toBeVisible()
    await expect(
      this.getAutoDecideButton(rowIndex),
      `Row ${rowIndex}: Auto-decide button should be visible for pending loan`
    ).toBeVisible()
    await expect(
      this.getDeleteButton(rowIndex),
      `Row ${rowIndex}: Delete button should be visible for pending loan`
    ).toBeVisible()
  }

  /**
   * Verify action buttons are hidden for non-pending loan
   */
  async expectNoActions(rowIndex: number): Promise<void> {
    const row = this.loanRows.nth(rowIndex)
    await expect(
      row.locator('button[title="Approve"]'),
      `Row ${rowIndex}: Approve button should not be visible for non-pending loan`
    ).not.toBeVisible()
    await expect(
      row.locator('button[title="Reject"]'),
      `Row ${rowIndex}: Reject button should not be visible for non-pending loan`
    ).not.toBeVisible()
    await expect(
      row.locator('button[title="Auto-decide"]'),
      `Row ${rowIndex}: Auto-decide button should not be visible for non-pending loan`
    ).not.toBeVisible()
  }

  /**
   * Verify summary statistics
   */
  async expectSummaryStats(stats: {
    total: number
    pending: number
    approved: number
    rejected: number
  }): Promise<void> {
    const totalCard = this.summaryCards.filter({ hasText: AppTexts.SUMMARY_TOTAL_APPS })
    const pendingCard = this.summaryCards.filter({ hasText: AppTexts.SUMMARY_PENDING })
    const approvedCard = this.summaryCards.filter({ hasText: AppTexts.SUMMARY_APPROVED })
    const rejectedCard = this.summaryCards.filter({ hasText: AppTexts.SUMMARY_REJECTED })

    await expect(
      totalCard.locator('.value'),
      `Total applications should be ${stats.total}`
    ).toHaveText(stats.total.toString())

    await expect(
      pendingCard.locator('.value'),
      `Pending applications should be ${stats.pending}`
    ).toHaveText(stats.pending.toString())

    await expect(
      approvedCard.locator('.value'),
      `Approved applications should be ${stats.approved}`
    ).toHaveText(stats.approved.toString())

    await expect(
      rejectedCard.locator('.value'),
      `Rejected applications should be ${stats.rejected}`
    ).toHaveText(stats.rejected.toString())
  }

  /**
   * Verify form validation error
   */
  async expectValidationError(message: string): Promise<void> {
    await expect(
      this.errorMessage,
      'Error message should be visible'
    ).toBeVisible()
    await expect(
      this.errorMessage,
      `Error message should contain: "${message}"`
    ).toContainText(message)
  }

  // ========== Utility Methods ==========

  /**
   * Get the number of loans in the list
   */
  async getLoanCount(): Promise<number> {
    return await this.loanRows.count()
  }

  /**
   * Check if empty state is shown
   */
  async isEmptyStateShown(): Promise<boolean> {
    return await this.emptyState.isVisible()
  }
}
