import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoanSummary from '../src/components/LoanSummary.vue'
import type { LoanApplication } from '../src/types/loan'

describe('LoanSummary', () => {
  const createMockLoan = (overrides?: Partial<LoanApplication>): LoanApplication => ({
    id: 'default-id',
    applicantName: 'Test User',
    amount: 50000,
    termMonths: 24,
    interestRate: 0.08,
    status: 'pending',
    createdAt: '2024-01-01T00:00:00.000Z',
    ...overrides
  })

  it('renders all stat cards', () => {
    const wrapper = mount(LoanSummary, {
      props: { loans: [] }
    })
    
    const statCards = wrapper.findAll('.stat-card')
    expect(statCards).toHaveLength(5)
  })

  it('displays correct labels for all stats', () => {
    const wrapper = mount(LoanSummary, {
      props: { loans: [] }
    })
    
    const labels = wrapper.findAll('.stat-label')
    expect(labels[0]?.text()).toBe('Total Applications')
    expect(labels[1]?.text()).toBe('Pending')
    expect(labels[2]?.text()).toBe('Approved')
    expect(labels[3]?.text()).toBe('Rejected')
    expect(labels[4]?.text()).toBe('Total Approved')
  })

  it('shows zero for all stats when no loans', () => {
    const wrapper = mount(LoanSummary, {
      props: { loans: [] }
    })
    
    const values = wrapper.findAll('.stat-value')
    expect(values[0]?.text()).toBe('0')
    expect(values[1]?.text()).toBe('0')
    expect(values[2]?.text()).toBe('0')
    expect(values[3]?.text()).toBe('0')
    expect(values[4]?.text()).toBe('$0')
  })

  it('counts total applications correctly', () => {
    const loans = [
      createMockLoan({ id: '1' }),
      createMockLoan({ id: '2' }),
      createMockLoan({ id: '3' })
    ]
    
    const wrapper = mount(LoanSummary, {
      props: { loans }
    })
    
    const totalValue = wrapper.findAll('.stat-value')[0]
    expect(totalValue?.text()).toBe('3')
  })

  it('counts pending loans correctly', () => {
    const loans = [
      createMockLoan({ id: '1', status: 'pending' }),
      createMockLoan({ id: '2', status: 'pending' }),
      createMockLoan({ id: '3', status: 'approved' })
    ]
    
    const wrapper = mount(LoanSummary, {
      props: { loans }
    })
    
    const pendingValue = wrapper.findAll('.stat-value')[1]
    expect(pendingValue?.text()).toBe('2')
  })

  it('counts approved loans correctly', () => {
    const loans = [
      createMockLoan({ id: '1', status: 'approved' }),
      createMockLoan({ id: '2', status: 'approved' }),
      createMockLoan({ id: '3', status: 'pending' })
    ]
    
    const wrapper = mount(LoanSummary, {
      props: { loans }
    })
    
    const approvedValue = wrapper.findAll('.stat-value')[2]
    expect(approvedValue?.text()).toBe('2')
  })

  it('counts rejected loans correctly', () => {
    const loans = [
      createMockLoan({ id: '1', status: 'rejected' }),
      createMockLoan({ id: '2', status: 'rejected' }),
      createMockLoan({ id: '3', status: 'rejected' }),
      createMockLoan({ id: '4', status: 'approved' })
    ]
    
    const wrapper = mount(LoanSummary, {
      props: { loans }
    })
    
    const rejectedValue = wrapper.findAll('.stat-value')[3]
    expect(rejectedValue?.text()).toBe('3')
  })

  it('calculates total approved amount correctly', () => {
    const loans = [
      createMockLoan({ id: '1', status: 'approved', amount: 50000 }),
      createMockLoan({ id: '2', status: 'approved', amount: 75000 }),
      createMockLoan({ id: '3', status: 'pending', amount: 30000 })
    ]
    
    const wrapper = mount(LoanSummary, {
      props: { loans }
    })
    
    const totalAmountValue = wrapper.findAll('.stat-value')[4]
    expect(totalAmountValue?.text()).toBe('$125,000')
  })

  it('excludes pending and rejected loans from total approved amount', () => {
    const loans = [
      createMockLoan({ id: '1', status: 'approved', amount: 100000 }),
      createMockLoan({ id: '2', status: 'pending', amount: 50000 }),
      createMockLoan({ id: '3', status: 'rejected', amount: 75000 })
    ]
    
    const wrapper = mount(LoanSummary, {
      props: { loans }
    })
    
    const totalAmountValue = wrapper.findAll('.stat-value')[4]
    expect(totalAmountValue?.text()).toBe('$100,000')
  })

  it('formats currency without decimals', () => {
    const loans = [
      createMockLoan({ id: '1', status: 'approved', amount: 12345 })
    ]
    
    const wrapper = mount(LoanSummary, {
      props: { loans }
    })
    
    const totalAmountValue = wrapper.findAll('.stat-value')[4]
    expect(totalAmountValue?.text()).toBe('$12,345')
  })

  it('applies correct CSS classes to stat cards', () => {
    const wrapper = mount(LoanSummary, {
      props: { loans: [] }
    })
    
    const statCards = wrapper.findAll('.stat-card')
    expect(statCards[1]?.classes()).toContain('pending')
    expect(statCards[2]?.classes()).toContain('approved')
    expect(statCards[3]?.classes()).toContain('rejected')
    expect(statCards[4]?.classes()).toContain('amount')
  })

  it('handles single loan of each status', () => {
    const loans = [
      createMockLoan({ id: '1', status: 'pending', amount: 10000 }),
      createMockLoan({ id: '2', status: 'approved', amount: 20000 }),
      createMockLoan({ id: '3', status: 'rejected', amount: 30000 })
    ]
    
    const wrapper = mount(LoanSummary, {
      props: { loans }
    })
    
    const values = wrapper.findAll('.stat-value')
    expect(values[0]?.text()).toBe('3')
    expect(values[1]?.text()).toBe('1')
    expect(values[2]?.text()).toBe('1')
    expect(values[3]?.text()).toBe('1')
    expect(values[4]?.text()).toBe('$20,000')
  })

  it('updates when loans prop changes', async () => {
    const initialLoans = [
      createMockLoan({ id: '1', status: 'pending' })
    ]
    
    const wrapper = mount(LoanSummary, {
      props: { loans: initialLoans }
    })
    
    let values = wrapper.findAll('.stat-value')
    expect(values[0]?.text()).toBe('1')
    expect(values[1]?.text()).toBe('1')
    
    const updatedLoans = [
      createMockLoan({ id: '1', status: 'pending' }),
      createMockLoan({ id: '2', status: 'approved', amount: 50000 })
    ]
    
    await wrapper.setProps({ loans: updatedLoans })
    
    values = wrapper.findAll('.stat-value')
    expect(values[0]?.text()).toBe('2')
    expect(values[1]?.text()).toBe('1')
    expect(values[2]?.text()).toBe('1')
    expect(values[4]?.text()).toBe('$50,000')
  })

  it('calculates stats for large numbers correctly', () => {
    const statuses = ['approved', 'pending', 'rejected'];
    const loans = Array.from({ length: 100 }, (_, i) => 
      createMockLoan({ 
        id: `loan-${i}`, 
        status: statuses[i % statuses.length],
        amount: 10000
      })
    )
    
    const wrapper = mount(LoanSummary, {
      props: { loans }
    })
    
    const values = wrapper.findAll('.stat-value')
    expect(values[0]?.text()).toBe('100')
    
    // Calculate expected counts based on loan distribution
    const approvedCount = loans.filter(l => l.status === 'approved').length
    const pendingCount = loans.filter(l => l.status === 'pending').length
    const rejectedCount = loans.filter(l => l.status === 'rejected').length
    
    expect(values[1]?.text()).toBe(pendingCount.toString())
    expect(values[2]?.text()).toBe(approvedCount.toString())
    expect(values[3]?.text()).toBe(rejectedCount.toString())
    expect(values[4]?.text()).toBe(`$${(approvedCount * 10000).toLocaleString()}`)
  })

  it('handles loans with varying amounts in total approved', () => {
    const loans = [
      createMockLoan({ id: '1', status: 'approved', amount: 1 }),
      createMockLoan({ id: '2', status: 'approved', amount: 999999 }),
      createMockLoan({ id: '3', status: 'approved', amount: 500000 })
    ]
    
    const wrapper = mount(LoanSummary, {
      props: { loans }
    })
    
    const totalAmountValue = wrapper.findAll('.stat-value')[4]
    expect(totalAmountValue?.text()).toBe('$1,500,000')
  })

  it('renders with proper structure', () => {
    const wrapper = mount(LoanSummary, {
      props: { loans: [] }
    })
    
    expect(wrapper.find('.loan-summary').exists()).toBe(true)
    expect(wrapper.findAll('.stat-card')).toHaveLength(5)
    
    wrapper.findAll('.stat-card').forEach(card => {
      expect(card.find('.stat-value').exists()).toBe(true)
      expect(card.find('.stat-label').exists()).toBe(true)
    })
  })

  it('stat values have correct text color classes', () => {
    const wrapper = mount(LoanSummary, {
      props: { loans: [] }
    })
    
    const statCards = wrapper.findAll('.stat-card')
    
    // Check that special cards have their status classes
    expect(statCards[1]?.classes()).toContain('pending')
    expect(statCards[2]?.classes()).toContain('approved')
    expect(statCards[3]?.classes()).toContain('rejected')
    expect(statCards[4]?.classes()).toContain('amount')
  })

  it('handles only pending loans', () => {
    const loans = [
      createMockLoan({ id: '1', status: 'pending', amount: 10000 }),
      createMockLoan({ id: '2', status: 'pending', amount: 20000 }),
      createMockLoan({ id: '3', status: 'pending', amount: 30000 })
    ]
    
    const wrapper = mount(LoanSummary, {
      props: { loans }
    })
    
    const values = wrapper.findAll('.stat-value')
    expect(values[0]?.text()).toBe('3')
    expect(values[1]?.text()).toBe('3')
    expect(values[2]?.text()).toBe('0')
    expect(values[3]?.text()).toBe('0')
    expect(values[4]?.text()).toBe('$0')
  })

  it('handles only approved loans', () => {
    const loans = [
      createMockLoan({ id: '1', status: 'approved', amount: 15000 }),
      createMockLoan({ id: '2', status: 'approved', amount: 25000 })
    ]
    
    const wrapper = mount(LoanSummary, {
      props: { loans }
    })
    
    const values = wrapper.findAll('.stat-value')
    expect(values[0]?.text()).toBe('2')
    expect(values[1]?.text()).toBe('0')
    expect(values[2]?.text()).toBe('2')
    expect(values[3]?.text()).toBe('0')
    expect(values[4]?.text()).toBe('$40,000')
  })

  it('handles only rejected loans', () => {
    const loans = [
      createMockLoan({ id: '1', status: 'rejected', amount: 100000 }),
      createMockLoan({ id: '2', status: 'rejected', amount: 200000 })
    ]
    
    const wrapper = mount(LoanSummary, {
      props: { loans }
    })
    
    const values = wrapper.findAll('.stat-value')
    expect(values[0]?.text()).toBe('2')
    expect(values[1]?.text()).toBe('0')
    expect(values[2]?.text()).toBe('0')
    expect(values[3]?.text()).toBe('2')
    expect(values[4]?.text()).toBe('$0')
  })
})
