import { test, expect } from './fixtures/test-fixtures'
import { AppTexts } from './texts/app-texts'

/**
 * Loan Creation Tests
 * Tests the complete workflow of creating loan applications
 */

test.describe('Loan Creation', () => {
  test('should load the application with correct initial state', async ({ cleanLoanPage }) => {
    await test.step('Verify page structure', async () => {
      await cleanLoanPage.expectPageToBeLoaded()
    })

    await test.step('Verify empty state', async () => {
      await cleanLoanPage.expectEmptyState()
    })

    await test.step('Verify summary shows zeros', async () => {
      await cleanLoanPage.expectSummaryStats({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      })
    })
  })

  test('should create a loan application successfully', async ({ cleanLoanPage }) => {
    const loanData = {
      applicantName: 'John Doe',
      amount: 50000,
      termMonths: 36,
      interestRate: 0.08,
    }

    await test.step('Create loan application', async () => {
      await cleanLoanPage.createLoanApplication(loanData)
    })

    await test.step('Verify loan appears in the list', async () => {
      await cleanLoanPage.expectLoanCount(1)
      await cleanLoanPage.expectLoanData(0, loanData, 'pending')
    })

    await test.step('Verify summary is updated', async () => {
      await cleanLoanPage.expectSummaryStats({
        total: 1,
        pending: 1,
        approved: 0,
        rejected: 0,
      })
    })

    await test.step('Verify pending loan has action buttons', async () => {
      await cleanLoanPage.expectPendingLoanActions(0)
    })
  })

  test('should create multiple loan applications', async ({ cleanLoanPage }) => {
    const loans = [
      {
        applicantName: 'Alice Smith',
        amount: 25000,
        termMonths: 24,
        interestRate: 0.06,
      },
      {
        applicantName: 'Bob Johnson',
        amount: 75000,
        termMonths: 48,
        interestRate: 0.09,
      },
      {
        applicantName: 'Carol White',
        amount: 100000,
        termMonths: 60,
        interestRate: 0.07,
      },
    ]

    await test.step('Create first loan', async () => {
      await cleanLoanPage.createLoanApplication(loans[0])
    })

    await test.step('Create second loan', async () => {
      await cleanLoanPage.createLoanApplication(loans[1])
    })

    await test.step('Create third loan', async () => {
      await cleanLoanPage.createLoanApplication(loans[2])
    })

    await test.step('Verify all loans are listed', async () => {
      await cleanLoanPage.expectLoanCount(3)
      await cleanLoanPage.expectLoanData(0, loans[0], 'pending')
      await cleanLoanPage.expectLoanData(1, loans[1], 'pending')
      await cleanLoanPage.expectLoanData(2, loans[2], 'pending')
    })

    await test.step('Verify summary counts', async () => {
      await cleanLoanPage.expectSummaryStats({
        total: 3,
        pending: 3,
        approved: 0,
        rejected: 0,
      })
    })
  })

  test('should validate required fields', async ({ cleanLoanPage }) => {
    await test.step('Try to submit empty form', async () => {
      await cleanLoanPage.clickSubmit()
    })

    await test.step('Verify validation error is shown', async () => {
      await cleanLoanPage.expectValidationError('Applicant name is required')
    })

    await test.step('Verify no loan was created', async () => {
      await cleanLoanPage.expectEmptyState()
    })
  })

  test('should validate amount is positive', async ({ cleanLoanPage }) => {
    await test.step('Fill form with invalid amount', async () => {
      await cleanLoanPage.fillApplicantName('Test User')
      await cleanLoanPage.fillAmount(-1000)
      await cleanLoanPage.fillTermMonths(12)
      await cleanLoanPage.fillInterestRate(0.05)
      await cleanLoanPage.clickSubmit()
    })

    await test.step('Verify validation error', async () => {
      await cleanLoanPage.expectValidationError('Amount must be greater than 0')
    })
  })

  test('should validate term months is positive', async ({ cleanLoanPage }) => {
    await test.step('Fill form with invalid term', async () => {
      await cleanLoanPage.fillApplicantName('Test User')
      await cleanLoanPage.fillAmount(10000)
      await cleanLoanPage.fillTermMonths(-12)
      await cleanLoanPage.fillInterestRate(0.05)
      await cleanLoanPage.clickSubmit()
    })

    await test.step('Verify validation error', async () => {
      await cleanLoanPage.expectValidationError('Term months must be greater than 0')
    })
  })

  test('should persist loans in localStorage', async ({ cleanLoanPage }) => {
    const loanData = {
      applicantName: 'Storage Test',
      amount: 30000,
      termMonths: 24,
      interestRate: 0.07,
    }

    await test.step('Create loan application', async () => {
      await cleanLoanPage.createLoanApplication(loanData)
    })

    await test.step('Verify loan is visible', async () => {
      await cleanLoanPage.expectLoanCount(1)
    })

    await test.step('Reload page', async () => {
      await cleanLoanPage.reload()
      await cleanLoanPage.waitForPageLoad()
    })

    await test.step('Verify loan persists after reload', async () => {
      await cleanLoanPage.expectLoanCount(1)
      await cleanLoanPage.expectLoanData(0, loanData, 'pending')
    })
  })

  test('should handle edge case: zero interest rate', async ({ cleanLoanPage }) => {
    const loanData = {
      applicantName: 'Zero Interest',
      amount: 10000,
      termMonths: 12,
      interestRate: 0,
    }

    await test.step('Create loan with zero interest', async () => {
      await cleanLoanPage.createLoanApplication(loanData)
    })

    await test.step('Verify loan is created', async () => {
      await cleanLoanPage.expectLoanCount(1)
      await cleanLoanPage.expectLoanData(0, loanData, 'pending')
    })
  })

  test('should handle edge case: high interest rate', async ({ cleanLoanPage }) => {
    const loanData = {
      applicantName: 'High Interest',
      amount: 5000,
      termMonths: 6,
      interestRate: 0.99,
    }

    await test.step('Create loan with high interest', async () => {
      await cleanLoanPage.createLoanApplication(loanData)
    })

    await test.step('Verify loan is created', async () => {
      await cleanLoanPage.expectLoanCount(1)
      await cleanLoanPage.expectLoanData(0, loanData, 'pending')
    })
  })

  test('should handle boundary case: exactly $100,000', async ({ cleanLoanPage }) => {
    const loanData = {
      applicantName: 'Boundary Test',
      amount: 100000,
      termMonths: 60,
      interestRate: 0.08,
    }

    await test.step('Create loan at boundary amount', async () => {
      await cleanLoanPage.createLoanApplication(loanData)
    })

    await test.step('Verify loan is created', async () => {
      await cleanLoanPage.expectLoanCount(1)
      await cleanLoanPage.expectLoanData(0, loanData, 'pending')
    })
  })
})
