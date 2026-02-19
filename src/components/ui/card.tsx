'use client'

import React from 'react'
import { C } from '@/lib/theme'

// ==================== CARD COMPONENT ====================

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'glow'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Card({
  variant = 'default',
  padding = 'md',
  children,
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}: CardProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  const paddingStyles: Record<string, React.CSSProperties> = {
    none: { padding: 0 },
    sm: { padding: 12 },
    md: { padding: 20 },
    lg: { padding: 28 },
  }

  const baseStyles: React.CSSProperties = {
    background: C.card,
    borderRadius: 12,
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      borderWidth: 1,
      borderStyle: 'solid',
      borderTopColor: C.border,
      borderRightColor: C.border,
      borderBottomColor: C.border,
      borderLeftColor: C.border,
    },
    bordered: {
      borderWidth: 1,
      borderStyle: 'solid',
      borderTopColor: C.border,
      borderRightColor: C.border,
      borderBottomColor: C.border,
      borderLeftColor: C.border,
      background: 'transparent',
    },
    glow: {
      borderWidth: 1,
      borderStyle: 'solid',
      borderTopColor: C.orange,
      borderRightColor: C.orange,
      borderBottomColor: C.orange,
      borderLeftColor: C.orange,
      boxShadow: `0 0 20px ${C.orangeGlow}`,
    },
  }

  const hoverStyles: React.CSSProperties = isHovered
    ? {
      borderTopColor: C.orange,
      borderRightColor: C.orange,
      borderBottomColor: C.orange,
      borderLeftColor: C.orange,
      boxShadow: `0 0 20px ${C.orangeGlow}`,
    }
    : {}

  return (
    <div
      style={{
        ...baseStyles,
        ...paddingStyles[padding],
        ...variantStyles[variant],
        ...hoverStyles,
        ...style,
      }}
      onMouseEnter={(e) => {
        setIsHovered(true)
        onMouseEnter?.(e)
      }}
      onMouseLeave={(e) => {
        setIsHovered(false)
        onMouseLeave?.(e)
      }}
      {...props}
    >
      {children}
    </div>
  )
}

// ==================== CARD HEADER COMPONENT ====================

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  style?: React.CSSProperties
}

export function CardHeader({ title, subtitle, action, style }: CardHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, ...style }}>
      <div>
        <div style={{ fontFamily: '"Barlow Condensed"', fontWeight: 600, fontSize: 17, color: C.text }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontFamily: '"DM Sans"', fontSize: 12, color: C.textMuted, marginTop: 2 }}>
            {subtitle}
          </div>
        )}
      </div>
      {action}
    </div>
  )
}

// ==================== CARD DIVIDER COMPONENT ====================

export function CardDivider({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      style={{
        height: 1,
        background: C.border,
        margin: '12px 0',
        ...style,
      }}
    />
  )
}
