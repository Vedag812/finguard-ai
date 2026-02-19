import type { Persona } from '@/types'
import { colors } from '@/styles/theme'

// ==================== PERSONAS ====================

export const personas: Persona[] = [
  { name: "Temporary Shock", color: "#FB923C" },
  { name: "Structural Income Risk", color: "#F97316" },
  { name: "Chronic Overspender", color: "#C2410C" },
  { name: "Liquidity-Cash Poor", color: "#FDA365" },
  { name: "Overleveraged", color: "#7C2D12" },
]

// ==================== SIGNAL OPTIONS ====================

export const signalOptions = [
  "Salary Delay",
  "Savings Drop",
  "ATM Spike",
  "UPI Lending",
  "Failed Debit",
  "CC Maxed",
  "Utility Late",
  "Spend Down",
  "Cashflow Gap",
  "Salary Timing",
  "Dining Spike",
  "CC Near Limit"
]

// ==================== RECOMMENDATIONS ====================

export const recommendations = [
  "Payment Holiday — 2 months",
  "Debt Consolidation",
  "EMI Restructuring",
  "Financial Coach",
  "EMI Date Alignment",
  "Payment Holiday — 1 month"
]

// ==================== NAV ITEMS ====================

export const navItems = [
  { id: 'overview', icon: '⬡', label: 'Portfolio Overview', sub: 'Live portfolio snapshot' },
  { id: 'alerts', icon: '⚠', label: 'Risk Alerts', badge: '100', sub: 'Active flags & signals' },
  { id: 'interventions', icon: '↗', label: 'Interventions', badge: '4', sub: 'Actions & approvals' },
  { id: 'trends', icon: '◎', label: 'Trends & Analytics', sub: '7-week performance' },
  { id: 'customer360', icon: '◈', label: 'Customer 360', sub: 'Individual deep-dive' },
  { id: 'signals', icon: '⚙', label: 'Signal Intelligence', sub: 'Stress signal engine' },
]

// ==================== PORTFOLIO HEALTH ====================

export const portfolioHealth = [
  { label: 'Buffer Score', value: '1.3×', pct: 13, color: colors.danger, status: '🔴 DANGER' },
  { label: 'Income Index', value: '52/100', pct: 52, color: colors.warning, status: '🟡 MODERATE' },
  { label: 'Behavior Index', value: '71/100', pct: 71, color: colors.orange, status: '🟠 CONCERN' },
]

// ==================== APP INFO ====================

export const appInfo = {
  name: 'FinGuard AI',
  version: 'v2.4.1',
  modelAuc: '0.78',
  bank: 'Barclays',
  date: 'Feb 17, 2026',
}

// ==================== FLAG REASONS ====================

export const flagReasons = [
  { value: "Salary Delay", label: "Salary Delay" },
  { value: "Savings Decline", label: "Savings Decline" },
  { value: "Multiple Lending App Usage", label: "Multiple Lending App Usage" },
  { value: "Utility Payment Issues", label: "Utility Payment Issues" },
  { value: "Abnormal ATM Withdrawals", label: "Abnormal ATM Withdrawals" },
  { value: "EMI Default Risk", label: "EMI Default Risk" },
  { value: "Manual Review Request", label: "Manual Review Request" },
]

// ==================== EXPORT SECTIONS ====================

export const exportSections = [
  { id: 'alerts', label: 'Risk Alerts Data', count: '100 records' },
  { id: 'interventions', label: 'Intervention Recommendations', count: '4 items' },
  { id: 'signals', label: 'Signal Intelligence', count: '7 signals' },
  { id: 'trends', label: 'Trend Analytics', count: '7 weeks' },
  { id: 'personas', label: 'Customer Personas', count: '5 segments' },
]

// ==================== FILTER OPTIONS ====================

export const personaFilterOptions = [
  { value: "All", label: "All Personas" },
  { value: "Temporary Shock", label: "Temporary Shock" },
  { value: "Structural Income Risk", label: "Structural Income Risk" },
  { value: "Chronic Overspender", label: "Chronic Overspender" },
  { value: "Liquidity-Cash Poor", label: "Liquidity-Cash Poor" },
  { value: "Overleveraged", label: "Overleveraged" },
]

export const riskFilterOptions = [
  { value: "All", label: "All Levels" },
  { value: "Critical", label: "Critical 80+" },
  { value: "High", label: "High 60-79" },
  { value: "Moderate", label: "Moderate 40-59" },
]

export const emiFilterOptions = [
  { value: "All", label: "All" },
  { value: "≤5 days", label: "≤5 Days" },
  { value: "6-10 days", label: "6-10 Days" },
  { value: "11+ days", label: "11+ Days" },
]

export const sortOptions = [
  { value: "risk_desc", label: "Highest Risk" },
  { value: "risk_asc", label: "Lowest Risk" },
  { value: "emi_asc", label: "EMI Soonest" },
  { value: "buffer_asc", label: "Buffer Lowest" },
]
