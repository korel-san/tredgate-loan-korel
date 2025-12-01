import { test } from './fixtures/test-fixtures'

/**
 * Loan Approval and Rejection Tests
 * Tests manual approval and rejection workflows
 */

test.describe('Loan Approval and Rejection', () => {
  test('should approve a pending loan', async ({ cleanLoanPage }) => {
    const loanData = {
      applicantName: 'Approve Test',
      amount: 25000,
      termMonths: 24,
      interestRate: 0.06,
    }

    await test.step('Create loan application', async () => {
      await cleanLoanPage.createLoanApplication(loanData)
    })

    await test.step('Verify initial status is pending', async () => {
      await cleanLoanPage.expectLoanStatus(0, 'pending')
    })

    await test.step('Approve the loan', async () => {
      await cleanLoanPage.approveLoan(0)
    })

    await test.step('Verify status changed to approved', async () => {
      await cleanLoanPage.expectLoanStatus(0, 'approved')
    })

    await test.step('Verify action buttons are hidden', async () => {
      await cleanLoanPage.expectNoActions(0)
    })

    await test.step('Verify summary is updated', async () => {
      await cleanLoanPage.expectSummaryStats({
        total: 1,
        pending: 0,
        approved: 1,
        rejected: 0,
      })
    })
  })

  test('should reject a pending loan', async ({ cleanLoanPage }) => {
    const loanData = {
      applicantName: 'Reject Test',
      amount: 150000,
      termMonths: 72,
      interestRate: 0.10,
    }

    await test.step('Create loan application', async () => {
      await cleanLoanPage.createLoanApplication(loanData)
    })

    await test.step('Verify initial status is pending', async () => {
      await cleanLoanPage.expectLoanStatus(0, 'pending')
    })

    await test.step('Reject the loan', async () => {
      await cleanLoanPage.rejectLoan(0)
    })

    await test.step('Verify status changed to rejected', async () => {
      await cleanLoanPage.expectLoanStatus(0, 'rejected')
    })

    await test.step('Verify action buttons are hidden', async () => {
      await cleanLoanPage.expectNoActions(0)
    })

    await test.step('Verify summary is updated', async () => {
      await cleanLoanPage.expectSummaryStats({
        total: 1,
        pending: 0,
        approved: 0,
        rejected: 1,
      })
    })
  })

  test('should handle multiple loans with different statuses', async ({ cleanLoanPage }) => {
    const loans = [
      {
        applicantName: 'First Applicant',
        amount: 10000,
        termMonths: 12,
        interestRate: 0.05,
      },
      {
        applicantName: 'Second Applicant',
        amount: 20000,
        termMonths: 24,
        interestRate: 0.06,
      },
      {
        applicantName: 'Third Applicant',
        amount: 30000,
        termMonths: 36,
        interestRate: 0.07,
      },
    ]

    await test.step('Create three loan applications', async () => {
      for (const loan of loans) {
        await cleanLoanPage.createLoanApplication(loan)
      }
    })

    await test.step('Verify all are pending', async () => {
      await cleanLoanPage.expectLoanCount(3)
      await cleanLoanPage.expectLoanStatus(0, 'pending')
      await cleanLoanPage.expectLoanStatus(1, 'pending')
      await cleanLoanPage.expectLoanStatus(2, 'pending')
    })

    await test.step('Approve first loan', async () => {
      await cleanLoanPage.approveLoan(0)
    })

    await test.step('Reject second loan', async () => {
      await cleanLoanPage.rejectLoan(1)
    })

    await test.step('Verify statuses', async () => {
      await cleanLoanPage.expectLoanStatus(0, 'approved')
      await cleanLoanPage.expectLoanStatus(1, 'rejected')
      await cleanLoanPage.expectLoanStatus(2, 'pending')
    })

    await test.step('Verify summary counts', async () => {
      await cleanLoanPage.expectSummaryStats({
        total: 3,
        pending: 1,
        approved: 1,
        rejected: 1,
      })
    })

    await test.step('Verify only pending loan has action buttons', async () => {
      await cleanLoanPage.expectNoActions(0)
      await cleanLoanPage.expectNoActions(1)
      await cleanLoanPage.expectPendingLoanActions(2)
    })
  })

  test('should persist status changes after page reload', async ({ cleanLoanPage }) => {
    const loanData = {
      applicantName: 'Persistence Test',
      amount: 40000,
      termMonths: 48,
      interestRate: 0.08,
    }

    await test.step('Create and approve loan', async () => {
      await cleanLoanPage.createLoanApplication(loanData)
      await cleanLoanPage.approveLoan(0)
    })

    await test.step('Verify approved status', async () => {
      await cleanLoanPage.expectLoanStatus(0, 'approved')
    })

    await test.step('Reload page', async () => {
      await cleanLoanPage.reload()
      await cleanLoanPage.waitForPageLoad()
    })

    await test.step('Verify status persists', async () => {
      await cleanLoanPage.expectLoanCount(1)
      await cleanLoanPage.expectLoanStatus(0, 'approved')
      await cleanLoanPage.expectNoActions(0)
    })

    await test.step('Verify summary persists', async () => {
      await cleanLoanPage.expectSummaryStats({
        total: 1,
        pending: 0,
        approved: 1,
        rejected: 0,
      })
    })
  })

  test('should handle approval of the last loan in a list', async ({ cleanLoanPage }) => {
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
    ]

    await test.step('Create two loans', async () => {
      for (const loan of loans) {
        await cleanLoanPage.createLoanApplication(loan)
      }
    })

    await test.step('Approve the last loan', async () => {
      await cleanLoanPage.approveLoan(1)
    })

    await test.step('Verify correct loan was approved', async () => {
      await cleanLoanPage.expectLoanStatus(0, 'pending')
      await cleanLoanPage.expectLoanStatus(1, 'approved')
    })
  })

  test('should handle rejection followed by approval of different loan', async ({ cleanLoanPage }) => {
    const loans = [
      {
        applicantName: 'Will be rejected',
        amount: 200000,
        termMonths: 84,
        interestRate: 0.12,
      },
      {
        applicantName: 'Will be approved',
        amount: 15000,
        termMonths: 18,
        interestRate: 0.06,
      },
    ]

    await test.step('Create two loans', async () => {
      for (const loan of loans) {
        await cleanLoanPage.createLoanApplication(loan)
      }
    })

    await test.step('Reject first, approve second', async () => {
      await cleanLoanPage.rejectLoan(0)
      await cleanLoanPage.approveLoan(1)
    })

    await test.step('Verify final statuses', async () => {
      await cleanLoanPage.expectLoanStatus(0, 'rejected')
      await cleanLoanPage.expectLoanStatus(1, 'approved')
    })

    await test.step('Verify summary', async () => {
      await cleanLoanPage.expectSummaryStats({
        total: 2,
        pending: 0,
        approved: 1,
        rejected: 1,
      })
    })
  })
})
