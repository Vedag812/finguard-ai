'use client'

import React, { useState, useEffect } from 'react'
import { C } from '@/lib/theme'
import { Card } from '@/components/ui'
import type { KPICardProps } from '@/types'

export function KPICard({ icon, label, value, subtext, barColor, delay }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, '')) || 0

  useEffect(() => {
    const duration = 1200
    const steps = 60
    const increment = numericValue / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= numericValue) {
        setDisplayValue(numericValue)
        clearInterval(timer)
      } else {
        setDisplayValue(current)
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [numericValue])

  const formatValue = (val: number) => {
    if (value.includes('₹')) return `₹${val.toFixed(0)}`
    if (value.includes('%')) return `${val.toFixed(0)}%`
    if (value.includes('×')) return `${val.toFixed(1)}×`
    if (value.includes(',')) return val.toLocaleString()
    return val.toFixed(0)
  }

  return (
    <Card
      padding="md"
      style={{
        position: 'relative',
        overflow: 'hidden',
        animation: `fadeUp 0.4s ease ${delay}s both`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 24, color: C.orange }}>{icon}</span>
        <span style={{
          fontFamily: '"DM Sans"',
          fontSize: 12,
          color: C.textMuted,
          textTransform: 'uppercase',
        }}>
          {label}
        </span>
      </div>
      <div style={{
        fontFamily: '"Barlow Condensed"',
        fontWeight: 700,
        fontSize: 36,
        color: C.text,
      }}>
        {value.includes('₹') || value.includes('%') || value.includes('×') || value.includes(',')
          ? formatValue(displayValue)
          : displayValue.toLocaleString()}
      </div>
      <div style={{
        fontFamily: '"DM Sans"',
        fontSize: 12,
        color: barColor === C.danger ? C.danger : barColor === C.safe ? C.safe : C.warning,
        marginTop: 4,
      }}>
        {subtext}
      </div>
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        background: barColor,
        borderRadius: '0 0 12px 12px',
      }} />
    </Card>
  )
}
