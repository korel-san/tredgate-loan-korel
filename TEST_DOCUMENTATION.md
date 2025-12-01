# Test Documentation

This document describes the testing setup, test coverage, and how to use the testing framework for the Tredgate Loan application.

## Overview

The application uses **Vitest** as the testing framework, which is specifically designed for Vite-based projects like this Vue 3 application. Vitest is compatible with Jest's API but offers better performance and native ES modules support.

## Technology Stack

- **Vitest** - Fast unit test framework
- **@vue/test-utils** - Official Vue testing utilities
- **@vitest/ui** - Interactive UI for test visualization
- **@vitest/coverage-v8** - Code coverage reporting using V8
- **jsdom** - DOM implementation for Node.js (test environment)

## Test Coverage

The test suite provides comprehensive coverage for all application features:

### 1. Service Layer Tests (`tests/loanService.test.ts`)
Tests for business logic in `src/services/loanService.ts`:

- **getLoans()** - Loading loans from localStorage
- **saveLoans()** - Persisting loans to localStorage
- **createLoanApplication()** - Creating new loan applications with validation
- **updateLoanStatus()** - Updating loan status (approve/reject)
- **calculateMonthlyPayment()** - Monthly payment calculations
- **autoDecideLoan()** - Automatic loan decision logic

**Coverage**: 19 test cases covering all edge cases, error handling, and business rules.

### 2. LoanForm Component Tests (`tests/LoanForm.test.ts`)
Tests for `src/components/LoanForm.vue`:

- Form rendering and structure
- Input validation (name, amount, term, interest rate)
- Error message display
- Form submission with valid data
- Form reset after submission
- Event emission on successful creation
- Error handling from service layer
- Input trimming and sanitization

**Coverage**: 15 test cases covering UI interaction, validation, and integration with services.

### 3. LoanList Component Tests (`tests/LoanList.test.ts`)
Tests for `src/components/LoanList.vue`:

- Empty state display
- Table rendering with loan data
- Data formatting (currency, percentage, dates)
- Monthly payment calculation display
- Status badge styling
- Action buttons for pending loans
- Event emission for approve/reject/auto-decide actions
- Accessibility attributes
- Multiple loan handling

**Coverage**: 23 test cases covering display logic, user interactions, and edge cases.

### 4. LoanSummary Component Tests (`tests/LoanSummary.test.ts`)
Tests for `src/components/LoanSummary.vue`:

- Stat card rendering
- Counting loans by status (pending, approved, rejected)
- Total approved amount calculation
- Dynamic updates when props change
- Currency formatting
- CSS class application
- Edge cases (empty, single status, large numbers)

**Coverage**: 20 test cases covering statistics calculation and display.

## Code Coverage Metrics

Current coverage (as of latest run):
- **Overall**: 99.09% statements, 97.56% branches, 100% functions
- **Components**: 100% coverage across all Vue components
- **Services**: 97.61% coverage of business logic

## Running Tests

### Basic Test Commands

```bash
# Run all tests once
npm run test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Open interactive UI for tests
npm run test:ui
```

### Test Output

Tests generate multiple output formats:

1. **Console Output** - Real-time test results in terminal
2. **HTML Report** - Interactive test report in `test-results/index.html`
3. **JSON Report** - Machine-readable results in `test-results/results.json`
4. **Coverage Report** - HTML coverage report in `coverage/index.html`

### Viewing Reports

To view the HTML test report:
```bash
npx vite preview --outDir test-results
```

To view the coverage report:
```bash
npx vite preview --outDir coverage
```

## Writing New Tests

### Test File Structure

Tests follow this naming convention:
- Component tests: `ComponentName.test.ts`
- Service tests: `serviceName.test.ts`

### Test Organization

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup code that runs before each test
  })

  it('describes what the test does', () => {
    // Arrange - set up test data
    // Act - perform actions
    // Assert - verify results
    expect(actual).toBe(expected)
  })
})
```

### Mocking

For testing components that use services, use Vitest's mocking:

```typescript
import * as myService from '../src/services/myService'

vi.mock('../src/services/myService', () => ({
  myFunction: vi.fn()
}))

// In test
const mockFn = vi.mocked(myService.myFunction)
mockFn.mockReturnValue('mocked value')
```

### Testing Vue Components

```typescript
import { mount } from '@vue/test-utils'
import MyComponent from '../src/components/MyComponent.vue'

const wrapper = mount(MyComponent, {
  props: { /* props here */ }
})

// Query elements
wrapper.find('button')
wrapper.findAll('.class-name')

// Interact with elements
await wrapper.find('input').setValue('value')
await wrapper.find('button').trigger('click')

// Check emitted events
expect(wrapper.emitted('eventName')).toBeTruthy()
```

## Best Practices

### 1. Test Isolation
- Each test should be independent
- Use `beforeEach` to reset state
- Mock external dependencies (localStorage, services)

### 2. Descriptive Test Names
- Use clear, descriptive test names
- Follow pattern: "should [expected behavior] when [condition]"

### 3. Arrange-Act-Assert Pattern
- **Arrange**: Set up test data and conditions
- **Act**: Execute the code being tested
- **Assert**: Verify the expected outcome

### 4. Test Both Happy and Error Paths
- Test successful operations
- Test validation errors
- Test edge cases (empty data, null values, etc.)

### 5. Component Testing
- Test user interactions, not implementation details
- Focus on what users see and do
- Test event emissions and prop changes

### 6. Keep Tests Simple
- One assertion per test when possible
- Avoid complex logic in tests
- Tests should be easy to read and understand

## Continuous Integration

Tests are automatically run in GitHub Actions on:
- Every pull request to main branch
- Every push to main branch

The CI workflow:
1. Installs dependencies
2. Runs linter
3. Runs all tests with HTML reporting
4. Generates coverage reports
5. Uploads test results as artifacts
6. Displays summary in workflow

## Troubleshooting

### Tests fail locally but pass in CI (or vice versa)
- Ensure dependencies are up to date: `npm install`
- Check Node.js version matches CI
- Clear cache: `rm -rf node_modules coverage test-results && npm install`

### Coverage not meeting thresholds
- Check `vitest.config.ts` for coverage thresholds
- Run `npm run test:coverage` to see uncovered lines
- Add tests for uncovered code paths

### Flaky tests
- Ensure tests are isolated and don't depend on execution order
- Use proper async/await for asynchronous operations
- Check for timing issues in component interactions

### Mock not working
- Verify mock is set up before importing the module
- Use `vi.clearAllMocks()` in `beforeEach`
- Check that mock path matches import path

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils Documentation](https://test-utils.vuejs.org/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Maintenance

Tests should be updated when:
- Adding new features or components
- Modifying existing functionality
- Fixing bugs (add regression tests)
- Refactoring code

Aim to maintain >80% code coverage across all metrics.
