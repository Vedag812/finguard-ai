'use client'

import React, { useState } from 'react'
import { C } from '@/lib/theme'
import { Card, Button } from '@/components/ui'
import { interventionCards } from '@/data/mockData'
import type { ToastType, InterventionCard as InterventionCardType } from '@/types'

interface InterventionsProps {
  addToast: (title: string, msg: string, type?: ToastType) => void
}

// ─── Summary Stat ─────────────────────────────────────────────────────────────
function SummaryStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Card padding="md">
      <div style={{ fontFamily: '"DM Sans"', fontSize: 11, color: C.textMuted, textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontFamily: '"Barlow Condensed"', fontWeight: 700, fontSize: 28, color }}>
        {value}
      </div>
    </Card>
  )
}

// ─── Stat Item ────────────────────────────────────────────────────────────────
function StatItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div style={{ fontFamily: '"DM Sans"', fontSize: 10, color: C.textMuted }}>{label}</div>
      <div style={{ fontFamily: '"JetBrains Mono"', fontSize: 13, color: highlight ? C.orange : C.text, fontWeight: highlight ? 600 : 400 }}>
        {value}
      </div>
    </div>
  )
}

// ─── Detail Item ──────────────────────────────────────────────────────────────
function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontFamily: '"DM Sans"', fontSize: 10, color: C.textMuted }}>{label}</div>
      <div style={{ fontFamily: '"DM Sans"', fontSize: 13, color: C.textSub }}>{value}</div>
    </div>
  )
}

// ─── Intervention Card ────────────────────────────────────────────────────────
interface InterventionCardProps {
  data: InterventionCardType
  delay: number
  addToast: (title: string, msg: string, type?: ToastType) => void
}

function InterventionCard({ data, delay, addToast }: InterventionCardProps) {
  const [isActivated, setIsActivated] = useState(false)
  const [isActivating, setIsActivating] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const handleActivate = async () => {
    setIsActivating(true)
    try {
      const res = await fetch('/api/interventions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: 'BULK-' + data.name.replace(/\s+/g, '-').toUpperCase(),
          customerName: data.segment,
          intervention: data.name,
          status: 'APPROVED',
        }),
      })
      if (!res.ok) throw new Error('API error')
      setIsActivated(true)
      addToast('Campaign Activated', data.toast, 'success')
    } catch {
      addToast('Error', 'Could not save intervention. Check API connection.', 'warning')
    } finally {
      setIsActivating(false)
    }
  }

  return (
    <Card padding="lg">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: '"Barlow Condensed"', fontWeight: 700, fontSize: 20, color: C.text }}>
            {data.name}
          </div>
          <div style={{ fontFamily: '"DM Sans"', fontSize: 12, color: C.textMuted, marginTop: 2 }}>
            {data.segment}
          </div>
        </div>
        <span style={{
          background: data.statusColor === C.safe ? C.safeBg : data.statusColor === C.orange ? C.orangeGlow : C.warningBg,
          color: data.statusColor,
          fontFamily: '"DM Sans"',
          fontSize: 10,
          fontWeight: 600,
          padding: '4px 8px',
          borderRadius: 4,
        }}>
          {data.status}
        </span>
      </div>

      {/* Description */}
      <p style={{ fontFamily: '"DM Sans"', fontSize: 13, color: C.textSub, lineHeight: 1.5, marginBottom: 16 }}>
        {data.desc}
      </p>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        <StatItem label="Customers" value={data.count.toString()} />
        <StatItem label="ROI" value={data.roi} highlight />
        <StatItem label="Cost" value={data.cost} />
        <StatItem label="Success Rate" value={data.successRate} />
      </div>

      {/* Prevented Loss */}
      <div style={{
        background: C.safeBg,
        border: `1px solid ${C.safe}`,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontFamily: '"DM Sans"', fontSize: 12, color: C.textSub }}>Estimated Prevented Loss</span>
        <span style={{ fontFamily: '"Barlow Condensed"', fontWeight: 700, fontSize: 18, color: C.safe }}>
          {data.prevented}
        </span>
      </div>

      {/* Suitability Bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: '"DM Sans"', fontSize: 11, color: C.textMuted }}>Intervention Suitability</span>
          <span style={{ fontFamily: '"JetBrains Mono"', fontSize: 12, color: data.suitability >= 80 ? C.safe : data.suitability >= 60 ? C.warning : C.danger }}>
            {data.suitability}%
          </span>
        </div>
        <div style={{ height: 6, background: C.border, borderRadius: 3 }}>
          <div style={{
            width: `${data.suitability}%`,
            height: '100%',
            background: data.suitability >= 80 ? C.safe : data.suitability >= 60 ? C.warning : C.danger,
            borderRadius: 3,
          }} />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        {isActivated ? (
          <div style={{
            flex: 1,
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.4)',
            color: C.safe,
            fontFamily: '"DM Sans"',
            fontWeight: 600,
            fontSize: 13,
            padding: '10px 16px',
            borderRadius: 6,
            textAlign: 'center',
          }}>
            ✓ Campaign Activated
          </div>
        ) : (
          <Button
            variant="primary"
            onClick={handleActivate}
            style={{ flex: 1, opacity: isActivating ? 0.6 : 1, cursor: isActivating ? 'not-allowed' : 'pointer' }}
          >
            {isActivating ? '⟳ Activating...' : data.primaryBtn}
          </Button>
        )}
        <Button variant="secondary" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? '▲ Hide' : data.secondaryBtn}
        </Button>
      </div>

      {/* Details Accordion */}
      {showDetails && (
        <div style={{
          marginTop: 16,
          padding: 16,
          background: C.bg,
          borderRadius: 8,
          border: `1px solid ${C.border}`,
          animation: 'fadeUp 0.25s ease',
        }}>
          <div style={{ fontFamily: '"DM Sans"', fontSize: 12, color: C.textMuted, marginBottom: 8, letterSpacing: '0.05em' }}>
            INTERVENTION DETAILS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <DetailItem label="Target Segment" value={data.segment} />
            <DetailItem label="Expected ROI" value={data.roi} />
            <DetailItem label="Campaign Cost" value={data.cost} />
            <DetailItem label="Success Rate" value={data.successRate} />
            <DetailItem label="Customers at Risk" value={data.count.toString()} />
            <DetailItem label="Prevented Loss" value={data.prevented} />
          </div>
        </div>
      )}
    </Card>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function Interventions({ addToast }: InterventionsProps) {
  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: '"Barlow Condensed"', fontWeight: 800, fontSize: 32, color: C.text }}>
          Intervention Recommendations
        </h1>
        <p style={{ fontFamily: '"DM Sans"', fontSize: 14, color: C.textMuted, marginTop: 4 }}>
          AI-suggested interventions with ROI projections
        </p>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <SummaryStat label="Total Recommendations" value="4" color={C.orange} />
        <SummaryStat label="Customers Covered" value="85" color={C.text} />
        <SummaryStat label="Total Cost" value="₹15.5L" color={C.warning} />
        <SummaryStat label="Est. Prevented Loss" value="₹38.5L" color={C.safe} />
      </div>

      {/* Intervention Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {interventionCards.map((card, i) => (
          <InterventionCard key={i} data={card} delay={i * 0.08} addToast={addToast} />
        ))}
      </div>
    </div>
  )
}
