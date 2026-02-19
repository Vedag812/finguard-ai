'use client'

import React, { useState } from 'react'
import { C } from '@/lib/theme'
import { Card } from '@/components/ui'
import type { ToastType } from '@/types'

interface AINarrativeProps {
  addToast: (title: string, msg: string, type?: ToastType) => void
  onNavigate?: (page: string) => void
  onOpenExport?: () => void
}

export function AINarrative({ addToast, onNavigate, onOpenExport }: AINarrativeProps) {
  const [exportingInline, setExportingInline] = useState(false)

  const handleActOnITSegment = () => {
    if (onNavigate) {
      onNavigate('alerts')
      addToast('Navigated', 'Showing Risk Alerts — filter by IT Segment to review Bangalore cohort', 'info')
    } else {
      addToast('Act on IT Segment', 'Navigating to Risk Alerts for IT segment review', 'info')
    }
  }

  const handleViewOverleveraged = () => {
    if (onNavigate) {
      onNavigate('alerts')
      addToast('Navigated', 'Risk Alerts open — filter by Overleveraged persona to review 10 critical customers', 'info')
    } else {
      addToast('View Overleveraged', 'Opening overleveraged customer list', 'info')
    }
  }

  const handleExport = async () => {
    setExportingInline(true)
    try {
      const res = await fetch('/api/export?type=all')
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `finguard-narrative-export-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      addToast('Export Complete', 'Risk report downloaded successfully', 'success')
    } catch {
      // fallback to modal
      if (onOpenExport) onOpenExport()
      else addToast('Export', 'Opening export options...', 'info')
    } finally {
      setExportingInline(false)
    }
  }

  const chips = [
    { label: '⚡ Act on IT Segment', action: handleActOnITSegment },
    { label: '→ View Overleveraged', action: handleViewOverleveraged },
    { label: exportingInline ? '⟳ Exporting...' : '↓ Export Report', action: handleExport },
  ]

  return (
    <Card
      padding="lg"
      style={{
        background: 'linear-gradient(135deg, #101010 0%, #130800 100%)',
        borderLeftWidth: 4,
        borderLeftStyle: 'solid',
        borderLeftColor: C.orange,
        animation: 'fadeUp 0.4s ease 0.24s both',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🤖</span>
          <span style={{
            fontFamily: '"Barlow Condensed"',
            fontWeight: 700,
            fontSize: 18,
            color: C.orange,
          }}>
            AI Risk Narrative
          </span>
        </div>
        <span style={{
          fontFamily: '"JetBrains Mono"',
          fontSize: 11,
          color: C.textMuted,
        }}>
          Generated • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      <div style={{ height: 1, background: C.border, margin: '12px 0' }} />

      <div style={{
        fontFamily: '"DM Sans"',
        fontSize: 15,
        color: C.orangePale,
        lineHeight: 1.7,
        fontStyle: 'italic',
      }}>
        "Risk levels rose 18% this week, driven by Temporary Shock personas in Bangalore IT sector — 34 customers show salary delays of 8–12 days correlating with layoff announcements at 3 major tech employers. Buffer scores in this cohort collapsed from avg 2.1× to 1.3× in 14 days — critical intervention window is open now. Recommend pre-approving payment holidays for this segment immediately. Estimated cost: ₹4.8L in deferred interest versus ₹14L in projected write-offs. Intervention ROI: 2.9×. Secondary risk: Overleveraged cluster (10 customers) showing behavioral stress index &gt;80 — escalate to RM queue."
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        {chips.map((chip, i) => (
          <button
            key={i}
            onClick={chip.action}
            disabled={exportingInline && i === 2}
            style={{
              border: `1px solid ${C.orange}`,
              background: 'transparent',
              color: C.orange,
              padding: '6px 14px',
              borderRadius: 6,
              fontFamily: '"DM Sans"',
              fontSize: 13,
              cursor: (exportingInline && i === 2) ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
              opacity: (exportingInline && i === 2) ? 0.6 : 1,
            }}
            onMouseEnter={(e) => { if (!(exportingInline && i === 2)) e.currentTarget.style.background = C.orangeGlow }}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </Card>
  )
}
