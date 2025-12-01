import { test, expect } from './fixtures/test-fixtures'
import { shouldAutoApprove } from './helpers/test-helpers'

/**
 * Auto-Decide Tests
 * Tests the automatic loan decision workflow based on business rules:
 * - Approved if amount ≤ $100,000 AND term ≤ 60 months
 * - Rejected otherwise
 */

test.describe('Auto-Decide Workflow', () => {
  test('should auto-approve loan that meets criteria (amount ≤ 100k, term ≤ 60)', async ({
    cleanLoanPage,
  }) => {
    const loanData = {
      applicantName: 'Auto Approve Test',
      amount: 50000,
      termMonths: 36,
      interestRate: 0.07,
    }

    await test.step('Verify loan meets auto-approval criteria', async () => {
      const shouldApprove = shouldAutoApprove(loanData.amount, loanData.termMonths)
      expect(shouldApprove, 'Loan should meet auto-approval criteria').toBe(true)
    })

    await test.step('Create loan application', async () => {
      await cleanLoanPage.createLoanApplication(loanData)
    })

    await test.step('Auto-decide the loan', async () => {
      await cleanLoanPage.autoDecideLoan(0)
    })

    await test.step('Verify loan was auto-approved', async () => {
      await cleanLoanPage.expectLoanStatus(0, 'approved')
    })

    await test.step('Verify summary shows approved', async () => {
      await cleanLoanPage.expectSummaryStats({
        total: 1,
        pending: 0,
        approved: 1,
        rejected: 0,
      })
    })
  })

  test('should auto-reject loan with amount > 100k', async ({ cleanLoanPage }) => {
    const loanData = {
      applicantName: 'High Amount Test',
      amount: 150000,
      termMonths: 48,
      interestRate: 0.08,
    }

    await test.step('Verify loan does not meet auto-approval criteria', async () => {
      const shouldApprove = shouldAutoApprove(loanData.amount, loanData.termMonths)
      expect(shouldApprove, 'Loan should not meet auto-approval criteria').toBe(false)
    })

    await test.step('Create loan application', async () => {
      await cleanLoanPage.createLoanApplication(loanData)
    })

    await test.step('Auto-decide the loan', async () => {
      await cleanLoanPage.autoDecideLoan(0)
    })

    await test.step('Verify loan was auto-rejected', async () => {
      await cleanLoanPage.expectLoanStatus(0, 'rejected')
    })

    await test.step('Verify summary shows rejected', async () => {
      await cleanLoanPage.expectSummaryStats({
        total: 1,
        pending: 0,
        approved: 0,
        rejected: 1,
      })
    })
  })

  test('should auto-reject loan with term > 60 months', async ({ cleanLoanPage }) => {
    const loanData = {
      applicantName: 'Long Term Test',
      amount: 50000,
      termMonths: 72,
      interestRate: 0.06,
    }

    await test.step('Verify loan does not meet auto-approval criteria', async () => {
      const shouldApprove = shouldAutoApprove(loanData.amount, loanData.termMonths)
      expect(shouldApprove, 'Loan should not meet auto-approval criteria').toBe(false)
    })

    await test.step('Create loan application', async () => {
      await cleanLoanPage.createLoanApplication(loanData)
    })

    await test.step('Auto-decide the loan', async () => {
      await cleanLoanPage.autoDecideLoan(0)
    })

    await test.step('Verify loan was auto-rejected', async () => {
      await cleanLoanPage.expectLoanStatus(0, 'rejected')
    })
  })

  test('should auto-reject loan with both amount > 100k and term > 60', async ({
    cleanLoanPage,
  }) => {
    const loanData = {
      applicantName: 'Double Fail Test',
      amount: 200000,
      termMonths: 84,
      interestRate: 0.10,
    }

    await test.step('Verify loan does not meet auto-approval criteria', async () => {
      const shouldApprove = shouldAutoApprove(loanData.amount, loanData.termMonths)
      expect(shouldApprove, 'Loan should not meet auto-approval criteria').toBe(false)
    })

    await test.step('Create loan application', async () => {
      await cleanLoanPage.createLoanApplication(loanData)
    })

    await test.step('Auto-decide the loan', async () => {
      await cleanLoanPage.autoDecideLoan(0)
    })

    await test.step('Verify loan was auto-rejected', async () => {
      await cleanLoanPage.expectLoanStatus(0, 'rejected')
    })
  })

  test('should auto-approve loan at exact boundary (100k, 60 months)', async ({
    cleanLoanPage,
  }) => {
    const loanData = {
      applicantName: 'Boundary Test',
      amount: 100000,
      termMonths: 60,
      interestRate: 0.08,
    }

    await test.step('Verify loan meets auto-approval criteria at boundary', async () => {
      const shouldApprove = shouldAutoApprove(loanData.amount, loanData.termMonths)
      expect(shouldApprove, 'Loan at exact boundary should be auto-approved').toBe(true)
    })

    await test.step('Create loan application', async () => {
      await cleanLoanPage.createLoanApplication(loanData)
    })

    await test.step('Auto-decide the loan', async () => {
      await cleanLoanPage.autoDecideLoan(0)
    })

    await test.step('Verify loan was auto-approved', async () => {
      await cleanLoanPage.expectLoanStatus(0, 'approved')
    })
  })

  test('should auto-reject loan just over amount boundary (100,001)', async ({
    cleanLoanPage,
  }) => {
    const loanData = {
      applicantName: 'Over Amount Boundary',
      amount: 100001,
      termMonths: 60,
      interestRate: 0.08,
    }

    await test.step('Verify loan does not meet criteria (just over amount)', async () => {
      const shouldApprove = shouldAutoApprove(loanData.amount, loanData.termMonths)
      expect(shouldApprove, 'Loan just over amount boundary should be rejected').toBe(false)
    })

    await test.step('Create and auto-decide', async () => {
      await cleanLoanPage.createLoanApplication(loanData)
      await cleanLoanPage.autoDecideLoan(0)
    })

    await test.step('Verify auto-rejected', async () => {
      await cleanLoanPage.expectLoanStatus(0, 'rejected')
    })
  })

  test('should auto-reject loan just over term boundary (61 months)', async ({
    cleanLoanPage,
  }) => {
    const loanData = {
      applicantName: 'Over Term Boundary',
      amount: 100000,
      termMonths: 61,
      interestRate: 0.08,
    }

    await test.step('Verify loan does not meet criteria (just over term)', async () => {
      const shouldApprove = shouldAutoApprove(loanData.amount, loanData.termMonths)
      expect(shouldApprove, 'Loan just over term boundary should be rejected').toBe(false)
    })

    await test.step('Create and auto-decide', async () => {
      await cleanLoanPage.createLoanApplication(loanData)
      await cleanLoanPage.autoDecideLoan(0)
    })

    await test.step('Verify auto-rejected', async () => {
      await cleanLoanPage.expectLoanStatus(0, 'rejected')
    })
  })

  test('should auto-decide multiple loans with mixed outcomes', async ({ cleanLoanPage }) => {
    const loans = [
      {
        applicantName: 'Should Approve 1',
        amount: 25000,
        termMonths: 24,
        interestRate: 0.06,
      },
      {
        applicantName: 'Should Reject 1',
        amount: 150000,
        termMonths: 72,
        interestRate: 0.10,
      },
      {
        applicantName: 'Should Approve 2',
        amount: 75000,
        termMonths: 48,
        interestRate: 0.07,
      },
      {
        applicantName: 'Should Reject 2',
        amount: 50000,
        termMonths: 84,
        interestRate: 0.08,
      },
    ]

    await test.step('Create all loans', async () => {
      for (const loan of loans) {
        await cleanLoanPage.createLoanApplication(loan)
      }
    })

    await test.step('Auto-decide all loans', async () => {
      for (let i = 0; i < loans.length; i++) {
        await cleanLoanPage.autoDecideLoan(i)
      }
    })

    await test.step('Verify correct outcomes', async () => {
      await cleanLoanPage.expectLoanStatus(0, 'approved')
      await cleanLoanPage.expectLoanStatus(1, 'rejected')
      await cleanLoanPage.expectLoanStatus(2, 'approved')
      await cleanLoanPage.expectLoanStatus(3, 'rejected')
    })

    await test.step('Verify summary counts', async () => {
      await cleanLoanPage.expectSummaryStats({
        total: 4,
        pending: 0,
        approved: 2,
        rejected: 2,
      })
    })
  })

  test('should persist auto-decided status after page reload', async ({ cleanLoanPage }) => {
    const loanData = {
      applicantName: 'Persistence Test',
      amount: 80000,
      termMonths: 48,
      interestRate: 0.07,
    }

    await test.step('Create and auto-decide loan', async () => {
      await cleanLoanPage.createLoanApplication(loanData)
      await cleanLoanPage.autoDecideLoan(0)
    })

    await test.step('Verify status before reload', async () => {
      await cleanLoanPage.expectLoanStatus(0, 'approved')
    })

    await test.step('Reload page', async () => {
      await cleanLoanPage.reload()
      await cleanLoanPage.waitForPageLoad()
    })

    await test.step('Verify status persists', async () => {
      await cleanLoanPage.expectLoanStatus(0, 'approved')
      await cleanLoanPage.expectSummaryStats({
        total: 1,
        pending: 0,
        approved: 1,
        rejected: 0,
      })
    })
  })
})
