// ==================== COLOR SYSTEM ====================

export const C = {
  // Background colors
  bg: "#070707",
  sidebar: "#0A0A0A",
  card: "#101010",
  cardHover: "#161616",

  // Border colors
  border: "#1C1C1C",
  borderActive: "#F97316",

  // Orange palette (primary brand)
  orange: "#F97316",
  orangeDark: "#C2410C",
  orangeDeep: "#7C2D12",
  orangeMid: "#FB923C",
  orangePale: "#FED7AA",
  orangeGlow: "rgba(249,115,22,0.12)",
  orangeGlowHi: "rgba(249,115,22,0.25)",

  // Text colors
  text: "#F0EEE8",
  textSub: "#9CA3AF",
  textMuted: "#4B5563",

  // Status colors
  danger: "#EF4444",
  warning: "#EAB308",
  safe: "#22C55E",

  // Status backgrounds
  dangerBg: "rgba(239,68,68,0.10)",
  warningBg: "rgba(234,179,8,0.10)",
  safeBg: "rgba(34,197,94,0.10)",

  // Brand colors
  barcBlue: "#00AEEF",
} as const

// ==================== TEXT STYLES ====================

export const textStyles = {
  // Labels and small text
  label: { fontFamily: '"DM Sans"', fontSize: 12, color: C.textSub },
  labelMuted: { fontFamily: '"DM Sans"', fontSize: 10, color: C.textMuted, letterSpacing: 2, textTransform: 'uppercase' as const },
  caption: { fontFamily: '"DM Sans"', fontSize: 11, color: C.textMuted },

  // Body text
  body: { fontFamily: '"DM Sans"', fontSize: 14, color: C.text },
  bodySm: { fontFamily: '"DM Sans"', fontSize: 13, color: C.textSub },

  // Headings
  h1: { fontFamily: '"Barlow Condensed"', fontWeight: 800, fontSize: 32, color: C.text },
  h2: { fontFamily: '"Barlow Condensed"', fontWeight: 700, fontSize: 22, color: C.text },
  h3: { fontFamily: '"Barlow Condensed"', fontWeight: 600, fontSize: 18, color: C.text },
  h4: { fontFamily: '"Barlow Condensed"', fontWeight: 600, fontSize: 17, color: C.text },

  // Monospace (numbers, IDs)
  mono: { fontFamily: '"JetBrains Mono"', fontSize: 11, color: C.textMuted },
  monoSm: { fontFamily: '"JetBrains Mono"', fontSize: 10, color: C.textMuted },
  monoMd: { fontFamily: '"JetBrains Mono"', fontSize: 12, color: C.textSub },
  monoLg: { fontFamily: '"JetBrains Mono"', fontSize: 13, color: C.orange },

  // Big numbers
  bigNumber: { fontFamily: '"Barlow Condensed"', fontWeight: 700, fontSize: 36, color: C.text },
  heroNumber: { fontFamily: '"Barlow Condensed"', fontWeight: 800, fontSize: 48, color: C.orange },
} as const

// ==================== COLOR UTILITY FUNCTIONS ====================

export function getStatusColor(status: string): string {
  switch (status) {
    case 'CRITICAL': return C.danger
    case 'DANGER': return C.orange
    case 'WATCH': return C.warning
    case 'SAFE': return C.safe
    default: return C.textSub
  }
}

export function getRiskBackground(risk: number): string {
  if (risk >= 80) return C.dangerBg
  if (risk >= 70) return C.orangeGlow
  if (risk >= 60) return C.warningBg
  return C.safeBg
}

export function getRiskColor(risk: number): string {
  if (risk >= 80) return C.danger
  if (risk >= 70) return C.orange
  if (risk >= 60) return C.warning
  return C.safe
}

export function getBarColor(val: number): string {
  if (val < 35) return C.danger
  if (val < 55) return C.orange
  if (val < 70) return C.warning
  return C.safe
}

export function getEMIColor(days: number): string {
  if (days <= 5) return C.danger
  if (days <= 10) return C.orange
  return C.warning
}

export function getSignalColor(intensity: number): string {
  if (intensity < 40) return C.safe
  if (intensity < 60) return C.warning
  if (intensity < 75) return C.orange
  return C.danger
}

// ==================== STYLE PRESETS ====================

export const cardStyle = {
  base: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  hover: {
    borderColor: C.orange,
    boxShadow: `0 0 20px ${C.orangeGlow}`,
  },
}

export const buttonStyles = {
  primary: {
    background: C.orange,
    border: 'none',
    color: C.text,
    fontFamily: '"DM Sans"',
    fontWeight: 600,
    fontSize: 14,
    padding: '12px 20px',
    borderRadius: 8,
    cursor: 'pointer',
  },
  secondary: {
    background: 'transparent',
    border: `1px solid ${C.border}`,
    color: C.textSub,
    fontFamily: '"DM Sans"',
    fontSize: 14,
    padding: '12px 20px',
    borderRadius: 8,
    cursor: 'pointer',
  },
  outline: {
    width: '100%',
    background: 'transparent',
    border: `1px solid ${C.orange}`,
    color: C.orange,
    padding: '10px 16px',
    borderRadius: 6,
    fontFamily: '"DM Sans"',
    fontSize: 12,
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'background 0.15s',
  },
  ghost: {
    background: 'transparent',
    border: 'none',
    color: C.textMuted,
    cursor: 'pointer',
  },
}

export const inputStyles = {
  base: {
    width: '100%',
    background: C.bg,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: '10px 14px',
    color: C.text,
    fontFamily: '"DM Sans"',
    fontSize: 14,
    outline: 'none',
  },
  focus: {
    borderColor: C.orange,
  },
}

// ==================== ANIMATION VARIANTS ====================

export const animations = {
  fadeUp: {
    animation: 'fadeUp 0.4s ease both',
  },
  slideInRight: {
    animation: 'slideInRight 0.3s ease',
  },
  pulse: {
    animation: 'pulse 1.5s infinite',
  },
}
