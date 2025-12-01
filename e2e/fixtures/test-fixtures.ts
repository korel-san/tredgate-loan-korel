import { test as base } from '@playwright/test'
import { TredgateLoanPage } from '../pages/tredgate-loan-page'

/**
 * Extended test fixtures
 * Provides pre-configured page objects for tests
 */
type TestFixtures = {
  loanPage: TredgateLoanPage
  cleanLoanPage: TredgateLoanPage
}

/**
 * Extended test with custom fixtures
 */
export const test = base.extend<TestFixtures>({
  /**
   * Loan page fixture - just navigates to the page
   */
  loanPage: async ({ page }, use) => {
    const loanPage = new TredgateLoanPage(page)
    await loanPage.open()
    await use(loanPage)
  },

  /**
   * Clean loan page fixture - navigates and clears localStorage
   */
  cleanLoanPage: async ({ page }, use) => {
    const loanPage = new TredgateLoanPage(page)
    await loanPage.setupCleanEnvironment()
    await use(loanPage)
  },
})

export { expect } from '@playwright/test'
