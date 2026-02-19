// ==================== COLOR SYSTEM ====================

export const colors = {
  bg: "#070707",
  sidebar: "#0A0A0A",
  card: "#101010",
  cardHover: "#161616",
  border: "#1C1C1C",
  borderActive: "#F97316",
  orange: "#F97316",
  orangeDark: "#C2410C",
  orangeDeep: "#7C2D12",
  orangeMid: "#FB923C",
  orangePale: "#FED7AA",
  orangeGlow: "rgba(249,115,22,0.12)",
  orangeGlowHi: "rgba(249,115,22,0.25)",
  text: "#F0EEE8",
  textSub: "#9CA3AF",
  textMuted: "#4B5563",
  danger: "#EF4444",
  warning: "#EAB308",
  safe: "#22C55E",
  dangerBg: "rgba(239,68,68,0.10)",
  warningBg: "rgba(234,179,8,0.10)",
  safeBg: "rgba(34,197,94,0.10)",
  barcBlue: "#00AEEF",
} as const

// Shorthand alias for convenience
export const C = colors

// ==================== TYPOGRAPHY STYLES ====================

export const fonts = {
  sans: '"DM Sans"',
  condensed: '"Barlow Condensed"',
  mono: '"JetBrains Mono"',
} as const

export const textStyles = {
  // Headings
  h1: {
    fontFamily: fonts.condensed,
    fontWeight: 800,
    fontSize: 32,
    color: colors.text,
  } as const,
  h2: {
    fontFamily: fonts.condensed,
    fontWeight: 700,
    fontSize: 22,
    color: colors.text,
  } as const,
  h3: {
    fontFamily: fonts.condensed,
    fontWeight: 600,
    fontSize: 17,
    color: colors.text,
  } as const,
  
  // Body text
  body: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.text,
  } as const,
  bodyLarge: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.orangePale,
    lineHeight: 1.7,
  } as const,
  label: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.textSub,
  } as const,
  labelSmall: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  } as const,
  
  // Numeric
  mono: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.textSub,
  } as const,
  monoSmall: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textMuted,
  } as const,
  monoLarge: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.text,
  } as const,
} as const

// ==================== LAYOUT STYLES ====================

export const layout = {
  topBarHeight: 56,
  sidebarWidth: 260,
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
} as const

// ==================== CARD STYLES ====================

export const cardStyle = {
  background: colors.card,
  border: `1px solid ${colors.border}`,
  borderRadius: 12,
  transition: 'border-color 0.2s, box-shadow 0.2s',
} as const

export const cardHoverStyle = {
  ...cardStyle,
  ':hover': {
    borderColor: colors.orange,
    boxShadow: `0 0 20px ${colors.orangeGlow}`,
  },
} as const

// ==================== BUTTON STYLES ====================

export const buttonStyles = {
  primary: {
    background: colors.orange,
    border: 'none',
    color: colors.text,
    fontFamily: fonts.sans,
    fontWeight: 600,
    fontSize: 14,
    padding: '12px 20px',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.15s',
  } as const,
  secondary: {
    background: 'transparent',
    border: `1px solid ${colors.border}`,
    color: colors.textSub,
    fontFamily: fonts.sans,
    fontSize: 14,
    padding: '12px 20px',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.15s',
  } as const,
  outline: {
    background: 'transparent',
    border: `1px solid ${colors.orange}`,
    color: colors.orange,
    fontFamily: fonts.sans,
    fontSize: 13,
    padding: '6px 14px',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'background 0.15s',
  } as const,
} as const

// ==================== INPUT STYLES ====================

export const inputStyle = {
  width: '100%',
  background: colors.bg,
  border: `1px solid ${colors.border}`,
  borderRadius: 8,
  padding: '10px 14px',
  color: colors.text,
  fontFamily: fonts.sans,
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.15s',
} as const

export const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
} as const

// ==================== STATUS HELPERS ====================

export const getRiskColor = (risk: number): string => {
  if (risk >= 80) return colors.danger
  if (risk >= 70) return colors.orange
  if (risk >= 60) return colors.warning
  return colors.safe
}

export const getRiskBackground = (risk: number): string => {
  if (risk >= 80) return colors.dangerBg
  if (risk >= 70) return colors.orangeGlow
  if (risk >= 60) return colors.warningBg
  return colors.safeBg
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'CRITICAL': return colors.danger
    case 'DANGER': return colors.orange
    case 'WATCH': return colors.warning
    case 'SAFE': return colors.safe
    default: return colors.textSub
  }
}

export const getBarColor = (val: number): string => {
  if (val < 35) return colors.danger
  if (val < 55) return colors.orange
  if (val < 70) return colors.warning
  return colors.safe
}

export const getEMIColor = (days: number): string => {
  if (days <= 5) return colors.danger
  if (days <= 10) return colors.orange
  return colors.warning
}

export const getSignalColor = (intensity: number): string => {
  if (intensity < 40) return colors.safe
  if (intensity < 60) return colors.warning
  if (intensity < 75) return colors.orange
  return colors.danger
}

// ==================== ANIMATION KEYFRAMES ====================

export const keyframes = `
  @keyframes fadeUp { 
    from { opacity: 0; transform: translateY(16px); } 
    to { opacity: 1; transform: translateY(0); } 
  }
  @keyframes slideInRight { 
    from { opacity: 0; transform: translateX(110%); } 
    to { opacity: 1; transform: translateX(0); } 
  }
  @keyframes pulse { 
    0%, 100% { opacity: 1; } 
    50% { opacity: 0.3; } 
  }
  @keyframes tickerScroll { 
    from { transform: translateX(100%); } 
    to { transform: translateX(-100%); } 
  }
  @keyframes countUp { 
    from { opacity: 0; } 
    to { opacity: 1; } 
  }
  @keyframes barFill { 
    from { width: 0%; } 
    to { width: var(--target-width); } 
  }
`
