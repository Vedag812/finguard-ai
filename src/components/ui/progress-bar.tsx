'use client'

import React from 'react'
import { C } from '@/lib/theme'
import { getBarColor, getRiskColor } from '@/lib/theme'

// ==================== PROGRESS BAR COMPONENT ====================

interface ProgressBarProps {
  value: number
  max?: number
  color?: string
  height?: number
  showLabel?: boolean
  label?: string
  animated?: boolean
  style?: React.CSSProperties
}

export function ProgressBar({
  value,
  max = 100,
  color,
  height = 5,
  showLabel = false,
  label,
  animated = true,
  style,
}: ProgressBarProps) {
  const percentage = (value / max) * 100
  const barColor = color || getBarColor(value)

  return (
    <div style={style}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: '"DM Sans"', fontSize: 11, color: C.textMuted }}>{label}</span>
          <span style={{ fontFamily: '"JetBrains Mono"', fontSize: 12, color: barColor }}>{value}</span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height,
          background: C.border,
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: animated ? `${percentage}%` : percentage,
            height: '100%',
            background: barColor,
            borderRadius: 3,
            transition: animated ? 'width 0.8s ease' : 'none',
          }}
        />
      </div>
    </div>
  )
}

// ==================== INTENSITY BAR COMPONENT ====================

interface IntensityBarProps {
  intensity: number
  showValue?: boolean
  style?: React.CSSProperties
}

export function IntensityBar({ intensity, showValue = true, style }: IntensityBarProps) {
  const color = getRiskColor(intensity)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...style }}>
      <div
        style={{
          flex: 1,
          height: 8,
          background: C.border,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${intensity}%`,
            height: '100%',
            background: color,
            borderRadius: 4,
            transition: 'width 0.8s ease',
          }}
        />
      </div>
      {showValue && (
        <span style={{ fontFamily: '"JetBrains Mono"', fontSize: 13, color, minWidth: 30 }}>
          {intensity}
        </span>
      )}
    </div>
  )
}

// ==================== MINI CHART COMPONENT ====================

interface MiniChartProps {
  data: number[]
  color?: string
  width?: number
  height?: number
  style?: React.CSSProperties
}

export function MiniChart({ data, color = C.orange, width = 60, height = 16, style }: MiniChartProps) {
  if (data.length < 2) return null

  const max = Math.max(...data)
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - (val / max) * height
    return `${x},${y}`
  })

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={style}>
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ==================== RISK DISTRIBUTION BAR ====================

interface RiskDistributionBarProps {
  segments: { label: string; value: number; color: string }[]
  style?: React.CSSProperties
}

export function RiskDistributionBar({ segments, style }: RiskDistributionBarProps) {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0)

  return (
    <div style={style}>
      <div
        style={{
          display: 'flex',
          height: 24,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        {segments.map((seg, i) => (
          <div
            key={i}
            style={{
              width: `${(seg.value / total) * 100}%`,
              background: seg.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontFamily: '"DM Sans"', fontSize: 10, color: '#fff' }}>
              {seg.label} ({seg.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
