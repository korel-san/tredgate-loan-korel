import { test } from './fixtures/test-fixtures'

/**
 * Loan Deletion Tests
 * Tests the loan deletion workflow
 */

test.describe('Loan Deletion', () => {
  test('should delete a single pending loan', async ({ cleanLoanPage }) => {
    const loanData = {
      applicantName: 'Delete Test',
      amount: 30000,
      termMonths: 24,
      interestRate: 0.07,
    }

    await test.step('Create loan application', async () => {
      await cleanLoanPage.createLoanApplication(loanData)
    })

    await test.step('Verify loan exists', async () => {
      await cleanLoanPage.expectLoanCount(1)
    })

    await test.step('Delete the loan', async () => {
      await cleanLoanPage.deleteLoan(0)
    })

    await test.step('Verify loan is removed and empty state is shown', async () => {
      await cleanLoanPage.expectEmptyState()
    })

    await test.step('Verify summary is updated', async () => {
      await cleanLoanPage.expectSummaryStats({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      })
    })
  })

  test('should delete first loan from multiple loans', async ({ cleanLoanPage }) => {
    const loans = [
      {
        applicantName: 'First Loan',
        amount: 10000,
        termMonths: 12,
        interestRate: 0.05,
      },
      {
        applicantName: 'Second Loan',
        amount: 20000,
        termMonths: 24,
        interestRate: 0.06,
      },
      {
        applicantName: 'Third Loan',
        amount: 30000,
        termMonths: 36,
        interestRate: 0.07,
      },
    ]

    await test.step('Create three loans', async () => {
      for (const loan of loans) {
        await cleanLoanPage.createLoanApplication(loan)
      }
    })

    await test.step('Verify all loans exist', async () => {
      await cleanLoanPage.expectLoanCount(3)
    })

    await test.step('Delete first loan', async () => {
      await cleanLoanPage.deleteLoan(0)
    })

    await test.step('Verify two loans remain', async () => {
      await cleanLoanPage.expectLoanCount(2)
      await cleanLoanPage.expectLoanData(0, loans[1], 'pending')
      await cleanLoanPage.expectLoanData(1, loans[2], 'pending')
    })

    await test.step('Verify summary is updated', async () => {
      await cleanLoanPage.expectSummaryStats({
        total: 2,
        pending: 2,
        approved: 0,
        rejected: 0,
      })
    })
  })

  test('should delete middle loan from multiple loans', async ({ cleanLoanPage }) => {
    const loans = [
      {
        applicantName: 'First Loan',
        amount: 10000,
        termMonths: 12,
        interestRate: 0.05,
      },
      {
        applicantName: 'Middle Loan',
        amount: 20000,
        termMonths: 24,
        interestRate: 0.06,
      },
      {
        applicantName: 'Last Loan',
        amount: 30000,
        termMonths: 36,
        interestRate: 0.07,
      },
    ]

    await test.step('Create three loans', async () => {
      for (const loan of loans) {
        await cleanLoanPage.createLoanApplication(loan)
      }
    })

    await test.step('Delete middle loan', async () => {
      await cleanLoanPage.deleteLoan(1)
    })

    await test.step('Verify correct loans remain', async () => {
      await cleanLoanPage.expectLoanCount(2)
      await cleanLoanPage.expectLoanData(0, loans[0], 'pending')
      await cleanLoanPage.expectLoanData(1, loans[2], 'pending')
    })
  })

  test('should delete last loan from multiple loans', async ({ cleanLoanPage }) => {
    const loans = [
      {
        applicantName: 'First Loan',
        amount: 10000,
        termMonths: 12,
        interestRate: 0.05,
      },
      {
        applicantName: 'Second Loan',
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

    await test.step('Delete last loan', async () => {
      await cleanLoanPage.deleteLoan(1)
    })

    await test.step('Verify only first loan remains', async () => {
      await cleanLoanPage.expectLoanCount(1)
      await cleanLoanPage.expectLoanData(0, loans[0], 'pending')
    })
  })

  test('should delete all loans sequentially', async ({ cleanLoanPage }) => {
    const loans = [
      {
        applicantName: 'Loan 1',
        amount: 10000,
        termMonths: 12,
        interestRate: 0.05,
      },
      {
        applicantName: 'Loan 2',
        amount: 20000,
        termMonths: 24,
        interestRate: 0.06,
      },
      {
        applicantName: 'Loan 3',
        amount: 30000,
        termMonths: 36,
        interestRate: 0.07,
      },
    ]

    await test.step('Create three loans', async () => {
      for (const loan of loans) {
        await cleanLoanPage.createLoanApplication(loan)
      }
    })

    await test.step('Delete first loan', async () => {
      await cleanLoanPage.deleteLoan(0)
      await cleanLoanPage.expectLoanCount(2)
    })

    await test.step('Delete next loan (now first)', async () => {
      await cleanLoanPage.deleteLoan(0)
      await cleanLoanPage.expectLoanCount(1)
    })

    await test.step('Delete last loan', async () => {
      await cleanLoanPage.deleteLoan(0)
      await cleanLoanPage.expectEmptyState()
    })

    await test.step('Verify empty summary', async () => {
      await cleanLoanPage.expectSummaryStats({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      })
    })
  })

  test('should persist deletion after page reload', async ({ cleanLoanPage }) => {
    const loans = [
      {
        applicantName: 'Keep This',
        amount: 10000,
        termMonths: 12,
        interestRate: 0.05,
      },
      {
        applicantName: 'Delete This',
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

    await test.step('Delete second loan', async () => {
      await cleanLoanPage.deleteLoan(1)
    })

    await test.step('Verify one loan remains', async () => {
      await cleanLoanPage.expectLoanCount(1)
    })

    await test.step('Reload page', async () => {
      await cleanLoanPage.reload()
      await cleanLoanPage.waitForPageLoad()
    })

    await test.step('Verify deletion persists', async () => {
      await cleanLoanPage.expectLoanCount(1)
      await cleanLoanPage.expectLoanData(0, loans[0], 'pending')
    })
  })

  test('should only show delete button for pending loans', async ({ cleanLoanPage }) => {
    const loans = [
      {
        applicantName: 'Pending Loan',
        amount: 10000,
        termMonths: 12,
        interestRate: 0.05,
      },
      {
        applicantName: 'To Approve',
        amount: 20000,
        termMonths: 24,
        interestRate: 0.06,
      },
      {
        applicantName: 'To Reject',
        amount: 30000,
        termMonths: 36,
        interestRate: 0.07,
      },
    ]

    await test.step('Create three loans', async () => {
      for (const loan of loans) {
        await cleanLoanPage.createLoanApplication(loan)
      }
    })

    await test.step('Approve second loan', async () => {
      await cleanLoanPage.approveLoan(1)
    })

    await test.step('Reject third loan', async () => {
      await cleanLoanPage.rejectLoan(2)
    })

    await test.step('Verify only pending loan has delete button', async () => {
      await cleanLoanPage.expectPendingLoanActions(0)
      await cleanLoanPage.expectNoActions(1)
      await cleanLoanPage.expectNoActions(2)
    })

    await test.step('Verify can delete pending loan', async () => {
      await cleanLoanPage.deleteLoan(0)
      await cleanLoanPage.expectLoanCount(2)
    })
  })

  test('should handle rapid consecutive deletions', async ({ cleanLoanPage }) => {
    const loans = Array.from({ length: 5 }, (_, i) => ({
      applicantName: `Loan ${i + 1}`,
      amount: (i + 1) * 10000,
      termMonths: 12,
      interestRate: 0.05,
    }))

    await test.step('Create five loans', async () => {
      for (const loan of loans) {
        await cleanLoanPage.createLoanApplication(loan)
      }
    })

    await test.step('Verify all loans created', async () => {
      await cleanLoanPage.expectLoanCount(5)
    })

    await test.step('Delete three loans rapidly', async () => {
      await cleanLoanPage.deleteLoan(0)
      await cleanLoanPage.deleteLoan(0)
      await cleanLoanPage.deleteLoan(0)
    })

    await test.step('Verify correct number remain', async () => {
      await cleanLoanPage.expectLoanCount(2)
    })
  })
})
