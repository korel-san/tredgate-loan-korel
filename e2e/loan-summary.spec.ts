import { test, expect } from './fixtures/test-fixtures'

/**
 * Summary Statistics Tests
 * Tests the summary card functionality and accuracy
 */

test.describe('Summary Statistics', () => {
  test('should display correct initial summary with no loans', async ({ cleanLoanPage }) => {
    await test.step('Verify empty summary', async () => {
      await cleanLoanPage.expectSummaryStats({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      })
    })
  })

  test('should update summary when creating loans', async ({ cleanLoanPage }) => {
    const loans = [
      {
        applicantName: 'First',
        amount: 10000,
        termMonths: 12,
        interestRate: 0.05,
      },
      {
        applicantName: 'Second',
        amount: 20000,
        termMonths: 24,
        interestRate: 0.06,
      },
      {
        applicantName: 'Third',
        amount: 30000,
        termMonths: 36,
        interestRate: 0.07,
      },
    ]

    await test.step('Create first loan', async () => {
      await cleanLoanPage.createLoanApplication(loans[0])
      await cleanLoanPage.expectSummaryStats({
        total: 1,
        pending: 1,
        approved: 0,
        rejected: 0,
      })
    })

    await test.step('Create second loan', async () => {
      await cleanLoanPage.createLoanApplication(loans[1])
      await cleanLoanPage.expectSummaryStats({
        total: 2,
        pending: 2,
        approved: 0,
        rejected: 0,
      })
    })

    await test.step('Create third loan', async () => {
      await cleanLoanPage.createLoanApplication(loans[2])
      await cleanLoanPage.expectSummaryStats({
        total: 3,
        pending: 3,
        approved: 0,
        rejected: 0,
      })
    })
  })

  test('should update summary when approving loans', async ({ cleanLoanPage }) => {
    const loans = Array.from({ length: 3 }, (_, i) => ({
      applicantName: `Applicant ${i + 1}`,
      amount: 10000,
      termMonths: 12,
      interestRate: 0.05,
    }))

    await test.step('Create three loans', async () => {
      for (const loan of loans) {
        await cleanLoanPage.createLoanApplication(loan)
      }
    })

    await test.step('Approve first loan', async () => {
      await cleanLoanPage.approveLoan(0)
      await cleanLoanPage.expectSummaryStats({
        total: 3,
        pending: 2,
        approved: 1,
        rejected: 0,
      })
    })

    await test.step('Approve second loan', async () => {
      await cleanLoanPage.approveLoan(1)
      await cleanLoanPage.expectSummaryStats({
        total: 3,
        pending: 1,
        approved: 2,
        rejected: 0,
      })
    })

    await test.step('Approve third loan', async () => {
      await cleanLoanPage.approveLoan(2)
      await cleanLoanPage.expectSummaryStats({
        total: 3,
        pending: 0,
        approved: 3,
        rejected: 0,
      })
    })
  })

  test('should update summary when rejecting loans', async ({ cleanLoanPage }) => {
    const loans = Array.from({ length: 3 }, (_, i) => ({
      applicantName: `Applicant ${i + 1}`,
      amount: 200000,
      termMonths: 84,
      interestRate: 0.10,
    }))

    await test.step('Create three loans', async () => {
      for (const loan of loans) {
        await cleanLoanPage.createLoanApplication(loan)
      }
    })

    await test.step('Reject all loans one by one', async () => {
      await cleanLoanPage.rejectLoan(0)
      await cleanLoanPage.expectSummaryStats({
        total: 3,
        pending: 2,
        approved: 0,
        rejected: 1,
      })

      await cleanLoanPage.rejectLoan(1)
      await cleanLoanPage.expectSummaryStats({
        total: 3,
        pending: 1,
        approved: 0,
        rejected: 2,
      })

      await cleanLoanPage.rejectLoan(2)
      await cleanLoanPage.expectSummaryStats({
        total: 3,
        pending: 0,
        approved: 0,
        rejected: 3,
      })
    })
  })

  test('should update summary with mixed statuses', async ({ cleanLoanPage }) => {
    const loans = Array.from({ length: 6 }, (_, i) => ({
      applicantName: `Applicant ${i + 1}`,
      amount: 20000 + i * 10000,
      termMonths: 24,
      interestRate: 0.06,
    }))

    await test.step('Create six loans', async () => {
      for (const loan of loans) {
        await cleanLoanPage.createLoanApplication(loan)
      }
    })

    await test.step('Process loans with different outcomes', async () => {
      // Approve two
      await cleanLoanPage.approveLoan(0)
      await cleanLoanPage.approveLoan(1)

      // Reject two
      await cleanLoanPage.rejectLoan(2)
      await cleanLoanPage.rejectLoan(3)

      // Leave two pending
    })

    await test.step('Verify final summary', async () => {
      await cleanLoanPage.expectSummaryStats({
        total: 6,
        pending: 2,
        approved: 2,
        rejected: 2,
      })
    })
  })

  test('should update summary when deleting loans', async ({ cleanLoanPage }) => {
    const loans = Array.from({ length: 4 }, (_, i) => ({
      applicantName: `Applicant ${i + 1}`,
      amount: 10000,
      termMonths: 12,
      interestRate: 0.05,
    }))

    await test.step('Create four loans', async () => {
      for (const loan of loans) {
        await cleanLoanPage.createLoanApplication(loan)
      }
      await cleanLoanPage.expectSummaryStats({
        total: 4,
        pending: 4,
        approved: 0,
        rejected: 0,
      })
    })

    await test.step('Delete one loan', async () => {
      await cleanLoanPage.deleteLoan(0)
      await cleanLoanPage.expectSummaryStats({
        total: 3,
        pending: 3,
        approved: 0,
        rejected: 0,
      })
    })

    await test.step('Delete two more loans', async () => {
      await cleanLoanPage.deleteLoan(0)
      await cleanLoanPage.deleteLoan(0)
      await cleanLoanPage.expectSummaryStats({
        total: 1,
        pending: 1,
        approved: 0,
        rejected: 0,
      })
    })
  })

  test('should update summary when deleting processed loans', async ({ cleanLoanPage }) => {
    const loans = Array.from({ length: 5 }, (_, i) => ({
      applicantName: `Applicant ${i + 1}`,
      amount: 20000,
      termMonths: 24,
      interestRate: 0.06,
    }))

    await test.step('Create five loans with different statuses', async () => {
      for (const loan of loans) {
        await cleanLoanPage.createLoanApplication(loan)
      }

      // Approve first two
      await cleanLoanPage.approveLoan(0)
      await cleanLoanPage.approveLoan(1)

      // Reject next two
      await cleanLoanPage.rejectLoan(2)
      await cleanLoanPage.rejectLoan(3)

      // Leave one pending
    })

    await test.step('Verify mixed status summary', async () => {
      await cleanLoanPage.expectSummaryStats({
        total: 5,
        pending: 1,
        approved: 2,
        rejected: 2,
      })
    })

    await test.step('Delete the pending loan', async () => {
      await cleanLoanPage.deleteLoan(4)
      await cleanLoanPage.expectSummaryStats({
        total: 4,
        pending: 0,
        approved: 2,
        rejected: 2,
      })
    })
  })

  test('should maintain accurate summary after complex workflow', async ({ cleanLoanPage }) => {
    await test.step('Create initial loans', async () => {
      await cleanLoanPage.createLoanApplication({
        applicantName: 'User 1',
        amount: 10000,
        termMonths: 12,
        interestRate: 0.05,
      })
      await cleanLoanPage.createLoanApplication({
        applicantName: 'User 2',
        amount: 20000,
        termMonths: 24,
        interestRate: 0.06,
      })
      await cleanLoanPage.createLoanApplication({
        applicantName: 'User 3',
        amount: 30000,
        termMonths: 36,
        interestRate: 0.07,
      })
    })

    await test.step('Process first loan', async () => {
      await cleanLoanPage.approveLoan(0)
    })

    await test.step('Add another loan', async () => {
      await cleanLoanPage.createLoanApplication({
        applicantName: 'User 4',
        amount: 40000,
        termMonths: 48,
        interestRate: 0.08,
      })
    })

    await test.step('Process more loans', async () => {
      await cleanLoanPage.rejectLoan(1)
      await cleanLoanPage.autoDecideLoan(2) // Should approve (30k, 36 months)
    })

    await test.step('Delete a pending loan', async () => {
      await cleanLoanPage.deleteLoan(3)
    })

    await test.step('Verify final accurate summary', async () => {
      await cleanLoanPage.expectSummaryStats({
        total: 3,
        pending: 0,
        approved: 2,
        rejected: 1,
      })
    })
  })

  test('should persist summary after page reload', async ({ cleanLoanPage }) => {
    await test.step('Create and process loans', async () => {
      await cleanLoanPage.createLoanApplication({
        applicantName: 'Test 1',
        amount: 10000,
        termMonths: 12,
        interestRate: 0.05,
      })
      await cleanLoanPage.createLoanApplication({
        applicantName: 'Test 2',
        amount: 20000,
        termMonths: 24,
        interestRate: 0.06,
      })
      await cleanLoanPage.createLoanApplication({
        applicantName: 'Test 3',
        amount: 30000,
        termMonths: 36,
        interestRate: 0.07,
      })

      await cleanLoanPage.approveLoan(0)
      await cleanLoanPage.rejectLoan(1)
    })

    await test.step('Verify summary before reload', async () => {
      await cleanLoanPage.expectSummaryStats({
        total: 3,
        pending: 1,
        approved: 1,
        rejected: 1,
      })
    })

    await test.step('Reload page', async () => {
      await cleanLoanPage.reload()
      await cleanLoanPage.waitForPageLoad()
    })

    await test.step('Verify summary persists', async () => {
      await cleanLoanPage.expectSummaryStats({
        total: 3,
        pending: 1,
        approved: 1,
        rejected: 1,
      })
    })
  })
})
