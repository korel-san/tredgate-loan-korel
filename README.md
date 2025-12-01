# Tredgate Loan

A simple loan application management demo built with Vue 3, TypeScript, and Vite.

## Overview

Tredgate Loan is a frontend-only demo application used for training on GitHub Copilot features. It demonstrates a small, realistic frontend project without any backend server or external database.

## Features

- Create loan applications with applicant name, amount, term, and interest rate
- View all loan applications in a table
- Approve or reject loan applications manually
- Auto-decide loans based on simple business rules:
  - Approved if amount ≤ $100,000 AND term ≤ 60 months
  - Rejected otherwise
- Calculate monthly payments
- View summary statistics

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Vitest** - Unit testing framework
- **ESLint** - Code linting

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Open interactive test UI
npm run test:ui
```

See [TEST_DOCUMENTATION.md](TEST_DOCUMENTATION.md) for comprehensive testing guide.

### Linting

```bash
npm run lint
```

## Test Coverage

The project has comprehensive test coverage:
- **77 unit tests** across all components and services
- **99%+ code coverage** (statements, branches, functions)
- Tests for LoanForm, LoanList, LoanSummary components
- Tests for loanService business logic

Test reports are generated in HTML and JSON formats in the `test-results/` directory.
Coverage reports are available in the `coverage/` directory.

## Project Structure

```
src/
├── assets/           # Global CSS styles
├── components/       # Vue components
│   ├── LoanForm.vue     # Form to create new loans
│   ├── LoanList.vue     # Table of loan applications
│   └── LoanSummary.vue  # Statistics display
├── services/         # Business logic
│   └── loanService.ts   # Loan operations
├── types/            # TypeScript definitions
│   └── loan.ts          # Loan domain types
├── App.vue           # Main application component
└── main.ts           # Application entry point
tests/
├── LoanForm.test.ts      # LoanForm component tests
├── LoanList.test.ts      # LoanList component tests
├── LoanSummary.test.ts   # LoanSummary component tests
└── loanService.test.ts   # Service layer tests
```

## Data Persistence

All data is stored in the browser's localStorage under the key `tredgate_loans`. No backend server or external database is used.

## License

MIT
