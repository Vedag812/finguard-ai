import type {
  Persona,
  PersonaData,
  Signal,
  SignalIntelligence,
  SignalDetail,
  InterventionCard,
  TrendDataPoint,
  TransactionData,
  CustomerAlert,
  RiskLevel
} from '@/types'

// ==================== NAME DATA ====================

export const firstNames = [
  "Priya", "Rahul", "Ananya", "Vikram", "Deepa", "Arjun", "Sneha", "Manoj", "Kavya", "Sanjay",
  "Preethi", "Arun", "Neha", "Amit", "Pooja", "Rajesh", "Sunita", "Vijay", "Meera", "Suresh",
  "Anita", "Kiran", "Ravi", "Divya", "Arun", "Lakshmi", "Ramesh", "Geeta", "Prakash", "Saroj",
  "Nitin", "Rekha", "Ashok", "Kavita", "Mohan", "Jyoti", "Sanjay", "Usha", "Dinesh", "Smita",
  "Ganesh", "Leela", "Harish", "Mala", "Rajendra", "Shanti", "Mukesh", "Kamla", "Sunil", "Bimla",
  "Anil", "Savita", "Pradeep", "Kanchan", "Devendra", "Meena", "Satish", "Shobha", "Madhur", "Babita",
  "Ajay", "Mamta", "Sachin", "Sangita", "Rohit", "Sadhana", "Pankaj", "Radha", "Mahesh", "Urmila",
  "Shyam", "Sheela", "Brijesh", "Nirmala", "Akhilesh", "Shashi", "Dharmendra", "Bhanu", "Yogesh", "Ambika",
  "Chandra", "Pushpa", "Rakesh", "Kalpana", "Tarun", "Madhu", "Rashmi", "Sridhar", "Prabha", "Vishal",
  "Asha", "Siddharth", "Kumari", "Pramod", "Bhavna", "Sagar", "Jayanti", "Ankur", "Vandana"
]

export const lastNames = [
  "Sharma", "Mehta", "Iyer", "Nair", "Kulkarni", "Desai", "Patil", "Tiwari", "Reddy", "Bose",
  "Nair", "Krishnan", "Gupta", "Singh", "Verma", "Joshi", "Agarwal", "Kumar", "Shah", "Patel",
  "Rao", "Menon", "Pillai", "Nambiar", "Varma", "Iyengar", "Subramaniam", "Chatterjee", "Banerjee", "Mukherjee",
  "Das", "Sarkar", "Ghosh", "Bhat", "Kaul", "Handa", "Madan", "Chadha", "Wadhwa", "Sachdev",
  "Sood", "Bhasin", "Advani", "Kapoor", "Malhotra", "Chopra", "Khanna", "Mehra", "Batra", "Khosla",
  "Sahni", "Bedi", "Thapar", "Ahuja", "Chadha", "Goel", "Goyal", "Bansal", "Mittal", "Aggarwal",
  "Arora", "Bhalla", "Chadha", "Dhawan", "Grover", "Kapoor", "Malik", "Narang", "Oberoi", "Puri",
  "Sarin", "Sehgal", "Sethi", "Taneja", "Vohra", "Walia", "Zutshi", "Bajaj", "Chauhan", "Dalal",
  "Easwaran", "Fernandes", "Ganesh", "Hegde", "Iyer", "Jain", "Kannan", "Luthra", "Madhav", "Nadar",
  "Oak", "Pai", "Qureshi", "Raghavan", "Saxena", "Trivedi", "Udupa", "Vaidya", "Warrier", "Xavier", "Yadav", "Zachariah"
]

// ==================== PERSONA DATA ====================

export const personas: Persona[] = [
  { name: "Temporary Shock", color: "#FB923C" },
  { name: "Structural Income Risk", color: "#F97316" },
  { name: "Chronic Overspender", color: "#C2410C" },
  { name: "Liquidity-Cash Poor", color: "#FDA365" },
  { name: "Overleveraged", color: "#7C2D12" },
]

export const personaData: PersonaData[] = [
  { name: "Temporary Shock", value: 34, pct: "34%", color: "#FB923C" },
  { name: "Structural Income Risk", value: 25, pct: "25%", color: "#F97316" },
  { name: "Chronic Overspender", value: 15, pct: "15%", color: "#C2410C" },
  { name: "Liquidity-Cash Poor", value: 16, pct: "16%", color: "#FDA365" },
  { name: "Overleveraged", value: 10, pct: "10%", color: "#7C2D12" },
]

// ==================== SIGNAL DATA ====================

export const signalOptions = [
  "Salary Delay", "Savings Drop", "ATM Spike", "UPI Lending", "Failed Debit",
  "CC Maxed", "Utility Late", "Spend Down", "Cashflow Gap", "Salary Timing", "Dining Spike", "CC Near Limit"
]

