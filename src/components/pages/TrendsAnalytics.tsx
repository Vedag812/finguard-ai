'use client'

import React from 'react'
import { C } from '@/lib/theme'
import { Card, CardHeader } from '@/components/ui'
import { TrendLineChart } from '@/components/dashboard'
import { MetricsCards } from '@/components/dashboard'

export function TrendsAnalytics() {
  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 24, animation: 'fadeUp 0.4s ease both' }}>
        <h1 style={{
          fontFamily: '"Barlow Condensed"',
          fontWeight: 800,
          fontSize: 32,
          color: C.text,
        }}>
          Trends & Analytics
        </h1>
        <p style={{
          fontFamily: '"DM Sans"',
          fontSize: 14,
          color: C.textMuted,
          marginTop: 4,
        }}>
          7-week performance metrics and trend analysis
        </p>
      </div>

      {/* Main Chart */}
      <TrendLineChart />

      {/* Metrics */}
      <div style={{ marginTop: 24 }}>
        <MetricsCards />
      </div>

      {/* Weekly Breakdown */}
      <Card padding="lg" style={{ marginTop: 24 }}>
        <CardHeader title="Weekly Breakdown" subtitle="Detailed metrics per week" />
        <WeeklyBreakdownTable />
      </Card>
    </div>
  )
}

// Weekly Breakdown Table
function WeeklyBreakdownTable() {
  const weeklyData = [
    { week: 'Jan W1', risk: 41, alerts: 65, interventions: 24, prevented: '₹8.2L' },
    { week: 'Jan W2', risk: 44, alerts: 71, interventions: 28, prevented: '₹9.1L' },
    { week: 'Jan W3', risk: 42, alerts: 68, interventions: 25, prevented: '₹8.5L' },
    { week: 'Jan W4', risk: 48, alerts: 78, interventions: 31, prevented: '₹10.2L' },
    { week: 'Feb W1', risk: 51, alerts: 83, interventions: 34, prevented: '₹11.5L' },
    { week: 'Feb W2', risk: 57, alerts: 92, interventions: 38, prevented: '₹13.8L' },
    { week: 'Feb W3', risk: 63, alerts: 100, interventions: 42, prevented: '₹15.2L' },
  ]

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}` }}>
            {['Week', 'Risk Score', 'Alerts', 'Interventions', 'Prevented Loss'].map((h) => (
              <th key={h} style={{
                fontFamily: '"DM Sans"',
                fontSize: 11,
                fontWeight: 600,
                color: C.textMuted,
                textAlign: 'left',
                padding: '12px 16px',
                textTransform: 'uppercase',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeklyData.map((row, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
              <td style={{
                fontFamily: '"DM Sans"',
                fontSize: 13,
                color: C.text,
                padding: '12px 16px',
              }}>
                {row.week}
              </td>
              <td style={{
                fontFamily: '"JetBrains Mono"',
                fontSize: 13,
                color: row.risk >= 60 ? C.danger : row.risk >= 50 ? C.warning : C.safe,
                padding: '12px 16px',
              }}>
                {row.risk}
              </td>
              <td style={{
                fontFamily: '"JetBrains Mono"',
                fontSize: 13,
                color: C.text,
                padding: '12px 16px',
              }}>
                {row.alerts}
              </td>
              <td style={{
                fontFamily: '"JetBrains Mono"',
                fontSize: 13,
                color: C.safe,
                padding: '12px 16px',
              }}>
                {row.interventions}
              </td>
              <td style={{
                fontFamily: '"JetBrains Mono"',
                fontSize: 13,
                color: C.orange,
                padding: '12px 16px',
              }}>
                {row.prevented}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
