'use client'

import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { C } from '@/lib/theme'
import { Card, CardHeader } from '@/components/ui'
import { trendData } from '@/data/mockData'

export function TrendLineChart() {
  return (
    <Card padding="lg" style={{ animation: 'fadeUp 0.4s ease 0.4s both' }}>
      <CardHeader
        title="Portfolio Trends"
        subtitle="7-week risk & intervention performance"
      />

      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis
              dataKey="week"
              stroke={C.textMuted}
              tick={{ fontFamily: 'DM Sans', fontSize: 11 }}
            />
            <YAxis
              stroke={C.textMuted}
              tick={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                background: '#161616',
                border: `1px solid ${C.orange}`,
                borderRadius: 8,
                padding: 12,
              }}
              labelStyle={{ fontFamily: 'DM Sans', color: C.text }}
              itemStyle={{ fontFamily: 'JetBrains Mono', fontSize: 12 }}
            />
            <Line
              type="monotone"
              dataKey="riskScore"
              name="Risk Score"
              stroke={C.orange}
              strokeWidth={2}
              dot={{ fill: C.orange, strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: C.orange }}
            />
            <Line
              type="monotone"
              dataKey="alerts"
              name="Alerts"
              stroke={C.danger}
              strokeWidth={2}
              dot={{ fill: C.danger, strokeWidth: 0, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="interventions"
              name="Interventions"
              stroke={C.safe}
              strokeWidth={2}
              dot={{ fill: C.safe, strokeWidth: 0, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16 }}>
        {[
          { color: C.orange, label: 'Risk Score' },
          { color: C.danger, label: 'Alerts' },
          { color: C.safe, label: 'Interventions' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 3, background: item.color, borderRadius: 2 }} />
            <span style={{ fontFamily: '"DM Sans"', fontSize: 12, color: C.textSub }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
