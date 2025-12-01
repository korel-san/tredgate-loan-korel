/**
 * Application text constants for Playwright tests
 * All UI text used in tests should be defined here to avoid hardcoding
 */

export const AppTexts = {
  // Header
  APP_TITLE: 'Tredgate Loan',
  APP_TAGLINE: 'Simple loan application management',

  // Loan Form
  FORM_TITLE: 'New Loan Application',
  FORM_LABEL_APPLICANT: 'Applicant Name',
  FORM_LABEL_AMOUNT: 'Loan Amount ($)',
  FORM_LABEL_TERM: 'Term (Months)',
  FORM_LABEL_INTEREST: 'Interest Rate (e.g., 0.08 for 8%)',
  FORM_BUTTON_SUBMIT: 'Create Application',
  FORM_PLACEHOLDER_APPLICANT: 'Enter applicant name',
  FORM_PLACEHOLDER_AMOUNT: 'Enter loan amount',
  FORM_PLACEHOLDER_TERM: 'Enter term in months',
  FORM_PLACEHOLDER_INTEREST: 'Enter interest rate',

  // Loan List
  LIST_TITLE: 'Loan Applications',
  LIST_EMPTY_STATE: 'No loan applications yet. Create one using the form.',
  LIST_HEADER_APPLICANT: 'Applicant',
  LIST_HEADER_AMOUNT: 'Amount',
  LIST_HEADER_TERM: 'Term',
  LIST_HEADER_RATE: 'Rate',
  LIST_HEADER_PAYMENT: 'Monthly Payment',
  LIST_HEADER_STATUS: 'Status',
  LIST_HEADER_CREATED: 'Created',
  LIST_HEADER_ACTIONS: 'Actions',

  // Status
  STATUS_PENDING: 'pending',
  STATUS_APPROVED: 'approved',
  STATUS_REJECTED: 'rejected',

  // Button titles
  BTN_TITLE_APPROVE: 'Approve',
  BTN_TITLE_REJECT: 'Reject',
  BTN_TITLE_AUTO_DECIDE: 'Auto-decide',
  BTN_TITLE_DELETE: 'Delete',

  // Delete confirmation
  DELETE_CONFIRMATION: 'Are you sure you want to delete this loan application? This action cannot be undone.',

  // Summary
  SUMMARY_TITLE: 'Summary',
  SUMMARY_TOTAL_APPS: 'Total Applications',
  SUMMARY_PENDING: 'Pending',
  SUMMARY_APPROVED: 'Approved',
  SUMMARY_REJECTED: 'Rejected',
  SUMMARY_TOTAL_AMOUNT: 'Total Amount',
} as const