export const signals: Signal[] = [
  { name: "Salary Credit Delay", intensity: 78, customers: 67, trend: "up" },
  { name: "Savings Balance Decline", intensity: 65, customers: 52, trend: "up" },
  { name: "UPI → Lending Apps Spike", intensity: 71, customers: 45, trend: "up" },
  { name: "Utility Payment Delays", intensity: 54, customers: 38, trend: "stable" },
  { name: "Discretionary Spend Collapse", intensity: 83, customers: 71, trend: "up" },
  { name: "ATM Cash Withdrawal Spike", intensity: 47, customers: 24, trend: "down" },
  { name: "Failed Auto-Debit Attempts", intensity: 61, customers: 31, trend: "up" },
]

export const signalIntelligence: SignalIntelligence[] = [
  { signal: "Salary Credit Delay", intensity: 78, customers: 67, trend: [65, 68, 72, 78], status: "CRITICAL" },
  { signal: "Savings Balance Decline", intensity: 65, customers: 52, trend: [48, 52, 58, 65], status: "HIGH" },
  { signal: "UPI → Lending Apps", intensity: 71, customers: 45, trend: [55, 60, 64, 71], status: "HIGH" },
  { signal: "Utility Payment Delays", intensity: 54, customers: 38, trend: [51, 50, 53, 54], status: "MODERATE" },
  { signal: "Discretionary Spend Collapse", intensity: 83, customers: 71, trend: [60, 68, 74, 83], status: "CRITICAL" },
  { signal: "ATM Cash Withdrawal Spike", intensity: 47, customers: 24, trend: [52, 49, 48, 47], status: "MODERATE" },
  { signal: "Failed Auto-Debit Attempts", intensity: 61, customers: 31, trend: [41, 48, 55, 61], status: "HIGH" },
]

