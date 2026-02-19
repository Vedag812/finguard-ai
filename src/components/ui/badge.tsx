'use client'

import React from 'react'
import { C } from '@/lib/theme'

// ==================== BADGE COMPONENT ====================

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline'
  size?: 'sm' | 'md'
  style?: React.CSSProperties
}

export function Badge({ children, variant = 'default', size = 'md', style }: BadgeProps) {
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '2px 6px', fontSize: 10 },
    md: { padding: '3px 8px', fontSize: 11 },
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      background: 'rgba(249,115,22,0.15)',
      color: C.orange,
      borderRadius: 10,
    },
    success: {
      background: C.safeBg,
      color: C.safe,
      borderRadius: 4,
    },
    warning: {
      background: C.warningBg,
      color: C.warning,
      borderRadius: 4,
    },
    danger: {
      background: C.dangerBg,
      color: C.danger,
      borderRadius: 4,
    },
    info: {
      background: 'rgba(0,174,239,0.10)',
      color: C.barcBlue,
      borderRadius: 4,
    },
    outline: {
      background: 'transparent',
      border: '1px solid',
      borderRadius: 16,
    },
  }

  return (
    <span
      style={{
        fontFamily: '"DM Sans"',
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </span>
  )
}

// ==================== STATUS BADGE COMPONENT ====================

interface StatusBadgeProps {
  status: 'CRITICAL' | 'DANGER' | 'WATCH' | 'SAFE' | 'HIGH' | 'MODERATE' | 'STRONG FIT' | 'HIGHEST ROI' | 'RM REVIEW' | 'MODERATE FIT'
  style?: React.CSSProperties
}

export function StatusBadge({ status, style }: StatusBadgeProps) {
  const getStatusStyles = (): { color: string; bg: string } => {
    switch (status) {
      case 'CRITICAL':
      case 'STRONG FIT':
        return { color: C.danger, bg: C.dangerBg }
      case 'DANGER':
      case 'RM REVIEW':
        return { color: C.orange, bg: C.orangeGlow }
      case 'WATCH':
      case 'MODERATE':
      case 'MODERATE FIT':
        return { color: C.warning, bg: C.warningBg }
      case 'SAFE':
      case 'HIGHEST ROI':
        return { color: C.safe, bg: C.safeBg }
      case 'HIGH':
        return { color: C.orange, bg: C.orangeGlow }
      default:
        return { color: C.textSub, bg: 'transparent' }
    }
  }

  const { color, bg } = getStatusStyles()

  return (
    <span
      style={{
        fontFamily: '"DM Sans"',
        fontSize: 10,
        padding: '2px 6px',
        borderRadius: 4,
        color,
        background: bg,
        ...style,
      }}
    >
      {status}
    </span>
  )
}

// ==================== RISK BADGE COMPONENT ====================

interface RiskBadgeProps {
  risk: number
  style?: React.CSSProperties
}

export function RiskBadge({ risk, style }: RiskBadgeProps) {
  const getRiskStyles = (): { color: string; bg: string } => {
    if (risk >= 80) return { color: C.danger, bg: C.dangerBg }
    if (risk >= 70) return { color: C.orange, bg: C.orangeGlow }
    if (risk >= 60) return { color: C.warning, bg: C.warningBg }
    return { color: C.safe, bg: C.safeBg }
  }

  const { color, bg } = getRiskStyles()

  return (
    <span
      style={{
        fontFamily: '"Barlow Condensed"',
        fontWeight: 700,
        fontSize: 16,
        padding: '4px 10px',
        borderRadius: 6,
        color,
        background: bg,
        display: 'inline-block',
        ...style,
      }}
    >
      {risk}
    </span>
  )
}
