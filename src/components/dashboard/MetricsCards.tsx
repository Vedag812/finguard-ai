'use client'

import React from 'react'
import { C } from '@/lib/theme'
import { Card } from '@/components/ui'

export function MetricsCards() {
  const metrics = [
    { label: 'Interventions Approved', value: '42', change: '+8 this week', color: C.safe },
    { label: 'Pending RM Review', value: '15', change: '3 critical', color: C.warning },
    { label: 'Prevented Losses', value: '₹38.5L', change: 'ROI: 2.8×', color: C.orange },
    { label: 'Model Accuracy', value: '78%', change: 'AUC-ROC', color: C.barcBlue },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, animation: 'fadeUp 0.4s ease 0.48s both' }}>
      {metrics.map((metric, i) => (
        <Card key={i} padding="md">
          <div style={{
            fontFamily: '"DM Sans"',
            fontSize: 11,
            color: C.textMuted,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            {metric.label}
          </div>
          <div style={{
            fontFamily: '"Barlow Condensed"',
            fontWeight: 700,
            fontSize: 28,
            color: C.text,
          }}>
            {metric.value}
          </div>
          <div style={{
            fontFamily: '"DM Sans"',
            fontSize: 11,
            color: metric.color,
            marginTop: 4,
          }}>
            {metric.change}
          </div>
        </Card>
      ))}
    </div>
  )
}
