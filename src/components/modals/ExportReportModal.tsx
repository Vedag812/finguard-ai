'use client'

import React, { useState } from 'react'
import { C } from '@/lib/theme'
import { Button } from '@/components/ui'

interface ExportReportModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (format: string, sections: string[]) => void
}

export function ExportReportModal({ isOpen, onClose, onExport }: ExportReportModalProps) {
  const [format, setFormat] = useState('CSV')
  const [sections, setSections] = useState<string[]>(['alerts', 'interventions', 'signals'])

  const toggleSection = (section: string) => {
    setSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    )
  }

  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      if (format === 'CSV') {
        // Real export from Supabase
        const typeParam = sections.includes('interventions') && sections.includes('alerts') ? 'all'
          : sections.includes('interventions') ? 'interventions'
            : 'flagged'
        const res = await fetch(`/api/export?type=${typeParam}`)
        if (!res.ok) throw new Error('Export failed')
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `finguard-report-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
      } else {
        // For non-CSV formats, just call the parent handler
        onExport(format, sections)
      }
      onClose()
    } catch {
      // still call parent for non-critical error handling
      onExport(format, sections)
      onClose()
    } finally {
      setIsExporting(false)
    }
  }

  if (!isOpen) return null

  const sectionOptions = [
    { id: 'alerts', label: 'Risk Alerts Data', count: '100 records' },
    { id: 'interventions', label: 'Intervention Recommendations', count: '4 items' },
    { id: 'signals', label: 'Signal Intelligence', count: '7 signals' },
    { id: 'trends', label: 'Trend Analytics', count: '7 weeks' },
    { id: 'personas', label: 'Customer Personas', count: '5 segments' },
  ]

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.88)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 480,
          background: C.card,
          border: `1px solid ${C.orange}`,
          borderRadius: 16,
          padding: 28,
          boxShadow: '0 0 60px rgba(249,115,22,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24, color: C.orange }}>📊</span>
            <span style={{ fontFamily: '"Barlow Condensed"', fontWeight: 700, fontSize: 22, color: C.text }}>
              Export Report
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textMuted, fontSize: 20, cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {/* Format Selection */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontFamily: '"DM Sans"', fontSize: 12, color: C.textSub, marginBottom: 8 }}>
            Export Format
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            {['CSV', 'Excel', 'PDF', 'JSON'].map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: format === f ? `1px solid ${C.orange}` : `1px solid ${C.border}`,
                  background: format === f ? C.orangeGlow : 'transparent',
                  color: format === f ? C.orange : C.textSub,
                  fontFamily: '"DM Sans"',
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Section Selection */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontFamily: '"DM Sans"', fontSize: 12, color: C.textSub, marginBottom: 8 }}>
            Include Sections
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sectionOptions.map((s) => (
              <div
                key={s.id}
                onClick={() => toggleSection(s.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: sections.includes(s.id) ? C.orangeGlow : 'transparent',
                  border: `1px solid ${sections.includes(s.id) ? C.orange : C.border}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  border: `2px solid ${sections.includes(s.id) ? C.orange : C.border}`,
                  background: sections.includes(s.id) ? C.orange : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: C.text,
                  fontSize: 12,
                }}>
                  {sections.includes(s.id) ? '✓' : ''}
                </div>
                <span style={{ flex: 1, fontFamily: '"DM Sans"', fontSize: 13, color: sections.includes(s.id) ? C.text : C.textSub }}>
                  {s.label}
                </span>
                <span style={{ fontFamily: '"JetBrains Mono"', fontSize: 11, color: C.textMuted }}>
                  {s.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div style={{ background: '#0D0D0D', borderRadius: 8, padding: 12, marginBottom: 20 }}>
          <div style={{ fontFamily: '"DM Sans"', fontSize: 11, color: C.textMuted }}>
            Estimated file size: <span style={{ color: C.textSub }}>~245 KB</span>
          </div>
          <div style={{ fontFamily: '"DM Sans"', fontSize: 11, color: C.textMuted }}>
            Generated at: <span style={{ color: C.textSub }}>{new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
          </div>
          {format === 'CSV' && (
            <div style={{ fontFamily: '"DM Sans"', fontSize: 11, color: C.safe, marginTop: 4 }}>
              ✓ CSV will export real data from Firebase database
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={handleExport}
            disabled={isExporting}
            style={{
              flex: 1,
              background: isExporting ? C.border : C.orange,
              border: 'none',
              color: C.text,
              fontFamily: '"DM Sans"',
              fontWeight: 600,
              fontSize: 14,
              padding: '12px 20px',
              borderRadius: 8,
              cursor: isExporting ? 'not-allowed' : 'pointer',
              opacity: isExporting ? 0.6 : 1,
            }}
          >
            {isExporting ? '⟳ Generating...' : '↓ Export Report'}
          </button>
          <button
            onClick={onClose}
            disabled={isExporting}
            style={{
              background: 'transparent',
              border: `1px solid ${C.border}`,
              color: C.textSub,
              fontFamily: '"DM Sans"',
              fontSize: 14,
              padding: '12px 20px',
              borderRadius: 8,
              cursor: isExporting ? 'not-allowed' : 'pointer',
              opacity: isExporting ? 0.5 : 1,
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
