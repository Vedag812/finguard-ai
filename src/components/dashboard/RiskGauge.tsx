'use client'

import React from 'react'
import { C } from '@/lib/theme'
import { Card } from '@/components/ui'

export function RiskGauge() {
  const score = 63
  const radius = 90
  const strokeWidth = 18
  const centerX = 150
  const centerY = 120

  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = ((angle - 180) * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(cx, cy, r, endAngle)
    const end = polarToCartesian(cx, cy, r, startAngle)
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`
  }

  const scoreToAngle = (s: number) => (s / 100) * 180

  // Calculate needle position
  const angle = scoreToAngle(score) - 90
  const rad = (angle * Math.PI) / 180
  const needleLength = radius - 30
  const x2 = centerX + needleLength * Math.cos(rad)
  const y2 = centerY + needleLength * Math.sin(rad)

  return (
    <Card padding="lg" style={{ animation: 'fadeUp 0.4s ease 0.32s both' }}>
      <div style={{ marginBottom: 16 }}>
        <span style={{
          fontFamily: '"Barlow Condensed"',
          fontWeight: 600,
          fontSize: 17,
          color: C.text,
        }}>
          Portfolio Risk Score
        </span>
        <div style={{
          fontFamily: '"DM Sans"',
          fontSize: 12,
          color: C.textMuted,
          marginTop: 2,
        }}>
          Composite ML Risk Index
        </div>
      </div>

      <svg width={300} height={200} viewBox="0 0 300 200" style={{ display: 'block', margin: '0 auto' }}>
        {/* Background arc */}
        <path
          d={describeArc(centerX, centerY, radius, 0, 180)}
          fill="none"
          stroke={C.border}
          strokeWidth={strokeWidth}
        />

        {/* Color segments */}
        <path d={describeArc(centerX, centerY, radius, 0, 40)} fill="none" stroke={C.safe} strokeWidth={strokeWidth} />
        <path d={describeArc(centerX, centerY, radius, 40, 65)} fill="none" stroke={C.warning} strokeWidth={strokeWidth} />
        <path d={describeArc(centerX, centerY, radius, 65, 80)} fill="none" stroke={C.orange} strokeWidth={strokeWidth} />
        <path d={describeArc(centerX, centerY, radius, 80, 100)} fill="none" stroke={C.danger} strokeWidth={strokeWidth} />

        {/* Score arc */}
        <path
          d={describeArc(centerX, centerY, radius, 0, scoreToAngle(score))}
          fill="none"
          stroke={C.orange}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Needle */}
        <line x1={centerX} y1={centerY} x2={x2} y2={y2} stroke={C.orange} strokeWidth={2} />
        <circle cx={centerX} cy={centerY} r={8} fill={C.orange} />
      </svg>

      <div style={{ textAlign: 'center', marginTop: -20 }}>
        <div style={{
          fontFamily: '"Barlow Condensed"',
          fontWeight: 800,
          fontSize: 48,
          color: C.orange,
        }}>
          {score}
        </div>
        <div style={{
          display: 'inline-block',
          background: 'rgba(249,115,22,0.15)',
          color: C.orange,
          borderRadius: 6,
          padding: '4px 12px',
          fontFamily: '"Barlow Condensed"',
          fontWeight: 600,
          fontSize: 14,
          marginTop: 4,
        }}>
          ELEVATED RISK
        </div>
        <div style={{ fontFamily: '"DM Sans"', fontSize: 12, color: C.textMuted, marginTop: 8 }}>
          ↑ from 48 last week
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: '"DM Sans"', fontSize: 11, color: C.safe }}>SAFE 0–40</span>
        <span style={{ fontFamily: '"DM Sans"', fontSize: 11, color: C.warning }}>WATCH 40–65</span>
        <span style={{ fontFamily: '"DM Sans"', fontSize: 11, color: C.orange }}>ELEVATED 65–80</span>
        <span style={{ fontFamily: '"DM Sans"', fontSize: 11, color: C.danger }}>CRITICAL 80+</span>
      </div>
    </Card>
  )
}
