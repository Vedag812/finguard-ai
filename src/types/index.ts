// ==================== CORE TYPES ====================

export type RiskLevel = 'CRITICAL' | 'DANGER' | 'WATCH' | 'SAFE'
export type SignalStatus = 'CRITICAL' | 'HIGH' | 'MODERATE'
export type ToastType = 'success' | 'warning' | 'info'
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low'

// ==================== CUSTOMER TYPES ====================

export interface CustomerAlert {
  id: string
  name: string
  initials: string
  risk: number
  persona: string
  personaColor: string
  buffer: string
  bufferStatus: RiskLevel
  income: number
  behavior: number
  daysToEMI: number
  signals: string[]
  topSignal: string
  shap: string[]
  recommendation: string
  suitability: number
}

export interface Persona {
  name: string
  color: string
}

export interface PersonaData extends Persona {
  value: number
  pct: string
}

// ==================== SIGNAL TYPES ====================

export interface Signal {
  name: string
  intensity: number
  customers: number
  trend: 'up' | 'down' | 'stable'
}

export interface SignalIntelligence {
  signal: string
  intensity: number
  customers: number
  trend: number[]
  status: SignalStatus
}

export interface SignalDetail {
  name: string
  icon: string
  intensity: number
  customers: number
  desc: string
  firstDetected: string
  trend: number[]
}

// ==================== INTERVENTION TYPES ====================

export interface InterventionCard {
  name: string
  segment: string
  count: number
  suitability: number
  status: string
  statusColor: string
  roi: string
  cost: string
  prevented: string
  successRate: string
  desc: string
  primaryBtn: string
  secondaryBtn: string
  toast: string
}

// ==================== CHART DATA TYPES ====================

export interface TrendDataPoint {
  week: string
  riskScore: number
  alerts: number
  interventions: number
}

export interface TransactionData {
  week: string
  dining: number
  atm: number
  utilities: number
  emi: number
  lending: number
}

// ==================== TOAST TYPES ====================

export interface Toast {
  id: number
  title: string
  msg: string
  type: ToastType
}

// ==================== MODAL TYPES ====================

export interface FlagCustomerFormData {
  name: string
  id: string
  reason: string
  priority: Priority
}

export interface AlertSettings {
  thresholds: {
    critical: number
    high: number
    moderate: number
  }
  notifications: {
    email: boolean
    sms: boolean
    slack: boolean
  }
  autoEscalate: boolean
}

export interface ExportOptions {
  format: string
  sections: string[]
}

// ==================== NAVIGATION TYPES ====================

export interface NavItem {
  id: string
  icon: string
  label: string
  badge?: string
  sub: string
}

// ==================== COMPONENT PROP TYPES ====================

export interface KPICardProps {
  icon: string
  label: string
  value: string
  subtext: string
  barColor: string
  delay: number
}

export interface ToastProps {
  toasts: Toast[]
  remove: (id: number) => void
}

export interface SidebarProps {
  activePage: string
  setActivePage: (page: string) => void
  onFlagCustomer: () => void
  onExportReport: () => void
  onAlertSettings: () => void
}

export interface AlertsTableProps {
  addToast: (title: string, msg: string, type?: ToastType) => void
  onCustomerClick?: (customer: CustomerAlert) => void
}

export interface CustomerModalProps {
  customer: CustomerAlert
  onClose: () => void
  addToast: (title: string, msg: string, type?: ToastType) => void
}

export interface InterventionCardProps {
  data: InterventionCard
  delay: number
  addToast: (title: string, msg: string, type?: ToastType) => void
}

export interface Customer360PageProps {
  addToast: (title: string, msg: string, type?: ToastType) => void
  initialCustomer?: CustomerAlert
}
