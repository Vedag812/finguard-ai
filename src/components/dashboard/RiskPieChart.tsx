'use client'

import React from 'react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts'
import { C } from '@/lib/theme'
import { Card } from '@/components/ui'
import { personaData } from '@/data/mockData'

export function RiskPieChart() {
  return (
    <Card padding="lg" style={{ animation: 'fadeUp 0.4s ease 0.32s both' }}>
      <div style={{ marginBottom: 16 }}>
        <span style={{
          fontFamily: '"Barlow Condensed"',
          fontWeight: 600,
          fontSize: 17,
          color: C.text,
        }}>
          Customer Risk Personas
        </span>
        <div style={{
          fontFamily: '"DM Sans"',
          fontSize: 12,
          color: C.textMuted,
          marginTop: 2,
        }}>
          100 customers flagged this week
        </div>
      </div>

      <div style={{ position: 'relative', height: 280 }}>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={personaData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              dataKey="value"
              isAnimationActive={true}
              animationDuration={800}
            >
              {personaData.map((entry, index) => (
                <Cell key={index} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as typeof personaData[0]
                  return (
                    <div style={{
                      background: '#161616',
                      border: `1px solid ${C.orange}`,
                      borderRadius: 8,
                      padding: 12,
                    }}>
                      <div style={{ fontFamily: '"DM Sans"', fontSize: 13, color: C.text }}>
                        {data.name}
                      </div>
                      <div style={{ fontFamily: '"JetBrains Mono"', fontSize: 13, color: C.orange }}>
                        {data.value} customers
                      </div>
                      <div style={{ fontFamily: '"JetBrains Mono"', fontSize: 11, color: C.textMuted }}>
                        {data.pct}
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            fontFamily: '"Barlow Condensed"',
            fontWeight: 800,
            fontSize: 28,
            color: C.orange,
          }}>
            100
          </div>
          <div style={{ fontFamily: '"DM Sans"', fontSize: 11, color: C.textMuted }}>
            AT RISK
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16 }}>
        {personaData.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: item.color }} />
            <span style={{ fontFamily: '"DM Sans"', fontSize: 13, color: C.text }}>
              {item.name}
            </span>
            <span style={{ fontFamily: '"JetBrains Mono"', fontSize: 13, color: C.orange }}>
              {item.value}
            </span>
            <span style={{ fontFamily: '"DM Sans"', fontSize: 11, color: C.textMuted }}>
              {item.pct}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