export const signalDetails: SignalDetail[] = [
  { name: "Salary Credit Delay", icon: "💰", intensity: 78, customers: 67, desc: "Salary not credited by expected date indicating employer issues", firstDetected: "Feb 10, 2026", trend: [65, 68, 72, 78] },
  { name: "Savings Balance Decline", icon: "📉", intensity: 65, customers: 52, desc: "Consistent reduction in savings account balance over 30 days", firstDetected: "Feb 8, 2026", trend: [48, 52, 58, 65] },
  { name: "UPI → Lending Apps", icon: "📱", intensity: 71, customers: 45, desc: "UPI transactions to digital lending platforms indicating distress borrowing", firstDetected: "Feb 12, 2026", trend: [55, 60, 64, 71] },
  { name: "Utility Payment Delays", icon: "⚡", intensity: 54, customers: 38, desc: "Delayed or missed utility bill payments showing cash flow stress", firstDetected: "Feb 5, 2026", trend: [51, 50, 53, 54] },
  { name: "Discretionary Spend Collapse", icon: "🛍", intensity: 83, customers: 71, desc: "Sharp reduction in discretionary spending indicating budget tightening", firstDetected: "Feb 9, 2026", trend: [60, 68, 74, 83] },
  { name: "ATM Cash Withdrawal Spike", icon: "🏧", intensity: 47, customers: 24, desc: "Unusual increase in ATM cash withdrawals may indicate hidden expenses", firstDetected: "Feb 11, 2026", trend: [52, 49, 48, 47] },
  { name: "Failed Auto-Debit Attempts", icon: "❌", intensity: 61, customers: 31, desc: "Insufficient funds for automatic EMI deductions", firstDetected: "Feb 13, 2026", trend: [41, 48, 55, 61] },
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

// ==================== INTERVENTION DATA ====================

import { C } from '@/lib/theme'

export const interventionCards: InterventionCard[] = [
  { name: "Payment Holiday", segment: "IT Sector — Temporary Shock", count: 34, suitability: 84, status: "STRONG FIT", statusColor: C.safe, roi: "2.9×", cost: "₹4.8L", prevented: "₹14L", successRate: "65%", desc: "Salary delay bridge — 2 months relief for IT layoff-affected customers", primaryBtn: "✓ Approve All 34", secondaryBtn: "→ Review Individually", toast: "Payment Holiday approved for 34 customers — processing initiated" },
  { name: "EMI Date Alignment", segment: "Liquidity-Cash Poor", count: 16, suitability: 91, status: "HIGHEST ROI", statusColor: C.orange, roi: "4.1×", cost: "₹1.2L", prevented: "₹4.9L", successRate: "72%", desc: "Move EMI from Day 5 to Day 15 — eliminates salary gap bounce charges", primaryBtn: "✓ Initiate Outreach", secondaryBtn: "→ Schedule Campaign", toast: "EMI Alignment outreach initiated for 16 customers" },
  { name: "Debt Consolidation", segment: "Overleveraged Customers", count: 10, suitability: 67, status: "RM REVIEW", statusColor: C.warning, roi: "1.8×", cost: "₹3.1L", prevented: "₹5.6L", successRate: "38%", desc: "Multiple lending app loans — bank consolidation offer to reduce total burden", primaryBtn: "→ Send to RM Queue", secondaryBtn: "⚙ Configure Criteria", toast: "10 accounts flagged and sent to RM review queue" },
  { name: "EMI Restructuring", segment: "Structural Income Risk", count: 25, suitability: 73, status: "MODERATE FIT", statusColor: C.orangeMid, roi: "2.2×", cost: "₹6.4L", prevented: "₹14L", successRate: "45%", desc: "Long-term income decline — reduce EMI by 30% over 12-month extension", primaryBtn: "✓ Approve Selected", secondaryBtn: "→ Run Suitability Check", toast: "EMI Restructuring approved — 25 accounts queued for processing" },
]

// ==================== TREND DATA ====================

export const trendData: TrendDataPoint[] = [
  { week: "Jan W1", riskScore: 41, alerts: 65, interventions: 24 },
  { week: "Jan W2", riskScore: 44, alerts: 71, interventions: 28 },
  { week: "Jan W3", riskScore: 42, alerts: 68, interventions: 25 },
  { week: "Jan W4", riskScore: 48, alerts: 78, interventions: 31 },
  { week: "Feb W1", riskScore: 51, alerts: 83, interventions: 34 },
  { week: "Feb W2", riskScore: 57, alerts: 92, interventions: 38 },
  { week: "Feb W3", riskScore: 63, alerts: 100, interventions: 42 },
]

// ==================== TRANSACTION DATA ====================

export const txData: TransactionData[] = [
  { week: "Week 1", dining: 4200, atm: 3000, utilities: 1800, emi: 12000, lending: 0 },
  { week: "Week 2", dining: 3100, atm: 4500, utilities: 1800, emi: 12000, lending: 2000 },
  { week: "Week 3", dining: 1800, atm: 6200, utilities: 2400, emi: 12000, lending: 3500 },
  { week: "Week 4", dining: 800, atm: 9100, utilities: 0, emi: 0, lending: 5000 },
]

// ==================== PORTFOLIO HEALTH ====================

export const portfolioHealth = [
  { label: 'Buffer Score', value: '1.3×', pct: 13, color: C.danger, status: '🔴 DANGER' },
  { label: 'Income Index', value: '52/100', pct: 52, color: C.warning, status: '🟡 MODERATE' },
  { label: 'Behavior Index', value: '71/100', pct: 71, color: C.orange, status: '🟠 CONCERN' },
]

// ==================== NAVIGATION ====================

export const navItems = [
  { id: 'overview', icon: '⬡', label: 'Portfolio Overview', sub: 'Live portfolio snapshot' },
  { id: 'alerts', icon: '⚠', label: 'Risk Alerts', badge: '100', sub: 'Active flags & signals' },
  { id: 'interventions', icon: '↗', label: 'Interventions', badge: '4', sub: 'Actions & approvals' },
  { id: 'trends', icon: '◎', label: 'Trends & Analytics', sub: '7-week performance' },
  { id: 'customer360', icon: '◈', label: 'Customer 360', sub: 'Individual deep-dive' },
  { id: 'signals', icon: '⚙', label: 'Signal Intelligence', sub: 'Stress signal engine' },
]

// ==================== DATA GENERATOR ====================

export function generateAlertsData(): CustomerAlert[] {
  const data: CustomerAlert[] = []
  for (let i = 0; i < 100; i++) {
    const persona = personas[Math.floor(Math.random() * personas.length)]
    const risk = Math.floor(Math.random() * 50) + 50 // 50-99
    const buffer = (Math.random() * 2.5 + 0.3).toFixed(1)
    const bufferStatus: RiskLevel = parseFloat(buffer) < 1 ? "CRITICAL" : parseFloat(buffer) < 1.5 ? "DANGER" : parseFloat(buffer) < 2 ? "WATCH" : "SAFE"
    const numSignals = Math.floor(Math.random() * 3) + 1
    const customerSignals: string[] = []
    for (let j = 0; j < numSignals; j++) {
      const sig = signalOptions[Math.floor(Math.random() * signalOptions.length)]
      if (!customerSignals.includes(sig)) customerSignals.push(sig)
    }
    const shapPts = [
      Math.floor(Math.random() * 15) + 20,
      Math.floor(Math.random() * 15) + 15,
      Math.floor(Math.random() * 10) + 10,
    ]
    data.push({
      id: `CUS-${String(412 + i).padStart(5, '0')}`,
      name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
      initials: `${firstNames[i % firstNames.length][0]}${lastNames[i % lastNames.length][0]}`,
      risk,
      persona: persona.name,
      personaColor: persona.color,
      buffer: `${buffer}×`,
      bufferStatus,
      income: Math.floor(Math.random() * 60) + 20,
      behavior: Math.floor(Math.random() * 50) + 40,
      daysToEMI: Math.floor(Math.random() * 28) + 1,
      signals: customerSignals,
      topSignal: customerSignals[0] || "N/A",
      shap: [`Primary factor: +${shapPts[0]}pts`, `Secondary: +${shapPts[1]}pts`, `Tertiary: +${shapPts[2]}pts`],
      recommendation: recommendations[Math.floor(Math.random() * recommendations.length)],
      suitability: Math.floor(Math.random() * 40) + 50,
    })
  }
  return data.sort((a, b) => b.risk - a.risk)
}

// Single instance of generated data
export const alertsData = generateAlertsData()
