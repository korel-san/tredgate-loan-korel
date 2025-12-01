import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LoanForm from '../src/components/LoanForm.vue'
import * as loanService from '../src/services/loanService'

// Mock loanService
vi.mock('../src/services/loanService', () => ({
  createLoanApplication: vi.fn()
}))

describe('LoanForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the form correctly', () => {
    const wrapper = mount(LoanForm)
    
    expect(wrapper.find('h2').text()).toBe('New Loan Application')
    expect(wrapper.find('#applicantName').exists()).toBe(true)
    expect(wrapper.find('#amount').exists()).toBe(true)
    expect(wrapper.find('#termMonths').exists()).toBe(true)
    expect(wrapper.find('#interestRate').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('shows error when applicant name is empty', async () => {
    const wrapper = mount(LoanForm)
    
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.find('.error-message').text()).toBe('Applicant name is required')
  })

  it('shows error when amount is not provided', async () => {
    const wrapper = mount(LoanForm)
    
    await wrapper.find('#applicantName').setValue('John Doe')
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.find('.error-message').text()).toBe('Amount must be greater than 0')
  })

  it('shows error when amount is zero or negative', async () => {
    const wrapper = mount(LoanForm)
    
    await wrapper.find('#applicantName').setValue('John Doe')
    await wrapper.find('#amount').setValue(0)
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.find('.error-message').text()).toBe('Amount must be greater than 0')
  })

  it('shows error when term months is not provided', async () => {
    const wrapper = mount(LoanForm)
    
    await wrapper.find('#applicantName').setValue('John Doe')
    await wrapper.find('#amount').setValue(50000)
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.find('.error-message').text()).toBe('Term months must be greater than 0')
  })

  it('shows error when term months is zero or negative', async () => {
    const wrapper = mount(LoanForm)
    
    await wrapper.find('#applicantName').setValue('John Doe')
    await wrapper.find('#amount').setValue(50000)
    await wrapper.find('#termMonths').setValue(0)
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.find('.error-message').text()).toBe('Term months must be greater than 0')
  })

  it('shows error when interest rate is not provided', async () => {
    const wrapper = mount(LoanForm)
    
    await wrapper.find('#applicantName').setValue('John Doe')
    await wrapper.find('#amount').setValue(50000)
    await wrapper.find('#termMonths').setValue(24)
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.find('.error-message').text()).toBe('Interest rate is required and cannot be negative')
  })

  it('shows error when interest rate is negative', async () => {
    const wrapper = mount(LoanForm)
    
    await wrapper.find('#applicantName').setValue('John Doe')
    await wrapper.find('#amount').setValue(50000)
    await wrapper.find('#termMonths').setValue(24)
    await wrapper.find('#interestRate').setValue(-0.05)
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.find('.error-message').text()).toBe('Interest rate is required and cannot be negative')
  })

  it('successfully submits valid form data', async () => {
    const mockCreateLoan = vi.mocked(loanService.createLoanApplication)
    mockCreateLoan.mockReturnValue({
      id: 'test-id',
      applicantName: 'John Doe',
      amount: 50000,
      termMonths: 24,
      interestRate: 0.08,
      status: 'pending',
      createdAt: new Date().toISOString()
    })

    const wrapper = mount(LoanForm)
    
    await wrapper.find('#applicantName').setValue('John Doe')
    await wrapper.find('#amount').setValue(50000)
    await wrapper.find('#termMonths').setValue(24)
    await wrapper.find('#interestRate').setValue(0.08)
    
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(mockCreateLoan).toHaveBeenCalledWith({
      applicantName: 'John Doe',
      amount: 50000,
      termMonths: 24,
      interestRate: 0.08
    })
    expect(wrapper.find('.error-message').exists()).toBe(false)
  })

  it('emits created event on successful submission', async () => {
    const mockCreateLoan = vi.mocked(loanService.createLoanApplication)
    mockCreateLoan.mockReturnValue({
      id: 'test-id',
      applicantName: 'Jane Smith',
      amount: 75000,
      termMonths: 36,
      interestRate: 0.06,
      status: 'pending',
      createdAt: new Date().toISOString()
    })

    const wrapper = mount(LoanForm)
    
    await wrapper.find('#applicantName').setValue('Jane Smith')
    await wrapper.find('#amount').setValue(75000)
    await wrapper.find('#termMonths').setValue(36)
    await wrapper.find('#interestRate').setValue(0.06)
    
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.emitted('created')).toBeTruthy()
    expect(wrapper.emitted('created')).toHaveLength(1)
  })

  it('resets form fields after successful submission', async () => {
    const mockCreateLoan = vi.mocked(loanService.createLoanApplication)
    mockCreateLoan.mockReturnValue({
      id: 'test-id',
      applicantName: 'Test User',
      amount: 30000,
      termMonths: 12,
      interestRate: 0.05,
      status: 'pending',
      createdAt: new Date().toISOString()
    })

    const wrapper = mount(LoanForm)
    
    await wrapper.find('#applicantName').setValue('Test User')
    await wrapper.find('#amount').setValue(30000)
    await wrapper.find('#termMonths').setValue(12)
    await wrapper.find('#interestRate').setValue(0.05)
    
    await wrapper.find('form').trigger('submit.prevent')
    
    expect((wrapper.find('#applicantName').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('#amount').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('#termMonths').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('#interestRate').element as HTMLInputElement).value).toBe('')
  })

  it('handles service error gracefully', async () => {
    const mockCreateLoan = vi.mocked(loanService.createLoanApplication)
    mockCreateLoan.mockImplementation(() => {
      throw new Error('Database error')
    })

    const wrapper = mount(LoanForm)
    
    await wrapper.find('#applicantName').setValue('Test User')
    await wrapper.find('#amount').setValue(30000)
    await wrapper.find('#termMonths').setValue(12)
    await wrapper.find('#interestRate').setValue(0.05)
    
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.find('.error-message').text()).toBe('Database error')
    expect(wrapper.emitted('created')).toBeFalsy()
  })

  it('trims whitespace from applicant name', async () => {
    const mockCreateLoan = vi.mocked(loanService.createLoanApplication)
    mockCreateLoan.mockReturnValue({
      id: 'test-id',
      applicantName: 'Trimmed Name',
      amount: 40000,
      termMonths: 18,
      interestRate: 0.07,
      status: 'pending',
      createdAt: new Date().toISOString()
    })

    const wrapper = mount(LoanForm)
    
    await wrapper.find('#applicantName').setValue('  Trimmed Name  ')
    await wrapper.find('#amount').setValue(40000)
    await wrapper.find('#termMonths').setValue(18)
    await wrapper.find('#interestRate').setValue(0.07)
    
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(mockCreateLoan).toHaveBeenCalledWith({
      applicantName: 'Trimmed Name',
      amount: 40000,
      termMonths: 18,
      interestRate: 0.07
    })
  })

  it('displays correct labels for all form fields', () => {
    const wrapper = mount(LoanForm)
    
    const labels = wrapper.findAll('label')
    expect(labels[0]?.text()).toBe('Applicant Name')
    expect(labels[1]?.text()).toBe('Loan Amount ($)')
    expect(labels[2]?.text()).toBe('Term (Months)')
    expect(labels[3]?.text()).toBe('Interest Rate (e.g., 0.08 for 8%)')
  })

  it('has correct input types and attributes', () => {
    const wrapper = mount(LoanForm)
    
    const nameInput = wrapper.find('#applicantName')
    expect(nameInput.attributes('type')).toBe('text')
    expect(nameInput.attributes('required')).toBeDefined()
    
    const amountInput = wrapper.find('#amount')
    expect(amountInput.attributes('type')).toBe('number')
    expect(amountInput.attributes('min')).toBe('1')
    expect(amountInput.attributes('required')).toBeDefined()
    
    const termInput = wrapper.find('#termMonths')
    expect(termInput.attributes('type')).toBe('number')
    expect(termInput.attributes('min')).toBe('1')
    expect(termInput.attributes('required')).toBeDefined()
    
    const rateInput = wrapper.find('#interestRate')
    expect(rateInput.attributes('type')).toBe('number')
    expect(rateInput.attributes('min')).toBe('0')
    expect(rateInput.attributes('max')).toBe('1')
    expect(rateInput.attributes('required')).toBeDefined()
  })
})
