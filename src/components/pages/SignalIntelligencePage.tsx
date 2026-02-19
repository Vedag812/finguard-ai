'use client'

import React, { useState, useEffect } from 'react'
import { C } from '@/lib/theme'
import { Card, CardHeader, Badge, ProgressBar, MiniChart } from '@/components/ui'
import { signalIntelligence, signalDetails } from '@/data/mockData'
import { getSignalColor } from '@/lib/theme'

export function SignalIntelligencePage() {
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
          Signal Intelligence
        </h1>
        <p style={{
          fontFamily: '"DM Sans"',
          fontSize: 14,
          color: C.textMuted,
          marginTop: 4,
        }}>
          Early warning stress signal detection engine
        </p>
      </div>

      {/* Summary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 24,
      }}>
        <SummaryCard label="Active Signals" value="7" color={C.orange} />
        <SummaryCard label="Critical Signals" value="2" color={C.danger} />
        <SummaryCard label="High Priority" value="3" color={C.warning} />
        <SummaryCard label="Avg Intensity" value="65" color={C.text} />
      </div>

      {/* Signal Intelligence Table */}
      <Card padding="lg" style={{ marginBottom: 24 }}>
        <CardHeader title="Signal Intensity Matrix" subtitle="Real-time signal monitoring" />
        <SignalTable />
      </Card>

      {/* Signal Detail Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 16,
      }}>
        {signalDetails.map((signal, i) => (
          <SignalDetailCard key={i} signal={signal} delay={i * 0.05} />
        ))}
      </div>
    </div>
  )
}

// Summary Card
function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Card padding="md" style={{ animation: 'fadeUp 0.4s ease 0.08s both' }}>
      <div style={{
        fontFamily: '"DM Sans"',
        fontSize: 11,
        color: C.textMuted,
        textTransform: 'uppercase',
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: '"Barlow Condensed"',
        fontWeight: 700,
        fontSize: 32,
        color,
      }}>
        {value}
      </div>
    </Card>
  )
}

// Signal Table
function SignalTable() {
  const getStatusColor = (status: string) => {
    if (status === 'CRITICAL') return C.danger
    if (status === 'HIGH') return C.orange
    return C.warning
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}` }}>
            {['Signal', 'Intensity', 'Customers', 'Trend', 'Status'].map((h) => (
              <th key={h} style={{
                fontFamily: '"DM Sans"',
                fontSize: 10,
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
          {signalIntelligence.map((row, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
              <td style={{ padding: '12px 16px' }}>
                <span style={{
                  fontFamily: '"DM Sans"',
                  fontSize: 13,
                  color: C.text,
                }}>
                  {row.signal}
                </span>
              </td>
              <td style={{ padding: '12px 16px', width: 200 }}>
                <ProgressBar
                  value={row.intensity}
                  color={getSignalColor(row.intensity)}
                  height={6}
                />
                <span style={{
                  fontFamily: '"JetBrains Mono"',
                  fontSize: 12,
                  color: getSignalColor(row.intensity),
                  marginLeft: 8,
                }}>
                  {row.intensity}
                </span>
              </td>
              <td style={{ padding: '12px 16px' }}>
                <span style={{
                  fontFamily: '"JetBrains Mono"',
                  fontSize: 13,
                  color: C.textSub,
                }}>
                  {row.customers}
                </span>
              </td>
              <td style={{ padding: '12px 16px' }}>
                <MiniChart data={row.trend} color={getSignalColor(row.intensity)} />
              </td>
              <td style={{ padding: '12px 16px' }}>
                <Badge variant={row.status === 'CRITICAL' ? 'danger' : row.status === 'HIGH' ? 'warning' : 'success'}>
                  {row.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Signal Detail Card
interface SignalDetailCardProps {
  signal: typeof signalDetails[0]
  delay: number
}

function SignalDetailCard({ signal, delay }: SignalDetailCardProps) {
  return (
    <Card padding="lg" style={{ animation: `fadeUp 0.4s ease ${delay}s both` }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 24 }}>{signal.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: '"Barlow Condensed"',
            fontWeight: 600,
            fontSize: 16,
            color: C.text,
          }}>
            {signal.name}
          </div>
          <div style={{
            fontFamily: '"DM Sans"',
            fontSize: 12,
            color: C.textMuted,
          }}>
            {signal.desc}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: '"Barlow Condensed"',
            fontWeight: 700,
            fontSize: 24,
            color: getSignalColor(signal.intensity),
          }}>
            {signal.intensity}
          </div>
          <div style={{
            fontFamily: '"DM Sans"',
            fontSize: 10,
            color: C.textMuted,
          }}>
            {signal.customers} customers
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        background: C.bg,
        borderRadius: 6,
        marginBottom: 12,
      }}>
        <span style={{
          fontFamily: '"DM Sans"',
          fontSize: 11,
          color: C.textMuted,
        }}>
          First Detected
        </span>
        <span style={{
          fontFamily: '"JetBrains Mono"',
          fontSize: 11,
          color: C.textSub,
        }}>
          {signal.firstDetected}
        </span>
      </div>

      {/* Trend Chart */}
      <div style={{
        height: 40,
        display: 'flex',
        alignItems: 'flex-end',
        gap: 4,
      }}>
        {signal.trend.map((val, i) => (
          <div key={i} style={{
            flex: 1,
            height: `${(val / 100) * 40}px`,
            background: getSignalColor(val),
            borderRadius: 2,
            opacity: 0.5 + (i / signal.trend.length) * 0.5,
          }} />
        ))}
      </div>
    </Card>
  )
}
