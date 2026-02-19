'use client'

import React from 'react'
import { C } from '@/lib/theme'
import { KPICard, AINarrative, RiskPieChart, RiskGauge, SignalHeatmap, TrendLineChart, MetricsCards } from '@/components/dashboard'
import type { ToastType } from '@/types'

interface PortfolioOverviewProps {
  addToast: (title: string, msg: string, type?: ToastType) => void
  onNavigate?: (page: string) => void
  onOpenExport?: () => void
}

export function PortfolioOverview({ addToast, onNavigate, onOpenExport }: PortfolioOverviewProps) {
  const kpiData = [
    { icon: '⚠', label: 'Risk Alerts', value: '100', subtext: '↑ 18% from last week', barColor: C.danger, delay: 0 },
    { icon: '💰', label: 'Avg Buffer', value: '1.3×', subtext: '↓ 0.8× from last month', barColor: C.danger, delay: 0.08 },
    { icon: '↗', label: 'Interventions', value: '42', subtext: '↑ 12 this week', barColor: C.safe, delay: 0.16 },
    { icon: '₹', label: 'Prevented Loss', value: '₹38,50,000', subtext: 'ROI: 2.8× on interventions', barColor: C.orange, delay: 0.24 },
  ]

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 24, animation: 'fadeUp 0.4s ease both' }}>
        <h1 style={{
          fontFamily: '"Barlow Condensed"',
          fontWeight: 800,
          fontSize: 32,
          color: C.text,
          margin: 0,
        }}>
          Portfolio Overview
        </h1>
        <p style={{
          fontFamily: '"DM Sans"',
          fontSize: 14,
          color: C.textMuted,
          marginTop: 4,
        }}>
          Live snapshot of your at-risk customer portfolio
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 24,
      }}>
        {kpiData.map((kpi, i) => (
          <KPICard key={i} {...kpi} />
        ))}
      </div>

      {/* AI Narrative */}
      <div style={{ marginBottom: 24 }}>
        <AINarrative
          addToast={addToast}
          onNavigate={onNavigate}
          onOpenExport={onOpenExport}
        />
      </div>

      {/* Charts Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        marginBottom: 24,
      }}>
        <RiskPieChart />
        <RiskGauge />
      </div>

      {/* Signal Heatmap */}
      <div style={{ marginBottom: 24 }}>
        <SignalHeatmap />
      </div>

      {/* Trend Chart */}
      <div style={{ marginBottom: 24 }}>
        <TrendLineChart />
      </div>

      {/* Metrics Cards */}
      <MetricsCards />
    </div>
  )
}
