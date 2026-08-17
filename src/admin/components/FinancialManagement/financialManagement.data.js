export const FINANCIAL_OVERVIEW = {
  platformGmv: 12.5,
  netCommissions: 1.2,
  escrowFunds: 0.85,
  totalPayouts: 10.4,
  payoutHealth: [
    { label: 'Pending Approval', value: 24, color: 'yellow' },
    { label: 'Processing (Bank)', value: 12, color: 'blue' },
    { label: 'Failed Transfers', value: 3, color: 'red' },
  ],
  chartData: [
    { month: 'Jan', value: 5 },
    { month: 'Feb', value: 7 },
    { month: 'Mar', value: 6 },
    { month: 'Apr', value: 9 },
    { month: 'May', value: 11 },
    { month: 'Jun', value: 14 },
  ],
  payouts: [
    { id: 't1', name: 'TechFront Electronics', vendorId: 'SEL-8932', amount: '$4,250.00', bank: 'Chase Bank ****4592', date: 'Oct 24, 2023', status: 'Pending' },
    { id: 't2', name: 'Artisan Goods Co.', vendorId: 'SEL-8831', amount: '$3,100.00', bank: 'Wells Fargo ****1190', date: 'Oct 24, 2023', status: 'Processing' },
    { id: 't3', name: 'Bright Desk', vendorId: 'SEL-8903', amount: '$1,980.00', bank: 'Bank of America ****2211', date: 'Oct 22, 2023', status: 'Approved' },
  ],
};
