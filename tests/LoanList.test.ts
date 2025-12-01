import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoanList from '../src/components/LoanList.vue'
import type { LoanApplication } from '../src/types/loan'

describe('LoanList', () => {
  const mockLoans: LoanApplication[] = [
    {
      id: '1',
      applicantName: 'John Doe',
      amount: 50000,
      termMonths: 24,
      interestRate: 0.08,
      status: 'pending',
      createdAt: '2024-01-15T10:30:00.000Z'
    },
    {
      id: '2',
      applicantName: 'Jane Smith',
      amount: 75000,
      termMonths: 36,
      interestRate: 0.06,
      status: 'approved',
      createdAt: '2024-02-20T14:45:00.000Z'
    },
    {
      id: '3',
      applicantName: 'Bob Johnson',
      amount: 150000,
      termMonths: 72,
      interestRate: 0.09,
      status: 'rejected',
      createdAt: '2024-03-10T09:15:00.000Z'
    }
  ]

  it('renders the component with correct title', () => {
    const wrapper = mount(LoanList, {
      props: { loans: [] }
    })
    
    expect(wrapper.find('h2').text()).toBe('Loan Applications')
  })

  it('shows empty state when no loans', () => {
    const wrapper = mount(LoanList, {
      props: { loans: [] }
    })
    
    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.find('.empty-state p').text()).toBe('No loan applications yet. Create one using the form.')
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('renders table when loans are present', () => {
    const wrapper = mount(LoanList, {
      props: { loans: mockLoans }
    })
    
    expect(wrapper.find('.empty-state').exists()).toBe(false)
    expect(wrapper.find('table').exists()).toBe(true)
  })

  it('renders correct table headers', () => {
    const wrapper = mount(LoanList, {
      props: { loans: mockLoans }
    })
    
    const headers = wrapper.findAll('th')
    expect(headers).toHaveLength(8)
    expect(headers[0]?.text()).toBe('Applicant')
    expect(headers[1]?.text()).toBe('Amount')
    expect(headers[2]?.text()).toBe('Term')
    expect(headers[3]?.text()).toBe('Rate')
    expect(headers[4]?.text()).toBe('Monthly Payment')
    expect(headers[5]?.text()).toBe('Status')
    expect(headers[6]?.text()).toBe('Created')
    expect(headers[7]?.text()).toBe('Actions')
  })

  it('renders all loan applications', () => {
    const wrapper = mount(LoanList, {
      props: { loans: mockLoans }
    })
    
    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(3)
  })

  it('displays loan information correctly', () => {
    const wrapper = mount(LoanList, {
      props: { loans: [mockLoans[0]!] }
    })
    
    const cells = wrapper.findAll('tbody td')
    expect(cells[0]?.text()).toBe('John Doe')
    expect(cells[1]?.text()).toContain('$50,000')
    expect(cells[2]?.text()).toBe('24 mo')
    expect(cells[3]?.text()).toBe('8.0%')
    expect(cells[4]?.text()).toContain('$')
    expect(cells[5]?.text()).toContain('pending')
  })

  it('formats currency correctly', () => {
    const wrapper = mount(LoanList, {
      props: { loans: [mockLoans[0]!] }
    })
    
    const amountCell = wrapper.findAll('tbody td')[1]
    expect(amountCell?.text()).toBe('$50,000.00')
  })

  it('formats percentage correctly', () => {
    const wrapper = mount(LoanList, {
      props: { loans: [mockLoans[0]!] }
    })
    
    const rateCell = wrapper.findAll('tbody td')[3]
    expect(rateCell?.text()).toBe('8.0%')
  })

  it('formats date correctly', () => {
    const wrapper = mount(LoanList, {
      props: { loans: [mockLoans[0]!] }
    })
    
    const dateCell = wrapper.findAll('tbody td')[6]
    expect(dateCell?.text()).toMatch(/Jan 15, 2024/)
  })

  it('calculates and displays monthly payment', () => {
    const wrapper = mount(LoanList, {
      props: { loans: [mockLoans[0]!] }
    })
    
    // monthly = (50000 * 1.08) / 24 = 2250
    const paymentCell = wrapper.findAll('tbody td')[4]
    expect(paymentCell?.text()).toBe('$2,250.00')
  })

  it('applies correct status badge classes', () => {
    const wrapper = mount(LoanList, {
      props: { loans: mockLoans }
    })
    
    const statusBadges = wrapper.findAll('.status-badge')
    expect(statusBadges[0]?.classes()).toContain('status-pending')
    expect(statusBadges[1]?.classes()).toContain('status-approved')
    expect(statusBadges[2]?.classes()).toContain('status-rejected')
  })

  it('shows action buttons for pending loans', () => {
    const wrapper = mount(LoanList, {
      props: { loans: [mockLoans[0]!] }
    })
    
    const actionButtons = wrapper.findAll('.action-btn')
    expect(actionButtons).toHaveLength(3)
    expect(actionButtons[0]?.classes()).toContain('success')
    expect(actionButtons[1]?.classes()).toContain('danger')
    expect(actionButtons[2]?.classes()).toContain('secondary')
  })

  it('hides action buttons for approved loans', () => {
    const wrapper = mount(LoanList, {
      props: { loans: [mockLoans[1]!] }
    })
    
    const actionButtons = wrapper.findAll('.action-btn')
    expect(actionButtons).toHaveLength(0)
    expect(wrapper.find('.no-actions').exists()).toBe(true)
    expect(wrapper.find('.no-actions').text()).toBe('—')
  })

  it('hides action buttons for rejected loans', () => {
    const wrapper = mount(LoanList, {
      props: { loans: [mockLoans[2]!] }
    })
    
    const actionButtons = wrapper.findAll('.action-btn')
    expect(actionButtons).toHaveLength(0)
    expect(wrapper.find('.no-actions').exists()).toBe(true)
  })

  it('emits approve event when approve button is clicked', async () => {
    const wrapper = mount(LoanList, {
      props: { loans: [mockLoans[0]!] }
    })
    
    const approveButton = wrapper.findAll('.action-btn')[0]
    await approveButton?.trigger('click')
    
    expect(wrapper.emitted('approve')).toBeTruthy()
    expect(wrapper.emitted('approve')?.[0]).toEqual(['1'])
  })

  it('emits reject event when reject button is clicked', async () => {
    const wrapper = mount(LoanList, {
      props: { loans: [mockLoans[0]!] }
    })
    
    const rejectButton = wrapper.findAll('.action-btn')[1]
    await rejectButton?.trigger('click')
    
    expect(wrapper.emitted('reject')).toBeTruthy()
    expect(wrapper.emitted('reject')?.[0]).toEqual(['1'])
  })

  it('emits autoDecide event when auto-decide button is clicked', async () => {
    const wrapper = mount(LoanList, {
      props: { loans: [mockLoans[0]!] }
    })
    
    const autoDecideButton = wrapper.findAll('.action-btn')[2]
    await autoDecideButton?.trigger('click')
    
    expect(wrapper.emitted('autoDecide')).toBeTruthy()
    expect(wrapper.emitted('autoDecide')?.[0]).toEqual(['1'])
  })

  it('has correct button titles for accessibility', () => {
    const wrapper = mount(LoanList, {
      props: { loans: [mockLoans[0]!] }
    })
    
    const buttons = wrapper.findAll('.action-btn')
    expect(buttons[0]?.attributes('title')).toBe('Approve')
    expect(buttons[1]?.attributes('title')).toBe('Reject')
    expect(buttons[2]?.attributes('title')).toBe('Auto-decide')
  })

  it('displays button symbols correctly', () => {
    const wrapper = mount(LoanList, {
      props: { loans: [mockLoans[0]!] }
    })
    
    const buttons = wrapper.findAll('.action-btn')
    expect(buttons[0]?.text()).toBe('✓')
    expect(buttons[1]?.text()).toBe('✗')
    expect(buttons[2]?.text()).toBe('⚡')
  })

  it('handles multiple pending loans with separate actions', async () => {
    const pendingLoans: LoanApplication[] = [
      { ...mockLoans[0]!, id: 'loan1' },
      { ...mockLoans[0]!, id: 'loan2' }
    ]
    
    const wrapper = mount(LoanList, {
      props: { loans: pendingLoans }
    })
    
    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)
    
    const firstRowButtons = rows[0]?.findAll('.action-btn')
    await firstRowButtons?.[0]?.trigger('click')
    
    expect(wrapper.emitted('approve')?.[0]).toEqual(['loan1'])
  })

  it('renders loans in order provided by props', () => {
    const wrapper = mount(LoanList, {
      props: { loans: mockLoans }
    })
    
    const rows = wrapper.findAll('tbody tr')
    const firstRowName = rows[0]?.findAll('td')[0]?.text()
    const secondRowName = rows[1]?.findAll('td')[0]?.text()
    const thirdRowName = rows[2]?.findAll('td')[0]?.text()
    
    expect(firstRowName).toBe('John Doe')
    expect(secondRowName).toBe('Jane Smith')
    expect(thirdRowName).toBe('Bob Johnson')
  })

  it('calculates monthly payment for different interest rates', () => {
    const testLoan: LoanApplication = {
      id: 'test',
      applicantName: 'Test User',
      amount: 10000,
      termMonths: 10,
      interestRate: 0.1,
      status: 'pending',
      createdAt: '2024-01-01T00:00:00.000Z'
    }
    
    const wrapper = mount(LoanList, {
      props: { loans: [testLoan] }
    })
    
    // monthly = (10000 * 1.1) / 10 = 1100
    const paymentCell = wrapper.findAll('tbody td')[4]
    expect(paymentCell?.text()).toBe('$1,100.00')
  })

  it('handles zero interest rate correctly', () => {
    const testLoan: LoanApplication = {
      id: 'test',
      applicantName: 'Test User',
      amount: 12000,
      termMonths: 12,
      interestRate: 0,
      status: 'pending',
      createdAt: '2024-01-01T00:00:00.000Z'
    }
    
    const wrapper = mount(LoanList, {
      props: { loans: [testLoan] }
    })
    
    // monthly = (12000 * 1.0) / 12 = 1000
    const paymentCell = wrapper.findAll('tbody td')[4]
    expect(paymentCell?.text()).toBe('$1,000.00')
  })
})
