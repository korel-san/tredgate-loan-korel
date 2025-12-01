# E2E Testing with Playwright

This directory contains end-to-end tests for the Tredgate Loan application using Playwright.

## Structure

```
e2e/
├── fixtures/           # Test fixtures and custom test configurations
│   └── test-fixtures.ts
├── helpers/            # Helper functions and utilities
│   └── test-helpers.ts
├── pages/              # Page Object Model classes
│   ├── base-page.ts
│   └── tredgate-loan-page.ts
├── texts/              # Text constants to avoid hardcoding
│   └── app-texts.ts
├── loan-approval-rejection.spec.ts  # Approval/rejection workflow tests
├── loan-auto-decide.spec.ts         # Auto-decide workflow tests
├── loan-creation.spec.ts            # Loan creation tests
├── loan-deletion.spec.ts            # Loan deletion tests
└── loan-summary.spec.ts             # Summary statistics tests
```

## Design Principles

### Page Object Model (POM)
- **Atomic methods**: Small, single-purpose methods (e.g., `clickApprove()`)
- **Grouped actions**: Complex workflows combining atomic methods (e.g., `createLoanApplication()`)
- **Clear separation**: UI interactions in page objects, test logic in specs

### Test Organization
- Tests are organized by feature/workflow
- Each test is independent and can run in isolation
- Clean environment setup using fixtures
- Descriptive test names following "should..." pattern

### Best Practices
- No hardcoded text - all UI text in `app-texts.ts`
- Custom error messages for all assertions
- Locators based on semantic elements (IDs, classes)
- Proper waits and timeouts to handle async operations

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (visible browser)
npm run test:e2e:headed

# Run in debug mode
npm run test:e2e:debug

# View test report
npm run playwright:report
```

## Test Coverage

### Loan Creation (loan-creation.spec.ts)
- ✅ Application loads with correct initial state
- ✅ Create single loan application
- ✅ Create multiple loan applications
- ✅ Form validation (required fields, positive values)
- ✅ Edge cases (zero interest, high interest, boundary values)
- ✅ LocalStorage persistence

### Loan Approval/Rejection (loan-approval-rejection.spec.ts)
- ✅ Approve a pending loan
- ✅ Reject a pending loan
- ✅ Handle multiple loans with different statuses
- ✅ Persist status changes after page reload
- ✅ Complex workflows

### Auto-Decide (loan-auto-decide.spec.ts)
- ✅ Auto-approve loans meeting criteria (≤$100k, ≤60 months)
- ✅ Auto-reject loans exceeding limits
- ✅ Boundary testing (exact limits)
- ✅ Multiple loans with mixed outcomes

### Loan Deletion (loan-deletion.spec.ts)
- ✅ Delete single loan
- ✅ Delete from multiple positions (first, middle, last)
- ✅ Delete all loans sequentially
- ✅ Persist deletions after reload
- ✅ Only pending loans can be deleted

### Summary Statistics (loan-summary.spec.ts)
- ✅ Display correct counts for each status
- ✅ Update on loan creation
- ✅ Update on status changes
- ✅ Update on deletions
- ✅ Complex workflows
- ✅ Persist after reload

## CI/CD Integration

### GitHub Actions
The repository includes a workflow (`.github/workflows/playwright.yml`) that:
- Runs tests on manual trigger (`workflow_dispatch`)
- Supports headed/headless modes
- Generates HTML reports
- Uploads test artifacts

To run tests in GitHub Actions:
1. Go to Actions tab
2. Select "Playwright Tests" workflow
3. Click "Run workflow"
4. Choose headed/headless mode
5. View results and download artifacts

## Known Issues & Future Improvements

1. **Timing Sensitivity**: Some tests may be sensitive to timing issues, especially:
   - Form validation tests
   - Rapid consecutive operations
   
2. **Future Enhancements**:
   - Add visual regression testing
   - Add accessibility testing
   - Add cross-browser testing (currently Chrome only)
   - Add mobile viewport testing
   - Improve flaky test stability

## Debugging Failed Tests

```bash
# Run a specific test file
npx playwright test loan-creation.spec.ts

# Run a specific test by name
npx playwright test --grep "should create a loan"

# Debug mode with Playwright Inspector
npx playwright test --debug

# View trace for failed test
npx playwright show-trace test-results/path-to-trace.zip
```

## Configuration

Test configuration is in `playwright.config.ts`:
- **Base URL**: http://localhost:5173
- **Retries**: 2 retries on CI, 0 locally
- **Timeout**: Default Playwright timeouts
- **Workers**: 1 on CI, parallel locally
- **Reporter**: HTML + JSON + List

## Writing New Tests

Example test structure:

```typescript
import { test, expect } from './fixtures/test-fixtures'

test.describe('Feature Name', () => {
  test('should do something', async ({ cleanLoanPage }) => {
    await test.step('Setup', async () => {
      // Preparation steps
    })

    await test.step('Action', async () => {
      // Perform action
    })

    await test.step('Verify', async () => {
      // Assert expected outcome
    })
  })
})
```

## Contributing

When adding new tests:
1. Follow the existing Page Object Model pattern
2. Add UI text constants to `app-texts.ts`
3. Use descriptive test names
4. Include custom assertion messages
5. Handle async operations properly
6. Ensure tests are isolated and can run independently
