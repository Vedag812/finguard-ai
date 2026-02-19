'use client'

import React, { useState, useEffect } from 'react'
import { C } from '@/lib/theme'
import { Card } from '@/components/ui'
import { signals } from '@/data/mockData'
import { getSignalColor } from '@/lib/theme'

export function SignalHeatmap() {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <span style={{ color: C.danger }}>↑</span>
    if (trend === 'down') return <span style={{ color: C.safe }}>↓</span>
    return <span style={{ color: C.warning }}>→</span>
  }

  return (
    <div style={{ animation: 'fadeUp 0.4s ease 0.4s both' }}>
      <div style={{
        fontFamily: '"Barlow Condensed"',
        fontWeight: 600,
        fontSize: 17,
        color: C.text,
        marginBottom: 16,
      }}>
        Early Warning Signal Intensity — Current Week
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {signals.map((signal, i) => (
          <Card key={i} padding="sm" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 200, fontFamily: '"DM Sans"', fontSize: 14, color: C.text }}>
              {signal.name}
            </div>

            <div style={{
              flex: 1,
              height: 8,
              background: C.border,
              borderRadius: 4,
              overflow: 'hidden',
            }}>
              <div style={{
                width: animated ? `${signal.intensity}%` : 0,
                height: '100%',
                background: getSignalColor(signal.intensity),
                borderRadius: 4,
                transition: 'width 0.8s ease',
              }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 120 }}>
              <span style={{
                fontFamily: '"JetBrains Mono"',
                fontSize: 13,
                color: getSignalColor(signal.intensity),
              }}>
                {signal.intensity}
              </span>
              {getTrendIcon(signal.trend)}
            </div>

            <span style={{ fontFamily: '"DM Sans"', fontSize: 11, color: C.textMuted }}>
              {signal.customers} customers
            </span>
          </Card>
        ))}
      </div>
    </div>
  )
}
